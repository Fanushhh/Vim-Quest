import { useState, useCallback, useEffect } from 'react';
import { lessons } from '../data/lessons';
import { achievementList as fullAchievementList } from '../data/achievements';
import { API_URL } from '../config';

const achievementList = [
  'first_lesson', 'beginner_complete', 'intermediate_complete', 'advanced_complete',
  'developer_complete', 'all_complete', 'speed_demon', 'lightning_fast', 'perfect_score',
  'flawless_five', 'efficient_editor', 'speed_and_accuracy', 'copy_paste_pro',
  'early_bird', 'night_owl', 'comeback_kid', 'vim_sensei', 'movement_master',
  'deletion_expert', 'search_specialist', 'refactor_guru', 'persistent',
  'triple_perfect', 'marathon_runner', 'quick_learner', 'ultimate_champion'
];

export function useAchievements(token, progress, sessionLessonsCompleted = 0, soundManager = null, activeSound = null) {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/achievements`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch achievements:', error);
      return null;
    }
  }, [token]);

  useEffect(() => {
    fetchData().then((data) => {
      if (data) setAchievements(data);
      setLoading(false);
    });
  }, [token]);

  const unlockAchievement = useCallback(async (achievementType) => {
    if (!token) return false;

    try {
      await fetch(`${API_URL}/api/achievements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ achievementType })
      });

      const data = await fetchData();
      if (data) setAchievements(data);

      // Play sound if available
      if (soundManager && activeSound) {
        await soundManager.playSoundForPack(activeSound);
      }

      return true;
    } catch (error) {
      console.error('Failed to unlock achievement:', error);
      return false;
    }
  }, [token, soundManager, activeSound]);

  const checkExistingAchievements = useCallback(async () => {
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

    // Unlock achievements
    for (const achievement of newAchievements) {
      await unlockAchievement(achievement);
    }

    return newAchievements;
  }, [progress, achievements, unlockAchievement]);

  const checkAchievements = useCallback(async (progressData) => {
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

    // Unlock all new achievements
    for (const achievement of newAchievements) {
      await unlockAchievement(achievement);
    }

    return newAchievements;
  }, [progress, achievements, sessionLessonsCompleted, unlockAchievement]);

  const refetch = useCallback(async () => {
    setLoading(true);
    const data = await fetchData();
    if (data) setAchievements(data);
    setLoading(false);
  }, []);

  return {
    achievements,
    loading,
    checkAchievements,
    checkExistingAchievements,
    unlockAchievement,
    refetch
  };
}
