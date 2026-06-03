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
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close Project Modal"
          >
            <FaTimes />
          </button>

          <div className="modal-grid">
            {/* Left Column: Image Viewer */}
            <div className="modal-img-column">
              {/* Main Image */}
              <img
                src={galleryImages[currentIndex]}
                alt={`${title} - image ${currentIndex + 1}`}
                onClick={() => setIsZoomed(true)}
                className="modal-main-img"
              />

              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomed(true)}
                className="modal-zoom-btn"
                title="View Fullscreen"
              >
                <FaSearchPlus />
              </button>

              {/* Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="modal-nav-arrow modal-nav-arrow-left"
                    aria-label="Previous Image"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={handleNext}
                    className="modal-nav-arrow modal-nav-arrow-right"
                    aria-label="Next Image"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}

              {/* Repositioned Image Counter */}
              {galleryImages.length > 1 && (
                <div className="modal-img-counter">
                  {currentIndex + 1} / {galleryImages.length}
                </div>
              )}

              {/* Clickable Thumbnails Carousel */}
              {galleryImages.length > 1 && (
                <div className="modal-thumbnails-container">
                  {galleryImages.map((img, idx) => {
                    const isActive = idx === currentIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`modal-thumb-btn ${isActive ? 'active' : ''}`}
                        aria-label={`Go to slide ${idx + 1}`}
                      >
                        <img
                          src={img}
                          alt={`${title} thumbnail ${idx + 1}`}
                          className="modal-thumb-img"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Project details */}
            <div className="modal-details-column">
              <div>
                {/* Category Badge */}
                <span className="modal-category-badge">
                  {category}
                </span>

                {/* Title */}
                <h2 className="modal-title">
                  {title}
                </h2>

                {/* Description */}
                <div className="modal-description">
                  {description}
                </div>
              </div>

              {/* Tools & Details Bottom */}
              <div>
                {tools && tools.length > 0 && (
                  <div className="modal-tools-wrapper">
                    <h4 className="modal-tools-header">
                      Tools Used
                    </h4>
                    <div className="modal-tools-list">
                      {tools.map((tool, i) => (
                        <span
                          key={i}
                          className="modal-tool-tag"
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
      </motion.div>

      {/* Immersive Fullscreen Lightbox */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lightbox-overlay"
            onClick={() => setIsZoomed(false)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="lightbox-close-btn"
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
              className="lightbox-img"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectModal;
