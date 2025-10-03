import { useState, useCallback, useEffect } from 'react';
import { useFetch, usePost } from './useApi';

const API_URL = 'http://localhost:3001';

export function useBoosters(token) {
  const [boosters, setBoosters] = useState({
    doubleXP: null,
    extraHints: 0,
    streakFreeze: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadBoosters();
    }
  }, [token]);

  const loadBoosters = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/boosters`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setBoosters(data || { doubleXP: null, extraHints: 0, streakFreeze: 0 });
      setLoading(false);
    } catch (error) {
      console.error('Failed to load boosters:', error);
      setLoading(false);
    }
  }, [token]);

  const saveBoosters = useCallback(async (newBoosters) => {
    try {
      await fetch(`${API_URL}/api/boosters`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBoosters)
      });
    } catch (error) {
      console.error('Failed to save boosters:', error);
    }
  }, [token]);

  const activateDoubleXP = useCallback(async (durationHours) => {
    const expiresAt = Date.now() + (durationHours * 60 * 60 * 1000);
    const newBoosters = { ...boosters, doubleXP: { expiresAt } };
    setBoosters(newBoosters);
    await saveBoosters(newBoosters);
  }, [boosters, saveBoosters]);

  const addHints = useCallback(async (quantity) => {
    const newBoosters = { ...boosters, extraHints: boosters.extraHints + quantity };
    setBoosters(newBoosters);
    await saveBoosters(newBoosters);
  }, [boosters, saveBoosters]);

  const addStreakFreeze = useCallback(async (quantity) => {
    try {
      await fetch(`${API_URL}/api/streak/freeze`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: quantity })
      });
      const newBoosters = { ...boosters, streakFreeze: boosters.streakFreeze + quantity };
      setBoosters(newBoosters);
    } catch (error) {
      console.error('Failed to add streak freeze:', error);
    }
  }, [token, boosters]);

  const useHint = useCallback(async () => {
    if (boosters.extraHints > 0) {
      const newBoosters = { ...boosters, extraHints: boosters.extraHints - 1 };
      setBoosters(newBoosters);
      await saveBoosters(newBoosters);
      return true;
    }
    return false;
  }, [boosters, saveBoosters]);

  const isDoubleXPActive = useCallback(() => {
    return boosters.doubleXP && boosters.doubleXP.expiresAt > Date.now();
  }, [boosters]);

  return {
    boosters,
    loading,
    activateDoubleXP,
    addHints,
    addStreakFreeze,
    useHint,
    isDoubleXPActive,
    refetch: loadBoosters
  };
}
