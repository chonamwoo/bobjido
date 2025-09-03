// Restaurant image URLs using Unsplash
export const restaurantImages = {
  // Korean food
  korean: [
    'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583224944844-5b268c057b72?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1567479360481-1c3d0e87f7b8?w=800&h=600&fit=crop'
  ],
  // Japanese food
  japanese: [
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop'
  ],
  // Chinese food
  chinese: [
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555126634-323283e090fa?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=600&fit=crop'
  ],
  // Western food
  western: [
    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&h=600&fit=crop'
  ],
  // Cafe
  cafe: [
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&h=600&fit=crop'
  ],
  // Bar
  bar: [
    'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1575444758702-4a6b9222336e?w=800&h=600&fit=crop'
  ],
  // Restaurant interior
  interior: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop'
  ],
  // Asian
  asian: [
    'https://images.unsplash.com/photo-1512058564366-c9e4a5d1b9de?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=600&fit=crop'
  ]
};

export const getCategoryImage = (category: string): string => {
  const normalizedCategory = category.toLowerCase();
  
  const categoryMap: { [key: string]: keyof typeof restaurantImages } = {
    '한식': 'korean',
    '일식': 'japanese',
    '중식': 'chinese',
    '양식': 'western',
    '카페': 'cafe',
    '주점': 'bar',
    '동남아': 'asian',
    '아시안': 'asian'
  };
  
  const imageCategory = categoryMap[category] || 'interior';
  const images = restaurantImages[imageCategory as keyof typeof restaurantImages] || restaurantImages.interior;
  
  return images[Math.floor(Math.random() * images.length)];
};

export const getRestaurantImage = (restaurantName: string, category: string): string => {
  // Use a hash of restaurant name to consistently get the same image
  let hash = 0;
  for (let i = 0; i < restaurantName.length; i++) {
    const char = restaurantName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  const categoryImages = getCategoryImages(category);
  const index = Math.abs(hash) % categoryImages.length;
  return categoryImages[index];
};

const getCategoryImages = (category: string): string[] => {
  const normalizedCategory = category.toLowerCase();
  
  const categoryMap: { [key: string]: keyof typeof restaurantImages } = {
    '한식': 'korean',
    '일식': 'japanese',
    '중식': 'chinese',
    '양식': 'western',
    '카페': 'cafe',
    '주점': 'bar',
    '동남아': 'asian',
    '아시안': 'asian'
  };
  
  const imageCategory = categoryMap[category] || 'interior';
  return restaurantImages[imageCategory as keyof typeof restaurantImages] || restaurantImages.interior;
};