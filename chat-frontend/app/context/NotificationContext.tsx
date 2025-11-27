'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { socket } from '../services/socket';

interface NotificationContextType {
  unreadCounts: Record<string, number>;
  addNotification: (from: string, to: string) => void;
  clearNotifications: (username: string) => void;
  getUnreadCount: (username: string) => number;
  currentUser: string | null;
  setCurrentUser: (username: string | null) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Listen for new messages
    const handleNewMessage = (msg: any) => {
      // Only count messages sent TO the current user (not from them)
      if (currentUser && msg.to === currentUser && msg.from !== currentUser) {
        setUnreadCounts(prev => ({
          ...prev,
          [msg.from]: (prev[msg.from] || 0) + 1
        }));
      }
    };

    socket.on('receiveMessage', handleNewMessage);

    return () => {
      socket.off('receiveMessage', handleNewMessage);
    };
  }, [currentUser]);

  const addNotification = (from: string, to: string) => {
    if (from !== to) {
      setUnreadCounts(prev => ({
        ...prev,
        [from]: (prev[from] || 0) + 1
      }));
    }
  };

  const clearNotifications = (username: string) => {
    setUnreadCounts(prev => {
      const newCounts = { ...prev };
      delete newCounts[username];
      return newCounts;
    });
  };

  const getUnreadCount = (username: string) => {
    return unreadCounts[username] || 0;
  };

  return (
    <NotificationContext.Provider value={{ unreadCounts, addNotification, clearNotifications, getUnreadCount, currentUser, setCurrentUser }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

