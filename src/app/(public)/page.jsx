"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useProjects } from '@/hooks/useProjects';
import ProjectCard from '@/components/ProjectCard';

const Home = () => {
  const { featuredProjects, loading, fetchFeaturedProjects } = useProjects();

  useEffect(() => {
    fetchFeaturedProjects();
  }, [fetchFeaturedProjects]);

  const toolsList = [
    'Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'Adobe After Effects', 
    'Blender 3D', 'Cinema 4D', 'Procreate', 'InDesign', 'Premiere Pro'
  ];

  const stats = [
    { value: '50+', label: 'Projects Completed' },
    { value: '30+', label: 'Happy Clients' },
    { value: '5+', label: 'Years Experience' },
    { value: '100%', label: 'Client Satisfaction' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', overflow: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
      <section
        style={{
          height: 'calc(100vh - 75px)',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          padding: '2rem 0'
        }}
      >
        {/* Animated Background Shapes */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
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
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 4}px`,
                height: `${Math.random() * 6 + 4}px`,
                borderRadius: '50%',
                backgroundColor: 'var(--accent)',
                filter: 'blur(1px)'
              }}
            />
          ))}
          
          {/* Subtle Accent Glow */}
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '-10%',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            backgroundColor: 'rgba(230, 57, 70, 0.04)',
            filter: 'blur(80px)'
          }} />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '800px' }}>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                color: 'var(--accent)',
                fontWeight: 600,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}
            >
              Graphic & Brand Designer
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{
                fontSize: 'clamp(2.5rem, 6.5vw, 4.5rem)',
                lineHeight: 1.1,
                marginBottom: '1.5rem',
                fontFamily: 'var(--font-heading)'
              }}
            >
              I design things that make people stop scrolling.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                color: 'var(--text-secondary)',
                marginBottom: '2.5rem',
                fontWeight: 300,
                maxWidth: '600px'
              }}
            >
              Crafting premium visual identities, digital products, and high-impact designs for bold brands worldwide.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}
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
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '3.5rem'
          }}>
            <div>
              <p style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                Selected Work
              </p>
              <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)' }}>Featured Projects</h2>
            </div>
            <Link href="/portfolio" className="btn-text">
              All Projects
            </Link>
          </div>

          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '2rem'
            }}>
              {[1, 2, 3].map((n) => (
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
            <>
              {featuredProjects.length === 0 ? (
                // Safe Mock Showcase in case database is empty so home page is beautiful out-of-the-box
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '2rem'
                }}>
                  {[
                    { _id: 'm1', title: 'Aether Brand Identity', category: 'Branding', coverImage: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&auto=format&fit=crop&q=80', description: 'Rebranding concept for tech platform.' },
                    { _id: 'm2', title: 'Zenith UI/UX Platform', category: 'UI/UX', coverImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=80', description: 'SaaS product design and dashboard layouts.' },
                    { _id: 'm3', title: 'Chronos Poster Series', category: 'Print', coverImage: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=800&auto=format&fit=crop&q=80', description: 'Minimal poster set exploring spacetime.' }
                  ].map((proj) => (
                    <ProjectCard key={proj._id} project={proj} />
                  ))}
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                  gap: '2rem'
                }}>
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
      <section style={{
        padding: '3rem 0',
        backgroundColor: 'var(--bg-primary)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        position: 'relative'
      }}>
        <div style={{ width: '100%', overflow: 'hidden' }}>
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
            style={{
              display: 'flex',
              gap: '4rem',
              alignItems: 'center',
              width: 'max-content',
              paddingRight: '4rem'
            }}
          >
            {/* Duplicated list to create infinite marquee effect */}
            {[...toolsList, ...toolsList, ...toolsList].map((tool, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.02em',
                  fontFamily: 'var(--font-heading)'
                }}
              >
                <span>{tool}</span>
                <span style={{ color: 'var(--accent)', fontSize: '1.5rem' }}>&bull;</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. STATS SECTION */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '3rem',
            textAlign: 'center'
          }}>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{
                  padding: '1.5rem',
                  borderRight: index < 3 ? '1px solid var(--border)' : 'none'
                }}
                className="stat-card"
              >
                <h3 style={{
                  fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-heading)',
                  marginBottom: '0.5rem'
                }}>
                  {stat.value}
                </h3>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase'
                }}>
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            backgroundColor: 'var(--accent)',
            padding: '6rem 0',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2
          }}
        >
          <div className="container" style={{ maxWidth: '700px' }}>
            <motion.h2
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                color: '#ffffff',
                fontFamily: 'var(--font-heading)',
                fontWeight: 800,
                marginBottom: '1.5rem',
                lineHeight: 1.1
              }}
            >
              Ready to work together?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '2.5rem',
                fontWeight: 300
              }}
            >
              Let's create something extraordinary. Get in touch to discuss your next project.
            </motion.p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ display: 'inline-block' }}
            >
              <Link
                href="/contact"
                className="btn-outline"
                style={{
                  backgroundColor: '#ffffff',
                  color: 'var(--bg-primary)',
                  borderColor: '#ffffff',
                  fontWeight: 700,
                  padding: '1rem 2.5rem',
                  fontSize: '1rem'
                }}
              >
                Let's Talk
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Mobile custom styles for border overrides */}
      <style>{`
        @media (max-width: 768px) {
          .stat-card {
            border-right: none !important;
            border-bottom: 1px solid var(--border) !important;
            padding-bottom: 2rem !important;
          }
          .stat-card:last-child {
            border-bottom: none !important;
            padding-bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;
