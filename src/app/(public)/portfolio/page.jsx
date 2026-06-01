"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjects } from '@/hooks/useProjects';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';

const Portfolio = () => {
  const { projects, loading, fetchProjects } = useProjects();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const categories = [
    'All',
    'Logo Design',
    'Branding',
    'UI/UX',
    'Print',
    'Social Media',
    'Illustration'
  ];

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

  const filteredProjects = selectedFilter === 'All'
    ? activeProjects
    : activeProjects.filter(p => p.category === selectedFilter);

  return (
    <div style={{ padding: '5rem 0', backgroundColor: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Portfolio
          </p>
          <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
            Explore My Work
          </h1>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '1.05rem', fontWeight: 300 }}>
            A curated showcase of branding campaigns, digital layouts, custom illustrations, and creative visual designs.
          </p>
        </div>

        {/* Filter Pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '3.5rem'
          }}
        >
          {categories.map((cat) => {
            const isActive = selectedFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                style={{
                  backgroundColor: isActive ? 'var(--accent)' : 'var(--bg-surface)',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  border: `1px solid ${isActive ? 'var(--accent)' : 'var(--border)'}`,
                  padding: '0.55rem 1.25rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.02em',
                  transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                  }
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem'
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="card" style={{ height: '380px' }}>
                <div className="skeleton" style={{ height: '70%' }} />
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="skeleton" style={{ height: '15px', width: '25%' }} />
                  <div className="skeleton" style={{ height: '25px', width: '60%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            layout
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem'
            }}
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && filteredProjects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
              No projects found in this category yet.
            </p>
          </div>
        )}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
};

export default Portfolio;
