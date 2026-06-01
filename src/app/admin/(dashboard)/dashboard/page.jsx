"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import { FaFolderOpen, FaStar, FaEnvelopeOpenText, FaCalendarAlt } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    unreadMessages: 0,
    lastUploadDate: 'No projects yet'
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

        if (projectsRes.success && messagesRes.success) {
          const projects = projectsRes.data;
          const messages = messagesRes.data;

          const totalProjects = projects.length;
          const featuredProjects = projects.filter(p => p.featured).length;
          const unreadMessages = messages.filter(m => !m.isRead).length;
          
          let lastUploadDate = 'No projects yet';
          if (projects.length > 0) {
            const latestProject = projects.reduce((latest, current) => {
              return new Date(current.createdAt) > new Date(latest.createdAt) ? current : latest;
            });
            lastUploadDate = new Date(latestProject.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            });
          }

          setStats({
            totalProjects,
            featuredProjects,
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

  const statCards = [
    { title: 'Total Projects', value: stats.totalProjects, icon: <FaFolderOpen />, color: 'var(--accent)' },
    { title: 'Featured Projects', value: stats.featuredProjects, icon: <FaStar />, color: 'var(--accent)' },
    { title: 'Unread Messages', value: stats.unreadMessages, icon: <FaEnvelopeOpenText />, color: 'var(--accent)' },
    { title: 'Last Upload', value: stats.lastUploadDate, icon: <FaCalendarAlt />, color: 'var(--text-secondary)' }
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
          Dashboard Overview
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Quick analytics, upload stats, and recent messages list.
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="card" style={{ height: '140px' }}>
              <div className="skeleton" style={{ height: '100%', width: '100%' }} />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
              marginBottom: '4rem'
            }}
          >
            {statCards.map((card, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: '1.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '130px',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {card.title}
                  </span>
                  <span style={{ fontSize: '1.25rem', color: card.color }}>{card.icon}</span>
                </div>
                <div style={{ fontSize: card.title === 'Last Upload' ? '1.25rem' : '2.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
                  {card.value}
                </div>
              </div>
            ))}
          </div>

          {/* Split layout: Recent Messages snippet */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }} className="dashboard-split">
            {/* Recent Messages */}
            <div>
              <h2 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>
                Recent Messages
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {recentMessages.length === 0 ? (
                  <div className="card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No messages received yet.
                  </div>
                ) : (
                  recentMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className="card"
                      style={{
                        padding: '1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        position: 'relative',
                        borderLeft: !msg.isRead ? '3px solid var(--accent)' : '1px solid var(--border)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{msg.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 500 }}>
                        Subject: {msg.subject || 'General Inquiry'}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {msg.message}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div>
              <h2 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>
                Quick Actions
              </h2>
              <div className="card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link
                  href="/admin/projects"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Upload New Project
                </Link>
                <Link
                  href="/admin/messages"
                  className="btn-outline"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Review Inbox
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 850px) {
          .dashboard-split {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
