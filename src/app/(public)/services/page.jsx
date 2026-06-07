"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaPaintBrush, FaDraftingCompass, FaLaptopCode, FaBullhorn, FaCheck } from 'react-icons/fa';
import Link from 'next/link';
import { useSettings } from '@/hooks/useSettings';

const Services = () => {
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <div className="about-loading-container">
        <div className="skeleton about-loading-skeleton" />
      </div>
    );
  }

  if (settings?.navbar?.services === false) {
    return (
      <div className="services-disabled-container" style={{ padding: '10rem 0', minHeight: '60vh', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem', color: 'var(--text-primary)' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>This page is currently disabled by the site administrator.</p>
        <Link href="/" className="btn-primary">Return Home</Link>
      </div>
    );
  }

  // Helper to map icons dynamically based on index or title
  const getServiceIcon = (title, idx) => {
    if (!title || typeof title !== 'string') {
      // Index mapping fallback
      if (idx === 0) return <FaPaintBrush />;
      if (idx === 1) return <FaDraftingCompass />;
      if (idx === 2) return <FaLaptopCode />;
      return <FaBullhorn />;
    }
    const t = title.toLowerCase();
    if (t.includes('logo')) return <FaPaintBrush />;
    if (t.includes('brand') || t.includes('identity')) return <FaDraftingCompass />;
    if (t.includes('ui') || t.includes('ux') || t.includes('web')) return <FaLaptopCode />;
    if (t.includes('social') || t.includes('media')) return <FaBullhorn />;
    
    // Index mapping fallback
    if (idx === 0) return <FaPaintBrush />;
    if (idx === 1) return <FaDraftingCompass />;
    if (idx === 2) return <FaLaptopCode />;
    return <FaBullhorn />;
  };

  const serviceCards = settings?.services && settings.services.length > 0
    ? settings.services
        .filter(srv => srv.visible !== false)
        .map((srv, idx) => ({
          icon: getServiceIcon(srv.title, idx),
          title: srv.title || 'Untitled Service',
          description: srv.description || '',
          includes: srv.includes || []
        }))
    : [
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

  const packages = settings?.packages && settings.packages.length > 0
    ? settings.packages
    : [
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
          featured: true
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
    <div className="services-page">
      <div className="container">
        
        {/* Header */}
        <div className="services-header">
          <p className="section-subtitle">
            Services & Pricing
          </p>
          <h1 className="section-title">
            How I Can Help You
          </h1>
          <p className="section-description">
            Curated creative agency level services structured to elevate your aesthetic appearance and digital performance.
          </p>
        </div>

        {/* 1. Services Cards Grid */}
        <div className="services-grid">
          {serviceCards.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="card service-card"
            >
              {/* Icon */}
              <div className="service-icon-box">
                {service.icon}
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="service-card-title">
                  {service.title}
                </h3>
                <p className="service-card-desc">
                  {service.description}
                </p>
              </div>

              {/* What's Included */}
              <div className="service-includes-wrapper">
                <h4 className="service-includes-header">
                  Includes
                </h4>
                <ul className="service-includes-list">
                  {service.includes.map((inc, i) => (
                    <li key={i} className="service-includes-item">
                      <FaCheck className="service-includes-check" />
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 2. Packages Grid */}
        <div className="pricing-header">
          <h2 className="pricing-title">
            Pricing Packages
          </h2>
          <p className="pricing-description">
            Transparent budgets designed to support projects from quick concepts to comprehensive launches.
          </p>
        </div>

        <div className="pricing-grid">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`card package-card ${pkg.featured ? 'featured' : ''}`}
            >
              {/* Highlight Tag */}
              {pkg.featured && (
                <span className="package-badge">
                  Most Popular
                </span>
              )}

              {/* Package Header */}
              <div className="package-header">
                <h3 className="package-title">
                  {pkg.name}
                </h3>
                <h4 className="package-price">
                  {pkg.price}
                </h4>
                <p className="package-description">
                  {pkg.description}
                </p>
              </div>

              {/* Features List */}
              <ul className="package-features-list">
                {(pkg.features || []).map((feature, i) => (
                  <li key={i} className="package-features-item">
                    <FaCheck className="package-features-check" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action Button */}
              <div className="package-action">
                <Link
                  href="/contact"
                  className={`${pkg.featured ? 'btn-primary' : 'btn-outline'} btn-full-width`}
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
