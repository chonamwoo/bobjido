require('dotenv').config();
const mongoose = require('mongoose');
const Playlist = require('./server/models/Playlist');

// 다양한 플레이리스트 커버 이미지
const COVER_IMAGES = {
  // 한식 관련
  korean: [
    'https://images.unsplash.com/photo-1583224994076-ae951d019af7?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1580651315530-69c333cf5d4f?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=800&h=600&fit=crop&q=85',
  ],
  
  // 일식 관련
  japanese: [
    'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&h=600&fit=crop&q=85',
  ],
  
  // 중식 관련
  chinese: [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&h=600&fit=crop&q=85',
  ],
  
  // 양식 관련
  western: [
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop&q=85',
  ],
  
  // 카페/디저트
  cafe: [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1559305616-3f99cd43e353?w=800&h=600&fit=crop&q=85',
  ],
  
  // 분위기/데이트
  mood: [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&h=600&fit=crop&q=85',
  ],
  
  // 동남아/아시안
  asian: [
    'https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1582576163090-09d3b5bf7fdf?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&h=600&fit=crop&q=85',
  ],
  
  // 스트리트푸드
  street: [
    'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=800&h=600&fit=crop&q=85',
    'https://images.unsplash.com/photo-1565123409695-7b5ef63a2efb?w=800&h=600&fit=crop&q=85',
  ]
};

function determineCategory(playlist) {
  const title = (playlist.title || '').toLowerCase();
  const description = (playlist.description || '').toLowerCase();
  const category = (playlist.category || '').toLowerCase();
  const tags = (playlist.tags || []).join(' ').toLowerCase();
  const combined = `${title} ${description} ${category} ${tags}`;
  
  if (combined.match(/한식|한국|김치|된장|불고기|갈비|삼겹|전통/)) return 'korean';
  if (combined.match(/일식|일본|스시|라멘|초밥|사시미|우동|돈카츠/)) return 'japanese';
  if (combined.match(/중식|중국|짜장|짬뽕|탕수육|마라|딤섬|볶음밥/)) return 'chinese';
  if (combined.match(/양식|이태리|이탈리|파스타|피자|스테이크|버거|브런치/)) return 'western';
  if (combined.match(/카페|커피|디저트|케이크|베이커리|빵|아이스크림/)) return 'cafe';
  if (combined.match(/동남아|베트남|태국|인도|쌀국수|팟타이|커리|아시아/)) return 'asian';
  if (combined.match(/분식|길거리|포차|꼬치|튀김|떡볶이|순대|김밥/)) return 'street';
  if (combined.match(/데이트|로맨틱|분위기|뷰|루프탑|오션뷰|야경|와인/)) return 'mood';
  
  return 'mood';
}

function getUniqueImage(playlist, usedImages) {
  const category = determineCategory(playlist);
  const categoryImages = COVER_IMAGES[category];
  
  // 사용하지 않은 이미지 찾기
  const availableImages = categoryImages.filter(img => !usedImages.has(img));
  
  if (availableImages.length > 0) {
    // 플레이리스트 ID 기반으로 일관된 선택
    let hash = 0;
    const idString = playlist._id.toString();
    for (let i = 0; i < idString.length; i++) {
      hash = ((hash << 5) - hash) + idString.charCodeAt(i);
      hash = hash & hash;
    }
    const index = Math.abs(hash) % availableImages.length;
    return availableImages[index];
  }
  
  // 모든 이미지가 사용된 경우 랜덤 선택
  return categoryImages[Math.floor(Math.random() * categoryImages.length)];
}

async function updatePlaylistCoverImages() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://chonamwoo08:Whskadnr09!@cluster0.zdacm.mongodb.net/bobmap?retryWrites=true&w=majority');
    console.log('MongoDB 연결 성공');
    
    // 모든 플레이리스트 조회
    const playlists = await Playlist.find({});
    console.log(`총 ${playlists.length}개의 플레이리스트 발견`);
    
    const usedImages = new Set();
    let updateCount = 0;
    
    for (const playlist of playlists) {
      // 이미 커버 이미지가 있으면 건너뛰기
      if (playlist.coverImage && !playlist.coverImage.includes('placeholder')) {
        console.log(`플레이리스트 "${playlist.title}" - 이미 커버 이미지 있음`);
        usedImages.add(playlist.coverImage);
        continue;
      }
      
      // 고유한 이미지 선택
      const newImage = getUniqueImage(playlist, usedImages);
      usedImages.add(newImage);
      
      // 업데이트
      playlist.coverImage = newImage;
      await playlist.save();
      
      updateCount++;
      console.log(`플레이리스트 "${playlist.title}" - 커버 이미지 업데이트: ${newImage}`);
    }
    
    console.log(`\n✅ 완료! ${updateCount}개의 플레이리스트 커버 이미지가 업데이트되었습니다.`);
    
  } catch (error) {
    console.error('오류 발생:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB 연결 종료');
  }
}

// 스크립트 실행
updatePlaylistCoverImages();