const Admin = require('../models/Admin');
const User = require('../models/User');
const Playlist = require('../models/Playlist');
const Restaurant = require('../models/Restaurant');
const generateToken = require('../utils/generateToken');
const axios = require('axios');

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const admin = await Admin.findOne({ email, isActive: true }).select('+password');
    
    if (admin && (await admin.comparePassword(password))) {
      // 로그인 기록 저장
      admin.lastLogin = new Date();
      admin.loginHistory.push({
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        loginAt: new Date()
      });
      
      // 최근 10개의 로그인 기록만 유지
      if (admin.loginHistory.length > 10) {
        admin.loginHistory = admin.loginHistory.slice(-10);
      }
      
      await admin.save();
      
      const token = generateToken(admin._id);
      
      res.json({
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        token,
        isAdmin: true,
      });
    } else {
      res.status(401).json({ message: '어드민 로그인 정보가 올바르지 않습니다' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalPlaylists,
      totalRestaurants,
      activeUsers,
      todaySignups,
      todayPlaylists
    ] = await Promise.all([
      User.countDocuments(),
      Playlist.countDocuments(),
      Restaurant.countDocuments(),
      User.countDocuments({ 
        lastActive: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } 
      }),
      User.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      Playlist.countDocuments({
        createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      })
    ]);

    const recentUsers = await User.find()
      .sort('-createdAt')
      .limit(5)
      .select('username email createdAt trustScore');

    const recentPlaylists = await Playlist.find()
      .sort('-createdAt')
      .limit(5)
      .populate('createdBy', 'username')
      .select('title category createdAt likeCount saveCount');

    res.json({
      stats: {
        totalUsers,
        totalPlaylists,
        totalRestaurants,
        activeUsers,
        todaySignups,
        todayPlaylists
      },
      recentUsers,
      recentPlaylists
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const users = await User.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }
    
    res.json({ 
      message: `사용자가 ${isActive ? '활성화' : '비활성화'}되었습니다`,
      user 
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const getPlaylists = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, isPublic } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (isPublic !== undefined) query.isPublic = isPublic === 'true';
    
    const playlists = await Playlist.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'username email')
      .select('title description category isPublic likeCount saveCount viewCount createdAt');
    
    const total = await Playlist.countDocuments(query);
    
    res.json({
      playlists,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    
    const playlist = await Playlist.findByIdAndDelete(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }
    
    res.json({ message: '플레이리스트가 삭제되었습니다' });
  } catch (error) {
    console.error('Delete playlist error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const getRestaurants = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, isVerified } = req.query;
    
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }
    if (category) query.category = category;
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    
    const restaurants = await Restaurant.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('createdBy', 'username email')
      .select('name address category isVerified averageRating reviewCount viewCount createdAt');
    
    const total = await Restaurant.countDocuments(query);
    
    res.json({
      restaurants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const verifyRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { isVerified } = req.body;
    
    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { isVerified },
      { new: true }
    );
    
    if (!restaurant) {
      return res.status(404).json({ message: '맛집을 찾을 수 없습니다' });
    }
    
    res.json({ 
      message: `맛집이 ${isVerified ? '검증' : '검증 해제'}되었습니다`,
      restaurant 
    });
  } catch (error) {
    console.error('Verify restaurant error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// Admin update any playlist
const updatePlaylistAdmin = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const updates = req.body;
    
    const playlist = await Playlist.findById(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ message: '플레이리스트를 찾을 수 없습니다' });
    }
    
    // Update basic fields (allow empty strings and check for existence)
    if (updates.title !== undefined) {
      playlist.title = updates.title;
      playlist.name = updates.title; // 둘 다 업데이트
    }
    if (updates.name !== undefined) {
      playlist.name = updates.name;
      playlist.title = updates.name; // 둘 다 업데이트
    }
    if (updates.description !== undefined) playlist.description = updates.description;
    if (updates.category !== undefined) playlist.category = updates.category;
    if (updates.isPublic !== undefined) playlist.isPublic = updates.isPublic;
    if (updates.coverImage !== undefined) playlist.coverImage = updates.coverImage;
    
    // Handle restaurants array update (allow empty array)
    if (updates.restaurants !== undefined) {
      // 빈 배열도 허용
      playlist.restaurants = updates.restaurants || [];
    }
    
    await playlist.save();
    
    // Populate for response
    await playlist.populate('createdBy', 'username profileImage email');
    await playlist.populate({
      path: 'restaurants.restaurant',
      select: 'name address category price rating images coordinates phone businessHours'
    });
    
    res.json({
      ...playlist.toObject(),
      likeCount: playlist.likes?.length || 0,
      saveCount: playlist.saves?.length || 0,
      restaurantCount: playlist.restaurants?.length || 0,
      canEdit: true
    });
  } catch (error) {
    console.error('Update playlist error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// Search restaurants using Naver API
const searchRestaurantsNaver = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: '검색어를 입력해주세요' });
    }
    
    // First search in our database
    const dbRestaurants = await Restaurant.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);
    
    const results = [];
    
    // Add DB results
    dbRestaurants.forEach(restaurant => {
      results.push({
        _id: restaurant._id,
        name: restaurant.name,
        address: restaurant.address,
        category: restaurant.category,
        phone: restaurant.phone,
        coordinates: restaurant.coordinates,
        price: restaurant.price,
        rating: restaurant.rating,
        images: restaurant.images,
        source: 'database',
        exists: true
      });
    });
    
    // Try Naver search if configured
    if (process.env.NAVER_SEARCH_CLIENT_ID && process.env.NAVER_SEARCH_CLIENT_SECRET) {
      try {
        // 카테고리 관련 키워드 감지
        const categoryKeywords = {
          '멕시칸': ['멕시코', '타코', '부리토', '나초'],
          '이탈리안': ['이탈리아', '파스타', '피자', '리조또'],
          '중식': ['중국', '중화', '짜장', '짬뽕', '마라'],
          '일식': ['일본', '스시', '라멘', '돈카츠', '우동'],
          '태국': ['태국', '팟타이', '똠양꿍'],
          '베트남': ['베트남', '쌀국수', '포', '반미']
        };
        
        let searchQuery = query;
        // 특정 카테고리 키워드가 있으면 더 정확한 검색어 사용
        for (const [key, values] of Object.entries(categoryKeywords)) {
          if (query.includes(key) || values.some(v => query.includes(v))) {
            searchQuery = query + ' 음식점';
            break;
          }
        }
        if (searchQuery === query) {
          searchQuery = query + ' 맛집';
        }
        
        const naverResponse = await axios.get('https://openapi.naver.com/v1/search/local.json', {
          params: {
            query: searchQuery,
            display: 30,  // 더 많은 결과를 가져와서 필터링
            start: 1,
            sort: 'random'
          },
          headers: {
            'X-Naver-Client-Id': process.env.NAVER_SEARCH_CLIENT_ID,
            'X-Naver-Client-Secret': process.env.NAVER_SEARCH_CLIENT_SECRET
          }
        });
        
        // Process Naver results
        console.log(`네이버 API에서 ${naverResponse.data.items.length}개 결과 받음`);
        
        for (const item of naverResponse.data.items) {
          const cleanName = item.title.replace(/<[^>]*>/g, '').trim();
          const address = item.roadAddress || item.address;
          const fullCategory = item.category;
          
          // 스마트 필터링: 검색 의도와 맞지 않는 결과 제외
          let shouldInclude = true;
          
          // 멕시칸을 검색했는데 멕시카나 치킨이 나오는 경우 제외
          if (query.includes('멕시칸') || query.includes('멕시코')) {
            if (cleanName.includes('멕시카나') && (fullCategory.includes('치킨') || fullCategory.includes('통닭'))) {
              shouldInclude = false;
            }
            // 진짜 멕시칸 음식점만 포함
            if (!fullCategory.includes('멕시코') && !fullCategory.includes('남미') && 
                !cleanName.toLowerCase().includes('taco') && !cleanName.toLowerCase().includes('타코') &&
                !cleanName.includes('부리토') && !cleanName.includes('나초')) {
              shouldInclude = false;
            }
          }
          
          // 이탈리안을 검색했는데 다른 음식점이 나오는 경우
          if (query.includes('이탈리안') || query.includes('이탈리아')) {
            if (!fullCategory.includes('이탈리아') && !fullCategory.includes('양식') && 
                !fullCategory.includes('파스타') && !fullCategory.includes('피자')) {
              shouldInclude = false;
            }
          }
          
          // Check if already in results
          const exists = results.some(r => 
            r.name === cleanName && r.address === address
          );
          
          if (!exists && shouldInclude) {
            // 카테고리 매핑 개선
            const categoryText = item.category.split('>').pop().trim();
            let mappedCategory = '기타';
            if (categoryText.includes('한식') || categoryText.includes('한정식')) mappedCategory = '한식';
            else if (categoryText.includes('중식') || categoryText.includes('중국')) mappedCategory = '중식';
            else if (categoryText.includes('일식') || categoryText.includes('일본') || categoryText.includes('초밥') || categoryText.includes('라멘')) mappedCategory = '일식';
            else if (categoryText.includes('양식') || categoryText.includes('이탈리아') || categoryText.includes('프렌치')) mappedCategory = '양식';
            else if (fullCategory.includes('멕시코') || fullCategory.includes('남미')) mappedCategory = '양식'; // 멕시칸도 양식으로 분류
            else if (categoryText.includes('카페') || categoryText.includes('커피')) mappedCategory = '카페';
            else if (categoryText.includes('술집') || categoryText.includes('주점') || categoryText.includes('바')) mappedCategory = '주점';
            else if (categoryText.includes('분식')) mappedCategory = '패스트푸드';
            else if (fullCategory.includes('아시아') || fullCategory.includes('태국') || fullCategory.includes('베트남')) mappedCategory = '동남아';
            
            results.push({
              name: cleanName,
              address: address,
              category: mappedCategory,
              phone: item.telephone,
              coordinates: {
                lat: parseFloat(item.mapy) / 10000000,
                lng: parseFloat(item.mapx) / 10000000
              },
              price: '보통',  // 기본값
              rating: 4.0,
              images: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
              source: 'naver',
              exists: false,
              naverCategory: item.category  // 원본 카테고리 저장
            });
          }
        }
      } catch (naverError) {
        console.error('Naver API error:', naverError.message);
      }
    } else {
      console.log('Naver API credentials not configured');
    }
    
    // If no API configured, add some mock data for testing
    if (!process.env.NAVER_SEARCH_CLIENT_ID) {
      // 항상 일부 mock 데이터를 제공
      const allMockRestaurants = [
        { name: '한남동 스시 오마카세', address: '서울 용산구 한남동 123-45', category: '일식', price: '비싼', rating: 4.8 },
        { name: '한남동 파스타', address: '서울 용산구 한남동 234-56', category: '양식', price: '중간', rating: 4.7 },
        { name: '강남 한우전문점', address: '서울 강남구 역삼동 345-67', category: '한식', price: '비싼', rating: 4.9 },
        { name: '홍대 브런치 카페', address: '서울 마포구 서교동 456-78', category: '카페', price: '저렴', rating: 4.4 },
        { name: '이태원 버거하우스', address: '서울 용산구 이태원동 567-89', category: '양식', price: '중간', rating: 4.5 },
        { name: query + ' 맛집 1호점', address: '서울 강남구 ' + query + '동 100-1', category: '한식', price: '중간', rating: 4.6 },
        { name: query + ' 숨은 맛집', address: '서울 강남구 ' + query + '동 200-2', category: '한식', price: '저렴', rating: 4.3 }
      ];
      
      // 쿼리와 관련된 레스토랑 필터링 또는 모두 표시
      const mockRestaurants = allMockRestaurants.filter(mock => 
        mock.name.toLowerCase().includes(query.toLowerCase()) ||
        mock.address.toLowerCase().includes(query.toLowerCase()) ||
        mock.category.includes(query)
      );
      
      // 결과가 없으면 쿼리 기반 생성
      if (mockRestaurants.length === 0) {
        mockRestaurants.push(
          { name: query + ' 맛집', address: '서울 강남구 ' + query, category: '한식', price: '중간', rating: 4.5 }
        );
      }
      
      mockRestaurants.forEach(mock => {
        results.push({
          name: mock.name,
          address: mock.address,
          category: mock.category,
          phone: '02-' + Math.floor(Math.random() * 9000 + 1000) + '-' + Math.floor(Math.random() * 9000 + 1000),
          coordinates: {
            lat: 37.5665 + (Math.random() - 0.5) * 0.1,
            lng: 126.9780 + (Math.random() - 0.5) * 0.1
          },
          price: mock.price,
          rating: mock.rating,
          images: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop',
          source: 'mock',
          exists: false
        });
      });
    }
    
    res.json(results.slice(0, 20));
    
  } catch (error) {
    console.error('Search restaurants error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// Create or get restaurant from search result
const createRestaurantFromSearch = async (req, res) => {
  try {
    const restaurantData = req.body;
    
    // Get system user for createdBy field
    const User = require('../models/User');
    let systemUser = await User.findOne({ username: 'system' });
    if (!systemUser) {
      systemUser = await User.findOne({ username: 'BobMap' });
    }
    if (!systemUser) {
      // Create a system user if not exists
      systemUser = new User({
        username: 'system',
        email: 'system@bobmap.com',
        password: 'system' + Date.now(),
        tasteProfile: {
          preferences: {},
          favoriteCategories: [],
          tasteType: '기타'
        }
      });
      await systemUser.save();
    }
    
    // Check if restaurant already exists
    let restaurant = await Restaurant.findOne({
      name: restaurantData.name,
      address: restaurantData.address
    });
    
    if (!restaurant) {
      // Map category to valid enum (Restaurant model's categories)
      const categoryMap = {
        '한식': '한식',
        '일식': '일식',
        '중식': '중식',
        '양식': '양식',
        '카페': '카페',
        '술집': '주점',
        '주점': '주점',
        '분식': '패스트푸드',
        '아시안': '동남아',
        '동남아': '동남아',
        '패스트푸드': '패스트푸드',
        '디저트': '디저트'
      };
      
      let mappedCategory = '기타';
      for (const [key, value] of Object.entries(categoryMap)) {
        if (restaurantData.category && restaurantData.category.includes(key)) {
          mappedCategory = value;
          break;
        }
      }
      
      // Map price to valid enum
      const priceMap = {
        '저렴': '저렴한',
        '보통': '보통',
        '중간': '보통',
        '비싼': '비싼',
        '비싸': '비싼',
        '매우비싼': '매우비싼',
        '매우 비싼': '매우비싼'
      };
      
      let mappedPrice = '보통';
      if (restaurantData.price) {
        for (const [key, value] of Object.entries(priceMap)) {
          if (restaurantData.price.includes(key)) {
            mappedPrice = value;
            break;
          }
        }
      }
      
      // Format images properly
      let formattedImages = [];
      if (restaurantData.images && Array.isArray(restaurantData.images)) {
        formattedImages = restaurantData.images.map(img => {
          if (typeof img === 'string') {
            return { url: img };
          }
          return img;
        });
      } else if (restaurantData.images && typeof restaurantData.images === 'string') {
        formattedImages = [{ url: restaurantData.images }];
      } else {
        formattedImages = [{ url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=600&fit=crop' }];
      }
      
      // Create new restaurant
      restaurant = new Restaurant({
        name: restaurantData.name,
        address: restaurantData.address,
        category: mappedCategory,
        phoneNumber: restaurantData.phone || '',
        coordinates: restaurantData.coordinates || { lat: 37.5665, lng: 126.9780 },
        priceRange: mappedPrice,
        averageRating: restaurantData.rating || 4.0,
        images: formattedImages,
        businessHours: {
          monday: { open: '11:00', close: '22:00', isOpen: true },
          tuesday: { open: '11:00', close: '22:00', isOpen: true },
          wednesday: { open: '11:00', close: '22:00', isOpen: true },
          thursday: { open: '11:00', close: '22:00', isOpen: true },
          friday: { open: '11:00', close: '22:00', isOpen: true },
          saturday: { open: '11:00', close: '22:00', isOpen: true },
          sunday: { open: '11:00', close: '22:00', isOpen: true }
        },
        tags: [],
        isVerified: true,
        createdBy: systemUser._id,
        averageRating: restaurantData.rating || 4.0,
        reviewCount: 0
      });
      
      await restaurant.save();
      console.log('새 레스토랑 생성:', restaurant.name);
    }
    
    res.json(restaurant);
  } catch (error) {
    console.error('Create restaurant error:', error);
    // 더 자세한 에러 메시지
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ 
        message: '레스토랑 생성 실패', 
        errors: messages,
        details: error.message 
      });
    } else {
      res.status(500).json({ 
        message: '서버 오류가 발생했습니다',
        error: error.message 
      });
    }
  }
};

const createSuperAdmin = async () => {
  try {
    const existingSuperAdmin = await Admin.findOne({ role: 'super_admin' });
    
    if (!existingSuperAdmin) {
      const superAdmin = new Admin({
        username: 'superadmin',
        email: 'admin@bobmap.com',
        password: 'BobMap2024!',
        role: 'super_admin',
        permissions: [
          'user_management',
          'playlist_management',
          'restaurant_management',
          'content_moderation',
          'analytics_view',
          'system_settings'
        ]
      });
      
      await superAdmin.save();
      console.log('슈퍼 어드민 계정이 생성되었습니다:');
      console.log('이메일: admin@bobmap.com');
      console.log('비밀번호: BobMap2024!');
    }
  } catch (error) {
    console.error('Create super admin error:', error);
  }
};

module.exports = {
  adminLogin,
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getPlaylists,
  deletePlaylist,
  getRestaurants,
  verifyRestaurant,
  createSuperAdmin,
  updatePlaylistAdmin,
  searchRestaurantsNaver,
  createRestaurantFromSearch
};