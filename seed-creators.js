const mongoose = require('mongoose');
const User = require('./server/models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// 크리에이터 계정 데이터
const creators = [
  {
    userId: 'blackwhitechef',
    username: '흑백요리사',
    email: 'blackwhite@bobmap.com',
    password: 'creator123!@#',
    bio: '넷플릭스 흑백요리사 출연 셰프들의 맛집을 소개합니다',
    profileImage: 'https://ui-avatars.com/api/?name=흑백요리사&size=150&background=FF6B6B&color=fff&rounded=true&bold=true',
    isVerified: true,
    verificationNote: '공식 인증 크리에이터',
    location: '서울',
    tasteProfile: {
      spicyLevel: 4,
      sweetLevel: 3,
      preferredCategories: ['한식', '양식', '일식'],
      dietaryRestrictions: [],
      preferredPriceRange: '비싼',
      adventureLevel: 5,
      socialDining: true,
      preferredAtmosphere: ['고급스러운', '조용한']
    }
  },
  {
    userId: 'wednesdayfood',
    username: '수요미식회',
    email: 'wednesday@bobmap.com',
    password: 'creator123!@#',
    bio: 'tvN 수요미식회 방송 맛집을 큐레이션합니다',
    profileImage: 'https://ui-avatars.com/api/?name=수요미식회&size=150&background=4ECDC4&color=fff&rounded=true&bold=true',
    isVerified: true,
    verificationNote: '공식 인증 크리에이터',
    location: '서울',
    tasteProfile: {
      spicyLevel: 3,
      sweetLevel: 3,
      preferredCategories: ['한식', '중식', '일식'],
      dietaryRestrictions: [],
      preferredPriceRange: '매우비싼',
      adventureLevel: 4,
      socialDining: true,
      preferredAtmosphere: ['전통적인', '고급스러운']
    }
  },
  {
    userId: 'hongseokcheon',
    username: '홍석천',
    email: 'hongseokcheon@bobmap.com',
    password: 'creator123!@#',
    bio: '이태원 맛집의 대가, 홍석천이 추천하는 진짜 맛집',
    profileImage: 'https://ui-avatars.com/api/?name=홍석천&size=150&background=FFD93D&color=333&rounded=true&bold=true',
    isVerified: true,
    verificationNote: '공식 인증 크리에이터',
    location: '서울 이태원',
    tasteProfile: {
      spicyLevel: 3,
      sweetLevel: 4,
      preferredCategories: ['양식', '기타', '카페'],
      dietaryRestrictions: [],
      preferredPriceRange: '비싼',
      adventureLevel: 5,
      socialDining: true,
      preferredAtmosphere: ['이국적인', '활기찬']
    }
  },
  {
    userId: 'mukbangyoutuber',
    username: '먹방유튜버',
    email: 'mukbang@bobmap.com',
    password: 'creator123!@#',
    bio: '구독자 100만 먹방 유튜버가 인정한 진짜 맛집',
    profileImage: 'https://ui-avatars.com/api/?name=먹방유튜버&size=150&background=FF0066&color=fff&rounded=true&bold=true',
    isVerified: true,
    verificationNote: '공식 인증 크리에이터',
    location: '서울',
    tasteProfile: {
      spicyLevel: 5,
      sweetLevel: 4,
      preferredCategories: ['한식', '패스트푸드', '주점'],
      dietaryRestrictions: [],
      preferredPriceRange: '보통',
      adventureLevel: 5,
      socialDining: false,
      preferredAtmosphere: ['캐주얼', '활기찬']
    }
  },
  {
    userId: 'baekjongwon',
    username: '백종원',
    email: 'baekjongwon@bobmap.com',
    password: 'creator123!@#',
    bio: '대한민국 외식업의 대부, 백종원의 맛집 추천',
    profileImage: 'https://ui-avatars.com/api/?name=백종원&size=150&background=6C5CE7&color=fff&rounded=true&bold=true',
    isVerified: true,
    verificationNote: '공식 인증 크리에이터',
    location: '서울',
    tasteProfile: {
      spicyLevel: 4,
      sweetLevel: 3,
      preferredCategories: ['한식', '중식', '일식', '양식'],
      dietaryRestrictions: [],
      preferredPriceRange: '보통',
      adventureLevel: 4,
      socialDining: true,
      preferredAtmosphere: ['전통적인', '캐주얼']
    }
  },
  {
    userId: 'michelinguide',
    username: '미슐랭가이드',
    email: 'michelin@bobmap.com',
    password: 'creator123!@#',
    bio: '미슐랭 가이드가 선정한 최고의 레스토랑',
    profileImage: 'https://ui-avatars.com/api/?name=미슐랭&size=150&background=FF1744&color=fff&rounded=true&bold=true',
    isVerified: true,
    verificationNote: '공식 인증 크리에이터',
    location: '서울',
    tasteProfile: {
      spicyLevel: 3,
      sweetLevel: 3,
      preferredCategories: ['양식', '일식', '한식'],
      dietaryRestrictions: [],
      preferredPriceRange: '매우비싼',
      adventureLevel: 3,
      socialDining: true,
      preferredAtmosphere: ['고급스러운', '조용한']
    }
  }
];

async function seedCreators() {
  try {
    // MongoDB 연결
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bobmap');
    console.log('📌 MongoDB 연결 성공');

    // 기존 크리에이터 확인
    for (const creatorData of creators) {
      const existingUser = await User.findOne({ 
        $or: [
          { userId: creatorData.userId },
          { username: creatorData.username },
          { email: creatorData.email }
        ]
      });

      if (existingUser) {
        console.log(`✅ 크리에이터 이미 존재: ${creatorData.username}`);
        
        // 업데이트가 필요한 경우
        if (!existingUser.isVerified || !existingUser.bio) {
          existingUser.isVerified = true;
          existingUser.verificationNote = creatorData.verificationNote;
          existingUser.bio = creatorData.bio;
          existingUser.profileImage = creatorData.profileImage;
          existingUser.location = creatorData.location;
          existingUser.tasteProfile = creatorData.tasteProfile;
          await existingUser.save();
          console.log(`   📝 크리에이터 정보 업데이트: ${creatorData.username}`);
        }
        continue;
      }

      // 비밀번호 해시
      const hashedPassword = await bcrypt.hash(creatorData.password, 10);

      // 새 크리에이터 생성
      const newCreator = new User({
        ...creatorData,
        password: hashedPassword,
        verifiedAt: new Date(),
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // 랜덤 가입일
        followers: [],
        following: [],
        visitedRestaurants: [],
        savedRestaurants: [],
        savedPlaylists: [],
        categoryVisitCounts: {
          '한식': Math.floor(Math.random() * 50) + 10,
          '일식': Math.floor(Math.random() * 30) + 5,
          '중식': Math.floor(Math.random() * 25) + 5,
          '양식': Math.floor(Math.random() * 35) + 10,
          '카페': Math.floor(Math.random() * 40) + 15,
          '주점': Math.floor(Math.random() * 20) + 5
        },
        trustScore: Math.floor(Math.random() * 20) + 80, // 80-100 사이
        foodMBTIType: 'ENFJ'
      });

      await newCreator.save();
      console.log(`🎉 새 크리에이터 생성: ${creatorData.username}`);
    }

    console.log('\n✨ 모든 크리에이터 계정 생성/업데이트 완료!');
    
    // 생성된 크리에이터 목록 확인
    const allCreators = await User.find({ isVerified: true }).select('username email isVerified createdAt');
    console.log('\n📋 인증된 크리에이터 목록:');
    allCreators.forEach(creator => {
      console.log(`   - ${creator.username} (가입일: ${creator.createdAt.toLocaleDateString('ko-KR')})`);
    });

  } catch (error) {
    console.error('❌ 크리에이터 생성 중 오류:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n📴 MongoDB 연결 종료');
  }
}

// 스크립트 실행
seedCreators();