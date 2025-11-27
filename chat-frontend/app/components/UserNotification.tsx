'use client';

import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function UserNotification() {
  const { user } = useAuth();
  const { setCurrentUser } = useNotifications();

  useEffect(() => {
    if (user?.username) {
      setCurrentUser(user.username);
    } else {
      setCurrentUser(null);
    }
  }, [user, setCurrentUser]);

  return null; // This component doesn't render anything
}

