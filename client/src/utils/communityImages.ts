// Community post images using reliable placeholder services

export const getCommunityImage = (type: string, index: number = 0): string => {
  // Using placeholder images that are more reliable
  const imageMap: { [key: string]: string[] } = {
    recipe: [
      'https://via.placeholder.com/400x300/FF6B6B/FFFFFF?text=김치찌개',
      'https://via.placeholder.com/400x300/4ECDC4/FFFFFF?text=볶음밥',
      'https://via.placeholder.com/400x300/45B7D1/FFFFFF?text=치킨',
      'https://via.placeholder.com/400x300/F7DC6F/FFFFFF?text=라면',
      'https://via.placeholder.com/400x300/BB8FCE/FFFFFF?text=파스타'
    ],
    tip: [
      'https://via.placeholder.com/400x300/52C3F1/FFFFFF?text=요리팁',
      'https://via.placeholder.com/400x300/62D2A2/FFFFFF?text=손질법',
      'https://via.placeholder.com/400x300/F48B94/FFFFFF?text=보관법',
      'https://via.placeholder.com/400x300/9B59B6/FFFFFF?text=조리법'
    ],
    combination: [
      'https://via.placeholder.com/400x300/E74C3C/FFFFFF?text=음식조합',
      'https://via.placeholder.com/400x300/3498DB/FFFFFF?text=꿀조합',
      'https://via.placeholder.com/400x300/2ECC71/FFFFFF?text=의외조합'
    ],
    deal: [
      'https://via.placeholder.com/400x300/F39C12/FFFFFF?text=1%2B1',
      'https://via.placeholder.com/400x300/E67E22/FFFFFF?text=할인',
      'https://via.placeholder.com/400x300/D35400/FFFFFF?text=세일'
    ]
  };

  const images = imageMap[type] || imageMap.recipe;
  return images[index % images.length];
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