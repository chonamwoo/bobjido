const mongoose = require('mongoose');
require('dotenv').config();

const playlistsData = [
  {
    title: '강남 데이트 코스 맛집 10선',
    description: '특별한 날, 특별한 사람과 함께하기 좋은 강남의 분위기 좋은 레스토랑',
    category: '데이트코스',
    tags: ['데이트', '강남', '분위기', '로맨틱'],
    isPublic: true,
    likeCount: 234,
    saveCount: 567,
    viewCount: 3456
  },
  {
    title: '혼밥하기 좋은 맛집 모음',
    description: '혼자서도 편하게 즐길 수 있는 1인 친화적인 맛집들',
    category: '혼밥',
    tags: ['혼밥', '1인', '편한', '카운터석'],
    isPublic: true,
    likeCount: 456,
    saveCount: 890,
    viewCount: 5678
  },
  {
    title: '서울 가성비 맛집 TOP 20',
    description: '맛과 가격 모두 만족! 가성비 최고의 맛집 리스트',
    category: '맛집투어',
    tags: ['가성비', '저렴한', '푸짐한', '학생'],
    isPublic: true,
    likeCount: 789,
    saveCount: 1234,
    viewCount: 8901
  },
  {
    title: '인스타 감성 디저트 카페',
    description: '사진 찍기 좋고 맛도 좋은 디저트 카페 모음',
    category: '카페투어',
    tags: ['디저트', '카페', '인스타', '케이크'],
    isPublic: true,
    likeCount: 567,
    saveCount: 901,
    viewCount: 4567
  },
  {
    title: '금요일 밤 술집 추천',
    description: '한 주를 마무리하며 한잔하기 좋은 분위기 있는 술집',
    category: '친구모임',
    tags: ['술집', '바', '칵테일', '와인'],
    isPublic: true,
    likeCount: 345,
    saveCount: 678,
    viewCount: 3456
  },
  {
    title: '비건/채식 맛집 가이드',
    description: '건강하고 맛있는 비건, 채식 레스토랑 모음',
    category: '기타',
    tags: ['비건', '채식', '건강식', '샐러드'],
    isPublic: true,
    likeCount: 234,
    saveCount: 456,
    viewCount: 2345
  },
  {
    title: '브런치 맛집 컬렉션',
    description: '주말 늦은 아침을 특별하게 만들어줄 브런치 레스토랑',
    category: '카페투어',
    tags: ['브런치', '팬케이크', '에그베네딕트', '주말'],
    isPublic: true,
    likeCount: 456,
    saveCount: 789,
    viewCount: 4567
  },
  {
    title: '야식 맛집 리스트',
    description: '늦은 시간까지 영업하는 야식 맛집 모음',
    category: '맛집투어',
    tags: ['야식', '24시간', '심야', '배달'],
    isPublic: true,
    likeCount: 678,
    saveCount: 1012,
    viewCount: 6789
  },
  {
    title: '강남 맛집 완전정복',
    description: '강남 지역 카테고리별 맛집 총정리',
    category: '맛집투어',
    tags: ['강남', '지역맛집', '회식', '모임'],
    isPublic: true,
    likeCount: 890,
    saveCount: 1345,
    viewCount: 9012
  },
  {
    title: '홍대 맛집 지도',
    description: '홍대, 연남동, 상수 일대 핫플레이스',
    category: '맛집투어',
    tags: ['홍대', '연남동', '힙한', '젊은'],
    isPublic: true,
    likeCount: 567,
    saveCount: 890,
    viewCount: 5678
  }
];

async function createPlaylists() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB 연결 성공');

    const Playlist = require('./server/models/Playlist');
    const User = require('./server/models/User');

    // 시스템 사용자 찾기
    const systemUser = await User.findOne({ username: 'system' });
    if (!systemUser) {
      console.error('❌ 시스템 사용자를 찾을 수 없습니다. seed-playlist-restaurants.js를 먼저 실행하세요.');
      process.exit(1);
    }

    console.log('🗑️ 기존 플레이리스트 삭제 중...');
    await Playlist.deleteMany({});

    console.log('📋 새 플레이리스트 생성 중...');
    
    for (const playlistData of playlistsData) {
      const playlist = await Playlist.create({
        ...playlistData,
        createdBy: systemUser._id,
        restaurants: [], // 나중에 채워질 예정
        restaurantCount: 0
      });
      console.log(`  ✅ "${playlist.title}" 생성 완료`);
    }

    console.log(`\n✅ ${playlistsData.length}개의 플레이리스트 생성 완료!`);
    process.exit(0);

  } catch (error) {
    console.error('❌ 오류 발생:', error);
    process.exit(1);
  }
}

createPlaylists();