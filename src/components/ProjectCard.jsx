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
    >
      {/* Card Image Container */}
      <div className="project-card-img-container">
        <img
          src={coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
          alt={title}
          loading="lazy"
          className="project-card-image"
        />

        {/* Hover Overlay with Red Tint and View Project Text */}
        <div className="project-card-overlay">
          <span className="project-card-text">
            View Project
          </span>
        </div>
      </div>

      {/* Card Details */}
      <div className="project-card-details">
        <span className="project-card-category">
          {category}
        </span>
        <h3 className="project-card-title">
          {title}
        </h3>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
