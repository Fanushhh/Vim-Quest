import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import './DailyChallenge.css';

const DailyChallenge = forwardRef(({ token, onChallengeComplete }, ref) => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [celebrating, setCelebrating] = useState(false);

  useEffect(() => {
    console.log('DailyChallenge component mounted!');
    fetchDailyChallenge();
  }, []);

  // Expose checkChallengeCompletion to parent via ref
  useImperativeHandle(ref, () => ({
    checkChallengeCompletion
  }));

  const fetchDailyChallenge = async () => {
    try {
      console.log('Fetching daily challenge...');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/daily-challenge`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Daily challenge data:', data);
      setChallenge(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch daily challenge:', error);
      setLoading(false);
    }
  };

  const checkChallengeCompletion = async (lessonData) => {
    console.log('Checking challenge completion with lesson data:', lessonData);
    console.log('Current challenge:', challenge);

    if (!challenge || challenge.completed) {
      console.log('Challenge already completed or not loaded');
      return;
    }

    const { type } = challenge.challenge_data;
    let isCompleted = false;

    switch (type) {
      case 'speed_run':
        isCompleted = lessonData.timeTaken < 45 && lessonData.completed;
        console.log(`Speed run check: ${lessonData.timeTaken}s < 45s = ${isCompleted}`);
        break;
      case 'perfect_lesson':
        isCompleted = lessonData.mistakes === 0 && lessonData.completed;
        console.log(`Perfect lesson check: ${lessonData.mistakes} mistakes = ${isCompleted}`);
        break;
      case 'specific_lesson':
        isCompleted = lessonData.lessonId === challenge.challenge_data.lessonId && lessonData.completed;
        console.log(`Specific lesson check: ${lessonData.lessonId} === ${challenge.challenge_data.lessonId} = ${isCompleted}`);
        break;
      case 'high_score':
        isCompleted = lessonData.score >= 95 && lessonData.completed;
        console.log(`High score check: ${lessonData.score} >= 95 = ${isCompleted}`);
        break;
      case 'three_lessons':
        // This would need to be tracked separately
        break;
      default:
        break;
    }

    console.log(`Challenge completed: ${isCompleted}`);
    if (isCompleted) {
      await completeDailyChallenge(lessonData);
    }
  };

  const completeDailyChallenge = async (lessonData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/daily-challenge/complete`, {
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
        await fetchDailyChallenge();
        if (onChallengeComplete) {
          onChallengeComplete();
        }
      }
    } catch (error) {
      console.error('Failed to complete daily challenge:', error);
    }
  };

  if (loading) {
    return <div className="daily-challenge loading">Loading challenge...</div>;
  }

  if (!challenge) {
    return null;
  }

  const { challenge_data, completed, points_reward } = challenge;

  return (
    <div className={`daily-challenge ${completed ? 'completed' : ''} ${celebrating ? 'celebrating' : ''}`}>
      <div className="challenge-header">
        <h3>🎯 Daily Challenge</h3>
        {completed ? (
          <span className="challenge-status completed">✓ Completed!</span>
        ) : (
          <span className="challenge-points">+{points_reward} points</span>
        )}
      </div>
      <div className="challenge-content">
        <h4>{challenge_data.name}</h4>
        <p>{challenge_data.description}</p>
      </div>
      {celebrating && (
        <div className="celebration-overlay">
          <div className="celebration-message">
            🎉 Challenge Completed! 🎉
            <div className="points-earned">+{points_reward} points</div>
          </div>
        </div>
      )}
    </div>
  );
});

DailyChallenge.displayName = 'DailyChallenge';

export default DailyChallenge;
