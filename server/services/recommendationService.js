const UserPreference = require('../models/UserPreference');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const mongoose = require('mongoose');

class RecommendationService {
  constructor() {
    // 가중치 설정
    this.weights = {
      gamePreference: 0.20,      // 20% - 게임 기반 선호도
      visitHistory: 0.15,        // 15% - 방문 이력
      followingCurators: 0.15,   // 15% - 팔로우 큐레이터
      likedPattern: 0.10,        // 10% - 좋아요 패턴
      socialInfluence: 0.10,     // 10% - 소셜 그래프
      timeContext: 0.10,         // 10% - 시간대 컨텍스트
      companionContext: 0.08,    // 8% - 동행 컨텍스트
      seasonalContext: 0.05,     // 5% - 계절 컨텍스트
      trending: 0.05,            // 5% - 트렌딩
      distance: 0.02             // 2% - 거리
    };
  }

  /**
   * 사용자에게 맞춤 추천 생성
   * @param {String} userId - 사용자 ID
   * @param {Object} context - 현재 컨텍스트 (위치, 시간, 동행 등)
   * @param {Number} limit - 추천 개수
   */
  async getRecommendations(userId, context = {}, limit = 20) {
    try {
      // 1. 사용자 선호도 데이터 가져오기
      const userPreference = await UserPreference.findOne({ userId })
        .populate('visitHistory.restaurantId')
        .populate('likedRestaurants.restaurantId')
        .populate('socialInfluence.friendsLikedRestaurants.restaurantId');

      if (!userPreference) {
        // 신규 사용자인 경우 기본 추천
        return this.getDefaultRecommendations(context, limit);
      }

      // 2. 추천 후보 레스토랑 가져오기
      const candidates = await this.getCandidateRestaurants(userPreference, context);

      // 3. 각 레스토랑에 대한 점수 계산
      const scoredRestaurants = await Promise.all(
        candidates.map(async (restaurant) => {
          const score = await this.calculateTotalScore(restaurant, userPreference, context);
          return { restaurant, ...score };
        })
      );

      // 4. 점수 기준 정렬 및 상위 N개 선택
      scoredRestaurants.sort((a, b) => b.totalScore - a.totalScore);
      const recommendations = scoredRestaurants.slice(0, limit);

      // 5. 추천 이유 생성
      const enrichedRecommendations = recommendations.map(rec => ({
        ...rec,
        explanation: this.generateExplanation(rec.breakdown),
        confidence: this.calculateConfidence(rec.totalScore)
      }));

      // 6. 추천 로그 저장
      await this.logRecommendations(userId, enrichedRecommendations, context);

      return enrichedRecommendations;

    } catch (error) {
      console.error('Recommendation Error:', error);
      throw error;
    }
  }

  /**
   * 종합 점수 계산
   */
  async calculateTotalScore(restaurant, userPreference, context) {
    const breakdown = {};
    
    // 1. 게임 선호도 점수
    breakdown.gamePreference = this.calculateGamePreferenceScore(restaurant, userPreference);
    
    // 2. 방문 이력 점수
    breakdown.visitHistory = this.calculateVisitHistoryScore(restaurant, userPreference);
    
    // 3. 팔로우 큐레이터 점수
    breakdown.followingCurators = await this.calculateCuratorScore(restaurant, userPreference);
    
    // 4. 좋아요 패턴 점수
    breakdown.likedPattern = this.calculateLikedPatternScore(restaurant, userPreference);
    
    // 5. 소셜 영향도 점수
    breakdown.socialInfluence = this.calculateSocialScore(restaurant, userPreference);
    
    // 6. 시간대 컨텍스트 점수
    breakdown.timeContext = this.calculateTimeContextScore(restaurant, userPreference, context);
    
    // 7. 동행 컨텍스트 점수
    breakdown.companionContext = this.calculateCompanionScore(restaurant, userPreference, context);
    
    // 8. 계절 컨텍스트 점수
    breakdown.seasonalContext = this.calculateSeasonalScore(restaurant, userPreference);
    
    // 9. 트렌딩 점수
    breakdown.trending = await this.calculateTrendingScore(restaurant);
    
    // 10. 거리 점수
    breakdown.distance = this.calculateDistanceScore(restaurant, context);

    // 가중치 적용하여 총점 계산
    let totalScore = 0;
    for (const [key, weight] of Object.entries(this.weights)) {
      totalScore += (breakdown[key] || 0) * weight;
    }

    return { totalScore, breakdown };
  }

  /**
   * 게임 선호도 점수 계산
   */
  calculateGamePreferenceScore(restaurant, userPreference) {
    let score = 0;
    const prefs = userPreference.gamePreferences;

    // 요리 타입 매칭
    const cuisineScore = prefs.cuisineTypes[restaurant.category] || 0;
    score += cuisineScore * 10;

    // 가격대 매칭
    const priceKey = this.getPriceRangeKey(restaurant.priceRange);
    const priceScore = prefs.priceRanges[priceKey] || 0;
    score += priceScore * 8;

    // 분위기 매칭
    if (restaurant.atmosphere) {
      restaurant.atmosphere.forEach(atmo => {
        score += (prefs.atmospheres[atmo] || 0) * 5;
      });
    }

    // 매운맛 선호도 (한식인 경우)
    if (restaurant.category === 'korean' && restaurant.spicyLevel) {
      const spicyDiff = Math.abs(prefs.spicyLevel - restaurant.spicyLevel);
      score += Math.max(0, 20 - spicyDiff * 5);
    }

    return Math.min(100, score);
  }

  /**
   * 방문 이력 기반 점수 계산
   */
  calculateVisitHistoryScore(restaurant, userPreference) {
    let score = 0;
    const visitHistory = userPreference.visitHistory;

    // 비슷한 카테고리 방문 빈도
    const similarVisits = visitHistory.filter(v => 
      v.restaurantId && v.restaurantId.category === restaurant.category
    );
    score += Math.min(30, similarVisits.length * 5);

    // 같은 지역 방문 빈도
    const sameAreaVisits = visitHistory.filter(v =>
      v.restaurantId && this.isSameArea(v.restaurantId, restaurant)
    );
    score += Math.min(20, sameAreaVisits.length * 3);

    // 재방문한 곳과의 유사성
    const revisitedPlaces = userPreference.revisitPatterns.highFrequencyRestaurants;
    for (const place of revisitedPlaces) {
      if (this.isSimilarRestaurant(place.restaurantId, restaurant)) {
        score += 25;
        break;
      }
    }

    // 평균 평점이 높은 카테고리인지
    const categoryRatings = similarVisits
      .filter(v => v.rating)
      .map(v => v.rating);
    if (categoryRatings.length > 0) {
      const avgRating = categoryRatings.reduce((a, b) => a + b, 0) / categoryRatings.length;
      score += avgRating * 5;
    }

    return Math.min(100, score);
  }

  /**
   * 큐레이터 추천 점수
   */
  async calculateCuratorScore(restaurant, userPreference) {
    let score = 0;

    // 레스토랑을 추천한 큐레이터 찾기
    const playlists = await mongoose.model('Playlist')
      .find({ 'restaurants.restaurant': restaurant._id })
      .populate('createdBy');

    for (const playlist of playlists) {
      const following = userPreference.followingPreferences.find(
        f => f.curatorId.toString() === playlist.createdBy._id.toString()
      );
      
      if (following) {
        // 신뢰도에 따른 점수
        score += following.trustScore;
        
        // 큐레이터 타입에 따른 가중치
        const typeWeight = {
          'expert': 1.5,
          'youtuber': 1.3,
          'influencer': 1.2,
          'local': 1.1,
          'friend': 1.0
        };
        score *= (typeWeight[following.curatorType] || 1.0);
      }
    }

    return Math.min(100, score);
  }

  /**
   * 시간대 컨텍스트 점수
   */
  calculateTimeContextScore(restaurant, userPreference, context) {
    if (!context.currentTime) return 50; // 시간 정보 없으면 중간 점수

    const hour = new Date(context.currentTime).getHours();
    const mealTime = this.getMealTimeFromHour(hour);
    let score = 0;

    // 현재 시간대 선호도
    if (userPreference.timePreferences[mealTime]?.active) {
      score += 30;
    }

    // 레스토랑 영업시간 체크
    if (restaurant.businessHours) {
      const isOpen = this.isRestaurantOpen(restaurant.businessHours, context.currentTime);
      score += isOpen ? 40 : -20;
    }

    // 시간대별 인기도 (점심시간 식당, 심야식당 등)
    if (restaurant.popularTimes && restaurant.popularTimes[mealTime]) {
      score += restaurant.popularTimes[mealTime] * 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * 소셜 영향도 점수
   */
  calculateSocialScore(restaurant, userPreference) {
    let score = 0;

    // 친구들이 좋아하는 레스토랑인지
    const socialRest = userPreference.socialInfluence.friendsLikedRestaurants.find(
      r => r.restaurantId && r.restaurantId._id.toString() === restaurant._id.toString()
    );

    if (socialRest) {
      score += socialRest.friendCount * 10;
      score += socialRest.closeFriendCount * 20;
    }

    // 그룹 방문 이력
    const groupVisit = userPreference.socialInfluence.groupVisitHistory.find(
      v => v.restaurantId && v.restaurantId.toString() === restaurant._id.toString()
    );

    if (groupVisit && groupVisit.groupSatisfaction > 3) {
      score += groupVisit.groupSatisfaction * 10;
    }

    return Math.min(100, score);
  }

  /**
   * 좋아요 패턴 점수 계산
   */
  calculateLikedPatternScore(restaurant, userPreference) {
    let score = 0;
    const likedRestaurants = userPreference.likedRestaurants;

    // 좋아요한 레스토랑과의 유사성
    for (const liked of likedRestaurants) {
      if (liked.restaurantId && this.isSimilarRestaurant(liked.restaurantId, restaurant)) {
        score += liked.likeStrength * 10;
      }
    }

    return Math.min(100, score);
  }

  /**
   * 동행 컨텍스트 점수
   */
  calculateCompanionScore(restaurant, userPreference, context) {
    if (!context.companion) return 50;

    let score = 0;
    const companionPatterns = userPreference.companionPatterns[context.companion];

    if (companionPatterns) {
      // 선호 카테고리 매칭
      if (companionPatterns.preferredCategories.includes(restaurant.category)) {
        score += 40;
      }
      // 선호 분위기 매칭
      const commonAtmo = restaurant.atmosphere?.filter(a => 
        companionPatterns.preferredAtmospheres.includes(a)
      );
      score += (commonAtmo?.length || 0) * 20;
    }

    return Math.min(100, score);
  }

  /**
   * 계절 컨텍스트 점수
   */
  calculateSeasonalScore(restaurant, userPreference) {
    const currentMonth = new Date().getMonth() + 1;
    let currentSeason = 'spring';
    if (currentMonth >= 3 && currentMonth <= 5) currentSeason = 'spring';
    else if (currentMonth >= 6 && currentMonth <= 8) currentSeason = 'summer';
    else if (currentMonth >= 9 && currentMonth <= 11) currentSeason = 'autumn';
    else currentSeason = 'winter';

    let score = 50; // 기본 점수
    const seasonalPref = userPreference.seasonalPreferences[currentSeason];

    if (seasonalPref) {
      if (seasonalPref.preferredCategories.includes(restaurant.category)) {
        score += 30;
      }
      if (seasonalPref.preferredDishes.some(dish => restaurant.signatureMenus?.includes(dish))) {
        score += 20;
      }
    }

    return Math.min(100, score);
  }

  /**
   * 트렌딩 점수
   */
  async calculateTrendingScore(restaurant) {
    // 최근 일주일 리뷰/좋아요 증가율 등을 계산
    // 실제 구현시 Redis 등을 활용한 실시간 통계 필요
    return Math.random() * 100; // 임시 구현
  }

  /**
   * 거리 점수
   */
  calculateDistanceScore(restaurant, context) {
    if (!context.location || !restaurant.coordinates) return 50;

    const distance = this.calculateDistance(
      context.location.lat,
      context.location.lng,
      restaurant.coordinates.lat,
      restaurant.coordinates.lng
    );

    // 거리별 점수 (가까울수록 높은 점수)
    if (distance < 0.5) return 100;
    if (distance < 1) return 80;
    if (distance < 2) return 60;
    if (distance < 5) return 40;
    if (distance < 10) return 20;
    return 0;
  }

  /**
   * 추천 후보 레스토랑 가져오기
   */
  async getCandidateRestaurants(userPreference, context) {
    const query = {};
    
    // 부정적 신호 제외
    const blockedIds = userPreference.negativeSignals.blockedRestaurants.map(b => b.restaurantId);
    if (blockedIds.length > 0) {
      query._id = { $nin: blockedIds };
    }

    // 위치 기반 필터
    if (context.location) {
      // MongoDB 지리공간 쿼리는 실제 구현시 사용
      // 일단 모든 레스토랑 가져오기
    }

    const restaurants = await Restaurant.find(query).limit(100);
    return restaurants;
  }

  /**
   * 레스토랑 영업시간 확인
   */
  isRestaurantOpen(businessHours, currentTime) {
    // 실제 영업시간 체크 로직
    // 일단 true 반환
    return true;
  }

  /**
   * 추천 이유 생성
   */
  generateExplanation(breakdown) {
    const reasons = [];
    const scores = Object.entries(breakdown).sort((a, b) => b[1] - a[1]);

    for (const [key, score] of scores.slice(0, 3)) {
      if (score > 30) {
        switch (key) {
          case 'gamePreference':
            reasons.push('당신의 취향과 잘 맞는 곳');
            break;
          case 'visitHistory':
            reasons.push('자주 가시는 스타일의 맛집');
            break;
          case 'followingCurators':
            reasons.push('팔로우한 맛잘알이 추천');
            break;
          case 'socialInfluence':
            reasons.push('친구들이 좋아하는 곳');
            break;
          case 'timeContext':
            reasons.push('지금 시간대에 딱 좋은 곳');
            break;
          case 'trending':
            reasons.push('요즘 핫한 맛집');
            break;
        }
      }
    }

    return reasons.length > 0 ? reasons.join(', ') : '새로운 맛집 발견!';
  }

  /**
   * 추천 신뢰도 계산
   */
  calculateConfidence(score) {
    if (score >= 80) return 'very_high';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'very_low';
  }

  /**
   * Helper 함수들
   */
  getPriceRangeKey(priceRange) {
    const mapping = {
      '₩': 'cheap',
      '₩₩': 'moderate',
      '₩₩₩': 'expensive',
      '₩₩₩₩': 'luxury'
    };
    return mapping[priceRange] || 'moderate';
  }

  getMealTimeFromHour(hour) {
    if (hour >= 6 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 14) return 'lunch';
    if (hour >= 14 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'dinner';
    return 'latenight';
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 지구 반경 (km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  isSameArea(restaurant1, restaurant2) {
    if (!restaurant1.coordinates || !restaurant2.coordinates) return false;
    const distance = this.calculateDistance(
      restaurant1.coordinates.lat,
      restaurant1.coordinates.lng,
      restaurant2.coordinates.lat,
      restaurant2.coordinates.lng
    );
    return distance < 2; // 2km 이내면 같은 지역
  }

  isSimilarRestaurant(restaurant1, restaurant2) {
    if (!restaurant1 || !restaurant2) return false;
    
    // 같은 카테고리
    if (restaurant1.category === restaurant2.category) return true;
    
    // 비슷한 가격대
    if (restaurant1.priceRange === restaurant2.priceRange) return true;
    
    // 공통 태그가 많으면
    const tags1 = new Set(restaurant1.tags || []);
    const tags2 = new Set(restaurant2.tags || []);
    const commonTags = [...tags1].filter(tag => tags2.has(tag));
    
    return commonTags.length >= 2;
  }

  /**
   * 추천 로그 저장
   */
  async logRecommendations(userId, recommendations, context) {
    // 추천 이력 저장 (분석 및 개선용)
    const log = {
      userId,
      recommendations: recommendations.map(r => ({
        restaurantId: r.restaurant._id,
        score: r.totalScore,
        breakdown: r.breakdown
      })),
      context,
      timestamp: new Date()
    };
    
    // RecommendationLog 모델에 저장 (별도 구현 필요)
    // await RecommendationLog.create(log);
  }

  /**
   * 기본 추천 (신규 사용자용)
   */
  async getDefaultRecommendations(context, limit) {
    const query = {};
    
    // 위치 기반 필터링
    if (context.location) {
      query.coordinates = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [context.location.lng, context.location.lat]
          },
          $maxDistance: 5000 // 5km 이내
        }
      };
    }

    // 인기 레스토랑 우선
    const restaurants = await Restaurant.find(query)
      .sort({ averageRating: -1, reviewCount: -1 })
      .limit(limit);

    return restaurants.map(restaurant => ({
      restaurant,
      totalScore: restaurant.averageRating * 20,
      breakdown: { popularity: restaurant.averageRating * 20 },
      explanation: '인기 맛집',
      confidence: 'medium'
    }));
  }
}

module.exports = new RecommendationService();