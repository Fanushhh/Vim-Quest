import { useState, useEffect } from 'react';
import './StreakDisplay.css';

function StreakDisplay({ token }) {
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    console.log('StreakDisplay component mounted!');
    fetchStreak();
  }, []);

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

  const generateCalendarDays = () => {
    if (!streak || !streak.last_activity_date) return [];

    const days = [];
    const today = new Date();

    // Show last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const lastActivity = new Date(streak.last_activity_date);
      const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));

      // Day is active if within the current streak
      const isActive = daysDiff <= (streak.current_streak - 1) &&
                      date <= lastActivity &&
                      date >= new Date(lastActivity.getTime() - (streak.current_streak - 1) * 24 * 60 * 60 * 1000);

      const isToday = dateStr === today.toISOString().split('T')[0];

      days.push({
        date: dateStr,
        day: date.getDate(),
        isActive,
        isToday
      });
    }

    return days;
  };

  if (loading) {
    return <div className="streak-display loading">Loading streak...</div>;
  }

  if (!streak) {
    return null;
  }

  const calendarDays = generateCalendarDays();

  return (
    <div className="streak-display">
      <div className="streak-header" onClick={() => setShowCalendar(!showCalendar)}>
        <div className="streak-info">
          <div className="streak-icon">🔥</div>
          <div className="streak-stats">
            <div className="current-streak">
              <span className="streak-number">{streak.current_streak}</span>
              <span className="streak-label">Day Streak</span>
            </div>
            <div className="longest-streak">
              Best: {streak.longest_streak} days
            </div>
          </div>
        </div>
        {streak.streak_freeze_count > 0 && (
          <div className="streak-freezes">
            <span className="freeze-icon">❄️</span>
            <span className="freeze-count">{streak.streak_freeze_count}</span>
          </div>
        )}
      </div>

      {showCalendar && (
        <div className="streak-calendar">
          <h4>Last 30 Days</h4>
          <div className="calendar-grid">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`calendar-day ${day.isActive ? 'active' : ''} ${day.isToday ? 'today' : ''}`}
                title={day.date}
              >
                <span className="day-number">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="calendar-legend">
            <div className="legend-item">
              <div className="legend-box active"></div>
              <span>Active day</span>
            </div>
            <div className="legend-item">
              <div className="legend-box"></div>
              <span>Inactive</span>
            </div>
            <div className="legend-item">
              <div className="legend-box today"></div>
              <span>Today</span>
            </div>
          </div>
        </div>
      )}

      {streak.current_streak >= 3 && (
        <div className="streak-motivation">
          {streak.current_streak >= 30 && "🌟 Legendary dedication!"}
          {streak.current_streak >= 14 && streak.current_streak < 30 && "💪 Two weeks strong!"}
          {streak.current_streak >= 7 && streak.current_streak < 14 && "🎯 One week milestone!"}
          {streak.current_streak >= 3 && streak.current_streak < 7 && "🚀 Keep it going!"}
        </div>
      )}
    </div>
  );
}

export default StreakDisplay;
