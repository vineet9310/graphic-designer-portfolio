"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useBlogs } from '@/hooks/useBlogs';
import { toast } from 'react-hot-toast';
import { FaPlus, FaTrashAlt, FaEdit, FaStar, FaTimes, FaEye, FaUpload, FaTrash } from 'react-icons/fa';
import api from '@/utils/api';

const AdminBlogs = () => {
  const { blogs, loading, fetchBlogs, createBlog, updateBlog, deleteBlog } = useBlogs();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentBlogId, setCurrentBlogId] = useState(null);

  // Form Fields State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Design Theory');
  const [customCategory, setCustomCategory] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [readingTime, setReadingTime] = useState('3 min read');
  const [featured, setFeatured] = useState(false);
  const [published, setPublished] = useState(true);

  // Image Upload State
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    'Design Theory',
    'Case Study',
    'UI/UX Insights',
    'Branding',
    'Typography',
    'Vector Art',
    'Other'
  ];

  const loadBlogs = async () => {
    try {
      await fetchBlogs({ adminMode: true });
    } catch (error) {
      console.error('Error loading blogs:', error.message);
      toast.error('Failed to load blog posts');
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [fetchBlogs]);

  const resetForm = () => {
    setTitle('');
    setCategory('Design Theory');
    setCustomCategory('');
    setExcerpt('');
    setContent('');
    setTagsInput('');
    setCoverImage('');
    setReadingTime('3 min read');
    setFeatured(false);
    setPublished(true);
    setEditMode(false);
    setCurrentBlogId(null);
  };

  const handleOpenAddForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    resetForm();
    setIsFormOpen(false);
  };

  // Cover Image Upload Handlers
  const uploadCoverImage = async (file) => {
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api('/upload', { method: 'POST', body: formData });
      if (response.success) {
        setCoverImage(response.url);
        toast.success('Cover image uploaded successfully');
      } else {
        toast.error(response.message || 'Upload failed');
      }
    } catch (err) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCoverDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) uploadCoverImage(file);
  };

  const handleCoverDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleCoverDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleCoverSelect = (e) => {
    const file = e.target.files[0];
    if (file) uploadCoverImage(file);
    e.target.value = '';
  };

  const removeCoverImage = () => {
    setCoverImage('');
  };

  // Toggle Featured status from the table directly
  const handleToggleFeatured = async (blog, e) => {
    e.stopPropagation();
    const toastId = toast.loading('Toggling featured status...');
    try {
      const updatedData = { ...blog, featured: !blog.featured };
      const response = await updateBlog(blog._id, updatedData);
      if (response.success) {
        toast.success(`Blog ${response.data.featured ? 'marked as featured' : 'unfeatured'}!`, { id: toastId });
        await loadBlogs();
      } else {
        throw new Error(response.message || 'Failed to toggle featured');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to toggle featured status', { id: toastId });
    }
  };

  // Toggle Published status from the table directly
  const handleTogglePublished = async (blog, e) => {
    e.stopPropagation();
    const toastId = toast.loading('Toggling publish status...');
    try {
      const updatedData = { ...blog, published: !blog.published };
      const response = await updateBlog(blog._id, updatedData);
      if (response.success) {
        toast.success(`Blog ${response.data.published ? 'published' : 'saved to drafts'}!`, { id: toastId });
        await loadBlogs();
      } else {
        throw new Error(response.message || 'Failed to toggle publish status');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to toggle publish status', { id: toastId });
    }
  };

  // Edit Button Action
  const handleEditClick = (blog) => {
    resetForm();
    setCurrentBlogId(blog._id);
    setTitle(blog.title);

    // Check if category is standard
    const standardCategories = ['Design Theory', 'Case Study', 'UI/UX Insights', 'Branding', 'Typography', 'Vector Art'];
    if (standardCategories.includes(blog.category)) {
      setCategory(blog.category);
      setCustomCategory('');
    } else {
      setCategory('Other');
      setCustomCategory(blog.category || '');
    }

    setExcerpt(blog.excerpt);
    setContent(blog.content);
    setTagsInput(blog.tags ? blog.tags.join(', ') : '');
    setCoverImage(blog.coverImage || '');
    setReadingTime(blog.readingTime || '3 min read');
    setFeatured(blog.featured);
    setPublished(blog.published);
    setEditMode(true);
    setIsFormOpen(true);
  };

  // Delete Action
  const handleDeleteClick = async (blog) => {
    if (window.confirm(`Are you sure you want to delete "${blog.title}"? This cannot be undone.`)) {
      const toastId = toast.loading('Deleting blog post...');
      try {
        const response = await deleteBlog(blog._id);
        if (response.success) {
          toast.success('Blog post deleted successfully', { id: toastId });
          await loadBlogs();
        } else {
          throw new Error(response.message || 'Failed to delete');
        }
      } catch (error) {
        toast.error(error.message || 'Failed to delete blog post', { id: toastId });
      }
    }
  };

  // Form Submit Handler (Handles Create & Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalCategory = category;
    if (category === 'Other') {
      if (!customCategory.trim()) {
        toast.error('Please specify a custom category name.');
        return;
      }
      finalCategory = customCategory.trim();
    }

    if (!title || !excerpt || !content || !finalCategory) {
      toast.error('Please fill in title, excerpt, content, and category.');
      return;
    }

    const toastId = toast.loading(editMode ? 'Updating blog post...' : 'Creating blog post...');

    // Parse comma-separated tags
    const tags = tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const blogData = {
      title,
      category: finalCategory,
      excerpt,
      content,
      tags,
      readingTime,
      featured,
      published
    };

    if (coverImage) {
      blogData.coverImage = coverImage;
    } else {
      blogData.coverImage = '';
    }

    try {
      let response;
      if (editMode) {
        response = await updateBlog(currentBlogId, blogData);
      } else {
        response = await createBlog(blogData);
      }

      if (response.success) {
        toast.success(editMode ? 'Blog post updated!' : 'Blog post created!', { id: toastId });
        await loadBlogs();
        handleCloseForm();
      } else {
        throw new Error(response.message || 'Action failed');
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
          <h1 className="admin-h1">Manage Journal</h1>
          <p className="admin-header-p">
            Write, design, and organize your creative thoughts and design methodologies.
          </p>
        </div>
        <button onClick={handleOpenAddForm} className="btn-primary">
          <FaPlus /> Add New Post
        </button>
      </div>

      {/* Blogs Table */}
      {loading && blogs.length === 0 ? (
        <div className="card admin-loading-card">
          <div className="skeleton admin-loading-skeleton" />
        </div>
      ) : (
        <div className="card admin-table-card">
          {blogs.length === 0 ? (
            <div className="admin-card-empty">
              No articles published yet. Let's write the first one!
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th className="admin-table-align-center">Status</th>
                  <th className="admin-table-align-center">Featured</th>
                  <th className="admin-table-align-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id}>
                    {/* Thumbnail */}
                    <td className="admin-table-w-80">
                      <img
                        src={blog.coverImage || 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=80&auto=format&fit=crop&q=80'}
                        alt={blog.title}
                        className="admin-table-thumbnail"
                        loading="lazy"
                      />
                    </td>

                    {/* Title */}
                    <td className="admin-table-text-bold">{blog.title}</td>

                    {/* Category */}
                    <td className="admin-table-text-secondary">{blog.category}</td>

                    {/* Status Badge */}
                    <td className="admin-table-align-center">
                      <button
                        onClick={(e) => handleTogglePublished(blog, e)}
                        className={`admin-badge ${blog.published ? 'published' : 'draft'}`}
                        title={blog.published ? 'Click to make Draft' : 'Click to Publish'}
                      >
                        {blog.published ? 'Published' : 'Draft'}
                      </button>
                    </td>

                    {/* Featured Star toggle */}
                    <td className="admin-table-align-center">
                      <button
                        onClick={(e) => handleToggleFeatured(blog, e)}
                        className={`admin-btn-star-featured ${blog.featured ? 'admin-btn-star-featured-active' : 'admin-btn-star-featured-inactive'}`}
                        title={blog.featured ? 'Unfeature article' : 'Feature article'}
                      >
                        <FaStar className={`admin-star-icon`} />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="admin-table-align-right">
                      <div className="admin-icon-wrapper">
                        <button
                          onClick={() => handleEditClick(blog)}
                          className="admin-btn-icon-only"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(blog)}
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
                {editMode ? 'Edit Blog Post' : 'Create New Blog Post'}
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
              <div className="admin-form-row">
                <div className="form-group">
                  <label htmlFor="title" className="form-label">Article Title</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="form-input"
                    placeholder="e.g. Visual Proportions in Brand Identity"
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

              {/* Custom Category Input (shown when Category is 'Other') */}
              {category === 'Other' && (
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="customCategory" className="form-label">Custom Category Name</label>
                  <input
                    type="text"
                    id="customCategory"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    required
                    className="form-input"
                    placeholder="e.g. Motion Design"
                  />
                </div>
              )}

              {/* Excerpt */}
              <div className="form-group">
                <label htmlFor="excerpt" className="form-label">Excerpt / Brief Summary</label>
                <input
                  type="text"
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter a brief 1-2 sentence hook for the preview cards..."
                />
              </div>

              {/* Content Markup */}
              <div className="form-group">
                <label htmlFor="content" className="form-label">Content (HTML or Raw Text)</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="form-textarea"
                  placeholder="<h2>Subheader</h2> <p>Write your detailed story here...</p>"
                />
              </div>

              {/* Cover Image Drag and Drop Upload */}
              <div className="form-group">
                <label className="form-label">Cover Image</label>
                <div
                  className={`admin-portrait-upload-box ${isDragging ? 'dragging' : ''}`}
                  onDrop={handleCoverDrop}
                  onDragOver={handleCoverDragOver}
                  onDragLeave={handleCoverDragLeave}
                  style={{ minHeight: '140px', position: 'relative' }}
                >
                  {coverImage ? (
                    <div
                      className="admin-portrait-preview-container"
                      onClick={() => fileInputRef.current?.click()}
                      style={{ height: '220px' }}
                    >
                      <img
                        src={coverImage}
                        alt="Cover Preview"
                        className="admin-portrait-preview"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div className="admin-portrait-overlay">
                        <FaUpload />
                        <span>Drag & drop or click to replace image</span>
                      </div>
                      <button
                        type="button"
                        className="admin-portrait-remove-btn"
                        onClick={(e) => { e.stopPropagation(); removeCoverImage(); }}
                        title="Remove cover image"
                      >
                        <FaTrash />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleCoverSelect}
                        className="admin-project-upload-input"
                      />
                    </div>
                  ) : (
                    <label className="admin-portrait-upload-label" style={{ padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <FaUpload className="admin-project-upload-icon" style={{ fontSize: '1.8rem', color: 'var(--accent)', marginBottom: '0.5rem' }} />
                      <span className="admin-project-upload-text">
                        {isUploading ? 'Uploading...' : 'Drag & drop or click to upload cover image'}
                      </span>
                      <span className="admin-project-upload-subtext" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Supports JPEG, PNG, WEBP, GIF (Max 10MB)
                      </span>
                      <span className="admin-project-upload-subtext" style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '0.2rem' }}>
                        Recommended size: 16:7 aspect ratio (e.g. 1200 x 550 px)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverSelect}
                        className="admin-project-upload-input"
                      />
                    </label>
                  )}
                </div>

                {/* URL input fallback */}
                <div className="admin-portrait-url-row" style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="admin-portrait-url-or" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>OR</span>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="form-input"
                    placeholder="Paste image URL directly..."
                    style={{ flex: 1 }}
                  />
                </div>
              </div>

              {/* Reading Time & Tags Row */}
              <div className="admin-form-row">
                <div className="form-group">
                  <label htmlFor="readingTime" className="form-label">Reading Time Estimation</label>
                  <input
                    type="text"
                    id="readingTime"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    className="form-input"
                    placeholder="e.g. 5 min read"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="tags" className="form-label">Tags (separated by commas)</label>
                  <input
                    type="text"
                    id="tags"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="form-input"
                    placeholder="e.g. Branding, Layouts, Figma, Web Design"
                  />
                </div>
              </div>

              {/* Featured & Published Checkboxes Row */}
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
                    Mark as Featured Post
                  </label>
                </div>

                <div className="admin-checkbox-group">
                  <input
                    type="checkbox"
                    id="published"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="admin-checkbox-input"
                  />
                  <label htmlFor="published" className="admin-checkbox-label">
                    Publish Immediately
                  </label>
                </div>
              </div>

              {/* Actions Button Bar */}
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
                  {editMode ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;
