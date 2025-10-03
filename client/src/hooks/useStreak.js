import { useState, useCallback, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useStreak(token) {
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStreak = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/streak`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setStreak(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch streak:', error);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  return {
    streak,
    loading,
    refetch: fetchStreak
  };
}
