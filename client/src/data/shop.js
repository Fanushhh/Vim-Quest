export const shopItems = [
  // Dashboard Themes
  {
    id: 'theme_ocean',
    name: 'Ocean Theme',
    description: 'Cool blue tones with wave-like gradients',
    type: 'theme',
    cost: 100,
    icon: '🌊',
    preview: {
      primary: '#1e3a8a',
      secondary: '#0ea5e9',
      accent: '#06b6d4',
      background: '#0c1a2e',
      cardBg: '#1e293b',
      border: '#1e40af',
      hoverBg: '#1e3a8a',
      hoverBorder: '#3b82f6',
      shadow: 'rgba(14, 165, 233, 0.3)',
      gradient: 'linear-gradient(135deg, #1e3a8a 0%, #0c1a2e 100%)'
    }
  },
  {
    id: 'theme_forest',
    name: 'Forest Theme',
    description: 'Natural green tones for a calming experience',
    type: 'theme',
    cost: 100,
    icon: '🌲',
    preview: {
      primary: '#14532d',
      secondary: '#16a34a',
      accent: '#4ade80',
      background: '#0a1810',
      cardBg: '#1a2f23',
      border: '#15803d',
      hoverBg: '#14532d',
      hoverBorder: '#22c55e',
      shadow: 'rgba(74, 222, 128, 0.3)',
      gradient: 'linear-gradient(135deg, #14532d 0%, #0a1810 100%)'
    }
  },
  {
    id: 'theme_sunset',
    name: 'Sunset Theme',
    description: 'Warm orange and pink sunset vibes',
    type: 'theme',
    cost: 150,
    icon: '🌅',
    preview: {
      primary: '#7c2d12',
      secondary: '#f97316',
      accent: '#fb923c',
      background: '#1a0f0a',
      cardBg: '#2d1810',
      border: '#c2410c',
      hoverBg: '#7c2d12',
      hoverBorder: '#fb923c',
      shadow: 'rgba(251, 146, 60, 0.3)',
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #1a0f0a 100%)'
    }
  },
  {
    id: 'theme_midnight',
    name: 'Midnight Theme',
    description: 'Deep purple darkness for night owls',
    type: 'theme',
    cost: 150,
    icon: '🌙',
    preview: {
      primary: '#4c1d95',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      background: '#0f0520',
      cardBg: '#1e1330',
      border: '#6d28d9',
      hoverBg: '#4c1d95',
      hoverBorder: '#a78bfa',
      shadow: 'rgba(167, 139, 250, 0.3)',
      gradient: 'linear-gradient(135deg, #4c1d95 0%, #0f0520 100%)'
    }
  },
  {
    id: 'theme_cyber',
    name: 'Cyberpunk Theme',
    description: 'Neon pink and cyan for the future',
    type: 'theme',
    cost: 200,
    icon: '🤖',
    preview: {
      primary: '#831843',
      secondary: '#ec4899',
      accent: '#06b6d4',
      background: '#0a0118',
      cardBg: '#1a0b28',
      border: '#be185d',
      hoverBg: '#831843',
      hoverBorder: '#f472b6',
      shadow: 'rgba(236, 72, 153, 0.4)',
      gradient: 'linear-gradient(135deg, #831843 0%, #0a0118 100%)'
    }
  },
  {
    id: 'theme_matrix',
    name: 'Matrix Theme',
    description: 'Classic green-on-black hacker aesthetic',
    type: 'theme',
    cost: 200,
    icon: '💻',
    preview: {
      primary: '#052e16',
      secondary: '#22c55e',
      accent: '#4ade80',
      background: '#000000',
      cardBg: '#0a1810',
      border: '#15803d',
      hoverBg: '#052e16',
      hoverBorder: '#4ade80',
      shadow: 'rgba(34, 197, 94, 0.4)',
      gradient: 'linear-gradient(135deg, #052e16 0%, #000000 100%)'
    }
  },
  {
    id: 'theme_golden',
    name: 'Golden Luxury',
    description: 'Premium gold and black elegance',
    type: 'theme',
    cost: 300,
    icon: '👑',
    preview: {
      primary: '#713f12',
      secondary: '#eab308',
      accent: '#fbbf24',
      background: '#0f0a05',
      cardBg: '#1f1510',
      border: '#a16207',
      hoverBg: '#713f12',
      hoverBorder: '#fbbf24',
      shadow: 'rgba(251, 191, 36, 0.4)',
      gradient: 'linear-gradient(135deg, #713f12 0%, #0f0a05 100%)'
    }
  },

  // Editor Styles
  {
    id: 'editor_retro',
    name: 'Retro Terminal',
    description: 'Old-school green CRT monitor look',
    type: 'editor_style',
    cost: 80,
    icon: '📟',
    style: {
      fontFamily: 'Courier New, monospace',
      textColor: '#00ff00',
      backgroundColor: '#001100',
      cursorColor: '#00ff00',
      scanlines: true
    }
  },
  {
    id: 'editor_modern',
    name: 'Modern Minimal',
    description: 'Clean, modern code editor aesthetic',
    type: 'editor_style',
    cost: 80,
    icon: '✨',
    style: {
      fontFamily: 'Fira Code, monospace',
      textColor: '#e5e7eb',
      backgroundColor: '#1f2937',
      cursorColor: '#60a5fa',
      ligatures: true
    }
  },
  {
    id: 'editor_rainbow',
    name: 'Rainbow Brackets',
    description: 'Colorful syntax highlighting',
    type: 'editor_style',
    cost: 120,
    icon: '🌈',
    style: {
      fontFamily: 'JetBrains Mono, monospace',
      colorScheme: 'rainbow',
      bracketColors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffa07a', '#98d8c8']
    }
  },

  // Achievement Badges
  {
    id: 'badge_animated',
    name: 'Animated Badges',
    description: 'Your achievement badges pulse and glow',
    type: 'badge_effect',
    cost: 100,
    icon: '✨',
    effect: 'pulse-glow'
  },
  {
    id: 'badge_3d',
    name: '3D Badge Effect',
    description: 'Achievement badges appear in 3D',
    type: 'badge_effect',
    cost: 150,
    icon: '🎮',
    effect: '3d-transform'
  },

  // Progress Animations
  {
    id: 'progress_fireworks',
    name: 'Fireworks Celebration',
    description: 'Fireworks explode when you complete a lesson',
    type: 'completion_effect',
    cost: 120,
    icon: '🎆',
    effect: 'fireworks'
  },
  {
    id: 'progress_confetti',
    name: 'Confetti Burst',
    description: 'Confetti rains down on completion',
    type: 'completion_effect',
    cost: 100,
    icon: '🎉',
    effect: 'confetti'
  },
  {
    id: 'progress_stars',
    name: 'Star Shower',
    description: 'Stars cascade across the screen',
    type: 'completion_effect',
    cost: 100,
    icon: '⭐',
    effect: 'stars'
  },

  // Sound Effects
  {
    id: 'sound_pack_retro',
    name: 'Retro Sound Pack',
    description: '8-bit sounds for achievements',
    type: 'sound_pack',
    cost: 80,
    icon: '🎵',
    sounds: 'retro'
  },
  {
    id: 'sound_pack_epic',
    name: 'Epic Sound Pack',
    description: 'Dramatic orchestral sounds',
    type: 'sound_pack',
    cost: 120,
    icon: '🎺',
    sounds: 'epic'
  },

  // Custom Titles
  {
    id: 'title_novice',
    name: 'Title: Vim Novice',
    description: 'Display "Vim Novice" under your username',
    type: 'title',
    cost: 50,
    icon: '🏷️',
    title: 'Vim Novice'
  },
  {
    id: 'title_expert',
    name: 'Title: Vim Expert',
    description: 'Display "Vim Expert" under your username',
    type: 'title',
    cost: 150,
    icon: '🏷️',
    title: 'Vim Expert'
  },
  {
    id: 'title_master',
    name: 'Title: Vim Master',
    description: 'Display "Vim Master" under your username',
    type: 'title',
    cost: 250,
    icon: '🏷️',
    title: 'Vim Master'
  },
  {
    id: 'title_legend',
    name: 'Title: Vim Legend',
    description: 'Display "Vim Legend" under your username',
    type: 'title',
    cost: 500,
    icon: '🏷️',
    title: 'Vim Legend'
  },

  // Special Items
  {
    id: 'special_double_xp',
    name: 'Double Points Weekend',
    description: 'Earn 2x points for 48 hours (one-time use)',
    type: 'booster',
    cost: 200,
    icon: '⚡',
    duration: 48,
    multiplier: 2,
    consumable: true
  },
  {
    id: 'special_hint_pack',
    name: 'Extra Hints Pack',
    description: 'Get 3 extra hints for any lesson',
    type: 'consumable',
    cost: 50,
    icon: '💡',
    quantity: 3,
    consumable: true
  },
  {
    id: 'special_streak_freeze',
    name: 'Streak Freeze',
    description: 'Protect your streak for one day',
    type: 'consumable',
    cost: 100,
    icon: '❄️',
    quantity: 1,
    consumable: true
  }
];

export const shopCategories = [
  { id: 'themes', name: 'Dashboard Themes', icon: '🎨', description: 'Change the look of your dashboard' },
  { id: 'editor_styles', name: 'Editor Styles', icon: '💻', description: 'Customize your Vim editor appearance' },
  { id: 'effects', name: 'Visual Effects', icon: '✨', description: 'Add animations and effects' },
  { id: 'sounds', name: 'Sound Packs', icon: '🎵', description: 'Custom audio experiences' },
  { id: 'titles', name: 'Custom Titles', icon: '🏷️', description: 'Show off your achievements' },
  { id: 'boosters', name: 'Power-ups', icon: '⚡', description: 'Boost your progress' }
];
