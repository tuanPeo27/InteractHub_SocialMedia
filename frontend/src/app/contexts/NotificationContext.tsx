import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification } from '../types';
import { useAuth } from './AuthContext';
import { useUsers } from './UsersContext';
import { notificationsService } from '../services/notificationsService';
import { toFrontendNotification } from '../services/mappers';
import { signalRService } from '../services/signalRService';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (notificationId: string) => Promise<void>;
  deleteAllNotifications: () => Promise<number>;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { users, loading: usersLoading } = useUsers();

  const mergeNotificationsById = (incoming: Notification[]) => {
    const seen = new Set<string>();
    return incoming.filter((notification) => {
      if (seen.has(notification.id)) {
        return false;
      }

      seen.add(notification.id);
      return true;
    });
  };

  // Load notifications on mount
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) {
        setNotifications([]);
        return;
      }

      try {
        const apiNotifications = await notificationsService.getAll();
        
        const userLookup = new Map(users.map((item) => [item.id, item] as const));
        const convertedNotifications = apiNotifications.map((notification) => {
          return toFrontendNotification(notification, userLookup);
        });
        setNotifications(mergeNotificationsById(convertedNotifications));
      } catch (error) {
        console.error('Error loading notifications:', error);
        setNotifications([]);
      }
    };

    void loadNotifications();
  }, [user, users.length]);

  // Setup SignalR connection
  useEffect(() => {
    if (!user) {
      signalRService.disconnect();
      return;
    }

    const setupSignalR = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://26.248.122.134:5052';
      const hubUrl = `${apiUrl}/hubs/notifications`;

      const connection = await signalRService.connect(hubUrl);
      
      if (connection) {
        // Listen for new notifications
        signalRService.onNotificationCreated((notification) => {
          const userLookup = new Map(users.map((item) => [item.id, item] as const));
          const frontendNotification = toFrontendNotification(notification, userLookup);
          setNotifications((prev) => {
            const next = [frontendNotification, ...prev.filter((item) => item.id !== frontendNotification.id)];
            return mergeNotificationsById(next);
          });
        });

        // Listen for read notifications
        signalRService.onNotificationRead((notificationId) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === String(notificationId) ? { ...n, read: true } : n))
          );
        });

        // Listen for deleted notifications
        signalRService.onNotificationDeleted((notificationId) => {
          setNotifications((prev) => prev.filter((n) => n.id !== String(notificationId)));
        });
      } else {
        console.error('Failed to establish SignalR connection');
      }
    };

    void setupSignalR();

    return () => {
      signalRService.offNotificationCreated();
      signalRService.offNotificationRead();
      signalRService.offNotificationDeleted();
    };
  }, [user, users]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (notificationId: string) => {
    await notificationsService.markAsRead(notificationId);
    setNotifications(notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = async (notificationId: string) => {
    await notificationsService.delete(notificationId);
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId));
  };

  const deleteAllNotifications = async () => {
    const result = await notificationsService.deleteAll();
    setNotifications([]);
    return result.deletedCount;
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    await notificationsService.create({
      userId: notification.userId,
      content: notification.message,
      type: notification.type,
    });
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
        addNotification,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
