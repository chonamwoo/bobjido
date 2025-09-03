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
  // Map specific titles to actual food images - 고품질 음식 이미지
  const specificImages: { [key: string]: string } = {
    '백종원 김치찌개 황금레시피': 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?w=600&h=400&fit=crop&q=80',
    '5분 완성 계란볶음밥': 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop&q=80',
    '에어프라이어 치킨 완벽 재현': 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=600&h=400&fit=crop&q=80',
    '백종원도 극찬한 라면 끓이는 꿀팁': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop&q=80',
    '치킨+콜라 말고 이거 드세요': 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=600&h=400&fit=crop&q=80',
    '이마트 1+1 행사 총정리': 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=600&h=400&fit=crop&q=80',
    // 꿀팁 관련 이미지들 - 고품질 이미지
    '양파 썰 때 눈물 안나는 방법': 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=600&h=400&fit=crop&q=80',
    '새우 손질 10초 완성법': 'https://images.unsplash.com/photo-1565680018434-b513d5e2fd47?w=600&h=400&fit=crop&q=80',
    '계란 삶기 시간별 완성도': 'https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?w=600&h=400&fit=crop&q=80',
    '생선 비린내 제거 꿀팁': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&h=400&fit=crop&q=80'
  };

  // Return specific image if available, otherwise use type-based default
  if (specificImages[title]) {
    return specificImages[title];
  }

  // Default images by type - 고품질 이미지
  const defaultImages: { [key: string]: string } = {
    recipe: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop&q=80',
    tip: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=400&fit=crop&q=80',
    combination: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&h=400&fit=crop&q=80',
    deal: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=600&h=400&fit=crop&q=80'
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