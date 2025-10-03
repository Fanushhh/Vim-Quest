import { useState, useCallback, useEffect, useMemo } from 'react';
import { useFetch, usePost } from './useApi';
import { achievementList } from '../data/achievements';
import { shopItems } from '../data/shop';

export function useShop(token, achievements, activeBoosters, devMode = false, devPoints = 0) {
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { execute: fetchData } = useFetch('/api/purchases', token);
  const { post } = usePost('/api/purchases', token);

  useEffect(() => {
    if (token) {
      fetchData().then((data) => {
        if (data) {
          // Server returns array of strings directly, not array of objects
          setPurchasedItems(Array.isArray(data) ? data : []);
        }
        setLoading(false);
      });
    }
  }, [token]);

  const calculateTotalPoints = useCallback(() => {
    let earnedPoints = achievements.reduce((total, achievement) => {
      const achievementData = achievementList.find(
        a => a.type === achievement.achievement_type
      );
      return total + (achievementData?.points || 0);
    }, 0);

    // Apply double XP booster if active
    if (activeBoosters?.doubleXP && activeBoosters.doubleXP.expiresAt > Date.now()) {
      earnedPoints *= 2;
    }

    return devMode ? 999999 : earnedPoints + devPoints;
  }, [achievements, activeBoosters, devMode, devPoints]);

  const calculateSpentPoints = useCallback(() => {
    return purchasedItems.reduce((total, itemId) => {
      const item = shopItems.find(i => i.id === itemId);
      return total + (item?.cost || 0);
    }, 0);
  }, [purchasedItems]);

  const currentPoints = useMemo(() => {
    return calculateTotalPoints() - calculateSpentPoints();
  }, [calculateTotalPoints, calculateSpentPoints]);

  const purchase = useCallback(async (itemId) => {
    try {
      await post({ itemId });
      const newPurchasedItems = [...purchasedItems, itemId];
      setPurchasedItems(newPurchasedItems);
      return true;
    } catch (error) {
      console.error('Failed to purchase item:', error);
      return false;
    }
  }, [post, purchasedItems]);

  const canAfford = useCallback((itemCost) => {
    return currentPoints >= itemCost;
  }, [currentPoints]);

  const hasPurchased = useCallback((itemId) => {
    return purchasedItems.includes(itemId);
  }, [purchasedItems]);

  return {
    purchasedItems,
    currentPoints,
    totalPoints: calculateTotalPoints(),
    purchase,
    canAfford,
    hasPurchased,
    loading
  };
}
