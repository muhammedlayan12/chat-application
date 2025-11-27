'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { getUsers, getOnlineUsers } from '../services/authAPI';
import { socket, notifyUserOnline } from '../services/socket';

export default function Dashboard() {
  const { user } = useAuth();
  const { getUnreadCount } = useNotifications();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    loadUsers();
    loadOnlineUsers();
    
    if (user?.username) {
      notifyUserOnline(user.username);
    }

    socket.on('onlineUsers', (online: string[]) => {
      setOnlineUsers(online);
    });

    return () => {
      socket.off('onlineUsers');
    };
  }, [user]);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      const filtered = data
        .filter((u: any) => u.username !== user?.username)
        .map((u: any) => ({
          ...u,
          displayName: u.username || u.email.split('@')[0]
        }));
      setUsers(filtered);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOnlineUsers = async () => {
    try {
      const data = await getOnlineUsers();
      setOnlineUsers(data.onlineUsers || []);
    } catch (err) {
      console.error('Failed to load online users:', err);
    }
  };

  const handleStartChat = (username: string) => {
    router.push(`/chat/${encodeURIComponent(username)}`);
  };

  const filteredUsers = users.filter((u) =>
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f3e8ff 100%)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #3b82f6',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <div style={{ color: '#374151', fontSize: '18px', fontWeight: '600' }}>Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f3e8ff 100%)',
      padding: '24px 16px'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            flexDirection: window.innerWidth > 640 ? 'row' : 'column',
            alignItems: window.innerWidth > 640 ? 'center' : 'flex-start',
            justifyContent: 'space-between',
            gap: '16px'
          }}>
            <div>
              <h1 style={{
                fontSize: window.innerWidth > 640 ? '36px' : '28px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '8px',
                margin: 0
              }}>
                Welcome back, <span style={{ color: '#3b82f6' }}>{user?.username || user?.email?.split('@')[0]}</span>
              </h1>
              <p style={{ color: '#6b7280', fontSize: '16px', margin: 0 }}>Start chatting with your friends</p>
              {user?.isAdmin && (
                <button
                  onClick={() => router.push('/admin')}
                  style={{
                    marginTop: '16px',
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  👑 Admin Dashboard
                </button>
              )}
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: '#dbeafe',
              borderRadius: '12px',
              padding: '16px 20px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                background: '#10b981',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>{onlineUsers.length}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Online users</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: '24px', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              fontSize: '16px',
              outline: 'none',
              transition: 'all 0.2s',
              boxSizing: 'border-box',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#3b82f6';
              e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            }}
          />
          <svg 
            width="20" 
            height="20" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '64px 20px',
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid #e5e7eb'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>👥</div>
            <p style={{ color: '#6b7280', fontSize: '20px', fontWeight: '600', margin: 0 }}>No users found</p>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '8px', margin: '8px 0 0 0' }}>Try adjusting your search</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: window.innerWidth > 1280 ? 'repeat(4, 1fr)' : 
                                 window.innerWidth > 1024 ? 'repeat(3, 1fr)' :
                                 window.innerWidth > 640 ? 'repeat(2, 1fr)' : '1fr',
            gap: '16px'
          }}>
            {filteredUsers.map((u) => {
              const isOnline = onlineUsers.includes(u.username);
              const unreadCount = getUnreadCount(u.username);
              return (
                <button
                  key={u.email}
                  onClick={() => handleStartChat(u.displayName)}
                  style={{
                    position: 'relative',
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                    border: '2px solid #e5e7eb',
                    padding: '20px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.2)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Unread Badge */}
                  {unreadCount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: '#10b981',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.4)',
                      animation: 'pulse 2s infinite'
                    }}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '18px',
                      flexShrink: 0
                    }}>
                      {u.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 'bold',
                        color: '#1f2937',
                        fontSize: '18px',
                        marginBottom: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {u.displayName}
                        {unreadCount > 0 && (
                          <span style={{
                            width: '8px',
                            height: '8px',
                            background: '#10b981',
                            borderRadius: '50%',
                            animation: 'pulse 2s infinite'
                          }}></span>
                        )}
                      </div>
                      <div style={{
                        color: '#6b7280',
                        fontSize: '14px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {u.email}
                      </div>
                    </div>
                    {isOnline && (
                      <div style={{ flexShrink: 0 }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          background: '#10b981',
                          borderRadius: '50%',
                          animation: 'pulse 2s infinite',
                          boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)'
                        }}></div>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {u.isAdmin && (
                      <span style={{
                        padding: '4px 12px',
                        fontSize: '12px',
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        color: 'white',
                        borderRadius: '12px',
                        fontWeight: '600'
                      }}>
                        👑 Admin
                      </span>
                    )}
                    {isOnline ? (
                      <span style={{
                        padding: '4px 12px',
                        fontSize: '12px',
                        background: '#d1fae5',
                        color: '#065f46',
                        borderRadius: '12px',
                        fontWeight: '600'
                      }}>
                        Online
                      </span>
                    ) : (
                      <span style={{
                        padding: '4px 12px',
                        fontSize: '12px',
                        background: '#f3f4f6',
                        color: '#6b7280',
                        borderRadius: '12px',
                        fontWeight: '600'
                      }}>
                        Offline
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
