import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification } from '../types';
import { useAuth } from './AuthContext';
import { useUsers } from './UsersContext';
import { notificationsService } from '../services/notificationsService';
import { toFrontendNotification } from '../services/mappers';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { users, loading: usersLoading } = useUsers();

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user || usersLoading) {
        setNotifications([]);
        return;
      }

      try {
        const apiNotifications = await notificationsService.getAll();
        const userLookup = new Map(users.map((item) => [item.id, item] as const));
        setNotifications(apiNotifications.map((notification) => toFrontendNotification(notification, userLookup)));
      } catch {
        setNotifications([]);
      }
    };

    void loadNotifications();
  }, [user, usersLoading, users.length]);

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

  const addNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `n${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    await notificationsService.create({
      userId: notification.userId,
      content: notification.message,
      type: notification.type,
    });

    setNotifications([newNotification, ...notifications]);
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
