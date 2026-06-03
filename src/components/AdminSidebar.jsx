"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { FaChartLine, FaFolderOpen, FaEnvelopeOpenText, FaSignOutAlt, FaSlidersH, FaNewspaper } from 'react-icons/fa';

const AdminSidebar = () => {
  const { logout, adminEmail } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('justLoggedOut', 'true');
      }
      logout();
      router.push('/');
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <FaChartLine /> },
    { name: 'Projects', path: '/admin/projects', icon: <FaFolderOpen /> },
    { name: 'Blogs', path: '/admin/blogs', icon: <FaNewspaper /> },
    { name: 'Messages', path: '/admin/messages', icon: <FaEnvelopeOpenText /> },
    { name: 'Site Settings', path: '/admin/settings', icon: <FaSlidersH /> }
  ];

  return (
    <aside className="admin-sidebar">
      {/* Header / Logo */}
      <div className="admin-sidebar-header">
        <Link href="/" className="admin-sidebar-logo">
          <span className="admin-sidebar-logo-accent">V</span>ividForge.<span className="admin-sidebar-logo-sub">DASH</span>
        </Link>
        <div className="admin-sidebar-email">
          {adminEmail}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="admin-sidebar-nav">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`admin-sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="admin-sidebar-link-icon">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="admin-sidebar-footer">
        <button
          onClick={handleLogout}
          className="admin-sidebar-logout-btn"
        >
          <span className="admin-sidebar-link-icon"><FaSignOutAlt /></span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
