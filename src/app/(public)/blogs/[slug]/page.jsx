"use client";

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useBlogs } from '@/hooks/useBlogs';
import { useSettings } from '@/hooks/useSettings';
import { FaArrowLeft, FaCalendarAlt, FaClock, FaTag, FaInstagram, FaBehance, FaLinkedinIn } from 'react-icons/fa';

const BlogDetail = ({ params: paramsPromise }) => {
  const params = use(paramsPromise);
  const { slug } = params;
  const { getBlogBySlugOrId, loading } = useBlogs();
  const { settings, loading: settingsLoading } = useSettings();
  const [blog, setBlog] = useState(null);

  // Mock blogs content in case they click a mock item
  const mockBlogDetails = {
    'psychology-of-color-brand-identity': {
      title: 'The Psychology of Color in Visual Brand Identity',
      excerpt: 'How choice of palette impacts user subconsciousness. A deep dive into selecting colors that evoke trust, passion, and premium brand status.',
      category: 'Branding',
      tags: ['Branding', 'Color Theory', 'Graphic Design'],
      coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200&auto=format&fit=crop&q=80',
      readingTime: '5 min read',
      createdAt: '2026-05-15T09:00:00.000Z',
      content: `
        <h2>Color is the First Communicator</h2>
        <p>Before a user reads a word of copy or examines the structure of a logo, their subconscious mind registers the color palette. Color theory isn't just about what looks good; it's a direct emotional bridge. When establishing a visual brand identity, choosing colors must be an exercise in psychology.</p>

        <blockquote>
          "Color is a power which directly influences the soul." — Wassily Kandinsky
        </blockquote>

        <h2>The Emotional Weight of Red</h2>
        <p>In our portfolio, we heavily feature a vibrant red accent (<code>#e63946</code>) contrasted against absolute dark tones. Red triggers physiological responses—it raises the heart rate, creates urgency, and commands attention. By placing it in a dark-mode environment, we contain the energy, shifting it from aggressive to premium, passionate, and modern.</p>

        <h3>Core Hues and Their Psychological Triggers:</h3>
        <ul>
          <li><strong>Vibrant Red:</strong> Passion, energy, instant visibility, courage.</li>
          <li><strong>Absolute Black:</strong> Mystery, authority, premium luxury, ultimate contrast.</li>
          <li><strong>Off-White/Silver:</strong> Cleanliness, modernism, visual breathability.</li>
        </ul>

        <h2>Establishing a Palette System</h2>
        <p>When designing for clients at VividForge, we follow the 60-30-10 rule. 60% of the canvas consists of a dominant tone (usually dark gray/black to provide visual comfort), 30% is a secondary body tone (off-white for crisp readability), and 10% is our hot accent color (vibrant red) which acts as the focal anchor for user call-to-actions.</p>

        <p>By keeping the accent color restricted to only 10% of the screen, we preserve its psychological power. If everything is highlighted, nothing is highlighted.</p>
      `
    },
    'typography-rules-space-grotesk': {
      title: 'Typography Rules: Why Space Grotesk dominates Modern Web Design',
      excerpt: 'Exploring the history and proportions of Space Grotesk. Learn how geometric layouts and sans-serif spacing amplify layout structures and visual margins.',
      category: 'Typography',
      tags: ['Typography', 'Web Design', 'Space Grotesk'],
      coverImage: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=1200&auto=format&fit=crop&q=80',
      readingTime: '4 min read',
      createdAt: '2026-05-02T10:30:00.000Z',
      content: `
        <h2>The Geometric Sans-Serif Revolution</h2>
        <p>Typography is the skeleton of web design. If your layout typography is weak, your design will collapse, no matter how beautiful your graphics are. Space Grotesk has emerged as one of the most powerful free display typefaces of the decade. It is a geometric sans-serif that balances tech vibes with extreme structural readability.</p>

        <blockquote>
          "Good typography is silent. It leads the eye, it does not scream."
        </blockquote>

        <h2>Proportions & Spacing</h2>
        <p>Space Grotesk is designed with distinct wide terminals and geometric circle shapes. When using it as a display font (headers and callouts), we recommend keeping the letter-spacing slightly condensed (<code>-0.02em</code> to <code>-0.03em</code>). This forces the visual letters closer together, creating a unified block-like aesthetic that screams brand authority.</p>

        <h3>Key Typographic Rules:</h3>
        <ol>
          <li><strong>Strict Line-Height ratios:</strong> For display headers, maintain a line height of 1.1x to 1.2x. For body text, keep it relaxed at 1.6x to 1.8x.</li>
          <li><strong>Font Pairing:</strong> Pair a display geometric font like Space Grotesk with a highly legible, clean sans-serif like Inter for body copy. This creates a crisp hierarchy.</li>
          <li><strong>Size Contrast:</strong> Ensure your headers are at least 2.5 times larger than your body copy to immediately guide the reader.</li>
        </ol>

        <h2>Implementation in VividForge</h2>
        <p>We use Space Grotesk for all major headings across our site. It matches the technical precision of our graphic design philosophy and pairs perfectly with our minimalistic grid layouts. By combining geometric sans-serifs with high color contrast, we achieve that premium, state-of-the-art feel.</p>
      `
    },
    'neo-futurism-dashboard-ui-ux': {
      title: 'Neo-Futurism: Designing Dashboard Interfaces for the Next Generation',
      excerpt: 'Case study in designing high-contrast dashboard systems. Balanced dark themes, bright borders, and component cards that maximize data density without visual clutter.',
      category: 'UI/UX Insights',
      tags: ['UI/UX', 'Figma', 'Case Study'],
      coverImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1200&auto=format&fit=crop&q=80',
      readingTime: '7 min read',
      createdAt: '2026-04-18T14:15:00.000Z',
      content: `
        <h2>The Rise of Neo-Futuristic UI</h2>
        <p>In modern UI/UX design, users expect more than just static grids. They want interfaces that feel alive, glow, and react to their movements. Neo-futurism blends dark mode environments with subtle gradients, structural cards, and sharp color contrasts. This case study details our layout specs for the Zenith dashboard platform.</p>

        <blockquote>
          "Simplicity is the ultimate sophistication." — Leonardo da Vinci
        </blockquote>

        <h2>The Anatomy of Zenith UI</h2>
        <p>Zenith features a multi-column dashboard. Our goals were to maximize data display, keep load times high, and ensure visual hierarchy remains readable under intense operational environments. Here is how we built it in Figma:</p>

        <h3>1. Glassmorphism Borders</h3>
        <p>Instead of solid dark lines, we used semi-transparent borders (<code>1px solid rgba(255, 255, 255, 0.08)</code>). This creates a high-tech glass pane effect, letting the background accent colors bleed through subtly.</p>

        <h3>2. Hot Point Micro-Animations</h3>
        <p>Every active element contains hover effects powered by Framer Motion. When a card is hovered, it scales up by 1% and its border color glows red, giving the user immediate tactile feedback.</p>

        <h2>Zenith Component Checklist</h2>
        <ul>
          <li><strong>Left Sidebar:</strong> Minimal icon icons, active state highlighted with accent red bar.</li>
          <li><strong>Analytics Grid:</strong> Responsive card modules with shimmer skeleton load animations.</li>
          <li><strong>Figma Design Tokens:</strong> Absolute HSL system mapped variables (H: 355, S: 78%, L: 56%) for accent branding.</li>
        </ul>

        <h2>Final Thoughts</h2>
        <p>By avoiding browser defaults, importing modern fonts, and applying custom scrollbars, Zenith stands out as a premium dashboard. It proves that you can display highly dense charts while maintaining a clean, premium, and clean layout.</p>
      `
    }
  };

  useEffect(() => {
    const loadBlog = async () => {
      try {
        const dbBlog = await getBlogBySlugOrId(slug);
        if (dbBlog) {
          setBlog(dbBlog);
        }
      } catch (err) {
        // Fall back to mock if slug exists in mock details
        if (mockBlogDetails[slug]) {
          setBlog(mockBlogDetails[slug]);
        }
      }
    };
    loadBlog();
  }, [slug]);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if ((loading || settingsLoading) && !blog) {
    return (
      <div className="about-loading-container">
        <div className="skeleton about-loading-skeleton" />
      </div>
    );
  }

  if (settings?.navbar?.blogs === false) {
    return (
      <div className="services-disabled-container" style={{ padding: '10rem 0', minHeight: '60vh', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem', color: 'var(--text-primary)' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>This page is currently disabled by the site administrator.</p>
        <Link href="/" className="btn-primary">Return Home</Link>
      </div>
    );
  }

  if (!blog && !loading && !settingsLoading) {
    return (
      <div className="blogs-page">
        <div className="container blog-detail-not-found">
          <h2 className="section-title">Article Not Found</h2>
          <p className="empty-state-text">The blog post you are looking for does not exist.</p>
          <Link href="/blogs" className="btn-primary blog-detail-not-found-btn">
            Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  const renderBlogContent = (content) => {
    if (!content) return null;
    
    // Check if content has HTML elements (like <p>, <br>, <h2>, <ul>, etc.)
    const hasHtml = /<[a-z][\s\S]*>/i.test(content);
    
    if (hasHtml) {
      return (
        <div 
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }
    
    // Otherwise, treat as raw text:
    const paragraphs = content
      .split(/\n\s*\n/)
      .map(p => p.trim())
      .filter(p => p.length > 0);
      
    return (
      <div className="blog-post-content raw-text-content">
        {paragraphs.map((para, idx) => {
          const lines = para.split('\n');
          return (
            <p key={idx} style={{ marginBottom: '1.8rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
              {lines.map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  {line}
                  {lIdx < lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <article className="blog-post-page">
      <div className="container">
        
        {/* Back Button */}
        <Link href="/blogs" className="blog-post-back">
          <FaArrowLeft className="blog-detail-back-icon" /> Back to Journal
        </Link>

        {/* Header Block */}
        <header className="blog-post-header">
          <div className="blog-post-meta">
            <span className="blog-post-category">{blog.category}</span>
            <span className="blog-card-dot">&bull;</span>
            <span className="blog-post-date"><FaCalendarAlt className="blog-detail-meta-icon" /> {formatDate(blog.createdAt)}</span>
            <span className="blog-card-dot">&bull;</span>
            <span className="blog-post-readtime"><FaClock className="blog-detail-meta-icon" /> {blog.readingTime}</span>
          </div>

          <h1 className="blog-post-title">
            {blog.title}
          </h1>
        </header>

        {/* Hero Image */}
        <div className="blog-post-hero-image-box">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="blog-post-hero-image"
          />
        </div>

        {/* Editorial Split Layout */}
        <div className="blog-detail-split">
          
          {/* Main Article Body */}
          <div>
            {renderBlogContent(blog.content)}

            {/* Tags Footer inside main body */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="blog-post-tags">
                <span className="blog-post-tags-title"><FaTag className="blog-detail-tag-icon" /> Tags:</span>
                {blog.tags.map((tag, idx) => (
                  <span key={idx} className="blog-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="blog-detail-sidebar">
            
            {/* Author Card */}
            <div className="blog-sidebar-card">
              <div className="blog-sidebar-author-header">
                <div className="blog-sidebar-author-avatar">
                  VF
                </div>
                <div>
                  <h4 className="blog-sidebar-author-name">Ishika</h4>
                  <span className="blog-sidebar-author-title">Creative Director</span>
                </div>
              </div>
              <p className="blog-sidebar-author-bio">
                Lead designer and brand consultant at VividForge. Specializing in high-contrast visual systems, UI layout structures, and geometric illustrations.
              </p>
              <div className="blog-sidebar-socials">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="blog-sidebar-social-link" title="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://behance.net" target="_blank" rel="noopener noreferrer" className="blog-sidebar-social-link" title="Behance">
                  <FaBehance />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="blog-sidebar-social-link" title="LinkedIn">
                  <FaLinkedinIn />
                </a>
              </div>
            </div>

            {/* Recommended / Recent Journal Picks */}
            <div className="blog-sidebar-card">
              <h4 className="blog-sidebar-author-name">Journal Picks</h4>
              <div className="blog-sidebar-recents-list">
                {Object.keys(mockBlogDetails)
                  .filter(key => key !== slug)
                  .slice(0, 2)
                  .map(key => {
                    const item = mockBlogDetails[key];
                    return (
                      <div key={key} className="blog-sidebar-recent-item">
                        <span className="blog-sidebar-recent-cat">{item.category}</span>
                        <Link href={`/blogs/${key}`} className="blog-sidebar-recent-title">
                          {item.title}
                        </Link>
                      </div>
                    );
                  })
                }
              </div>
            </div>

          </aside>

        </div>

      </div>
    </article>
  );
};

export default BlogDetail;
