const axios = require('axios');

const API_URL = 'http://localhost:8890/api';

async function testPlaylistCreation() {
  try {
    // 1. 로그인
    console.log('1. 로그인 시도...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      loginId: 'testbob',
      password: 'admin123'
    });
    
    const token = loginRes.data.data.token;
    const user = loginRes.data.data;
    console.log(`✅ 로그인 성공: ${user.username} (${user.userId})`);
    console.log(`   토큰: ${token.substring(0, 20)}...`);
    
    // 2. 플레이리스트 생성
    console.log('\n2. 플레이리스트 생성 시도...');
    const playlistData = {
      title: '테스트 플레이리스트 ' + new Date().toLocaleTimeString('ko-KR'),
      description: '코드로 생성한 테스트 플레이리스트',
      category: '맛집투어',
      tags: ['테스트', 'API테스트'],
      isPublic: true,
      restaurants: []
    };
    
    const createRes = await axios.post(
      `${API_URL}/playlists`,
      playlistData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('✅ 플레이리스트 생성 성공!');
    console.log(`   ID: ${createRes.data._id}`);
    console.log(`   제목: ${createRes.data.title}`);
    console.log(`   생성자: ${createRes.data.createdBy.username}`);
    console.log(`   공개여부: ${createRes.data.isPublic}`);
    
    // 3. 생성된 플레이리스트 확인
    console.log('\n3. 플레이리스트 목록 확인...');
    const listRes = await axios.get(`${API_URL}/playlists`);
    console.log(`✅ 전체 플레이리스트 수: ${listRes.data.pagination.total}`);
    
    const myPlaylist = listRes.data.playlists.find(p => p._id === createRes.data._id);
    if (myPlaylist) {
      console.log('   ✅ 방금 생성한 플레이리스트가 목록에 표시됨!');
    } else {
      console.log('   ❌ 방금 생성한 플레이리스트가 목록에 없음');
    }
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.response?.data || error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

testPlaylistCreation();