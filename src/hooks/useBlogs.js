import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBlogs = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.featured) queryParams.append('featured', 'true');
      if (params.category) queryParams.append('category', params.category);
      if (params.adminMode) queryParams.append('adminMode', 'true');
      
      const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
      const response = await api(`/blogs${queryString}`);
      
      if (response.success) {
        setBlogs(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch blogs');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch blogs');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBlogBySlugOrId = async (slugOrId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api(`/blogs/${slugOrId}`);
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to load blog post');
      }
    } catch (err) {
      setError(err.message || 'Failed to load blog post');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createBlog = async (blogData) => {
    try {
      const response = await api('/blogs', {
        method: 'POST',
        body: blogData
      });
      return response;
    } catch (err) {
      console.error('Error creating blog:', err.message);
      return { success: false, message: err.message };
    }
  };

  const updateBlog = async (id, blogData) => {
    try {
      const response = await api(`/blogs/${id}`, {
        method: 'PUT',
        body: blogData
      });
      return response;
    } catch (err) {
      console.error(`Error updating blog ${id}:`, err.message);
      return { success: false, message: err.message };
    }
  };

  const deleteBlog = async (id) => {
    try {
      const response = await api(`/blogs/${id}`, {
        method: 'DELETE'
      });
      return response;
    } catch (err) {
      console.error(`Error deleting blog ${id}:`, err.message);
      return { success: false, message: err.message };
    }
  };

  return {
    blogs,
    loading,
    error,
    fetchBlogs,
    getBlogBySlugOrId,
    createBlog,
    updateBlog,
    deleteBlog
  };
};
