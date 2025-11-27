'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { getUsers, deleteUser, makeAdmin, removeAdmin, getStats, getOnlineUsers } from '../services/authAPI';
import { socket } from '../services/socket';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'activity' | 'settings'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    if (!user.isAdmin) {
      router.push('/dashboard');
      return;
    }
    
    loadData();
    
    socket.on('onlineUsers', (online: string[]) => {
      setOnlineUsers(online);
    });

    socket.on('chatActivity', () => {
      loadStats();
    });

    const interval = setInterval(loadStats, 10000);

    return () => {
      socket.off('onlineUsers');
      socket.off('chatActivity');
      clearInterval(interval);
    };
  }, [user]);

  const loadData = async () => {
    await Promise.all([loadUsers(), loadStats(), loadOnlineUsers()]);
    setLoading(false);
  };

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.map((u: any) => ({
        ...u,
        displayName: u.username || u.email.split('@')[0]
      })));
    } catch (err) {
      setError('Failed to load users');
    }
  };

  const loadStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
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

  const handleDelete = async (email: string) => {
    if (email === 'admin12@gmail.com') {
      setError('Cannot delete default admin account');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete ${email}?`)) return;
    
    try {
      await deleteUser(email);
      setUsers(users.filter(u => u.email !== email));
      setSuccess('User deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
      loadStats();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleMakeAdmin = async (email: string) => {
    try {
      await makeAdmin(email);
      setUsers(users.map(u => u.email === email ? { ...u, isAdmin: true } : u));
      setSuccess('User promoted to admin');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to make user admin');
    }
  };

  const handleRemoveAdmin = async (email: string) => {
    if (email === 'admin12@gmail.com') {
      setError('Cannot remove admin role from default admin account');
      return;
    }
    
    if (!confirm(`Remove admin role from ${email}?`)) return;
    
    try {
      await removeAdmin(email);
      setUsers(users.map(u => u.email === email ? { ...u, isAdmin: false } : u));
      setSuccess('Admin role removed');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove admin role');
    }
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
          <div style={{ color: '#374151', fontSize: '18px', fontWeight: '600' }}>Loading admin dashboard...</div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <div style={{ fontSize: '40px' }}>👑</div>
                <div>
                  <h1 style={{
                    fontSize: window.innerWidth > 640 ? '36px' : '28px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    Admin Control Center
                  </h1>
                  <p style={{ color: '#6b7280', fontSize: '16px', margin: '4px 0 0 0' }}>
                    Full system management and monitoring
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '10px 20px',
                background: '#f3f4f6',
                color: '#374151',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#e5e7eb'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f3f4f6'}
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fee2e2',
            border: '2px solid #fca5a5',
            color: '#991b1b',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>{error}</span>
          </div>
        )}

        {success && (
          <div style={{
            background: '#d1fae5',
            border: '2px solid #86efac',
            color: '#065f46',
            padding: '12px 16px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>{success}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth > 1280 ? 'repeat(4, 1fr)' : 
                               window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
          gap: '16px',
          marginBottom: '24px'
        }}>
          {[
            { icon: '👥', label: 'Total Users', value: stats?.totalUsers || 0, color: '#3b82f6' },
            { icon: '🟢', label: 'Online Now', value: onlineUsers.length, color: '#10b981' },
            { icon: '💬', label: 'Total Messages', value: stats?.totalMessages || 0, color: '#9333ea' },
            { icon: '👑', label: 'Admins', value: users.filter(u => u.isAdmin).length, color: '#f59e0b' }
          ].map((stat, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
                padding: '24px',
                border: '1px solid #e5e7eb',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontSize: '32px' }}>{stat.icon}</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1f2937' }}>{stat.value}</div>
              </div>
              <div style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          padding: '32px',
          border: '1px solid #e5e7eb'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '24px',
            borderBottom: '2px solid #e5e7eb',
            paddingBottom: '16px'
          }}>
            {[
              { id: 'users', label: '👥 User Management' },
              { id: 'activity', label: '📊 Activity Monitor' },
              { id: 'settings', label: '⚙️ System Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '10px 20px',
                  background: activeTab === tab.id ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#f3f4f6',
                  color: activeTab === tab.id ? 'white' : '#374151',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: activeTab === tab.id ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = '#e5e7eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.currentTarget.style.background = '#f3f4f6';
                  }
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: '16px',
                  margin: '0 0 16px 0'
                }}>
                  All Users ({users.length})
                </h2>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    maxWidth: '400px',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'all 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              
              {filteredUsers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
                  <p style={{ color: '#6b7280', fontSize: '18px', fontWeight: '600', margin: 0 }}>No users found</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: '#f9fafb' }}>
                        {['User', 'Email', 'Status', 'Role', 'Actions'].map((header) => (
                          <th
                            key={header}
                            style={{
                              padding: '12px 16px',
                              textAlign: 'left',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#374151',
                              textTransform: 'uppercase',
                              borderBottom: '2px solid #e5e7eb'
                            }}
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => {
                        const isOnline = onlineUsers.includes(u.username);
                        const isDefaultAdmin = u.email === 'admin12@gmail.com';
                        return (
                          <tr
                            key={u.email}
                            style={{
                              borderBottom: '1px solid #e5e7eb',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                          >
                            <td style={{ padding: '16px' }}>
                              <div style={{ fontWeight: '600', color: '#1f2937' }}>{u.displayName}</div>
                            </td>
                            <td style={{ padding: '16px', color: '#6b7280', fontSize: '14px' }}>{u.email}</td>
                            <td style={{ padding: '16px' }}>
                              {isOnline ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{
                                    width: '12px',
                                    height: '12px',
                                    background: '#10b981',
                                    borderRadius: '50%',
                                    animation: 'pulse 2s infinite'
                                  }}></span>
                                  <span style={{ color: '#065f46', fontWeight: '600', fontSize: '14px' }}>Online</span>
                                </span>
                              ) : (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{
                                    width: '12px',
                                    height: '12px',
                                    background: '#d1d5db',
                                    borderRadius: '50%'
                                  }}></span>
                                  <span style={{ color: '#6b7280', fontSize: '14px' }}>Offline</span>
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '16px' }}>
                              {u.isAdmin ? (
                                <span style={{
                                  padding: '6px 12px',
                                  background: '#fef3c7',
                                  color: '#92400e',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}>
                                  👑 Admin
                                </span>
                              ) : (
                                <span style={{
                                  padding: '6px 12px',
                                  background: '#f3f4f6',
                                  color: '#374151',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                  fontWeight: '600'
                                }}>
                                  User
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '16px' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {u.isAdmin && !isDefaultAdmin && (
                                  <button
                                    onClick={() => handleRemoveAdmin(u.email)}
                                    style={{
                                      padding: '6px 12px',
                                      background: '#f97316',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '8px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#ea580c'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#f97316'}
                                  >
                                    Remove Admin
                                  </button>
                                )}
                                {!u.isAdmin && (
                                  <button
                                    onClick={() => handleMakeAdmin(u.email)}
                                    style={{
                                      padding: '6px 12px',
                                      background: '#9333ea',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '8px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#7e22ce'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#9333ea'}
                                  >
                                    Make Admin
                                  </button>
                                )}
                                {!isDefaultAdmin && (
                                  <button
                                    onClick={() => handleDelete(u.email)}
                                    style={{
                                      padding: '6px 12px',
                                      background: '#ef4444',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '8px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = '#dc2626'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = '#ef4444'}
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px',
                margin: '0 0 24px 0'
              }}>
                Recent Activity
              </h2>
              
              {stats?.recentActivity && stats.recentActivity.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {stats.recentActivity.map((activity: any, idx: number) => (
                    <div
                      key={idx}
                      style={{
                        background: '#f9fafb',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid #e5e7eb',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f3f4f6';
                        e.currentTarget.style.transform = 'translateX(4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f9fafb';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: '24px' }}>💬</div>
                          <div>
                            <span style={{ fontWeight: '600', color: '#1f2937' }}>{activity.from}</span>
                            <span style={{ color: '#6b7280', margin: '0 8px' }}>→</span>
                            <span style={{ fontWeight: '600', color: '#1f2937' }}>{activity.to}</span>
                          </div>
                        </div>
                        <span style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          background: 'white',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          fontWeight: '600'
                        }}>
                          {new Date(activity.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📊</div>
                  <p style={{ color: '#6b7280', fontSize: '18px', fontWeight: '600', margin: 0 }}>No recent activity</p>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '24px',
                margin: '0 0 24px 0'
              }}>
                System Settings
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth > 768 ? 'repeat(2, 1fr)' : '1fr',
                gap: '24px'
              }}>
                <div style={{
                  background: '#f9fafb',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '16px',
                    margin: '0 0 16px 0'
                  }}>
                    Default Admin Account
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#374151' }}>
                    <p style={{ margin: 0 }}>
                      <strong>Email:</strong> admin12@gmail.com
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Password:</strong> admin123
                    </p>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '16px', margin: '16px 0 0 0' }}>
                      This account cannot be deleted or have admin role removed.
                    </p>
                  </div>
                </div>
                <div style={{
                  background: '#f9fafb',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #e5e7eb'
                }}>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    marginBottom: '16px',
                    margin: '0 0 16px 0'
                  }}>
                    System Info
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#374151' }}>
                    <p style={{ margin: 0 }}>
                      <strong>Backend:</strong> Running on port 5000
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Frontend:</strong> Running on port 3000
                    </p>
                    <p style={{ margin: 0 }}>
                      <strong>Database:</strong> MongoDB Atlas
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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
