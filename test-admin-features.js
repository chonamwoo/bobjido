// Test admin features with proper authentication
const axios = require('axios');

async function testAdminFeatures() {
  const adminHeaders = {
    'X-Admin-Auth': 'true'
  };

  try {
    console.log('=== Admin Feature Test ===\n');
    
    // 1. Get all playlists
    console.log('1. Fetching all playlists...');
    const playlistsRes = await axios.get('http://localhost:8888/api/playlists');
    const playlists = playlistsRes.data.playlists || playlistsRes.data;
    console.log(`   Found ${playlists.length} playlists`);
    
    if (playlists.length === 0) {
      console.log('No playlists to test');
      return;
    }
    
    const testPlaylist = playlists[0];
    console.log(`   Testing with: "${testPlaylist.title}"`);
    
    // 2. Test editing without auth (should fail)
    console.log('\n2. Testing edit WITHOUT admin auth...');
    try {
      await axios.put(
        `http://localhost:8888/api/admin/playlists/${testPlaylist._id}`,
        { title: 'Unauthorized Edit' }
      );
      console.log('   ❌ SECURITY ISSUE: Edit succeeded without auth!');
    } catch (err) {
      console.log('   ✅ Edit correctly blocked without auth');
    }
    
    // 3. Test editing WITH auth
    console.log('\n3. Testing edit WITH admin auth...');
    const originalTitle = testPlaylist.title;
    const newTitle = originalTitle + ' (Admin Test)';
    
    try {
      const editRes = await axios.put(
        `http://localhost:8888/api/admin/playlists/${testPlaylist._id}`,
        {
          title: newTitle,
          description: testPlaylist.description,
          isPublic: testPlaylist.isPublic,
          restaurants: testPlaylist.restaurants || []
        },
        { headers: adminHeaders }
      );
      console.log('   ✅ Edit successful with auth');
      console.log(`   New title: "${editRes.data.title}"`);
    } catch (err) {
      console.log('   ❌ Edit failed:', err.response?.data?.message || err.message);
    }
    
    // 4. Test restaurant search
    console.log('\n4. Testing restaurant search...');
    try {
      const searchRes = await axios.get(
        'http://localhost:8888/api/admin/restaurants/search?query=스시',
        { headers: adminHeaders }
      );
      console.log(`   ✅ Found ${searchRes.data.length} restaurants`);
      if (searchRes.data.length > 0) {
        console.log(`   First result: ${searchRes.data[0].name}`);
      }
    } catch (err) {
      console.log('   ❌ Search failed:', err.response?.data?.message || err.message);
    }
    
    // 5. Restore original title
    console.log('\n5. Restoring original title...');
    try {
      await axios.put(
        `http://localhost:8888/api/admin/playlists/${testPlaylist._id}`,
        {
          title: originalTitle,
          description: testPlaylist.description,
          isPublic: testPlaylist.isPublic,
          restaurants: testPlaylist.restaurants || []
        },
        { headers: adminHeaders }
      );
      console.log('   ✅ Original title restored');
    } catch (err) {
      console.log('   ❌ Restore failed:', err.message);
    }
    
    console.log('\n=== Test Complete ===');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAdminFeatures();