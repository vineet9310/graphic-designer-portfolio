"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaInstagram, FaBehance, FaLinkedinIn, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import ContactForm from '@/components/ContactForm';
import { useSettings } from '@/hooks/useSettings';

const Contact = () => {
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <div className="contact-loading-container">
        <div className="skeleton contact-loading-circle" />
      </div>
    );
  }

  const email = settings?.contact?.email || 'designer@example.com';
  const location = settings?.contact?.location || 'New York City, NY';
  const phone = settings?.contact?.phone || '';
  const instagramUrl = settings?.contact?.instagramUrl || 'https://instagram.com';
  const behanceUrl = settings?.contact?.behanceUrl || 'https://behance.net';
  const linkedinUrl = settings?.contact?.linkedinUrl || 'https://linkedin.com';

  const contactDetails = [
    {
      icon: <FaEnvelope />,
      title: 'Email Direct',
      value: email,
      url: `mailto:${email}`
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Location',
      value: location,
      url: 'https://maps.google.com'
    }
  ];

  if (phone) {
    contactDetails.push({
      icon: <FaPhone />,
      title: 'Phone',
      value: phone,
      url: `tel:${phone}`
    });
  }

  const socialLinks = [
    { icon: <FaInstagram />, name: 'Instagram', url: instagramUrl },
    { icon: <FaBehance />, name: 'Behance', url: behanceUrl },
    { icon: <FaLinkedinIn />, name: 'LinkedIn', url: linkedinUrl }
  ];

  return (
    <div className="contact-section">
      <div className="container">
        
        {/* Split Grid */}
        <div className="contact-split">
          {/* Column 1: Info & Socials */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="pulsing-badge-container">
              <div className="pulsing-dot" />
              <span className="pulsing-badge-text">Available for Freelance & Q3 Projects</span>
            </div>

            <p className="contact-info-subtitle">
              Let's Talk
            </p>
            <h1 className="contact-info-title">
              Start your visual revolution.
            </h1>
            <p className="contact-info-description">
              Have an exciting project, full-time hire opportunity, or just want to say hello? Fill out the contact form, and I will get back to you within 24 hours. Let's create something remarkable together.
            </p>

            {/* Direct Details */}
            <div className="contact-details-list">
              {contactDetails.map((detail, i) => (
                <div key={i} className="contact-detail-item">
                  <div className="contact-detail-icon-box">
                    {detail.icon}
                  </div>
                  <div>
                    <h4 className="contact-detail-label">
                      {detail.title}
                    </h4>
                    <a
                      href={detail.url}
                      target={detail.url.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className="contact-detail-link"
                    >
                      {detail.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Channels */}
            <div>
              <h4 className="contact-social-heading">
                Follow My Channels
              </h4>
              <div className="contact-social-container">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="contact-social-btn"
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
            className="contact-form-container-card"
          >
            <h2 className="contact-form-title">
              Send a Brief
            </h2>
            <ContactForm />
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
