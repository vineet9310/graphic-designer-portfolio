import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const useSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api('/settings');
      if (response.success) {
        setSettings(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateSettings = async (updatedData) => {
    try {
      const response = await api('/settings', {
        method: 'PUT',
        body: updatedData
      });
      if (response.success) {
        setSettings(response.data);
        return { success: true, data: response.data };
      }
      return { success: false, message: response.message || 'Failed to update settings' };
    } catch (err) {
      console.error('Error updating settings:', err.message);
      return { success: false, message: err.message };
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings
  };
};
