"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaSearchPlus } from 'react-icons/fa';

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  const { title, description, category, tools, images, coverImage } = project;

  // Combine coverImage and other images if coverImage is not already in images array
  const galleryImages = images && images.length > 0 
    ? images 
    : [coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Keyboard navigation for gallery
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
      if (e.key === 'ArrowRight' && galleryImages.length > 1) {
        handleNext();
      }
      if (e.key === 'ArrowLeft' && galleryImages.length > 1) {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, galleryImages, isZoomed]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(10, 10, 10, 0.98)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflowY: 'auto',
          padding: '2rem 1rem'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            width: '100%',
            maxWidth: '1100px',
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1.25rem',
              right: '1.25rem',
              background: 'rgba(10, 10, 10, 0.7)',
              border: '1px solid var(--border)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              fontSize: '1.1rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent)';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-primary)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            <FaTimes />
          </button>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)',
              minHeight: '550px'
            }}
            className="modal-grid"
          >
            {/* Left Column: Image Viewer */}
            <div
              style={{
                position: 'relative',
                backgroundColor: '#050505',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '350px',
                height: '100%',
                padding: '2rem'
              }}
            >
              {/* Main Image */}
              <img
                src={galleryImages[currentIndex]}
                alt={`${title} - ${currentIndex + 1}`}
                onClick={() => setIsZoomed(true)}
                style={{
                  maxWidth: '100%',
                  maxHeight: '450px',
                  objectFit: 'contain',
                  borderRadius: '4px',
                  cursor: 'zoom-in'
                }}
              />

              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomed(true)}
                style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(16, 16, 16, 0.7)',
                  border: '1px solid var(--border)',
                  borderRadius: '4px',
                  width: '36px',
                  height: '36px',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 6,
                  fontSize: '0.9rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent)';
                  e.currentTarget.style.borderColor = 'var(--accent)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.borderColor = 'var(--border)';
                }}
                title="View Fullscreen"
              >
                <FaSearchPlus />
              </button>

              {/* Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    style={{
                      position: 'absolute',
                      left: '1rem',
                      background: 'rgba(16, 16, 16, 0.6)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#ffffff',
                      padding: '0.75rem 0.5rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      zIndex: 5
                    }}
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={handleNext}
                    style={{
                      position: 'absolute',
                      right: '1rem',
                      background: 'rgba(16, 16, 16, 0.6)',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#ffffff',
                      padding: '0.75rem 0.5rem',
                      cursor: 'pointer',
                      fontSize: '1rem',
                      zIndex: 5
                    }}
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}

              {/* Image Counter indicator */}
              {galleryImages.length > 1 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    backgroundColor: 'rgba(10, 10, 10, 0.7)',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {currentIndex + 1} / {galleryImages.length}
                </div>
              )}
            </div>

            {/* Right Column: Project details */}
            <div
              style={{
                padding: '3rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderLeft: '1px solid var(--border)'
              }}
              className="modal-details"
            >
              <div>
                {/* Category Badge */}
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: 'var(--accent)',
                    color: '#ffffff',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '1.25rem'
                  }}
                >
                  {category}
                </span>

                {/* Title */}
                <h2
                  style={{
                    fontSize: '2rem',
                    marginBottom: '1.5rem',
                    fontFamily: 'var(--font-heading)',
                    lineHeight: 1.2
                  }}
                >
                  {title}
                </h2>

                {/* Description */}
                <div
                  style={{
                    color: 'var(--text-secondary)',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    marginBottom: '2rem',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {description}
                </div>
              </div>

              {/* Tools & Details Bottom */}
              <div>
                {tools && tools.length > 0 && (
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                    <h4
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        color: 'var(--text-secondary)',
                        letterSpacing: '0.05em',
                        marginBottom: '0.75rem'
                      }}
                    >
                      Tools Used
                    </h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {tools.map((tool, i) => (
                        <span
                          key={i}
                          style={{
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border)',
                            color: 'var(--text-primary)',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            fontWeight: 500
                          }}
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* CSS for modal responsive layout */}
        <style>{`
          @media (max-width: 850px) {
            .modal-grid {
              grid-template-columns: 1fr !important;
            }
            .modal-details {
              border-left: none !important;
              border-top: 1px solid var(--border) !important;
              padding: 2rem 1.5rem !important;
            }
          }
        `}</style>
      </motion.div>

      {/* Immersive Fullscreen Lightbox */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(5, 5, 5, 0.98)',
              zIndex: 2000,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'zoom-out'
            }}
            onClick={() => setIsZoomed(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsZoomed(false)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '1.25rem',
                zIndex: 2010
              }}
            >
              <FaTimes />
            </button>

            {/* Immersive Image */}
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ duration: 0.25 }}
              src={galleryImages[currentIndex]}
              alt={`${title} fullscreen`}
              style={{
                maxWidth: '92vw',
                maxHeight: '92vh',
                objectFit: 'contain',
                borderRadius: '4px',
                cursor: 'default'
              }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};

export default ProjectModal;
