// Test admin playlist update functionality
const axios = require('axios');

async function testAdminUpdate() {
  try {
    console.log('1. Fetching playlists...');
    const playlistsResponse = await axios.get('http://localhost:8888/api/playlists');
    const playlists = playlistsResponse.data.playlists || playlistsResponse.data;
    
    if (!playlists || playlists.length === 0) {
      console.log('No playlists found');
      return;
    }
    
    const testPlaylist = playlists[0];
    console.log(`\n2. Testing update on playlist: "${testPlaylist.title}"`);
    console.log(`   Current restaurants: ${testPlaylist.restaurants?.length || 0}`);
    
    // Prepare update data
    const updateData = {
      title: testPlaylist.title + ' (Admin 수정됨)',
      description: testPlaylist.description + ' - Admin에서 수정한 내용',
      isPublic: true,
      restaurants: testPlaylist.restaurants || []
    };
    
    // Add a test restaurant if needed
    if (!updateData.restaurants.length) {
      updateData.restaurants.push({
        restaurant: {
          name: 'Admin 테스트 레스토랑',
          address: '서울 강남구 테스트동 123',
          category: '한식'
        },
        order: 0
      });
    }
    
    console.log('\n3. Sending update request...');
    const updateResponse = await axios.put(
      `http://localhost:8888/api/admin/playlists/${testPlaylist._id}`,
      updateData,
      {
        headers: {
          'X-Admin-Auth': 'true'
        }
      }
    );
    
    console.log('\n4. Update successful!');
    console.log(`   New title: ${updateResponse.data.title}`);
    console.log(`   Restaurant count: ${updateResponse.data.restaurantCount}`);
    
    // Verify the update
    console.log('\n5. Verifying update...');
    const verifyResponse = await axios.get(`http://localhost:8888/api/playlists/${testPlaylist._id}`);
    console.log(`   Verified title: ${verifyResponse.data.title}`);
    console.log(`   Update confirmed: ${verifyResponse.data.title.includes('Admin 수정됨')}`);
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

testAdminUpdate();