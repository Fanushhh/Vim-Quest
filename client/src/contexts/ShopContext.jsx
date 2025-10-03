import React, { createContext, useContext, useState } from 'react';
import { useAuthContext } from './AuthContext';
import { useGameState } from './GameStateContext';
import { useShop } from '../hooks/useShop';
import { useBoosters } from '../hooks/useBoosters';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const { token } = useAuthContext();
  const { achievements } = useGameState();
  const [devMode, setDevMode] = useState(false);
  const [devPoints, setDevPoints] = useState(0);

  const boostersHook = useBoosters(token);
  const shopHook = useShop(
    token,
    achievements.achievements,
    boostersHook.boosters,
    devMode,
    devPoints
  );

  const handlePurchase = async (itemId, item) => {
    // Handle boosters/consumables
    if (item && item.consumable) {
      if (itemId === 'special_double_xp') {
        await boostersHook.activateDoubleXP(item.duration);
      } else if (itemId === 'special_hint_pack') {
        await boostersHook.addHints(item.quantity);
      } else if (itemId === 'special_streak_freeze') {
        await boostersHook.addStreakFreeze(item.quantity);
      }
    } else {
      // Regular items
      await shopHook.purchase(itemId);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        ...shopHook,
        boosters: boostersHook,
        handlePurchase,
        devMode,
        setDevMode,
        devPoints,
        setDevPoints,
        addDevPoints: (amount) => setDevPoints(prev => prev + amount)
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShopContext() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShopContext must be used within a ShopProvider');
  }
  return context;
}
