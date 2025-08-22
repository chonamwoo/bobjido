const Admin = require('../models/Admin');
const User = require('../models/User');
const Playlist = require('../models/Playlist');
const Restaurant = require('../models/Restaurant');
const generateToken = require('../utils/generateToken');

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
};