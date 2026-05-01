import * as signalR from '@microsoft/signalr';
import { getStoredAuthToken } from './http';

let connection: signalR.HubConnection | null = null;

export const signalRService = {
  connect: async (hubUrl: string) => {
    if (connection && connection.state === signalR.HubConnectionState.Connected) {
      return connection;
    }

    const token = getStoredAuthToken();
    if (!token) {
      console.error('No auth token available for SignalR connection');
      return null;
    }

    try {
      connection = new signalR.HubConnectionBuilder()
        .withUrl(hubUrl, {
          accessTokenFactory: () => token,
          withCredentials: false,
          skipNegotiation: false,
        })
        .withAutomaticReconnect([0, 0, 1000, 3000, 5000, 10000])
        .configureLogging(signalR.LogLevel.Information)
        .build();

      await connection.start();
      console.log('SignalR connected successfully');
      return connection;
    } catch (error) {
      console.error('SignalR connection error:', error);
      return null;
    }
  },

  disconnect: async () => {
    if (connection) {
      try {
        await connection.stop();
        console.log('SignalR disconnected');
      } catch (error) {
        console.error('SignalR disconnection error:', error);
      }
      connection = null;
    }
  },

  onNotificationCreated: (callback: (notification: any) => void) => {
    if (connection) {
      connection.on('NotificationCreated', callback);
      connection.on('notificationcreated', callback);
    }
  },

  onNotificationRead: (callback: (notificationId: number) => void) => {
    if (connection) {
      connection.on('NotificationRead', callback);
    }
  },

  onNotificationDeleted: (callback: (notificationId: number) => void) => {
    if (connection) {
      connection.on('NotificationDeleted', callback);
    }
  },

  offNotificationCreated: () => {
    if (connection) {
      connection.off('NotificationCreated');
      connection.off('notificationcreated');
    }
  },

  offNotificationRead: () => {
    if (connection) {
      connection.off('NotificationRead');
    }
  },

  offNotificationDeleted: () => {
    if (connection) {
      connection.off('NotificationDeleted');
    }
  },

  getConnection: () => connection,
};
