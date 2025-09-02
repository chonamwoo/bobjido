// Verify admin update functionality
const axios = require('axios');

async function verifyUpdate() {
  const playlistId = '68ae2575def51d1a4fbe348d';
  
  try {
    // 1. Get current state
    console.log('1. Current playlist state:');
    let res = await axios.get(`http://localhost:8888/api/playlists/${playlistId}`);
    console.log(`   Title: "${res.data.title || res.data.name}"`);
    console.log(`   Description: "${res.data.description}"`);
    
    // 2. Update to remove "(Admin 수정됨)"
    console.log('\n2. Updating playlist title...');
    const newTitle = '맛있는 녀석들 서울 투어';
    
    await axios.put(
      `http://localhost:8888/api/admin/playlists/${playlistId}`,
      {
        title: newTitle,
        name: newTitle,
        description: '맛있는 녀석들이 다녀간 서울 맛집',
        isPublic: true
      },
      {
        headers: { 'X-Admin-Auth': 'true' }
      }
    );
    
    // 3. Verify update
    console.log('\n3. After update:');
    res = await axios.get(`http://localhost:8888/api/playlists/${playlistId}`);
    console.log(`   Title: "${res.data.title || res.data.name}"`);
    console.log(`   Description: "${res.data.description}"`);
    console.log(`   ✅ Update successful!`);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

verifyUpdate();