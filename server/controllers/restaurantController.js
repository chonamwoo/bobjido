const Restaurant = require('../models/Restaurant');
const axios = require('axios');

// Mock restaurant data for when API keys are not configured
const getMockRestaurants = (query) => {
  const allMockRestaurants = [
    {
      name: '강서면옥',
      address: '서울 강서구 가양동 123-45',
      roadAddress: '서울 강서구 양천로 100',
      category: '한식',
      originalCategory: '한식>냉면',
      tags: ['냉면', '맛집', '지역맛집'],
      telephone: '02-1234-5678',
      priceRange: '₩₩',
      images: [
        { url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800', uploadedAt: new Date() }
      ],
      description: '냉면 전문점',
      rating: 4.5,
      reviewCount: 89,
      source: 'mock',
      coordinates: { lat: 37.565, lng: 126.849 }
    },
    {
      name: '목동평양냉면',
      address: '서울 양천구 목동 678-90',
      roadAddress: '서울 양천구 목동로 200',
      category: '한식',
      originalCategory: '한식>냉면',
      tags: ['평양냉면', '맛집', '유명맛집'],
      telephone: '02-2345-6789',
      priceRange: '₩₩₩',
      images: [
        { url: 'https://images.unsplash.com/photo-1580651315530-69c8e0026377?w=800', uploadedAt: new Date() }
      ],
      description: '평양냉면 전문점',
      rating: 4.7,
      reviewCount: 156,
      source: 'mock',
      coordinates: { lat: 37.530, lng: 126.875 }
    },
    {
      name: '홍대 육회비빔밥',
      address: '서울 마포구 서교동 345-67',
      roadAddress: '서울 마포구 홍익로 50',
      category: '한식',
      originalCategory: '한식>비빔밥',
      tags: ['육회', '비빔밥', '맛집'],
      telephone: '02-3456-7890',
      priceRange: '₩₩',
      images: [
        { url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800', uploadedAt: new Date() }
      ],
      description: '육회비빔밥 전문점',
      rating: 4.3,
      reviewCount: 67,
      source: 'mock',
      coordinates: { lat: 37.555, lng: 126.924 }
    },
    {
      name: '강남 스시오마카세',
      address: '서울 강남구 역삼동 234-56',
      roadAddress: '서울 강남구 테헤란로 300',
      category: '일식',
      originalCategory: '일식>스시',
      tags: ['오마카세', '스시', '고급'],
      telephone: '02-4567-8901',
      priceRange: '₩₩₩₩',
      images: [
        { url: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800', uploadedAt: new Date() }
      ],
      description: '스시 오마카세 전문점',
      rating: 4.8,
      reviewCount: 234,
      source: 'mock',
      coordinates: { lat: 37.500, lng: 127.036 }
    },
    {
      name: '이태원 버거맛집',
      address: '서울 용산구 이태원동 456-78',
      roadAddress: '서울 용산구 이태원로 150',
      category: '양식',
      originalCategory: '양식>햄버거',
      tags: ['수제버거', '맛집', '이태원맛집'],
      telephone: '02-5678-9012',
      priceRange: '₩₩',
      images: [
        { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800', uploadedAt: new Date() }
      ],
      description: '수제버거 전문점',
      rating: 4.6,
      reviewCount: 189,
      source: 'mock',
      coordinates: { lat: 37.534, lng: 126.994 }
    },
    {
      name: '성수동 브런치카페',
      address: '서울 성동구 성수동 567-89',
      roadAddress: '서울 성동구 성수이로 80',
      category: '카페',
      originalCategory: '카페>브런치',
      tags: ['브런치', '카페', '성수동핫플'],
      telephone: '02-6789-0123',
      priceRange: '₩₩₩',
      images: [
        { url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800', uploadedAt: new Date() }
      ],
      description: '브런치 카페',
      rating: 4.4,
      reviewCount: 145,
      source: 'mock',
      coordinates: { lat: 37.544, lng: 127.056 }
    },
    {
      name: '종로 설렁탕',
      address: '서울 종로구 종로3가 123-45',
      roadAddress: '서울 종로구 종로 200',
      category: '한식',
      originalCategory: '한식>설렁탕',
      tags: ['설렁탕', '전통맛집', '종로맛집'],
      telephone: '02-7890-1234',
      priceRange: '₩',
      images: [
        { url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800', uploadedAt: new Date() }
      ],
      description: '전통 설렁탕 전문점',
      rating: 4.5,
      reviewCount: 267,
      source: 'mock',
      coordinates: { lat: 37.570, lng: 126.991 }
    },
    {
      name: '명동 떡볶이',
      address: '서울 중구 명동 234-56',
      roadAddress: '서울 중구 명동길 50',
      category: '분식',
      originalCategory: '분식>떡볶이',
      tags: ['떡볶이', '분식', '명동맛집'],
      telephone: '02-8901-2345',
      priceRange: '₩',
      images: [
        { url: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800', uploadedAt: new Date() }
      ],
      description: '떡볶이 전문점',
      rating: 4.2,
      reviewCount: 189,
      source: 'mock',
      coordinates: { lat: 37.563, lng: 126.985 }
    }
  ];

  // Filter restaurants based on query
  if (!query || query.length < 2) {
    return allMockRestaurants;
  }

  const searchTerm = query.toLowerCase();
  return allMockRestaurants.filter(restaurant => 
    restaurant.name.toLowerCase().includes(searchTerm) ||
    restaurant.address.toLowerCase().includes(searchTerm) ||
    restaurant.category.toLowerCase().includes(searchTerm) ||
    restaurant.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

const searchRestaurants = async (req, res) => {
  try {
    const { query, lat, lng, radius = 5000, category, priceRange, page = 1, limit = 20 } = req.query;
    
    let searchQuery = {};
    
    if (query) {
      searchQuery.$text = { $search: query };
    }
    
    if (category) {
      searchQuery.category = category;
    }
    
    if (priceRange) {
      searchQuery.priceRange = priceRange;
    }
    
    let restaurants;
    
    if (lat && lng) {
      restaurants = await Restaurant.find(searchQuery)
        .where('coordinates')
        .near({
          center: [parseFloat(lng), parseFloat(lat)],
          maxDistance: parseInt(radius),
        })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('createdBy', 'username profileImage');
    } else {
      restaurants = await Restaurant.find(searchQuery)
        .sort({ averageRating: -1, reviewCount: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .populate('createdBy', 'username profileImage');
    }
    
    const total = await Restaurant.countDocuments(searchQuery);
    
    res.json({
      restaurants,
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

const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('createdBy', 'username profileImage')
      .populate('verifiedBy.user', 'username profileImage')
      .populate({
        path: 'similarRestaurants.restaurant',
        select: 'name address images category priceRange averageRating',
      });
    
    if (!restaurant) {
      return res.status(404).json({ message: '맛집을 찾을 수 없습니다' });
    }
    
    // 조회수 증가 (로그인한 사용자는 유니크 트래킹)
    await restaurant.incrementView(req.user?._id);
    
    const Playlist = restaurant.model('Playlist');
    const playlistsRaw = await Playlist
      .find({ 'restaurants.restaurant': restaurant._id, isPublic: true })
      .limit(5)
      .populate('createdBy', 'username profileImage')
      .select('title description coverImage createdBy likes saves restaurants');
    
    // Extract personalNote for each playlist
    const playlistsIncluding = playlistsRaw.map(playlist => {
      const restaurantEntry = playlist.restaurants.find(
        r => r.restaurant.toString() === restaurant._id.toString()
      );
      return {
        _id: playlist._id,
        title: playlist.title,
        description: playlist.description,
        coverImage: playlist.coverImage,
        createdBy: playlist.createdBy,
        likeCount: playlist.likes ? playlist.likes.length : 0,
        saveCount: playlist.saves ? playlist.saves.length : 0,
        personalNote: restaurantEntry ? restaurantEntry.personalNote : '',
        mustTry: restaurantEntry ? restaurantEntry.mustTry : [],
        addedAt: restaurantEntry ? restaurantEntry.addedAt : null
      };
    });
    
    res.json({
      restaurant,
      playlistsIncluding,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      address,
      roadAddress,
      coordinates,
      category,
      priceRange,
      phoneNumber,
      businessHours,
      tags,
      dnaProfile,
      menuItems,
      features,
      kakaoPlaceId,
    } = req.body;
    
    const existingRestaurant = await Restaurant.findOne({
      $or: [
        { name, address },
        kakaoPlaceId ? { kakaoPlaceId } : null,
      ].filter(Boolean),
    });
    
    if (existingRestaurant) {
      return res.status(400).json({ message: '이미 등록된 맛집입니다' });
    }
    
    const region = await getRegionFromCoordinates(coordinates.lat, coordinates.lng);
    
    const restaurant = new Restaurant({
      name,
      address,
      roadAddress,
      coordinates,
      category,
      priceRange,
      phoneNumber,
      businessHours,
      tags: tags || [],
      dnaProfile: dnaProfile || {},
      menuItems: menuItems || [],
      features: features || [],
      region,
      kakaoPlaceId,
      createdBy: req.user._id,
    });
    
    await restaurant.save();
    
    await restaurant.populate('createdBy', 'username profileImage');
    
    res.status(201).json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: '맛집을 찾을 수 없습니다' });
    }
    
    if (restaurant.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '수정 권한이 없습니다' });
    }
    
    const updates = req.body;
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        restaurant[key] = updates[key];
      }
    });
    
    await restaurant.save();
    await restaurant.populate('createdBy', 'username profileImage');
    
    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const uploadRestaurantImages = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: '맛집을 찾을 수 없습니다' });
    }
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: '이미지를 업로드해주세요' });
    }
    
    const newImages = req.files.map(file => ({
      url: `/uploads/${file.filename}`,
      uploadedBy: req.user._id,
      uploadedAt: new Date(),
    }));
    
    restaurant.images.push(...newImages);
    await restaurant.save();
    
    res.json({
      images: newImages,
      message: '이미지가 업로드되었습니다',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const verifyRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: '맛집을 찾을 수 없습니다' });
    }
    
    const existingVerification = restaurant.verifiedBy.find(
      v => v.user.toString() === req.user._id.toString()
    );
    
    if (existingVerification) {
      return res.status(400).json({ message: '이미 검증하신 맛집입니다' });
    }
    
    restaurant.verifiedBy.push({
      user: req.user._id,
      verifiedAt: new Date(),
    });
    
    if (restaurant.verifiedBy.length >= 3 && !restaurant.isVerified) {
      restaurant.isVerified = true;
    }
    
    await restaurant.save();
    
    res.json({
      message: '맛집 검증이 완료되었습니다',
      verificationCount: restaurant.verifiedBy.length,
      isVerified: restaurant.isVerified,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const getRestaurantsByLocation = async (req, res) => {
  try {
    const { lat, lng, radius = 1000 } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: '위치 정보가 필요합니다' });
    }
    
    const restaurants = await Restaurant.find({
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseInt(radius),
        },
      },
    })
    .limit(50)
    .select('name address coordinates category priceRange averageRating images')
    .populate('createdBy', 'username');
    
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const naverSearchService = require('../services/naverSearchService');

const searchNaverPlaces = async (req, res) => {
  try {
    const { query, display = 20, start = 1, sort = 'random' } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: '검색어를 입력하세요' });
    }
    
    // Check if Naver API keys are configured
    if (!process.env.NAVER_SEARCH_CLIENT_ID || 
        !process.env.NAVER_SEARCH_CLIENT_SECRET || 
        process.env.NAVER_SEARCH_CLIENT_ID === 'YOUR_NAVER_CLIENT_ID') {
      console.log('Naver API keys not configured, using mock data');
      
      // Return mock data when API keys are not configured
      const mockRestaurants = getMockRestaurants(query);
      return res.json({
        restaurants: mockRestaurants,
        total: mockRestaurants.length,
        start: 1,
        display: mockRestaurants.length,
        source: 'mock'
      });
    }

    // 네이버 API로 실제 검색
    const searchResult = await naverSearchService.searchRestaurants(
      query, 
      parseInt(display), 
      parseInt(start), 
      sort
    );

    if (!searchResult.success) {
      console.error('Naver search failed:', searchResult.error);
      // 에러 발생 시에도 빈 배열 반환 (앱이 멈추지 않도록)
      return res.json({
        restaurants: [],
        total: 0,
        message: '검색 중 오류가 발생했습니다'
      });
    }

    // 성공적으로 검색 결과 반환
    res.json({
      restaurants: searchResult.restaurants,
      total: searchResult.total,
      start: searchResult.start,
      display: searchResult.display,
      source: 'naver'
    });
  } catch (error) {
    console.error('네이버 검색 오류:', error);
    res.status(500).json({ message: '네이버 장소 검색에 실패했습니다' });
  }
};

const searchKakaoPlaces = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: '검색어를 입력하세요' });
    }
    
    const response = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
      params: {
        query,
        category_group_code: 'FD6',
        size: 15,
      },
    });
    
    const places = response.data.documents.map(place => ({
      id: place.id,
      name: place.place_name,
      address: place.address_name,
      roadAddress: place.road_address_name,
      coordinates: {
        lat: parseFloat(place.y),
        lng: parseFloat(place.x),
      },
      phone: place.phone,
      category: getCategoryFromKakao(place.category_name),
      kakaoPlaceId: place.id,
    }));
    
    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '카카오 장소 검색에 실패했습니다' });
  }
};

const getCategoryFromKakao = (categoryName) => {
  if (categoryName.includes('한식')) return '한식';
  if (categoryName.includes('중식')) return '중식';
  if (categoryName.includes('일식')) return '일식';
  if (categoryName.includes('양식')) return '양식';
  if (categoryName.includes('카페')) return '카페';
  if (categoryName.includes('술집') || categoryName.includes('호프')) return '주점';
  if (categoryName.includes('패스트푸드') || categoryName.includes('버거')) return '패스트푸드';
  if (categoryName.includes('디저트') || categoryName.includes('아이스크림')) return '디저트';
  return '기타';
};

const getRegionFromCoordinates = async (lat, lng) => {
  try {
    const response = await axios.get('https://dapi.kakao.com/v2/local/geo/coord2regioncode.json', {
      headers: {
        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`,
      },
      params: {
        x: lng,
        y: lat,
      },
    });
    
    const region = response.data.documents[0];
    if (region) {
      return {
        city: region.region_1depth_name,
        district: region.region_2depth_name,
        neighborhood: region.region_3depth_name,
      };
    }
    
    return {};
  } catch (error) {
    console.error('Failed to get region:', error);
    return {};
  }
};

module.exports = {
  searchRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  uploadRestaurantImages,
  verifyRestaurant,
  getRestaurantsByLocation,
  searchKakaoPlaces,
  searchNaverPlaces,
};