// Community post images using real food photos from reliable sources

export const getCommunityImage = (type: string, index: number = 0): string => {
  // Using Picsum (Lorem Picsum) with specific seeds for consistent food-like images
  // and foodiesfeed.com style URLs as fallback
  const imageMap: { [key: string]: string[] } = {
    recipe: [
      'https://picsum.photos/seed/kimchi-stew/400/300', // 김치찌개
      'https://picsum.photos/seed/fried-rice/400/300', // 볶음밥
      'https://picsum.photos/seed/korean-chicken/400/300', // 치킨
      'https://picsum.photos/seed/ramen-noodles/400/300', // 라면
      'https://picsum.photos/seed/pasta-dish/400/300' // 파스타
    ],
    tip: [
      'https://picsum.photos/seed/cooking-tip/400/300', // 요리팁
      'https://picsum.photos/seed/knife-skills/400/300', // 손질법
      'https://picsum.photos/seed/food-storage/400/300', // 보관법
      'https://picsum.photos/seed/cooking-method/400/300' // 조리법
    ],
    combination: [
      'https://picsum.photos/seed/burger-combo/400/300', // 버거 조합
      'https://picsum.photos/seed/pizza-pairing/400/300', // 피자 조합
      'https://picsum.photos/seed/taco-mix/400/300' // 타코 조합
    ],
    deal: [
      'https://picsum.photos/seed/grocery-sale/400/300', // 마트 세일
      'https://picsum.photos/seed/food-discount/400/300', // 음식 할인
      'https://picsum.photos/seed/shopping-deal/400/300' // 쇼핑 할인
    ]
  };

  const images = imageMap[type] || imageMap.recipe;
  return images[index % images.length];
};

// Alternative: Get real Korean food images
export const getRealFoodImage = (type: string, title: string): string => {
  // Map specific titles to actual food images
  const specificImages: { [key: string]: string } = {
    '백종원 김치찌개 황금레시피': 'https://images.pexels.com/photos/2313686/pexels-photo-2313686.jpeg?auto=compress&w=400&h=300',
    '5분 완성 계란볶음밥': 'https://images.pexels.com/photos/3926133/pexels-photo-3926133.jpeg?auto=compress&w=400&h=300',
    '에어프라이어 치킨 완벽 재현': 'https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&w=400&h=300',
    '백종원도 극찬한 라면 끓이는 꿀팁': 'https://images.pexels.com/photos/1907244/pexels-photo-1907244.jpeg?auto=compress&w=400&h=300',
    '치킨+콜라 말고 이거 드세요': 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&w=400&h=300',
    '이마트 1+1 행사 총정리': 'https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg?auto=compress&w=400&h=300'
  };

  // Return specific image if available, otherwise use type-based default
  if (specificImages[title]) {
    return specificImages[title];
  }

  // Default images by type
  const defaultImages: { [key: string]: string } = {
    recipe: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&w=400&h=300',
    tip: 'https://images.pexels.com/photos/3298687/pexels-photo-3298687.jpeg?auto=compress&w=400&h=300',
    combination: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&w=400&h=300',
    deal: 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&w=400&h=300'
  };

  return defaultImages[type] || defaultImages.recipe;
};

// Get emoji and gradient for post types (keeping as fallback)
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