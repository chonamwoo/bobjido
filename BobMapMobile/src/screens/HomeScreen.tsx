import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../config/api';

interface Playlist {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  restaurants: any[];
  likes: string[];
  saves: string[];
}

interface Restaurant {
  _id: string;
  name: string;
  category: string;
  address: string;
  averageRating: number;
  images: { url: string }[];
}

export default function HomeScreen({ navigation }: any) {
  const [popularPlaylists, setPopularPlaylists] = useState<Playlist[]>([]);
  const [trendingRestaurants, setTrendingRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const [playlistsRes, restaurantsRes] = await Promise.all([
        api.get('/playlists?limit=6'),
        api.get('/restaurants/trending?limit=10'),
      ]);

      setPopularPlaylists(playlistsRes.data.playlists || []);
      setTrendingRestaurants(restaurantsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>BobMap</Text>
          <Text style={styles.subtitle}>취향으로 만나는 맛집 여행</Text>
        </View>

        {/* 인기 플레이리스트 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 인기 플레이리스트</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Playlists')}
            >
              <Text style={styles.seeAll}>모두 보기</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {popularPlaylists.map((playlist) => (
              <TouchableOpacity
                key={playlist._id}
                style={styles.playlistCard}
                onPress={() =>
                  navigation.navigate('PlaylistDetail', {
                    playlistId: playlist._id,
                  })
                }
              >
                <Image
                  source={{ uri: playlist.coverImage }}
                  style={styles.playlistImage}
                />
                <View style={styles.playlistInfo}>
                  <Text style={styles.playlistTitle} numberOfLines={1}>
                    {playlist.title}
                  </Text>
                  <Text style={styles.playlistMeta}>
                    맛집 {playlist.restaurants.length}곳
                  </Text>
                  <View style={styles.playlistStats}>
                    <Text style={styles.statText}>
                      ❤️ {playlist.likes?.length || 0}
                    </Text>
                    <Text style={styles.statText}>
                      ⭐ {playlist.saves?.length || 0}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 실시간 인기 맛집 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📍 실시간 인기 맛집</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Restaurants')}
            >
              <Text style={styles.seeAll}>모두 보기</Text>
            </TouchableOpacity>
          </View>

          {trendingRestaurants.map((restaurant, index) => (
            <TouchableOpacity
              key={restaurant._id}
              style={styles.restaurantCard}
              onPress={() =>
                navigation.navigate('RestaurantDetail', {
                  restaurantId: restaurant._id,
                })
              }
            >
              <Text style={styles.ranking}>{index + 1}</Text>
              <Image
                source={{
                  uri:
                    restaurant.images?.[0]?.url ||
                    'https://via.placeholder.com/80',
                }}
                style={styles.restaurantImage}
              />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantCategory}>
                  {restaurant.category} · {restaurant.address?.split(' ').slice(0, 2).join(' ')}
                </Text>
                <Text style={styles.restaurantRating}>
                  ⭐ {restaurant.averageRating.toFixed(1)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 빠른 탐색 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🗺️ 빠른 탐색</Text>
          <View style={styles.quickLinks}>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => navigation.navigate('Map')}
            >
              <Text style={styles.quickLinkEmoji}>📍</Text>
              <Text style={styles.quickLinkText}>지도</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => navigation.navigate('TasteTest')}
            >
              <Text style={styles.quickLinkEmoji}>🎯</Text>
              <Text style={styles.quickLinkText}>취향테스트</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => navigation.navigate('Matching')}
            >
              <Text style={styles.quickLinkEmoji}>👥</Text>
              <Text style={styles.quickLinkText}>매칭</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickLink}
              onPress={() => navigation.navigate('MyPage')}
            >
              <Text style={styles.quickLinkEmoji}>👤</Text>
              <Text style={styles.quickLinkText}>마이페이지</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#FF6B6B',
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  playlistCard: {
    width: 160,
    marginRight: 15,
  },
  playlistImage: {
    width: 160,
    height: 160,
    borderRadius: 12,
    marginBottom: 10,
  },
  playlistInfo: {
    paddingHorizontal: 5,
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  playlistMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  playlistStats: {
    flexDirection: 'row',
    gap: 10,
  },
  statText: {
    fontSize: 12,
    color: '#999',
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  ranking: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginRight: 15,
    width: 25,
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  restaurantCategory: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  restaurantRating: {
    fontSize: 13,
    color: '#FF6B6B',
  },
  quickLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  quickLink: {
    alignItems: 'center',
    padding: 15,
  },
  quickLinkEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickLinkText: {
    fontSize: 12,
    color: '#666',
  },
});