import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
  Platform,
  Vibration,
  Share,
} from 'react-native';
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { 
  PanGestureHandler, 
  PinchGestureHandler,
  State 
} from 'react-native-gesture-handler';
import Animated as Reanimated from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const NativeHomeScreen = ({ userLocation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState('전체');
  // const mapRef = useRef<MapView>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bottomSheetY = useRef(new Animated.Value(height * 0.7)).current;

  const categories = ['전체', '한식', '중식', '일식', '양식', '카페', '술집'];
  
  const restaurants = [
    { id: 1, name: '성수동 감자탕', lat: 37.5445, lng: 127.0557, rating: 4.8, category: '한식' },
    { id: 2, name: '이태원 파스타', lat: 37.5347, lng: 126.9945, rating: 4.6, category: '양식' },
    { id: 3, name: '강남 스시', lat: 37.4979, lng: 127.0276, rating: 4.9, category: '일식' },
  ];

  const handleCategoryPress = async (category: string) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    setSelectedCategory(category);
  };

  const handleRestaurantPress = async (restaurant: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Animated.timing(bottomSheetY, {
      toValue: height * 0.3,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // mapRef.current?.animateToRegion({
    //   latitude: restaurant.lat,
    //   longitude: restaurant.lng,
    //   latitudeDelta: 0.005,
    //   longitudeDelta: 0.005,
    // });
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: '🍜 BobMap - 네이티브 맛집 앱을 사용해보세요!',
        title: 'BobMap 공유하기',
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 지도 대체 배경 */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.map}
      >
        <View style={styles.mapOverlay}>
          {restaurants.map((restaurant) => (
            <Pressable
              key={restaurant.id}
              onPress={() => handleRestaurantPress(restaurant)}
              style={[
                styles.mapMarker,
                { 
                  top: Math.random() * height * 0.4 + 100,
                  left: Math.random() * width * 0.8 + 20
                }
              ]}
            >
              <LinearGradient
                colors={['#FF6B6B', '#FF8E53']}
                style={styles.markerGradient}
              >
                <Text style={styles.markerText}>⭐ {restaurant.rating}</Text>
              </LinearGradient>
            </Pressable>
          ))}
        </View>
      </LinearGradient>

      {/* 상단 블러 헤더 */}
      <BlurView intensity={80} tint="dark" style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🍜 BobMap Native</Text>
          <Pressable onPress={handleShare} style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="white" />
          </Pressable>
        </View>

        {/* 카테고리 필터 */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
        >
          {categories.map((category) => (
            <Pressable
              key={category}
              onPress={() => handleCategoryPress(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
            >
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Animated.View>
            </Pressable>
          ))}
        </ScrollView>
      </BlurView>

      {/* 하단 시트 */}
      <Animated.View
        style={[
          styles.bottomSheet,
          { transform: [{ translateY: bottomSheetY }] },
        ]}
      >
        <PanGestureHandler
          onGestureEvent={(e) => {
            if (e.nativeEvent.translationY > 0) {
              bottomSheetY.setValue(height * 0.7 + e.nativeEvent.translationY);
            }
          }}
          onHandlerStateChange={(e) => {
            if (e.nativeEvent.state === State.END) {
              if (e.nativeEvent.translationY > 100) {
                Animated.timing(bottomSheetY, {
                  toValue: height * 0.7,
                  duration: 300,
                  useNativeDriver: true,
                }).start();
              } else {
                Animated.timing(bottomSheetY, {
                  toValue: height * 0.3,
                  duration: 300,
                  useNativeDriver: true,
                }).start();
              }
            }
          }}
        >
          <View>
            <View style={styles.bottomSheetHandle} />
            <Text style={styles.bottomSheetTitle}>주변 맛집</Text>
            
            <ScrollView style={styles.restaurantList}>
              {restaurants.map((restaurant) => (
                <Pressable
                  key={restaurant.id}
                  style={styles.restaurantCard}
                  onPress={() => handleRestaurantPress(restaurant)}
                >
                  <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.restaurantCardGradient}
                  >
                    <View style={styles.restaurantInfo}>
                      <Text style={styles.restaurantName}>{restaurant.name}</Text>
                      <Text style={styles.restaurantCategory}>{restaurant.category}</Text>
                    </View>
                    <View style={styles.restaurantRating}>
                      <Text style={styles.ratingText}>⭐ {restaurant.rating}</Text>
                    </View>
                  </LinearGradient>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </PanGestureHandler>
      </Animated.View>

      {/* 플로팅 액션 버튼 */}
      <Pressable
        style={styles.fab}
        onPress={async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Animated.sequence([
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start();
        }}
      >
        <Animated.View
          style={{
            transform: [
              {
                rotate: rotateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}
        >
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={30} color="white" />
          </LinearGradient>
        </Animated.View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    flex: 1,
    position: 'relative',
  },
  mapMarker: {
    position: 'absolute',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  shareButton: {
    padding: 8,
  },
  categoryScroll: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryButtonActive: {
    backgroundColor: 'white',
  },
  categoryText: {
    color: 'white',
    fontWeight: '600',
  },
  categoryTextActive: {
    color: '#FF6B6B',
  },
  marker: {
    alignItems: 'center',
  },
  markerGradient: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    height: height * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 20,
  },
  bottomSheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#DDD',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
  },
  restaurantList: {
    marginTop: 10,
  },
  restaurantCard: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  restaurantCardGradient: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  restaurantCategory: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  restaurantRating: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  ratingText: {
    color: 'white',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
});

export default NativeHomeScreen;