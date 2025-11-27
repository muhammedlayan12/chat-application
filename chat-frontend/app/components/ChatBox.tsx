'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { socket, notifyUserOnline } from '../services/socket';
import { fetchMessages } from '../services/messageAPI';
import { useNotifications } from '../context/NotificationContext';

interface ChatBoxProps {
  user: string;
  chatWith: string;
}

export default function ChatBox({ user, chatWith }: ChatBoxProps) {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { clearNotifications } = useNotifications();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, otherTyping]);

  useEffect(() => {
    if (!user || !chatWith) return;

    notifyUserOnline(user);

    const loadMessages = async () => {
      try {
        const data = await fetchMessages(user, chatWith);
        setMessages(data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
    clearNotifications(chatWith);

    const handleMessage = (msg: any) => {
      if ((msg.from === chatWith && msg.to === user) || (msg.from === user && msg.to === chatWith)) {
        setMessages(prev => [...prev, msg]);
        if (msg.from === chatWith) {
          clearNotifications(chatWith);
        }
      }
    };

    const handleTyping = (data: any) => {
      // Only show typing indicator if it's from the person we're chatting with
      if (data.from === chatWith && data.to === user) {
        setOtherTyping(data.isTyping);
      }
    };

    socket.on('receiveMessage', handleMessage);
    socket.on('userTyping', handleTyping);

    return () => {
      socket.off('receiveMessage', handleMessage);
      socket.off('userTyping', handleTyping);
    };
  }, [user, chatWith, clearNotifications]);

  // Handle typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setText(value);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing start
    if (value.trim().length > 0) {
      socket.emit('typing', { from: user, to: chatWith, isTyping: true });
      setIsTyping(true);
    } else {
      socket.emit('typing', { from: user, to: chatWith, isTyping: false });
      setIsTyping(false);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { from: user, to: chatWith, isTyping: false });
      setIsTyping(false);
    }, 2000);
  };

  const sendMessage = () => {
    if (!text.trim()) return;

    // Stop typing indicator
    socket.emit('typing', { from: user, to: chatWith, isTyping: false });
    setIsTyping(false);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    const msg = { from: user, to: chatWith, text: text.trim() };
    socket.emit('sendMessage', msg);
    setText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
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
          <div style={{ color: '#374151', fontSize: '18px', fontWeight: '600' }}>Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f3e8ff 100%)'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <button
          onClick={() => router.push('/dashboard')}
          style={{
            marginRight: '12px',
            padding: '8px',
            borderRadius: '8px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#6b7280' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{
            fontSize: window.innerWidth > 640 ? '24px' : '20px',
            fontWeight: 'bold',
            color: '#1f2937',
            margin: 0
          }}>
            {chatWith}
          </h2>
          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '4px 0 0 0',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            minHeight: '20px'
          }}>
            {otherTyping ? (
              <>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#10b981',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span>typing</span>
                  <span style={{ display: 'inline-flex', gap: '2px' }}>
                    <span style={{
                      display: 'inline-block',
                      width: '4px',
                      height: '4px',
                      background: '#6b7280',
                      borderRadius: '50%',
                      animation: 'typingDot 1.4s infinite',
                      animationDelay: '0s'
                    }}></span>
                    <span style={{
                      display: 'inline-block',
                      width: '4px',
                      height: '4px',
                      background: '#6b7280',
                      borderRadius: '50%',
                      animation: 'typingDot 1.4s infinite',
                      animationDelay: '0.2s'
                    }}></span>
                    <span style={{
                      display: 'inline-block',
                      width: '4px',
                      height: '4px',
                      background: '#6b7280',
                      borderRadius: '50%',
                      animation: 'typingDot 1.4s infinite',
                      animationDelay: '0.4s'
                    }}></span>
                  </span>
                </span>
              </>
            ) : (
              <>
                <span style={{
                  width: '8px',
                  height: '8px',
                  background: '#10b981',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></span>
                Active now
              </>
            )}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.length === 0 ? (
          <div style={{
            textAlign: 'center',
            paddingTop: '80px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
            <p style={{ fontSize: '20px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>No messages yet</p>
            <p style={{ fontSize: '16px', color: '#9ca3af' }}>Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map((m, idx) => {
              const isOwn = m.from === user;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: isOwn ? 'flex-end' : 'flex-start',
                    animation: 'fadeIn 0.3s ease-out'
                  }}
                >
                  <div style={{
                    maxWidth: window.innerWidth > 768 ? '70%' : '85%',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    ...(isOwn ? {
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: 'white',
                      borderBottomRightRadius: '4px'
                    } : {
                      background: 'white',
                      color: '#1f2937',
                      border: '1px solid #e5e7eb',
                      borderBottomLeftRadius: '4px'
                    })
                  }}>
                    {!isOwn && (
                      <div style={{
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '6px',
                        color: '#6b7280',
                        opacity: 0.8
                      }}>
                        {m.from}
                      </div>
                    )}
                    <div style={{
                      wordBreak: 'break-word',
                      fontSize: '15px',
                      lineHeight: '1.5',
                      marginBottom: '8px'
                    }}>
                      {m.text}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      ...(isOwn ? { color: 'rgba(255, 255, 255, 0.8)' } : { color: '#9ca3af' })
                    }}>
                      <span>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {isOwn && (
                        <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Typing Indicator */}
            {otherTyping && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-start',
                animation: 'fadeIn 0.3s ease-out'
              }}>
                <div style={{
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  borderBottomLeftRadius: '4px',
                  padding: '12px 16px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <div style={{
                    display: 'flex',
                    gap: '4px',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'typingDot 1.4s infinite',
                      animationDelay: '0s'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'typingDot 1.4s infinite',
                      animationDelay: '0.2s'
                    }}></div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      background: '#9ca3af',
                      borderRadius: '50%',
                      animation: 'typingDot 1.4s infinite',
                      animationDelay: '0.4s'
                    }}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '16px 20px',
        boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: '12px 16px',
              background: '#f9fafb',
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
          <button
            onClick={sendMessage}
            disabled={!text.trim()}
            style={{
              padding: '12px 24px',
              background: text.trim() ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#9ca3af',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: text.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              boxShadow: text.trim() ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (text.trim()) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (text.trim()) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }
            }}
          >
            <span>Send</span>
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes typingDot {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.7;
          }
          30% {
            transform: translateY(-10px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
