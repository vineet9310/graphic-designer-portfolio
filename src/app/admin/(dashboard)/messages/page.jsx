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
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
            Contact Messages
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            View and manage submissions sent via your public contact form.
          </p>
        </div>
        <button 
          onClick={fetchMessages}
          className="btn-outline" 
          style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
        >
          Refresh Inbox
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} className="card" style={{ height: '80px' }}>
              <div className="skeleton" style={{ height: '100%', width: '100%' }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.length === 0 ? (
            <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No messages received yet. Your inbox is clean!
            </div>
          ) : (
            messages.map((msg) => {
              const isExpanded = expandedMessageId === msg._id;
              return (
                <div
                  key={msg._id}
                  className="card"
                  onClick={() => toggleExpand(msg._id, msg.isRead)}
                  style={{
                    cursor: 'pointer',
                    borderLeft: !msg.isRead ? '4px solid var(--accent)' : '1px solid var(--border)',
                    backgroundColor: isExpanded ? 'var(--bg-surface)' : 'var(--bg-card)',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden'
                  }}
                >
                  {/* Header Summary Row */}
                  <div
                    style={{
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      {/* Red Dot/Envelope Indicator */}
                      {!msg.isRead ? (
                        <span
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent)',
                            display: 'inline-block',
                            boxShadow: '0 0 8px var(--accent)'
                          }}
                          title="Unread message"
                        />
                      ) : (
                        <span style={{ width: '8px', display: 'inline-block' }} />
                      )}
                      
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: !msg.isRead ? 700 : 500, fontSize: '0.95rem' }}>
                          {msg.name}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {msg.email}
                        </span>
                      </div>
                    </div>

                    {/* Subject */}
                    <div style={{ flexGrow: 1, minWidth: '150px', padding: '0 1rem' }}>
                      <span
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: !msg.isRead ? 600 : 400,
                          color: !msg.isRead ? 'var(--accent)' : 'var(--text-secondary)'
                        }}
                      >
                        {msg.subject || 'General Inquiry'}
                      </span>
                    </div>

                    {/* Date & Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
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
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '1rem'
                          }}
                          title="Mark as Read"
                          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        >
                          <FaCheckCircle />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div
                      style={{
                        padding: '1.5rem',
                        backgroundColor: '#0c0c0c',
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                      }}
                    >
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '2rem' }}>
                        <span><strong>From:</strong> {msg.name} ({msg.email})</span>
                        <span><strong>Subject:</strong> {msg.subject || 'General Inquiry'}</span>
                      </div>
                      <div
                        style={{
                          color: 'var(--text-primary)',
                          fontSize: '0.95rem',
                          lineHeight: 1.6,
                          whiteSpace: 'pre-wrap',
                          padding: '1.25rem',
                          backgroundColor: 'var(--bg-surface)',
                          borderLeft: '3px solid var(--accent)',
                          borderRadius: '0 4px 4px 0'
                        }}
                      >
                        {msg.message}
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <a
                          href={`mailto:${msg.email}?subject=RE: ${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}`}
                          className="btn-primary"
                          style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}
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
