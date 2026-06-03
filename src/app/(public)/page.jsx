"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProjects } from '@/hooks/useProjects';
import { useSettings } from '@/hooks/useSettings';
import ProjectCard from '@/components/ProjectCard';
import { useBlogs } from '@/hooks/useBlogs';

const Home = () => {
  const { featuredProjects, loading: projectsLoading, fetchFeaturedProjects } = useProjects();
  const { settings, loading: settingsLoading } = useSettings();
  const { blogs, fetchBlogs } = useBlogs();

  useEffect(() => {
    fetchFeaturedProjects();
    fetchBlogs({ limit: 3 });
  }, [fetchFeaturedProjects, fetchBlogs]);

  // Fallback defaults in case settings is still loading/empty
  const toolsList = settings?.tools && settings.tools.length > 0 
    ? settings.tools 
    : [
        'Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Adobe After Effects', 
        'Blender 3D', 'Cinema 4D', 'Procreate', 'InDesign', 'Premiere Pro'
      ];

  const stats = settings?.stats && settings.stats.length > 0
    ? settings.stats
    : [
        { value: '50+', label: 'Projects Completed' },
        { value: '30+', label: 'Happy Clients' },
        { value: '5+', label: 'Years Experience' },
        { value: '100%', label: 'Client Satisfaction' }
      ];

  const heroSubtitle = settings?.hero?.subtitle || 'Graphic & Brand Designer';
  const heroTitle = settings?.hero?.title || 'I design things that make people stop scrolling.';
  const heroDescription = settings?.hero?.description || 'Crafting premium visual identities, digital products, and high-impact designs for bold brands worldwide.';

  const mockHomeBlogs = [
    {
      _id: 'b1',
      title: 'The Psychology of Color in Visual Brand Identity',
      slug: 'psychology-of-color-brand-identity',
      excerpt: 'How choice of palette impacts user subconsciousness. A deep dive into selecting colors that evoke trust, passion, and premium brand status.',
      category: 'Branding',
      coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&auto=format&fit=crop&q=80',
      readingTime: '5 min read',
      createdAt: '2026-05-15T09:00:00.000Z'
    },
    {
      _id: 'b2',
      title: 'Typography Rules: Why Space Grotesk dominates Modern Web Design',
      slug: 'typography-rules-space-grotesk',
      excerpt: 'Exploring the history and proportions of Space Grotesk. Learn how geometric layouts and sans-serif spacing amplify layout structures and visual margins.',
      category: 'Typography',
      coverImage: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=800&auto=format&fit=crop&q=80',
      readingTime: '4 min read',
      createdAt: '2026-05-02T10:30:00.000Z'
    },
    {
      _id: 'b3',
      title: 'Neo-Futurism: Designing Dashboard Interfaces for the Next Generation',
      slug: 'neo-futurism-dashboard-ui-ux',
      excerpt: 'Case study in designing high-contrast dashboard systems. Balanced dark themes, bright borders, and component cards that maximize data density without visual clutter.',
      category: 'UI/UX Insights',
      coverImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=80',
      readingTime: '7 min read',
      createdAt: '2026-04-18T14:15:00.000Z'
    }
  ];

  const homeBlogs = blogs && blogs.length > 0 ? blogs.slice(0, 3) : mockHomeBlogs;

  return (
    <div className="home-page">
      
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        {/* Animated Background Shapes */}
        <div className="hero-bg-shapes">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -120, 0],
                x: [0, Math.random() * 80 - 40, 0],
                opacity: [0.15, 0.4, 0.15]
              }}
              transition={{
                duration: 8 + Math.random() * 8,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="hero-particle"
            />
          ))}
          
          {/* Subtle Accent Glow */}
          <div className="hero-glow" />
        </div>

        <div className="container hero-content-wrapper">
          <div className="hero-content-box">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="hero-subtitle"
            >
              {heroSubtitle}
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="hero-title"
            >
              {heroTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-description"
            >
              {heroDescription}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hero-actions"
            >
              <Link href="/portfolio" className="btn-primary">
                View Portfolio
              </Link>
              <Link href="/contact" className="btn-outline">
                Hire Me
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROJECTS SECTION */}
      <section className="featured-projects-section">
        <div className="container">
          <div className="featured-header">
            <div>
              <p className="featured-subtitle">
                Selected Work
              </p>
              <h2 className="featured-title">Featured Projects</h2>
            </div>
            <Link href="/portfolio" className="btn-text">
              All Projects
            </Link>
          </div>

          {(projectsLoading || settingsLoading) ? (
            <div className="projects-grid">
              {[1, 2, 3].map((n) => (
                <div key={n} className="card">
                  <div className="skeleton skeleton-card-img-height" />
                  <div className="skeleton-card-body">
                    <div className="skeleton skeleton-card-line-small" />
                    <div className="skeleton skeleton-card-line-large" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {featuredProjects.length === 0 ? (
                // Safe Mock Showcase in case database is empty so home page is beautiful out-of-the-box
                <div className="projects-grid">
                  {[
                    { _id: 'm1', title: 'Aether Brand Identity', category: 'Branding', coverImage: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=80', description: 'Rebranding concept for tech platform.' },
                    { _id: 'm2', title: 'Zenith UI/UX Platform', category: 'UI/UX', coverImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=80', description: 'SaaS product design and dashboard layouts.' },
                    { _id: 'm3', title: 'Chronos Poster Series', category: 'Print', coverImage: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=800&auto=format&fit=crop&q=80', description: 'Minimal poster set exploring spacetime.' }
                  ].map((proj) => (
                    <ProjectCard key={proj._id} project={proj} />
                  ))}
                </div>
              ) : (
                <div className="projects-grid">
                  {featuredProjects.slice(0, 3).map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* 3. SKILLS STRIP SECTION */}
      <section className="skills-strip-section">
        <div className="skills-marquee-container">
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: 'loop',
                duration: 25,
                ease: 'linear'
              }
            }}
            className="skills-marquee"
          >
            {/* Duplicated list to create infinite marquee effect */}
            {[...toolsList, ...toolsList, ...toolsList].map((tool, i) => (
              <div
                key={i}
                className="skills-marquee-item"
              >
                <span>{tool}</span>
                <span className="skills-marquee-bullet">&bull;</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. STATS SECTION */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="stat-card"
              >
                <h3 className="stat-value">
                  {stat.value}
                </h3>
                <p className="stat-label">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4.5. LATEST BLOGS SECTION */}
      <section className="featured-projects-section">
        <div className="container">
          <div className="featured-header">
            <div>
              <p className="featured-subtitle">
                Journal
              </p>
              <h2 className="featured-title">Latest Insights</h2>
            </div>
            <Link href="/blogs" className="btn-text">
              View All Articles
            </Link>
          </div>

          <div className="blogs-grid">
            {homeBlogs.map((blog) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="blog-card"
              >
                <div className="blog-card-img-box">
                  <Link href={`/blogs/${blog.slug}`}>
                    <img
                      src={blog.coverImage}
                      alt={blog.title}
                      loading="lazy"
                      className="blog-card-image"
                    />
                  </Link>
                </div>
                <div className="blog-card-content">
                  <div className="blog-card-meta">
                    <span className="blog-card-category">{blog.category}</span>
                    <span className="blog-card-dot">&bull;</span>
                    <span className="blog-card-date">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <Link href={`/blogs/${blog.slug}`}>
                    <h3 className="blog-card-title">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="blog-card-excerpt">
                    {blog.excerpt}
                  </p>
                  <div className="blog-card-footer">
                    <Link href={`/blogs/${blog.slug}`} className="blog-card-readmore">
                      Read Article
                    </Link>
                    <span className="blog-card-read-time">
                      {blog.readingTime}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-inner">
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="cta-title"
            >
              Ready to work together?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="cta-description"
            >
              Let's create something extraordinary. Get in touch to discuss your next project.
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cta-button-wrapper"
            >
              <Link
                href="/contact"
                className="btn-outline cta-talk-btn"
              >
                Let's Talk
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
