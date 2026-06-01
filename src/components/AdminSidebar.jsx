"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { FaChartLine, FaFolderOpen, FaEnvelopeOpenText, FaSignOutAlt } from 'react-icons/fa';

const AdminSidebar = () => {
  const { logout, adminEmail } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      router.push('/admin');
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaChartLine /> },
    { name: 'Projects', path: '/admin/projects', icon: <FaFolderOpen /> },
    { name: 'Messages', path: '/admin/messages', icon: <FaEnvelopeOpenText /> }
  ];

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0
      }}
      className="admin-sidebar"
    >
      {/* Header / Logo */}
      <div
        style={{
          padding: '2rem 1.5rem',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.4rem',
            fontWeight: 800,
            color: '#ffffff'
          }}
        >
          <span style={{ color: 'var(--accent)' }}>A</span>LEX.<span style={{ fontSize: '0.75rem', fontWeight: 400, color: 'var(--text-secondary)' }}>DASH</span>
        </Link>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {adminEmail}
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '2rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'rgba(230, 57, 70, 0.08)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                padding: '0.8rem 1rem',
                borderRadius: '0 4px 4px 0',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.95rem',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
            background: 'none',
            border: 'none',
            color: 'var(--accent)',
            padding: '0.8rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.95rem',
            textAlign: 'left',
            transition: 'background-color 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(230, 57, 70, 0.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <span style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}><FaSignOutAlt /></span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
