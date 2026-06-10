"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import { FaFolderOpen, FaStar, FaEnvelopeOpenText, FaCalendarAlt, FaBookOpen } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    totalBlogs: 0,
    unreadMessages: 0,
    lastUploadDate: 'No uploads yet'
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch projects
        const projectsRes = await api('/projects');
        // Fetch messages
        const messagesRes = await api('/contact');
        // Fetch blogs
        const blogsRes = await api('/blogs');

        if (projectsRes.success && messagesRes.success) {
          const projects = projectsRes.data;
          const messages = messagesRes.data;
          const blogs = blogsRes.success && blogsRes.data ? blogsRes.data : [];

          const totalProjects = projects.length;
          const featuredProjects = projects.filter(p => p.featured).length;
          const totalBlogs = blogs.length;
          const unreadMessages = messages.filter(m => !m.isRead).length;
          
          let lastUploadDate = 'No uploads yet';
          let latestDate = null;

          if (projects.length > 0) {
            const latestProject = projects.reduce((latest, current) => {
              return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
            });
            latestDate = new Date(latestProject.createdAt);
          }

          if (blogs.length > 0) {
            const latestBlog = blogs.reduce((latest, current) => {
              return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
            });
            const blogDate = new Date(latestBlog.createdAt);
            if (!latestDate || blogDate > latestDate) {
              latestDate = blogDate;
            }
          }

          if (latestDate) {
            lastUploadDate = latestDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          }

          setStats({
            totalProjects,
            featuredProjects,
            totalBlogs,
            unreadMessages,
            lastUploadDate
          });

          // Set 3 most recent messages
          setRecentMessages(messages.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const statCards = [
    { title: 'Total Projects', value: stats.totalProjects, icon: <FaFolderOpen />, color: '#7c3aed' },
    { title: 'Featured Works', value: stats.featuredProjects, icon: <FaStar />, color: '#f59e0b' },
    { title: 'Blog Posts', value: stats.totalBlogs, icon: <FaBookOpen />, color: '#10b981' },
    { title: 'Unread Messages', value: stats.unreadMessages, icon: <FaEnvelopeOpenText />, color: '#ef4444' },
    { title: 'Last Activity', value: stats.lastUploadDate, icon: <FaCalendarAlt />, color: '#3b82f6', isText: true }
  ];

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-h1">
          Dashboard Overview
        </h1>
        <p className="dashboard-subtitle">
          Quick analytics, upload stats, and recent messages list.
        </p>
      </div>

      {loading ? (
        <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="card admin-loading-card" style={{ minHeight: '120px' }}>
              <div className="skeleton admin-loading-skeleton" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Cards Grid */}
          <div className="dashboard-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
            {statCards.map((card, i) => (
              <div key={i} className="dashboard-stat-card" style={{
                position: 'relative',
                padding: '1.5rem',
                borderRadius: '12px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                boxShadow: '0 4px 24px -6px rgba(0, 0, 0, 0.2)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: '120px',
                overflow: 'hidden'
              }}>
                {/* Glowing accent background blob */}
                <div style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '-20px',
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${card.color}15 0%, transparent 70%)`,
                  pointerEvents: 'none'
                }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {card.title}
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    backgroundColor: `${card.color}15`,
                    color: card.color,
                    fontSize: '1.1rem'
                  }}>
                    {card.icon}
                  </span>
                </div>

                <div style={{
                  fontSize: card.isText ? '1.15rem' : '2.25rem',
                  fontWeight: '800',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading)',
                  marginTop: '0.5rem',
                  lineHeight: 1
                }}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Split layout: Recent Messages snippet */}
          <div className="dashboard-split-layout">
            {/* Recent Messages */}
            <div>
              <h2 className="dashboard-column-title">
                Recent Messages
              </h2>
              
              <div className="dashboard-messages-list">
                {recentMessages.length === 0 ? (
                  <div className="dashboard-message-card-empty">
                    No messages received yet.
                  </div>
                ) : (
                  recentMessages.map((msg) => (
                    <div
                      key={msg._id}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '1.25rem',
                        borderRadius: '12px',
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        borderLeft: msg.isRead ? '1px solid var(--border)' : '4px solid var(--accent)',
                        position: 'relative',
                        transition: 'all 0.2s',
                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.05)'
                      }}
                    >
                      {/* Initials Avatar */}
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: msg.isRead ? 'rgba(255, 255, 255, 0.05)' : 'rgba(124, 58, 237, 0.15)',
                        color: msg.isRead ? 'var(--text-secondary)' : 'var(--accent)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                        flexShrink: 0
                      }}>
                        {getInitials(msg.name)}
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{msg.name}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {new Date(msg.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '500', marginBottom: '0.35rem' }}>
                          Subject: {msg.subject || 'General Inquiry'}
                        </div>
                        <p style={{
                          color: 'var(--text-secondary)',
                          fontSize: '0.8rem',
                          margin: 0,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div>
              <h2 className="dashboard-column-title">
                Quick Actions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {[
                  {
                    href: '/admin/projects',
                    label: 'Upload New Project',
                    desc: 'Add a new piece to your design portfolio',
                    icon: <FaFolderOpen />,
                    color: '#7c3aed'
                  },
                  {
                    href: '/admin/blogs',
                    label: 'Write Blog Post',
                    desc: 'Share your latest thoughts and news',
                    icon: <FaBookOpen />,
                    color: '#10b981'
                  },
                  {
                    href: '/admin/messages',
                    label: 'Review Inbox',
                    desc: 'Read and reply to your client messages',
                    icon: <FaEnvelopeOpenText />,
                    color: '#ef4444'
                  },
                  {
                    href: '/admin/settings',
                    label: 'Update Settings',
                    desc: 'Manage biography, skills, and links',
                    icon: <FaCalendarAlt />,
                    color: '#3b82f6'
                  }
                ].map((act, i) => (
                  <Link
                    key={i}
                    href={act.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '1.15rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease-in-out',
                      cursor: 'pointer'
                    }}
                    className="admin-dashboard-action-tile"
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      backgroundColor: `${act.color}15`,
                      color: act.color,
                      fontSize: '1.1rem',
                      flexShrink: 0
                    }}>
                      {act.icon}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {act.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {act.desc}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
