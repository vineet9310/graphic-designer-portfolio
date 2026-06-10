"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '@/hooks/useProjects';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';

import Link from 'next/link';
import { useSettings } from '@/hooks/useSettings';

const Portfolio = () => {
  const { projects, loading, fetchProjects } = useProjects();
  const { settings, loading: settingsLoading } = useSettings();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  if (settingsLoading) {
    return (
      <div className="about-loading-container" style={{ padding: '10rem 0', minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="skeleton about-loading-skeleton" />
      </div>
    );
  }

  if (settings?.navbar?.portfolio === false) {
    return (
      <div className="services-disabled-container" style={{ padding: '10rem 0', minHeight: '60vh', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem', color: 'var(--text-primary)' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>This page is currently disabled by the site administrator.</p>
        <Link href="/" className="btn-primary">Return Home</Link>
      </div>
    );
  }

  // In case database is empty, fall back to mock projects to demonstrate visual elegance and filter mechanics
  const mockProjects = [
    { _id: 'm1', title: 'Aether Brand Identity', category: 'Branding', coverImage: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=80', description: 'Complete brand conceptualization, visual assets, and style guide for Aether Tech, a cloud computing platform focusing on modern, high-contrast, scalable iconography.', tools: ['Illustrator', 'Figma', 'Photoshop'], images: ['https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'] },
    { _id: 'm2', title: 'Zenith UI/UX Platform', category: 'UI/UX', coverImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=80', description: 'Design system and web application dashboards for Zenith SaaS, maximizing data readability and layout flow using clean cards, dark-mode styling, and minimal accents.', tools: ['Figma', 'Procreate'], images: ['https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=80'] },
    { _id: 'm3', title: 'Chronos Poster Series', category: 'Print', coverImage: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=800&auto=format&fit=crop&q=80', description: 'Sleek geometric posters focusing on spacetime themes. Perfect illustration of vector work, spacing, print quality, and composition.', tools: ['Illustrator', 'InDesign'], images: ['https://images.unsplash.com/photo-1561070791-26c113006238?w=800&auto=format&fit=crop&q=80'] },
    { _id: 'm4', title: 'Minimalist Monogram Sets', category: 'Logo Design', coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80', description: 'A collection of custom monogram marks created for a variety of corporate, personal, and lifestyle boutique brands.', tools: ['Illustrator'], images: ['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80'] },
    { _id: 'm5', title: 'Cyberpunk Social Kit', category: 'Social Media', coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80', description: 'Instagram grids, banners, and digital assets tailored with rich glow and neo-futuristic vibes to maximize social engagement and click-through rates.', tools: ['Photoshop', 'After Effects'], images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'] },
    { _id: 'm6', title: 'Ethereal Vector Pack', category: 'Illustration', coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80', description: 'Detailed digital vectors and fantasy character designs exported at maximum scale for gaming assets and publishing.', tools: ['Procreate', 'Illustrator'], images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80'] }
  ];

  const activeProjects = projects.length > 0 ? projects : mockProjects;

  // Dynamically extract categories from current active projects
  const defaults = ['Logo Design', 'Branding', 'UI/UX', 'Print', 'Social Media', 'Illustration'];
  const projectCats = activeProjects.map(p => p.category).filter(Boolean);
  const categories = ['All', ...Array.from(new Set([...defaults, ...projectCats]))];

  const filteredProjects = selectedFilter === 'All'
    ? activeProjects
    : activeProjects.filter(p => p.category === selectedFilter);

  return (
    <div className="portfolio-page">
      <div className="container">
        
        {/* Header */}
        <div className="portfolio-header">
          <p className="portfolio-subtitle">
            Portfolio
          </p>
          <h1 className="portfolio-title">
            Explore My Work
          </h1>
          <p className="portfolio-description">
            A curated showcase of branding campaigns, digital layouts, custom illustrations, and creative visual designs.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="filter-container">
          {categories.map((cat) => {
            const isActive = selectedFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`filter-btn ${isActive ? 'active' : ''}`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="portfolio-grid-premium">
            {[1, 2, 3, 4, 5, 6].map((n, index) => {
              const itemClass = index % 5 === 0 ? 'portfolio-item-wide' : index % 5 === 3 ? 'portfolio-item-tall' : 'portfolio-item-standard';
              return (
                <div key={n} className={`portfolio-card-premium ${itemClass}`}>
                  <div className="skeleton skeleton-card-img-wrapper" />
                </div>
              );
            })}
          </div>
        ) : (
          <motion.div
            layout
            className="portfolio-grid-premium"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, index) => {
                const itemClass = index % 5 === 0 ? 'portfolio-item-wide' : index % 5 === 3 ? 'portfolio-item-tall' : 'portfolio-item-standard';
                return (
                  <motion.div
                    layout
                    key={project._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedProject(project)}
                    className={`portfolio-card-premium ${itemClass}`}
                  >
                    <div className="portfolio-card-img-wrapper">
                      <img
                        src={project.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'}
                        alt={project.title}
                        loading="lazy"
                        className="portfolio-card-img"
                      />
                      
                      <div className="portfolio-card-overlay-drawer">
                        <span className="portfolio-card-overlay-category">
                          {project.category}
                        </span>
                        
                        <h3 className="portfolio-card-overlay-title">
                          {project.title}
                        </h3>

                        {project.description && (
                          <p className="portfolio-card-overlay-desc">
                            {project.description}
                          </p>
                        )}

                        {project.tools && project.tools.length > 0 && (
                          <div className="portfolio-card-tools-container">
                            {project.tools.slice(0, 3).map((tool, idx) => (
                              <span key={idx} className="portfolio-card-tool-tag">
                                {tool}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="portfolio-card-action-btn">
                          View Project &rarr;
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && filteredProjects.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-text">
              No projects found in this category yet.
            </p>
          </div>
        )}
      </div>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;
