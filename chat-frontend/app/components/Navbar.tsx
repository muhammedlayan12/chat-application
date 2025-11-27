'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { unreadCounts } = useNotifications();
  const router = useRouter();
  
  const totalUnread = Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav style={{
      background: 'white',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderBottom: '1px solid #e5e7eb'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '70px'
      }}>
        <Link 
          href={user ? '/dashboard' : '/'} 
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'color 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#1f2937'}
        >
          <span style={{ fontSize: '28px' }}>💬</span>
          <span>Chat App</span>
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <>
              <Link
                href="/dashboard"
                style={{
                  position: 'relative',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  transition: 'background 0.2s',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#4b5563' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {totalUnread > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    background: '#ef4444',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {totalUnread > 9 ? '9+' : totalUnread}
                  </span>
                )}
              </Link>
              
              <div style={{
                display: window.innerWidth > 640 ? 'flex' : 'none',
                alignItems: 'center',
                gap: '12px',
                padding: '8px 12px',
                background: '#f9fafb',
                borderRadius: '8px'
              }}>
                <span style={{ fontSize: '14px', color: '#374151', fontWeight: '600' }}>
                  Hello, <span style={{ color: '#3b82f6' }}>{user.username}</span>
                </span>
                {user.isAdmin && (
                  <span style={{
                    padding: '4px 10px',
                    fontSize: '12px',
                    background: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '12px',
                    fontWeight: '600'
                  }}>
                    👑 Admin
                  </span>
                )}
              </div>
              
              {user.isAdmin && (
                <Link
                  href="/admin"
                  style={{
                    padding: '8px 16px',
                    background: '#9333ea',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#7e22ce'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#9333ea'}
                >
                  Admin
                </Link>
              )}
              
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  padding: '8px 16px',
                  color: '#374151',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Login
              </Link>
              <Link
                href="/register"
                style={{
                  padding: '8px 16px',
                  background: '#3b82f6',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#3b82f6'}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
