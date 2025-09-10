const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { validatePassword } = require('../utils/passwordValidator');
const { generateVerificationCode, sendVerificationEmail, sendWelcomeEmail } = require('../services/emailService');
const emailValidator = require('email-validator');
const crypto = require('crypto');

const register = async (req, res) => {
  try {
    console.log('Register request body:', req.body);
    
    const { userId, username, email, password, confirmPassword } = req.body;
    
    // 필수 필드 검증
    if (!userId || !username || !email || !password) {
      return res.status(400).json({ 
        message: '모든 필드를 입력해주세요' 
      });
    }
    
    // 비밀번호 확인
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        message: '비밀번호가 일치하지 않습니다' 
      });
    }
    
    // 강력한 비밀번호 검증
    const passwordValidation = validatePassword(password, userId, email);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: '비밀번호가 보안 요구사항을 충족하지 않습니다',
        errors: passwordValidation.errors,
        strength: passwordValidation.strength,
        feedback: passwordValidation.feedback
      });
    }
    
    // 아이디 형식 검증
    if (!/^[a-z0-9_]{4,20}$/.test(userId)) {
      return res.status(400).json({ 
        message: '아이디는 4-20자의 영문 소문자, 숫자, 언더스코어(_)만 사용 가능합니다' 
      });
    }
    
    // 이메일 형식 검증 (더 엄격한 검증)
    if (!emailValidator.validate(email)) {
      return res.status(400).json({ 
        message: '올바른 이메일 주소를 입력해주세요' 
      });
    }
    
    // 중복 체크 (아이디와 이메일 각각)
    const userIdExists = await User.findOne({ userId: userId.toLowerCase() });
    if (userIdExists) {
      return res.status(400).json({ 
        message: '이미 사용중인 아이디입니다' 
      });
    }
    
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ 
        message: '이미 사용중인 이메일입니다' 
      });
    }
    
    // 이메일 인증 코드 생성
    const verificationCode = generateVerificationCode();
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10분 후 만료
    
    // 사용자 생성 (임시로 이메일 인증 없이)
    const user = await User.create({
      userId: userId.toLowerCase(),
      username,
      email: email.toLowerCase(),
      password,
      emailVerified: true, // 임시로 true로 설정 (개발 중)
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });
    
    // 이메일 발송은 나중에 활성화 (현재 이메일 설정이 없음)
    // try {
    //   await sendVerificationEmail(email, username, verificationCode);
    //   user.emailVerificationToken = verificationCode;
    //   await user.save();
    // } catch (emailError) {
    //   console.error('이메일 발송 실패:', emailError);
    // }
    
    const token = generateToken(user._id);
    
    console.log('User created successfully:', user._id);
    
    res.status(201).json({
      success: true,
      message: '회원가입이 완료되었습니다!',
      requiresVerification: false, // 임시로 false
      data: {
        _id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        emailVerified: true, // 임시로 true
        profileImage: user.profileImage,
        bio: user.bio,
        tasteProfile: user.tasteProfile,
        trustScore: user.trustScore,
        followerCount: 0,
        followingCount: 0,
        onboardingCompleted: true,
        token,
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // MongoDB 유니크 제약 오류 처리
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ 
        message: `이미 사용중인 ${field === 'userId' ? '아이디' : field === 'email' ? '이메일' : field}입니다` 
      });
    }
    
    // 유효성 검증 오류 처리
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: messages[0] 
      });
    }
    
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

const login = async (req, res) => {
  try {
    const { loginId, password } = req.body;
    
    console.log('Login attempt:', { loginId, passwordLength: password?.length });
    
    if (!loginId || !password) {
      return res.status(400).json({ 
        message: '아이디/이메일과 비밀번호를 입력해주세요' 
      });
    }
    
    // 아이디 또는 이메일로 사용자 찾기
    const user = await User.findOne({
      $or: [
        { userId: loginId.toLowerCase() },
        { email: loginId.toLowerCase() }
      ]
    }).select('+password');
    
    console.log('User found:', user ? { userId: user.userId, email: user.email, hasPassword: !!user.password } : 'No user found');
    
    if (!user) {
      return res.status(401).json({ 
        message: '아이디/이메일 또는 비밀번호가 올바르지 않습니다' 
      });
    }
    
    // 비밀번호 확인
    const isMatch = await user.comparePassword(password);
    console.log('Password match result:', isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ 
        message: '아이디/이메일 또는 비밀번호가 올바르지 않습니다' 
      });
    }
    
    // 이메일 인증 체크 임시 비활성화 (개발 중)
    // if (!user.googleId && !user.kakaoId && !user.emailVerified) {
    //   return res.status(403).json({ 
    //     message: '이메일 인증이 필요합니다. 이메일을 확인해주세요.',
    //     requiresVerification: true,
    //     email: user.email
    //   });
    // }
    
    const token = generateToken(user._id);
    
    // 마지막 활동 시간 업데이트
    user.lastActive = new Date();
    await user.save();
    
    res.json({
      success: true,
      message: '로그인 성공',
      data: {
        _id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        tasteProfile: user.tasteProfile,
        trustScore: user.trustScore,
        followerCount: user.followers.length,
        followingCount: user.following.length,
        onboardingCompleted: true,
        token,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// 아이디 중복 체크
const checkUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId || userId.length < 4) {
      return res.status(400).json({ 
        available: false,
        message: '아이디는 4자 이상이어야 합니다' 
      });
    }
    
    const exists = await User.findOne({ userId: userId.toLowerCase() });
    
    res.json({
      available: !exists,
      message: exists ? '이미 사용중인 아이디입니다' : '사용 가능한 아이디입니다'
    });
  } catch (error) {
    console.error('Check userId error:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다' 
    });
  }
};

// 이메일 중복 체크
const checkEmail = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/.test(email)) {
      return res.status(400).json({ 
        available: false,
        message: '올바른 이메일 주소를 입력해주세요' 
      });
    }
    
    const exists = await User.findOne({ email: email.toLowerCase() });
    
    res.json({
      available: !exists,
      message: exists ? '이미 사용중인 이메일입니다' : '사용 가능한 이메일입니다'
    });
  } catch (error) {
    console.error('Check email error:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다' 
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('savedPlaylists', 'title coverImage restaurantCount')
      .populate('likedPlaylists', 'title coverImage restaurantCount');
    
    res.json({
      success: true,
      data: {
        _id: user._id,
        userId: user.userId,
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
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다' 
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { username, bio, tasteProfile } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (username && username !== user.username) {
      user.username = username;
    }
    
    if (bio !== undefined) user.bio = bio;
    if (tasteProfile) {
      user.tasteProfile = { ...user.tasteProfile.toObject(), ...tasteProfile };
    }
    
    user.calculateTrustScore();
    await user.save();
    
    res.json({
      success: true,
      message: '프로필이 업데이트되었습니다',
      data: {
        _id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        bio: user.bio,
        tasteProfile: user.tasteProfile,
        trustScore: user.trustScore,
      }
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다' 
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: '현재 비밀번호와 새 비밀번호를 입력해주세요' 
      });
    }
    
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ 
        message: '새 비밀번호가 일치하지 않습니다' 
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: '새 비밀번호는 최소 6자 이상이어야 합니다' 
      });
    }
    
    const user = await User.findById(req.user._id).select('+password');
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ 
        message: '현재 비밀번호가 올바르지 않습니다' 
      });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ 
      success: true,
      message: '비밀번호가 성공적으로 변경되었습니다' 
    });
  } catch (error) {
    console.error('ChangePassword error:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다' 
    });
  }
};

// 이메일 인증 코드 확인
const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ 
        message: '이메일과 인증 코드를 입력해주세요' 
      });
    }
    
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      emailVerificationToken: code,
      emailVerificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({ 
        message: '잘못된 인증 코드이거나 만료되었습니다' 
      });
    }
    
    // 이메일 인증 완료
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();
    
    // 환영 이메일 발송 (비동기)
    sendWelcomeEmail(user.email, user.username).catch(console.error);
    
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      message: '이메일 인증이 완료되었습니다',
      data: {
        _id: user._id,
        userId: user.userId,
        username: user.username,
        email: user.email,
        emailVerified: true,
        token
      }
    });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다' 
    });
  }
};

// 이메일 인증 코드 재발송
const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        message: '이메일을 입력해주세요' 
      });
    }
    
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(404).json({ 
        message: '등록되지 않은 이메일입니다' 
      });
    }
    
    if (user.emailVerified) {
      return res.status(400).json({ 
        message: '이미 인증된 이메일입니다' 
      });
    }
    
    // 재발송 제한 체크 (예: 1분에 1번)
    if (user.emailVerificationExpires && 
        user.emailVerificationExpires > new Date(Date.now() + 9 * 60 * 1000)) {
      return res.status(429).json({ 
        message: '잠시 후 다시 시도해주세요' 
      });
    }
    
    // 새 인증 코드 생성
    const verificationCode = generateVerificationCode();
    user.emailVerificationToken = verificationCode;
    user.emailVerificationExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    
    // 이메일 발송
    await sendVerificationEmail(user.email, user.username, verificationCode);
    
    res.json({
      success: true,
      message: '인증 코드가 재발송되었습니다'
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다' 
    });
  }
};

module.exports = {
  register,
  login,
  checkUserId,
  checkEmail,
  getMe,
  updateProfile,
  changePassword,
  verifyEmail,
  resendVerificationEmail,
};