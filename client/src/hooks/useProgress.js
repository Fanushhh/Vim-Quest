import { useState, useCallback, useEffect } from 'react';
import { API_URL } from '../config';

export function useProgress(token) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      return null;
    }
  }, [token]);

  useEffect(() => {
    fetchData().then((data) => {
      if (data) setProgress(data);
      setLoading(false);
    });
  }, [token]);

  const saveProgress = useCallback(async (progressData) => {
    if (!token) return false;

    try {
      await fetch(`${API_URL}/api/progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(progressData)
      });

      const data = await fetchData();
      if (data) setProgress(data);
      return true;
    } catch (error) {
      console.error('Failed to save progress:', error);
      return false;
    }
  }, [token]);

  const getProgress = useCallback((lessonId) => {
    return progress.find(p => (p.lessonId || p.lesson_id) === lessonId);
  }, [progress]);

  const isCompleted = useCallback((lessonId) => {
    return progress.some(p => (p.lessonId || p.lesson_id) === lessonId && p.completed);
  }, [progress]);

  const refetch = useCallback(async () => {
    setLoading(true);
    const data = await fetchData();
    if (data) setProgress(data);
    setLoading(false);
  }, []);

  return { progress, loading, saveProgress, getProgress, isCompleted, refetch };
}
