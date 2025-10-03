import React, { createContext, useContext, useState } from 'react';
import { useAuthContext } from './AuthContext';
import { useProgress } from '../hooks/useProgress';
import { useAchievements } from '../hooks/useAchievements';
import { useStreak } from '../hooks/useStreak';
import { useDailyChallenge } from '../hooks/useDailyChallenge';

const GameStateContext = createContext(null);

export function GameStateProvider({ children }) {
  const { token } = useAuthContext();
  const [sessionLessonsCompleted, setSessionLessonsCompleted] = useState(0);

  const progressHook = useProgress(token);
  const achievementsHook = useAchievements(
    token,
    progressHook.progress,
    sessionLessonsCompleted
  );
  const streakHook = useStreak(token);
  const dailyChallengeHook = useDailyChallenge(token);

  const handleLessonComplete = async (data) => {
    const saved = await progressHook.saveProgress(data);
    if (saved) {
      setSessionLessonsCompleted(prev => prev + 1);
      await achievementsHook.checkAchievements(data);

      // Check daily challenge completion
      const isChallengeCompleted = dailyChallengeHook.checkCompletion(data);
      if (isChallengeCompleted) {
        await dailyChallengeHook.complete(data, () => {
          achievementsHook.refetch();
          streakHook.refetch();
        });
      }
    }
    return saved;
  };

  return (
    <GameStateContext.Provider
      value={{
        progress: progressHook,
        achievements: achievementsHook,
        streak: streakHook,
        dailyChallenge: dailyChallengeHook,
        sessionLessonsCompleted,
        handleLessonComplete
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
}

export function useGameState() {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
}
