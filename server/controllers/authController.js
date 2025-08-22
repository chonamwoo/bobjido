const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    
    const { username, email, password } = req.body;
    
    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ 
        message: '모든 필드를 입력해주세요' 
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ 
        message: '비밀번호는 최소 6자 이상이어야 합니다' 
      });
    }
    
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    
    if (userExists) {
      return res.status(400).json({ 
        message: userExists.email === email ? '이미 사용중인 이메일입니다' : '이미 사용중인 사용자명입니다' 
      });
    }
    
    const user = await User.create({
      username,
      email,
      password,
    });
    
    const token = generateToken(user._id);
    
    console.log('User created successfully:', user._id);
    
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      tasteProfile: user.tasteProfile,
      trustScore: user.trustScore,
      followerCount: 0,
      followingCount: 0,
      onboardingCompleted: true,  // MVP에서는 온보딩 없음
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email }).select('+password');
    
    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id);
      
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        tasteProfile: user.tasteProfile,
        trustScore: user.trustScore,
        followerCount: user.followers.length,
        followingCount: user.following.length,
        onboardingCompleted: true,  // MVP에서는 온보딩 없음
        token,
      });
    } else {
      res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedPlaylists', 'title coverImage restaurantCount')
      .populate('likedPlaylists', 'title coverImage restaurantCount');
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      tasteProfile: user.tasteProfile,
      trustScore: user.trustScore,
      followerCount: user.followers.length,
      followingCount: user.following.length,
      savedPlaylists: user.savedPlaylists,
      likedPlaylists: user.likedPlaylists,
      visitedRestaurantsCount: user.visitedRestaurants.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, bio, tasteProfile } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: '이미 사용중인 사용자명입니다' });
      }
      user.username = username;
    }
    
    if (bio !== undefined) user.bio = bio;
    if (tasteProfile) {
      user.tasteProfile = { ...user.tasteProfile.toObject(), ...tasteProfile };
    }
    
    user.calculateTrustScore();
    await user.save();
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profileImage: user.profileImage,
      bio: user.bio,
      tasteProfile: user.tasteProfile,
      trustScore: user.trustScore,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');
    
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ message: '현재 비밀번호가 올바르지 않습니다' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: '비밀번호가 성공적으로 변경되었습니다' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
};