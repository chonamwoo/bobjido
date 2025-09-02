// Community post images using emoji placeholders with gradient backgrounds

export const getCommunityImage = (type: string, index: number = 0): string | null => {
  // Return null to indicate no image - we'll use emoji placeholders instead
  return null;
};

// Get emoji and gradient for post types
export const getPostVisual = (type: string, index: number = 0) => {
  const visuals: { [key: string]: Array<{ emoji: string; gradient: string }> } = {
    recipe: [
      { emoji: '🍲', gradient: 'from-orange-400 to-red-500' },
      { emoji: '🍳', gradient: 'from-yellow-400 to-orange-500' },
      { emoji: '🍗', gradient: 'from-amber-400 to-orange-600' },
      { emoji: '🍜', gradient: 'from-red-400 to-pink-500' },
      { emoji: '🍝', gradient: 'from-green-400 to-teal-500' }
    ],
    tip: [
      { emoji: '💡', gradient: 'from-blue-400 to-cyan-500' },
      { emoji: '🔪', gradient: 'from-purple-400 to-pink-500' },
      { emoji: '🧅', gradient: 'from-indigo-400 to-purple-500' },
      { emoji: '🦐', gradient: 'from-teal-400 to-blue-500' }
    ],
    combination: [
      { emoji: '🍔', gradient: 'from-red-400 to-orange-500' },
      { emoji: '🍕', gradient: 'from-green-400 to-emerald-500' },
      { emoji: '🌮', gradient: 'from-yellow-400 to-red-500' }
    ],
    deal: [
      { emoji: '🏷️', gradient: 'from-purple-400 to-indigo-500' },
      { emoji: '💰', gradient: 'from-green-400 to-emerald-600' },
      { emoji: '🛒', gradient: 'from-blue-400 to-indigo-500' }
    ]
  };

  const items = visuals[type] || visuals.recipe;
  return items[index % items.length];
};

// Generate avatar background color based on username
export const getAvatarColor = (name: string): string => {
  const colors = [
    'bg-gradient-to-br from-orange-400 to-red-400',
    'bg-gradient-to-br from-blue-400 to-purple-400',
    'bg-gradient-to-br from-green-400 to-teal-400',
    'bg-gradient-to-br from-pink-400 to-rose-400',
    'bg-gradient-to-br from-yellow-400 to-orange-400'
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i);
  }
  
  return colors[Math.abs(hash) % colors.length];
};