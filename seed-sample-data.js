const mongoose = require('mongoose');
const User = require('./server/models/User');
const Restaurant = require('./server/models/Restaurant');
const Playlist = require('./server/models/Playlist');
const bcrypt = require('bcryptjs');

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/bobmap', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('🌱 샘플 데이터 생성 시작...');

    // 테스트 사용자 생성
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // 기존 사용자 확인
    let testUser = await User.findOne({ email: 'test@bobmap.com' });
    
    if (!testUser) {
      testUser = new User({
        username: 'testuser' + Date.now(), // 유니크한 username
        email: 'test@bobmap.com',
        password: hashedPassword,
        profileImage: 'https://ui-avatars.com/api/?name=Test+User&background=FF6B35&color=fff',
        bio: '맛집 탐험가 🍴',
        tasteProfile: {
          spicyLevel: 3,
          sweetLevel: 2,
          priceRange: 'moderate',
          atmosphere: ['cozy', 'trendy'],
          dietaryRestrictions: [],
        }
      });
      await testUser.save();
    }

    console.log('✅ 테스트 사용자 생성 완료');

    // 샘플 레스토랑 생성
    const restaurants = [
      {
        name: '성수 감자탕',
        address: '서울 성동구 성수동 123-45',
        coordinates: { lat: 37.5444, lng: 127.0557 },
        category: '한식',
        priceRange: '보통',
        averageRating: 4.5,
        reviewCount: 128,
        tags: ['감자탕', '뼈해장국', '24시간'],
        viewCount: 1523,
        createdBy: testUser._id,
      },
      {
        name: '홍대 피자',
        address: '서울 마포구 홍대 456-78',
        coordinates: { lat: 37.5563, lng: 126.9238 },
        category: '양식',
        priceRange: '비싼',
        averageRating: 4.2,
        reviewCount: 89,
        tags: ['수제피자', '화덕피자', '파스타'],
        viewCount: 892,
        createdBy: testUser._id,
      },
      {
        name: '강남 초밥',
        address: '서울 강남구 역삼동 789-12',
        coordinates: { lat: 37.5012, lng: 127.0396 },
        category: '일식',
        priceRange: '매우비싼',
        averageRating: 4.8,
        reviewCount: 256,
        tags: ['오마카세', '초밥', '사시미'],
        viewCount: 3421,
        createdBy: testUser._id,
      },
    ];

    const savedRestaurants = [];
    for (const restaurantData of restaurants) {
      const restaurant = await Restaurant.findOneAndUpdate(
        { name: restaurantData.name },
        restaurantData,
        { upsert: true, new: true }
      );
      savedRestaurants.push(restaurant);
    }

    console.log('✅ 샘플 레스토랑 생성 완료');

    // 샘플 플레이리스트 생성
    const playlists = [
      {
        title: '성수동 맛집 투어',
        description: '성수동 핫플레이스 맛집 모음',
        category: '맛집투어',
        createdBy: testUser._id,
        restaurants: savedRestaurants.slice(0, 2).map((r, index) => ({
          restaurant: r._id,
          order: index + 1,
          personalNote: '꼭 가봐야 할 맛집!',
          addedBy: testUser._id,
        })),
        tags: ['성수동', '핫플레이스', '데이트'],
        viewCount: 523,
        isPublic: true,
        likes: [{ user: testUser._id }],
        saves: [{ user: testUser._id }],
      },
      {
        title: '혼밥하기 좋은 곳',
        description: '혼자 편하게 먹을 수 있는 맛집',
        category: '혼밥',
        createdBy: testUser._id,
        restaurants: savedRestaurants.map((r, index) => ({
          restaurant: r._id,
          order: index + 1,
          personalNote: '혼밥 추천!',
          addedBy: testUser._id,
        })),
        tags: ['혼밥', '편한곳', '1인석'],
        viewCount: 892,
        isPublic: true,
      },
      {
        title: '데이트 코스 추천',
        description: '분위기 좋은 데이트 맛집',
        category: '데이트코스',
        createdBy: testUser._id,
        restaurants: savedRestaurants.slice(1).map((r, index) => ({
          restaurant: r._id,
          order: index + 1,
          personalNote: '데이트하기 좋아요',
          addedBy: testUser._id,
        })),
        tags: ['데이트', '분위기좋은', '기념일'],
        viewCount: 1234,
        isPublic: true,
        likes: [{ user: testUser._id }],
      },
    ];

    for (const playlistData of playlists) {
      await Playlist.findOneAndUpdate(
        { title: playlistData.title },
        playlistData,
        { upsert: true, new: true }
      );
    }

    console.log('✅ 샘플 플레이리스트 생성 완료');

    console.log('\n🎉 모든 샘플 데이터 생성 완료!');
    console.log('\n📝 테스트 계정:');
    console.log('Email: test@bobmap.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ 에러 발생:', error);
    process.exit(1);
  }
};

seedData();