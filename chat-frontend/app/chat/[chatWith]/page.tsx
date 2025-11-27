'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ChatBox from '../../components/ChatBox';

export default function ChatPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();

  const chatWith = decodeURIComponent(params.chatWith as string);

  useEffect(() => {
    if (!user && typeof window !== 'undefined') {
      router.push('/login');
    }
  }, [user, router]);

  // If user is not logged in, show loading
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f3e8ff 100%)'
      }}>
        <div style={{
          fontSize: '18px',
          color: '#374151',
          fontWeight: '600'
        }}>
          Redirecting to login...
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh' }}>
      <ChatBox user={user.username} chatWith={chatWith} />
    </div>
  );
}
