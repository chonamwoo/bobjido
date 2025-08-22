const axios = require('axios');

// Google Places API Key (환경변수에서 가져오기)
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// 식당 이름과 주소로 Google Places에서 검색
const searchRestaurant = async (name, address) => {
  try {
    if (!GOOGLE_PLACES_API_KEY) {
      console.log('Google Places API key not configured');
      return null;
    }

    // 텍스트 검색으로 장소 찾기
    const searchQuery = `${name} ${address}`;
    const searchResponse = await axios.get(
      'https://maps.googleapis.com/maps/api/place/textsearch/json',
      {
        params: {
          query: searchQuery,
          key: GOOGLE_PLACES_API_KEY,
          type: 'restaurant',
          language: 'ko'
        }
      }
    );

    if (searchResponse.data.results && searchResponse.data.results.length > 0) {
      const place = searchResponse.data.results[0];
      return {
        place_id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        photos: place.photos || []
      };
    }

    return null;
  } catch (error) {
    console.error(`Error searching for ${name}:`, error.message);
    return null;
  }
};

// Place ID로 상세 정보 및 사진 가져오기
const getPlaceDetails = async (placeId) => {
  try {
    const detailsResponse = await axios.get(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,photos,rating,reviews',
          key: GOOGLE_PLACES_API_KEY,
          language: 'ko'
        }
      }
    );

    return detailsResponse.data.result;
  } catch (error) {
    console.error(`Error getting place details for ${placeId}:`, error.message);
    return null;
  }
};

// 사진 참조를 실제 URL로 변환
const getPhotoUrl = (photoReference, maxWidth = 800) => {
  if (!photoReference || !GOOGLE_PLACES_API_KEY) {
    return null;
  }

  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photo_reference=${photoReference}&key=${GOOGLE_PLACES_API_KEY}`;
};

// 식당의 실제 사진들을 가져와서 저장
const fetchRestaurantPhotos = async (restaurant) => {
  try {
    console.log(`Fetching photos for ${restaurant.name}...`);

    // 1. Google Places에서 식당 검색
    const placeInfo = await searchRestaurant(restaurant.name, restaurant.address);
    
    if (!placeInfo || !placeInfo.photos || placeInfo.photos.length === 0) {
      console.log(`No photos found for ${restaurant.name}`);
      return [];
    }

    // 2. 사진 URL 생성 (최대 3개)
    const photoUrls = placeInfo.photos
      .slice(0, 3)
      .map(photo => getPhotoUrl(photo.photo_reference, 800))
      .filter(url => url !== null);

    console.log(`Found ${photoUrls.length} photos for ${restaurant.name}`);

    // 3. 식당 모델에 사진 추가
    const photoObjects = photoUrls.map(url => ({
      url: url,
      uploadedAt: new Date(),
      source: 'google_places'
    }));

    restaurant.images = photoObjects;
    restaurant.googlePlaceId = placeInfo.place_id;
    
    await restaurant.save();
    
    return photoObjects;
  } catch (error) {
    console.error(`Error fetching photos for ${restaurant.name}:`, error.message);
    return [];
  }
};

// 모든 식당의 사진을 업데이트하는 배치 작업
const updateAllRestaurantPhotos = async () => {
  try {
    const Restaurant = require('../models/Restaurant');
    
    // Google Places ID가 없거나 이미지가 적은 식당들 찾기
    const restaurants = await Restaurant.find({
      $or: [
        { googlePlaceId: { $exists: false } },
        { googlePlaceId: null },
        { images: { $size: 0 } }
      ]
    }).limit(5); // API 한도를 고려해서 한 번에 5개씩

    console.log(`Found ${restaurants.length} restaurants to update`);

    for (const restaurant of restaurants) {
      await fetchRestaurantPhotos(restaurant);
      // API 레이트 리미트 방지를 위해 잠시 대기
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('Restaurant photo update completed');
  } catch (error) {
    console.error('Batch photo update error:', error);
  }
};

module.exports = {
  searchRestaurant,
  getPlaceDetails,
  getPhotoUrl,
  fetchRestaurantPhotos,
  updateAllRestaurantPhotos
};