"use client";

import React from 'react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project, onClick }) => {
  const { title, category, coverImage } = project;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="card"
      style={{
        cursor: 'pointer',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        height: '380px',
        overflow: 'hidden'
      }}
    >
      {/* Card Image Container */}
      <div style={{ flexGrow: 1, overflow: 'hidden', position: 'relative' }}>
        <img
          src={coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
          alt={title}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
          }}
          className="project-card-image"
        />

        {/* Hover Overlay with Red Tint and View Project Text */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(230, 57, 70, 0.85)',
            opacity: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.25s ease',
            zIndex: 2
          }}
          className="project-card-overlay"
        >
          <span
            style={{
              color: '#ffffff',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.1rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              borderBottom: '2px solid #ffffff',
              paddingBottom: '4px',
              transform: 'translateY(15px)',
              transition: 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }}
            className="project-card-text"
          >
            View Project
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div style={{ padding: '1.25rem 1.5rem', zIndex: 3, position: 'relative', background: 'var(--bg-card)' }}>
        <span
          style={{
            color: 'var(--accent)',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            display: 'inline-block',
            marginBottom: '0.5rem'
          }}
        >
          {category}
        </span>
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 600,
            lineHeight: 1.3,
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {title}
        </h3>
      </div>

      {/* Custom hover CSS via styled-style block */}
      <style>{`
        .card:hover .project-card-image {
          transform: scale(1.05);
        }
        .card:hover .project-card-overlay {
          opacity: 1 !important;
        }
        .card:hover .project-card-text {
          transform: translateY(0) !important;
        }
      `}</style>
    </motion.div>
  );
};

export default ProjectCard;
