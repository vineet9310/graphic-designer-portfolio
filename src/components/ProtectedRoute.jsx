"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();
  const prevIsAdmin = useRef(isAdmin);

  useEffect(() => {
    if (!loading && !isAdmin) {
      const justLoggedOut = typeof window !== 'undefined' && sessionStorage.getItem('justLoggedOut') === 'true';
      if (justLoggedOut) {
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('justLoggedOut');
        }
        router.push('/');
      } else if (prevIsAdmin.current === true) {
        router.push('/');
      } else {
        router.push('/admin');
      }
    }
    prevIsAdmin.current = isAdmin;
  }, [isAdmin, loading, router]);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}>
        <div className="skeleton" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return children;
};

export default ProtectedRoute;
