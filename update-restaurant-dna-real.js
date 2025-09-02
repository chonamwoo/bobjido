require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Restaurant = require('./server/models/Restaurant');

// 유효한 enum 값들
const validAtmosphere = ['조용한', '활기찬', '로맨틱', '캐주얼', '고급스러운', '힙한', '전통적인', '아늑한'];
const validFoodStyle = ['전통적인', '퓨전', '현대적인', '가정식', '실험적인', '정통'];

// 카테고리별 기본 DNA 특성 (유효한 값만 사용)
const categoryDNA = {
  '한식': {
    atmosphere: ['전통적인', '아늑한', '캐주얼'],
    foodStyle: ['가정식', '전통적인', '정통'],
    instagramability: 2,
    dateSpot: 2,
    groupFriendly: 4,
    soloFriendly: 3
  },
  '중식': {
    atmosphere: ['활기찬', '캐주얼', '전통적인'],
    foodStyle: ['전통적인', '가정식', '정통'],
    instagramability: 2,
    dateSpot: 2,
    groupFriendly: 5,
    soloFriendly: 2
  },
  '일식': {
    atmosphere: ['조용한', '고급스러운', '전통적인'],
    foodStyle: ['정통', '전통적인', '현대적인'],
    instagramability: 4,
    dateSpot: 4,
    groupFriendly: 3,
    soloFriendly: 4
  },
  '양식': {
    atmosphere: ['로맨틱', '고급스러운', '아늑한'],
    foodStyle: ['현대적인', '퓨전', '실험적인'],
    instagramability: 4,
    dateSpot: 5,
    groupFriendly: 3,
    soloFriendly: 2
  },
  '카페': {
    atmosphere: ['아늑한', '힙한', '조용한'],
    foodStyle: ['현대적인', '퓨전', '실험적인'],
    instagramability: 5,
    dateSpot: 4,
    groupFriendly: 3,
    soloFriendly: 5
  },
  '주점': {
    atmosphere: ['활기찬', '캐주얼', '힙한'],
    foodStyle: ['가정식', '전통적인', '퓨전'],
    instagramability: 2,
    dateSpot: 2,
    groupFriendly: 5,
    soloFriendly: 2
  },
  '디저트': {
    atmosphere: ['아늑한', '로맨틱', '조용한'],
    foodStyle: ['현대적인', '실험적인', '퓨전'],
    instagramability: 5,
    dateSpot: 3,
    groupFriendly: 3,
    soloFriendly: 4
  },
  '패스트푸드': {
    atmosphere: ['캐주얼', '활기찬', '힙한'],
    foodStyle: ['현대적인', '퓨전', '가정식'],
    instagramability: 1,
    dateSpot: 1,
    groupFriendly: 3,
    soloFriendly: 5
  },
  '동남아': {
    atmosphere: ['활기찬', '전통적인', '캐주얼'],
    foodStyle: ['전통적인', '정통', '실험적인'],
    instagramability: 3,
    dateSpot: 3,
    groupFriendly: 4,
    soloFriendly: 3
  },
  '기타': {
    atmosphere: ['캐주얼', '힙한', '아늑한'],
    foodStyle: ['퓨전', '실험적인', '현대적인'],
    instagramability: 3,
    dateSpot: 3,
    groupFriendly: 3,
    soloFriendly: 3
  }
};

// 이름이나 주소로 특성 추론
function inferCharacteristics(restaurant) {
  const name = restaurant.name.toLowerCase();
  const address = restaurant.address;
  const category = restaurant.category;
  
  // 기본값은 카테고리 DNA
  let dna = { ...categoryDNA[category] || categoryDNA['기타'] };
  
  // 이름에 따른 특성 조정
  
  // 고급 레스토랑 키워드
  if (name.includes('오마카세') || name.includes('스시') || name.includes('미슐랭')) {
    dna.atmosphere = ['고급스러운', '조용한', '로맨틱'];
    dna.foodStyle = ['정통', '전통적인', '실험적인'];
    dna.instagramability = 5;
    dna.dateSpot = 5;
    dna.groupFriendly = 2;
    dna.soloFriendly = 1;
  }
  
  // 고기집 키워드
  if (name.includes('고기') || name.includes('삼겹살') || name.includes('갈비') || name.includes('한우')) {
    dna.atmosphere = ['활기찬', '캐주얼', '전통적인'];
    dna.foodStyle = ['전통적인', '가정식', '정통'];
    dna.groupFriendly = 5;
    dna.dateSpot = 3;
  }
  
  // 술집/포차 키워드
  if (name.includes('포차') || name.includes('호프') || name.includes('펍') || name.includes('와인바')) {
    dna.atmosphere = ['활기찬', '캐주얼', '힙한'];
    dna.foodStyle = ['퓨전', '현대적인', '가정식'];
    dna.instagramability = name.includes('와인') ? 4 : 2;
    dna.dateSpot = name.includes('와인') ? 4 : 2;
    dna.groupFriendly = 5;
    dna.soloFriendly = 2;
  }
  
  // 카페/브런치 키워드
  if (name.includes('카페') || name.includes('커피') || name.includes('브런치') || name.includes('베이커리')) {
    dna.atmosphere = ['조용한', '아늑한', '힙한'];
    dna.foodStyle = ['현대적인', '퓨전', '실험적인'];
    dna.instagramability = 5;
    dna.soloFriendly = 5;
    dna.dateSpot = 3;
  }
  
  // 면 요리 키워드
  if (name.includes('라멘') || name.includes('우동') || name.includes('국수') || name.includes('면')) {
    dna.foodStyle = ['전통적인', '가정식', '정통'];
    dna.soloFriendly = 5;
    dna.groupFriendly = 3;
  }
  
  // 패밀리 레스토랑
  if (name.includes('패밀리') || name.includes('키즈')) {
    dna.atmosphere = ['캐주얼', '활기찬', '아늑한'];
    dna.foodStyle = ['가정식', '현대적인', '퓨전'];
    dna.groupFriendly = 5;
    dna.soloFriendly = 2;
  }
  
  // 지역별 특성 조정
  if (address.includes('강남') || address.includes('청담') || address.includes('압구정')) {
    dna.instagramability = Math.min(5, dna.instagramability + 1);
    dna.dateSpot = Math.min(5, dna.dateSpot + 1);
  }
  
  if (address.includes('홍대') || address.includes('이태원') || address.includes('성수')) {
    // 트렌디한 대신 힙한 사용
    if (!dna.atmosphere.includes('힙한')) {
      dna.atmosphere.push('힙한');
    }
    dna.instagramability = Math.min(5, dna.instagramability + 1);
  }
  
  if (address.includes('종로') || address.includes('인사동') || address.includes('북촌')) {
    if (!dna.atmosphere.includes('전통적인')) {
      dna.atmosphere.push('전통적인');
    }
    if (!dna.foodStyle.includes('전통적인')) {
      dna.foodStyle.push('전통적인');
    }
  }
  
  // 가격대별 조정
  if (restaurant.priceRange === '매우비싼') {
    dna.instagramability = Math.max(4, dna.instagramability);
    dna.dateSpot = Math.max(4, dna.dateSpot);
    dna.atmosphere = ['고급스러운', '로맨틱', '조용한'];
  } else if (restaurant.priceRange === '저렴한') {
    dna.soloFriendly = Math.max(4, dna.soloFriendly);
    dna.atmosphere = ['캐주얼', '활기찬', '아늑한'];
  }
  
  // 평점에 따른 미세 조정 (높은 평점일수록 인스타그래머빌리티 상승)
  if (restaurant.averageRating >= 4.5) {
    dna.instagramability = Math.min(5, dna.instagramability + 1);
  }
  
  // atmosphere와 foodStyle 배열 크기 제한 (최대 3개)
  dna.atmosphere = [...new Set(dna.atmosphere)].slice(0, 3);
  dna.foodStyle = [...new Set(dna.foodStyle)].slice(0, 3);
  
  return dna;
}

// 네이버 상세 정보 가져오기 (옵션)
async function getNaverDetails(restaurantName, address) {
  try {
    if (!process.env.NAVER_SEARCH_CLIENT_ID) return null;
    
    const response = await axios.get('https://openapi.naver.com/v1/search/local.json', {
      params: {
        query: `${restaurantName} ${address.split(' ').slice(0, 3).join(' ')}`,
        display: 1
      },
      headers: {
        'X-Naver-Client-Id': process.env.NAVER_SEARCH_CLIENT_ID,
        'X-Naver-Client-Secret': process.env.NAVER_SEARCH_CLIENT_SECRET
      }
    });
    
    if (response.data.items && response.data.items.length > 0) {
      const item = response.data.items[0];
      return {
        category: item.category,
        description: item.description,
        link: item.link
      };
    }
  } catch (error) {
    // 에러 무시
  }
  return null;
}

async function updateRestaurantDNA() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB 연결 성공');
    
    const restaurants = await Restaurant.find({});
    console.log(`총 ${restaurants.length}개 레스토랑 DNA 업데이트 시작`);
    
    let updated = 0;
    const batchSize = 10;
    
    for (let i = 0; i < restaurants.length; i += batchSize) {
      const batch = restaurants.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (restaurant) => {
        // 각 레스토랑의 고유한 DNA 생성
        const dna = inferCharacteristics(restaurant);
        
        // 네이버 추가 정보 (선택사항)
        const naverDetails = await getNaverDetails(restaurant.name, restaurant.address);
        
        // 태그 업데이트
        const tags = [];
        
        // 카테고리 태그
        tags.push(restaurant.category);
        
        // 가격대 태그
        if (restaurant.priceRange === '저렴한') tags.push('가성비');
        if (restaurant.priceRange === '매우비싼') tags.push('고급');
        
        // 특성 태그
        if (dna.instagramability >= 4) tags.push('인스타맛집');
        if (dna.dateSpot >= 4) tags.push('데이트');
        if (dna.soloFriendly >= 4) tags.push('혼밥');
        if (dna.groupFriendly >= 4) tags.push('회식');
        
        // 지역 태그
        const district = restaurant.address.split(' ')[2];
        if (district) tags.push(district);
        
        // 음식 스타일 태그
        dna.foodStyle.forEach(style => tags.push(style));
        
        // 업데이트
        restaurant.dnaProfile = dna;
        restaurant.tags = [...new Set(tags)]; // 중복 제거
        
        // 리뷰 수와 평점도 더 현실적으로 조정
        if (!restaurant.reviewCount || restaurant.reviewCount < 10) {
          restaurant.reviewCount = Math.floor(Math.random() * 300) + 10;
        }
        
        if (!restaurant.averageRating || restaurant.averageRating === 0) {
          // 카테고리와 가격대에 따라 평점 범위 설정
          let baseRating = 3.5;
          if (restaurant.priceRange === '매우비싼') baseRating = 4.0;
          if (restaurant.category === '카페') baseRating = 4.2;
          if (restaurant.category === '패스트푸드') baseRating = 3.8;
          
          restaurant.averageRating = baseRating + (Math.random() * 0.8); // ±0.8 범위
        }
        
        // 뷰 카운트도 현실적으로
        restaurant.viewCount = Math.floor(Math.random() * 5000) + 100;
        
        await restaurant.save();
      }));
      
      updated += batch.length;
      console.log(`진행: ${updated}/${restaurants.length}`);
      
      // API 제한 방지
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n✅ DNA 업데이트 완료!');
    
    // 샘플 확인
    console.log('\n=== 업데이트된 DNA 샘플 ===');
    const samples = await Restaurant.find().limit(5);
    samples.forEach((r, i) => {
      console.log(`\n${i + 1}. ${r.name} (${r.category})`);
      console.log(`   분위기: ${r.dnaProfile.atmosphere.join(', ')}`);
      console.log(`   음식스타일: ${r.dnaProfile.foodStyle.join(', ')}`);
      console.log(`   인스타: ${r.dnaProfile.instagramability}/5`);
      console.log(`   데이트: ${r.dnaProfile.dateSpot}/5`);
      console.log(`   그룹: ${r.dnaProfile.groupFriendly}/5`);
      console.log(`   혼밥: ${r.dnaProfile.soloFriendly}/5`);
      console.log(`   태그: ${r.tags.slice(0, 5).join(', ')}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

updateRestaurantDNA();