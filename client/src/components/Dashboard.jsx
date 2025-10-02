import { useState, useEffect } from 'react';
import LessonList from './LessonList';
import VimSimulatorRefactored from './VimSimulatorRefactored';
import Achievements from './Achievements';
import { lessons, achievements as achievementList } from '../data/lessons';
import { API_URL } from '../config';
import './Dashboard.css';

function Dashboard({ username, token, onLogout }) {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('lessons'); // lessons, achievements

  useEffect(() => {
    fetchProgress();
    fetchAchievements();
  }, []);

  // Check for achievements when progress is loaded
  useEffect(() => {
    if (progress.length > 0 && !loading) {
      checkExistingAchievements();
    }
  }, [progress, loading]);

  const fetchProgress = async () => {
    try {
      const response = await fetch(`${API_URL}/api/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setProgress(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch progress:', error);
      setLoading(false);
    }
  };

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`${API_URL}/api/achievements`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setAchievements(data);
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
    }
  };

  const saveProgress = async (progressData) => {
    try {
      await fetch(`${API_URL}/api/progress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(progressData)
      });

      // Refresh progress
      await fetchProgress();

      // Check for new achievements
      await checkAchievements(progressData);
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  // Check achievements for existing progress on page load
  const checkExistingAchievements = async () => {
    const completedLessons = progress.filter(p => p.completed);
    const newAchievements = [];

    // First lesson
    if (completedLessons.length >= 1 && !achievements.find(a => a.achievement_type === 'first_lesson')) {
      newAchievements.push('first_lesson');
    }

    // Beginner complete (lessons 1-4)
    const beginnerCount = completedLessons.filter(p => {
      const lessonId = p.lessonId || p.lesson_id;
      return lessonId <= 4;
    }).length;
    if (beginnerCount === 4 && !achievements.find(a => a.achievement_type === 'beginner_complete')) {
      newAchievements.push('beginner_complete');
    }

    // Intermediate complete (lessons 5-9)
    const intermediateCount = completedLessons.filter(p => {
      const lessonId = p.lessonId || p.lesson_id;
      return lessonId >= 5 && lessonId <= 9;
    }).length;
    if (intermediateCount === 5 && !achievements.find(a => a.achievement_type === 'intermediate_complete')) {
      newAchievements.push('intermediate_complete');
    }

    // Advanced complete (lessons 10-12)
    const advancedCount = completedLessons.filter(p => {
      const lessonId = p.lessonId || p.lesson_id;
      return lessonId >= 10;
    }).length;
    if (advancedCount === 3 && !achievements.find(a => a.achievement_type === 'advanced_complete')) {
      newAchievements.push('advanced_complete');
    }

    // All complete
    if (completedLessons.length === lessons.length && !achievements.find(a => a.achievement_type === 'all_complete')) {
      newAchievements.push('all_complete');
    }

    // Unlock new achievements
    for (const achievement of newAchievements) {
      await fetch(`${API_URL}/api/achievements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ achievementType: achievement })
      });
    }

    if (newAchievements.length > 0) {
      await fetchAchievements();
    }
  };

  const checkAchievements = async (progressData) => {
    const completedLessons = [...progress.filter(p => p.completed), progressData].filter(p => p.completed);
    const newAchievements = [];

    // First lesson
    if (completedLessons.length === 1 && !achievements.find(a => a.achievement_type === 'first_lesson')) {
      newAchievements.push('first_lesson');
    }

    // Beginner complete (lessons 1-4)
    const beginnerCount = completedLessons.filter(p => {
      const lessonId = p.lessonId || p.lesson_id;
      return lessonId <= 4;
    }).length;
    if (beginnerCount === 4 && !achievements.find(a => a.achievement_type === 'beginner_complete')) {
      newAchievements.push('beginner_complete');
    }

    // Intermediate complete (lessons 5-9)
    const intermediateCount = completedLessons.filter(p => {
      const lessonId = p.lessonId || p.lesson_id;
      return lessonId >= 5 && lessonId <= 9;
    }).length;
    if (intermediateCount === 5 && !achievements.find(a => a.achievement_type === 'intermediate_complete')) {
      newAchievements.push('intermediate_complete');
    }

    // Advanced complete (lessons 10-12)
    const advancedCount = completedLessons.filter(p => {
      const lessonId = p.lessonId || p.lesson_id;
      return lessonId >= 10;
    }).length;
    if (advancedCount === 3 && !achievements.find(a => a.achievement_type === 'advanced_complete')) {
      newAchievements.push('advanced_complete');
    }

    // All complete
    if (completedLessons.length === lessons.length && !achievements.find(a => a.achievement_type === 'all_complete')) {
      newAchievements.push('all_complete');
    }

    // Speed demon (under 30 seconds)
    if (progressData.timeTaken < 30 && !achievements.find(a => a.achievement_type === 'speed_demon')) {
      newAchievements.push('speed_demon');
    }

    // Perfect score
    if (progressData.mistakes === 0 && !achievements.find(a => a.achievement_type === 'perfect_score')) {
      newAchievements.push('perfect_score');
    }

    // Unlock new achievements
    for (const achievement of newAchievements) {
      await fetch(`${API_URL}/api/achievements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ achievementType: achievement })
      });
    }

    if (newAchievements.length > 0) {
      await fetchAchievements();
    }
  };

  const handleLessonComplete = (data) => {
    saveProgress(data);
    // Don't redirect anymore - let user choose
  };

  const handleStartLesson = (lesson) => {
    setCurrentLesson(lesson);
  };

  const handleBackToLessons = () => {
    setCurrentLesson(null);
  };

  const handleNextLesson = () => {
    if (currentLesson) {
      const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
      if (currentIndex < lessons.length - 1) {
        setCurrentLesson(lessons[currentIndex + 1]);
      } else {
        // If it's the last lesson, go back to lesson list
        setCurrentLesson(null);
      }
    }
  };

  const getCompletedCount = () => {
    return progress.filter(p => p.completed).length;
  };

  if (loading) {
    return <div className="dashboard loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>⌨️ VIM QUEST</h1>
          <p className="welcome">Welcome, <strong>{username}</strong>!</p>
        </div>
        <div className="header-right">
          <div className="stats">
            <div className="stat">
              <span className="stat-value">{getCompletedCount()}</span>
              <span className="stat-label">Lessons Completed</span>
            </div>
            <div className="stat">
              <span className="stat-value">{achievements.length}</span>
              <span className="stat-label">Achievements</span>
            </div>
          </div>
          <button className="logout-button" onClick={onLogout}>Logout</button>
        </div>
      </header>

      {!currentLesson && (
        <nav className="dashboard-nav">
          <button
            className={`nav-button ${view === 'lessons' ? 'active' : ''}`}
            onClick={() => setView('lessons')}
          >
            📚 Lessons
          </button>
          <button
            className={`nav-button ${view === 'achievements' ? 'active' : ''}`}
            onClick={() => setView('achievements')}
          >
            🏆 Achievements
          </button>
        </nav>
      )}

      <main className="dashboard-content">
        {currentLesson ? (
          <div className="lesson-container">
            <button className="back-button" onClick={handleBackToLessons}>
              ← Back to Lessons
            </button>
            <div className="simulator-header">
              <h2>
                <span className="lesson-number-small">#{currentLesson.id}</span>
                {currentLesson.title}
              </h2>
              <p className="lesson-description">{currentLesson.description}</p>
              <div className="lesson-difficulty">
                Difficulty: <span className={`badge ${currentLesson.difficulty}`}>
                  {currentLesson.difficulty}
                </span>
              </div>
              <p className="lesson-instructions">📋 {currentLesson.instructions}</p>
            </div>
            <VimSimulatorRefactored
              lesson={currentLesson}
              onComplete={handleLessonComplete}
              onNextLesson={handleNextLesson}
              onBackToLessons={handleBackToLessons}
            />
          </div>
        ) : view === 'lessons' ? (
          <LessonList
            lessons={lessons}
            progress={progress}
            onStartLesson={handleStartLesson}
          />
        ) : (
          <Achievements
            achievements={achievements}
            achievementList={achievementList}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
