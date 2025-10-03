import { useState, useEffect } from 'react';
import { API_URL } from '../config';
import './Leaderboard.css';

function Leaderboard({ token, username }) {
  const [view, setView] = useState('global'); // global, weekly, lesson
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState(1);
  const [sortBy, setSortBy] = useState('total_score');

  useEffect(() => {
    fetchLeaderboard();
    if (token) {
      fetchUserRank();
    }
  }, [view, selectedLesson, sortBy]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      let url = '';
      if (view === 'global') {
        url = `${API_URL}/api/leaderboard/global?sortBy=${sortBy}&limit=100`;
      } else if (view === 'weekly') {
        url = `${API_URL}/api/leaderboard/weekly?limit=100`;
      } else if (view === 'lesson') {
        url = `${API_URL}/api/leaderboard/lesson/${selectedLesson}?sortBy=${sortBy}&limit=100`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setLeaderboardData(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRank = async () => {
    try {
      const type = view === 'weekly' ? 'weekly' : 'global';
      const response = await fetch(`${API_URL}/api/leaderboard/rank?type=${type}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUserRank(data);
    } catch (error) {
      console.error('Failed to fetch user rank:', error);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    if (rank <= 10) return '🔟';
    if (rank <= 100) return '💯';
    return '⭐';
  };

  const formatTime = (seconds) => {
    if (!seconds) return 'N/A';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const renderGlobalLeaderboard = () => (
    <div className="leaderboard-table">
      <div className="sort-controls">
        <label>Sort by:</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="total_score">Total Score</option>
          <option value="average_score">Average Score</option>
          <option value="total_achievements">Achievements</option>
          <option value="fastest_lesson_time">Fastest Time</option>
          <option value="perfect_lessons">Perfect Lessons</option>
          <option value="current_streak">Current Streak</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Total Score</th>
            <th>Lessons</th>
            <th>Avg Score</th>
            <th>Achievements</th>
            <th>Streak</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry) => (
            <tr key={entry.user_id} className={entry.username === username ? 'current-user' : ''}>
              <td className="player-cell">
                <span className="rank-badge">{getRankBadge(entry.rank)}</span>
                <div className="player-info">
                  <span className="username">{entry.username}</span>
                  {entry.username === username && <span className="you-badge">YOU</span>}
                </div>
              </td>
              <td className="score-cell">{entry.total_score}</td>
              <td>{entry.total_lessons_completed}</td>
              <td>{entry.average_score?.toFixed(1)}</td>
              <td>{entry.total_achievements}</td>
              <td>{entry.current_streak} 🔥</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderWeeklyLeaderboard = () => (
    <div className="leaderboard-table">
      <div className="weekly-info">
        <p>📅 This week's competition - resets every Monday!</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Weekly Score</th>
            <th>Lessons This Week</th>
            <th>Achievements</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry) => (
            <tr key={entry.user_id} className={entry.username === username ? 'current-user' : ''}>
              <td className="player-cell">
                <span className="rank-badge">{getRankBadge(entry.rank)}</span>
                <div className="player-info">
                  <span className="username">{entry.username}</span>
                  {entry.username === username && <span className="you-badge">YOU</span>}
                </div>
              </td>
              <td className="score-cell">{entry.weekly_score}</td>
              <td>{entry.weekly_lessons}</td>
              <td>{entry.weekly_achievements}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderLessonLeaderboard = () => (
    <div className="leaderboard-table">
      <div className="lesson-selector">
        <label>Select Lesson:</label>
        <select value={selectedLesson} onChange={(e) => setSelectedLesson(e.target.value)}>
          {Array.from({ length: 18 }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>Lesson {num}</option>
          ))}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="best_time">Fastest Time</option>
          <option value="best_score">Best Score</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Best Time</th>
            <th>Best Score</th>
            <th>Attempts</th>
          </tr>
        </thead>
        <tbody>
          {leaderboardData.map((entry) => (
            <tr key={entry.user_id} className={entry.username === username ? 'current-user' : ''}>
              <td className="player-cell">
                <span className="rank-badge">{getRankBadge(entry.rank)}</span>
                <div className="player-info">
                  <span className="username">{entry.username}</span>
                  {entry.username === username && <span className="you-badge">YOU</span>}
                </div>
              </td>
              <td className="time-cell">{formatTime(entry.best_time)}</td>
              <td className="score-cell">{entry.best_score}</td>
              <td>{entry.attempts}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>🏆 Leaderboards</h2>
        <p>Compete with other Vim enthusiasts and climb the ranks!</p>
      </div>

      {userRank && (
        <div className="user-rank-card">
          <h3>Your Rank</h3>
          <div className="rank-info">
            <span className="rank-badge-large">{getRankBadge(userRank.rank || 999)}</span>
            <div className="rank-details">
              <p className="rank-number-large">#{userRank.rank || 'Unranked'}</p>
              <p className="rank-score">
                {view === 'weekly'
                  ? `${userRank.weekly_score || 0} points this week`
                  : `${userRank.total_score || 0} total points`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="leaderboard-tabs">
        <button
          className={`tab-button ${view === 'global' ? 'active' : ''}`}
          onClick={() => setView('global')}
        >
          🌍 Global
        </button>
        <button
          className={`tab-button ${view === 'weekly' ? 'active' : ''}`}
          onClick={() => setView('weekly')}
        >
          📅 Weekly
        </button>
        <button
          className={`tab-button ${view === 'lesson' ? 'active' : ''}`}
          onClick={() => setView('lesson')}
        >
          📚 By Lesson
        </button>
      </div>

      <div className="leaderboard-content">
        {loading ? (
          <div className="loading">Loading leaderboard...</div>
        ) : leaderboardData.length === 0 ? (
          <div className="empty-state">
            <p>No entries yet. Be the first to compete!</p>
          </div>
        ) : (
          <>
            {view === 'global' && renderGlobalLeaderboard()}
            {view === 'weekly' && renderWeeklyLeaderboard()}
            {view === 'lesson' && renderLessonLeaderboard()}
          </>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
