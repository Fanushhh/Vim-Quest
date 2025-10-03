import { useState, useEffect, useRef } from 'react';
import LessonList from './LessonList';
import VimSimulatorRefactored from './VimSimulatorRefactored';
import Achievements from './Achievements';
import Shop from './Shop';
import Profile from './Profile';
import Leaderboard from './Leaderboard';
import DailyChallengeCompact from './DailyChallengeCompact';
import StreakCompact from './StreakCompact';
import { lessons, achievements as achievementList } from '../data/lessons';
import { shopItems } from '../data/shop';
import { API_URL } from '../config';
import soundManager from '../utils/soundManager';
import './Dashboard.css';

function Dashboard({ username, token, onLogout }) {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [progress, setProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('lessons'); // lessons, achievements, shop, profile, leaderboard
  const [sessionLessonsCompleted, setSessionLessonsCompleted] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [activeCustomizations, setActiveCustomizations] = useState({
    theme: null,
    editor_style: null,
    badge_effect: null,
    completion_effect: null,
    sound_pack: null,
    title: null
  });
  const [devMode, setDevMode] = useState(false);
  const [devPoints, setDevPoints] = useState(0);
  const [activeBoosters, setActiveBoosters] = useState({
    doubleXP: null, // { expiresAt: timestamp }
    extraHints: 0,
    streakFreeze: 0
  });
  const dailyChallengeRef = useRef(null);
  const streakRef = useRef(null);

  useEffect(() => {
    fetchProgress();
    fetchAchievements();
    fetchPurchasedItems();
    fetchCustomizations();
    fetchBoosters();
  }, []);

  const fetchPurchasedItems = async () => {
    try {
      const response = await fetch(`${API_URL}/api/purchases`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setPurchasedItems(data);
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
    }
  };

  const fetchCustomizations = async () => {
    try {
      const response = await fetch(`${API_URL}/api/customizations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setActiveCustomizations({
        theme: data.theme || null,
        editor_style: data.editor_style || null,
        badge_effect: data.badge_effect || null,
        completion_effect: data.completion_effect || null,
        sound_pack: data.sound_pack || null,
        title: data.title || null
      });
    } catch (error) {
      console.error('Failed to fetch customizations:', error);
    }
  };

  const fetchBoosters = async () => {
    try {
      const response = await fetch(`${API_URL}/api/boosters`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      const boosters = {
        doubleXP: data.doubleXP || null,
        extraHints: data.extraHints || 0,
        streakFreeze: data.streakFreeze || 0
      };

      // Check if double XP expired
      if (boosters.doubleXP && boosters.doubleXP.expiresAt < Date.now()) {
        boosters.doubleXP = null;
      }

      setActiveBoosters(boosters);
    } catch (error) {
      console.error('Failed to fetch boosters:', error);
    }
  };

  const saveBoosters = async (boosters) => {
    try {
      // Save each booster type separately
      if (boosters.doubleXP !== undefined) {
        await fetch(`${API_URL}/api/boosters`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ boosterType: 'doubleXP', value: boosters.doubleXP })
        });
      }
      if (boosters.extraHints !== undefined) {
        await fetch(`${API_URL}/api/boosters`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ boosterType: 'extraHints', value: boosters.extraHints })
        });
      }
      if (boosters.streakFreeze !== undefined) {
        await fetch(`${API_URL}/api/boosters`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ boosterType: 'streakFreeze', value: boosters.streakFreeze })
        });
      }
    } catch (error) {
      console.error('Failed to save boosters:', error);
    }
  };

  // Apply theme when activeCustomizations.theme changes
  useEffect(() => {
    applyTheme(activeCustomizations.theme);
  }, [activeCustomizations.theme]);

  const handleCustomizationChange = async (type, itemId) => {
    const newCustomizations = {
      ...activeCustomizations,
      [type]: itemId
    };
    setActiveCustomizations(newCustomizations);

    try {
      await fetch(`${API_URL}/api/customizations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ customizationType: type, itemId })
      });
    } catch (error) {
      console.error('Failed to save customization:', error);
    }
  };

  const applyTheme = (themeId) => {
    const root = document.documentElement;

    if (!themeId) {
      // Reset to default theme
      root.style.removeProperty('--theme-primary');
      root.style.removeProperty('--theme-secondary');
      root.style.removeProperty('--theme-accent');
      root.style.removeProperty('--theme-background');
      root.style.removeProperty('--theme-card-bg');
      root.style.removeProperty('--theme-border');
      root.style.removeProperty('--theme-hover-bg');
      root.style.removeProperty('--theme-hover-border');
      root.style.removeProperty('--theme-shadow');
      root.style.removeProperty('--theme-gradient');
      return;
    }

    const theme = shopItems.find(item => item.id === themeId);
    if (theme && theme.preview) {
      root.style.setProperty('--theme-primary', theme.preview.primary);
      root.style.setProperty('--theme-secondary', theme.preview.secondary);
      root.style.setProperty('--theme-accent', theme.preview.accent);
      root.style.setProperty('--theme-background', theme.preview.background);
      root.style.setProperty('--theme-card-bg', theme.preview.cardBg);
      root.style.setProperty('--theme-border', theme.preview.border || '#30363d');
      root.style.setProperty('--theme-hover-bg', theme.preview.hoverBg || theme.preview.primary);
      root.style.setProperty('--theme-hover-border', theme.preview.hoverBorder || theme.preview.secondary);
      root.style.setProperty('--theme-shadow', theme.preview.shadow || 'rgba(0, 0, 0, 0.3)');
      root.style.setProperty('--theme-gradient', theme.preview.gradient || 'linear-gradient(135deg, #161b22 0%, #0d1117 100%)');
    }
  };

  const handlePurchase = async (itemId) => {
    const item = shopItems.find(i => i.id === itemId);

    // Handle boosters/consumables
    if (item && item.consumable) {
      if (itemId === 'special_double_xp') {
        const expiresAt = Date.now() + (item.duration * 60 * 60 * 1000); // Convert hours to ms
        const newBoosters = { ...activeBoosters, doubleXP: { expiresAt } };
        setActiveBoosters(newBoosters);
        await saveBoosters(newBoosters);
      } else if (itemId === 'special_hint_pack') {
        const newBoosters = { ...activeBoosters, extraHints: activeBoosters.extraHints + item.quantity };
        setActiveBoosters(newBoosters);
        await saveBoosters(newBoosters);
      } else if (itemId === 'special_streak_freeze') {
        // Directly add to streak freeze count via dedicated API
        try {
          await fetch(`${API_URL}/api/streak/freeze`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount: item.quantity })
          });
          const newBoosters = { ...activeBoosters, streakFreeze: activeBoosters.streakFreeze + item.quantity };
          setActiveBoosters(newBoosters);
        } catch (error) {
          console.error('Failed to add streak freeze:', error);
        }
      }
      // Don't add consumables to purchased items (they're one-time use)
    } else {
      // Regular items (themes, titles, etc.)
      const newPurchasedItems = [...purchasedItems, itemId];
      setPurchasedItems(newPurchasedItems);

      try {
        await fetch(`${API_URL}/api/purchases`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ itemId })
        });
      } catch (error) {
        console.error('Failed to save purchase:', error);
      }
    }
  };

  const calculateTotalPoints = () => {
    let earnedPoints = achievements.reduce((total, achievement) => {
      const achievementData = achievementList.find(
        a => a.type === achievement.achievement_type
      );
      return total + (achievementData?.points || 0);
    }, 0);

    // Apply double XP booster if active
    if (activeBoosters.doubleXP && activeBoosters.doubleXP.expiresAt > Date.now()) {
      earnedPoints *= 2;
    }

    // If dev mode is enabled, return a large number, otherwise return earned + dev points
    return devMode ? 999999 : earnedPoints + devPoints;
  };

  const handleAddPoints = (amount) => {
    setDevPoints(prev => prev + amount);
  };

  const handleToggleDevMode = () => {
    setDevMode(prev => !prev);
  };

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
      return lessonId >= 10 && lessonId <= 12;
    }).length;
    if (advancedCount === 3 && !achievements.find(a => a.achievement_type === 'advanced_complete')) {
      newAchievements.push('advanced_complete');
    }

    // Developer complete (lessons 13-18)
    const developerCount = completedLessons.filter(p => {
      const lessonId = p.lessonId || p.lesson_id;
      return lessonId >= 13 && lessonId <= 18;
    }).length;
    if (developerCount === 6 && !achievements.find(a => a.achievement_type === 'developer_complete')) {
      newAchievements.push('developer_complete');
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
    const allProgress = [...progress, progressData];
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
      return lessonId >= 10 && lessonId <= 12;
    }).length;
    if (advancedCount === 3 && !achievements.find(a => a.achievement_type === 'advanced_complete')) {
      newAchievements.push('advanced_complete');
    }

    // Developer complete (lessons 13-18)
    const developerCount = completedLessons.filter(p => {
      const lessonId = p.lessonId || p.lesson_id;
      return lessonId >= 13 && lessonId <= 18;
    }).length;
    if (developerCount === 6 && !achievements.find(a => a.achievement_type === 'developer_complete')) {
      newAchievements.push('developer_complete');
    }

    // All complete
    if (completedLessons.length === lessons.length && !achievements.find(a => a.achievement_type === 'all_complete')) {
      newAchievements.push('all_complete');
    }

    // Speed demon (under 30 seconds)
    if (progressData.timeTaken < 30 && !achievements.find(a => a.achievement_type === 'speed_demon')) {
      newAchievements.push('speed_demon');
    }

    // Lightning fast (3 lessons under 30 seconds)
    const fastLessons = allProgress.filter(p => p.timeTaken < 30 && p.completed).length;
    if (fastLessons >= 3 && !achievements.find(a => a.achievement_type === 'lightning_fast')) {
      newAchievements.push('lightning_fast');
    }

    // Perfect score
    if (progressData.mistakes === 0 && progressData.completed && !achievements.find(a => a.achievement_type === 'perfect_score')) {
      newAchievements.push('perfect_score');
    }

    // Flawless five (5 lessons without mistakes)
    const flawlessLessons = allProgress.filter(p => p.mistakes === 0 && p.completed).length;
    if (flawlessLessons >= 5 && !achievements.find(a => a.achievement_type === 'flawless_five')) {
      newAchievements.push('flawless_five');
    }

    // Efficient editor (90+ score)
    if (progressData.score >= 90 && !achievements.find(a => a.achievement_type === 'efficient_editor')) {
      newAchievements.push('efficient_editor');
    }

    // Speed and accuracy (under 30s with no mistakes)
    if (progressData.timeTaken < 30 && progressData.mistakes === 0 && progressData.completed &&
        !achievements.find(a => a.achievement_type === 'speed_and_accuracy')) {
      newAchievements.push('speed_and_accuracy');
    }

    // Copy-Paste Pro (lesson 9 perfect score)
    if ((progressData.lessonId === 9 || progressData.lesson_id === 9) &&
        progressData.mistakes === 0 && progressData.completed &&
        !achievements.find(a => a.achievement_type === 'copy_paste_pro')) {
      newAchievements.push('copy_paste_pro');
    }

    // Time-based achievements
    const currentHour = new Date().getHours();
    if (currentHour < 8 && !achievements.find(a => a.achievement_type === 'early_bird')) {
      newAchievements.push('early_bird');
    }
    if (currentHour >= 22 && !achievements.find(a => a.achievement_type === 'night_owl')) {
      newAchievements.push('night_owl');
    }

    // Comeback kid (improved score by 20+)
    const lessonId = progressData.lessonId || progressData.lesson_id;
    const previousAttempt = progress.find(p => (p.lessonId || p.lesson_id) === lessonId);
    if (previousAttempt && progressData.score > previousAttempt.score + 20 &&
        !achievements.find(a => a.achievement_type === 'comeback_kid')) {
      newAchievements.push('comeback_kid');
    }

    // Vim Sensei (90+ average score)
    if (completedLessons.length >= 5) {
      const avgScore = completedLessons.reduce((sum, p) => sum + (p.score || 0), 0) / completedLessons.length;
      if (avgScore >= 90 && !achievements.find(a => a.achievement_type === 'vim_sensei')) {
        newAchievements.push('vim_sensei');
      }
    }

    // Movement Master (lessons 1-3 perfect)
    const movementLessons = [1, 2, 3];
    const movementPerfect = movementLessons.every(id =>
      allProgress.find(p => (p.lessonId || p.lesson_id) === id && p.mistakes === 0 && p.completed)
    );
    if (movementPerfect && !achievements.find(a => a.achievement_type === 'movement_master')) {
      newAchievements.push('movement_master');
    }

    // Deletion Expert (lessons 5, 6, 8 perfect)
    const deletionLessons = [5, 6, 8];
    const deletionPerfect = deletionLessons.every(id =>
      allProgress.find(p => (p.lessonId || p.lesson_id) === id && p.mistakes === 0 && p.completed)
    );
    if (deletionPerfect && !achievements.find(a => a.achievement_type === 'deletion_expert')) {
      newAchievements.push('deletion_expert');
    }

    // Search Specialist (lessons 7, 12 perfect)
    const searchLessons = [7, 12];
    const searchPerfect = searchLessons.every(id =>
      allProgress.find(p => (p.lessonId || p.lesson_id) === id && p.mistakes === 0 && p.completed)
    );
    if (searchPerfect && !achievements.find(a => a.achievement_type === 'search_specialist')) {
      newAchievements.push('search_specialist');
    }

    // Refactor Guru (lessons 14, 15, 18 perfect)
    const refactorLessons = [14, 15, 18];
    const refactorPerfect = refactorLessons.every(id =>
      allProgress.find(p => (p.lessonId || p.lesson_id) === id && p.mistakes === 0 && p.completed)
    );
    if (refactorPerfect && !achievements.find(a => a.achievement_type === 'refactor_guru')) {
      newAchievements.push('refactor_guru');
    }

    // Persistent (retry same lesson 3 times)
    const lessonAttempts = allProgress.filter(p => (p.lessonId || p.lesson_id) === lessonId).length;
    if (lessonAttempts >= 3 && !achievements.find(a => a.achievement_type === 'persistent')) {
      newAchievements.push('persistent');
    }

    // Triple Perfect (3 consecutive perfect lessons)
    // Check last 3 completed lessons
    const recentCompleted = [...allProgress].filter(p => p.completed).sort((a, b) => {
      const aTime = new Date(a.updated_at || a.createdAt || 0).getTime();
      const bTime = new Date(b.updated_at || b.createdAt || 0).getTime();
      return bTime - aTime;
    }).slice(0, 3);
    if (recentCompleted.length >= 3 && recentCompleted.every(p => p.mistakes === 0) &&
        !achievements.find(a => a.achievement_type === 'triple_perfect')) {
      newAchievements.push('triple_perfect');
    }

    // Marathon Runner (10 lessons in one session)
    if (sessionLessonsCompleted + 1 >= 10 && !achievements.find(a => a.achievement_type === 'marathon_runner')) {
      newAchievements.push('marathon_runner');
    }

    // Quick Learner (5 lessons in one day)
    const today = new Date().toDateString();
    const todayLessons = allProgress.filter(p => {
      const lessonDate = new Date(p.updated_at || p.createdAt || 0).toDateString();
      return lessonDate === today && p.completed;
    }).length;
    if (todayLessons >= 5 && !achievements.find(a => a.achievement_type === 'quick_learner')) {
      newAchievements.push('quick_learner');
    }

    // Ultimate Champion (all other achievements)
    const totalAchievements = achievementList.length;
    if (achievements.length + newAchievements.filter(a => a !== 'ultimate_champion').length >= totalAchievements - 1 &&
        !achievements.find(a => a.achievement_type === 'ultimate_champion')) {
      newAchievements.push('ultimate_champion');
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
      // Play achievement sound
      console.log('New achievements unlocked:', newAchievements);
      console.log('Active sound pack:', activeCustomizations.sound_pack);
      if (activeCustomizations.sound_pack) {
        await soundManager.playSoundForPack(activeCustomizations.sound_pack);
      }
    }
  };

  const handleLessonComplete = (data) => {
    saveProgress(data);
    setSessionLessonsCompleted(prev => prev + 1);

    // Check if daily challenge is completed
    if (dailyChallengeRef.current?.checkChallengeCompletion) {
      dailyChallengeRef.current.checkChallengeCompletion(data);
    }
    // Don't redirect anymore - let user choose
  };

  const handleChallengeComplete = () => {
    // Refresh streak and achievements when challenge is completed
    fetchAchievements();
    // Force streak refresh
    if (streakRef.current?.refreshStreak) {
      streakRef.current.refreshStreak();
    }
  };

  const handleStartLesson = (lesson) => {
    setCurrentLesson(lesson);
    // Initialize audio context on user interaction
    soundManager.ensureAudioContext();
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
          <h1>
            ⌨️ VIM QUEST
            {devMode && <span className="dev-mode-badge">DEV MODE</span>}
            {activeBoosters.doubleXP && activeBoosters.doubleXP.expiresAt > Date.now() && (
              <span className="booster-badge double-xp">⚡ 2X POINTS</span>
            )}
          </h1>
          <div className="username-display">{username}</div>
          {activeCustomizations.title && (
            <div className="user-title">
              {shopItems.find(i => i.id === activeCustomizations.title)?.title}
            </div>
          )}
        </div>
        <div className="header-center">
          <DailyChallengeCompact
            ref={dailyChallengeRef}
            token={token}
            onChallengeComplete={handleChallengeComplete}
          />
          <StreakCompact ref={streakRef} token={token} />
          <div className="header-stats-row">
            <div className="stat-item">
              <span className="stat-label">PROGRESS</span>
              <span className="stat-value">{getCompletedCount()}/18</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">POINTS</span>
              <span className="stat-value">{calculateTotalPoints()}</span>
            </div>
            {activeBoosters.extraHints > 0 && (
              <div className="stat-item booster">
                <span className="stat-label">HINTS</span>
                <span className="stat-value">+{activeBoosters.extraHints}</span>
              </div>
            )}
            {activeBoosters.streakFreeze > 0 && (
              <div className="stat-item booster">
                <span className="stat-label">FREEZE</span>
                <span className="stat-value">{activeBoosters.streakFreeze}</span>
              </div>
            )}
          </div>
        </div>
        <div className="header-right">
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
            className={`nav-button ${view === 'leaderboard' ? 'active' : ''}`}
            onClick={() => setView('leaderboard')}
          >
            🏆 Leaderboard
          </button>
          <button
            className={`nav-button ${view === 'achievements' ? 'active' : ''}`}
            onClick={() => setView('achievements')}
          >
            🎖️ Achievements
          </button>
          <button
            className={`nav-button ${view === 'shop' ? 'active' : ''}`}
            onClick={() => setView('shop')}
          >
            🛍️ Shop
          </button>
          <button
            className={`nav-button ${view === 'profile' ? 'active' : ''}`}
            onClick={() => setView('profile')}
          >
            👤 Profile
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
              <div className="lesson-objective">
                <div className="objective-label">🎯 Objective:</div>
                <div className="objective-text">{currentLesson.instructions}</div>
              </div>
            </div>
            <VimSimulatorRefactored
              lesson={currentLesson}
              onComplete={handleLessonComplete}
              onNextLesson={handleNextLesson}
              onBackToLessons={handleBackToLessons}
              editorStyle={activeCustomizations.editor_style}
              completionEffect={
                activeCustomizations.completion_effect
                  ? shopItems.find(i => i.id === activeCustomizations.completion_effect)?.effect
                  : null
              }
            />
          </div>
        ) : view === 'lessons' ? (
          <LessonList
            lessons={lessons}
            progress={progress}
            onStartLesson={handleStartLesson}
          />
        ) : view === 'leaderboard' ? (
          <Leaderboard
            token={token}
            username={username}
          />
        ) : view === 'achievements' ? (
          <Achievements
            achievements={achievements}
            achievementList={achievementList}
            badgeEffect={
              activeCustomizations.badge_effect
                ? shopItems.find(i => i.id === activeCustomizations.badge_effect)?.effect
                : null
            }
          />
        ) : view === 'shop' ? (
          <Shop
            achievements={achievements}
            purchasedItems={purchasedItems}
            onPurchase={handlePurchase}
            totalPoints={calculateTotalPoints()}
          />
        ) : (
          <Profile
            username={username}
            purchasedItems={purchasedItems}
            activeCustomizations={activeCustomizations}
            onCustomizationChange={handleCustomizationChange}
            onAddPoints={handleAddPoints}
            devMode={devMode}
            onToggleDevMode={handleToggleDevMode}
          />
        )}
      </main>
    </div>
  );
}

export default Dashboard;
