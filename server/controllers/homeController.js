const Playlist = require('../models/Playlist');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const CommunityPost = require('../models/CommunityPost');

// 홈 화면 데이터 조회 (인증 맛집, 친구 맛집, 커뮤니티)
const getHomeData = async (req, res) => {
  try {
    const userId = req.user?._id;
    
    // 1. 인증된 플레이리스트 - 하드코딩된 데이터 사용하되 실제 카운트는 DB에서
    const certifiedData = [
      {
        id: 'cert-1',
        name: '미슐랭 가이드 서울 2024',
        description: '미슐랭이 인정한 서울의 맛집들',
        creator: '미슐랭 가이드',
        isVerified: true,
        tags: ['미슐랭', '파인다이닝', '서울'],
        restaurantCount: 12,
        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'
      },
      {
        id: 'cert-2', 
        name: '백종원의 골목식당 BEST',
        description: '백종원이 극찬한 진짜 맛집들',
        creator: '백종원',
        isVerified: true,
        tags: ['백종원', '골목식당', '맛집'],
        restaurantCount: 15,
        imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'
      },
      {
        id: 'cert-3',
        name: '성시경의 먹을텐데 Pick',
        description: '성시경이 사랑한 맛집 리스트',
        creator: '성시경',
        isVerified: true,
        tags: ['성시경', '먹을텐데', '방송맛집'],
        restaurantCount: 10,
        imageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800'
      },
      {
        id: 'cert-4',
        name: '수요미식회 레전드',
        description: '수요미식회 역대 최고 평점 맛집',
        creator: '수요미식회',
        isVerified: true,
        tags: ['수요미식회', 'TV맛집', '레전드'],
        restaurantCount: 20,
        imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'
      },
      {
        id: 'cert-5',
        name: '흑백요리사 우승자의 Pick',
        description: '넷플릭스 흑백요리사 우승자 추천 맛집',
        creator: '에드워드 리',
        isVerified: true,
        tags: ['흑백요리사', '넷플릭스', '셰프추천'],
        restaurantCount: 8,
        imageUrl: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800'
      }
    ];

    // 각 플레이리스트에 대한 실제 DB 카운트 가져오기 또는 생성
    const certifiedWithUserData = await Promise.all(certifiedData.map(async (data) => {
      // 실제 플레이리스트가 DB에 있는지 확인
      let playlist = await Playlist.findOne({ 
        title: data.name
      });

      // 없으면 DB에 생성
      if (!playlist) {
        playlist = await Playlist.create({
          title: data.name,
          description: data.description,
          createdBy: userId || '68ae24c05bc3e3bec6069bf7', // 기본 관리자 ID
          restaurants: [],
          tags: data.tags,
          isPublic: true,
          isActive: true,
          category: '맛집투어',
          likes: [],
          saves: [],
          viewCount: 0
        });
      }

      // 실제 카운트 가져오기
      const likeCount = playlist.likes?.length || 0;
      const saveCount = playlist.saves?.length || 0;
      const viewCount = playlist.viewCount || 0;

      let isLiked = false;
      let isSaved = false;

      if (userId) {
        isLiked = playlist.likes?.some(like => 
          like.user?.toString() === userId.toString()
        );
        isSaved = playlist.saves?.some(save => 
          save.user?.toString() === userId.toString()
        );
      }

      return {
        _id: playlist._id,
        title: data.name,
        description: data.description,
        createdBy: {
          username: data.creator,
          isVerified: data.isVerified
        },
        tags: data.tags,
        restaurants: Array(data.restaurantCount).fill({}),
        coverImage: data.imageUrl,
        likeCount,
        saveCount,
        viewCount,
        isLiked,
        isSaved
      };
    }));

    // 2. 친구들의 플레이리스트 가져오기 (팔로잉 기반)
    let friendPlaylists = [];
    if (userId) {
      const currentUser = await User.findById(userId).select('following');
      
      if (currentUser?.following?.length > 0) {
        friendPlaylists = await Playlist.find({
          createdBy: { $in: currentUser.following },
          isPublic: true,
          isActive: true
        })
        .populate('createdBy', 'username profileImage isVerified')
        .populate({
          path: 'restaurants.restaurant',
          select: 'name address category images averageRating'
        })
        .sort('-createdAt')
        .limit(10);
      }
    }
    
    // 친구 플레이리스트가 없으면 인기 플레이리스트 표시
    if (friendPlaylists.length === 0) {
      friendPlaylists = await Playlist.find({
        isPublic: true,
        isActive: true
      })
      .populate('createdBy', 'username profileImage isVerified')
      .populate({
        path: 'restaurants.restaurant',
        select: 'name address category images averageRating'
      })
      .sort('-likeCount -viewCount')
      .limit(10);
    }

    const friendWithUserData = friendPlaylists.map(playlist => {
      const playlistObj = playlist.toObject();
      
      // 실제 통계
      playlistObj.likeCount = playlist.likes?.length || 0;
      playlistObj.saveCount = playlist.saves?.length || 0;
      playlistObj.viewCount = playlist.viewCount || 0;
      
      if (userId) {
        playlistObj.isLiked = playlist.likes?.some(like => 
          like.user?.toString() === userId.toString()
        );
        playlistObj.isSaved = playlist.saves?.some(save => 
          save.user?.toString() === userId.toString()
        );
      }
      
      return playlistObj;
    });

    // 3. 커뮤니티 트렌딩 포스트 가져오기
    const trendingPosts = await CommunityPost.find({
      isActive: true
    })
    .populate('author', 'username profileImage isVerified')
    .sort('-likeCount -viewCount')
    .limit(5);

    const communityWithUserData = trendingPosts.map(post => {
      const postObj = post.toObject();
      
      // 실제 통계
      postObj.likeCount = post.likes?.length || 0;
      postObj.commentCount = post.comments?.length || 0;
      postObj.saveCount = post.saves?.length || 0;
      
      if (userId) {
        postObj.isLiked = post.likes?.some(like => 
          like.user?.toString() === userId.toString()
        );
        postObj.isSaved = post.saves?.some(save => 
          save.user?.toString() === userId.toString()
        );
      }
      
      return postObj;
    });

    // 4. 통계 데이터
    const stats = {
      totalCertifiedPlaylists: certifiedWithUserData.length,
      totalFriendPlaylists: friendPlaylists.length,
      totalCommunityPosts: await CommunityPost.countDocuments({ isActive: true }),
      totalRestaurants: await Restaurant.countDocuments(),
      totalUsers: await User.countDocuments(),
      totalVerifiedUsers: await User.countDocuments({ isVerified: true })
    };

    res.json({
      success: true,
      data: {
        certified: certifiedWithUserData,
        friends: friendWithUserData,
        community: communityWithUserData,
        stats
      }
    });
  } catch (error) {
    console.error('Get home data error:', error);
    res.status(500).json({ 
      success: false, 
      message: '홈 데이터를 불러오는데 실패했습니다' 
    });
  }
};

// 플레이리스트 좋아요 토글
const togglePlaylistLike = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: '로그인이 필요합니다' 
      });
    }

    // ID나 title로 플레이리스트 찾기
    let playlist;
    if (playlistId.startsWith('cert-')) {
      // 더미 ID인 경우 title로 찾기
      const titles = {
        'cert-1': '미슐랭 가이드 서울 2024',
        'cert-2': '백종원의 골목식당 BEST',
        'cert-3': '성시경의 먹을텐데 Pick',
        'cert-4': '수요미식회 레전드',
        'cert-5': '흑백요리사 우승자의 Pick'
      };
      playlist = await Playlist.findOne({ title: titles[playlistId] });
    } else {
      playlist = await Playlist.findById(playlistId);
    }
    
    if (!playlist) {
      return res.status(404).json({ 
        success: false, 
        message: '플레이리스트를 찾을 수 없습니다' 
      });
    }

    const likeIndex = playlist.likes.findIndex(like => 
      like.user?.toString() === userId.toString()
    );

    let isLiked;
    if (likeIndex > -1) {
      // 좋아요 취소
      playlist.likes.splice(likeIndex, 1);
      isLiked = false;
    } else {
      // 좋아요 추가
      playlist.likes.push({ 
        user: userId,
        createdAt: new Date()
      });
      isLiked = true;
    }

    await playlist.save();

    res.json({
      success: true,
      data: {
        isLiked,
        likeCount: playlist.likes.length
      }
    });
  } catch (error) {
    console.error('Toggle playlist like error:', error);
    res.status(500).json({ 
      success: false, 
      message: '좋아요 처리에 실패했습니다' 
    });
  }
};

// 플레이리스트 저장 토글
const togglePlaylistSave = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: '로그인이 필요합니다' 
      });
    }

    // ID나 title로 플레이리스트 찾기
    let playlist;
    if (playlistId.startsWith('cert-')) {
      // 더미 ID인 경우 title로 찾기
      const titles = {
        'cert-1': '미슐랭 가이드 서울 2024',
        'cert-2': '백종원의 골목식당 BEST',
        'cert-3': '성시경의 먹을텐데 Pick',
        'cert-4': '수요미식회 레전드',
        'cert-5': '흑백요리사 우승자의 Pick'
      };
      playlist = await Playlist.findOne({ title: titles[playlistId] });
    } else {
      playlist = await Playlist.findById(playlistId);
    }
    
    if (!playlist) {
      return res.status(404).json({ 
        success: false, 
        message: '플레이리스트를 찾을 수 없습니다' 
      });
    }

    const saveIndex = playlist.saves.findIndex(save => 
      save.user?.toString() === userId.toString()
    );

    let isSaved;
    if (saveIndex > -1) {
      // 저장 취소
      playlist.saves.splice(saveIndex, 1);
      isSaved = false;
    } else {
      // 저장 추가
      playlist.saves.push({ 
        user: userId,
        savedAt: new Date()
      });
      isSaved = true;
    }

    await playlist.save();

    // 사용자의 savedPlaylists에도 업데이트
    const user = await User.findById(userId);
    if (isSaved) {
      if (!user.savedPlaylists.includes(playlistId)) {
        user.savedPlaylists.push(playlistId);
      }
    } else {
      user.savedPlaylists = user.savedPlaylists.filter(
        id => id.toString() !== playlistId
      );
    }
    await user.save();

    res.json({
      success: true,
      data: {
        isSaved,
        saveCount: playlist.saves.length
      }
    });
  } catch (error) {
    console.error('Toggle playlist save error:', error);
    res.status(500).json({ 
      success: false, 
      message: '저장 처리에 실패했습니다' 
    });
  }
};

// 플레이리스트 조회수 증가
const incrementPlaylistView = async (req, res) => {
  try {
    const { playlistId } = req.params;
    
    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!playlist) {
      return res.status(404).json({ 
        success: false, 
        message: '플레이리스트를 찾을 수 없습니다' 
      });
    }

    res.json({
      success: true,
      data: {
        viewCount: playlist.viewCount
      }
    });
  } catch (error) {
    console.error('Increment view error:', error);
    res.status(500).json({ 
      success: false, 
      message: '조회수 업데이트에 실패했습니다' 
    });
  }
};

// 실시간 통계 조회
const getRealtimeStats = async (req, res) => {
  try {
    const stats = {
      totalPlaylists: await Playlist.countDocuments({ isActive: true }),
      totalRestaurants: await Restaurant.countDocuments(),
      totalUsers: await User.countDocuments(),
      totalPosts: await CommunityPost.countDocuments({ isActive: true }),
      activeUsers: await User.countDocuments({ 
        lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      }),
      todayPosts: await CommunityPost.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      })
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: '통계를 불러오는데 실패했습니다' 
    });
  }
};

module.exports = {
  getHomeData,
  togglePlaylistLike,
  togglePlaylistSave,
  incrementPlaylistView,
  getRealtimeStats
};