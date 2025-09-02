require('dotenv').config();
const mongoose = require('mongoose');
const Restaurant = require('./server/models/Restaurant');

// 카테고리별 DNA 프로필 템플릿
const DNA_PROFILES = {
  '한식': {
    traditional: {
      atmosphere: ['전통적인', '아늑한', '조용한'],
      foodStyle: ['전통적인', '가정식', '정통'],
      instagramability: 3,
      dateSpot: 3,
      groupFriendly: 5,
      soloFriendly: 4
    },
    modern: {
      atmosphere: ['힙한', '활기찬', '캐주얼'],
      foodStyle: ['퓨전', '현대적인', '실험적인'],
      instagramability: 5,
      dateSpot: 4,
      groupFriendly: 4,
      soloFriendly: 3
    },
    casual: {
      atmosphere: ['캐주얼', '활기찬', '아늑한'],
      foodStyle: ['가정식', '전통적인'],
      instagramability: 2,
      dateSpot: 2,
      groupFriendly: 5,
      soloFriendly: 5
    }
  },
  
  '일식': {
    omakase: {
      atmosphere: ['고급스러운', '조용한', '로맨틱'],
      foodStyle: ['정통', '전통적인', '실험적인'],
      instagramability: 5,
      dateSpot: 5,
      groupFriendly: 2,
      soloFriendly: 3
    },
    casual: {
      atmosphere: ['캐주얼', '활기찬', '아늑한'],
      foodStyle: ['정통', '가정식'],
      instagramability: 3,
      dateSpot: 3,
      groupFriendly: 4,
      soloFriendly: 5
    },
    izakaya: {
      atmosphere: ['활기찬', '캐주얼', '아늑한'],
      foodStyle: ['전통적인', '가정식'],
      instagramability: 3,
      dateSpot: 3,
      groupFriendly: 5,
      soloFriendly: 3
    }
  },
  
  '중식': {
    fine: {
      atmosphere: ['고급스러운', '조용한', '전통적인'],
      foodStyle: ['정통', '전통적인'],
      instagramability: 4,
      dateSpot: 4,
      groupFriendly: 5,
      soloFriendly: 2
    },
    casual: {
      atmosphere: ['캐주얼', '활기찬'],
      foodStyle: ['가정식', '전통적인'],
      instagramability: 2,
      dateSpot: 2,
      groupFriendly: 5,
      soloFriendly: 4
    }
  },
  
  '양식': {
    fine: {
      atmosphere: ['고급스러운', '로맨틱', '조용한'],
      foodStyle: ['현대적인', '실험적인', '정통'],
      instagramability: 5,
      dateSpot: 5,
      groupFriendly: 3,
      soloFriendly: 2
    },
    bistro: {
      atmosphere: ['아늑한', '로맨틱', '캐주얼'],
      foodStyle: ['정통', '현대적인'],
      instagramability: 4,
      dateSpot: 5,
      groupFriendly: 3,
      soloFriendly: 3
    },
    casual: {
      atmosphere: ['캐주얼', '활기찬', '힙한'],
      foodStyle: ['퓨전', '현대적인'],
      instagramability: 4,
      dateSpot: 3,
      groupFriendly: 4,
      soloFriendly: 4
    }
  },
  
  '카페': {
    trendy: {
      atmosphere: ['힙한', '활기찬', '캐주얼'],
      foodStyle: ['현대적인', '실험적인'],
      instagramability: 5,
      dateSpot: 4,
      groupFriendly: 4,
      soloFriendly: 5
    },
    cozy: {
      atmosphere: ['아늑한', '조용한', '로맨틱'],
      foodStyle: ['가정식', '전통적인'],
      instagramability: 3,
      dateSpot: 5,
      groupFriendly: 3,
      soloFriendly: 5
    },
    business: {
      atmosphere: ['조용한', '힙한', '캐주얼'],
      foodStyle: ['현대적인', '정통'],
      instagramability: 2,
      dateSpot: 2,
      groupFriendly: 4,
      soloFriendly: 5
    }
  },
  
  '디저트': {
    premium: {
      atmosphere: ['고급스러운', '로맨틱', '조용한'],
      foodStyle: ['실험적인', '현대적인', '정통'],
      instagramability: 5,
      dateSpot: 5,
      groupFriendly: 3,
      soloFriendly: 3
    },
    trendy: {
      atmosphere: ['힙한', '활기찬', '현대적인'],
      foodStyle: ['실험적인', '퓨전'],
      instagramability: 5,
      dateSpot: 4,
      groupFriendly: 4,
      soloFriendly: 4
    }
  },
  
  '주점': {
    traditional: {
      atmosphere: ['전통적인', '활기찬', '캐주얼'],
      foodStyle: ['전통적인', '가정식'],
      instagramability: 2,
      dateSpot: 2,
      groupFriendly: 5,
      soloFriendly: 3
    },
    modern: {
      atmosphere: ['힙한', '활기찬', '현대적인'],
      foodStyle: ['퓨전', '실험적인'],
      instagramability: 4,
      dateSpot: 3,
      groupFriendly: 5,
      soloFriendly: 2
    }
  },
  
  '패스트푸드': {
    standard: {
      atmosphere: ['캐주얼', '활기찬'],
      foodStyle: ['현대적인', '가정식'],
      instagramability: 2,
      dateSpot: 1,
      groupFriendly: 4,
      soloFriendly: 5
    }
  },
  
  '동남아': {
    authentic: {
      atmosphere: ['전통적인', '활기찬', '아늑한'],
      foodStyle: ['정통', '전통적인'],
      instagramability: 3,
      dateSpot: 3,
      groupFriendly: 4,
      soloFriendly: 4
    },
    modern: {
      atmosphere: ['힙한', '활기찬', '캐주얼'],
      foodStyle: ['퓨전', '실험적인'],
      instagramability: 4,
      dateSpot: 4,
      groupFriendly: 4,
      soloFriendly: 3
    }
  },
  
  '기타': {
    default: {
      atmosphere: ['캐주얼', '아늑한'],
      foodStyle: ['가정식', '전통적인'],
      instagramability: 3,
      dateSpot: 3,
      groupFriendly: 4,
      soloFriendly: 4
    }
  }
};

// 레스토랑 이름/설명 기반 스타일 결정
function determineRestaurantStyle(restaurant) {
  const name = restaurant.name.toLowerCase();
  const description = (restaurant.description || '').toLowerCase();
  const tags = (restaurant.tags || []).join(' ').toLowerCase();
  const combined = `${name} ${description} ${tags}`;
  
  // 고급 레스토랑 키워드
  if (combined.match(/오마카세|스시야|미슐랭|파인다이닝|코스|프리미엄|호텔|그랜드/)) {
    return 'fine';
  }
  
  // 오마카세 전용
  if (combined.match(/오마카세/)) {
    return 'omakase';
  }
  
  // 트렌디한 곳
  if (combined.match(/힙한|핫플|인스타|감성|트렌디|루프탑|뷰맛집/)) {
    return 'trendy';
  }
  
  // 전통적인 곳
  if (combined.match(/전통|노포|원조|할머니|할아버지|손맛|집밥|백반/)) {
    return 'traditional';
  }
  
  // 모던한 곳
  if (combined.match(/모던|퓨전|크로스오버|창작|시그니처/)) {
    return 'modern';
  }
  
  // 비스트로/브런치
  if (combined.match(/비스트로|브런치|베이커리|브래서리/)) {
    return 'bistro';
  }
  
  // 이자카야
  if (combined.match(/이자카야|술집|포차|호프/)) {
    return 'izakaya';
  }
  
  // 아늑한 카페
  if (combined.match(/아늑|조용|힐링|책|독립|로컬/)) {
    return 'cozy';
  }
  
  // 비즈니스
  if (combined.match(/비즈니스|미팅|업무|스터디/)) {
    return 'business';
  }
  
  // 정통
  if (combined.match(/정통|본격|진짜|현지|오리지널/)) {
    return 'authentic';
  }
  
  // 기본값
  return 'casual';
}

// 가격대에 따른 DNA 조정
function adjustDnaByPrice(dna, priceRange) {
  const adjustedDna = { ...dna };
  
  switch(priceRange) {
    case '매우비싼':
      adjustedDna.instagramability = Math.min(5, adjustedDna.instagramability + 1);
      adjustedDna.dateSpot = Math.min(5, adjustedDna.dateSpot + 1);
      adjustedDna.soloFriendly = Math.max(1, adjustedDna.soloFriendly - 1);
      break;
    case '비싼':
      adjustedDna.dateSpot = Math.min(5, adjustedDna.dateSpot + 1);
      break;
    case '저렴한':
      adjustedDna.soloFriendly = Math.min(5, adjustedDna.soloFriendly + 1);
      adjustedDna.groupFriendly = Math.min(5, adjustedDna.groupFriendly + 1);
      adjustedDna.instagramability = Math.max(1, adjustedDna.instagramability - 1);
      break;
  }
  
  return adjustedDna;
}

// 지역에 따른 DNA 조정
function adjustDnaByLocation(dna, address) {
  const adjustedDna = { ...dna };
  const location = (address || '').toLowerCase();
  
  // 강남/청담/압구정 - 고급스럽고 인스타그래머블
  if (location.match(/강남|청담|압구정|신사|논현/)) {
    adjustedDna.instagramability = Math.min(5, adjustedDna.instagramability + 1);
    adjustedDna.dateSpot = Math.min(5, adjustedDna.dateSpot + 1);
  }
  
  // 홍대/합정/상수 - 힙하고 트렌디
  if (location.match(/홍대|합정|상수|연남|망원/)) {
    adjustedDna.soloFriendly = Math.min(5, adjustedDna.soloFriendly + 1);
    if (!dna.atmosphere.includes('힙한')) {
      adjustedDna.atmosphere = [...dna.atmosphere.slice(0, -1), '힙한'];
    }
  }
  
  // 종로/을지로 - 전통적이고 노포
  if (location.match(/종로|을지로|충무로|명동|인사동/)) {
    if (!dna.atmosphere.includes('전통적인')) {
      adjustedDna.atmosphere = [...dna.atmosphere.slice(0, -1), '전통적인'];
    }
    adjustedDna.groupFriendly = Math.min(5, adjustedDna.groupFriendly + 1);
  }
  
  // 이태원/해방촌 - 글로벌하고 실험적
  if (location.match(/이태원|해방촌|한남|녹사평/)) {
    if (!dna.foodStyle.includes('실험적인')) {
      adjustedDna.foodStyle = [...dna.foodStyle.slice(0, -1), '실험적인'];
    }
    adjustedDna.instagramability = Math.min(5, adjustedDna.instagramability + 1);
  }
  
  // 성수/뚝섬 - 핫플레이스
  if (location.match(/성수|뚝섬|서울숲/)) {
    adjustedDna.instagramability = Math.min(5, adjustedDna.instagramability + 1);
    adjustedDna.dateSpot = Math.min(5, adjustedDna.dateSpot + 1);
  }
  
  return adjustedDna;
}

async function updateRestaurantDNA() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://chonamwoo08:Whskadnr09!@cluster0.zdacm.mongodb.net/bobmap?retryWrites=true&w=majority');
    console.log('MongoDB 연결 성공');
    
    // 모든 레스토랑 조회
    const restaurants = await Restaurant.find({});
    console.log(`총 ${restaurants.length}개의 레스토랑 발견`);
    
    let updateCount = 0;
    
    for (const restaurant of restaurants) {
      // 카테고리별 DNA 프로필 선택
      const categoryProfiles = DNA_PROFILES[restaurant.category] || DNA_PROFILES['기타'];
      const style = determineRestaurantStyle(restaurant);
      
      // 해당 스타일의 DNA 프로필 가져오기
      let dnaProfile = categoryProfiles[style] || 
                       categoryProfiles.default || 
                       categoryProfiles[Object.keys(categoryProfiles)[0]];
      
      // 가격대에 따른 조정
      dnaProfile = adjustDnaByPrice(dnaProfile, restaurant.priceRange);
      
      // 지역에 따른 조정
      dnaProfile = adjustDnaByLocation(dnaProfile, restaurant.address);
      
      // 레스토랑 DNA 업데이트
      restaurant.dnaProfile = {
        atmosphere: dnaProfile.atmosphere,
        foodStyle: dnaProfile.foodStyle,
        instagramability: dnaProfile.instagramability,
        dateSpot: dnaProfile.dateSpot,
        groupFriendly: dnaProfile.groupFriendly,
        soloFriendly: dnaProfile.soloFriendly
      };
      
      await restaurant.save();
      updateCount++;
      
      console.log(`[${updateCount}/${restaurants.length}] "${restaurant.name}" DNA 업데이트 완료`);
      console.log(`  - 분위기: ${dnaProfile.atmosphere.join(', ')}`);
      console.log(`  - 스타일: ${dnaProfile.foodStyle.join(', ')}`);
      console.log(`  - 인스타: ${dnaProfile.instagramability}/5, 데이트: ${dnaProfile.dateSpot}/5`);
      console.log(`  - 단체: ${dnaProfile.groupFriendly}/5, 혼밥: ${dnaProfile.soloFriendly}/5`);
    }
    
    console.log(`\n✅ 완료! ${updateCount}개의 레스토랑 DNA가 업데이트되었습니다.`);
    
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB 연결 종료');
  }
}

// 스크립트 실행
updateRestaurantDNA();