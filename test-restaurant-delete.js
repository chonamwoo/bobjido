// Test deleting restaurants from playlist
const axios = require('axios');

async function testRestaurantDelete() {
  const adminHeaders = { 'X-Admin-Auth': 'true' };
  const playlistId = '68ae2575def51d1a4fbe348d';
  
  try {
    console.log('1. Getting current playlist...');
    let res = await axios.get(`http://localhost:8888/api/playlists/${playlistId}`);
    const originalCount = res.data.restaurants?.length || 0;
    console.log(`   Current restaurant count: ${originalCount}`);
    
    if (originalCount === 0) {
      console.log('   No restaurants to delete');
      return;
    }
    
    // Remove first restaurant
    console.log('\n2. Removing first restaurant...');
    const updatedRestaurants = res.data.restaurants.slice(1);
    
    const updateRes = await axios.put(
      `http://localhost:8888/api/admin/playlists/${playlistId}`,
      {
        title: res.data.title || res.data.name,
        description: res.data.description,
        isPublic: res.data.isPublic,
        restaurants: updatedRestaurants
      },
      { headers: adminHeaders }
    );
    
    console.log(`   ✅ Update successful`);
    console.log(`   New restaurant count: ${updateRes.data.restaurantCount}`);
    
    // Test empty array
    console.log('\n3. Testing with empty restaurant array...');
    const emptyRes = await axios.put(
      `http://localhost:8888/api/admin/playlists/${playlistId}`,
      {
        title: res.data.title || res.data.name,
        description: res.data.description,
        isPublic: res.data.isPublic,
        restaurants: []
      },
      { headers: adminHeaders }
    );
    
    console.log(`   ✅ Empty update successful`);
    console.log(`   Restaurant count: ${emptyRes.data.restaurantCount}`);
    
    // Restore original
    console.log('\n4. Restoring original restaurants...');
    await axios.put(
      `http://localhost:8888/api/admin/playlists/${playlistId}`,
      {
        title: res.data.title || res.data.name,
        description: res.data.description,
        isPublic: res.data.isPublic,
        restaurants: res.data.restaurants
      },
      { headers: adminHeaders }
    );
    console.log(`   ✅ Restored ${originalCount} restaurants`);
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testRestaurantDelete();