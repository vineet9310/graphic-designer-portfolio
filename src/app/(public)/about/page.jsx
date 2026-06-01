"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaPaintBrush, FaFigma, FaLaptopCode, FaCube } from 'react-icons/fa';

const About = () => {
  const skills = [
    { name: 'Brand Strategy & Identity', percentage: 95 },
    { name: 'UI/UX & Web Design', percentage: 90 },
    { name: 'Vector Illustration', percentage: 85 },
    { name: 'Motion & Promo Graphics', percentage: 80 },
    { name: '3D Modelling & Texturing', percentage: 75 }
  ];

  const tools = [
    { icon: <FaFigma />, name: 'Figma' },
    { icon: <FaPaintBrush />, name: 'Photoshop' },
    { icon: <FaLaptopCode />, name: 'Illustrator' },
    { icon: <FaCube />, name: 'Blender' },
    { icon: <FaPaintBrush />, name: 'After Effects' },
    { icon: <FaLaptopCode />, name: 'InDesign' }
  ];

  const timeline = [
    {
      year: '2023 - Present',
      role: 'Lead Brand & UI/UX Designer',
      company: 'PixelForge Studio',
      description: 'Designing brand guidelines, packaging, and modern high-fidelity web/app interfaces for global scale tech and lifestyle startups.'
    },
    {
      year: '2021 - 2023',
      role: 'Senior Graphic Designer',
      company: 'Apex Agency',
      description: 'Headed the creative direction for social campaigns, vector illustrations, and offline promotional assets for Fortune 500 clients.'
    },
    {
      year: '2019 - 2021',
      role: 'Junior Creative Designer',
      company: 'Vortex Media',
      description: 'Learned industry standards, assisted senior developers, designed monogram proposals, client presentation layouts, and print flyers.'
    },
    {
      year: '2015 - 2019',
      role: 'BFA in Graphic Design',
      company: 'Academy of Fine Arts',
      description: 'Studied core disciplines of visual composition, color theory, typography history, packaging blueprints, and human-centered design.'
    }
  ];

  return (
    <div style={{ padding: '6rem 0', backgroundColor: 'var(--bg-primary)' }}>
      <div className="container">
        
        {/* Split Section: Bio & Profile Photo */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '4rem',
            alignItems: 'center',
            marginBottom: '6rem'
          }}
          className="about-split"
        >
          {/* Bio Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p style={{ color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              My Story
            </p>
            <h1 style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
              I craft visual legacies for bold minds.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 300, lineHeight: 1.7 }}>
              Hello! I'm Alex, a creative director and multidisciplinary designer based in New York. With over 5 years of professional design experience, I specialize in transforming conceptual projects into highly engaging, modern visual assets.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2.5rem', fontWeight: 300, lineHeight: 1.7 }}>
              My philosophy revolves around minimalism, high contrast, and grid-based composition. I believe a brand identity should not just represent a company, but command attention and make viewers stop scrolling. Whether it's a sleek logo, an intricate SaaS dashboard, or vector posters, I approach every project with raw artistic intent and absolute precision.
            </p>
            
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert('Resume PDF link goes here!'); }}
              className="btn-primary"
            >
              <FaDownload /> Download Resume
            </a>
          </motion.div>

          {/* Portrait Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'relative' }}
          >
            {/* Red Frame Backing */}
            <div
              style={{
                position: 'absolute',
                inset: '15px -15px -15px 15px',
                border: '2px solid var(--accent)',
                borderRadius: '8px',
                zIndex: 1
              }}
            />
            {/* Image */}
            <div
              style={{
                position: 'relative',
                borderRadius: '8px',
                overflow: 'hidden',
                zIndex: 2,
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)'
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                alt="Alex Portrait"
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  filter: 'grayscale(100%)',
                  transition: 'filter 0.3s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'grayscale(0%)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'grayscale(100%)')}
              />
            </div>
          </motion.div>
        </div>

        {/* Split Section: Core Skills & Timeline */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: '5rem',
            borderTop: '1px solid var(--border)',
            paddingTop: '6rem'
          }}
          className="about-split"
        >
          {/* Left: Skills & Tools */}
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '2.5rem' }}>
              Skills & Expertise
            </h2>
            
            {/* Skill Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3.5rem' }}>
              {skills.map((skill, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>{skill.name}</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '0.9rem' }}>{skill.percentage}%</span>
                  </div>
                  {/* Track */}
                  <div style={{ height: '6px', backgroundColor: 'var(--bg-surface)', borderRadius: '3px', overflow: 'hidden' }}>
                    {/* Fill */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      style={{ height: '100%', backgroundColor: 'var(--accent)' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Software Grid */}
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem' }}>
              Favorite Weapons
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {tools.map((t, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '6px',
                    padding: '1rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.85rem',
                    fontWeight: 500
                  }}
                >
                  <span style={{ fontSize: '1.5rem', color: 'var(--accent)' }}>{t.icon}</span>
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Timeline */}
          <div>
            <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', marginBottom: '2.5rem' }}>
              My Journey
            </h2>
            
            {/* Timeline track */}
            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              {/* Vertical red line */}
              <div
                style={{
                  position: 'absolute',
                  left: '4px',
                  top: '8px',
                  bottom: '8px',
                  width: '2px',
                  backgroundColor: 'var(--border)'
                }}
              />
              
              {/* Timeline Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    style={{ position: 'relative' }}
                  >
                    {/* Bullet point */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 'calc(-2rem - 3.5px)',
                        top: '6px',
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--accent)',
                        boxShadow: '0 0 10px rgba(230, 57, 70, 0.6)'
                      }}
                    />
                    
                    <span
                      style={{
                        color: 'var(--accent)',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        display: 'block',
                        marginBottom: '0.25rem'
                      }}
                    >
                      {item.year}
                    </span>
                    
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {item.role}
                    </h3>
                    
                    <h4
                      style={{
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)',
                        fontWeight: 500,
                        marginBottom: '0.75rem'
                      }}
                    >
                      {item.company}
                    </h4>
                    
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 300, lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Media query styling for small viewports */}
      <style>{`
        @media (max-width: 850px) {
          .about-split {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
