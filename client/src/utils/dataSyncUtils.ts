// Utility functions to sync and clean up social data

export function cleanupAndSyncSocialData() {
  const userData = localStorage.getItem('bobmap_user_data');
  const followedUsers = localStorage.getItem('followedUsers');
  
  let data: any = {};
  
  try {
    if (userData) {
      data = JSON.parse(userData);
    }
  } catch (e) {
    console.error('Error parsing user data:', e);
    data = {};
  }
  
  // Initialize if not exists
  if (!data.followingUsers) data.followingUsers = [];
  if (!data.followingUserDetails) data.followingUserDetails = [];
  if (!data.followers) data.followers = [];
  if (!data.followerDetails) data.followerDetails = [];
  if (!data.savedRestaurants) data.savedRestaurants = [];
  if (!data.savedPlaylists) data.savedPlaylists = [];
  
  // Sync followedUsers with followingUsers
  if (followedUsers) {
    try {
      const followed = JSON.parse(followedUsers);
      // Merge with existing followingUsers
      followed.forEach((userId: string) => {
        if (!data.followingUsers.includes(userId)) {
          data.followingUsers.push(userId);
        }
      });
    } catch (e) {
      console.log('Error parsing followedUsers');
    }
  }
  
  // Ensure all following users have details
  data.followingUsers.forEach((userId: string | null) => {
    if (!userId) return; // Skip null or undefined userIds
    
    if (!data.followingUserDetails.find((d: any) => d._id === userId)) {
      // Check if it's a known user (from certifiedRestaurantLists)
      const knownUsers: { [key: string]: string } = {
        'user-black-white': '흑백요리사',
        'user-wednesday': '수요미식회',
        'user-baek': '백종원',
        'user-sung': '성시경',
        'user-tasty': '맛있는녀석들',
        'user-michelin': '미쉐린가이드',
        'user-100year': '백년가게'
      };
      
      const username = knownUsers[userId] || `user_${userId.slice ? userId.slice(-6) : 'unknown'}`;
      
      data.followingUserDetails.push({
        _id: userId,
        username: username,
        bio: knownUsers[userId] ? `${knownUsers[userId]} 공식` : '맛집 큐레이터',
        profileImage: null,
        followedAt: new Date().toISOString()
      });
    }
  });
  
  // Remove details for users that are not being followed
  data.followingUserDetails = data.followingUserDetails.filter((detail: any) =>
    data.followingUsers.includes(detail._id)
  );
  
  // Remove nulls and duplicates
  data.followingUsers = Array.from(new Set(data.followingUsers.filter((id: any) => id !== null && id !== undefined)));
  data.followers = Array.from(new Set(data.followers.filter((id: any) => id !== null && id !== undefined)));
  
  // Remove duplicate saved items
  const uniqueSavedRestaurants = new Map();
  data.savedRestaurants.forEach((item: any) => {
    uniqueSavedRestaurants.set(item.restaurantId, item);
  });
  data.savedRestaurants = Array.from(uniqueSavedRestaurants.values());
  
  const uniqueSavedPlaylists = new Map();
  data.savedPlaylists.forEach((item: any) => {
    uniqueSavedPlaylists.set(item.playlistId, item);
  });
  data.savedPlaylists = Array.from(uniqueSavedPlaylists.values());
  
  // Save cleaned data back
  localStorage.setItem('bobmap_user_data', JSON.stringify(data));
  
  // Update followedUsers to match
  localStorage.setItem('followedUsers', JSON.stringify(data.followingUsers));
  
  return data;
}

export function getLikedItems() {
  const likedRestaurants = JSON.parse(localStorage.getItem('likedRestaurants') || '[]');
  const likedPlaylists = JSON.parse(localStorage.getItem('likedPlaylists') || '[]');
  
  return {
    restaurants: likedRestaurants,
    playlists: likedPlaylists,
    total: likedRestaurants.length + likedPlaylists.length
  };
}

export function addLikedRestaurant(restaurantId: string) {
  const liked = JSON.parse(localStorage.getItem('likedRestaurants') || '[]');
  if (!liked.includes(restaurantId)) {
    liked.push(restaurantId);
    localStorage.setItem('likedRestaurants', JSON.stringify(liked));
  }
  return liked;
}

export function removeLikedRestaurant(restaurantId: string) {
  let liked = JSON.parse(localStorage.getItem('likedRestaurants') || '[]');
  liked = liked.filter((id: string) => id !== restaurantId);
  localStorage.setItem('likedRestaurants', JSON.stringify(liked));
  return liked;
}

export function addLikedPlaylist(playlistId: string) {
  const liked = JSON.parse(localStorage.getItem('likedPlaylists') || '[]');
  if (!liked.includes(playlistId)) {
    liked.push(playlistId);
    localStorage.setItem('likedPlaylists', JSON.stringify(liked));
  }
  return liked;
}

export function removeLikedPlaylist(playlistId: string) {
  let liked = JSON.parse(localStorage.getItem('likedPlaylists') || '[]');
  liked = liked.filter((id: string) => id !== playlistId);
  localStorage.setItem('likedPlaylists', JSON.stringify(liked));
  return liked;
}

export function getSocialStats() {
  const data = cleanupAndSyncSocialData();
  const likedItems = getLikedItems();
  
  return {
    followingCount: data.followingUsers.length,
    followersCount: data.followers.length,
    likedRestaurantsCount: likedItems.restaurants.length,
    likedPlaylistsCount: likedItems.playlists.length,
    savedRestaurantsCount: data.savedRestaurants.length,
    savedPlaylistsCount: data.savedPlaylists.length
  };
}