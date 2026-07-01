"use client";

import React, { useState, useEffect } from 'react';
import api from '@/utils/api';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrashAlt, FaEdit, FaStar, FaTimes, FaUpload } from 'react-icons/fa';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Logo Design');
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [description, setDescription] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [tools, setTools] = useState([]);
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(0);

  // Unified Project Images State (holds array of { id, file, preview, description, isExisting, url })
  const [projectImages, setProjectImages] = useState([
    { id: `new-0-${Date.now()}`, file: null, preview: '', description: '', isExisting: false, url: '' }
  ]);

  // Hero Image State (holds { file, preview, isExisting, url })
  const [heroImage, setHeroImage] = useState({ file: null, preview: '', isExisting: false, url: '' });

  const [dynamicCategories, setDynamicCategories] = useState(['Logo Design', 'Branding', 'UI/UX', 'Print', 'Social Media', 'Illustration']);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api('/projects');
      if (response.success) {
        setProjects(response.data);
        
        // Dynamically build category options from data
        const defaults = ['Logo Design', 'Branding', 'UI/UX', 'Print', 'Social Media', 'Illustration'];
        const dbCats = response.data.map(p => p.category).filter(Boolean);
        const combined = Array.from(new Set([...defaults, ...dbCats]));
        setDynamicCategories(combined);
      }
    } catch (error) {
      console.error('Error loading projects:', error.message);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setTitle('');
    setCategory('Logo Design');
    setCustomCategory('');
    setShowCustomCategory(false);
    setDescription('');
    setToolInput('');
    setTools([]);
    setFeatured(false);
    setOrder(0);
    // Revoke any created object URLs to prevent leaks
    projectImages.forEach(img => {
      if (img.preview && !img.isExisting) {
        URL.revokeObjectURL(img.preview);
      }
    });
    if (heroImage.preview && !heroImage.isExisting) {
      URL.revokeObjectURL(heroImage.preview);
    }
    setProjectImages([
      { id: `new-0-${Date.now()}`, file: null, preview: '', title: '', description: '', isExisting: false, url: '' }
    ]);
    setHeroImage({ file: null, preview: '', isExisting: false, url: '' });
    setEditMode(false);
    setCurrentProjectId(null);
  };

  const handleOpenAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    resetForm();
    setIsFormOpen(false);
  };

  // Tool tags input handlers
  const handleToolKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = toolInput.trim();
      if (val && !tools.includes(val)) {
        setTools([...tools, val]);
        setToolInput('');
      }
    }
  };

  const removeTool = (indexToRemove) => {
    setTools(tools.filter((_, idx) => idx !== indexToRemove));
  };

  // Image Slot Management Handlers
  const addImageSlot = () => {
    if (projectImages.length >= 15) {
      toast.error('You can add up to 15 images per project.');
      return;
    }
    setProjectImages([
      ...projectImages,
      { id: `new-${Date.now()}-${Math.random()}`, file: null, preview: '', title: '', description: '', isExisting: false, url: '' }
    ]);
  };

  const removeImageSlot = (idToRemove) => {
    if (projectImages.length === 1) {
      toast.error('At least one image is required.');
      return;
    }
    const target = projectImages.find(img => img.id === idToRemove);
    if (target && target.preview && !target.isExisting) {
      URL.revokeObjectURL(target.preview);
    }
    setProjectImages(projectImages.filter(img => img.id !== idToRemove));
  };

  const handleSlotImageChange = (id, file) => {
    if (!file) return;
    
    setProjectImages(prev => prev.map(img => {
      if (img.id === id) {
        if (img.preview && !img.isExisting) {
          URL.revokeObjectURL(img.preview);
        }
        return {
          ...img,
          file: file,
          preview: URL.createObjectURL(file),
          isExisting: false
        };
      }
      return img;
    }));
  };

  const handleSlotDescriptionChange = (id, text) => {
    setProjectImages(prev => prev.map(img => {
      if (img.id === id) {
        return {
          ...img,
          description: text
        };
      }
      return img;
    }));
  };

  const handleSlotTitleChange = (id, text) => {
    setProjectImages(prev => prev.map(img => {
      if (img.id === id) {
        return {
          ...img,
          title: text
        };
      }
      return img;
    }));
  };

  // Featured Toggle directly from table
  const handleToggleFeatured = async (project, e) => {
    e.stopPropagation();
    const toastId = toast.loading('Toggling featured status...');
    try {
      const response = await api(`/projects/${project._id}/featured`, {
        method: 'PUT'
      });
      if (response.success) {
        toast.success(`Project ${response.data.featured ? 'featured' : 'unfeatured'}!`, { id: toastId });
        setProjects(prev => prev.map(p => p._id === project._id ? response.data : p));
      }
    } catch (error) {
      toast.error('Failed to toggle featured status', { id: toastId });
    }
  };

  // Edit Button Action
  const handleEditClick = (project) => {
    resetForm();
    setCurrentProjectId(project._id);
    setTitle(project.title);

    const defaults = ['Logo Design', 'Branding', 'UI/UX', 'Print', 'Social Media', 'Illustration'];
    if (defaults.includes(project.category)) {
      setCategory(project.category);
      setShowCustomCategory(false);
    } else {
      if (!dynamicCategories.includes(project.category)) {
        setDynamicCategories(prev => [...prev, project.category]);
      }
      setCategory(project.category);
      setShowCustomCategory(false);
    }

    setDescription(project.description);
    setTools(project.tools || []);
    setFeatured(project.featured);
    setOrder(project.order || 0);
    
    // Parse project images (which can be strings or objects)
    const loadedImages = (project.images || []).map((img, idx) => {
      const url = typeof img === 'string' ? img : img.url;
      const title = typeof img === 'string' ? '' : (img.title || '');
      const description = typeof img === 'string' ? '' : (img.description || '');
      return {
        id: `existing-${idx}-${Date.now()}`,
        file: null,
        preview: url,
        title: title,
        description: description,
        isExisting: true,
        url: url
      };
    });
    setProjectImages(loadedImages.length > 0 ? loadedImages : [{ id: `new-0-${Date.now()}`, file: null, preview: '', title: '', description: '', isExisting: false, url: '' }]);
    
    // Set hero image
    if (project.coverImage) {
      setHeroImage({
        file: null,
        preview: project.coverImage,
        isExisting: true,
        url: project.coverImage
      });
    } else {
      setHeroImage({ file: null, preview: '', isExisting: false, url: '' });
    }

    setEditMode(true);
    setIsFormOpen(true);
  };

  // Delete Action
  const handleDeleteClick = async (project) => {
    if (window.confirm(`Are you sure you want to delete "${project.title}"? This will permanently delete the project and all stored images.`)) {
      const toastId = toast.loading('Deleting project...');
      try {
        const response = await api(`/projects/${project._id}`, {
          method: 'DELETE'
        });
        if (response.success) {
          toast.success('Project deleted successfully', { id: toastId });
          setProjects(prev => prev.filter(p => p._id !== project._id));
        }
      } catch (error) {
        toast.error('Failed to delete project', { id: toastId });
      }
    }
  };

  // Form Submit Handler (Handles Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory = showCustomCategory || category === 'Other' ? customCategory.trim() : category;

    if (!title || !description || !finalCategory) {
      toast.error('Please enter title, description, and category.');
      return;
    }

    // Validation: make sure Hero Image is present
    if (!heroImage.isExisting && !heroImage.file) {
      toast.error('Please upload a Hero Image (Cover Image).');
      return;
    }

    // Validation: make sure all gallery slots have images
    const hasEmptyImageSlot = projectImages.some(img => !img.isExisting && !img.file);
    if (hasEmptyImageSlot) {
      toast.error('Please choose an image file for all gallery slots or remove empty slots.');
      return;
    }

    const toastId = toast.loading(editMode ? 'Updating project...' : 'Creating project...');
    
    // Construct FormData to support file upload
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', finalCategory);
    formData.append('description', description);
    formData.append('tools', JSON.stringify(tools));
    formData.append('featured', featured);
    formData.append('order', order);

    // Append Hero Image
    if (heroImage.file) {
      formData.append('heroImage', heroImage.file);
    } else if (heroImage.isExisting) {
      formData.append('existingHeroImage', heroImage.url);
    }

    // Build the images metadata and append files
    const metadata = [];
    let fileCount = 0;
    projectImages.forEach((img) => {
      if (img.isExisting) {
        metadata.push({
          type: 'existing',
          url: img.url,
          title: img.title || '',
          description: img.description
        });
      } else if (img.file) {
        const fileKey = `new_image_${fileCount}`;
        metadata.push({
          type: 'new',
          fileKey: fileKey,
          title: img.title || '',
          description: img.description
        });
        formData.append(fileKey, img.file);
        fileCount++;
      }
    });
    formData.append('imagesMetadata', JSON.stringify(metadata));

    try {
      let response;
      if (editMode) {
        response = await api(`/projects/${currentProjectId}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        response = await api('/projects', {
          method: 'POST',
          body: formData
        });
      }

      if (response.success) {
        toast.success(editMode ? 'Project updated!' : 'Project created!', { id: toastId });
        fetchProjects();
        handleCloseForm();
      }
    } catch (error) {
      toast.error(`Error: ${error.message || 'Action failed'}`, { id: toastId });
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Header Summary Row */}
      <div className="admin-flex-row-sb">
        <div>
          <h1 className="admin-h1">
            Manage Projects
          </h1>
          <p className="admin-header-p">
            Add, update, and sort work inside your portfolio catalog.
          </p>
        </div>
        <button onClick={handleOpenAddForm} className="btn-primary">
          <FaPlus /> Add New Project
        </button>
      </div>

      {/* Projects List Table */}
      {loading ? (
        <div className="card admin-loading-card">
          <div className="skeleton admin-loading-skeleton" />
        </div>
      ) : (
        <div className="card admin-table-card">
          {projects.length === 0 ? (
            <div className="admin-card-empty">
              No projects uploaded yet. Start by uploading one!
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th className="admin-table-align-center">Featured</th>
                  <th className="admin-table-align-center">Order</th>
                  <th className="admin-table-align-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id}>
                    {/* Image Thumbnail */}
                    <td className="admin-table-w-80">
                      <img
                        src={project.coverImage || 'https://via.placeholder.com/60'}
                        alt={project.title}
                        className="admin-table-thumbnail"
                        loading="lazy"
                      />
                    </td>

                    {/* Title */}
                    <td className="admin-table-text-bold">{project.title}</td>

                    {/* Category */}
                    <td className="admin-table-text-secondary">{project.category}</td>

                    {/* Featured Toggle */}
                    <td className="admin-table-align-center">
                      <button
                        onClick={(e) => handleToggleFeatured(project, e)}
                        className={`admin-btn-star-featured ${project.featured ? 'admin-btn-star-featured-active' : 'admin-btn-star-featured-inactive'}`}
                        title={project.featured ? 'Unfeature project' : 'Feature project'}
                      >
                        <FaStar className="admin-star-icon" />
                      </button>
                    </td>

                    {/* Order Value */}
                    <td className="admin-table-align-center admin-table-text-secondary">
                      {project.order || 0}
                    </td>

                    {/* Actions */}
                    <td className="admin-table-align-right">
                      <div className="admin-icon-wrapper">
                        <button
                          onClick={() => handleEditClick(project)}
                          className="admin-btn-icon-only"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(project)}
                          className="admin-btn-delete"
                          title="Delete"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal Form Overlay */}
      {isFormOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-content">
            {/* Form Header */}
            <div className="admin-modal-header">
              <h2 className="admin-modal-h2">
                {editMode ? 'Edit Project' : 'Upload New Project'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="admin-modal-close-btn"
              >
                <FaTimes />
              </button>
            </div>

            {/* Form fields */}
            <form onSubmit={handleSubmit} className="admin-form">
              
              {/* Title Input */}
              <div className="form-group">
                <label htmlFor="title" className="form-label">Project Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Aether Identity Pack"
                />
              </div>

              {/* Description Input */}
              <div className="form-group">
                <label htmlFor="description" className="form-label">Project Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="form-textarea"
                  placeholder="Enter detailed description of what this project accomplished..."
                />
              </div>

              {/* Hero Image */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label className="form-label" style={{ margin: 0, fontWeight: 'bold' }}>
                  Project Hero Image (Main Cover Image)
                </label>
                <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden', border: '2px dashed var(--accent)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                  {heroImage.preview ? (
                    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                      <img src={heroImage.preview} alt="Hero Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <label style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.75)', color: '#fff', fontSize: '0.8rem', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.2)' }}>
                        Change Hero Image
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              if (heroImage.preview && !heroImage.isExisting) {
                                URL.revokeObjectURL(heroImage.preview);
                              }
                              setHeroImage({
                                file,
                                preview: URL.createObjectURL(file),
                                isExisting: false,
                                url: ''
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                  ) : (
                    <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', cursor: 'pointer', gap: '0.5rem' }}>
                      <FaUpload style={{ color: 'var(--accent)', fontSize: '2rem' }} />
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: '600' }}>Upload Hero Image</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Supports JPEG, JPG, PNG, WEBP (Max 10MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setHeroImage({
                              file,
                              preview: URL.createObjectURL(file),
                              isExisting: false,
                              url: ''
                            });
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Category selector */}
              <div className="form-group">
                <label className="form-label" style={{ marginBottom: '0.75rem' }}>Project Category</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  {dynamicCategories.map((cat) => {
                    const isActive = category === cat && !showCustomCategory;
                    return (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => {
                          setCategory(cat);
                          setShowCustomCategory(false);
                        }}
                        style={{
                          border: 'none',
                          outline: 'none',
                          cursor: 'pointer',
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          backgroundColor: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
                          color: isActive ? '#fff' : 'var(--text-secondary)',
                          border: isActive ? '1px solid var(--accent)' : '1px solid var(--border)',
                          transition: 'all 0.2s',
                        }}
                      >
                        {cat}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('Other');
                      setShowCustomCategory(true);
                    }}
                    style={{
                      border: 'none',
                      outline: 'none',
                      cursor: 'pointer',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      backgroundColor: showCustomCategory ? 'var(--accent)' : 'rgba(255,255,255,0.04)',
                      color: showCustomCategory ? '#fff' : 'var(--accent)',
                      border: showCustomCategory ? '1px solid var(--accent)' : '1px dashed var(--accent)',
                      transition: 'all 0.2s',
                    }}
                  >
                    + Other Category
                  </button>
                </div>

                {showCustomCategory && (
                  <div style={{ animation: 'fadeIn 0.2s ease-in-out', marginTop: '0.75rem' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>Specify Custom Category Name</label>
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="form-input"
                      placeholder="e.g. 3D Design, Editorial, Packaging..."
                      required={showCustomCategory}
                      style={{ marginTop: '0.25rem', width: '100%' }}
                    />
                  </div>
                )}
              </div>

              {/* Tools Used (Tag Input) */}
              <div className="form-group">
                <label htmlFor="tools" className="form-label">Tools Used (Type tool name and press Enter)</label>
                <input
                  type="text"
                  id="tools"
                  value={toolInput}
                  onChange={(e) => setToolInput(e.target.value)}
                  onKeyDown={handleToolKeyDown}
                  className="form-input"
                  placeholder="Figma, Illustrator, After Effects..."
                />
                {/* Tag List */}
                <div className="admin-tag-container">
                  {tools.map((tool, idx) => (
                    <span key={idx} className="admin-tag-pill">
                      {tool}
                      <button
                        type="button"
                        onClick={() => removeTool(idx)}
                        className="admin-tag-delete-btn"
                      >
                        <FaTimes className="blogs-icon-arrow" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Project Images & Descriptions Section */}
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid rgba(255,255,255,0.06)', padding: '1.25rem', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.01)', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" style={{ margin: 0, fontSize: '0.95rem', fontWeight: 'bold' }}>
                    Project Gallery Images ({projectImages.length} / 15)
                  </label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
                  {projectImages.map((img, idx) => (
                    <div
                      key={img.id}
                      style={{
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backgroundColor: 'rgba(0,0,0,0.15)',
                        position: 'relative'
                      }}
                    >
                      {/* Slot Header / Delete */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          Image #{idx + 1}
                        </span>
                        {projectImages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImageSlot(img.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ff4d4d',
                              cursor: 'pointer',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              transition: 'background 0.2s',
                            }}
                          >
                            <FaTrashAlt /> Remove
                          </button>
                        )}
                      </div>

                      {/* Content Row */}
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        {/* Selector/Preview Box */}
                        <div style={{ position: 'relative', width: '150px', height: '145px', borderRadius: '6px', overflow: 'hidden', border: '1px dashed var(--border)', flexShrink: 0, backgroundColor: '#000' }}>
                          {img.preview ? (
                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                              <img src={img.preview} alt={`Preview ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                              <label style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.65rem', padding: '0.25rem', textAlign: 'center', cursor: 'pointer' }}>
                                Change Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: 'none' }}
                                  onChange={(e) => handleSlotImageChange(img.id, e.target.files[0])}
                                />
                              </label>
                            </div>
                          ) : (
                            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', cursor: 'pointer', gap: '0.25rem' }}>
                              <FaUpload style={{ color: 'var(--accent)', fontSize: '1.2rem' }} />
                              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Upload Image</span>
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => handleSlotImageChange(img.id, e.target.files[0])}
                              />
                            </label>
                          )}
                        </div>

                        {/* Text Inputs Column */}
                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
                          {/* Title Input */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                              Image Title
                            </label>
                            <input
                              type="text"
                              value={img.title || ''}
                              onChange={(e) => handleSlotTitleChange(img.id, e.target.value)}
                              placeholder="e.g. Logo Design, Typography details..."
                              style={{
                                width: '100%',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border)',
                                borderRadius: '6px',
                                padding: '0.4rem 0.6rem',
                                color: '#fff',
                                fontSize: '0.85rem',
                                outline: 'none',
                              }}
                            />
                          </div>

                          {/* Description Textarea */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                              Image Description / Caption
                            </label>
                            <textarea
                              value={img.description}
                              onChange={(e) => handleSlotDescriptionChange(img.id, e.target.value)}
                              placeholder="Explain what this specific image shows..."
                              style={{
                                width: '100%',
                                height: '65px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid var(--border)',
                                borderRadius: '6px',
                                padding: '0.4rem 0.6rem',
                                color: '#fff',
                                fontSize: '0.85rem',
                                resize: 'none',
                                outline: 'none',
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {projectImages.length < 15 ? (
                  <button
                    type="button"
                    onClick={addImageSlot}
                    style={{
                      marginTop: '0.5rem',
                      alignSelf: 'flex-start',
                      padding: '0.6rem 1.2rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      backgroundColor: 'rgba(255,255,255,0.04)',
                      color: 'var(--accent)',
                      border: '1px dashed var(--accent)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = 'var(--accent)';
                      e.target.style.color = '#fff';
                      e.target.style.borderStyle = 'solid';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'rgba(255,255,255,0.04)';
                      e.target.style.color = 'var(--accent)';
                      e.target.style.borderStyle = 'dashed';
                    }}
                  >
                    <FaPlus /> Add More Image & Description
                  </button>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                    Limit reached (15/15 images added)
                  </span>
                )}
              </div>

              {/* Featured & Order Row */}
              <div className="admin-form-row">
                <div className="admin-checkbox-group">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="admin-checkbox-input"
                  />
                  <label htmlFor="featured" className="admin-checkbox-label">
                    Mark as Featured Project
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="order" className="form-label">Sort Order (Manual Sorting)</label>
                  <input
                    type="number"
                    id="order"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    className="form-input"
                    min="0"
                  />
                </div>
              </div>

              {/* Actions bottom */}
              <div className="admin-form-actions">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="btn-outline admin-form-actions-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary admin-form-actions-btn-submit"
                >
                  {editMode ? 'Save Changes' : 'Upload Project'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;
