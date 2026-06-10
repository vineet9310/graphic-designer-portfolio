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

  // Upload/Image State
  const [newImages, setNewImages] = useState([]); // Files to upload
  const [newImagePreviews, setNewImagePreviews] = useState([]); // Preview URLs for new files
  const [existingImages, setExistingImages] = useState([]); // URLs loaded during editing

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
    setNewImages([]);
    setNewImagePreviews([]);
    setExistingImages([]);
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

  // Image Selection Handlers
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalCurrentCount = existingImages.length + newImages.length + files.length;
    
    if (totalCurrentCount > 10) {
      toast.error('Maximum 10 images are allowed per project.');
      return;
    }

    setNewImages([...newImages, ...files]);
    
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews([...newImagePreviews, ...previewUrls]);
  };

  const removeNewImagePreview = (idxToRemove) => {
    setNewImages(newImages.filter((_, idx) => idx !== idxToRemove));
    
    // Revoke object URL to free memory
    URL.revokeObjectURL(newImagePreviews[idxToRemove]);
    setNewImagePreviews(newImagePreviews.filter((_, idx) => idx !== idxToRemove));
  };

  const removeExistingImage = (imgUrl) => {
    setExistingImages(existingImages.filter(img => img !== imgUrl));
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
    setExistingImages(project.images || []);
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

    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error('Please upload at least one cover image.');
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

    if (editMode) {
      formData.append('existingImages', JSON.stringify(existingImages));
    }

    // Append new files
    newImages.forEach(file => {
      formData.append('images', file);
    });

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
              
              {/* Title & Category Row */}
              <div className="admin-form-row" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="form-textarea"
                  placeholder="Enter detailed description of what this project accomplished..."
                />
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

              {/* Image Upload Gallery */}
              <div className="form-group">
                <label className="form-label">Project Images (Up to 10 files. First will be cover)</label>
                
                {/* Drag/Drop Box */}
                <label className="admin-project-upload-box" style={{ border: '2px dashed var(--accent)', transition: 'all 0.2s', cursor: 'pointer' }}>
                  <FaUpload className="admin-project-upload-icon" />
                  <span className="admin-project-upload-text">
                    Click to choose or drag images here
                  </span>
                  <span className="admin-project-upload-subtext">
                    Supports JPEG, JPG, PNG, WEBP (Max 10MB)
                  </span>
                  <span className="admin-project-upload-subtext" style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.2rem' }}>
                    Recommended size: 7:5 landscape aspect ratio (e.g. 800 x 560 px)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="admin-project-upload-input"
                  />
                </label>

                {/* Previews Collection */}
                <div className="admin-project-previews-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  {/* Existing Images (loaded during Edit) */}
                  {existingImages.map((imgUrl, idx) => {
                    const isCover = idx === 0;
                    return (
                      <div key={`exist-${idx}`} className="admin-project-preview-item" style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: isCover ? '2px solid var(--accent)' : '1px solid var(--border)', aspectRatio: '7/5' }}>
                        <img src={imgUrl} alt="Existing Preview" className="admin-project-preview-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {isCover && (
                          <span style={{ position: 'absolute', top: '5px', left: '5px', backgroundColor: 'var(--accent)', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeExistingImage(imgUrl)}
                          className="admin-project-preview-remove-btn"
                          style={{ position: 'absolute', top: '5px', right: '5px', border: 'none', background: 'rgba(0,0,0,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', color: '#fff' }}
                        >
                          <FaTimes style={{ fontSize: '0.7rem' }} />
                        </button>
                      </div>
                    );
                  })}

                  {/* New Upload Previews */}
                  {newImagePreviews.map((previewUrl, idx) => {
                    const isCover = existingImages.length === 0 && idx === 0;
                    return (
                      <div key={`new-${idx}`} className="admin-project-preview-item new-upload" style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: isCover ? '2px solid var(--accent)' : '1px solid var(--border)', aspectRatio: '7/5' }}>
                        <img src={previewUrl} alt="New Preview" className="admin-project-preview-img" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        {isCover && (
                          <span style={{ position: 'absolute', top: '5px', left: '5px', backgroundColor: 'var(--accent)', color: '#fff', fontSize: '0.65rem', fontWeight: 'bold', padding: '2px 6px', borderRadius: '4px' }}>
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeNewImagePreview(idx)}
                          className="admin-project-preview-remove-btn"
                          style={{ position: 'absolute', top: '5px', right: '5px', border: 'none', background: 'rgba(0,0,0,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '50%', color: '#fff' }}
                        >
                          <FaTimes style={{ fontSize: '0.7rem' }} />
                        </button>
                      </div>
                    );
                  })}
                </div>
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
