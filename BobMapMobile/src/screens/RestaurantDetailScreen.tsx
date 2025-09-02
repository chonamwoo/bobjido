import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../config/api';

interface Restaurant {
  _id: string;
  name: string;
  category: string;
  address: string;
  phoneNumber?: string;
  averageRating: number;
  reviewCount: number;
  priceRange: string;
  images: { url: string }[];
  tags: string[];
  dnaProfile?: {
    atmosphere: string[];
    foodStyle: string[];
    instagramability: number;
    dateSpot: number;
    groupFriendly: number;
    soloFriendly: number;
  };
  businessHours?: any;
  menuItems?: any[];
  features?: string[];
}

export default function RestaurantDetailScreen({ route, navigation }: any) {
  const { restaurantId } = route.params;
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    fetchRestaurant();
  }, [restaurantId]);

  const fetchRestaurant = async () => {
    try {
      const response = await api.get(`/restaurants/${restaurantId}`);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (restaurant?.phoneNumber) {
      Linking.openURL(`tel:${restaurant.phoneNumber}`);
    }
  };

  const handleMap = () => {
    if (restaurant?.address) {
      const url = Platform.select({
        ios: `maps:0,0?q=${restaurant.address}`,
        android: `geo:0,0?q=${restaurant.address}`,
      });
      if (url) Linking.openURL(url);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>맛집 정보를 불러올 수 없습니다.</Text>
      </View>
    );
  }

  const getPriceText = (priceRange: string) => {
    const priceMap: { [key: string]: string } = {
      '저렴한': '💰',
      '보통': '💰💰',
      '비싼': '💰💰💰',
      '매우비싼': '💰💰💰💰',
    };
    return priceMap[priceRange] || '💰💰';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 이미지 갤러리 */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            const slideIndex = Math.round(
              event.nativeEvent.contentOffset.x / 375
            );
            setActiveImageIndex(slideIndex);
          }}
        >
          {restaurant.images?.length > 0 ? (
            restaurant.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image.url }}
                style={styles.image}
              />
            ))
          ) : (
            <Image
              source={{ uri: 'https://via.placeholder.com/375x250' }}
              style={styles.image}
            />
          )}
        </ScrollView>

        {/* 이미지 인디케이터 */}
        {restaurant.images?.length > 1 && (
          <View style={styles.imageIndicator}>
            {restaurant.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === activeImageIndex && styles.activeDot,
                ]}
              />
            ))}
          </View>
        )}

        {/* 기본 정보 */}
        <View style={styles.infoSection}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.category}>
            {restaurant.category} · {getPriceText(restaurant.priceRange)}
          </Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              ⭐ {restaurant.averageRating.toFixed(1)}
            </Text>
            <Text style={styles.reviewCount}>
              ({restaurant.reviewCount}개 리뷰)
            </Text>
          </View>

          {/* 태그 */}
          {restaurant.tags?.length > 0 && (
            <View style={styles.tags}>
              {restaurant.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* DNA 프로필 */}
        {restaurant.dnaProfile && (
          <View style={styles.dnaSection}>
            <Text style={styles.sectionTitle}>맛집 DNA</Text>
            
            <View style={styles.dnaRow}>
              <Text style={styles.dnaLabel}>분위기</Text>
              <View style={styles.dnaTags}>
                {restaurant.dnaProfile.atmosphere.map((item, index) => (
                  <Text key={index} style={styles.dnaTag}>{item}</Text>
                ))}
              </View>
            </View>

            <View style={styles.dnaRow}>
              <Text style={styles.dnaLabel}>음식 스타일</Text>
              <View style={styles.dnaTags}>
                {restaurant.dnaProfile.foodStyle.map((item, index) => (
                  <Text key={index} style={styles.dnaTag}>{item}</Text>
                ))}
              </View>
            </View>

            <View style={styles.dnaMetrics}>
              <View style={styles.dnaMetric}>
                <Text style={styles.metricLabel}>인스타</Text>
                <Text style={styles.metricValue}>
                  {'📸'.repeat(restaurant.dnaProfile.instagramability)}
                </Text>
              </View>
              <View style={styles.dnaMetric}>
                <Text style={styles.metricLabel}>데이트</Text>
                <Text style={styles.metricValue}>
                  {'❤️'.repeat(restaurant.dnaProfile.dateSpot)}
                </Text>
              </View>
              <View style={styles.dnaMetric}>
                <Text style={styles.metricLabel}>단체</Text>
                <Text style={styles.metricValue}>
                  {'👥'.repeat(restaurant.dnaProfile.groupFriendly)}
                </Text>
              </View>
              <View style={styles.dnaMetric}>
                <Text style={styles.metricLabel}>혼밥</Text>
                <Text style={styles.metricValue}>
                  {'🍽️'.repeat(restaurant.dnaProfile.soloFriendly)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* 정보 */}
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>정보</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📍 주소</Text>
            <Text style={styles.detailValue}>{restaurant.address}</Text>
          </View>

          {restaurant.phoneNumber && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📞 전화</Text>
              <TouchableOpacity onPress={handleCall}>
                <Text style={[styles.detailValue, styles.link]}>
                  {restaurant.phoneNumber}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {restaurant.features?.length > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>✨ 특징</Text>
              <Text style={styles.detailValue}>
                {restaurant.features.join(', ')}
              </Text>
            </View>
          )}
        </View>

        {/* 액션 버튼 */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Text style={styles.actionText}>📞 전화</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleMap}>
            <Text style={styles.actionText}>🗺️ 지도</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>⭐ 저장</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionText}>📝 리뷰</Text>
          </TouchableOpacity>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  image: {
    width: 375,
    height: 250,
  },
  imageIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FF6B6B',
  },
  infoSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: '#999',
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#666',
  },
  dnaSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  dnaRow: {
    marginBottom: 15,
  },
  dnaLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  dnaTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dnaTag: {
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
    fontSize: 12,
    color: '#FF6B6B',
  },
  dnaMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  dnaMetric: {
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 14,
  },
  detailSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailRow: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  link: {
    color: '#FF6B6B',
    textDecorationLine: 'underline',
  },
  actions: {
    flexDirection: 'row',
    padding: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#FFE5E5',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '600',
  },
});