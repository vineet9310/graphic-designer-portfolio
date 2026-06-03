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
    { title: 'Total Projects', value: stats.totalProjects, icon: <FaFolderOpen />, isText: false },
    { title: 'Featured Projects', value: stats.featuredProjects, icon: <FaStar />, isText: false },
    { title: 'Unread Messages', value: stats.unreadMessages, icon: <FaEnvelopeOpenText />, isText: false },
    { title: 'Last Upload', value: stats.lastUploadDate, icon: <FaCalendarAlt />, isText: true }
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
        <div className="dashboard-stats-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="card admin-loading-card">
              <div className="skeleton admin-loading-skeleton" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Cards Grid */}
          <div className="dashboard-stats-grid">
            {statCards.map((card, i) => (
              <div key={i} className="dashboard-stat-card">
                <div className="dashboard-stat-header">
                  <span className="dashboard-stat-title">
                    {card.title}
                  </span>
                  <span className={card.isText ? 'dashboard-stat-icon-secondary' : 'dashboard-stat-icon'}>
                    {card.icon}
                  </span>
                </div>
                <div className={card.isText ? 'dashboard-stat-value-text' : 'dashboard-stat-value'}>
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
                      className={`dashboard-message-card ${!msg.isRead ? 'unread' : ''}`}
                    >
                      <div className="dashboard-message-header">
                        <span className="dashboard-message-sender">{msg.name}</span>
                        <span className="dashboard-message-date">
                          {new Date(msg.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="dashboard-message-subject">
                        Subject: {msg.subject || 'General Inquiry'}
                      </div>
                      <p className="dashboard-message-body">
                        {msg.message}
                      </p>
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
              <div className="dashboard-actions-card">
                <Link
                  href="/admin/projects"
                  className="btn-primary dashboard-action-btn-w-full"
                >
                  Upload New Project
                </Link>
                <Link
                  href="/admin/messages"
                  className="btn-outline dashboard-action-btn-w-full"
                >
                  Review Inbox
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
