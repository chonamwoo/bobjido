const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const axios = require('axios');
const cheerio = require('cheerio');
const { scrapeMultipleRestaurants } = require('../utils/naverScraper');
const { realSeoulRestaurants } = require('./realRestaurantData');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Playlist = require('../models/Playlist');

// 유명 맛집들 검색 키워드
const famousRestaurantQueries = [
  '강남 미슐랭 맛집',
  '홍대 유명 맛집', 
  '명동 맛집',
  '이태원 맛집',
  '종로 맛집',
  '압구정 맛집',
  '성수동 맛집',
  '연남동 맛집',
  '신사동 가로수길 맛집',
  '삼청동 맛집'
];

// 실제 서울 유명 맛집 리스트는 realRestaurantData.js에서 import

// 기존 더미 데이터 (백업용)
const backupRestaurants = [
  {
    name: '곤지암할머니소머리국밥',
    category: '한식',
    address: '서울 중구 다동 37-1',
    coordinates: { lat: 37.5665, lng: 126.9772 },
    averageRating: 4.6,
    description: '60년 전통의 소머리국밥 맛집, 미슐랭 빕구르망 선정',
    priceRange: '저렴한',
    phoneNumber: '02-755-1725',
    reviewCount: 1247,
    tags: ['미슐랭', '전통맛집', '국밥'],
    features: ['주차가능'],
    businessHours: {
      monday: { open: '05:30', close: '15:30', isOpen: true },
      tuesday: { open: '05:30', close: '15:30', isOpen: true },
      wednesday: { open: '05:30', close: '15:30', isOpen: true },
      thursday: { open: '05:30', close: '15:30', isOpen: true },
      friday: { open: '05:30', close: '15:30', isOpen: true },
      saturday: { open: '05:30', close: '15:30', isOpen: true },
      sunday: { open: '05:30', close: '15:30', isOpen: true }
    },
    naverPlaceId: 'place_id_1',
    externalReviewUrl: 'https://map.naver.com/v5/search/곤지암할머니소머리국밥',
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220511_45%2F1652240952850hQkKn_JPEG%2F%25EC%2586%258C%25EB%25A8%25B8%25EB%25A6%25AC%25EA%25B5%25AD%25EB%25B0%25A52.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220511_298%2F1652240952994DQJAT_JPEG%2F%25EC%2586%258C%25EB%25A8%25B8%25EB%25A6%25AC%25EA%25B5%25AD%25EB%25B0%25A53.jpg&type=sc960_832' }
    ]
  },
  {
    name: '을지면옥',
    category: '한식',
    address: '서울 중구 을지로 43',
    coordinates: { lat: 37.5657, lng: 126.9912 },
    averageRating: 4.7,
    description: '서울 3대 냉면, 을지로 원조 냉면집',
    priceRange: '보통',
    phoneNumber: '02-2265-8468',
    reviewCount: 2156,
    tags: ['냉면', '전통맛집', '을지로'],
    features: ['예약가능'],
    businessHours: {
      monday: { open: '11:30', close: '21:00', isOpen: true },
      tuesday: { open: '11:30', close: '21:00', isOpen: true },
      wednesday: { open: '11:30', close: '21:00', isOpen: true },
      thursday: { open: '11:30', close: '21:00', isOpen: true },
      friday: { open: '11:30', close: '21:00', isOpen: true },
      saturday: { open: '11:30', close: '21:00', isOpen: true },
      sunday: { open: '11:30', close: '21:00', isOpen: true }
    },
    naverPlaceId: 'place_id_2',
    externalReviewUrl: 'https://map.naver.com/v5/search/을지면옥',
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221018_15%2F1666063364628rGMcx_JPEG%2F%25EB%2583%2589%25EB%25A9%25B4.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221018_94%2F1666063364792Kn4hZ_JPEG%2F%25EB%25B9%2584%25EB%25B9%2594%25EB%2583%2589%25EB%25A9%25B4.jpg&type=sc960_832' }
    ]
  },
  {
    name: '광화문국밥',
    category: '한식',
    address: '서울 종로구 종로 19',
    coordinates: { lat: 37.5703, lng: 126.9759 },
    averageRating: 4.5,
    description: '24시간 운영하는 광화문 대표 국밥집',
    priceRange: '저렴한',
    phoneNumber: '02-735-7825',
    reviewCount: 987,
    tags: ['국밥', '24시간', '광화문'],
    features: ['24시간'],
    businessHours: {
      monday: { open: '00:00', close: '23:59', isOpen: true },
      tuesday: { open: '00:00', close: '23:59', isOpen: true },
      wednesday: { open: '00:00', close: '23:59', isOpen: true },
      thursday: { open: '00:00', close: '23:59', isOpen: true },
      friday: { open: '00:00', close: '23:59', isOpen: true },
      saturday: { open: '00:00', close: '23:59', isOpen: true },
      sunday: { open: '00:00', close: '23:59', isOpen: true }
    },
    naverPlaceId: 'place_id_3',
    externalReviewUrl: 'https://map.naver.com/v5/search/광화문국밥',
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230915_42%2F1694761032437bncQC_JPEG%2F%25EA%25B5%25AD%25EB%25B0%25A5.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20230915_156%2F1694761032592Mhtyg_JPEG%2F%25EC%2588%2598%25EC%259C%25A1%25EA%25B5%25AD%25EB%25B0%25A5.jpg&type=sc960_832' }
    ]
  },
  {
    name: '한우여관',
    category: '한식',
    address: '서울 강남구 압구정로28길 38',
    coordinates: { lat: 37.5270, lng: 127.0276 },
    averageRating: 4.8,
    description: '미슐랭 1스타 한식당, 전통 한우 요리 전문',
    priceRange: '매우비싼',
    phoneNumber: '02-543-9670',
    reviewCount: 543,
    tags: ['미슐랭', '한우', '고급'],
    features: ['예약가능', '룸있음', '주차가능'],
    businessHours: {
      monday: { open: '18:00', close: '23:00', isOpen: true },
      tuesday: { open: '18:00', close: '23:00', isOpen: true },
      wednesday: { open: '18:00', close: '23:00', isOpen: true },
      thursday: { open: '18:00', close: '23:00', isOpen: true },
      friday: { open: '18:00', close: '23:00', isOpen: true },
      saturday: { open: '18:00', close: '23:00', isOpen: true },
      sunday: { open: '00:00', close: '00:00', isOpen: false }
    },
    naverPlaceId: 'place_id_4',
    externalReviewUrl: 'https://map.naver.com/v5/search/한우여관',
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220711_195%2F1657523923453N9YtZ_JPEG%2F%25ED%2595%259C%25EC%259A%25B0%25EA%25B0%2588%25EB%25B9%2584.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220711_72%2F1657523923575oA4zU_JPEG%2F%25ED%2595%259C%25EC%259A%25B0%25EA%25B5%25AC%25EC%259D%25B4.jpg&type=sc960_832' }
    ]
  },
  {
    name: '진진',
    category: '중식',
    address: '서울 중구 다동 32-5',
    coordinates: { lat: 37.5667, lng: 126.9765 },
    averageRating: 4.4,
    description: '명동 짜장면 맛집, 50년 전통',
    priceRange: '저렴한',
    phoneNumber: '02-776-9020',
    reviewCount: 1834,
    tags: ['짜장면', '전통맛집', '명동'],
    features: ['포장가능'],
    businessHours: {
      monday: { open: '10:30', close: '21:00', isOpen: true },
      tuesday: { open: '10:30', close: '21:00', isOpen: true },
      wednesday: { open: '10:30', close: '21:00', isOpen: true },
      thursday: { open: '10:30', close: '21:00', isOpen: true },
      friday: { open: '10:30', close: '21:00', isOpen: true },
      saturday: { open: '10:30', close: '21:00', isOpen: true },
      sunday: { open: '10:30', close: '21:00', isOpen: true }
    },
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220308_109%2F1646706932549oa4xK_JPEG%2F%25EC%25A7%259C%25EC%259E%25A5%25EB%25A9%25B4.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220308_72%2F1646706932667KWGNW_JPEG%2F%25EC%25A7%259C%25EC%259E%25A5%25EB%25B0%25A5.jpg&type=sc960_832' }
    ],
    naverPlaceId: 'place_id_5', 
    externalReviewUrl: 'https://map.naver.com/v5/search/진진%20명동'
  },
  {
    name: '봉피양',
    category: '양식',
    address: '서울 용산구 이태원로55가길 5',
    coordinates: { lat: 37.5342, lng: 126.9956 },
    averageRating: 4.6,
    description: '이태원 대표 프렌치 비스트로',
    priceRange: '매우비싼',
    phoneNumber: '02-797-5345',
    reviewCount: 723,
    tags: ['프렌치', '이태원', '와인'],
    features: ['예약가능', '와이파이', '테라스'],
    businessHours: {
      monday: { open: '18:00', close: '24:00', isOpen: true },
      tuesday: { open: '18:00', close: '24:00', isOpen: true },
      wednesday: { open: '18:00', close: '24:00', isOpen: true },
      thursday: { open: '18:00', close: '24:00', isOpen: true },
      friday: { open: '18:00', close: '24:00', isOpen: true },
      saturday: { open: '18:00', close: '24:00', isOpen: true },
      sunday: { open: '18:00', close: '24:00', isOpen: true }
    },
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221115_18%2F1668494885437gPl0e_JPEG%2F%25ED%2594%2584%25EB%25A0%258C%25EC%25B9%2598%25EC%259A%2594%25EB%25A6%25AC.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221115_289%2F1668494885578kD0FL_JPEG%2F%25EC%258A%25A4%25ED%2585%258C%25EC%259D%25B4%25ED%2581%25AC.jpg&type=sc960_832' }
    ],
    naverPlaceId: 'place_id_6',
    externalReviewUrl: 'https://map.naver.com/v5/search/봉피양%20이태원'
  },
  {
    name: '오니기리와이프',
    category: '일식',
    address: '서울 마포구 홍익로2길 16',
    coordinates: { lat: 37.5532, lng: 126.9249 },
    averageRating: 4.3,
    description: '홍대 인기 오니기리 전문점',
    priceRange: '저렴한',
    phoneNumber: '02-333-5522',
    reviewCount: 456,
    tags: ['오니기리', '홍대', '일식'],
    features: ['포장가능', '배달가능'],
    businessHours: {
      monday: { open: '11:00', close: '21:00', isOpen: true },
      tuesday: { open: '11:00', close: '21:00', isOpen: true },
      wednesday: { open: '11:00', close: '21:00', isOpen: true },
      thursday: { open: '11:00', close: '21:00', isOpen: true },
      friday: { open: '11:00', close: '21:00', isOpen: true },
      saturday: { open: '11:00', close: '21:00', isOpen: true },
      sunday: { open: '11:00', close: '21:00', isOpen: true }
    },
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220615_216%2F1655285952421wdRhz_JPEG%2F%25EC%2598%25A4%25EB%258B%2586%25EA%25B8%25B0%25EB%25A6%25AC.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220615_181%2F1655285952549yPYGx_JPEG%2F%25EC%25B9%25B4%25EB%25A0%2588%25EC%2598%25A4%25EB%258B%2586%25EA%25B8%25B0%25EB%25A6%25AC.jpg&type=sc960_832' }
    ],
    naverPlaceId: 'place_id_7',
    externalReviewUrl: 'https://map.naver.com/v5/search/오니기리와이프%20홍대'
  },
  {
    name: '해물천지',
    category: '한식',
    address: '서울 종로구 종로 16',
    coordinates: { lat: 37.5701, lng: 126.9823 },
    averageRating: 4.5,
    description: '종로 해물찜 맛집, 40년 전통',
    priceRange: '비싼',
    phoneNumber: '02-2273-3395',
    reviewCount: 1267,
    tags: ['해물찜', '전통맛집', '종로'],
    features: ['예약가능', '룸있음'],
    businessHours: {
      monday: { open: '11:00', close: '22:00', isOpen: true },
      tuesday: { open: '11:00', close: '22:00', isOpen: true },
      wednesday: { open: '11:00', close: '22:00', isOpen: true },
      thursday: { open: '11:00', close: '22:00', isOpen: true },
      friday: { open: '11:00', close: '22:00', isOpen: true },
      saturday: { open: '11:00', close: '22:00', isOpen: true },
      sunday: { open: '11:00', close: '22:00', isOpen: true }
    },
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220523_265%2F1653288725473vIKzA_JPEG%2F%25ED%2595%25B4%25EB%25AC%25BC%25EC%25B0%259C.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220523_41%2F1653288725603ChNtw_JPEG%2F%25ED%2595%25B4%25EB%25AC%25BC%25ED%258C%2590.jpg&type=sc960_832' }
    ],
    naverPlaceId: 'place_id_8',
    externalReviewUrl: 'https://map.naver.com/v5/search/해물천지%20종로'
  },
  {
    name: '대성집',
    category: '한식',
    address: '서울 중구 방산시장길 16',
    coordinates: { lat: 37.5590, lng: 126.9972 },
    averageRating: 4.7,
    description: '100년 전통 방산시장 대구탕 맛집',
    priceRange: '보통',
    phoneNumber: '02-2267-0151',
    reviewCount: 2341,
    tags: ['대구탕', '전통맛집', '방산시장'],
    features: ['주차가능'],
    businessHours: {
      monday: { open: '06:00', close: '21:00', isOpen: true },
      tuesday: { open: '06:00', close: '21:00', isOpen: true },
      wednesday: { open: '06:00', close: '21:00', isOpen: true },
      thursday: { open: '06:00', close: '21:00', isOpen: true },
      friday: { open: '06:00', close: '21:00', isOpen: true },
      saturday: { open: '06:00', close: '21:00', isOpen: true },
      sunday: { open: '06:00', close: '21:00', isOpen: true }
    },
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220912_140%2F1662972065434YvNF4_JPEG%2F%25EB%258C%2580%25EA%25B5%25AC%25ED%2583%2595.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220912_159%2F1662972065571WcKhP_JPEG%2F%25EB%258C%2580%25EA%25B5%25AC%25EC%25A7%2580%25EB%25A6%25AC.jpg&type=sc960_832' }
    ],
    naverPlaceId: 'place_id_9',
    externalReviewUrl: 'https://map.naver.com/v5/search/대성집%20방산시장'
  },
  {
    name: '삼원가든',
    category: '한식',
    address: '서울 강남구 신사동 635-8',
    coordinates: { lat: 37.5175, lng: 127.0265 },
    averageRating: 4.4,
    description: '압구정 갈비맛집, 연예인 단골집',
    priceRange: '매우비싼',
    phoneNumber: '02-548-3030',
    reviewCount: 876,
    tags: ['갈비', '연예인맛집', '압구정'],
    features: ['예약가능', '룸있음', '주차가능', '와이파이'],
    businessHours: {
      monday: { open: '11:30', close: '22:00', isOpen: true },
      tuesday: { open: '11:30', close: '22:00', isOpen: true },
      wednesday: { open: '11:30', close: '22:00', isOpen: true },
      thursday: { open: '11:30', close: '22:00', isOpen: true },
      friday: { open: '11:30', close: '22:00', isOpen: true },
      saturday: { open: '11:30', close: '22:00', isOpen: true },
      sunday: { open: '11:30', close: '22:00', isOpen: true }
    },
    images: [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220708_133%2F1657266962445VJkCF_JPEG%2F%25EA%25B0%2588%25EB%25B9%2584%25EC%2584%25B8%25ED%258A%25B8.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220708_97%2F1657266962574EKR5I_JPEG%2F%25EC%2597%2585%25EC%2582%25B4.jpg&type=sc960_832' }
    ],
    naverPlaceId: 'place_id_10',
    externalReviewUrl: 'https://map.naver.com/v5/search/삼원가든%20압구정'
  }
];

// 실제 네이버 플레이스에서 맛집 데이터 수집
async function fetchRealRestaurantData() {
  try {
    console.log('🔍 네이버 플레이스에서 실제 맛집 정보 수집 시작...');
    
    if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) {
      console.log('⚠️ 네이버 API 키가 설정되지 않음. 백업 데이터 사용.');
      return backupRestaurants;
    }
    
    const scrapedRestaurants = await scrapeMultipleRestaurants(realSeoulRestaurants);
    
    if (scrapedRestaurants.length > 0) {
      console.log(`✅ ${scrapedRestaurants.length}개 실제 맛집 정보 수집 완료`);
      return scrapedRestaurants;
    } else {
      console.log('⚠️ 스크랩 실패. 백업 데이터 사용.');
      return backupRestaurants;
    }
    
  } catch (error) {
    console.error('❌ 실제 데이터 수집 실패:', error.message);
    console.log('📦 백업 데이터 사용');
    return backupRestaurants;
  }
}

// 네이버 지역 검색 API를 통한 실제 맛집 데이터 수집 (구버전)
async function fetchRestaurantsFromAPI(queries = famousRestaurantQueries) {
  try {
    if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) {
      console.log('네이버 API 키가 없습니다. 미리 정의된 데이터만 사용합니다.');
      return [];
    }

    const allRestaurants = [];
    
    for (const query of queries.slice(0, 3)) { // 처음 3개 쿼리만 사용
      try {
        console.log(`네이버 API로 "${query}" 검색 중...`);
        
        const response = await axios.get('https://openapi.naver.com/v1/search/local.json', {
          params: {
            query: query,
            display: 5, // 각 쿼리당 5개씩
            sort: 'comment', // 리뷰 많은 순
            start: 1
          },
          headers: {
            'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
          }
        });

        const restaurants = response.data.items
          .filter(item => item.title && item.roadAddress && item.mapx && item.mapy)
          .map(item => {
            const categoryText = item.category.split('>').pop().trim() || '음식점';
            return {
              name: item.title.replace(/<[^>]*>/g, '').trim(),
              category: normalizeCategory(categoryText),
              address: item.roadAddress || item.address,
              coordinates: {
                lat: parseFloat(item.mapy) / 10000000,
                lng: parseFloat(item.mapx) / 10000000
              },
              phoneNumber: item.telephone || '',
              description: `${categoryText} - 네이버 리뷰 인기 맛집`,
              rating: 4.0 + Math.random() * 1.0, // 4.0 ~ 5.0 사이
              priceRange: getPriceRangeByCategory(categoryText),
              averageRating: 4.0 + Math.random() * 1.0,
              reviewCount: Math.floor(Math.random() * 200) + 50,
              createdBy: null, // 시딩 중에는 임시로 null, 나중에 Bob의 ID로 설정
              images: getRestaurantImages(normalizeCategory(categoryText))
            };
          });

        allRestaurants.push(...restaurants);
        
        // API 호출 간 딜레이 (요청 한도 고려)
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (apiError) {
        console.log(`"${query}" 검색 실패:`, apiError.message);
      }
    }

    console.log(`네이버 API로 ${allRestaurants.length}개 맛집 데이터 수집 완료`);
    return allRestaurants;
    
  } catch (error) {
    console.log('네이버 API 데이터 수집 실패:', error.message);
    return [];
  }
}

// 카테고리 정규화 (DB enum에 맞춰)
function normalizeCategory(category) {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('한식') || lowerCategory.includes('국밥') || lowerCategory.includes('갈비')) {
    return '한식';
  } else if (lowerCategory.includes('중식') || lowerCategory.includes('짜장')) {
    return '중식';
  } else if (lowerCategory.includes('일식') || lowerCategory.includes('초밥') || lowerCategory.includes('라멘')) {
    return '일식';
  } else if (lowerCategory.includes('양식') || lowerCategory.includes('이탈리안') || lowerCategory.includes('프렌치')) {
    return '양식';
  } else if (lowerCategory.includes('동남아') || lowerCategory.includes('베트남') || lowerCategory.includes('태국')) {
    return '동남아';
  } else if (lowerCategory.includes('카페') || lowerCategory.includes('커피')) {
    return '카페';
  } else if (lowerCategory.includes('디저트') || lowerCategory.includes('빵')) {
    return '디저트';
  } else if (lowerCategory.includes('주점') || lowerCategory.includes('술')) {
    return '주점';
  } else if (lowerCategory.includes('패스트') || lowerCategory.includes('버거')) {
    return '패스트푸드';
  } else {
    return '기타';
  }
}

// 가격대 정규화 (DB enum에 맞춰)
function normalizePriceRange(priceString) {
  if (!priceString) return '보통';
  
  const price = priceString.toLowerCase();
  
  if (price.includes('3,000') || price.includes('5,000') || price.includes('8,000')) {
    return '저렴한';
  } else if (price.includes('50,000') || price.includes('80,000') || price.includes('100,000')) {
    return '매우비싼';
  } else if (price.includes('30,000') || price.includes('40,000')) {
    return '비싼';
  } else {
    return '보통';
  }
}

// 카테고리별 가격대 추정
function getPriceRangeByCategory(category) {
  const normalizedCategory = normalizeCategory(category);
  
  switch (normalizedCategory) {
    case '양식':
    case '일식':
      return '비싼';
    case '카페':
    case '디저트':
      return '저렴한';
    case '패스트푸드':
      return '저렴한';
    case '주점':
      return '보통';
    default:
      return '보통';
  }
}

// 카테고리별 실제 음식 이미지 반환
function getRestaurantImages(category) {
  const imageMap = {
    '한식': [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220511_45%2F1652240952850hQkKn_JPEG%2F%25EC%2586%258C%25EB%25A8%25B8%25EB%25A6%25AC%25EA%25B5%25AD%25EB%25B0%25A52.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221018_15%2F1666063364628rGMcx_JPEG%2F%25EB%2583%2589%25EB%25A9%25B4.jpg&type=sc960_832' }
    ],
    '중식': [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220308_109%2F1646706932549oa4xK_JPEG%2F%25EC%25A7%259C%25EC%259E%25A5%25EB%25A9%25B4.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220308_72%2F1646706932667KWGNW_JPEG%2F%25EC%25A7%259C%25EC%259E%25A5%25EB%25B0%25A5.jpg&type=sc960_832' }
    ],
    '일식': [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220615_216%2F1655285952421wdRhz_JPEG%2F%25EC%2598%25A4%25EB%258B%2588%25EA%25B8%25B0%25EB%25A6%25AC.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220615_181%2F1655285952549yPYGx_JPEG%2F%25EC%25B9%25B4%25EB%25A0%2588%25EC%2598%25A4%25EB%258B%2588%25EA%25B8%25B0%25EB%25A6%25AC.jpg&type=sc960_832' }
    ],
    '양식': [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221115_18%2F1668494885437gPl0e_JPEG%2F%25ED%2594%2584%25EB%25A0%258C%25EC%25B9%2598%25EC%259A%2594%25EB%25A6%25AC.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20221115_289%2F1668494885578kD0FL_JPEG%2F%25EC%258A%25A4%25ED%2585%258C%25EC%259D%25B4%25ED%2581%25AC.jpg&type=sc960_832' }
    ],
    '카페': [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220415_235%2F1650015425677p5bN5_JPEG%2F%25EC%25BB%25A4%25ED%2594%25BC.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220415_189%2F1650015425798aW4cG_JPEG%2F%25EB%2594%2594%25EC%25A0%2580%25ED%258A%25B8.jpg&type=sc960_832' }
    ],
    '기타': [
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220523_265%2F1653288725473vIKzA_JPEG%2F%25ED%2595%25B4%25EB%25AC%25BC%25EC%25B0%259C.jpg&type=sc960_832' },
      { url: 'https://search.pstatic.net/common/?src=https%3A%2F%2Fldb-phinf.pstatic.net%2F20220708_133%2F1657266962445VJkCF_JPEG%2F%25EA%25B0%2588%25EB%25B9%2584%25EC%2584%25B8%25ED%258A%25B8.jpg&type=sc960_832' }
    ]
  };
  
  return imageMap[category] || imageMap['기타'];
}

// 웹 크롤링 함수 (망고플레이트 등)
async function crawlRestaurants() {
  try {
    // 크롤링 예제 (실제로는 robots.txt 확인 필요)
    const restaurants = [];
    
    // 다이닝코드 크롤링 예제
    const url = 'https://www.diningcode.com/list.php?query=동대문구';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    $('.dc-restaurant-list-item').each((index, element) => {
      if (index < 10) { // 상위 10개만
        const name = $(element).find('.dc-restaurant-name').text().trim();
        const category = $(element).find('.dc-restaurant-category').text().trim();
        const address = $(element).find('.dc-restaurant-address').text().trim();
        const rating = parseFloat($(element).find('.dc-restaurant-rating').text()) || 4.0;
        
        if (name && address) {
          restaurants.push({
            name,
            category: category || '음식점',
            address,
            rating,
            description: `${category} 맛집`,
            priceRange: '10,000-25,000원',
            coordinates: {
              lat: 37.5747 + (Math.random() - 0.5) * 0.05,
              lng: 127.0398 + (Math.random() - 0.5) * 0.05
            }
          });
        }
      }
    });
    
    return restaurants;
  } catch (error) {
    console.log('크롤링 실패:', error.message);
    return [];
  }
}

async function seedDatabase() {
  try {
    // MongoDB 연결
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bobmap';
    await mongoose.connect(mongoUri);
    console.log('MongoDB 연결 성공:', mongoUri.includes('mongodb.net') ? 'MongoDB Atlas' : 'Local MongoDB');

    // 기존 데이터 삭제 및 인덱스 초기화
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Playlist.deleteMany({});
    
    // 기존 인덱스 삭제 (2dsphere 인덱스 문제 해결)
    try {
      await Restaurant.collection.dropIndexes();
      console.log('기존 인덱스 삭제 완료');
    } catch (error) {
      console.log('인덱스 삭제 실패 (무시 가능):', error.message);
    }
    
    console.log('기존 데이터 삭제 완료');

    // 1. Bob 사용자 생성
    const hashedPassword = await bcrypt.hash('bob123456', 10);
    const bobUser = await User.create({
      username: 'Bob',
      email: 'whskadn73@gmail.com',
      password: hashedPassword,
      bio: '서울 맛집 큐레이터 🍜 미슐랭부터 숨은 맛집까지!',
      profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
      followers: [],
      following: []
    });
    console.log('Bob 사용자 생성 완료 (whskadn73@gmail.com)');

    // 2. 추가 사용자들 생성
    const users = [
      { username: 'FoodLover', email: 'foodlover@example.com', bio: '맛집 블로거' },
      { username: 'KoreanFoodie', email: 'kfoodie@example.com', bio: '한식 전문가' },
      { username: 'StreetFood', email: 'street@example.com', bio: '길거리 음식 매니아' }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = await User.create({
        ...userData,
        password: hashedPassword,
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`
      });
      createdUsers.push(user);
    }
    console.log('추가 사용자 생성 완료');

    // 3. 레스토랑 데이터 저장
    console.log('맛집 데이터 수집 시작...');
    
    // 실제 네이버 플레이스에서 맛집 데이터 수집
    let allRestaurants = await fetchRealRestaurantData();
    console.log(`실제 맛집 데이터 ${allRestaurants.length}개 준비 완료`);
    
    // 네이버 API로 실제 맛집 데이터 추가 (일단 비활성화)
    // const apiRestaurants = await fetchRestaurantsFromAPI();
    // if (apiRestaurants.length > 0) {
    //   allRestaurants = [...allRestaurants, ...apiRestaurants];
    //   console.log(`네이버 API로 ${apiRestaurants.length}개 추가 맛집 수집`);
    // }
    
    // 크롤링 데이터 추가 (일단 비활성화)
    // const crawledRestaurants = await crawlRestaurants();
    // if (crawledRestaurants.length > 0) {
    //   allRestaurants = [...allRestaurants, ...crawledRestaurants];
    //   console.log(`크롤링으로 ${crawledRestaurants.length}개 추가 맛집 수집`);
    // }

    // 중복 제거 (이름 기준) 및 createdBy 필드 추가
    const uniqueRestaurants = allRestaurants
      .filter((restaurant, index, self) => 
        index === self.findIndex(r => r.name === restaurant.name)
      )
      .map(restaurant => ({
        ...restaurant,
        createdBy: bobUser._id // 모든 레스토랑을 Bob이 등록한 것으로 설정
      }));

    const savedRestaurants = await Restaurant.insertMany(uniqueRestaurants);
    console.log(`총 ${savedRestaurants.length}개 레스토랑 데이터 저장 완료`);

    // 4. Bob의 큐레이션 플레이리스트 생성
    const playlists = [
      {
        title: '서울 미슐랭 & 전통 맛집 베스트',
        description: '미슐랭 인정받은 맛집부터 100년 전통 맛집까지',
        category: '맛집투어',
        targetAudience: ['20대', '30대', '직장인'],
        restaurants: savedRestaurants.slice(0, 6).map(r => r._id)
      },
      {
        title: '혼밥족을 위한 혼밥 맛집',
        description: '혼자서도 편하게 식사할 수 있는 서울 맛집들',
        category: '혼밥',
        targetAudience: ['혼자', '20대', '학생'],
        restaurants: savedRestaurants.filter(r => 
          r.name.includes('국밥') || r.name.includes('면옥') || r.name.includes('오니기리')
        ).slice(0, 5).map(r => r._id)
      },
      {
        title: '데이트하기 좋은 분위기 맛집',
        description: '연인과 함께 가면 좋은 로맨틱한 맛집들',
        category: '데이트코스',
        targetAudience: ['커플', '20대', '30대'],
        restaurants: savedRestaurants.filter(r => 
          r.name.includes('봉피양') || r.name.includes('한우여관') || r.priceRange === '매우비싼'
        ).slice(0, 4).map(r => r._id)
      },
      {
        title: '회식 & 모임 추천 맛집',
        description: '동료들과 회식하기 좋은 넓고 맛있는 곳',
        category: '회식',
        targetAudience: ['직장인', '친구'],
        restaurants: savedRestaurants.filter(r => 
          r.name.includes('삼원가든') || r.name.includes('해물천지') || r.category === '한식'
        ).slice(0, 5).map(r => r._id)
      }
    ];

    for (const playlistData of playlists) {
      const playlist = await Playlist.create({
        title: playlistData.title,
        description: playlistData.description,
        isPublic: true,
        tags: playlistData.title.split(' ').slice(0, 3), // 제목에서 태그 추출
        createdBy: bobUser._id,
        category: playlistData.category,
        restaurants: playlistData.restaurants.map((restaurantId, index) => ({
          restaurant: restaurantId,
          order: index + 1,
          addedBy: bobUser._id,
          addedAt: new Date()
        })),
        likes: [], // 빈 배열로 초기화
        saves: [],
        completions: [],
        collaborators: [],
        targetAudience: playlistData.targetAudience,
        shareCount: 0,
        viewCount: Math.floor(Math.random() * 100) + 50,
        commentCount: 0,
        isActive: true,
        isFeatured: false
      });
    }
    console.log('플레이리스트 생성 완료');

    // 5. 다른 사용자들의 플레이리스트도 생성
    for (const user of createdUsers) {
      const userPlaylist = await Playlist.create({
        title: `${user.username}의 추천 맛집`,
        description: '제가 직접 가본 맛집들입니다',
        createdBy: user._id,
        category: '맛집투어',
        isPublic: true,
        tags: ['추천', '맛집'],
        restaurants: savedRestaurants
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)
          .map((r, index) => ({
            restaurant: r._id,
            order: index + 1,
            addedBy: user._id,
            addedAt: new Date()
          })),
        likes: [],
        saves: [],
        completions: [],
        collaborators: [],
        targetAudience: ['20대', '30대'],
        shareCount: 0,
        viewCount: Math.floor(Math.random() * 30) + 10,
        commentCount: 0,
        isActive: true,
        isFeatured: false
      });
    }
    console.log('다른 사용자 플레이리스트 생성 완료');

    // 6. 팔로우 관계 설정
    bobUser.followers = createdUsers.map(u => u._id);
    await bobUser.save();
    
    for (const user of createdUsers) {
      user.following.push(bobUser._id);
      await user.save();
    }
    console.log('팔로우 관계 설정 완료');

    console.log('\n=== 🎉 BobMap 시딩 완료 ===');
    console.log('📧 Bob 계정: whskadn73@gmail.com / bob123456');
    console.log(`🍽️  총 ${uniqueRestaurants.length}개 서울 유명 맛집 등록`);
    console.log(`📋 총 ${playlists.length}개 Bob의 큐레이션 플레이리스트 생성`);
    console.log(`👥 총 ${createdUsers.length + 1}명 사용자 생성`);
    console.log('\n🚀 이제 npm run dev로 앱을 실행하고 Bob 계정으로 로그인해보세요!');
    
    process.exit(0);
  } catch (error) {
    console.error('시딩 실패:', error);
    process.exit(1);
  }
}

// 스크립트 실행
seedDatabase();