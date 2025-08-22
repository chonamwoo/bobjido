const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Unsplash Access Key (나중에 .env에 추가)
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';

// 음식/식당 관련 키워드 매핑
const FOOD_KEYWORDS = {
  '한식': ['korean food', 'bibimbap', 'kimchi', 'korean restaurant', 'bulgogi'],
  '중식': ['chinese food', 'chinese restaurant', 'dimsum', 'noodles', 'fried rice'],
  '일식': ['japanese food', 'sushi', 'ramen', 'japanese restaurant', 'tempura'],
  '양식': ['western food', 'pasta', 'pizza', 'steak', 'fine dining'],
  '카페': ['cafe', 'coffee', 'latte', 'coffee shop', 'dessert'],
  '디저트': ['dessert', 'cake', 'ice cream', 'pastry', 'sweet'],
  '동남아': ['thai food', 'vietnamese food', 'pad thai', 'pho', 'asian cuisine'],
  '주점': ['korean pub', 'fried chicken', 'beer', 'korean bar', 'drinking'],
  '패스트푸드': ['burger', 'fast food', 'sandwich', 'french fries'],
  '기타': ['restaurant', 'food', 'dining', 'meal', 'delicious']
};

// Unsplash에서 이미지 검색
const searchUnsplashImages = async (query, count = 3) => {
  try {
    if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_ACCESS_KEY') {
      console.log('Unsplash API key not configured, using fallback images');
      return getFallbackImages(query, count);
    }

    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: count,
        orientation: 'landscape',
        content_filter: 'high'
      },
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    return response.data.results.map(photo => ({
      url: photo.urls.regular,
      thumb: photo.urls.thumb,
      description: photo.description || photo.alt_description,
      photographer: photo.user.name
    }));
  } catch (error) {
    console.error('Unsplash search error:', error.message);
    return getFallbackImages(query, count);
  }
};

// 폴백 이미지 (Unsplash 직접 URL)
const getFallbackImages = (category, count = 3) => {
  const categoryImages = {
    '한식': [
      'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=600&fit=crop&q=80'
    ],
    '중식': [
      'https://images.unsplash.com/photo-1563379091339-03246963d94a?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=800&h=600&fit=crop&q=80'
    ],
    '일식': [
      'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80'
    ],
    '양식': [
      'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=80'
    ],
    '카페': [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&q=80'
    ],
    'default': [
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&q=80'
    ]
  };

  const images = categoryImages[category] || categoryImages.default;
  return images.slice(0, count).map(url => ({ url, thumb: url }));
};

// 식당에 이미지 추가하는 함수
const addImagesToRestaurant = async (restaurant) => {
  try {
    // 이미 이미지가 있으면 스킵
    if (restaurant.images && restaurant.images.length > 0) {
      console.log(`Restaurant ${restaurant.name} already has images`);
      return restaurant;
    }

    // 카테고리 기반으로 키워드 선택
    const keywords = FOOD_KEYWORDS[restaurant.category] || FOOD_KEYWORDS['기타'];
    const randomKeyword = keywords[Math.floor(Math.random() * keywords.length)];
    
    console.log(`Searching images for ${restaurant.name} with keyword: ${randomKeyword}`);
    
    // 이미지 검색
    const images = await searchUnsplashImages(randomKeyword, 2);
    
    // 식당에 이미지 추가
    restaurant.images = images.map(img => ({
      url: img.url,
      uploadedAt: new Date(),
      source: 'unsplash'
    }));

    await restaurant.save();
    console.log(`Added ${images.length} images to ${restaurant.name}`);
    
    return restaurant;
  } catch (error) {
    console.error(`Error adding images to ${restaurant.name}:`, error.message);
    return restaurant;
  }
};

// 모든 식당에 이미지 추가하는 배치 작업
const addImagesToAllRestaurants = async () => {
  try {
    const Restaurant = require('../models/Restaurant');
    
    const restaurants = await Restaurant.find({
      $or: [
        { images: { $exists: false } },
        { images: { $size: 0 } }
      ]
    }).limit(10); // 한 번에 10개씩 처리

    console.log(`Found ${restaurants.length} restaurants without images`);

    for (const restaurant of restaurants) {
      await addImagesToRestaurant(restaurant);
      // API 레이트 리미트 방지를 위해 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Image addition process completed');
  } catch (error) {
    console.error('Batch image addition error:', error);
  }
};

module.exports = {
  searchUnsplashImages,
  getFallbackImages,
  addImagesToRestaurant,
  addImagesToAllRestaurants
};