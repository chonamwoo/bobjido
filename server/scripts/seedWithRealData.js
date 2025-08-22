const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { realSeoulRestaurants } = require('./realRestaurantData');
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Playlist = require('../models/Playlist');

async function seedDatabase() {
  try {
    // MongoDB 연결
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/bobmap';
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB 연결 성공:', mongoUri.includes('mongodb.net') ? 'MongoDB Atlas' : 'Local MongoDB');

    // 기존 데이터 삭제 및 인덱스 초기화
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Playlist.deleteMany({});
    
    // 기존 인덱스 삭제 (2dsphere 인덱스 문제 해결)
    try {
      await Restaurant.collection.dropIndexes();
      console.log('✅ 기존 인덱스 삭제 완료');
    } catch (error) {
      console.log('⚠️ 인덱스 삭제 실패 (무시 가능):', error.message);
    }
    
    console.log('✅ 기존 데이터 삭제 완료');

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
    console.log('✅ Bob 사용자 생성 완료 (whskadn73@gmail.com)');

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
    console.log('✅ 추가 사용자 생성 완료');

    // 3. 실제 서울 유명 맛집 데이터 저장
    console.log('🍽️ 실제 서울 유명 맛집 데이터 저장 시작...');
    
    const restaurantsWithCreator = realSeoulRestaurants.map(restaurant => ({
      ...restaurant,
      createdBy: bobUser._id // 모든 레스토랑을 Bob이 등록한 것으로 설정
    }));

    const savedRestaurants = await Restaurant.insertMany(restaurantsWithCreator);
    console.log(`✅ 총 ${savedRestaurants.length}개 실제 맛집 데이터 저장 완료`);

    // 4. Bob의 큐레이션 플레이리스트 생성
    const playlists = [
      {
        title: '서울 미슐랭 & 파인다이닝 베스트',
        description: '미슐랭 스타 맛집부터 최고급 레스토랑까지',
        category: '맛집투어',
        targetAudience: ['30대', '직장인'],
        restaurants: savedRestaurants.slice(7, 10).map(r => r._id) // 밍글스, 봉피양 등
      },
      {
        title: '전통 맛집 투어 코스',
        description: '오래된 역사와 전통을 자랑하는 서울 맛집들',
        category: '맛집투어',
        targetAudience: ['20대', '30대'],
        restaurants: savedRestaurants.slice(0, 5).map(r => r._id) // 명동교자, 을지면옥 등
      },
      {
        title: '홍대 & 대학로 맛집 탐방',
        description: '젊은이들이 사랑하는 홍대와 대학로의 인기 맛집',
        category: '데이트코스',
        targetAudience: ['20대', '학생'],
        restaurants: savedRestaurants.slice(5, 8).map(r => r._id) // 학림다방, 오니기리와이프 등
      },
      {
        title: '명동 & 중구 맛집 완주 코스',
        description: '서울 중심가 명동과 중구의 필수 맛집들',
        category: '회식',
        targetAudience: ['직장인', '30대'],
        restaurants: savedRestaurants.slice(2, 6).map(r => r._id) // 진진, 삼원가든 등
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
        viewCount: Math.floor(Math.random() * 500) + 100,
        commentCount: 0,
        isActive: true,
        isFeatured: false
      });
    }
    console.log('✅ Bob의 큐레이션 플레이리스트 생성 완료');

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
        viewCount: Math.floor(Math.random() * 100) + 20,
        commentCount: 0,
        isActive: true,
        isFeatured: false
      });
    }
    console.log('✅ 다른 사용자 플레이리스트 생성 완료');

    // 6. 팔로우 관계 설정
    bobUser.followers = createdUsers.map(u => u._id);
    await bobUser.save();
    
    for (const user of createdUsers) {
      user.following.push(bobUser._id);
      await user.save();
    }
    console.log('✅ 팔로우 관계 설정 완료');

    console.log('\n=== 🎉 BobMap 시딩 완료 ===');
    console.log('📧 Bob 계정: whskadn73@gmail.com / bob123456');
    console.log(`🍽️  총 ${realSeoulRestaurants.length}개 실제 서울 유명 맛집 등록`);
    console.log(`📋 총 ${playlists.length}개 Bob의 큐레이션 플레이리스트 생성`);
    console.log(`👥 총 ${createdUsers.length + 1}명 사용자 생성`);
    console.log('\n🚀 이제 npm run dev로 앱을 실행하고 Bob 계정으로 로그인해보세요!');
    
    // 맛집 정보 요약 출력
    console.log('\n📍 등록된 실제 맛집 목록:');
    realSeoulRestaurants.forEach((restaurant, index) => {
      console.log(`${index + 1}. ${restaurant.name} (${restaurant.category}) - ${restaurant.address}`);
      console.log(`   ⭐ ${restaurant.averageRating} | 📞 ${restaurant.phoneNumber} | 💰 ${restaurant.priceRange}`);
      console.log(`   🔗 ${restaurant.externalReviewUrl}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 시딩 실패:', error);
    process.exit(1);
  }
}

// 스크립트 실행
seedDatabase();