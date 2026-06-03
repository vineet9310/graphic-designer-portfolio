"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlogs } from '@/hooks/useBlogs';
import { FaArrowRight } from 'react-icons/fa';

const Blogs = () => {
  const { blogs, loading, fetchBlogs } = useBlogs();
  const [selectedFilter, setSelectedFilter] = useState('All');

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const categories = [
    'All',
    'Design Theory',
    'Case Study',
    'UI/UX Insights',
    'Branding',
    'Typography',
    'Vector Art'
  ];

  // Mock blogs fallback in case database is empty so page looks amazing out-of-the-box
  const mockBlogs = [
    {
      _id: 'b1',
      title: 'The Psychology of Color in Visual Brand Identity',
      slug: 'psychology-of-color-brand-identity',
      excerpt: 'How choice of palette impacts user subconsciousness. A deep dive into selecting colors that evoke trust, passion, and premium brand status.',
      category: 'Branding',
      tags: ['Branding', 'Color Theory', 'Graphic Design'],
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
      tags: ['Typography', 'Web Design', 'Space Grotesk'],
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
      tags: ['UI/UX', 'Figma', 'Case Study'],
      coverImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=80',
      readingTime: '7 min read',
      createdAt: '2026-04-18T14:15:00.000Z'
    }
  ];

  const activeBlogs = blogs && blogs.length > 0 ? blogs : mockBlogs;

  const filteredBlogs = selectedFilter === 'All'
    ? activeBlogs
    : activeBlogs.filter(b => b.category === selectedFilter);

  const featuredBlog = filteredBlogs[0];
  const gridBlogs = filteredBlogs.slice(1);
  const sidebarBlogs = activeBlogs.slice(0, 4);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="blogs-page">
      <div className="container">
        
        {/* Header */}
        <div className="blogs-header">
          <p className="blogs-subtitle">
            Creative Journal
          </p>
          <h1 className="blogs-title">
            Insights & Stories
          </h1>
          <p className="blogs-description">
            Thought pieces, design blueprints, case studies, and tutorials exploring typography, brand identities, and high-impact digital systems.
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

        {/* Blogs Content */}
        {loading ? (
          <div>
            {/* Featured Blog Skeleton */}
            <div className="editorial-featured-section">
              <div className="editorial-featured-card">
                <div className="editorial-featured-img-box skeleton" />
                <div className="editorial-featured-content">
                  <div className="skeleton skeleton-card-line-small" />
                  <div className="skeleton skeleton-card-line-large" />
                  <div className="skeleton skeleton-card-line-large" />
                </div>
              </div>
            </div>
            {/* Grid & Sidebar Skeletons */}
            <div className="journal-split-layout">
              <div className="journal-editorial-grid">
                {[1, 2].map((n) => (
                  <div key={n} className="blog-card">
                    <div className="blog-card-img-box skeleton" />
                    <div className="blog-card-content">
                      <div className="skeleton skeleton-card-line-small" />
                      <div className="skeleton skeleton-card-line-large" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="journal-sidebar-section">
                <div className="skeleton skeleton-card-line-large" />
                <div className="journal-quick-list">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="journal-quick-item">
                      <div className="skeleton skeleton-card-line-small" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Featured Story Spotlight */}
            {featuredBlog && (
              <div className="editorial-featured-section">
                <Link href={`/blogs/${featuredBlog.slug}`}>
                  <div className="editorial-featured-card">
                    <div className="editorial-featured-img-box">
                      <img
                        src={featuredBlog.coverImage}
                        alt={featuredBlog.title}
                        className="editorial-featured-img"
                      />
                    </div>
                    <div className="editorial-featured-content">
                      <div className="editorial-featured-meta">
                        <span className="editorial-featured-category">{featuredBlog.category}</span>
                        <span className="blog-card-dot">&bull;</span>
                        <span className="editorial-featured-date">{formatDate(featuredBlog.createdAt)}</span>
                      </div>
                      <h2 className="editorial-featured-title">{featuredBlog.title}</h2>
                      <p className="editorial-featured-excerpt">{featuredBlog.excerpt}</p>
                      <div className="editorial-featured-footer">
                        <span className="editorial-featured-readmore">
                          Read Article <FaArrowRight />
                        </span>
                        <span className="editorial-featured-read-time">{featuredBlog.readingTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Split layout for grid entries and sidebar quick list */}
            {filteredBlogs.length > 0 && (
              <div className="journal-split-layout">
                {/* Left Side Grid of articles */}
                <div>
                  {gridBlogs.length > 0 ? (
                    <motion.div
                      layout
                      className="journal-editorial-grid"
                    >
                      <AnimatePresence mode="popLayout">
                        {gridBlogs.map((blog) => (
                          <motion.div
                            layout
                            key={blog._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
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
                                <span className="blog-card-date">{formatDate(blog.createdAt)}</span>
                              </div>
                              <Link href={`/blogs/${blog.slug}`}>
                                <h3 className="blog-card-title">{blog.title}</h3>
                              </Link>
                              <p className="blog-card-excerpt">{blog.excerpt}</p>
                              <div className="blog-card-footer">
                                <Link href={`/blogs/${blog.slug}`} className="blog-card-readmore">
                                  Read Story <FaArrowRight className="blogs-icon-arrow" />
                                </Link>
                                <span className="blog-card-read-time">{blog.readingTime}</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </motion.div>
                  ) : (
                    featuredBlog && (
                      <div className="empty-state">
                        <p className="empty-state-text">
                          You've read our featured article! Check out other categories.
                        </p>
                      </div>
                    )
                  )}
                </div>

                {/* Right Side Trending Sidebar */}
                <div className="journal-sidebar-section">
                  <h3 className="journal-sidebar-title">Trending Insights</h3>
                  <div className="journal-quick-list">
                    {sidebarBlogs.map((blog, idx) => (
                      <Link href={`/blogs/${blog.slug}`} key={blog._id}>
                        <div className="journal-quick-item">
                          <span className="journal-quick-num">
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          <div className="journal-quick-meta">
                            <span className="journal-quick-category">{blog.category}</span>
                            <h4 className="journal-quick-title">{blog.title}</h4>
                            <span className="journal-quick-read-time">{blog.readingTime}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!loading && filteredBlogs.length === 0 && (
          <div className="empty-state">
            <p className="empty-state-text">
              No journal posts found in this category yet.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Blogs;
