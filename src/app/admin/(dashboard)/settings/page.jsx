"use client";

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { toast } from 'react-hot-toast';
import { FaSave, FaPlus, FaTrashAlt, FaInfoCircle, FaRegStar, FaStar, FaTimes } from 'react-icons/fa';

const AdminSettings = () => {
  const { settings, loading, error, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic States reflecting schema fields
  const [hero, setHero] = useState({ subtitle: '', title: '', description: '' });
  const [about, setAbout] = useState({ bioParagraph1: '', bioParagraph2: '', resumeUrl: '', portraitImage: '' });
  const [contact, setContact] = useState({ email: '', location: '', phone: '', instagramUrl: '', behanceUrl: '', linkedinUrl: '' });
  const [navbar, setNavbar] = useState({ home: true, portfolio: true, about: true, services: true, contact: true });
  const [stats, setStats] = useState([]);
  const [tools, setTools] = useState([]);
  const [newTool, setNewTool] = useState('');
  const [skills, setSkills] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);

  // Sync state once data loaded
  useEffect(() => {
    if (settings) {
      setHero(settings.hero || { subtitle: '', title: '', description: '' });
      setAbout(settings.about || { bioParagraph1: '', bioParagraph2: '', resumeUrl: '', portraitImage: '' });
      setContact(settings.contact || { email: '', location: '', phone: '', instagramUrl: '', behanceUrl: '', linkedinUrl: '' });
      setNavbar(settings.navbar || { home: true, portfolio: true, about: true, services: true, contact: true });
      setStats(settings.stats || []);
      setTools(settings.tools || []);
      setSkills(settings.skills || []);
      setTimeline(settings.timeline || []);
      setServices(settings.services || []);
      setPackages(settings.packages || []);
    }
  }, [settings]);

  if (loading) {
    return (
      <div style={{ height: '300px' }}>
        <div className="skeleton" style={{ height: '100%', width: '100%' }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center', borderColor: 'var(--accent)' }}>
        <p style={{ color: 'var(--accent)' }}>Failed to load configurations: {error}</p>
      </div>
    );
  }

  // General Form Handlers
  const handleHeroChange = (e) => setHero({ ...hero, [e.target.name]: e.target.value });
  const handleAboutChange = (e) => setAbout({ ...about, [e.target.name]: e.target.value });
  const handleContactChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });

  // Arrays modifications: Stats
  const handleStatChange = (idx, field, value) => {
    const updated = stats.map((stat, i) => i === idx ? { ...stat, [field]: value } : stat);
    setStats(updated);
  };
  const addStat = () => setStats([...stats, { value: '0', label: 'New Stat' }]);
  const removeStat = (idx) => setStats(stats.filter((_, i) => i !== idx));

  // Arrays modifications: Tools
  const addTool = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      e.preventDefault();
      const val = newTool.trim();
      if (val && !tools.includes(val)) {
        setTools([...tools, val]);
        setNewTool('');
      }
    }
  };
  const removeTool = (val) => setTools(tools.filter(t => t !== val));

  // Arrays modifications: Skills
  const handleSkillChange = (idx, field, value) => {
    const updated = skills.map((skill, i) => i === idx ? { ...skill, [field]: field === 'percentage' ? Number(value) : value } : skill);
    setSkills(updated);
  };
  const addSkill = () => setSkills([...skills, { name: 'Brand Identity', percentage: 90 }]);
  const removeSkill = (idx) => setSkills(skills.filter((_, i) => i !== idx));

  // Arrays modifications: Timeline
  const handleTimelineChange = (idx, field, value) => {
    const updated = timeline.map((time, i) => i === idx ? { ...time, [field]: value } : time);
    setTimeline(updated);
  };
  const addTimeline = () => setTimeline([...timeline, { year: '2025', role: 'Role Name', company: 'Company Name', description: 'Brief descriptions...' }]);
  const removeTimeline = (idx) => setTimeline(timeline.filter((_, i) => i !== idx));

  // Arrays modifications: Services
  const handleServiceChange = (idx, field, value) => {
    const updated = services.map((srv, i) => i === idx ? { ...srv, [field]: value } : srv);
    setServices(updated);
  };
  const handleServiceIncludesChange = (idx, incIdx, value) => {
    const srv = services[idx];
    const newIncludes = srv.includes.map((inc, i) => i === incIdx ? value : inc);
    handleServiceChange(idx, 'includes', newIncludes);
  };
  const addServiceIncludes = (idx) => {
    const srv = services[idx];
    handleServiceChange(idx, 'includes', [...srv.includes, 'Feature Detail']);
  };
  const removeServiceIncludes = (idx, incIdx) => {
    const srv = services[idx];
    handleServiceChange(idx, 'includes', srv.includes.filter((_, i) => i !== incIdx));
  };
  const addService = () => setServices([...services, { title: 'Service Title', description: 'Description of service', includes: [], visible: true }]);
  const removeService = (idx) => setServices(services.filter((_, i) => i !== idx));

  // Arrays modifications: Packages
  const handlePackageChange = (idx, field, value) => {
    const updated = packages.map((pkg, i) => i === idx ? { ...pkg, [field]: field === 'featured' ? Boolean(value) : value } : pkg);
    setPackages(updated);
  };
  const handlePackageFeaturesChange = (idx, featIdx, value) => {
    const pkg = packages[idx];
    const newFeatures = pkg.features.map((feat, i) => i === featIdx ? value : feat);
    handlePackageChange(idx, 'features', newFeatures);
  };
  const addPackageFeature = (idx) => {
    const pkg = packages[idx];
    handlePackageChange(idx, 'features', [...pkg.features, 'Premium Inclusion']);
  };
  const removePackageFeature = (idx, featIdx) => {
    const pkg = packages[idx];
    handlePackageChange(idx, 'features', pkg.features.filter((_, i) => i !== featIdx));
  };
  const addPackage = () => setPackages([...packages, { name: 'Package Tier', price: '$999', description: 'Package brief', features: [], featured: false }]);
  const removePackage = (idx) => setPackages(packages.filter((_, i) => i !== idx));

  // Form Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const toastId = toast.loading('Publishing site configurations...');

    const payload = {
      hero,
      about,
      stats,
      tools,
      skills,
      timeline,
      services,
      packages,
      contact,
      navbar
    };

    const result = await updateSettings(payload);

    if (result.success) {
      toast.success('Site configurations updated successfully!', { id: toastId });
    } else {
      toast.error(`Update failed: ${result.message}`, { id: toastId });
    }
    setIsSaving(false);
  };

  const tabs = [
    { id: 'hero', name: 'Hero & Stats' },
    { id: 'about', name: 'About & Skills' },
    { id: 'services', name: 'Services & Packages' },
    { id: 'contact', name: 'Contact & Socials' },
    { id: 'navbar', name: 'Navbar Visibility' }
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
            Site Configuration
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Manage the entire dynamic frontend contents, banners, bio, tools lists, pricing, and contact handles.
          </p>
        </div>
        <button onClick={handleSubmit} className="btn-primary" disabled={isSaving}>
          <FaSave /> {isSaving ? 'Saving...' : 'Save Site Settings'}
        </button>
      </div>

      {/* Tabs navigation */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          gap: '1rem',
          marginBottom: '2.5rem',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                padding: '0.75rem 1.25rem',
                fontSize: '0.95rem',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Form Content Wrapper */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Tab 1: Hero & Stats */}
        {activeTab === 'hero' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
                Landing Hero Section
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label className="form-label">Hero Subtitle Badge</label>
                  <input
                    type="text"
                    name="subtitle"
                    value={hero.subtitle}
                    onChange={handleHeroChange}
                    className="form-input"
                    placeholder="Graphic & Brand Designer"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Hero Title (Main Tagline)</label>
                  <input
                    type="text"
                    name="title"
                    value={hero.title}
                    onChange={handleHeroChange}
                    className="form-input"
                    placeholder="I design things that make people stop scrolling."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Hero Description</label>
                  <textarea
                    name="description"
                    value={hero.description}
                    onChange={handleHeroChange}
                    className="form-textarea"
                    placeholder="Describe your design specialty..."
                  />
                </div>
              </div>
            </div>

            {/* Stats section */}
            <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                  Performance Stats Metrics
                </h3>
                <button type="button" onClick={addStat} className="btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                  <FaPlus /> Add Stat
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {stats.map((stat, idx) => (
                  <div key={idx} className="card" style={{ padding: '1.25rem', backgroundColor: 'var(--bg-primary)', position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => removeStat(idx)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        cursor: 'pointer'
                      }}
                    >
                      <FaTrashAlt style={{ fontSize: '0.8rem' }} />
                    </button>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Stat Value (e.g. 50+)</label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                          className="form-input"
                          style={{ padding: '0.5rem' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Stat Label (e.g. Happy Clients)</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                          className="form-input"
                          style={{ padding: '0.5rem' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: About & Skills */}
        {activeTab === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
                Creative Bio Details
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Bio Portrait Image URL</label>
                    <input
                      type="text"
                      name="portraitImage"
                      value={about.portraitImage}
                      onChange={handleAboutChange}
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Resume Link (PDF URL)</label>
                    <input
                      type="text"
                      name="resumeUrl"
                      value={about.resumeUrl}
                      onChange={handleAboutChange}
                      className="form-input"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Bio Paragraph 1</label>
                  <textarea
                    name="bioParagraph1"
                    value={about.bioParagraph1}
                    onChange={handleAboutChange}
                    className="form-textarea"
                    style={{ minHeight: '100px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bio Paragraph 2</label>
                  <textarea
                    name="bioParagraph2"
                    value={about.bioParagraph2}
                    onChange={handleAboutChange}
                    className="form-textarea"
                    style={{ minHeight: '100px' }}
                  />
                </div>
              </div>
            </div>

            {/* Skills & Weapons section */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="form-grid">
              
              {/* Skills sliders list */}
              <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                    Visual Skills
                  </h3>
                  <button type="button" onClick={addSkill} className="btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                    <FaPlus /> Add Skill
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {skills.map((skill, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', backgroundColor: 'var(--bg-primary)', padding: '0.75rem 1rem', borderRadius: '4px', border: '1px solid var(--border)' }}>
                      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => handleSkillChange(idx, 'name', e.target.value)}
                          className="form-input"
                          style={{ padding: '0.35rem', fontSize: '0.85rem' }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.percentage}
                            onChange={(e) => handleSkillChange(idx, 'percentage', e.target.value)}
                            style={{ flexGrow: 1, accentColor: 'var(--accent)' }}
                          />
                          <span style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, minWidth: '35px' }}>{skill.percentage}%</span>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeSkill(idx)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
                        <FaTrashAlt style={{ fontSize: '0.9rem' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weapons Marquee List */}
              <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
                  Software Weapons (Infinite Marquee)
                </h3>
                
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    onKeyDown={addTool}
                    className="form-input"
                    placeholder="Enter tool (e.g. Cinema 4D) and press Enter"
                    style={{ flexGrow: 1 }}
                  />
                  <button type="button" onClick={addTool} className="btn-primary" style={{ padding: '0.75rem 1rem' }}>
                    <FaPlus /> Add
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {tools.map((t, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        padding: '0.35rem 0.75rem',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => removeTool(t)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0 }}
                      >
                        <FaTimes style={{ fontSize: '0.75rem' }} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Timelines Journey */}
            <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                  Career Journey Timeline
                </h3>
                <button type="button" onClick={addTimeline} className="btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                  <FaPlus /> Add Experience Node
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {timeline.map((time, idx) => (
                  <div key={idx} className="card" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-primary)', position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => removeTimeline(idx)}
                      style={{
                        position: 'absolute',
                        top: '1.25rem',
                        right: '1.25rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        cursor: 'pointer'
                      }}
                    >
                      <FaTrashAlt style={{ fontSize: '0.85rem' }} />
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1rem' }} className="form-grid">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Timeline Year (e.g. 2023 - Present)</label>
                        <input
                          type="text"
                          value={time.year}
                          onChange={(e) => handleTimelineChange(idx, 'year', e.target.value)}
                          className="form-input"
                          style={{ padding: '0.55rem', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Role/Designation</label>
                        <input
                          type="text"
                          value={time.role}
                          onChange={(e) => handleTimelineChange(idx, 'role', e.target.value)}
                          className="form-input"
                          style={{ padding: '0.55rem', fontSize: '0.85rem' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.7rem' }}>Company / Academy</label>
                        <input
                          type="text"
                          value={time.company}
                          onChange={(e) => handleTimelineChange(idx, 'company', e.target.value)}
                          className="form-input"
                          style={{ padding: '0.55rem', fontSize: '0.85rem' }}
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.7rem' }}>Short description of duties</label>
                      <textarea
                        value={time.description}
                        onChange={(e) => handleTimelineChange(idx, 'description', e.target.value)}
                        className="form-textarea"
                        style={{ minHeight: '60px', padding: '0.55rem', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Services & Pricing */}
        {activeTab === 'services' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Core Services Category Box */}
            <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                  Visual Services Offerings
                </h3>
                <button type="button" onClick={addService} className="btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                  <FaPlus /> Add Service
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {services.map((srv, idx) => (
                  <div key={idx} className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-primary)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <button
                      type="button"
                      onClick={() => removeService(idx)}
                      style={{
                        position: 'absolute',
                        top: '1.25rem',
                        right: '1.25rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        cursor: 'pointer'
                      }}
                    >
                      <FaTrashAlt style={{ fontSize: '0.9rem' }} />
                    </button>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 2.5fr 1fr', gap: '1.5rem', alignItems: 'end' }} className="form-grid">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Service Category Title</label>
                        <input
                          type="text"
                          value={srv.title}
                          onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Service Brief Description</label>
                        <input
                          type="text"
                          value={srv.description}
                          onChange={(e) => handleServiceChange(idx, 'description', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label className="form-label" style={{ fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', margin: 0, fontWeight: 500 }}>
                          <input
                            type="checkbox"
                            checked={srv.visible !== false}
                            onChange={(e) => handleServiceChange(idx, 'visible', e.target.checked)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--accent)', cursor: 'pointer' }}
                          />
                          <span>Show on Site</span>
                        </label>
                      </div>
                    </div>

                    {/* Features checklist inside Service */}
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                          What is Included (List items)
                        </h4>
                        <button type="button" onClick={() => addServiceIncludes(idx)} className="btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                          <FaPlus /> Add Bullet
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-grid">
                        {srv.includes.map((inc, incIdx) => (
                          <div key={incIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={inc}
                              onChange={(e) => handleServiceIncludesChange(idx, incIdx, e.target.value)}
                              className="form-input"
                              style={{ padding: '0.4rem', fontSize: '0.8rem', flexGrow: 1 }}
                            />
                            <button type="button" onClick={() => removeServiceIncludes(idx, incIdx)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
                              <FaTimes style={{ fontSize: '0.8rem' }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Packages Box */}
            <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>
                  Pricing Package Plans
                </h3>
                <button type="button" onClick={addPackage} className="btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}>
                  <FaPlus /> Add Package
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {packages.map((pkg, idx) => (
                  <div key={idx} className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-primary)', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: pkg.featured ? '2px solid var(--accent)' : '1px solid var(--border)' }}>
                    
                    {/* Featured toggle and Delete Button */}
                    <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handlePackageChange(idx, 'featured', !pkg.featured)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: pkg.featured ? 'var(--accent)' : 'var(--text-secondary)',
                          fontSize: '1.1rem',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        title={pkg.featured ? 'Remove popular tag' : 'Set as most popular package'}
                      >
                        {pkg.featured ? <FaStar /> : <FaRegStar />}
                      </button>
                      <button
                        type="button"
                        onClick={() => removePackage(idx)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}
                      >
                        <FaTrashAlt style={{ fontSize: '0.85rem' }} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="form-grid">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Package Name</label>
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) => handlePackageChange(idx, 'name', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Price Tag (e.g. $1,299)</label>
                        <input
                          type="text"
                          value={pkg.price}
                          onChange={(e) => handlePackageChange(idx, 'price', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Description Summary</label>
                        <input
                          type="text"
                          value={pkg.description}
                          onChange={(e) => handlePackageChange(idx, 'description', e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    {/* Features checklist inside Package */}
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                          Package Features Checklist
                        </h4>
                        <button type="button" onClick={() => addPackageFeature(idx)} className="btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                          <FaPlus /> Add Feature
                        </button>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-grid">
                        {pkg.features.map((feat, featIdx) => (
                          <div key={featIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) => handlePackageFeaturesChange(idx, featIdx, e.target.value)}
                              className="form-input"
                              style={{ padding: '0.4rem', fontSize: '0.8rem', flexGrow: 1 }}
                            />
                            <button type="button" onClick={() => removePackageFeature(idx, featIdx)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer' }}>
                              <FaTimes style={{ fontSize: '0.8rem' }} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Contact & Socials */}
        {activeTab === 'contact' && (
          <div className="card" style={{ padding: '2rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>
              Contact Details & Social Media URLs
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="form-grid">
              <div className="form-group">
                <label className="form-label">Contact Email Address (Admin Inbox Mailto)</label>
                <input
                  type="email"
                  name="email"
                  value={contact.email}
                  onChange={handleContactChange}
                  className="form-input"
                  placeholder="designer@example.com"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Display Location</label>
                <input
                  type="text"
                  name="location"
                  value={contact.location}
                  onChange={handleContactChange}
                  className="form-input"
                  placeholder="New York City, NY"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="form-grid">
              <div className="form-group">
                <label className="form-label">Display Phone Number (Optional)</label>
                <input
                  type="text"
                  name="phone"
                  value={contact.phone}
                  onChange={handleContactChange}
                  className="form-input"
                  placeholder="+1 (555) 019-2834"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Instagram Channel URL</label>
                <input
                  type="text"
                  name="instagramUrl"
                  value={contact.instagramUrl}
                  onChange={handleContactChange}
                  className="form-input"
                  placeholder="https://instagram.com/alex"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="form-grid">
              <div className="form-group">
                <label className="form-label">Behance Channel URL</label>
                <input
                  type="text"
                  name="behanceUrl"
                  value={contact.behanceUrl}
                  onChange={handleContactChange}
                  className="form-input"
                  placeholder="https://behance.net/alex"
                />
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn Channel URL</label>
                <input
                  type="text"
                  name="linkedinUrl"
                  value={contact.linkedinUrl}
                  onChange={handleContactChange}
                  className="form-input"
                  placeholder="https://linkedin.com/in/alex"
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Navbar Visibility */}
        {activeTab === 'navbar' && (
          <div className="card" style={{ padding: '2.5rem 2rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              Navbar Page Links Visibility
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2.5rem', fontWeight: 300 }}>
              Toggle which main pages are shown or hidden in the public Navbar navigation header.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {['home', 'portfolio', 'about', 'services', 'contact'].map((linkKey) => (
                <div
                  key={linkKey}
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    padding: '1.25rem 1.5rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                  className="card"
                >
                  <span style={{ textTransform: 'uppercase', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                    {linkKey}
                  </span>
                  <label
                    style={{
                      position: 'relative',
                      display: 'inline-block',
                      width: '46px',
                      height: '24px',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={navbar[linkKey] !== false}
                      onChange={(e) => setNavbar({ ...navbar, [linkKey]: e.target.checked })}
                      style={{
                        opacity: 0,
                        width: 0,
                        height: 0
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: navbar[linkKey] !== false ? 'var(--accent)' : '#333333',
                        borderRadius: '24px',
                        transition: '0.3s ease'
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          content: '""',
                          height: '18px',
                          width: '18px',
                          left: navbar[linkKey] !== false ? '24px' : '4px',
                          bottom: '3px',
                          backgroundColor: '#ffffff',
                          borderRadius: '50%',
                          transition: '0.3s ease'
                        }}
                      />
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

      </form>
    </div>
  );
};

export default AdminSettings;
