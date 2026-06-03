"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaPaintBrush, FaFigma, FaLaptopCode, FaCube, FaCheck } from 'react-icons/fa';
import { useSettings } from '@/hooks/useSettings';

const About = () => {
  const { settings, loading } = useSettings();

  const skills = settings?.skills && settings.skills.length > 0
    ? settings.skills
    : [
        { name: 'Brand Strategy & Identity', percentage: 95 },
        { name: 'UI/UX & Web Design', percentage: 90 },
        { name: 'Vector Illustration', percentage: 85 },
        { name: 'Motion & Promo Graphics', percentage: 80 },
        { name: '3D Modelling & Texturing', percentage: 75 }
      ];

  // Helper function to return icon for tool
  const getToolIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('figma')) return <FaFigma />;
    if (n.includes('blender')) return <FaCube />;
    if (n.includes('illustrator') || n.includes('indesign')) return <FaLaptopCode />;
    return <FaPaintBrush />;
  };

  const tools = settings?.tools && settings.tools.length > 0
    ? settings.tools.map(t => ({ icon: getToolIcon(t), name: t }))
    : [
        { icon: <FaFigma />, name: 'Figma' },
        { icon: <FaPaintBrush />, name: 'Photoshop' },
        { icon: <FaLaptopCode />, name: 'Illustrator' },
        { icon: <FaCube />, name: 'Blender' },
        { icon: <FaPaintBrush />, name: 'After Effects' },
        { icon: <FaLaptopCode />, name: 'InDesign' }
      ];

  const timeline = settings?.timeline && settings.timeline.length > 0
    ? settings.timeline
    : [
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

  const bioParagraph1 = settings?.about?.bioParagraph1 || "Hello! I'm the lead designer behind VividForge, a creative agency and multidisciplinary design studio. With over 5 years of professional design experience, we specialize in transforming conceptual projects into highly engaging, modern visual assets.";
  const bioParagraph2 = settings?.about?.bioParagraph2 || "My philosophy revolves around minimalism, high contrast, and grid-based composition. I believe a brand identity should not just represent a company, but command attention and make viewers stop scrolling. Whether it's a sleek logo, an intricate SaaS dashboard, or vector posters, I approach every project with raw artistic intent and absolute precision.";
  const resumeUrl = settings?.about?.resumeUrl || '#';
  const portraitImage = settings?.about?.portraitImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80";

  if (loading) {
    return (
      <div className="about-loading-container">
        <div className="skeleton about-loading-skeleton" />
      </div>
    );
  }

  return (
    <div className="about-page">
      <div className="container">
        
        {/* Split Section: Bio & Profile Photo */}
        <div className="about-split">
          {/* Bio Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="about-subtitle">
              My Story
            </p>
            <h1 className="about-title">
              I craft visual legacies for bold minds.
            </h1>
            <p className="about-bio-p1">
              {bioParagraph1}
            </p>
            <p className="about-bio-p2">
              {bioParagraph2}
            </p>
            
            {resumeUrl && resumeUrl !== '#' ? (
              <a 
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <FaDownload /> Download Resume
              </a>
            ) : (
              <a 
                href="#" 
                onClick={(e) => { e.preventDefault(); alert('Resume PDF not uploaded yet!'); }}
                className="btn-primary"
              >
                <FaDownload /> Download Resume
              </a>
            )}
          </motion.div>

          {/* Portrait Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="about-portrait-wrapper"
          >
            {/* Red Frame Backing */}
            <div className="about-portrait-frame" />
            {/* Image */}
            <div className="about-portrait-img-box">
              <img
                src={portraitImage}
                alt="VividForge Portrait"
                loading="lazy"
                className="about-portrait-image"
              />
            </div>
          </motion.div>
        </div>

        {/* Split Section: Core Skills & Timeline */}
        <div className="about-split-skills-timeline">
          {/* Left: Skills & Tools */}
          <div>
            <h2 className="about-section-heading">
              Skills & Expertise
            </h2>
            
            {/* Skill Bars */}
            <div className="about-skills-wrapper">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="about-skill-header">
                    <span className="about-skill-name">{skill.name}</span>
                    <span className="about-skill-percent">{skill.percentage}%</span>
                  </div>
                  {/* Track */}
                  <div className="about-skill-track">
                    {/* Fill */}
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="about-skill-fill"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Software Grid */}
            <h3 className="about-tools-heading">
              Favorite Weapons
            </h3>
            <div className="about-tools-grid">
              {tools.map((t, i) => (
                <div
                  key={i}
                  className="about-tool-card"
                >
                  <span className="about-tool-icon">{t.icon}</span>
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Timeline */}
          <div>
            <h2 className="about-section-heading">
              My Journey
            </h2>
            
            {/* Timeline track */}
            <div className="about-timeline">
              {/* Vertical red line */}
              <div className="about-timeline-line" />
              
              {/* Timeline Items */}
              <div className="about-timeline-list">
                {timeline.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="about-timeline-item"
                  >
                    {/* Bullet point */}
                    <div className="about-timeline-bullet" />
                    
                    <span className="about-timeline-year">
                      {item.year}
                    </span>
                    
                    <h3 className="about-timeline-role">
                      {item.role}
                    </h3>
                    
                    <h4 className="about-timeline-company">
                      {item.company}
                    </h4>
                    
                    <p className="about-timeline-desc">
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
