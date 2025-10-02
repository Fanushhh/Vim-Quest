import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import './StreakCompact.css';

const StreakCompact = forwardRef(({ token }, ref) => {
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('StreakCompact component mounted!');
    fetchStreak();
  }, []);

  // Expose refreshStreak to parent via ref
  useImperativeHandle(ref, () => ({
    refreshStreak: fetchStreak
  }));

  const fetchStreak = async () => {
    try {
      console.log('Fetching streak...');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/streak`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log('Streak data:', data);
      setStreak(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch streak:', error);
      setLoading(false);
    }
  };

  if (loading || !streak) {
    return null;
  }

  return (
    <div className="streak-compact">
      <div className="streak-flame">🔥</div>
      <div className="streak-number">{streak.current_streak}</div>

      {/* Tooltip on hover */}
      <div className="streak-tooltip">
        <div className="tooltip-row">
          <span className="tooltip-label">Current Streak:</span>
          <span className="tooltip-value">{streak.current_streak} days</span>
        </div>
        <div className="tooltip-row">
          <span className="tooltip-label">Best Streak:</span>
          <span className="tooltip-value">{streak.longest_streak} days</span>
        </div>
        {streak.streak_freeze_count > 0 && (
          <div className="tooltip-row freeze">
            <span className="tooltip-label">❄️ Freezes:</span>
            <span className="tooltip-value">{streak.streak_freeze_count}</span>
          </div>
        )}
        {streak.current_streak >= 3 && (
          <div className="tooltip-motivation">
            {streak.current_streak >= 30 && "🌟 Legendary!"}
            {streak.current_streak >= 14 && streak.current_streak < 30 && "💪 Two weeks!"}
            {streak.current_streak >= 7 && streak.current_streak < 14 && "🎯 One week!"}
            {streak.current_streak >= 3 && streak.current_streak < 7 && "🚀 Keep going!"}
          </div>
        )}
      </div>
    </div>
  );
});

StreakCompact.displayName = 'StreakCompact';

export default StreakCompact;
