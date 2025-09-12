import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../services/api';
import websocket from '../services/websocket';
import { Playlist } from '../types';

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadPlaylists();
    
    // Initialize WebSocket connection
    websocket.connect();
    
    // Listen for real-time updates
    websocket.on('playlistUpdate', (data: any) => {
      console.log('Received playlist update:', data);
      loadPlaylists(); // Reload playlists when updates occur
    });

    return () => {
      websocket.disconnect();
    };
  }, []);

  const loadPlaylists = async () => {
    try {
      const data = await api.getPlaylists();
      setPlaylists(data.playlists || []);
    } catch (error) {
      console.error('Failed to load playlists:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadPlaylists();
  };

  const handleLike = async (playlistId: string) => {
    try {
      await api.likePlaylist(playlistId);
      // Update local state
      setPlaylists(prev =>
        prev.map(p => {
          if (p._id === playlistId) {
            const isLiked = p.likes.includes('currentUserId'); // Need to get current user ID
            return {
              ...p,
              likes: isLiked
                ? p.likes.filter(id => id !== 'currentUserId')
                : [...p.likes, 'currentUserId'],
            };
          }
          return p;
        })
      );
    } catch (error) {
      console.error('Failed to like playlist:', error);
    }
  };

  const renderPlaylist = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      style={styles.playlistCard}
      onPress={() => navigation.navigate('PlaylistDetail', { playlistId: item._id })}
    >
      <LinearGradient
        colors={['#f97316', '#ef4444']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.playlistHeader}>
          <Text style={styles.playlistTitle}>{item.title}</Text>
          <View style={styles.statsContainer}>
            <TouchableOpacity
              style={styles.statButton}
              onPress={() => handleLike(item._id)}
            >
              <Ionicons name="heart-outline" size={20} color="white" />
              <Text style={styles.statText}>{item.likes.length}</Text>
            </TouchableOpacity>
            <View style={styles.statButton}>
              <Ionicons name="bookmark-outline" size={20} color="white" />
              <Text style={styles.statText}>{item.saves.length}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.playlistContent}>
        <Text style={styles.playlistDescription} numberOfLines={2}>
          {item.description}
        </Text>

        {/* Restaurant Preview */}
        <View style={styles.restaurantPreview}>
          {item.restaurants.slice(0, 3).map((restaurant, index) => (
            <View key={index} style={styles.restaurantItem}>
              <Image
                source={{ 
                  uri: restaurant.image || 'https://via.placeholder.com/50'
                }}
                style={styles.restaurantImage}
              />
              <Text style={styles.restaurantName} numberOfLines={1}>
                {restaurant.name}
              </Text>
            </View>
          ))}
          {item.restaurants.length > 3 && (
            <View style={styles.moreIndicator}>
              <Text style={styles.moreText}>+{item.restaurants.length - 3}</Text>
            </View>
          )}
        </View>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Creator Info */}
        <View style={styles.creatorInfo}>
          <Image
            source={{ 
              uri: typeof item.creator === 'object' 
                ? item.creator.profileImage || 'https://via.placeholder.com/30'
                : 'https://via.placeholder.com/30'
            }}
            style={styles.creatorAvatar}
          />
          <Text style={styles.creatorName}>
            {typeof item.creator === 'object' ? item.creator.username : 'Unknown'}
          </Text>
          <Text style={styles.createdAt}>
            {new Date(item.createdAt).toLocaleDateString('ko-KR')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={playlists}
        renderItem={renderPlaylist}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#f97316']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>아직 플레이리스트가 없습니다</Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate('Create')}
            >
              <Text style={styles.createButtonText}>첫 플레이리스트 만들기</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  playlistCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  gradientHeader: {
    padding: 16,
  },
  playlistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playlistTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    color: 'white',
    fontSize: 14,
  },
  playlistContent: {
    padding: 16,
  },
  playlistDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  restaurantPreview: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  restaurantItem: {
    flex: 1,
    alignItems: 'center',
  },
  restaurantImage: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  moreIndicator: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    color: '#f97316',
  },
  creatorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  creatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  creatorName: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  createdAt: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#f97316',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;