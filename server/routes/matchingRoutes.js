const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const TasteProfile = require('../models/TasteProfile');

// 매칭 후보 사용자들 가져오기
router.get('/explore', protect, async (req, res) => {
  try {
    const { distance = 50, minMatchRate = 70, tasteProfile = 'all' } = req.query;
    const currentUser = req.user;

    // 이미 매칭된 사용자들과 차단된 사용자들 제외
    const excludeUsers = [
      ...currentUser.matches || [],
      ...currentUser.blocked || [],
      currentUser._id
    ];

    // 필터 조건 구성
    let matchQuery = {
      _id: { $nin: excludeUsers },
      location: { $exists: true }
    };

    if (tasteProfile !== 'all') {
      matchQuery['tasteProfile.type'] = tasteProfile;
    }

    const candidates = await User.find(matchQuery)
      .select('username profileImage tasteProfile location bio age')
      .limit(10);

    // 매칭률 계산 및 정렬
    const candidatesWithMatchRate = candidates.map(candidate => {
      const matchRate = calculateMatchRate(currentUser.tasteProfile, candidate.tasteProfile);
      
      if (matchRate < minMatchRate) return null;

      return {
        id: candidate._id,
        username: candidate.username,
        profileImage: candidate.profileImage || '/api/placeholder/400/400',
        distance: Math.random() * distance, // 실제 거리 계산 로직 필요
        matchRate,
        tasteProfile: candidate.tasteProfile?.type || '미식 탐험가',
        tasteStats: generateTasteStats(candidate.tasteProfile),
        tasteTags: generateTasteTags(candidate.tasteProfile),
        favoriteRestaurants: [], // 실제 맛집 데이터 연동 필요
        bio: candidate.bio,
        age: candidate.age,
        location: candidate.location?.city || '서울',
        region: candidate.location?.district || '강남'
      };
    }).filter(Boolean);

    // 매칭률 순으로 정렬
    candidatesWithMatchRate.sort((a, b) => b.matchRate - a.matchRate);

    res.json({
      success: true,
      data: candidatesWithMatchRate
    });
  } catch (error) {
    console.error('매칭 후보 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '매칭 후보 조회에 실패했습니다.'
    });
  }
});

// 좋아요 보내기
router.post('/like/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    // 상대방이 나를 이미 좋아했는지 확인
    const targetUser = await User.findById(userId);
    const isMatch = targetUser.likes && targetUser.likes.includes(currentUser._id);

    // 내 좋아요 목록에 추가
    await User.findByIdAndUpdate(currentUser._id, {
      $addToSet: { likes: userId }
    });

    if (isMatch) {
      // 매치 성사! 양방향으로 matches에 추가
      await User.findByIdAndUpdate(currentUser._id, {
        $addToSet: { matches: userId }
      });
      await User.findByIdAndUpdate(userId, {
        $addToSet: { matches: currentUser._id }
      });

      res.json({
        success: true,
        isMatch: true,
        message: '매치가 성사되었습니다!'
      });
    } else {
      res.json({
        success: true,
        isMatch: false,
        message: '좋아요를 보냈습니다.'
      });
    }
  } catch (error) {
    console.error('좋아요 실패:', error);
    res.status(500).json({
      success: false,
      message: '좋아요 처리에 실패했습니다.'
    });
  }
});

// 슈퍼라이크 보내기
router.post('/superlike/:userId', protect, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = req.user;

    // 슈퍼라이크 제한 확인 (일일 3개 제한)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaySuperLikes = currentUser.superLikes?.filter(
      like => new Date(like.date) >= today
    ).length || 0;

    if (todaySuperLikes >= 3) {
      return res.status(400).json({
        success: false,
        message: '일일 슈퍼라이크 한도를 초과했습니다.'
      });
    }

    // 슈퍼라이크 추가
    await User.findByIdAndUpdate(currentUser._id, {
      $addToSet: { 
        superLikes: { 
          user: userId, 
          date: new Date() 
        }
      }
    });

    // 상대방에게 알림 (향후 구현)
    
    res.json({
      success: true,
      message: '슈퍼라이크를 보냈습니다!'
    });
  } catch (error) {
    console.error('슈퍼라이크 실패:', error);
    res.status(500).json({
      success: false,
      message: '슈퍼라이크 처리에 실패했습니다.'
    });
  }
});

// 매칭된 사용자들 가져오기
router.get('/matches', protect, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id)
      .populate('matches', 'username profileImage tasteProfile location');

    const matches = currentUser.matches.map(match => ({
      id: match._id,
      username: match.username,
      profileImage: match.profileImage || '/api/placeholder/100/100',
      matchRate: calculateMatchRate(currentUser.tasteProfile, match.tasteProfile),
      matchedAt: '2시간 전', // 실제 매칭 시간 필요
      isNew: true,
      tasteProfile: match.tasteProfile?.type || '미식 탐험가',
      tasteStats: generateTasteStats(match.tasteProfile),
      distance: Math.random() * 10,
      region: match.location?.district || '강남'
    }));

    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('매칭 목록 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '매칭 목록 조회에 실패했습니다.'
    });
  }
});

// 추천 친구 가져오기
router.get('/recommended', protect, async (req, res) => {
  try {
    const currentUser = req.user;
    
    // AI 기반 추천 로직 (현재는 간단한 버전)
    const recommended = await User.find({
      _id: { $ne: currentUser._id },
      'tasteProfile.type': { $exists: true }
    })
    .select('username profileImage tasteProfile')
    .limit(5);

    const recommendedWithScore = recommended.map(user => {
      const matchRate = calculateMatchRate(currentUser.tasteProfile, user.tasteProfile);
      const commonTastes = [];
      
      // 공통 취향 분석
      if (Math.abs((currentUser.tasteProfile?.spicyTolerance || 3) - (user.tasteProfile?.spicyTolerance || 3)) <= 1) {
        commonTastes.push('매운맛 선호도');
      }
      if (currentUser.tasteProfile?.pricePreference === user.tasteProfile?.pricePreference) {
        commonTastes.push('가격대');
      }
      if (Math.abs((currentUser.tasteProfile?.adventureLevel || 3) - (user.tasteProfile?.adventureLevel || 3)) <= 1) {
        commonTastes.push('새로운 맛 도전');
      }
      
      return {
        id: user._id,
        username: user.username,
        profileImage: user.profileImage || '/api/placeholder/100/100',
        matchRate,
        tasteProfile: user.tasteProfile?.type || '미식 탐험가',
        tasteStats: generateTasteStats(user.tasteProfile),
        commonTastes: commonTastes.length > 0 ? commonTastes : ['미식 취향'],
        region: user.location?.district || '강남',
        bio: user.bio || '맛있는 음식과 좋은 사람들을 좋아합니다'
      };
    });

    res.json({
      success: true,
      data: recommendedWithScore
    });
  } catch (error) {
    console.error('추천 친구 조회 실패:', error);
    res.status(500).json({
      success: false,
      message: '추천 친구 조회에 실패했습니다.'
    });
  }
});

// 헬퍼 함수들
function calculateMatchRate(profile1, profile2) {
  if (!profile1 || !profile2) return Math.floor(Math.random() * 30) + 60;
  
  // 취향 점수를 기반으로 매칭률 계산
  let totalDifference = 0;
  let weightSum = 0;
  
  // 각 취향 요소별 가중치와 차이 계산
  const factors = {
    spicyTolerance: { weight: 3, value1: profile1.spicyTolerance || 3, value2: profile2.spicyTolerance || 3 },
    sweetPreference: { weight: 2, value1: profile1.sweetPreference || 3, value2: profile2.sweetPreference || 3 },
    adventureLevel: { weight: 2.5, value1: profile1.adventureLevel || 3, value2: profile2.adventureLevel || 3 },
    healthConsciousness: { weight: 1.5, value1: profile1.healthConsciousness || 3, value2: profile2.healthConsciousness || 3 }
  };
  
  for (const [key, factor] of Object.entries(factors)) {
    const diff = Math.abs(factor.value1 - factor.value2);
    // 차이가 작을수록 점수가 높음 (0~5 스케일에서)
    const similarity = (5 - diff) / 5;
    totalDifference += similarity * factor.weight;
    weightSum += factor.weight;
  }
  
  // 기본 점수 60 + 유사도 점수 (최대 39)
  const similarityScore = (totalDifference / weightSum) * 39;
  let finalScore = 60 + similarityScore;
  
  // 추가 보너스 점수
  if (profile1.type === profile2.type) finalScore += 5; // 같은 타입이면 보너스
  if (profile1.pricePreference === profile2.pricePreference) finalScore += 3;
  if (profile1.atmosphereStyle?.some(style => profile2.atmosphereStyle?.includes(style))) finalScore += 2;
  
  return Math.min(Math.round(finalScore), 99);
}

function generateTasteTags(tasteProfile) {
  const tags = [];
  
  if (tasteProfile?.spicyTolerance > 3) tags.push('매운맛 마스터');
  if (tasteProfile?.sweetPreference > 3) tags.push('디저트 러버');
  if (tasteProfile?.adventureLevel > 3) tags.push('모험가');
  if (tasteProfile?.healthConsciousness > 3) tags.push('건강 중시');
  if (tasteProfile?.atmosphereStyle?.includes('trendy')) tags.push('트렌디');
  if (tasteProfile?.atmosphereStyle?.includes('quiet')) tags.push('조용한 분위기');
  if (tasteProfile?.pricePreference === 'luxury') tags.push('파인다이닝');
  if (tasteProfile?.pricePreference === 'budget') tags.push('가성비');
  
  return tags.length > 0 ? tags : ['미식 탐험가'];
}

// 취향 통계 생성 함수
function generateTasteStats(tasteProfile) {
  if (!tasteProfile) {
    return {
      spicy: 50,
      sweet: 50,
      adventure: 50,
      healthy: 50
    };
  }
  
  return {
    spicy: (tasteProfile.spicyTolerance || 3) * 20,
    sweet: (tasteProfile.sweetPreference || 3) * 20,
    adventure: (tasteProfile.adventureLevel || 3) * 20,
    healthy: (tasteProfile.healthConsciousness || 3) * 20
  };
}

module.exports = router;