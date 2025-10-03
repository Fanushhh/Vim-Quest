import { forwardRef, useImperativeHandle } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useGameState } from '../contexts/GameStateContext';
import './DailyChallengeCompact.css';

const DailyChallengeCompact = forwardRef((props, ref) => {
  const { token } = useAuthContext();
  const { dailyChallenge } = useGameState();
  const { challenge, loading, celebrating, checkCompletion } = dailyChallenge;

  // Expose checkChallengeCompletion to parent via ref
  useImperativeHandle(ref, () => ({
    checkChallengeCompletion: checkCompletion
  }));

  if (loading) {
    return null;
  }

  if (!challenge || !challenge.challenge_data) {
    return null;
  }

  const { challenge_data, completed, points_reward } = challenge;

  return (
    <div className={`daily-challenge-compact ${completed ? 'completed' : ''} ${celebrating ? 'celebrating' : ''}`}>
      {/* Compact view */}
      <div className="compact-view">
        <div className="challenge-icon">{completed ? '✓' : '🎯'}</div>
        <div className="challenge-progress">
          {challenge_data?.type === 'three_lessons'
            ? `${Math.min(challenge.lessonsCompletedToday || 0, 3)}/3`
            : completed ? '1/1' : '0/1'}
        </div>
      </div>

      {/* Tooltip */}
      <div className="challenge-tooltip">
        <div className="tooltip-header">
          <span>Daily Challenge</span>
          {completed ? (
            <span className="status-badge">✓</span>
          ) : (
            <span className="points-badge">+{points_reward || 0}</span>
          )}
        </div>
        <div className="tooltip-body">
          <strong>{challenge_data?.name || 'Daily Challenge'}</strong>
          <p>{challenge_data?.description || ''}</p>
          {challenge_data?.type === 'three_lessons' && !completed && (
            <p style={{ marginTop: '8px', color: '#60a5fa' }}>
              Progress: {challenge.lessonsCompletedToday || 0}/3 lessons
            </p>
          )}
        </div>
      </div>

      {/* Celebration overlay */}
      {celebrating && (
        <div className="celebration-popup">
          🎉 +{points_reward || 0}pts
        </div>
      )}
    </div>
  );
});

DailyChallengeCompact.displayName = 'DailyChallengeCompact';

export default DailyChallengeCompact;
