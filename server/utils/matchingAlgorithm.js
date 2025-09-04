const User = require('../models/User');

// Calculate taste similarity between two users
function calculateTasteSimilarity(user1, user2) {
  if (!user1.tasteProfile || !user2.tasteProfile) return 0;

  const scores1 = user1.tasteProfile.scores;
  const scores2 = user2.tasteProfile.scores;

  // Cosine similarity calculation
  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (const key in scores1) {
    if (scores2[key]) {
      dotProduct += scores1[key] * scores2[key];
      magnitude1 += scores1[key] * scores1[key];
      magnitude2 += scores2[key] * scores2[key];
    }
  }

  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  const cosineSimilarity = dotProduct / (Math.sqrt(magnitude1) * Math.sqrt(magnitude2));
  return Math.round(cosineSimilarity * 100); // Return as percentage
}

// Calculate interaction score based on common likes and follows
function calculateInteractionScore(user1, user2) {
  let score = 0;

  // Common liked restaurants
  const commonLikedRestaurants = user1.likedRestaurants.filter(r1 =>
    user2.likedRestaurants.some(r2 => r1.restaurant.toString() === r2.restaurant.toString())
  );
  score += commonLikedRestaurants.length * 10;

  // Common liked playlists
  const commonLikedPlaylists = user1.likedPlaylists.filter(p1 =>
    user2.likedPlaylists.some(p2 => p1.toString() === p2.toString())
  );
  score += commonLikedPlaylists.length * 5;

  // Check if they follow each other
  const user1FollowsUser2 = user1.following.some(f => f.user.toString() === user2._id.toString());
  const user2FollowsUser1 = user2.following.some(f => f.user.toString() === user1._id.toString());
  
  if (user1FollowsUser2 && user2FollowsUser1) {
    score += 30; // Mutual follow
  } else if (user1FollowsUser2 || user2FollowsUser1) {
    score += 15; // One-way follow
  }

  // Common following (following same people)
  const commonFollowing = user1.following.filter(f1 =>
    user2.following.some(f2 => f1.user.toString() === f2.user.toString())
  );
  score += commonFollowing.length * 3;

  return score;
}

// Calculate location proximity score
function calculateLocationScore(user1, user2) {
  if (!user1.location || !user2.location) return 0;

  // Same district gets highest score
  if (user1.location.district === user2.location.district) return 100;
  
  // Same city gets medium score
  if (user1.location.city === user2.location.city) return 50;

  // Different cities get low score
  return 10;
}

// Main matching algorithm
async function findMatches(userId, limit = 10) {
  try {
    const currentUser = await User.findById(userId)
      .populate('likedRestaurants.restaurant')
      .populate('likedPlaylists')
      .populate('following.user');

    if (!currentUser) {
      throw new Error('User not found');
    }

    // Get all other users (excluding blocked users)
    const otherUsers = await User.find({
      _id: { 
        $ne: userId,
        $nin: currentUser.blocked
      }
    })
    .populate('likedRestaurants.restaurant')
    .populate('likedPlaylists')
    .populate('following.user')
    .lean();

    // Calculate match scores for each user
    const matchScores = otherUsers.map(otherUser => {
      const tasteScore = calculateTasteSimilarity(currentUser, otherUser);
      const interactionScore = calculateInteractionScore(currentUser, otherUser);
      const locationScore = calculateLocationScore(currentUser, otherUser);

      // Weighted average
      const totalScore = (tasteScore * 0.4) + (interactionScore * 0.4) + (locationScore * 0.2);

      return {
        user: otherUser,
        scores: {
          taste: tasteScore,
          interaction: interactionScore,
          location: locationScore,
          total: Math.round(totalScore)
        },
        matchReasons: generateMatchReasons(currentUser, otherUser, { tasteScore, interactionScore, locationScore })
      };
    });

    // Sort by total score and return top matches
    matchScores.sort((a, b) => b.scores.total - a.scores.total);

    return matchScores.slice(0, limit);
  } catch (error) {
    console.error('Matching algorithm error:', error);
    throw error;
  }
}

// Generate reasons for the match
function generateMatchReasons(user1, user2, scores) {
  const reasons = [];

  if (scores.tasteScore > 70) {
    reasons.push('매우 비슷한 음식 취향');
  } else if (scores.tasteScore > 50) {
    reasons.push('비슷한 음식 취향');
  }

  // Check common liked restaurants
  const commonLikedRestaurants = user1.likedRestaurants.filter(r1 =>
    user2.likedRestaurants.some(r2 => r1.restaurant.toString() === r2.restaurant.toString())
  );
  
  if (commonLikedRestaurants.length > 0) {
    reasons.push(`${commonLikedRestaurants.length}개의 같은 맛집을 좋아함`);
  }

  // Check if following each other
  const user1FollowsUser2 = user1.following.some(f => f.user.toString() === user2._id.toString());
  const user2FollowsUser1 = user2.following.some(f => f.user.toString() === user1._id.toString());
  
  if (user1FollowsUser2 && user2FollowsUser1) {
    reasons.push('서로 팔로우 중');
  }

  // Location
  if (scores.locationScore === 100) {
    reasons.push('같은 동네');
  } else if (scores.locationScore === 50) {
    reasons.push('같은 도시');
  }

  // Taste profile type
  if (user1.tasteProfile?.type === user2.tasteProfile?.type) {
    const typeNames = {
      spicy_adventurer: '매운맛 러버',
      trendy_explorer: '트렌드 세터',
      comfort_lover: '편안함 추구',
      social_foodie: '소셜 푸디',
      budget_gourmet: '가성비 전문가',
      premium_diner: '프리미엄 미식가',
      solo_explorer: '혼밥 마스터',
      traditional_taste: '전통 미식가'
    };
    reasons.push(`둘 다 ${typeNames[user1.tasteProfile.type]}`);
  }

  return reasons;
}

// Get recommendations based on following
async function getFollowingBasedRecommendations(userId, limit = 10) {
  try {
    const user = await User.findById(userId)
      .populate('following.user');

    if (!user || user.following.length === 0) {
      return [];
    }

    // Get restaurants liked by people I follow
    const followingUserIds = user.following.map(f => f.user._id);
    
    const followingUsers = await User.find({
      _id: { $in: followingUserIds }
    })
    .populate('likedRestaurants.restaurant')
    .lean();

    // Aggregate restaurant recommendations
    const restaurantScores = {};
    
    followingUsers.forEach(followingUser => {
      followingUser.likedRestaurants.forEach(liked => {
        const restaurantId = liked.restaurant._id.toString();
        
        // Skip if current user already liked this restaurant
        const alreadyLiked = user.likedRestaurants.some(
          r => r.restaurant.toString() === restaurantId
        );
        
        if (!alreadyLiked) {
          if (!restaurantScores[restaurantId]) {
            restaurantScores[restaurantId] = {
              restaurant: liked.restaurant,
              score: 0,
              likedBy: []
            };
          }
          
          restaurantScores[restaurantId].score++;
          restaurantScores[restaurantId].likedBy.push(followingUser.username);
        }
      });
    });

    // Convert to array and sort by score
    const recommendations = Object.values(restaurantScores)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return recommendations;
  } catch (error) {
    console.error('Following-based recommendations error:', error);
    throw error;
  }
}

module.exports = {
  findMatches,
  getFollowingBasedRecommendations,
  calculateTasteSimilarity,
  calculateInteractionScore,
  calculateLocationScore
};