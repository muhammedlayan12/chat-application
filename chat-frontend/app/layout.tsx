import './globals.css';
import { ReactNode } from 'react';
import Navbar from './components/Navbar';
import UserNotification from './components/UserNotification';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

export const metadata = {
  title: 'Chat App',
  description: 'Real-time Chat Application',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          <AuthProvider>
            <UserNotification />
            <Navbar />
            {children}
          </AuthProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
