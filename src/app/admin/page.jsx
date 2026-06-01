"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAdmin } = useAuth();
  const router = useRouter();

  // If already logged in, redirect immediately to dashboard
  useEffect(() => {
    if (isAdmin) {
      router.replace('/admin/dashboard');
    }
  }, [isAdmin, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Authenticating...');

    const result = await login(email, password);

    if (result.success) {
      toast.success('Successfully logged in!', { id: toastId });
      router.replace('/admin/dashboard');
    } else {
      toast.error(result.message || 'Invalid email or password', { id: toastId });
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--bg-primary)',
        padding: '1.5rem'
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '3rem 2.5rem',
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          textAlign: 'center'
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '2rem'
          }}
        >
          <span style={{ color: 'var(--accent)' }}>A</span>LEX.<span style={{ fontSize: '0.85rem', fontWeight: 400, color: 'var(--text-secondary)', marginLeft: '4px' }}>ADMIN</span>
        </div>

        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
          Welcome Back
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '2.5rem', fontWeight: 300 }}>
          Sign in to manage your portfolio and contact messages.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Admin Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
              disabled={loading}
              placeholder="designer@example.com"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
              disabled={loading}
              placeholder="••••••••"
            />
          </div>

          {/* Login CTA */}
          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.9rem',
              marginTop: '0.5rem'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
