import { useState, useCallback, useEffect } from 'react';

const API_URL = 'http://localhost:3001';

export function useLeaderboard(token, view = 'global', selectedLesson = null, sortBy = 'score') {
  const [data, setData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = useCallback(async () => {
    if (!token) return;

    try {
      let url = `${API_URL}/api/leaderboard`;
      const params = new URLSearchParams();

      if (view === 'lesson' && selectedLesson) {
        params.append('lessonId', selectedLesson);
      }
      if (sortBy) {
        params.append('sortBy', sortBy);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      setData(result);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      setLoading(false);
    }
  }, [token, view, selectedLesson, sortBy]);

  const fetchUserRank = useCallback(async () => {
    if (!token) return;

    try {
      let url = `${API_URL}/api/leaderboard/rank`;
      if (view === 'lesson' && selectedLesson) {
        url += `?lessonId=${selectedLesson}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      setUserRank(result);
    } catch (error) {
      console.error('Failed to fetch user rank:', error);
    }
  }, [token, view, selectedLesson]);

  useEffect(() => {
    fetchLeaderboard();
    fetchUserRank();
  }, [fetchLeaderboard, fetchUserRank]);

  return {
    data,
    userRank,
    loading,
    refetch: fetchLeaderboard
  };
}
