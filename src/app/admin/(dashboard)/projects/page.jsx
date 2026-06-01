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
  const [description, setDescription] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [tools, setTools] = useState([]);
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(0);

  // Upload/Image State
  const [newImages, setNewImages] = useState([]); // Files to upload
  const [newImagePreviews, setNewImagePreviews] = useState([]); // Preview URLs for new files
  const [existingImages, setExistingImages] = useState([]); // URLs loaded during editing

  const categories = ['Logo Design', 'Branding', 'UI/UX', 'Print', 'Social Media', 'Illustration', 'Other'];

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api('/projects');
      if (response.success) {
        setProjects(response.data);
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
    setCategory(project.category);
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

    if (!title || !description || !category) {
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
    formData.append('category', category);
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
    <div style={{ width: '100%' }}>
      {/* Header Summary Row */}
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
            Manage Projects
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Add, update, and sort work inside your portfolio catalog.
          </p>
        </div>
        <button onClick={handleOpenAddForm} className="btn-primary">
          <FaPlus /> Add New Project
        </button>
      </div>

      {/* Projects List Table */}
      {loading ? (
        <div className="card" style={{ height: '300px' }}>
          <div className="skeleton" style={{ height: '100%', width: '100%' }} />
        </div>
      ) : (
        <div className="card" style={{ overflowX: 'auto', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {projects.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No projects uploaded yet. Start by uploading one!
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'center' }}>Featured</th>
                  <th style={{ textAlign: 'center' }}>Order</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id}>
                    {/* Image Thumbnail */}
                    <td style={{ width: '80px' }}>
                      <img
                        src={project.coverImage || 'https://via.placeholder.com/60'}
                        alt={project.title}
                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border)' }}
                        loading="lazy"
                      />
                    </td>

                    {/* Title */}
                    <td style={{ fontWeight: 600, fontSize: '0.95rem' }}>{project.title}</td>

                    {/* Category */}
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{project.category}</td>

                    {/* Featured Toggle */}
                    <td style={{ textAlign: 'center' }}>
                      <button
                        onClick={(e) => handleToggleFeatured(project, e)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: project.featured ? 'var(--accent)' : 'var(--text-secondary)',
                          fontSize: '1.1rem',
                          display: 'inline-flex',
                          alignItems: 'center'
                        }}
                        title={project.featured ? 'Unfeature project' : 'Feature project'}
                      >
                        <FaStar style={{ fill: project.featured ? 'var(--accent)' : 'none', stroke: 'currentColor', strokeWidth: '30px' }} />
                      </button>
                    </td>

                    {/* Order Value */}
                    <td style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      {project.order || 0}
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '1rem' }}>
                        <button
                          onClick={() => handleEditClick(project)}
                          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem' }}
                          title="Edit"
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(project)}
                          style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '1rem' }}
                          title="Delete"
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-hover)'}
                          onMouseLeave={e => e.currentTarget.style.color = 'var(--accent)'}
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
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(10, 10, 10, 0.95)',
            zIndex: 500,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '2rem'
          }}
        >
          <div
            className="card"
            style={{
              width: '100%',
              maxWidth: '750px',
              maxHeight: '90vh',
              overflowY: 'auto',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '2.5rem'
            }}
          >
            {/* Form Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>
                {editMode ? 'Edit Project' : 'Upload New Project'}
              </h2>
              <button
                onClick={handleCloseForm}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Form fields */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Title & Category Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="form-grid">
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
                  <label htmlFor="category" className="form-label">Category</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="form-select"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
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
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {tools.map((tool, idx) => (
                    <span
                      key={idx}
                      style={{
                        backgroundColor: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      {tool}
                      <button
                        type="button"
                        onClick={() => removeTool(idx)}
                        style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', padding: 0 }}
                      >
                        <FaTimes style={{ fontSize: '0.7rem' }} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Image Upload Gallery */}
              <div className="form-group">
                <label className="form-label">Project Images (Up to 10 files. First will be cover)</label>
                
                {/* Drag/Drop Box */}
                <label
                  style={{
                    border: '2px dashed var(--border)',
                    borderRadius: '6px',
                    padding: '2rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'var(--bg-surface)'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
                >
                  <FaUpload style={{ fontSize: '1.75rem', color: 'var(--text-secondary)' }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Click to choose or drag images here
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.7 }}>
                    Supports JPEG, JPG, PNG, WEBP (Max 10MB)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>

                {/* Previews Collection */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', marginTop: '1.5rem' }} className="image-previews">
                  
                  {/* Existing Images (loaded during Edit) */}
                  {existingImages.map((imgUrl, idx) => (
                    <div key={`exist-${idx}`} style={{ position: 'relative', height: '80px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <img src={imgUrl} alt="Existing Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(imgUrl)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          backgroundColor: 'rgba(10, 10, 10, 0.8)',
                          color: 'var(--accent)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <FaTimes style={{ fontSize: '0.7rem' }} />
                      </button>
                    </div>
                  ))}

                  {/* New Upload Previews */}
                  {newImagePreviews.map((previewUrl, idx) => (
                    <div key={`new-${idx}`} style={{ position: 'relative', height: '80px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--accent)' }}>
                      <img src={previewUrl} alt="New Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => removeNewImagePreview(idx)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          backgroundColor: 'rgba(10, 10, 10, 0.8)',
                          color: 'var(--accent)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '20px',
                          height: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <FaTimes style={{ fontSize: '0.7rem' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured & Order Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }} className="form-grid">
                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', height: '100%', gap: '1rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    id="featured"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--accent)' }}
                  />
                  <label htmlFor="featured" className="form-label" style={{ marginBottom: 0, cursor: 'pointer' }}>
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
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <button type="button" onClick={handleCloseForm} className="btn-outline" style={{ padding: '0.7rem 1.5rem' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '0.7rem 2rem' }}>
                  {editMode ? 'Save Changes' : 'Upload Project'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          .image-previews {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminProjects;
