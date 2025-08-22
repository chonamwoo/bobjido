const Playlist = require('../models/Playlist');
const Restaurant = require('../models/Restaurant');
const User = require('../models/User');
const PlaylistRestaurant = require('../models/PlaylistRestaurant');

const getPlaylists = async (req, res) => {
  try {
    const { 
      category, 
      tags, 
      city, 
      district, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1, 
      limit = 12 
    } = req.query;
    
    let query = { isPublic: true, isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    
    if (city || district) {
      if (city) query['region.city'] = city;
      if (district) query['region.district'] = district;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const playlists = await Playlist.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'username profileImage trustScore')
      .populate('restaurants.restaurant', 'name address images category')
      .lean();
    
    const playlistsWithCounts = playlists.map(playlist => ({
      ...playlist,
      name: playlist.title, // Add name field for Explore page compatibility
      likeCount: playlist.likes ? playlist.likes.length : 0,
      saveCount: playlist.saves ? playlist.saves.length : 0,
      completionCount: playlist.completions ? playlist.completions.length : 0,
      restaurantCount: playlist.restaurants ? playlist.restaurants.length : 0,
      followerCount: playlist.saves ? playlist.saves.length : 0, // Add followerCount
      isLiked: req.user ? playlist.likes && playlist.likes.some(like => like.user.toString() === req.user._id.toString()) : false,
      isSaved: req.user ? playlist.saves && playlist.saves.some(save => save.user.toString() === req.user._id.toString()) : false,
    }));
    
    const total = await Playlist.countDocuments(query);
    
    res.json({
      playlists: playlistsWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const getTrendingPlaylists = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const playlists = await Playlist.getTrending(parseInt(limit));
    
    const playlistsWithCounts = playlists.map(playlist => ({
      ...playlist.toObject(),
      likeCount: playlist.likes.length,
      saveCount: playlist.saves.length,
      completionCount: playlist.completions.length,
      restaurantCount: playlist.restaurants.length,
      isLiked: req.user ? playlist.likes.some(like => like.user.toString() === req.user._id.toString()) : false,
      isSaved: req.user ? playlist.saves.some(save => save.user.toString() === req.user._id.toString()) : false,
    }));
    
    res.json(playlistsWithCounts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const getPlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id)
      .populate('createdBy', 'username profileImage bio trustScore')
      .populate('collaborators.user', 'username profileImage')
      .populate('restaurants.restaurant')
      .populate('restaurants.addedBy', 'username profileImage')
      .populate('remixedFrom', 'title createdBy')
      .populate('remixes.playlist', 'title createdBy createdAt');
    
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }
    
    if (!playlist.canView(req.user?._id)) {
      return res.status(403).json({ message: '접근 권한이 없습니다' });
    }
    
    playlist.viewCount += 1;
    await playlist.save();
    
    const playlistData = {
      ...playlist.toObject(),
      likeCount: playlist.likes.length,
      saveCount: playlist.saves.length,
      completionCount: playlist.completions.length,
      restaurantCount: playlist.restaurants.length,
      isLiked: req.user ? playlist.likes.some(like => like.user.toString() === req.user._id.toString()) : false,
      isSaved: req.user ? playlist.saves.some(save => save.user.toString() === req.user._id.toString()) : false,
      canEdit: req.user ? playlist.canEdit(req.user._id) : false,
    };
    
    res.json(playlistData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const createPlaylist = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tags,
      isPublic = true,
      theme,
      targetAudience,
      estimatedCost,
      estimatedDuration,
    } = req.body;
    
    const playlist = new Playlist({
      title,
      description,
      category,
      tags: tags || [],
      isPublic,
      theme,
      targetAudience: targetAudience || [],
      estimatedCost,
      estimatedDuration,
      createdBy: req.user._id,
    });
    
    await playlist.save();
    await playlist.populate('createdBy', 'username profileImage');
    
    res.status(201).json({
      ...playlist.toObject(),
      likeCount: 0,
      saveCount: 0,
      completionCount: 0,
      restaurantCount: 0,
      isLiked: false,
      isSaved: false,
      canEdit: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }
    
    if (!playlist.canEdit(req.user._id)) {
      return res.status(403).json({ message: '수정 권한이 없습니다' });
    }
    
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        playlist[key] = updates[key];
      }
    });
    
    await playlist.save();
    await playlist.populate('createdBy', 'username profileImage');
    
    res.json({
      ...playlist.toObject(),
      likeCount: playlist.likes.length,
      saveCount: playlist.saves.length,
      completionCount: playlist.completions.length,
      restaurantCount: playlist.restaurants.length,
      canEdit: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }
    
    if (playlist.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '삭제 권한이 없습니다' });
    }
    
    await Playlist.findByIdAndDelete(req.params.id);
    
    res.json({ message: '플레이리스트가 삭제되었습니다' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const addRestaurantToPlaylist = async (req, res) => {
  try {
    const { restaurantId, personalNote, mustTry } = req.body;
    
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }
    
    if (!playlist.canEdit(req.user._id)) {
      return res.status(403).json({ message: '편집 권한이 없습니다' });
    }
    
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: '맛집을 찾을 수 없습니다' });
    }
    
    await playlist.addRestaurant(restaurantId, personalNote, req.user._id);
    
    if (mustTry && mustTry.length > 0) {
      const restaurantEntry = playlist.restaurants.find(
        r => r.restaurant.toString() === restaurantId
      );
      restaurantEntry.mustTry = mustTry;
      await playlist.save();
    }
    
    await playlist.populate('restaurants.restaurant');
    
    res.json({
      message: '맛집이 플레이리스트에 추가되었습니다',
      restaurants: playlist.restaurants,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || '서버 오류가 발생했습니다' });
  }
};

const removeRestaurantFromPlaylist = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }
    
    if (!playlist.canEdit(req.user._id)) {
      return res.status(403).json({ message: '편집 권한이 없습니다' });
    }
    
    await playlist.removeRestaurant(restaurantId);
    await playlist.populate('restaurants.restaurant');
    
    res.json({
      message: '맛집이 플레이리스트에서 제거되었습니다',
      restaurants: playlist.restaurants,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || '서버 오류가 발생했습니다' });
  }
};

const reorderPlaylistRestaurants = async (req, res) => {
  try {
    const { newOrder } = req.body;
    
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }
    
    if (!playlist.canEdit(req.user._id)) {
      return res.status(403).json({ message: '편집 권한이 없습니다' });
    }
    
    await playlist.reorderRestaurants(newOrder);
    await playlist.populate('restaurants.restaurant');
    
    res.json({
      message: '순서가 변경되었습니다',
      restaurants: playlist.restaurants,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message || '서버 오류가 발생했습니다' });
  }
};

const likePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }
    
    await playlist.toggleLike(req.user._id);
    
    const isLiked = playlist.likes.some(like => like.user.toString() === req.user._id.toString());
    
    res.json({
      isLiked,
      likeCount: playlist.likes.length,
      message: isLiked ? '좋아요를 눌렀습니다' : '좋아요를 취소했습니다',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const savePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }
    
    await playlist.toggleSave(req.user._id);
    
    const isSaved = playlist.saves.some(save => save.user.toString() === req.user._id.toString());
    
    const user = await User.findById(req.user._id);
    if (isSaved) {
      if (!user.savedPlaylists.includes(playlist._id)) {
        user.savedPlaylists.push(playlist._id);
      }
    } else {
      user.savedPlaylists = user.savedPlaylists.filter(
        id => id.toString() !== playlist._id.toString()
      );
    }
    await user.save();
    
    res.json({
      isSaved,
      saveCount: playlist.saves.length,
      message: isSaved ? '플레이리스트를 저장했습니다' : '저장을 취소했습니다',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const remixPlaylist = async (req, res) => {
  try {
    const originalPlaylist = await Playlist.findById(req.params.id);
    
    if (!originalPlaylist) {
      return res.status(404).json({ message: '원본 플레이리스트를 찾을 수 없습니다' });
    }
    
    if (!originalPlaylist.isPublic) {
      return res.status(403).json({ message: '비공개 플레이리스트는 리믹스할 수 없습니다' });
    }
    
    const { title, description, selectedRestaurants = [] } = req.body;
    
    const restaurants = selectedRestaurants.length > 0 
      ? originalPlaylist.restaurants.filter(r => selectedRestaurants.includes(r.restaurant.toString()))
      : originalPlaylist.restaurants;
    
    const remixedPlaylist = new Playlist({
      title: title || `${originalPlaylist.title} (리믹스)`,
      description: description || `${originalPlaylist.createdBy.username}님의 플레이리스트를 기반으로 만든 리믹스`,
      category: originalPlaylist.category,
      tags: [...originalPlaylist.tags, 'remix'],
      restaurants: restaurants.map((r, index) => ({
        restaurant: r.restaurant,
        order: index + 1,
        personalNote: r.personalNote,
        mustTry: r.mustTry,
        addedBy: req.user._id,
      })),
      remixedFrom: originalPlaylist._id,
      createdBy: req.user._id,
    });
    
    await remixedPlaylist.save();
    
    originalPlaylist.remixes.push({
      playlist: remixedPlaylist._id,
      createdAt: new Date(),
    });
    await originalPlaylist.save();
    
    await remixedPlaylist.populate('createdBy', 'username profileImage');
    await remixedPlaylist.populate('restaurants.restaurant');
    
    res.status(201).json({
      ...remixedPlaylist.toObject(),
      likeCount: 0,
      saveCount: 0,
      completionCount: 0,
      restaurantCount: remixedPlaylist.restaurants.length,
      isLiked: false,
      isSaved: false,
      canEdit: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const completePlaylist = async (req, res) => {
  try {
    const { visitedRestaurants } = req.body;
    
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }
    
    const existingCompletion = playlist.completions.find(
      c => c.user.toString() === req.user._id.toString()
    );
    
    if (existingCompletion) {
      return res.status(400).json({ message: '이미 완주한 플레이리스트입니다' });
    }
    
    playlist.completions.push({
      user: req.user._id,
      completedAt: new Date(),
      visitedRestaurants: visitedRestaurants || [],
    });
    
    await playlist.save();
    
    const user = await User.findById(req.user._id);
    visitedRestaurants?.forEach(restaurantId => {
      const existingVisit = user.visitedRestaurants.find(
        v => v.restaurant.toString() === restaurantId
      );
      if (!existingVisit) {
        user.visitedRestaurants.push({
          restaurant: restaurantId,
          visitedAt: new Date(),
        });
      }
    });
    await user.save();
    
    res.json({
      message: '플레이리스트 완주를 축하합니다!',
      completionCount: playlist.completions.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 테마별 컬렉션 API
const getThemedCollections = async (req, res) => {
  try {
    const themes = [
      '데이트 코스', '혼밥 맛집', '야식 투어', '브런치 카페',
      '회식 장소', '가족 외식', '술집 투어', '디저트 맛집'
    ];

    const themedData = await Promise.all(
      themes.map(async (theme) => {
        const count = await Playlist.countDocuments({
          isPublic: true,
          isActive: true,
          $or: [
            { category: theme },
            { tags: { $in: [theme] } },
            { title: { $regex: theme, $options: 'i' } },
            { description: { $regex: theme, $options: 'i' } }
          ]
        });

        const playlists = await Playlist.find({
          isPublic: true,
          isActive: true,
          $or: [
            { category: theme },
            { tags: { $in: [theme] } },
            { title: { $regex: theme, $options: 'i' } },
            { description: { $regex: theme, $options: 'i' } }
          ]
        })
        .populate('createdBy', 'username profileImage')
        .populate('restaurants.restaurant', 'name images')
        .sort({ viewCount: -1, likeCount: -1 })
        .limit(3);

        return {
          theme,
          count,
          playlists
        };
      })
    );

    res.json(themedData);
  } catch (error) {
    console.error('Error getting themed collections:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 스마트 추천 API
const getRecommendedPlaylists = async (req, res) => {
  try {
    let recommendedPlaylists;
    
    // 로그인한 사용자의 경우 개인화된 추천
    if (req.user) {
      // 사용자의 좋아요한 플레이리스트 분석
      const userLikedPlaylists = await Playlist.find({
        'likes.user': req.user._id
      }).populate('restaurants.restaurant', 'category tags');

      // 사용자가 좋아한 카테고리와 태그 분석
      const preferredCategories = [];
      const preferredTags = [];
      
      userLikedPlaylists.forEach(playlist => {
        if (playlist.category) preferredCategories.push(playlist.category);
        preferredTags.push(...playlist.tags);
        playlist.restaurants.forEach(item => {
          if (item.restaurant.category) preferredCategories.push(item.restaurant.category);
          preferredTags.push(...(item.restaurant.tags || []));
        });
      });

      // 빈도수 계산
      const categoryCount = {};
      const tagCount = {};
      
      preferredCategories.forEach(cat => {
        categoryCount[cat] = (categoryCount[cat] || 0) + 1;
      });
      
      preferredTags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1;
      });

      // 상위 카테고리와 태그 추출
      const topCategories = Object.keys(categoryCount)
        .sort((a, b) => categoryCount[b] - categoryCount[a])
        .slice(0, 3);
      
      const topTags = Object.keys(tagCount)
        .sort((a, b) => tagCount[b] - tagCount[a])
        .slice(0, 5);

      // 추천 플레이리스트 찾기
      recommendedPlaylists = await Playlist.find({
        isPublic: true,
        isActive: true,
        'likes.user': { $ne: req.user._id }, // 이미 좋아요한 플레이리스트 제외
        createdBy: { $ne: req.user._id }, // 본인이 만든 플레이리스트 제외
        $or: [
          { category: { $in: topCategories } },
          { tags: { $in: topTags } }
        ]
      })
      .populate('createdBy', 'username profileImage')
      .populate('restaurants.restaurant', 'name images category')
      .sort({ 
        likeCount: -1, 
        viewCount: -1, 
        createdAt: -1 
      })
      .limit(12);
    } else {
      // 비로그인 사용자의 경우 인기 플레이리스트
      recommendedPlaylists = await Playlist.find({
        isPublic: true,
        isActive: true
      })
      .populate('createdBy', 'username profileImage')
      .populate('restaurants.restaurant', 'name images')
      .sort({ 
        likeCount: -1, 
        viewCount: -1, 
        saveCount: -1,
        createdAt: -1 
      })
      .limit(12);
    }

    res.json(recommendedPlaylists);
  } catch (error) {
    console.error('Error getting recommended playlists:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const uploadCoverImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ message: '이미지 파일이 필요합니다' });
    }
    
    const playlist = await Playlist.findById(id);
    
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }
    
    // 권한 확인
    if (playlist.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }
    
    // 이미지 경로 업데이트
    const imagePath = `/uploads/${req.file.filename}`;
    playlist.coverImage = imagePath;
    await playlist.save();
    
    res.json({
      message: '커버 이미지가 업로드되었습니다',
      coverImage: imagePath
    });
  } catch (error) {
    console.error('Cover image upload error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 플레이리스트 내 맛집 평가 업데이트
const updateRestaurantRating = async (req, res) => {
  try {
    const { playlistId, restaurantId } = req.params;
    const { rating, personalNote, reasonForAdding } = req.body;
    const userId = req.user._id;

    // 플레이리스트 확인
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }

    // 권한 확인 (본인 플레이리스트만 수정 가능)
    if (playlist.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: '권한이 없습니다' });
    }

    // PlaylistRestaurant 업데이트 또는 생성
    const playlistRestaurant = await PlaylistRestaurant.findOneAndUpdate(
      { 
        playlist: playlistId, 
        restaurant: restaurantId 
      },
      {
        rating,
        personalNote,
        reasonForAdding,
        addedBy: userId
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true
      }
    );

    // 플레이리스트의 restaurants 배열도 업데이트
    const restaurantIndex = playlist.restaurants.findIndex(
      r => r.restaurant.toString() === restaurantId
    );

    if (restaurantIndex !== -1) {
      playlist.restaurants[restaurantIndex].personalNote = personalNote;
      await playlist.save();
    }

    res.json({
      message: '평가가 업데이트되었습니다',
      data: playlistRestaurant
    });
  } catch (error) {
    console.error('Update restaurant rating error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 플레이리스트 내 맛집 평가 조회
const getRestaurantRatings = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const ratings = await PlaylistRestaurant.find({ playlist: playlistId })
      .populate('restaurant', 'name address category images')
      .populate('addedBy', 'username profileImage')
      .sort({ order: 1, createdAt: 1 });

    res.json({
      ratings,
      total: ratings.length
    });
  } catch (error) {
    console.error('Get restaurant ratings error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

module.exports = {
  getPlaylists,
  getTrendingPlaylists,
  getPlaylist,
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  addRestaurantToPlaylist,
  removeRestaurantFromPlaylist,
  reorderPlaylistRestaurants,
  likePlaylist,
  savePlaylist,
  remixPlaylist,
  completePlaylist,
  getThemedCollections,
  getRecommendedPlaylists,
  uploadCoverImage,
  updateRestaurantRating,
  getRestaurantRatings,
};