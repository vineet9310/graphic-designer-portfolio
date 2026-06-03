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

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <footer className="footer">
      <div className="container">
        
        {/* Upper footer grid */}
        <div className="footer-grid">
          
          {/* Brand Info Column */}
          <div className="footer-brand-col">
            <Link href="/" className="footer-brand-logo">
              <span>V</span>ividForge.
            </Link>
            <p className="footer-brand-desc">
              Designing visual legacies, packaging prototypes, and modern digital platform user experiences. Built on grid-precision aesthetics.
            </p>
            {/* Availability Status Pulse Indicator */}
            <div className="footer-availability-badge">
              <span className="footer-availability-dot" />
              <span>Available for Projects</span>
            </div>
          </div>

          {/* Quick Nav links Column */}
          <div>
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links-list">
              {quickLinks.map((link) => (
                <li key={link.name} className="footer-link-item">
                  <Link href={link.path}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect & Contact Column */}
          <div>
            <h4 className="footer-heading">Inquiries</h4>
            <a href={`mailto:${email}`} className="footer-inquire-email">
              {email}
            </a>
            
            <div className="footer-social-wrapper">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="footer-social-link"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Lower footer copyright strip */}
        <div className="footer-bottom-strip">
          <p className="footer-copyright">
            &copy; {currentYear} <span>VividForge</span>. All rights reserved.
          </p>
          <Link
            href="/admin"
            className="footer-admin-link"
          >
            [SYS_ADMIN]
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
