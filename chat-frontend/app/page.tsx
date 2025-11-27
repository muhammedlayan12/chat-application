'use client';

import Link from 'next/link';
import { useAuth } from './context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const [windowWidth, setWindowWidth] = useState(0);

  // Update windowWidth on client and on resize
  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Redirect to dashboard if logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 50%, #f3e8ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}
    >
      <div style={{ maxWidth: '1200px', width: '100%', textAlign: 'center' }}>
        <header style={{ marginBottom: '60px' }}>
          <div style={{ fontSize: '80px', marginBottom: '24px' }}>💬</div>
          <h1
            style={{
              fontSize: windowWidth > 640 ? '64px' : '48px',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '16px',
              margin: 0
            }}
          >
            Chat App
          </h1>
          <p
            style={{
              fontSize: windowWidth > 640 ? '24px' : '20px',
              color: '#374151',
              maxWidth: '600px',
              margin: '0 auto 8px',
              lineHeight: '1.5'
            }}
          >
            Connect with your friends in real-time
          </p>
          <p
            style={{
              fontSize: '18px',
              color: '#6b7280',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: '1.5'
            }}
          >
            Secure, fast, and amazing messaging experience
          </p>
        </header>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: windowWidth > 768 ? 'repeat(3, 1fr)' : '1fr',
            gap: '24px',
            maxWidth: '1000px',
            margin: '0 auto 48px'
          }}
        >
          {[
            { icon: '⚡', title: 'Real-time', desc: 'Instant messaging powered by Socket.IO' },
            { icon: '🔒', title: 'Secure', desc: 'Encrypted passwords and safe authentication' },
            { icon: '👥', title: 'Social', desc: 'Chat with multiple users easily' }
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                background: 'white',
                padding: '32px',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1f2937',
                  margin: '0 0 12px 0'
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: '#6b7280', margin: 0, lineHeight: '1.6' }}>{feature.desc}</p>
            </div>
          ))}
        </section>

        <div
          style={{
            display: 'flex',
            flexDirection: windowWidth > 640 ? 'row' : 'column',
            gap: '16px',
            justifyContent: 'center'
          }}
        >
          <Link
            href="/login"
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.2s',
              boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.4)';
            }}
          >
            Login
          </Link>
          <Link
            href="/register"
            style={{
              padding: '16px 32px',
              background: 'white',
              border: '2px solid #e5e7eb',
              color: '#374151',
              borderRadius: '12px',
              fontSize: '18px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = '#f9fafb';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.05)';
            }}
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}



