import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useGameState } from '../contexts/GameStateContext';
import { useCustomizationContext } from '../contexts/CustomizationContext';
import { useShopContext } from '../contexts/ShopContext';
import LessonList from './LessonList';
import VimSimulatorRefactored from './VimSimulatorRefactored';
import Achievements from './Achievements';
import Shop from './Shop';
import Profile from './Profile';
import Leaderboard from './Leaderboard';
import DailyChallengeCompact from './DailyChallengeCompact';
import StreakCompact from './StreakCompact';
import { Tabs } from './common';
import { lessons } from '../data/lessons';
import { achievementList } from '../data/achievements';
import { shopItems } from '../data/shop';
import './Dashboard.css';

function DashboardRefactored() {
  const { username, logout } = useAuthContext();
  const { progress, achievements, streak, dailyChallenge, handleLessonComplete } = useGameState();
  const { activeCustomizations } = useCustomizationContext();
  const { currentPoints, devMode, setDevMode, addDevPoints } = useShopContext();

  const [currentLesson, setCurrentLesson] = useState(null);
  const [view, setView] = useState('lessons');

  const handleLessonSelect = (lesson) => {
    setCurrentLesson(lesson);
    setView('simulator');
  };

  const handleLessonExit = () => {
    setCurrentLesson(null);
    setView('lessons');
  };

  const handleComplete = async (data) => {
    await handleLessonComplete(data);
  };

  const handleNextLesson = () => {
    if (currentLesson) {
      const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
      if (currentIndex < lessons.length - 1) {
        setCurrentLesson(lessons[currentIndex + 1]);
      } else {
        // If it's the last lesson, go back to lesson list
        handleLessonExit();
      }
    }
  };

  // Get actual effect values from item IDs
  const getBadgeEffect = () => {
    if (!activeCustomizations.badge_effect) return null;
    const item = shopItems.find(i => i.id === activeCustomizations.badge_effect);
    return item?.effect || null;
  };

  const getCompletionEffect = () => {
    if (!activeCustomizations.completion_effect) return null;
    const item = shopItems.find(i => i.id === activeCustomizations.completion_effect);
    return item?.effect || null;
  };

  const navTabs = [
    { value: 'lessons', label: 'Lessons', icon: '📚' },
    { value: 'achievements', label: 'Achievements', icon: '🏆' },
    { value: 'shop', label: 'Shop', icon: '🛒' },
    { value: 'profile', label: 'Profile', icon: '👤' },
    { value: 'leaderboard', label: 'Leaderboard', icon: '📊' }
  ];

  if (progress.loading || achievements.loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">⌨️ VIM QUEST</h1>
          {activeCustomizations.title && (
            <span className="user-title">
              {shopItems.find(i => i.id === activeCustomizations.title)?.title}
            </span>
          )}
        </div>
        <div className="header-center">
          <DailyChallengeCompact />
          <StreakCompact />
        </div>
        <div className="header-right">
          <div className="header-stats">
            <div className="stat">
              <span className="stat-label">Progress</span>
              <span className="stat-value">
                {progress.progress.filter(p => p.completed).length}/{lessons.length}
              </span>
            </div>
            <div className="stat">
              <span className="stat-label">Points</span>
              <span className="stat-value">{currentPoints}</span>
            </div>
          </div>
          <div className="user-info">
            <span className="username">{username}</span>
            <button onClick={logout} className="logout-button">Logout</button>
          </div>
        </div>
      </div>

      {currentLesson && view === 'simulator' ? (
        <VimSimulatorRefactored
          lesson={currentLesson}
          onBackToLessons={handleLessonExit}
          onNextLesson={handleNextLesson}
          onComplete={handleComplete}
          progress={progress.progress}
          editorStyle={activeCustomizations.editor_style}
          completionEffect={getCompletionEffect()}
        />
      ) : (
        <>
          <Tabs
            tabs={navTabs}
            activeTab={view}
            onChange={setView}
            className="dashboard-nav"
          />

          <div className="dashboard-content">
            {view === 'lessons' && (
              <LessonList
                lessons={lessons}
                progress={progress.progress}
                onStartLesson={handleLessonSelect}
              />
            )}

            {view === 'achievements' && (
              <Achievements
                achievements={achievements.achievements}
                achievementList={achievementList}
                badgeEffect={getBadgeEffect()}
              />
            )}

            {view === 'shop' && (
              <Shop />
            )}

            {view === 'profile' && (
              <Profile />
            )}

            {view === 'leaderboard' && (
              <Leaderboard />
            )}
          </div>
        </>
      )}

      {devMode && (
        <div className="dev-tools">
          <h3>Dev Tools</h3>
          <button onClick={() => addDevPoints(100)}>Add 100 Points</button>
        </div>
      )}
    </div>
  );
}

export default DashboardRefactored;
