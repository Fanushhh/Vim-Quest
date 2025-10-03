import { useState, useCallback, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useDailyChallenge(token) {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [celebrating, setCelebrating] = useState(false);

  const fetchChallenge = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/api/daily-challenge`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setChallenge(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch daily challenge:', error);
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  const checkCompletion = useCallback((lessonData) => {
    if (!challenge || challenge.completed) {
      return false;
    }

    const { type } = challenge.challenge_data;
    let isCompleted = false;

    switch (type) {
      case 'speed_run':
        isCompleted = lessonData.timeTaken < 45 && lessonData.completed;
        break;
      case 'perfect_lesson':
        isCompleted = lessonData.mistakes === 0 && lessonData.completed;
        break;
      case 'specific_lesson':
        isCompleted = lessonData.lessonId === challenge.challenge_data.lessonId && lessonData.completed;
        break;
      case 'high_score':
        isCompleted = lessonData.score >= 95 && lessonData.completed;
        break;
      case 'three_lessons':
        // This would need to be tracked separately
        break;
      default:
        break;
    }

    return isCompleted;
  }, [challenge]);

  const complete = useCallback(async (lessonData, onComplete) => {
    try {
      const response = await fetch(`${API_URL}/api/daily-challenge/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          challengeId: challenge.id,
          timeTaken: lessonData.timeTaken,
          score: lessonData.score
        })
      });

      if (response.ok) {
        setCelebrating(true);
        setTimeout(() => setCelebrating(false), 3000);
        await fetchChallenge();
        if (onComplete) {
          onComplete();
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to complete daily challenge:', error);
      return false;
    }
  }, [token, challenge, fetchChallenge]);

  return {
    challenge,
    loading,
    celebrating,
    checkCompletion,
    complete,
    refetch: fetchChallenge
  };
}
