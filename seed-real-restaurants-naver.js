require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Restaurant = require('./server/models/Restaurant');
const User = require('./server/models/User');
const Playlist = require('./server/models/Playlist');

// 네이버 API로 실제 맛집 검색
async function searchNaverRestaurants(query) {
  try {
    const response = await axios.get('https://openapi.naver.com/v1/search/local.json', {
      params: {
        query: query,
        display: 30,
        start: 1,
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
  
  if (categoryText.includes('한식') || categoryText.includes('한정식')) return '한식';
  if (categoryText.includes('중식') || categoryText.includes('중국')) return '중식';
  if (categoryText.includes('일식') || categoryText.includes('일본') || categoryText.includes('초밥') || categoryText.includes('라멘')) return '일식';
  if (categoryText.includes('양식') || categoryText.includes('이탈리') || categoryText.includes('프렌치')) return '양식';
  if (naverCategory.includes('멕시코') || naverCategory.includes('남미')) return '양식';
  if (categoryText.includes('카페') || categoryText.includes('커피')) return '카페';
  if (categoryText.includes('술집') || categoryText.includes('주점') || categoryText.includes('바')) return '주점';
  if (categoryText.includes('분식')) return '패스트푸드';
  if (naverCategory.includes('아시아') || naverCategory.includes('태국') || naverCategory.includes('베트남')) return '동남아';
  if (categoryText.includes('디저트') || categoryText.includes('베이커리')) return '디저트';
  
  return '기타';
}

// 가격대 랜덤 설정
function getRandomPriceRange() {
  const prices = ['저렴한', '보통', '비싼', '매우비싼'];
  return prices[Math.floor(Math.random() * prices.length)];
}

async function seedRealRestaurants() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');
    
    // 기존 레스토랑 모두 삭제
    await Restaurant.deleteMany({});
    console.log('기존 레스토랑 데이터 삭제 완료');
    
    // 시스템 유저 찾기 또는 생성
    let systemUser = await User.findOne({ username: 'BobMap' });
    if (!systemUser) {
      systemUser = await User.findOne({ username: 'system' });
    }
    if (!systemUser) {
      systemUser = new User({
        username: 'BobMap',
        email: 'system@bobmap.com',
        password: 'system123',
        tasteProfile: {
          preferences: {},
          favoriteCategories: [],
          tasteType: '기타'
        },
        trustScore: 100
      });
      await systemUser.save();
      console.log('시스템 유저 생성 완료');
    }
    
    const restaurants = [];
    const searchQueries = [
      // 지역별 인기 맛집
      '강남역 맛집', '홍대 맛집', '이태원 맛집', '성수동 맛집', '을지로 맛집',
      '망원동 맛집', '연남동 맛집', '한남동 맛집', '종로 맛집', '명동 맛집',
      
      // 카테고리별 맛집
      '서울 스시', '서울 라멘', '서울 파스타', '서울 피자', '서울 스테이크',
      '서울 삼겹살', '서울 갈비', '서울 냉면', '서울 설렁탕', '서울 순대국',
      '서울 마라탕', '서울 훠궈', '서울 딤섬', '서울 짜장면', '서울 짬뽕',
      '서울 타코', '서울 부리토', '서울 쌀국수', '서울 팟타이', '서울 분짜',
      
      // 특색있는 맛집
      '서울 브런치', '서울 수제버거', '서울 크래프트비어', '서울 와인바',
      '서울 오마카세', '서울 한우', '서울 횟집', '서울 곱창'
    ];
    
    console.log('네이버 API로 실제 맛집 검색 시작...');
    
    for (const query of searchQueries) {
      console.log(`검색 중: ${query}`);
      const items = await searchNaverRestaurants(query);
      
      for (const item of items) {
        const cleanName = item.title.replace(/<[^>]*>/g, '').trim();
        const address = item.roadAddress || item.address;
        
        // 중복 체크
        const exists = restaurants.some(r => 
          r.name === cleanName && r.address === address
        );
        
        if (!exists && address && address.includes('서울')) {
          const restaurant = {
            name: cleanName,
            address: address,
            category: mapCategory(item.category),
            phoneNumber: item.telephone || '',
            coordinates: {
              lat: parseFloat(item.mapy) / 10000000,
              lng: parseFloat(item.mapx) / 10000000
            },
            priceRange: getRandomPriceRange(),
            averageRating: 3.5 + Math.random() * 1.5, // 3.5 ~ 5.0
            reviewCount: Math.floor(Math.random() * 500) + 10,
            viewCount: Math.floor(Math.random() * 1000),
            images: [{
              url: `https://images.unsplash.com/photo-${
                Math.random() > 0.5 ? '1517248135467-4c7edcad34c4' : '1555396273-eb8052c4862a'
              }?w=800&h=600&fit=crop`
            }],
            businessHours: {
              monday: { open: '11:00', close: '22:00', isOpen: true },
              tuesday: { open: '11:00', close: '22:00', isOpen: true },
              wednesday: { open: '11:00', close: '22:00', isOpen: true },
              thursday: { open: '11:00', close: '22:00', isOpen: true },
              friday: { open: '11:00', close: '23:00', isOpen: true },
              saturday: { open: '11:00', close: '23:00', isOpen: true },
              sunday: { open: '11:00', close: '21:00', isOpen: true }
            },
            tags: [],
            isVerified: Math.random() > 0.3,
            createdBy: systemUser._id
          };
          
          restaurants.push(restaurant);
        }
      }
      
      // API 제한 방지를 위한 대기
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n총 ${restaurants.length}개의 실제 맛집 데이터 수집 완료`);
    
    // 레스토랑 저장
    const savedRestaurants = await Restaurant.insertMany(restaurants);
    console.log(`${savedRestaurants.length}개의 맛집 저장 완료`);
    
    // 카테고리별 통계
    const categoryCount = {};
    savedRestaurants.forEach(r => {
      categoryCount[r.category] = (categoryCount[r.category] || 0) + 1;
    });
    
    console.log('\n카테고리별 맛집 수:');
    Object.entries(categoryCount).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}개`);
    });
    
    // 플레이리스트 업데이트
    console.log('\n플레이리스트에 실제 맛집 연결 중...');
    
    const playlists = await Playlist.find({});
    
    for (const playlist of playlists) {
      // 플레이리스트 주제에 맞는 레스토랑 찾기
      let matchingRestaurants = [];
      
      if (playlist.title.includes('망원')) {
        matchingRestaurants = savedRestaurants.filter(r => 
          r.address.includes('망원') || r.address.includes('마포')
        ).slice(0, 5);
      } else if (playlist.title.includes('성수')) {
        matchingRestaurants = savedRestaurants.filter(r => 
          r.address.includes('성수') || r.address.includes('성동구')
        ).slice(0, 5);
      } else if (playlist.title.includes('이태원')) {
        matchingRestaurants = savedRestaurants.filter(r => 
          r.address.includes('이태원') || r.address.includes('용산')
        ).slice(0, 5);
      } else if (playlist.title.includes('강남')) {
        matchingRestaurants = savedRestaurants.filter(r => 
          r.address.includes('강남') || r.address.includes('역삼')
        ).slice(0, 5);
      } else if (playlist.title.includes('홍대')) {
        matchingRestaurants = savedRestaurants.filter(r => 
          r.address.includes('홍대') || r.address.includes('서교') || r.address.includes('합정')
        ).slice(0, 5);
      } else if (playlist.title.includes('을지로')) {
        matchingRestaurants = savedRestaurants.filter(r => 
          r.address.includes('을지로') || r.address.includes('중구')
        ).slice(0, 5);
      } else if (playlist.title.includes('한남')) {
        matchingRestaurants = savedRestaurants.filter(r => 
          r.address.includes('한남') || r.address.includes('용산')
        ).slice(0, 5);
      } else if (playlist.title.includes('연남')) {
        matchingRestaurants = savedRestaurants.filter(r => 
          r.address.includes('연남') || r.address.includes('연희')
        ).slice(0, 5);
      } else if (playlist.title.includes('종로')) {
        matchingRestaurants = savedRestaurants.filter(r => 
          r.address.includes('종로') || r.address.includes('인사동')
        ).slice(0, 5);
      } else {
        // 랜덤으로 선택
        matchingRestaurants = savedRestaurants
          .sort(() => Math.random() - 0.5)
          .slice(0, 5);
      }
      
      if (matchingRestaurants.length > 0) {
        playlist.restaurants = matchingRestaurants.map((r, index) => ({
          restaurant: r._id,
          order: index,
          mustTry: [],
          addedBy: systemUser._id,
          addedAt: new Date()
        }));
        
        await playlist.save();
        console.log(`  - "${playlist.title}": ${matchingRestaurants.length}개 맛집 연결`);
      }
    }
    
    console.log('\n✅ 실제 맛집 데이터 시딩 완료!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedRealRestaurants();