const GlobalTasteConnection = require('../models/GlobalTasteConnection');
const { UserTasteProfile } = require('../models/TasteProfile');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

// 글로벌 프로필 생성/업데이트
const updateGlobalProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      location,
      languages,
      culturalAdventure,
      socialLevel,
      openToTravelers,
      publicProfile
    } = req.body;

    const globalProfile = await GlobalTasteConnection.findOneAndUpdate(
      { user: userId },
      {
        user: userId,
        location,
        globalPreferences: {
          openToTravelers: openToTravelers !== undefined ? openToTravelers : true,
          languages: languages || ['ko'],
          culturalAdventure: culturalAdventure || 3,
          socialLevel: socialLevel || 3
        },
        publicProfile: publicProfile || {
          shareLocation: true,
          shareRecommendations: true,
          shareTravelHistory: false
        }
      },
      { upsert: true, new: true }
    ).populate('user', 'username profileImage bio');

    res.json({
      globalProfile,
      message: '글로벌 프로필이 업데이트되었습니다!'
    });
  } catch (error) {
    console.error('Error updating global profile:', error);
    res.status(500).json({ message: '글로벌 프로필 업데이트 중 오류가 발생했습니다' });
  }
};

// 특정 지역의 취향 매칭 사용자들 찾기
const discoverByLocation = async (req, res) => {
  try {
    const { country, city, lat, lng, radius = 50000 } = req.query; // 50km 기본
    const userId = req.user._id;

    // 사용자의 취향 프로필 가져오기
    const userTasteProfile = await UserTasteProfile.findOne({ user: userId })
      .populate('typeScores.tasteType');

    if (!userTasteProfile) {
      return res.status(400).json({ 
        message: '먼저 취향 진단을 완료해주세요' 
      });
    }

    let query = {
      user: { $ne: userId },
      'globalPreferences.openToTravelers': true
    };

    // 위치 기반 검색
    if (lat && lng) {
      query['location.coordinates'] = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    } else if (country) {
      query['location.country'] = country;
      if (city) {
        query['location.city'] = city;
      }
    }

    const localUsers = await GlobalTasteConnection.find(query)
      .populate({
        path: 'user',
        select: 'username profileImage bio trustScore',
        populate: {
          path: 'visitedRestaurants.restaurant',
          select: 'name category images'
        }
      })
      .populate('localRecommendations.restaurant')
      .limit(50);

    // 취향 호환성 계산
    const matchedUsers = await Promise.all(
      localUsers.map(async (localUser) => {
        const otherTasteProfile = await UserTasteProfile.findOne({ 
          user: localUser.user._id 
        }).populate('typeScores.tasteType');

        let compatibility = 0;
        let compatibilityGrade = 'C';

        if (otherTasteProfile && otherTasteProfile.typeScores) {
          compatibility = calculateGlobalCompatibility(userTasteProfile, otherTasteProfile, localUser);
          
          if (compatibility >= 85) compatibilityGrade = 'S';
          else if (compatibility >= 75) compatibilityGrade = 'A';
          else if (compatibility >= 65) compatibilityGrade = 'B';
        }

        return {
          user: localUser.user,
          location: localUser.location,
          compatibility,
          compatibilityGrade,
          languages: localUser.globalPreferences.languages,
          culturalAdventure: localUser.globalPreferences.culturalAdventure,
          socialLevel: localUser.globalPreferences.socialLevel,
          localRecommendations: localUser.localRecommendations.slice(0, 3),
          distance: calculateDistance(
            lat, lng, 
            localUser.location.coordinates?.lat, 
            localUser.location.coordinates?.lng
          )
        };
      })
    );

    // 호환성 순으로 정렬
    const sortedMatches = matchedUsers
      .sort((a, b) => b.compatibility - a.compatibility)
      .slice(0, 20);

    res.json({
      location: { country, city, lat: parseFloat(lat), lng: parseFloat(lng) },
      matchedUsers: sortedMatches,
      totalFound: sortedMatches.length
    });
  } catch (error) {
    console.error('Error in location discovery:', error);
    res.status(500).json({ message: '지역 탐색 중 오류가 발생했습니다' });
  }
};

// 여행 계획 기반 추천
const getTravelRecommendations = async (req, res) => {
  try {
    const { destinations } = req.body; // [{ country, city, lat, lng }]
    const userId = req.user._id;

    const userTasteProfile = await UserTasteProfile.findOne({ user: userId })
      .populate('typeScores.tasteType');

    if (!userTasteProfile) {
      return res.status(400).json({ 
        message: '먼저 취향 진단을 완료해주세요' 
      });
    }

    const travelRecommendations = await Promise.all(
      destinations.map(async (destination) => {
        // 해당 지역의 로컬 전문가들 찾기
        const localExperts = await GlobalTasteConnection.find({
          'location.country': destination.country,
          'location.city': destination.city,
          'globalPreferences.openToTravelers': true,
          'localRecommendations.0': { $exists: true }
        })
        .populate('user', 'username profileImage bio trustScore')
        .populate({
          path: 'localRecommendations.restaurant',
          select: 'name address category priceRange averageRating images'
        })
        .limit(10);

        // 취향 매칭된 추천만 필터링
        const matchedRecommendations = localExperts
          .filter(expert => {
            return expert.localRecommendations.some(rec => 
              rec.recommendedFor.some(type => 
                userTasteProfile.typeScores.some(score => 
                  score.typeKoreanName === type && score.percentage > 15
                )
              )
            );
          })
          .map(expert => ({
            localExpert: expert.user,
            location: expert.location,
            recommendations: expert.localRecommendations
              .filter(rec => 
                rec.recommendedFor.some(type => 
                  userTasteProfile.typeScores.some(score => 
                    score.typeKoreanName === type && score.percentage > 15
                  )
                )
              )
              .slice(0, 3)
          }));

        return {
          destination,
          experts: matchedRecommendations.slice(0, 5)
        };
      })
    );

    res.json({
      travelRecommendations,
      userTasteProfile: {
        primaryType: userTasteProfile.primaryType,
        topTypes: userTasteProfile.typeScores
          .filter(score => score.percentage > 15)
          .slice(0, 3)
      }
    });
  } catch (error) {
    console.error('Error getting travel recommendations:', error);
    res.status(500).json({ message: '여행 추천을 가져오는 중 오류가 발생했습니다' });
  }
};

// 로컬 추천 등록
const addLocalRecommendation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { restaurantId, description, tags, recommendedFor } = req.body;

    const globalProfile = await GlobalTasteConnection.findOne({ user: userId });

    if (!globalProfile) {
      return res.status(400).json({ 
        message: '먼저 글로벌 프로필을 설정해주세요' 
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: '레스토랑을 찾을 수 없습니다' });
    }

    // 중복 추천 확인
    const existingRecommendation = globalProfile.localRecommendations.find(
      rec => rec.restaurant.toString() === restaurantId
    );

    if (existingRecommendation) {
      return res.status(400).json({ message: '이미 추천한 레스토랑입니다' });
    }

    globalProfile.localRecommendations.push({
      restaurant: restaurantId,
      description,
      tags: tags || ['local-favorite'],
      recommendedFor: recommendedFor || ['모험가']
    });

    await globalProfile.save();

    await globalProfile.populate('localRecommendations.restaurant');

    res.json({
      recommendation: globalProfile.localRecommendations[globalProfile.localRecommendations.length - 1],
      message: '로컬 추천이 등록되었습니다!'
    });
  } catch (error) {
    console.error('Error adding local recommendation:', error);
    res.status(500).json({ message: '로컬 추천 등록 중 오류가 발생했습니다' });
  }
};

// 글로벌 호환성 계산 (일반 호환성 + 위치/문화 보너스)
const calculateGlobalCompatibility = (userProfile, otherProfile, globalUser) => {
  // 기본 취향 호환성
  let compatibility = 0;
  
  if (userProfile.typeScores && otherProfile.typeScores) {
    const userVector = userProfile.typeScores.map(score => score.percentage || 0);
    const otherVector = otherProfile.typeScores.map(score => score.percentage || 0);

    let dotProduct = 0;
    let userMagnitude = 0;
    let otherMagnitude = 0;

    for (let i = 0; i < Math.min(userVector.length, otherVector.length); i++) {
      dotProduct += userVector[i] * otherVector[i];
      userMagnitude += userVector[i] * userVector[i];
      otherMagnitude += otherVector[i] * otherVector[i];
    }

    if (userMagnitude > 0 && otherMagnitude > 0) {
      compatibility = (dotProduct / (Math.sqrt(userMagnitude) * Math.sqrt(otherMagnitude))) * 100;
    }
  }

  // 글로벌 보너스
  if (globalUser.globalPreferences) {
    // 문화적 모험심 유사도
    if (globalUser.globalPreferences.culturalAdventure >= 4) {
      compatibility += 5;
    }

    // 소셜 레벨 보너스
    if (globalUser.globalPreferences.socialLevel >= 4) {
      compatibility += 3;
    }

    // 로컬 추천이 많을수록 보너스
    if (globalUser.localRecommendations && globalUser.localRecommendations.length > 0) {
      compatibility += Math.min(globalUser.localRecommendations.length * 2, 10);
    }
  }

  return Math.min(100, Math.max(0, Math.round(compatibility * 10) / 10));
};

// 거리 계산 (km)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  if (!lat1 || !lng1 || !lat2 || !lng2) return null;

  const R = 6371; // 지구 반지름 (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return Math.round(R * c);
};

module.exports = {
  updateGlobalProfile,
  discoverByLocation,
  getTravelRecommendations,
  addLocalRecommendation
};