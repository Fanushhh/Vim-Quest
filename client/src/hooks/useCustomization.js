import { useState, useCallback, useEffect } from 'react';
import { useFetch } from './useApi';

const API_URL = 'http://localhost:3001';

export function useCustomization(token) {
  const [activeCustomizations, setActiveCustomizations] = useState({
    theme: null,
    editor_style: null,
    badge_effect: null,
    completion_effect: null,
    sound_pack: null,
    title: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadCustomizations();
    }
  }, [token]);

  const loadCustomizations = useCallback(async () => {
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
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch customizations:', error);
      setLoading(false);
    }
  }, [token]);

  const changeCustomization = useCallback(async (type, itemId) => {
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
  }, [token, activeCustomizations]);

  const applyTheme = useCallback((themeId) => {
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

    // Import theme data from shop
    import('../data/shop').then(({ shopItems }) => {
      const themeItem = shopItems.find(item => item.id === themeId);
      if (themeItem && themeItem.preview) {
        const theme = themeItem.preview;
        root.style.setProperty('--theme-primary', theme.primary);
        root.style.setProperty('--theme-secondary', theme.secondary);
        root.style.setProperty('--theme-accent', theme.accent);
        root.style.setProperty('--theme-background', theme.background);
        root.style.setProperty('--theme-card-bg', theme.cardBg);
        root.style.setProperty('--theme-border', theme.border || '#30363d');
        root.style.setProperty('--theme-hover-bg', theme.hoverBg || theme.primary);
        root.style.setProperty('--theme-hover-border', theme.hoverBorder || theme.secondary);
        root.style.setProperty('--theme-shadow', theme.shadow || 'rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--theme-gradient', theme.gradient || `linear-gradient(135deg, ${theme.primary} 0%, ${theme.background} 100%)`);
      }
    });
  }, []);

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(activeCustomizations.theme);
  }, [activeCustomizations.theme, applyTheme]);

  return {
    activeCustomizations,
    loading,
    changeCustomization,
    applyTheme,
    refetch: loadCustomizations
  };
}
