"use client";

import React, { useState, useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { toast } from 'react-hot-toast';
import { FaSave, FaPlus, FaTrashAlt, FaStar, FaRegStar, FaTimes } from 'react-icons/fa';

const AdminSettings = () => {
  const { settings, loading, error, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('hero');
  const [isSaving, setIsSaving] = useState(false);

  // Dynamic States reflecting schema fields
  const [hero, setHero] = useState({ subtitle: '', title: '', description: '' });
  const [about, setAbout] = useState({ bioParagraph1: '', bioParagraph2: '', resumeUrl: '', portraitImage: '' });
  const [contact, setContact] = useState({ email: '', location: '', phone: '', instagramUrl: '', behanceUrl: '', linkedinUrl: '' });
  const [navbar, setNavbar] = useState({ home: true, portfolio: true, about: true, services: true, blogs: true, contact: true });
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
      setNavbar(settings.navbar || { home: true, portfolio: true, about: true, services: true, blogs: true, contact: true });
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
      <div className="admin-loading-card">
        <div className="skeleton admin-loading-skeleton" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card admin-card-empty">
        <p className="admin-btn-delete">Failed to load configurations: {error}</p>
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
    <div className="admin-dashboard-container">
      {/* Header */}
      <div className="admin-flex-row-sb">
        <div>
          <h1 className="admin-h1">
            Site Configuration
          </h1>
          <p className="admin-header-p">
            Manage the entire dynamic frontend contents, banners, bio, tools lists, pricing, and contact handles.
          </p>
        </div>
        <button onClick={handleSubmit} className="btn-primary" disabled={isSaving}>
          <FaSave /> {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="admin-settings-tabs-nav">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`admin-settings-tab-btn ${isActive ? 'active' : ''}`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Form Content Wrapper */}
      <form onSubmit={handleSubmit} className="admin-form">
        
        {/* Tab 1: Hero & Stats */}
        {activeTab === 'hero' && (
          <div className="admin-form">
            <div className="admin-settings-card">
              <h3 className="admin-settings-card-title">
                Landing Hero Section
              </h3>
              
              <div className="admin-form">
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
            <div className="admin-settings-card">
              <div className="admin-settings-action-header">
                <h3 className="admin-settings-action-header-title">
                  Performance Stats Metrics
                </h3>
                <button type="button" onClick={addStat} className="btn-outline messages-refresh-btn">
                  <FaPlus /> Add Stat
                </button>
              </div>

              <div className="admin-form-row">
                {stats.map((stat, idx) => (
                  <div key={idx} className="admin-settings-item-card">
                    <button
                      type="button"
                      onClick={() => removeStat(idx)}
                      className="admin-settings-item-delete-btn"
                    >
                      <FaTrashAlt className="blogs-icon-arrow" />
                    </button>
                    
                    <div className="admin-settings-item-card-inner-flex">
                      <div className="form-group">
                        <label className="form-label">Stat Value (e.g. 50+)</label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Stat Label (e.g. Happy Clients)</label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                          className="form-input"
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
          <div className="admin-form">
            <div className="admin-settings-card">
              <h3 className="admin-settings-card-title">
                Creative Bio Details
              </h3>
              
              <div className="admin-form">
                <div className="admin-form-row">
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
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Bio Paragraph 2</label>
                  <textarea
                    name="bioParagraph2"
                    value={about.bioParagraph2}
                    onChange={handleAboutChange}
                    className="form-textarea"
                  />
                </div>
              </div>
            </div>

            {/* Skills & Weapons section */}
            <div className="admin-form-row">
              
              {/* Skills sliders list */}
              <div className="admin-settings-card">
                <div className="admin-settings-action-header">
                  <h3 className="admin-settings-action-header-title">
                    Visual Skills
                  </h3>
                  <button type="button" onClick={addSkill} className="btn-outline messages-refresh-btn">
                    <FaPlus /> Add Skill
                  </button>
                </div>

                <div className="admin-settings-item-card-inner-flex">
                  {skills.map((skill, idx) => (
                    <div key={idx} className="admin-settings-skill-item">
                      <div className="admin-settings-skill-details">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => handleSkillChange(idx, 'name', e.target.value)}
                          className="form-input"
                        />
                        <div className="admin-settings-skill-input-range">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.percentage}
                            onChange={(e) => handleSkillChange(idx, 'percentage', e.target.value)}
                            className="admin-settings-skill-range-slider"
                          />
                          <span className="admin-settings-skill-percentage">{skill.percentage}%</span>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeSkill(idx)} className="admin-settings-item-delete-btn">
                        <FaTrashAlt className="blogs-icon-arrow" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weapons Marquee List */}
              <div className="admin-settings-card">
                <h3 className="admin-settings-card-title">
                  Software Weapons (Infinite Marquee)
                </h3>
                
                <div className="admin-settings-sub-list-item">
                  <input
                    type="text"
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    onKeyDown={addTool}
                    className="form-input"
                    placeholder="Enter tool (e.g. Cinema 4D) and press Enter"
                  />
                  <button type="button" onClick={addTool} className="btn-primary messages-refresh-btn">
                    <FaPlus /> Add
                  </button>
                </div>

                <div className="admin-tag-container">
                  {tools.map((t, idx) => (
                    <span key={idx} className="admin-tag-pill">
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => removeTool(t)}
                        className="admin-tag-delete-btn"
                      >
                        <FaTimes className="blogs-icon-arrow" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Timelines Journey */}
            <div className="admin-settings-card">
              <div className="admin-settings-action-header">
                <h3 className="admin-settings-action-header-title">
                  Career Journey Timeline
                </h3>
                <button type="button" onClick={addTimeline} className="btn-outline messages-refresh-btn">
                  <FaPlus /> Add Node
                </button>
              </div>

              <div className="admin-settings-item-card-inner-flex">
                {timeline.map((time, idx) => (
                  <div key={idx} className="admin-settings-item-card">
                    <button
                      type="button"
                      onClick={() => removeTimeline(idx)}
                      className="admin-settings-item-delete-btn"
                    >
                      <FaTrashAlt className="blogs-icon-arrow" />
                    </button>

                    <div className="admin-settings-item-card-inner-grid">
                      <div className="form-group">
                        <label className="form-label">Timeline Year (e.g. 2023 - Present)</label>
                        <input
                          type="text"
                          value={time.year}
                          onChange={(e) => handleTimelineChange(idx, 'year', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Role/Designation</label>
                        <input
                          type="text"
                          value={time.role}
                          onChange={(e) => handleTimelineChange(idx, 'role', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Company / Academy</label>
                        <input
                          type="text"
                          value={time.company}
                          onChange={(e) => handleTimelineChange(idx, 'company', e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Short description of duties</label>
                      <textarea
                        value={time.description}
                        onChange={(e) => handleTimelineChange(idx, 'description', e.target.value)}
                        className="form-textarea"
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
          <div className="admin-form">
            
            {/* Core Services Category Box */}
            <div className="admin-settings-card">
              <div className="admin-settings-action-header">
                <h3 className="admin-settings-action-header-title">
                  Visual Services Offerings
                </h3>
                <button type="button" onClick={addService} className="btn-outline messages-refresh-btn">
                  <FaPlus /> Add Service
                </button>
              </div>

              <div className="admin-settings-item-card-inner-flex">
                {services.map((srv, idx) => (
                  <div key={idx} className="admin-settings-item-card">
                    <button
                      type="button"
                      onClick={() => removeService(idx)}
                      className="admin-settings-item-delete-btn"
                    >
                      <FaTrashAlt className="blogs-icon-arrow" />
                    </button>

                    <div className="admin-settings-item-card-inner-grid">
                      <div className="form-group">
                        <label className="form-label">Service Category Title</label>
                        <input
                          type="text"
                          value={srv.title}
                          onChange={(e) => handleServiceChange(idx, 'title', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Service Brief Description</label>
                        <input
                          type="text"
                          value={srv.description}
                          onChange={(e) => handleServiceChange(idx, 'description', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="admin-checkbox-group">
                        <input
                          type="checkbox"
                          checked={srv.visible !== false}
                          onChange={(e) => handleServiceChange(idx, 'visible', e.target.checked)}
                          className="admin-checkbox-input"
                        />
                        <label className="admin-checkbox-label">Show on Site</label>
                      </div>
                    </div>

                    {/* Features checklist inside Service */}
                    <div className="admin-sidebar-footer">
                      <div className="admin-settings-sub-list-header">
                        <h4 className="admin-settings-sub-list-title">
                          What is Included (List items)
                        </h4>
                        <button type="button" onClick={() => addServiceIncludes(idx)} className="btn-outline messages-refresh-btn">
                          <FaPlus /> Add Bullet
                        </button>
                      </div>

                      <div className="admin-settings-sub-list-grid">
                        {srv.includes.map((inc, incIdx) => (
                          <div key={incIdx} className="admin-settings-sub-list-item">
                            <input
                              type="text"
                              value={inc}
                              onChange={(e) => handleServiceIncludesChange(idx, incIdx, e.target.value)}
                              className="form-input"
                            />
                            <button type="button" onClick={() => removeServiceIncludes(idx, incIdx)} className="admin-tag-delete-btn">
                              <FaTimes className="blogs-icon-arrow" />
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
            <div className="admin-settings-card">
              <div className="admin-settings-action-header">
                <h3 className="admin-settings-action-header-title">
                  Pricing Package Plans
                </h3>
                <button type="button" onClick={addPackage} className="btn-outline messages-refresh-btn">
                  <FaPlus /> Add Package
                </button>
              </div>

              <div className="admin-settings-item-card-inner-flex">
                {packages.map((pkg, idx) => (
                  <div key={idx} className={`admin-settings-item-card ${pkg.featured ? 'featured-pkg' : ''}`}>
                    
                    {/* Featured toggle and Delete Button */}
                    <div className="admin-settings-item-delete-btn">
                      <button
                        type="button"
                        onClick={() => handlePackageChange(idx, 'featured', !pkg.featured)}
                        className={`admin-btn-star-featured ${pkg.featured ? 'admin-btn-star-featured-active' : 'admin-btn-star-featured-inactive'}`}
                        title={pkg.featured ? 'Remove popular tag' : 'Set as most popular package'}
                      >
                        {pkg.featured ? <FaStar className="admin-star-icon" /> : <FaRegStar />}
                      </button>
                      <button
                        type="button"
                        onClick={() => removePackage(idx)}
                        className="admin-btn-delete"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>

                    <div className="admin-settings-item-card-inner-grid">
                      <div className="form-group">
                        <label className="form-label">Package Name</label>
                        <input
                          type="text"
                          value={pkg.name}
                          onChange={(e) => handlePackageChange(idx, 'name', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Price Tag (e.g. $999)</label>
                        <input
                          type="text"
                          value={pkg.price}
                          onChange={(e) => handlePackageChange(idx, 'price', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Description Summary</label>
                        <input
                          type="text"
                          value={pkg.description}
                          onChange={(e) => handlePackageChange(idx, 'description', e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    {/* Features checklist inside Package */}
                    <div className="admin-sidebar-footer">
                      <div className="admin-settings-sub-list-header">
                        <h4 className="admin-settings-sub-list-title">
                          Package Features Checklist
                        </h4>
                        <button type="button" onClick={() => addPackageFeature(idx)} className="btn-outline messages-refresh-btn">
                          <FaPlus /> Add Feature
                        </button>
                      </div>

                      <div className="admin-settings-sub-list-grid">
                        {pkg.features.map((feat, featIdx) => (
                          <div key={featIdx} className="admin-settings-sub-list-item">
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) => handlePackageFeaturesChange(idx, featIdx, e.target.value)}
                              className="form-input"
                            />
                            <button type="button" onClick={() => removePackageFeature(idx, featIdx)} className="admin-tag-delete-btn">
                              <FaTimes className="blogs-icon-arrow" />
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
          <div className="admin-settings-card">
            <h3 className="admin-settings-card-title">
              Contact Details & Social Media URLs
            </h3>

            <div className="admin-form">
              <div className="admin-form-row">
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

              <div className="admin-form-row">
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

              <div className="admin-form-row">
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
          </div>
        )}

        {/* Tab 5: Navbar Visibility */}
        {activeTab === 'navbar' && (
          <div className="admin-settings-card">
            <h3 className="admin-settings-card-title">
              Navbar Page Links Visibility
            </h3>
            
            <p className="admin-settings-navbar-desc">
              Toggle which main pages are shown or hidden in the public Navbar navigation header.
            </p>

            <div className="admin-settings-navbar-grid">
              {['home', 'portfolio', 'about', 'services', 'blogs', 'contact'].map((linkKey) => (
                <div
                  key={linkKey}
                  className="admin-settings-navbar-card"
                >
                  <span className="admin-settings-navbar-label">
                    {linkKey}
                  </span>
                  <label className="admin-settings-switch-label">
                    <input
                      type="checkbox"
                      checked={navbar[linkKey] !== false}
                      onChange={(e) => setNavbar({ ...navbar, [linkKey]: e.target.checked })}
                      className="admin-settings-switch-input"
                    />
                    <span className={`admin-settings-switch-slider ${navbar[linkKey] !== false ? 'active' : ''}`}>
                      <span className={`admin-settings-switch-knob ${navbar[linkKey] !== false ? 'active' : ''}`} />
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
