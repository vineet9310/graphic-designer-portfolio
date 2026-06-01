import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api('/projects');
      if (response.success) {
        setProjects(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFeaturedProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api('/projects/featured');
      if (response.success) {
        setFeaturedProjects(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch featured projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const getProjectBySlug = async (slug) => {
    try {
      const response = await api(`/projects/${slug}`);
      if (response.success) {
        return response.data;
      }
      return null;
    } catch (err) {
      console.error(`Error fetching project by slug ${slug}:`, err.message);
      throw err;
    }
  };

  return {
    projects,
    featuredProjects,
    loading,
    error,
    fetchProjects,
    fetchFeaturedProjects,
    getProjectBySlug
  };
};
