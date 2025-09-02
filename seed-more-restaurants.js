require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Restaurant = require('./server/models/Restaurant');
const User = require('./server/models/User');

// 네이버 API로 더 많은 맛집 검색
async function searchNaverRestaurants(query, start = 1) {
  try {
    const response = await axios.get('https://openapi.naver.com/v1/search/local.json', {
      params: {
        query: query,
        display: 100, // 최대 100개까지 가져오기
        start: start,
        sort: 'random'
      },
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_SEARCH_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_SEARCH_CLIENT_SECRET
      }
    });
    
    return response.data.items;
  } catch (error) {
    console.error(`네이버 API 에러 (${query}):`, error.message);
    return [];
  }
}

// 카테고리 매핑
function mapCategory(naverCategory) {
  const categoryText = naverCategory.split('>').pop().trim();
  
  if (categoryText.includes('한식') || categoryText.includes('한정식') || categoryText.includes('국밥') || categoryText.includes('찌개')) return '한식';
  if (categoryText.includes('중식') || categoryText.includes('중국')) return '중식';
  if (categoryText.includes('일식') || categoryText.includes('일본') || categoryText.includes('초밥') || categoryText.includes('라멘') || categoryText.includes('스시')) return '일식';
  if (categoryText.includes('양식') || categoryText.includes('이탈리') || categoryText.includes('프렌치') || categoryText.includes('파스타')) return '양식';
  if (naverCategory.includes('멕시코') || naverCategory.includes('남미')) return '양식';
  if (categoryText.includes('카페') || categoryText.includes('커피') || categoryText.includes('베이커리')) return '카페';
  if (categoryText.includes('술집') || categoryText.includes('주점') || categoryText.includes('바') || categoryText.includes('포차')) return '주점';
  if (categoryText.includes('분식') || categoryText.includes('김밥')) return '패스트푸드';
  if (naverCategory.includes('아시아') || naverCategory.includes('태국') || naverCategory.includes('베트남') || naverCategory.includes('인도')) return '동남아';
  if (categoryText.includes('디저트') || categoryText.includes('빙수') || categoryText.includes('아이스크림')) return '디저트';
  
  return '기타';
}

// 가격대를 평점이나 지역에 따라 추정
function estimatePriceRange(name, address, category) {
  // 고급 지역
  if (address.includes('청담') || address.includes('한남') || address.includes('성북동')) {
    return Math.random() > 0.3 ? '비싼' : '매우비싼';
  }
  // 오마카세, 한우, 스시 등 고급 키워드
  if (name.includes('오마카세') || name.includes('한우') || name.includes('스시')) {
    return '매우비싼';
  }
  // 분식, 김밥 등 저렴한 키워드
  if (category === '패스트푸드' || name.includes('김밥') || name.includes('분식')) {
    return '저렴한';
  }
  // 기본값은 랜덤
  const prices = ['저렴한', '보통', '보통', '비싼']; // 보통이 많도록
  return prices[Math.floor(Math.random() * prices.length)];
}

async function seedMoreRestaurants() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');
    
    // 시스템 유저 찾기
    let systemUser = await User.findOne({ username: 'BobMap' });
    if (!systemUser) {
      systemUser = await User.findOne({ username: 'system' });
    }
    
    // 기존 레스토랑 수 확인
    const existingCount = await Restaurant.countDocuments();
    console.log(`기존 레스토랑 수: ${existingCount}개`);
    
    const restaurants = [];
    const searchQueries = [
      // 더 다양한 지역
      '강남 맛집', '역삼 맛집', '삼성동 맛집', '논현동 맛집', '신사동 맛집',
      '압구정 맛집', '청담동 맛집', '대치동 맛집', '도곡동 맛집', '개포동 맛집',
      '서초 맛집', '방배동 맛집', '잠실 맛집', '송파 맛집', '문정동 맛집',
      '가로수길 맛집', '경리단길 맛집', '해방촌 맛집', '녹사평 맛집', '한강진 맛집',
      '신촌 맛집', '이대 맛집', '서대문 맛집', '충정로 맛집', '공덕 맛집',
      '마포 맛집', '상수동 맛집', '합정 맛집', '망원 맛집', '연남동 맛집',
      '북촌 맛집', '삼청동 맛집', '인사동 맛집', '광화문 맛집', '종각 맛집',
      '동대문 맛집', '성신여대 맛집', '혜화 맛집', '대학로 맛집', '성북동 맛집',
      '용산 맛집', '이촌동 맛집', '노원 맛집', '중계동 맛집', '상계동 맛집',
      
      // 특정 음식 카테고리
      '서울 일식', '서울 중식', '서울 한식', '서울 양식', '서울 아시아음식',
      '서울 브런치카페', '서울 디저트카페', '서울 베이커리', '서울 와인바', '서울 칵테일바',
      '서울 고기집', '서울 해산물', '서울 채식', '서울 비건', '서울 할랄'
    ];
    
    console.log('네이버 API로 대량 맛집 데이터 수집 시작...');
    
    // 기존 레스토랑 정보 가져오기 (중복 체크용)
    const existingRestaurants = await Restaurant.find({}, 'name address').lean();
    const existingSet = new Set(existingRestaurants.map(r => `${r.name}::${r.address}`));
    
    for (const query of searchQueries) {
      console.log(`검색 중: ${query}`);
      
      // 각 쿼리당 최대 200개까지 가져오기 (100개씩 2번)
      for (let start = 1; start <= 101; start += 100) {
        const items = await searchNaverRestaurants(query, start);
        
        for (const item of items) {
          const cleanName = item.title.replace(/<[^>]*>/g, '').trim();
          const address = item.roadAddress || item.address;
          
          // 서울이 아니면 제외
          if (!address || !address.includes('서울')) continue;
          
          // 중복 체크
          const uniqueKey = `${cleanName}::${address}`;
          if (existingSet.has(uniqueKey)) continue;
          
          existingSet.add(uniqueKey);
          
          const restaurant = {
            name: cleanName,
            address: address,
            category: mapCategory(item.category),
            phoneNumber: item.telephone || '',
            coordinates: {
              lat: parseFloat(item.mapy) / 10000000,
              lng: parseFloat(item.mapx) / 10000000
            },
            priceRange: estimatePriceRange(cleanName, address, mapCategory(item.category)),
            averageRating: 3.0 + Math.random() * 2.0, // 3.0 ~ 5.0
            reviewCount: Math.floor(Math.random() * 1000) + 5,
            viewCount: Math.floor(Math.random() * 2000),
            images: [{
              url: `https://images.unsplash.com/photo-${
                ['1517248135467-4c7edcad34c4', '1555396273-eb8052c4862a', '1559181567-c3190ca9959b',
                 '1540189549336-e6e99c3679fe', '1565299624946-b28e28c0ae56', '1567620905-9b4aac48e6',
                 '1504674900247-0877df9cc836', '1476224203421-9ac39bcb3327'][Math.floor(Math.random() * 8)]
              }?w=800&h=600&fit=crop`
            }],
            businessHours: {
              monday: { open: '11:00', close: '22:00', isOpen: true },
              tuesday: { open: '11:00', close: '22:00', isOpen: true },
              wednesday: { open: '11:00', close: '22:00', isOpen: true },
              thursday: { open: '11:00', close: '22:00', isOpen: true },
              friday: { open: '11:00', close: '23:00', isOpen: true },
              saturday: { open: '11:00', close: '23:00', isOpen: true },
              sunday: { open: '11:00', close: '21:00', isOpen: Math.random() > 0.2 }
            },
            tags: [],
            isVerified: Math.random() > 0.5,
            createdBy: systemUser._id
          };
          
          // 태그 추가
          if (restaurant.category === '한식') {
            restaurant.tags = ['한식', '전통', '로컬맛집'];
          } else if (restaurant.category === '카페') {
            restaurant.tags = ['카페', '디저트', '브런치'];
          } else if (restaurant.category === '주점') {
            restaurant.tags = ['술집', '안주', '회식'];
          }
          
          restaurants.push(restaurant);
        }
        
        // API 제한 방지를 위한 대기
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    console.log(`\n총 ${restaurants.length}개의 새로운 맛집 데이터 수집 완료`);
    
    // 배치로 저장 (한번에 너무 많이 저장하지 않도록)
    const batchSize = 100;
    let totalSaved = 0;
    
    for (let i = 0; i < restaurants.length; i += batchSize) {
      const batch = restaurants.slice(i, i + batchSize);
      const savedBatch = await Restaurant.insertMany(batch, { ordered: false }).catch(err => {
        console.log(`배치 저장 중 일부 실패 (중복 등): ${err.insertedCount || 0}개 저장`);
        return { insertedCount: err.insertedCount || 0 };
      });
      totalSaved += savedBatch.insertedCount || batch.length;
      console.log(`진행: ${totalSaved}/${restaurants.length}`);
    }
    
    console.log(`\n✅ ${totalSaved}개의 새로운 맛집 저장 완료`);
    
    // 최종 통계
    const finalCount = await Restaurant.countDocuments();
    console.log(`\n최종 레스토랑 수: ${finalCount}개`);
    
    // 카테고리별 통계
    const categoryStats = await Restaurant.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n카테고리별 분포:');
    categoryStats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count}개`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedMoreRestaurants();