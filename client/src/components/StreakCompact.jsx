import { forwardRef, useImperativeHandle } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useGameState } from '../contexts/GameStateContext';
import './StreakCompact.css';

const StreakCompact = forwardRef((props, ref) => {
  const { token } = useAuthContext();
  const { streak: streakHook } = useGameState();
  const { streak, loading, refetch } = streakHook;

  // Expose refreshStreak to parent via ref
  useImperativeHandle(ref, () => ({
    refreshStreak: refetch
  }));

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
