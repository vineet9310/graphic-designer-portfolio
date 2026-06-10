"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { toast } from 'react-hot-toast';
import { FaSave, FaPlus, FaTrashAlt, FaStar, FaRegStar, FaTimes, FaUpload, FaTrash, FaEdit, FaEnvelope, FaMapMarkerAlt, FaPhone, FaInstagram, FaBehance, FaLinkedin, FaHome, FaPalette, FaUser, FaBriefcase, FaBookOpen } from 'react-icons/fa';
import api from '@/utils/api';

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
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingPortrait, setIsUploadingPortrait] = useState(false);
  const portraitInputRef = useRef(null);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const resumeInputRef = useRef(null);

  // Timeline Modal states
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(null);
  const [timelineTemp, setTimelineTemp] = useState({ year: '', role: '', company: '', description: '' });

  // Service Modal states
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [activeServiceIndex, setActiveServiceIndex] = useState(null);
  const [serviceTemp, setServiceTemp] = useState({ title: '', description: '', visible: true, includes: [] });
  const [newServiceInclude, setNewServiceInclude] = useState('');

  // Package Modal states
  const [isPackageModalOpen, setIsPackageModalOpen] = useState(false);
  const [activePackageIndex, setActivePackageIndex] = useState(null);
  const [packageTemp, setPackageTemp] = useState({ name: '', price: '', description: '', featured: false, features: [] });
  const [newPackageFeature, setNewPackageFeature] = useState('');

  // Stat Modal states
  const [isStatModalOpen, setIsStatModalOpen] = useState(false);
  const [activeStatIndex, setActiveStatIndex] = useState(null);
  const [statTemp, setStatTemp] = useState({ value: '', label: '' });

  // Skill Modal states
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [activeSkillIndex, setActiveSkillIndex] = useState(null);
  const [skillTemp, setSkillTemp] = useState({ name: '', percentage: 90 });

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

  // Portrait image upload handlers
  const uploadPortrait = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    setIsUploadingPortrait(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api('/upload', { method: 'POST', body: formData });
      if (response.success) {
        setAbout((prev) => ({ ...prev, portraitImage: response.url }));
        toast.success('Portrait image uploaded successfully');
      } else {
        toast.error(response.message || 'Upload failed');
      }
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setIsUploadingPortrait(false);
    }
  };

  const handlePortraitDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadPortrait(file);
  };

  const handlePortraitDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handlePortraitDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handlePortraitSelect = (e) => {
    const file = e.target.files[0];
    if (file) uploadPortrait(file);
    e.target.value = '';
  };

  const removePortrait = () => {
    setAbout((prev) => ({ ...prev, portraitImage: '' }));
  };

  const uploadResume = async (file) => {
    if (!file || file.type !== 'application/pdf') {
      toast.error('Please select a valid PDF file');
      return;
    }
    setIsUploadingResume(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api('/upload', { method: 'POST', body: formData });
      if (response.success) {
        setAbout((prev) => ({ ...prev, resumeUrl: response.url }));
        toast.success('Resume PDF uploaded successfully');
      } else {
        toast.error(response.message || 'Upload failed');
      }
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleResumeSelect = (e) => {
    const file = e.target.files[0];
    if (file) uploadResume(file);
    e.target.value = '';
  };

  // Stat actions via Modal Popup
  const handleOpenAddStat = () => {
    setStatTemp({ value: '', label: '' });
    setActiveStatIndex(null);
    setIsStatModalOpen(true);
  };

  const handleOpenEditStat = (idx) => {
    setStatTemp({ ...stats[idx] });
    setActiveStatIndex(idx);
    setIsStatModalOpen(true);
  };

  const handleSaveStat = () => {
    if (!statTemp.value || !statTemp.label) {
      toast.error('Please fill in both stat value and label.');
      return;
    }

    if (activeStatIndex === null) {
      setStats([...stats, statTemp]);
      toast.success('Stat added successfully');
    } else {
      const updated = stats.map((item, idx) =>
        idx === activeStatIndex ? statTemp : item
      );
      setStats(updated);
      toast.success('Stat updated successfully');
    }
    setIsStatModalOpen(false);
  };

  const removeStat = (idx) => {
    if (window.confirm('Are you sure you want to remove this stat?')) {
      setStats(stats.filter((_, i) => i !== idx));
      toast.success('Stat removed');
    }
  };

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

  // Skills actions via Modal Popup
  const handleOpenAddSkill = () => {
    setSkillTemp({ name: '', percentage: 90 });
    setActiveSkillIndex(null);
    setIsSkillModalOpen(true);
  };

  const handleOpenEditSkill = (idx) => {
    setSkillTemp({ ...skills[idx] });
    setActiveSkillIndex(idx);
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = () => {
    if (!skillTemp.name) {
      toast.error('Please fill in the skill name.');
      return;
    }

    if (activeSkillIndex === null) {
      setSkills([...skills, skillTemp]);
      toast.success('Skill added successfully');
    } else {
      const updated = skills.map((item, idx) =>
        idx === activeSkillIndex ? skillTemp : item
      );
      setSkills(updated);
      toast.success('Skill updated successfully');
    }
    setIsSkillModalOpen(false);
  };

  const removeSkill = (idx) => {
    if (window.confirm('Are you sure you want to remove this skill?')) {
      setSkills(skills.filter((_, i) => i !== idx));
      toast.success('Skill removed');
    }
  };

  // Timeline actions via Modal Popup
  const handleOpenAddTimeline = () => {
    setTimelineTemp({ year: '2025', role: '', company: '', description: '' });
    setActiveTimelineIndex(null);
    setIsTimelineModalOpen(true);
  };

  const handleOpenEditTimeline = (idx) => {
    setTimelineTemp({ ...timeline[idx] });
    setActiveTimelineIndex(idx);
    setIsTimelineModalOpen(true);
  };

  const handleSaveTimeline = () => {
    if (!timelineTemp.year || !timelineTemp.role || !timelineTemp.company) {
      toast.error('Please fill in year, role, and company.');
      return;
    }

    if (activeTimelineIndex === null) {
      setTimeline([...timeline, timelineTemp]);
      toast.success('Timeline item added successfully');
    } else {
      const updated = timeline.map((item, idx) =>
        idx === activeTimelineIndex ? timelineTemp : item
      );
      setTimeline(updated);
      toast.success('Timeline item updated successfully');
    }
    setIsTimelineModalOpen(false);
  };

  const removeTimeline = (idx) => {
    if (window.confirm('Are you sure you want to remove this timeline item?')) {
      setTimeline(timeline.filter((_, i) => i !== idx));
      toast.success('Timeline item removed');
    }
  };

  // Services actions via Modal Popup
  const handleOpenAddService = () => {
    setServiceTemp({ title: '', description: '', visible: true, includes: [] });
    setNewServiceInclude('');
    setActiveServiceIndex(null);
    setIsServiceModalOpen(true);
  };

  const handleOpenEditService = (idx) => {
    setServiceTemp({ ...services[idx] });
    setNewServiceInclude('');
    setActiveServiceIndex(idx);
    setIsServiceModalOpen(true);
  };

  const handleSaveService = () => {
    if (!serviceTemp.title || !serviceTemp.description) {
      toast.error('Please fill in title and description.');
      return;
    }

    if (activeServiceIndex === null) {
      setServices([...services, serviceTemp]);
      toast.success('Service added successfully');
    } else {
      const updated = services.map((item, idx) =>
        idx === activeServiceIndex ? serviceTemp : item
      );
      setServices(updated);
      toast.success('Service updated successfully');
    }
    setIsServiceModalOpen(false);
  };

  const removeService = (idx) => {
    if (window.confirm('Are you sure you want to remove this service?')) {
      setServices(services.filter((_, i) => i !== idx));
      toast.success('Service removed');
    }
  };

  const addServiceIncludeItem = () => {
    const val = newServiceInclude.trim();
    if (val) {
      setServiceTemp({
        ...serviceTemp,
        includes: [...(serviceTemp.includes || []), val]
      });
      setNewServiceInclude('');
    }
  };

  const removeServiceIncludeItem = (idx) => {
    setServiceTemp({
      ...serviceTemp,
      includes: serviceTemp.includes.filter((_, i) => i !== idx)
    });
  };

  // Packages actions via Modal Popup
  const handleOpenAddPackage = () => {
    setPackageTemp({ name: '', price: '', description: '', featured: false, features: [] });
    setNewPackageFeature('');
    setActivePackageIndex(null);
    setIsPackageModalOpen(true);
  };

  const handleOpenEditPackage = (idx) => {
    setPackageTemp({ ...packages[idx] });
    setNewPackageFeature('');
    setActivePackageIndex(idx);
    setIsPackageModalOpen(true);
  };

  const handleSavePackage = () => {
    if (!packageTemp.name || !packageTemp.price || !packageTemp.description) {
      toast.error('Please fill in name, price, and description.');
      return;
    }

    if (activePackageIndex === null) {
      setPackages([...packages, packageTemp]);
      toast.success('Package added successfully');
    } else {
      const updated = packages.map((item, idx) =>
        idx === activePackageIndex ? packageTemp : item
      );
      setPackages(updated);
      toast.success('Package updated successfully');
    }
    setIsPackageModalOpen(false);
  };

  const removePackage = (idx) => {
    if (window.confirm('Are you sure you want to remove this package?')) {
      setPackages(packages.filter((_, i) => i !== idx));
      toast.success('Package removed');
    }
  };

  const togglePackageFeatured = (idx, e) => {
    e.stopPropagation();
    const updated = packages.map((pkg, i) => i === idx ? { ...pkg, featured: !pkg.featured } : pkg);
    setPackages(updated);
    toast.success('Package popularity toggled');
  };

  const addPackageFeatureItem = () => {
    const val = newPackageFeature.trim();
    if (val) {
      setPackageTemp({
        ...packageTemp,
        features: [...(packageTemp.features || []), val]
      });
      setNewPackageFeature('');
    }
  };

  const removePackageFeatureItem = (idx) => {
    setPackageTemp({
      ...packageTemp,
      features: packageTemp.features.filter((_, i) => i !== idx)
    });
  };

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
                <button type="button" onClick={handleOpenAddStat} className="btn-outline messages-refresh-btn">
                  <FaPlus /> Add Stat
                </button>
              </div>

              <div className="admin-settings-item-card-inner-flex" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                {stats.length === 0 ? (
                  <div className="admin-card-empty" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No stats configured yet. Click "Add Stat" to create one.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    {stats.map((stat, idx) => (
                      <div key={idx} className="admin-settings-item-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'var(--bg-surface)' }}>
                        <div>
                          <div style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1.25rem', marginBottom: '0.15rem' }}>{stat.value}</div>
                          <div style={{ color: 'var(--text-primary)', fontWeight: '500', fontSize: '0.9rem' }}>{stat.label}</div>
                        </div>
                        
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenEditStat(idx)}
                            className="admin-btn-icon-only"
                            title="Edit"
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--text-primary)' }}
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeStat(idx)}
                            className="admin-btn-delete"
                            title="Delete"
                            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--accent)' }}
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    <label className="form-label">Bio Portrait Image</label>

                    {/* Drop zone */}
                    <div
                      className={`admin-portrait-upload-box ${isDragging ? 'dragging' : ''}`}
                      onDrop={handlePortraitDrop}
                      onDragOver={handlePortraitDragOver}
                      onDragLeave={handlePortraitDragLeave}
                    >
                      {about.portraitImage ? (
                        <div
                          className="admin-portrait-preview-container"
                          onClick={() => portraitInputRef.current?.click()}
                        >
                          <img
                            src={about.portraitImage}
                            alt="Portrait preview"
                            className="admin-portrait-preview"
                          />
                          <div className="admin-portrait-overlay">
                            <FaUpload />
                            <span>Drag or click to replace</span>
                          </div>
                          <button
                            type="button"
                            className="admin-portrait-remove-btn"
                            onClick={(e) => { e.stopPropagation(); removePortrait(); }}
                            title="Remove portrait"
                          >
                            <FaTrash />
                          </button>
                          <input
                            ref={portraitInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handlePortraitSelect}
                            className="admin-project-upload-input"
                          />
                        </div>
                      ) : (
                        <label className="admin-portrait-upload-label">
                          <FaUpload className="admin-project-upload-icon" />
                          <span className="admin-project-upload-text">
                            {isUploadingPortrait ? 'Uploading...' : 'Drag & drop or click to upload portrait'}
                          </span>
                          <span className="admin-project-upload-subtext">
                            Supports JPEG, PNG, WEBP
                          </span>
                          <span className="admin-project-upload-subtext" style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.2rem' }}>
                            Recommended size: 4:5 aspect ratio (e.g. 800 x 1000 px)
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePortraitSelect}
                            className="admin-project-upload-input"
                          />
                        </label>
                      )}
                    </div>

                    {/* URL input fallback */}
                    <div className="admin-portrait-url-row">
                      <span className="admin-portrait-url-or">OR</span>
                      <input
                        type="text"
                        name="portraitImage"
                        value={about.portraitImage}
                        onChange={handleAboutChange}
                        className="form-input"
                        placeholder="Paste image URL directly..."
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Resume Link (PDF URL)</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        name="resumeUrl"
                        value={about.resumeUrl}
                        onChange={handleAboutChange}
                        className="form-input"
                        placeholder="Paste PDF link or upload using the button..."
                        style={{ flex: 1 }}
                      />
                      <button
                        type="button"
                        onClick={() => resumeInputRef.current?.click()}
                        className="btn-outline"
                        style={{ padding: '0.65rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap' }}
                        disabled={isUploadingResume}
                      >
                        <FaUpload /> {isUploadingResume ? 'Uploading...' : 'Upload PDF'}
                      </button>
                      <input
                        ref={resumeInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleResumeSelect}
                        style={{ display: 'none' }}
                      />
                    </div>
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
                  <button type="button" onClick={handleOpenAddSkill} className="btn-outline messages-refresh-btn">
                    <FaPlus /> Add Skill
                  </button>
                </div>

                <div className="admin-settings-item-card-inner-flex" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  {skills.length === 0 ? (
                    <div className="admin-card-empty" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      No skills added yet. Click "Add Skill" to create one.
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                      {skills.map((skill, idx) => (
                        <div key={idx} className="admin-settings-item-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'var(--bg-surface)' }}>
                          <div>
                            <div style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '1rem', marginBottom: '0.25rem' }}>{skill.name}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <div style={{ width: '100px', height: '6px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                                <div style={{ width: `${skill.percentage}%`, height: '100%', backgroundColor: 'var(--accent)' }} />
                              </div>
                              <span style={{ color: 'var(--accent)', fontSize: '0.85rem', fontWeight: 'bold' }}>{skill.percentage}%</span>
                            </div>
                          </div>
                          
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => handleOpenEditSkill(idx)}
                              className="admin-btn-icon-only"
                              title="Edit"
                              style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--text-primary)' }}
                            >
                              <FaEdit />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeSkill(idx)}
                              className="admin-btn-delete"
                              title="Delete"
                              style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--accent)' }}
                            >
                              <FaTrashAlt />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                <button type="button" onClick={handleOpenAddTimeline} className="btn-outline messages-refresh-btn">
                  <FaPlus /> Add Node
                </button>
              </div>

              <div className="admin-settings-item-card-inner-flex" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                {timeline.length === 0 ? (
                  <div className="admin-card-empty" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No timeline items added yet. Click "Add Node" to create one.
                  </div>
                ) : (
                  timeline.map((time, idx) => (
                    <div key={idx} className="admin-settings-item-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'var(--bg-surface)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                          <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.9rem' }}>{time.year}</span>
                          <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '1rem' }}>{time.role}</span>
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{time.company}</div>
                        {time.description && (
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontStyle: 'italic', marginTop: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>
                            {time.description}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditTimeline(idx)}
                          className="admin-btn-icon-only"
                          title="Edit"
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--text-primary)' }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTimeline(idx)}
                          className="admin-btn-delete"
                          title="Delete"
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--accent)' }}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  ))
                )}
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
                <button type="button" onClick={handleOpenAddService} className="btn-outline messages-refresh-btn">
                  <FaPlus /> Add Service
                </button>
              </div>

              <div className="admin-settings-item-card-inner-flex" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                {services.length === 0 ? (
                  <div className="admin-card-empty" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No services configured yet. Click "Add Service" to create one.
                  </div>
                ) : (
                  services.map((srv, idx) => (
                    <div key={idx} className="admin-settings-item-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'var(--bg-surface)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.05rem' }}>{srv.title}</span>
                          {!srv.visible && <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>Hidden</span>}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{srv.description}</div>
                        {srv.includes && srv.includes.length > 0 && (
                          <div style={{ color: 'var(--accent)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                            Includes: {srv.includes.join(', ')}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEditService(idx)}
                          className="admin-btn-icon-only"
                          title="Edit"
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--text-primary)' }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeService(idx)}
                          className="admin-btn-delete"
                          title="Delete"
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--accent)' }}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pricing Packages Box */}
            <div className="admin-settings-card">
              <div className="admin-settings-action-header">
                <h3 className="admin-settings-action-header-title">
                  Pricing Package Plans
                </h3>
                <button type="button" onClick={handleOpenAddPackage} className="btn-outline messages-refresh-btn">
                  <FaPlus /> Add Package
                </button>
              </div>

              <div className="admin-settings-item-card-inner-flex" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                {packages.length === 0 ? (
                  <div className="admin-card-empty" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No pricing packages configured yet. Click "Add Package" to create one.
                  </div>
                ) : (
                  packages.map((pkg, idx) => (
                    <div key={idx} className={`admin-settings-item-card ${pkg.featured ? 'featured-pkg' : ''}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: pkg.featured ? '1px solid var(--accent)' : '1px solid var(--border)', borderRadius: '8px', backgroundColor: 'var(--bg-surface)' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                          <span style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '1.05rem' }}>{pkg.name}</span>
                          <span style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.95rem' }}>{pkg.price}</span>
                          {pkg.featured && <span style={{ fontSize: '0.75rem', color: 'var(--accent)', border: '1px solid var(--accent)', padding: '0.05rem 0.35rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Popular</span>}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{pkg.description}</div>
                        {pkg.features && pkg.features.length > 0 && (
                          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem', opacity: 0.8 }}>
                            Features: {pkg.features.join(', ')}
                          </div>
                        )}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={(e) => togglePackageFeatured(idx, e)}
                          className={`admin-btn-star-featured ${pkg.featured ? 'admin-btn-star-featured-active' : 'admin-btn-star-featured-inactive'}`}
                          title={pkg.featured ? 'Remove popular tag' : 'Set as most popular package'}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem' }}
                        >
                          {pkg.featured ? <FaStar className="admin-star-icon" /> : <FaRegStar />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEditPackage(idx)}
                          className="admin-btn-icon-only"
                          title="Edit"
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--text-primary)' }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          onClick={() => removePackage(idx)}
                          className="admin-btn-delete"
                          title="Delete"
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0.5rem', color: 'var(--accent)' }}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Contact & Socials */}
        {activeTab === 'contact' && (
          <div className="admin-settings-card">
            <h3 className="admin-settings-card-title" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              Contact Details & Social Media URLs
            </h3>

            <div className="admin-form">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                
                {/* Contact Section Group */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', backgroundColor: 'var(--bg-surface)' }}>
                  <h4 style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.25rem' }}>Core Info</h4>
                  
                  <div className="form-group">
                    <label className="form-label">Contact Email Address (Admin Inbox Mailto)</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <FaEnvelope style={{ position: 'absolute', left: '1rem', color: 'var(--accent)', opacity: 0.8 }} />
                      <input
                        type="email"
                        name="email"
                        value={contact.email}
                        onChange={handleContactChange}
                        className="form-input"
                        placeholder="designer@example.com"
                        style={{ paddingLeft: '2.5rem', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Display Location</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <FaMapMarkerAlt style={{ position: 'absolute', left: '1rem', color: 'var(--accent)', opacity: 0.8 }} />
                      <input
                        type="text"
                        name="location"
                        value={contact.location}
                        onChange={handleContactChange}
                        className="form-input"
                        placeholder="New Delhi, India"
                        style={{ paddingLeft: '2.5rem', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Display Phone Number (Optional)</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <FaPhone style={{ position: 'absolute', left: '1rem', color: 'var(--accent)', opacity: 0.8 }} />
                      <input
                        type="text"
                        name="phone"
                        value={contact.phone}
                        onChange={handleContactChange}
                        className="form-input"
                        placeholder="+1 (555) 019-2834"
                        style={{ paddingLeft: '2.5rem', width: '100%' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Social Profiles Section Group */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', backgroundColor: 'var(--bg-surface)' }}>
                  <h4 style={{ color: 'var(--accent)', fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.25rem' }}>Social Networks</h4>

                  <div className="form-group">
                    <label className="form-label">Instagram Channel URL</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <FaInstagram style={{ position: 'absolute', left: '1rem', color: '#E1306C' }} />
                      <input
                        type="text"
                        name="instagramUrl"
                        value={contact.instagramUrl}
                        onChange={handleContactChange}
                        className="form-input"
                        placeholder="https://instagram.com/username"
                        style={{ paddingLeft: '2.5rem', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Behance Channel URL</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <FaBehance style={{ position: 'absolute', left: '1rem', color: '#0057ff' }} />
                      <input
                        type="text"
                        name="behanceUrl"
                        value={contact.behanceUrl}
                        onChange={handleContactChange}
                        className="form-input"
                        placeholder="https://behance.net/username"
                        style={{ paddingLeft: '2.5rem', width: '100%' }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">LinkedIn Channel URL</label>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <FaLinkedin style={{ position: 'absolute', left: '1rem', color: '#0A66C2' }} />
                      <input
                        type="text"
                        name="linkedinUrl"
                        value={contact.linkedinUrl}
                        onChange={handleContactChange}
                        className="form-input"
                        placeholder="https://linkedin.com/in/username"
                        style={{ paddingLeft: '2.5rem', width: '100%' }}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Navbar Visibility */}
        {activeTab === 'navbar' && (
          <div className="admin-settings-card" style={{ padding: '2rem' }}>
            <h3 className="admin-settings-card-title" style={{ marginBottom: '0.5rem' }}>
              Navbar Page Links Visibility
            </h3>
            <p className="admin-settings-navbar-desc" style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
              Configure your public header navigation. Click directly on the tabs in the live preview header below to show or hide them from the website menu.
            </p>
            
            {/* Live Interactive Header Mockup */}
            <div style={{
              padding: '2.5rem 1.5rem',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              backgroundColor: '#0a0a0a',
              backgroundImage: 'radial-gradient(circle at top left, rgba(124, 58, 237, 0.05), transparent)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              position: 'relative'
            }}>
              {/* Header mockup label */}
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '20px',
                backgroundColor: 'var(--accent)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                padding: '2px 8px',
                borderRadius: '4px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase'
              }}>
                Interactive Live Preview
              </div>

              {/* Mockup Navigation Bar container */}
              <div style={{
                width: '100%',
                maxWidth: '650px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.5rem',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '99px',
                backgroundColor: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s'
              }}>
                {/* Logo representation */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent)'
                  }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                    ISHIKA
                  </span>
                </div>

                {/* Interactive Mockup Menu Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  {[
                    { key: 'home', label: 'Home' },
                    { key: 'portfolio', label: 'Portfolio' },
                    { key: 'about', label: 'About' },
                    { key: 'services', label: 'Services' },
                    { key: 'blogs', label: 'Blogs' },
                    { key: 'contact', label: 'Contact' },
                  ].map((item) => {
                    const isVisible = navbar[item.key] !== false;
                    return (
                      <button
                        type="button"
                        key={item.key}
                        onClick={() => setNavbar({ ...navbar, [item.key]: !isVisible })}
                        style={{
                          border: 'none',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '0.4rem 0.85rem',
                          borderRadius: '99px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          letterSpacing: '0.02em',
                          backgroundColor: isVisible ? 'var(--accent)' : 'transparent',
                          color: isVisible ? '#fff' : 'rgba(255, 255, 255, 0.35)',
                          border: isVisible ? '1px solid var(--accent)' : '1px dashed rgba(255, 255, 255, 0.15)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                        title={isVisible ? `Hide ${item.label} Page` : `Show ${item.label} Page`}
                      >
                        {item.label}
                        {!isVisible && (
                          <span style={{ fontSize: '0.65rem', color: 'var(--accent)' }}>✕</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status information footer */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent)' }} />
                  <span>Highlight Tab = Visible on Live Site</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1px dashed rgba(255, 255, 255, 0.3)', backgroundColor: 'transparent' }} />
                  <span>Dashed / Crossed = Excluded from Live Site</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </form>

      {/* Timeline Modal Popup */}
      {isTimelineModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content" style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-h2">
                {activeTimelineIndex === null ? 'Add Timeline Node' : 'Edit Timeline Node'}
              </h2>
              <button
                type="button"
                onClick={() => setIsTimelineModalOpen(false)}
                className="admin-modal-close-btn"
              >
                <FaTimes />
              </button>
            </div>

            <div className="admin-form" style={{ marginTop: '1.5rem' }}>
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Timeline Year (e.g. 2023 - Present)</label>
                  <input
                    type="text"
                    value={timelineTemp.year}
                    onChange={(e) => setTimelineTemp({ ...timelineTemp, year: e.target.value })}
                    className="form-input"
                    placeholder="e.g. 2025"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Role / Designation</label>
                  <input
                    type="text"
                    value={timelineTemp.role}
                    onChange={(e) => setTimelineTemp({ ...timelineTemp, role: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Lead Designer"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Company / Academy</label>
                <input
                  type="text"
                  value={timelineTemp.company}
                  onChange={(e) => setTimelineTemp({ ...timelineTemp, company: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Apex Agency"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Short description of duties</label>
                <textarea
                  value={timelineTemp.description}
                  onChange={(e) => setTimelineTemp({ ...timelineTemp, description: e.target.value })}
                  className="form-textarea"
                  placeholder="Brief descriptions of your role or achievements..."
                  rows={4}
                />
              </div>

              <div className="admin-form-actions">
                <button
                  type="button"
                  onClick={() => setIsTimelineModalOpen(false)}
                  className="btn-outline admin-form-actions-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTimeline}
                  className="btn-primary admin-form-actions-btn-submit"
                >
                  Save Node
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Modal Popup */}
      {isServiceModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content" style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-h2">
                {activeServiceIndex === null ? 'Add Visual Service' : 'Edit Visual Service'}
              </h2>
              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="admin-modal-close-btn"
              >
                <FaTimes />
              </button>
            </div>

            <div className="admin-form" style={{ marginTop: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Service Category Title</label>
                <input
                  type="text"
                  value={serviceTemp.title}
                  onChange={(e) => setServiceTemp({ ...serviceTemp, title: e.target.value })}
                  className="form-input"
                  placeholder="e.g. Logo Design"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Service Brief Description</label>
                <input
                  type="text"
                  value={serviceTemp.description}
                  onChange={(e) => setServiceTemp({ ...serviceTemp, description: e.target.value })}
                  className="form-input"
                  placeholder="Custom vector logo marks designed from scratch..."
                  required
                />
              </div>

              <div className="admin-checkbox-group" style={{ marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="srv-visible"
                  checked={serviceTemp.visible !== false}
                  onChange={(e) => setServiceTemp({ ...serviceTemp, visible: e.target.checked })}
                  className="admin-checkbox-input"
                />
                <label htmlFor="srv-visible" className="admin-checkbox-label">Show on Site</label>
              </div>

              {/* Inclusions Checklist inside Modal */}
              <div className="admin-sidebar-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '1rem' }}>
                <label className="form-label">What is Included (List items)</label>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    value={newServiceInclude}
                    onChange={(e) => setNewServiceInclude(e.target.value)}
                    className="form-input"
                    placeholder="e.g. 3 Unique Logo Concepts"
                    style={{ flex: 1 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addServiceIncludeItem();
                      }
                    }}
                  />
                  <button type="button" onClick={addServiceIncludeItem} className="btn-outline" style={{ padding: '0.65rem 1rem' }}>
                    Add
                  </button>
                </div>

                <div className="admin-tag-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(serviceTemp.includes || []).map((inc, i) => (
                    <span key={i} className="admin-tag-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.75rem', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
                      {inc}
                      <button type="button" onClick={() => removeServiceIncludeItem(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--accent)', display: 'flex', alignItems: 'center', padding: 0 }}>
                        <FaTimes style={{ fontSize: '0.75rem' }} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="admin-form-actions" style={{ marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="btn-outline admin-form-actions-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveService}
                  className="btn-primary admin-form-actions-btn-submit"
                >
                  Save Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Package Modal Popup */}
      {isPackageModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content" style={{ maxWidth: '600px' }}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-h2">
                {activePackageIndex === null ? 'Add Pricing Package' : 'Edit Pricing Package'}
              </h2>
              <button
                type="button"
                onClick={() => setIsPackageModalOpen(false)}
                className="admin-modal-close-btn"
              >
                <FaTimes />
              </button>
            </div>

            <div className="admin-form" style={{ marginTop: '1.5rem' }}>
              <div className="admin-form-row">
                <div className="form-group">
                  <label className="form-label">Package Name</label>
                  <input
                    type="text"
                    value={packageTemp.name}
                    onChange={(e) => setPackageTemp({ ...packageTemp, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Basic Concept"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Price Tag (e.g. $999)</label>
                  <input
                    type="text"
                    value={packageTemp.price}
                    onChange={(e) => setPackageTemp({ ...packageTemp, price: e.target.value })}
                    className="form-input"
                    placeholder="e.g. $499"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description Summary</label>
                <input
                  type="text"
                  value={packageTemp.description}
                  onChange={(e) => setPackageTemp({ ...packageTemp, description: e.target.value })}
                  className="form-input"
                  placeholder="Perfect for small boutiques or personal ventures..."
                  required
                />
              </div>

              <div className="admin-checkbox-group" style={{ marginBottom: '1.5rem' }}>
                <input
                  type="checkbox"
                  id="pkg-featured"
                  checked={packageTemp.featured === true}
                  onChange={(e) => setPackageTemp({ ...packageTemp, featured: e.target.checked })}
                  className="admin-checkbox-input"
                />
                <label htmlFor="pkg-featured" className="admin-checkbox-label">Featured Package (Most Popular)</label>
              </div>

              {/* Features checklist inside Modal */}
              <div className="admin-sidebar-footer" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '1rem' }}>
                <label className="form-label">Package Features Checklist</label>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    value={newPackageFeature}
                    onChange={(e) => setNewPackageFeature(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Vector Source Files"
                    style={{ flex: 1 }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addPackageFeatureItem();
                      }
                    }}
                  />
                  <button type="button" onClick={addPackageFeatureItem} className="btn-outline" style={{ padding: '0.65rem 1rem' }}>
                    Add
                  </button>
                </div>

                <div className="admin-tag-container" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(packageTemp.features || []).map((feat, i) => (
                    <span key={i} className="admin-tag-pill" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.75rem', borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)', fontSize: '0.85rem' }}>
                      {feat}
                      <button type="button" onClick={() => removePackageFeatureItem(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--accent)', display: 'flex', alignItems: 'center', padding: 0 }}>
                        <FaTimes style={{ fontSize: '0.75rem' }} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="admin-form-actions" style={{ marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setIsPackageModalOpen(false)}
                  className="btn-outline admin-form-actions-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSavePackage}
                  className="btn-primary admin-form-actions-btn-submit"
                >
                  Save Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stat Modal Popup */}
      {isStatModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content" style={{ maxWidth: '500px' }}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-h2">
                {activeStatIndex === null ? 'Add Performance Stat' : 'Edit Performance Stat'}
              </h2>
              <button
                type="button"
                onClick={() => setIsStatModalOpen(false)}
                className="admin-modal-close-btn"
              >
                <FaTimes />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form">
                <div className="form-group">
                  <label className="form-label">Stat Value (e.g. 50+, 100%, 5+)</label>
                  <input
                    type="text"
                    value={statTemp.value}
                    onChange={(e) => setStatTemp({ ...statTemp, value: e.target.value })}
                    className="form-input"
                    placeholder="e.g. 50+"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stat Label (e.g. Happy Clients)</label>
                  <input
                    type="text"
                    value={statTemp.label}
                    onChange={(e) => setStatTemp({ ...statTemp, label: e.target.value })}
                    className="form-input"
                    placeholder="e.g. Happy Clients"
                  />
                </div>
              </div>

              <div className="admin-form-actions" style={{ marginTop: '2rem' }}>
                <button
                  type="button"
                  onClick={() => setIsStatModalOpen(false)}
                  className="btn-outline admin-form-actions-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveStat}
                  className="btn-primary admin-form-actions-btn-submit"
                >
                  Save Stat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Modal Popup */}
      {isSkillModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content" style={{ maxWidth: '500px' }}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-h2">
                {activeSkillIndex === null ? 'Add Visual Skill' : 'Edit Visual Skill'}
              </h2>
              <button
                type="button"
                onClick={() => setIsSkillModalOpen(false)}
                className="admin-modal-close-btn"
              >
                <FaTimes />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="admin-form">
                <div className="form-group">
                  <label className="form-label">Skill Name (e.g. Brand Strategy & Identity)</label>
                  <input
                    type="text"
                    value={skillTemp.name}
                    onChange={(e) => setSkillTemp({ ...skillTemp, name: e.target.value })}
                    className="form-input"
                    placeholder="e.g. UI/UX & Web Design"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Skill Percentage: <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{skillTemp.percentage}%</span></label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skillTemp.percentage}
                      onChange={(e) => setSkillTemp({ ...skillTemp, percentage: Number(e.target.value) })}
                      style={{ flex: 1, accentColor: 'var(--accent)' }}
                    />
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={skillTemp.percentage}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > 100) val = 100;
                        if (val < 0) val = 0;
                        setSkillTemp({ ...skillTemp, percentage: val });
                      }}
                      className="form-input"
                      style={{ width: '80px', textAlign: 'center' }}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-form-actions" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  {activeSkillIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        removeSkill(activeSkillIndex);
                        setIsSkillModalOpen(false);
                      }}
                      className="admin-btn-delete"
                      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--accent)', padding: '0.5rem 1rem', borderRadius: '4px', backgroundColor: 'transparent', color: 'var(--accent)', cursor: 'pointer' }}
                    >
                      <FaTrashAlt /> Delete Skill
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsSkillModalOpen(false)}
                    className="btn-outline admin-form-actions-btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveSkill}
                    className="btn-primary admin-form-actions-btn-submit"
                  >
                    Save Skill
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
