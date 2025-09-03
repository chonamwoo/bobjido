require('dotenv').config({ path: './server/.env' });
const mongoose = require('mongoose');

async function createTestbobPlaylist() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bobmap');
    console.log('✅ MongoDB 연결 성공\n');
    
    const Playlist = require('./server/models/Playlist');
    const User = require('./server/models/User');
    
    // testbob 사용자 찾기
    const testbob = await User.findOne({ userId: 'testbob' });
    if (!testbob) {
      console.log('❌ testbob 사용자를 찾을 수 없습니다');
      process.exit(1);
    }
    
    console.log(`✅ testbob 사용자 찾음: ${testbob.username} (${testbob._id})`);
    
    // 플레이리스트 생성
    const newPlaylists = [
      {
        title: '평냉 맛집 리스트',
        description: '평양냉면 맛있는 곳 모음',
        category: '맛집투어',
        tags: ['냉면', '평양냉면', '맛집'],
        isPublic: true,
        isActive: true,
        createdBy: testbob._id,
        restaurants: [],
        region: {
          city: '서울특별시',
          district: '강남구'
        }
      },
      {
        title: '강남 회식 장소 추천',
        description: '회사 회식하기 좋은 강남 맛집',
        category: '회식',
        tags: ['회식', '강남', '술집'],
        isPublic: true,
        isActive: true,
        createdBy: testbob._id,
        restaurants: [],
        region: {
          city: '서울특별시',
          district: '강남구'
        }
      }
    ];
    
    for (const playlistData of newPlaylists) {
      const playlist = new Playlist(playlistData);
      await playlist.save();
      console.log(`✅ 플레이리스트 생성: ${playlist.title}`);
    }
    
    console.log('\n✨ testbob(냉며니)의 플레이리스트가 생성되었습니다!');
    
    // 확인
    const testbobPlaylists = await Playlist.find({ createdBy: testbob._id });
    console.log(`\n총 ${testbobPlaylists.length}개의 플레이리스트가 생성됨`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 오류 발생:', error.message);
    process.exit(1);
  }
}

createTestbobPlaylist();