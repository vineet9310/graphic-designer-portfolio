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
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        {/* Logo */}
        <div className="admin-login-logo">
          <span className="admin-login-logo-accent">V</span>ividForge.<span className="admin-login-logo-sub">DASH</span>
        </div>

        <h2 className="admin-login-h2">
          Welcome Back
        </h2>
        <p className="admin-login-p">
          Sign in to manage your portfolio and contact messages.
        </p>

        <form onSubmit={handleSubmit} className="admin-login-form">
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
            className="btn-primary admin-login-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
