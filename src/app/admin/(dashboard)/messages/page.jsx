"use client";

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { toast } from 'react-hot-toast';
import { FaCheckCircle } from 'react-icons/fa';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMessageId, setExpandedMessageId] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api('/contact');
      if (response.success) {
        setMessages(response.data);
      }
    } catch (error) {
      console.error('Error loading messages:', error.message);
      toast.error('Failed to load inbox messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation(); // Avoid triggering details toggle
    const toastId = toast.loading('Updating message status...');
    try {
      const response = await api(`/contact/${id}/read`, {
        method: 'PUT'
      });
      if (response.success) {
        toast.success('Message marked as read', { id: toastId });
        setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
      }
    } catch (error) {
      toast.error('Failed to update message status', { id: toastId });
    }
  };

  const toggleExpand = async (id, currentIsRead) => {
    if (expandedMessageId === id) {
      setExpandedMessageId(null);
    } else {
      setExpandedMessageId(id);
      
      // Auto mark as read when expanded if not already read
      if (!currentIsRead) {
        try {
          const response = await api(`/contact/${id}/read`, {
            method: 'PUT'
          });
          if (response.success) {
            setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: true } : m));
          }
        } catch (e) {
          console.error('Failed to auto mark read:', e.message);
        }
      }
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Header */}
      <div className="messages-header">
        <div>
          <h1 className="messages-h1">
            Contact Messages
          </h1>
          <p className="messages-subtitle">
            View and manage submissions sent via your public contact form.
          </p>
        </div>
        <button 
          onClick={fetchMessages}
          className="btn-outline messages-refresh-btn"
        >
          Refresh Inbox
        </button>
      </div>

      {loading ? (
        <div className="messages-list">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card admin-loading-card">
              <div className="skeleton admin-loading-skeleton" />
            </div>
          ))}
        </div>
      ) : (
        <div className="messages-list">
          {messages.length === 0 ? (
            <div className="messages-card-empty">
              No messages received yet. Your inbox is clean!
            </div>
          ) : (
            messages.map((msg) => {
              const isExpanded = expandedMessageId === msg._id;
              return (
                <div
                  key={msg._id}
                  className={`message-item-card ${!msg.isRead ? 'unread' : ''} ${isExpanded ? 'expanded' : ''}`}
                  onClick={() => toggleExpand(msg._id, msg.isRead)}
                >
                  {/* Header Summary Row */}
                  <div className="message-item-summary-row">
                    <div className="message-item-sender-box">
                      {/* Red Dot Indicator */}
                      {!msg.isRead ? (
                        <span className="message-item-unread-dot" title="Unread message" />
                      ) : (
                        <span className="message-item-unread-dot-placeholder" />
                      )}
                      
                      <div className="message-item-sender-info">
                        <span className={`message-item-name ${!msg.isRead ? 'unread' : ''}`}>
                          {msg.name}
                        </span>
                        <span className="message-item-email">
                          {msg.email}
                        </span>
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="message-item-subject-box">
                      <span className={`message-item-subject ${!msg.isRead ? 'unread' : ''}`}>
                        {msg.subject || 'General Inquiry'}
                      </span>
                    </div>

                    {/* Date & Actions */}
                    <div className="message-item-meta-box">
                      <span className="message-item-date">
                        {new Date(msg.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      
                      {!msg.isRead && (
                        <button
                          onClick={(e) => handleMarkAsRead(msg._id, e)}
                          className="message-item-mark-read-btn"
                          title="Mark as Read"
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="message-detail-panel">
                      <div className="message-detail-header">
                        <span><strong>From:</strong> {msg.name} ({msg.email})</span>
                        <span><strong>Subject:</strong> {msg.subject || 'General Inquiry'}</span>
                      </div>
                      <div className="message-detail-content-box">
                        {msg.message}
                      </div>
                      <div className="message-detail-actions">
                        <a
                          href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                          className="btn-primary message-detail-reply-btn"
                        >
                          Reply via Email
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
