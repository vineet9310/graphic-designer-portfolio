"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaPaintBrush, FaDraftingCompass, FaLaptopCode, FaBullhorn, FaCheck } from 'react-icons/fa';
import Link from 'next/link';

const Services = () => {
  const serviceCards = [
    {
      icon: <FaPaintBrush />,
      title: 'Logo Design',
      description: 'Custom vector logo marks designed from scratch to reflect your core values and make a lasting corporate statement.',
      includes: ['3 Unique Logo Concepts', 'Full Vector File Handover', 'Black & White Variations', 'Icon & Favicon Exports']
    },
    {
      icon: <FaDraftingCompass />,
      title: 'Brand Identity',
      description: 'Comprehensive design guidelines and complete brand collateral that synchronize your visual appearance across all channels.',
      includes: ['Brand Style Guide Booklet', 'Typography & Palette System', 'Business Card & Letterhead', 'Packaging Blueprints']
    },
    {
      icon: <FaLaptopCode />,
      title: 'UI/UX Design',
      description: 'High-fidelity mobile and desktop dashboard layouts built in Figma. Structured to maximize readability and flow.',
      includes: ['Figma Interaction Mockups', 'Component Design System', 'Wireframe Flow Schematics', 'Developer Handoff Spec']
    },
    {
      icon: <FaBullhorn />,
      title: 'Social Media Design',
      description: 'Vibrant, high-contrast banner templates, product display grids, and promo vectors that amplify your digital campaigns.',
      includes: ['12 Instagram Template Grids', 'LinkedIn & Twitter Banners', 'Click-through Banner Assets', 'Editable Source Files']
    }
  ];

  const packages = [
    {
      name: 'Basic Concept',
      price: '$499',
      description: 'Perfect for small boutiques or personal ventures looking to establish a minimal starter design.',
      features: [
        'Single Logo Concept',
        'Basic Style Guidelines',
        '2 Revision Iterations',
        'Vector Source Files',
        '3 Days Standard Delivery'
      ],
      featured: false
    },
    {
      name: 'Full Identity',
      price: '$1,299',
      description: 'Complete branding suite tailored for active startups ready to compete globally.',
      features: [
        '3 Unique Logo Proposals',
        'Full Branding Book (PDF)',
        'Stationery & Business Cards',
        'Unlimited Revision Iterations',
        'Priority Slack Communication',
        'Social Media Grid Template'
      ],
      featured: true // Highlights this middle package with red border
    },
    {
      name: 'Premium UI + Brand',
      price: '$2,499',
      description: 'All-inclusive premium design packages combining branding guides and full app mockups.',
      features: [
        'Everything in Full Identity',
        'Full UI/UX Web/App Design (Figma)',
        'Design System Toolkit',
        'Interactive Figma Prototypes',
        '10-Pages Flow Mockup',
        '1 Month Ongoing Post-Support'
      ],
      featured: false
    }
  ];

  return (
    <div style={{ padding: '6rem 0', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <p style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Services & Pricing
          </p>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
            How I Can Help You
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', fontWeight: 300 }}>
            Curated creative agency level services structured to elevate your aesthetic appearance and digital performance.
          </p>
        </div>

        {/* 1. Services Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '2rem',
            marginBottom: '7rem'
          }}
        >
          {serviceCards.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="card"
              style={{ padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
            >
              {/* Icon */}
              <div
                style={{
                  color: 'var(--accent)',
                  fontSize: '2rem',
                  backgroundColor: 'rgba(230, 57, 70, 0.05)',
                  width: '60px',
                  height: '60px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(230, 57, 70, 0.15)'
                }}
              >
                {service.icon}
              </div>

              {/* Title & Description */}
              <div>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', fontFamily: 'var(--font-heading)' }}>
                  {service.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, fontWeight: 300 }}>
                  {service.description}
                </p>
              </div>

              {/* What's Included */}
              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em', marginBottom: '0.75rem', fontWeight: 600 }}>
                  Includes
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {service.includes.map((inc, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <FaCheck style={{ color: 'var(--accent)', fontSize: '0.7rem' }} />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 2. Packages Grid */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
            Pricing Packages
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 300 }}>
            Transparent budgets designed to support projects from quick concepts to comprehensive launches.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem',
            alignItems: 'stretch'
          }}
          className="pricing-grid"
        >
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card"
              style={{
                padding: '3rem 2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                border: pkg.featured ? '2px solid var(--accent)' : '1px solid var(--border)',
                position: 'relative'
              }}
            >
              {/* Highlight Tag */}
              {pkg.featured && (
                <span
                  style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    backgroundColor: 'var(--accent)',
                    color: '#ffffff',
                    padding: '0.25rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                >
                  Most Popular
                </span>
              )}

              {/* Package Header */}
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                  {pkg.name}
                </h3>
                <h4 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', margin: '0.5rem 0' }}>
                  {pkg.price}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 300, lineHeight: 1.5, minHeight: '45px' }}>
                  {pkg.description}
                </p>
              </div>

              {/* Features List */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                {pkg.features.map((feature, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <FaCheck style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                <Link
                  href="/contact"
                  className={pkg.featured ? 'btn-primary' : 'btn-outline'}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Get Started
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Services;
