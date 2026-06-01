"use client";

import React from 'react';
import Link from 'next/link';
import { FaInstagram, FaBehance, FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import { useSettings } from '@/hooks/useSettings';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();

  const email = settings?.contact?.email || 'designer@example.com';
  const instagramUrl = settings?.contact?.instagramUrl || 'https://instagram.com';
  const behanceUrl = settings?.contact?.behanceUrl || 'https://behance.net';
  const linkedinUrl = settings?.contact?.linkedinUrl || 'https://linkedin.com';

  const socialLinks = [
    { icon: <FaInstagram />, url: instagramUrl, name: 'Instagram' },
    { icon: <FaBehance />, url: behanceUrl, name: 'Behance' },
    { icon: <FaLinkedinIn />, url: linkedinUrl, name: 'LinkedIn' },
    { icon: <FaEnvelope />, url: `mailto:${email}`, name: 'Email' }
  ];

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border)',
        padding: '3rem 0',
        marginTop: 'auto'
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem'
        }}
      >
        {/* Social Icons */}
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              style={{
                color: 'var(--text-secondary)',
                fontSize: '1.2rem',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Info & Admin link */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem',
            textAlign: 'center'
          }}
        >
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            &copy; {currentYear} <span style={{ fontWeight: 600 }}>ALEX</span>. All rights reserved.
          </p>
          <Link
            href="/admin"
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.8rem',
              transition: 'color 0.2s ease',
              opacity: 0.5
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >
            Admin Panel
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
