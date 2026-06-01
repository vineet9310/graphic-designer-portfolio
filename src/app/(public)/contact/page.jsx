"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaBehance, FaLinkedinIn, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import ContactForm from '@/components/ContactForm';

const Contact = () => {
  const contactDetails = [
    {
      icon: <FaEnvelope />,
      title: 'Email Direct',
      value: 'designer@example.com',
      url: 'mailto:designer@example.com'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Location',
      value: 'New York City, NY',
      url: 'https://maps.google.com'
    }
  ];

  const socialLinks = [
    { icon: <FaInstagram />, name: 'Instagram', url: 'https://instagram.com' },
    { icon: <FaBehance />, name: 'Behance', url: 'https://behance.net' },
    { icon: <FaLinkedinIn />, name: 'LinkedIn', url: 'https://linkedin.com' }
  ];

  return (
    <div style={{ padding: '6rem 0', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        
        {/* Split Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '5rem',
            alignItems: 'start'
          }}
          className="contact-split"
        >
          {/* Column 1: Info & Socials */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              Let\'s Talk
            </p>
            <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
              Start your visual revolution.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: '3rem', fontWeight: 300, lineHeight: 1.7 }}>
              Have an exciting project, full-time hire opportunity, or just want to say hello? Fill out the contact form, and I will get back to you within 24 hours. Let\'s create something remarkable together.
            </p>

            {/* Direct Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
              {contactDetails.map((detail, i) => (
                <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div
                    style={{
                      color: 'var(--accent)',
                      fontSize: '1.25rem',
                      width: '45px',
                      height: '45px',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {detail.icon}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.15rem' }}>
                      {detail.title}
                    </h4>
                    <a
                      href={detail.url}
                      target={detail.url.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', transition: 'color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                    >
                      {detail.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Channels */}
            <div>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                Follow My Channels
              </h4>
              <div style={{ display: 'flex', gap: '1rem' }}>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      padding: '0.6rem 1.25rem',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                  >
                    <span>{social.icon}</span>
                    <span>{social.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Column 2: Form */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="card"
            style={{
              padding: '3rem 2.5rem',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)'
            }}
          >
            <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>
              Send a Brief
            </h2>
            <ContactForm />
          </motion.div>
        </div>

      </div>

      {/* Responsive mobile media query overrides */}
      <style>{`
        @media (max-width: 850px) {
          .contact-split {
            grid-template-columns: 1fr !important;
            gap: 4rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Contact;
