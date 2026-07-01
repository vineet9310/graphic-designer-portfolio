"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaSearchPlus } from 'react-icons/fa';

const ProjectModal = ({ project, onClose }) => {
  if (!project) return null;

  const { title, description, category, tools, images, coverImage } = project;

  // Normalize images to always be objects with url, title, and description
  const normalizedImages = (images && images.length > 0 
    ? images 
    : []
  ).map(img => {
    if (typeof img === 'string') {
      return { url: img, title: '', description: '' };
    }
    return { url: img?.url || '', title: img?.title || '', description: img?.description || '' };
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null);

  const handleNext = () => {
    if (normalizedImages.length > 1) {
      setCurrentIndex((prev) => (prev === normalizedImages.length - 1 ? 0 : prev + 1));
    }
  };

  const handlePrev = () => {
    if (normalizedImages.length > 1) {
      setCurrentIndex((prev) => (prev === 0 ? normalizedImages.length - 1 : prev - 1));
    }
  };

  // Keyboard navigation & escape handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (zoomedImageUrl) {
          setZoomedImageUrl(null);
        } else {
          onClose();
        }
      }
      if (e.key === 'ArrowRight' && normalizedImages.length > 1) {
        handleNext();
      }
      if (e.key === 'ArrowLeft' && normalizedImages.length > 1) {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomedImageUrl, currentIndex, normalizedImages, onClose]);

  return (
    <>
      <motion.div
        key="project-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="modal-container"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
          style={{ padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close Project Modal"
            style={{ top: '1.25rem', right: '1.25rem', position: 'absolute' }}
          >
            <FaTimes />
          </button>

          {/* MAIN FOLD (Hero Section) */}
          <div className="modal-grid" style={{ minHeight: 'auto', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '2.5rem' }}>
            {/* Left Column: Hero Image */}
            <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#030303', minHeight: '350px', borderRadius: '8px', overflow: 'hidden' }}>
              <img
                src={coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
                alt={title}
                onClick={() => setZoomedImageUrl(coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80')}
                style={{ width: '100%', maxHeight: '450px', objectFit: 'contain', cursor: 'zoom-in' }}
              />
              <button
                onClick={() => setZoomedImageUrl(coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80')}
                style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="View Fullscreen"
              >
                <FaSearchPlus size={14} />
              </button>
            </div>

            {/* Right Column: Project Details */}
            <div style={{ padding: '0 1rem 0 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'flex-start' }}>
              <div>
                {/* Category Badge */}
                <span className="modal-category-badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
                  {category}
                </span>

                {/* Title */}
                <h2 className="modal-title" style={{ fontSize: '2.2rem', marginBottom: '1rem', marginTop: 0 }}>
                  {title}
                </h2>

                {/* Description */}
                <div className="modal-description" style={{ marginBottom: 0 }}>
                  {description}
                </div>
              </div>

              {/* Tools Used */}
              {tools && tools.length > 0 && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                  <h4 className="modal-tools-header" style={{ marginBottom: '0.5rem' }}>
                    Tools Used
                  </h4>
                  <div className="modal-tools-list">
                    {tools.map((tool, i) => (
                      <span key={i} className="modal-tool-tag">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* LOWER SECTION: Project Gallery Images Slider */}
          {normalizedImages && normalizedImages.length > 0 && (
            <div>
              <h3 style={{
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '1.5rem'
              }}>
                Project Gallery
              </h3>

              <div className="modal-grid" style={{ minHeight: 'auto', alignItems: 'center' }}>
                {/* Left Column: Gallery Image Slider Container */}
                <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#030303', minHeight: '350px', borderRadius: '8px', overflow: 'hidden' }}>
                  <img
                    src={normalizedImages[currentIndex].url}
                    alt={normalizedImages[currentIndex].title || `${title} gallery image ${currentIndex + 1}`}
                    onClick={() => setZoomedImageUrl(normalizedImages[currentIndex].url)}
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', cursor: 'zoom-in' }}
                  />

                  {/* Zoom Button */}
                  <button
                    onClick={() => setZoomedImageUrl(normalizedImages[currentIndex].url)}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px', borderRadius: '50%', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
                    title="View Fullscreen"
                  >
                    <FaSearchPlus size={12} />
                  </button>

                  {/* Navigation Arrows */}
                  {normalizedImages.length > 1 && (
                    <>
                      <button
                        onClick={handlePrev}
                        style={{
                          position: 'absolute',
                          left: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(10, 10, 10, 0.7)',
                          border: '1px solid var(--border)',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 10,
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(10, 10, 10, 0.7)'}
                        aria-label="Previous Image"
                      >
                        <FaChevronLeft size={12} />
                      </button>
                      <button
                        onClick={handleNext}
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'rgba(10, 10, 10, 0.7)',
                          border: '1px solid var(--border)',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 10,
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(10, 10, 10, 0.7)'}
                        aria-label="Next Image"
                      >
                        <FaChevronRight size={12} />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {normalizedImages.length > 1 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      right: '10px',
                      background: 'rgba(10, 10, 10, 0.75)',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                      fontWeight: 'bold',
                      zIndex: 10
                    }}>
                      {currentIndex + 1} / {normalizedImages.length}
                    </div>
                  )}
                </div>

                {/* Right Column: Title & Description */}
                <div style={{ padding: '0 1rem 0 2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
                  {/* Project Title (Hero Title) */}
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {title}
                  </span>

                  {/* Image Title */}
                  <h3 style={{ fontSize: '1.4rem', fontWeight: '600', color: '#ffffff', margin: 0, lineHeight: '1.3' }}>
                    {normalizedImages[currentIndex].title || `${title} - Image ${currentIndex + 1}`}
                  </h3>

                  {/* Image Description */}
                  {normalizedImages[currentIndex].description && (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', margin: 0, whiteSpace: 'pre-wrap' }}>
                      {normalizedImages[currentIndex].description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Immersive Fullscreen Lightbox */}
      <AnimatePresence>
        {zoomedImageUrl && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0,0,0,0.95)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-out'
            }}
            onClick={() => setZoomedImageUrl(null)}
          >
            <button
              onClick={() => setZoomedImageUrl(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                fontSize: '1.5rem',
                cursor: 'pointer',
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s'
              }}
              aria-label="Close Fullscreen View"
            >
              <FaTimes />
            </button>

            <motion.img
              key={zoomedImageUrl}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              src={zoomedImageUrl}
              alt="Fullscreen view"
              style={{
                maxWidth: '92vw',
                maxHeight: '92vh',
                objectFit: 'contain',
                borderRadius: '4px',
                cursor: 'default'
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectModal;
