import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import axios from '../utils/axios';

interface SocialStore {
  // Following/Followers
  followingUsers: string[]; // User IDs that current user is following
  followingUserDetails: any[]; // Full user objects with details
  followers: string[]; // User IDs following the current user
  followerDetails: any[]; // Full follower objects with details
  
  // Saved items
  savedRestaurants: any[];
  savedPlaylists: any[];
  
  // Actions
  followUser: (userId: string, userDetails?: any) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  addFollower: (userId: string, userDetails?: any) => void;
  removeFollower: (userId: string) => void;
  saveRestaurant: (restaurant: any) => void;
  unsaveRestaurant: (restaurantId: string) => void;
  savePlaylist: (playlist: any) => void;
  unsavePlaylist: (playlistId: string) => void;
  
  // Getters
  isFollowing: (userId: string) => boolean;
  getFollowingCount: () => number;
  getFollowerCount: () => number;
  getSavedRestaurantsCount: () => number;
  getSavedPlaylistsCount: () => number;
  
  // Sync with localStorage (for backward compatibility)
  syncWithLocalStorage: () => void;
}

export const useSocialStore = create<SocialStore>()(
  persist(
    (set, get) => ({
      followingUsers: [],
      followingUserDetails: [],
      followers: [],
      followerDetails: [],
      savedRestaurants: [],
      savedPlaylists: [],
      
      followUser: async (userId, userDetails) => {
        // API call to MongoDB
        try {
          await axios.post(`/api/social/follow/${userId}`);
        } catch (error) {
          console.log('API error, using local storage fallback');
        }
        
        set((state) => {
          if (state.followingUsers.includes(userId)) {
            return state; // Already following
          }
          
          const newFollowingUsers = [...state.followingUsers, userId];
          
          // Ensure userDetails is added or create default
          let newFollowingUserDetails = [...state.followingUserDetails];
          if (userDetails) {
            // Check if user details already exist
            const existingIndex = newFollowingUserDetails.findIndex(u => u._id === userId);
            if (existingIndex === -1) {
              newFollowingUserDetails.push({
                ...userDetails,
                _id: userId,
                followedAt: new Date().toISOString()
              });
            }
          } else {
            // Create minimal user detail if not provided
            newFollowingUserDetails.push({
              _id: userId,
              username: `user_${userId.slice(-6)}`,
              bio: '',
              followedAt: new Date().toISOString()
            });
          }
          
          // Sync with localStorage for backward compatibility
          localStorage.setItem('followedUsers', JSON.stringify(newFollowingUsers));
          
          // Also update bobmap_user_data
          const userData = JSON.parse(localStorage.getItem('bobmap_user_data') || '{}');
          userData.followingUsers = newFollowingUsers;
          userData.followingUserDetails = newFollowingUserDetails;
          localStorage.setItem('bobmap_user_data', JSON.stringify(userData));
          
          return {
            followingUsers: newFollowingUsers,
            followingUserDetails: newFollowingUserDetails
          };
        });
      },
      
      unfollowUser: async (userId) => {
        // API call to MongoDB
        try {
          await axios.delete(`/api/social/unfollow/${userId}`);
        } catch (error) {
          console.log('API error, using local storage fallback');
        }
        
        set((state) => {
          const newFollowingUsers = state.followingUsers.filter(id => id !== userId);
          const newFollowingUserDetails = state.followingUserDetails.filter(
            user => user._id !== userId
          );
          
          // Sync with localStorage
          localStorage.setItem('followedUsers', JSON.stringify(newFollowingUsers));
          
          // Also update bobmap_user_data
          const userData = JSON.parse(localStorage.getItem('bobmap_user_data') || '{}');
          userData.followingUsers = newFollowingUsers;
          userData.followingUserDetails = newFollowingUserDetails;
          localStorage.setItem('bobmap_user_data', JSON.stringify(userData));
          
          return {
            followingUsers: newFollowingUsers,
            followingUserDetails: newFollowingUserDetails
          };
        });
      },
      
      addFollower: (userId, userDetails) => {
        set((state) => {
          if (state.followers.includes(userId)) {
            return state; // Already a follower
          }
          
          const newFollowers = [...state.followers, userId];
          const newFollowerDetails = userDetails
            ? [...state.followerDetails, userDetails]
            : state.followerDetails;
          
          return {
            followers: newFollowers,
            followerDetails: newFollowerDetails
          };
        });
      },
      
      removeFollower: (userId) => {
        set((state) => ({
          followers: state.followers.filter(id => id !== userId),
          followerDetails: state.followerDetails.filter(user => user._id !== userId)
        }));
      },
      
      saveRestaurant: (restaurant) => {
        set((state) => {
          const exists = state.savedRestaurants.some(r => r._id === restaurant._id);
          if (exists) {
            return state; // Already saved
          }
          
          const newSavedRestaurants = [...state.savedRestaurants, restaurant];
          
          // Update localStorage
          const userData = JSON.parse(localStorage.getItem('bobmap_user_data') || '{}');
          userData.savedRestaurants = newSavedRestaurants.map(r => ({
            restaurantId: r._id,
            savedAt: r.savedAt || new Date().toISOString()
          }));
          localStorage.setItem('bobmap_user_data', JSON.stringify(userData));
          
          return { savedRestaurants: newSavedRestaurants };
        });
      },
      
      unsaveRestaurant: (restaurantId) => {
        set((state) => {
          const newSavedRestaurants = state.savedRestaurants.filter(r => r._id !== restaurantId);
          
          // Update localStorage
          const userData = JSON.parse(localStorage.getItem('bobmap_user_data') || '{}');
          userData.savedRestaurants = newSavedRestaurants.map(r => ({
            restaurantId: r._id,
            savedAt: r.savedAt || new Date().toISOString()
          }));
          localStorage.setItem('bobmap_user_data', JSON.stringify(userData));
          
          return { savedRestaurants: newSavedRestaurants };
        });
      },
      
      savePlaylist: (playlist) => {
        set((state) => {
          const exists = state.savedPlaylists.some(p => p._id === playlist._id);
          if (exists) {
            return state; // Already saved
          }
          
          const newSavedPlaylists = [...state.savedPlaylists, playlist];
          
          // Update localStorage
          const userData = JSON.parse(localStorage.getItem('bobmap_user_data') || '{}');
          userData.savedPlaylists = newSavedPlaylists.map(p => ({
            playlistId: p._id,
            savedAt: p.savedAt || new Date().toISOString()
          }));
          localStorage.setItem('bobmap_user_data', JSON.stringify(userData));
          
          return { savedPlaylists: newSavedPlaylists };
        });
      },
      
      unsavePlaylist: (playlistId) => {
        set((state) => {
          const newSavedPlaylists = state.savedPlaylists.filter(p => p._id !== playlistId);
          
          // Update localStorage
          const userData = JSON.parse(localStorage.getItem('bobmap_user_data') || '{}');
          userData.savedPlaylists = newSavedPlaylists.map(p => ({
            playlistId: p._id,
            savedAt: p.savedAt || new Date().toISOString()
          }));
          localStorage.setItem('bobmap_user_data', JSON.stringify(userData));
          
          return { savedPlaylists: newSavedPlaylists };
        });
      },
      
      isFollowing: (userId) => {
        return get().followingUsers.includes(userId);
      },
      
      getFollowingCount: () => get().followingUsers.length,
      getFollowerCount: () => get().followers.length,
      getSavedRestaurantsCount: () => get().savedRestaurants.length,
      getSavedPlaylistsCount: () => get().savedPlaylists.length,
      
      syncWithLocalStorage: () => {
        // Load following users from localStorage
        const followedUsers = localStorage.getItem('followedUsers');
        const userData = localStorage.getItem('bobmap_user_data');
        
        if (userData) {
          try {
            const data = JSON.parse(userData);
            
            // Load following users and details - ensure they're in sync
            let followingUsersList = data.followingUsers || [];
            let followingDetails = data.followingUserDetails || [];
            
            // If we have followedUsers but no followingUsers, use followedUsers
            if (!followingUsersList.length && followedUsers) {
              try {
                followingUsersList = JSON.parse(followedUsers);
              } catch (e) {
                console.log('Error parsing followedUsers');
              }
            }
            
            // Ensure details exist for all following users
            if (followingUsersList.length > followingDetails.length) {
              followingUsersList.forEach((userId: string) => {
                if (!followingDetails.find((d: any) => d._id === userId)) {
                  followingDetails.push({
                    _id: userId,
                    username: `user_${userId.slice(-6)}`,
                    bio: '맛집 큐레이터',
                    followedAt: new Date().toISOString()
                  });
                }
              });
              // Save updated details back to localStorage
              data.followingUserDetails = followingDetails;
              localStorage.setItem('bobmap_user_data', JSON.stringify(data));
            }
            
            set({ 
              followingUsers: followingUsersList,
              followingUserDetails: followingDetails
            });
            
            // Load followers
            if (data.followers) {
              set({
                followers: data.followers,
                followerDetails: data.followerDetails || []
              });
            }
            
            // Load saved restaurants
            if (data.savedRestaurants) {
              set({ 
                savedRestaurants: data.savedRestaurants.map((item: any) => ({
                  _id: item.restaurantId,
                  savedAt: item.savedAt,
                  ...item.restaurant // Include full restaurant data if available
                }))
              });
            }
            
            // Load saved playlists
            if (data.savedPlaylists) {
              set({
                savedPlaylists: data.savedPlaylists.map((item: any) => ({
                  _id: item.playlistId,
                  savedAt: item.savedAt,
                  ...item.playlist // Include full playlist data if available
                }))
              });
            }
          } catch (e) {
            console.error('Error parsing user data:', e);
          }
        } else if (followedUsers) {
          // Fallback to old followedUsers format
          try {
            const users = JSON.parse(followedUsers);
            set({ followingUsers: users });
          } catch (e) {
            console.error('Error parsing followedUsers:', e);
          }
        }
      }
    }),
    {
      name: 'social-storage',
      onRehydrateStorage: () => (state) => {
        // Sync with localStorage on startup
        state?.syncWithLocalStorage();
      }
    }
  )
);