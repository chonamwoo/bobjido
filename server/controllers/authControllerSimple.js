// MongoDB 없이 작동하는 간단한 인증 컨트롤러
const jwt = require('jsonwebtoken');

// 메모리에 저장되는 임시 사용자 (테스트용)
const testUsers = [
  {
    _id: 'test123',
    username: 'testuser',
    email: 'test@bobmap.com',
    password: 'test123', // 실제로는 해시해야 함
    trustScore: 80,
    followerCount: 10,
    followingCount: 5
  }
];

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // 간단한 유효성 검사
    if (!username || !email || !password) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요' });
    }
    
    // 중복 확인 (메모리에서)
    const existingUser = testUsers.find(u => u.email === email || u.username === username);
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 사용자입니다' });
    }
    
    // 새 사용자 추가 (메모리에)
    const newUser = {
      _id: Math.random().toString(36).substr(2, 9),
      username,
      email,
      password, // 실제로는 해시해야 함
      trustScore: 50,
      followerCount: 0,
      followingCount: 0,
      createdAt: new Date()
    };
    
    testUsers.push(newUser);
    
    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || 'bobmap-secret-key',
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      token,
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        trustScore: newUser.trustScore
      },
      message: '회원가입 성공 (테스트 모드)'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 간단한 유효성 검사
    if (!email || !password) {
      return res.status(400).json({ message: '이메일과 비밀번호를 입력해주세요' });
    }
    
    // 사용자 찾기 (메모리에서)
    const user = testUsers.find(u => u.email === email);
    
    if (!user || user.password !== password) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 올바르지 않습니다' });
    }
    
    // JWT 토큰 생성
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'bobmap-secret-key',
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        trustScore: user.trustScore,
        followerCount: user.followerCount,
        followingCount: user.followingCount
      },
      message: '로그인 성공 (테스트 모드)'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

const getMe = async (req, res) => {
  try {
    // 토큰에서 사용자 ID 추출
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: '인증이 필요합니다' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bobmap-secret-key');
    const user = testUsers.find(u => u._id === decoded.userId);
    
    if (!user) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다' });
    }
    
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      trustScore: user.trustScore,
      followerCount: user.followerCount,
      followingCount: user.followingCount
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(401).json({ message: '유효하지 않은 토큰입니다' });
  }
};

// 소셜 로그인 대체 (테스트용)
const socialLogin = async (req, res) => {
  // 테스트 사용자로 자동 로그인
  const testUser = testUsers[0];
  
  const token = jwt.sign(
    { userId: testUser._id },
    process.env.JWT_SECRET || 'bobmap-secret-key',
    { expiresIn: '7d' }
  );
  
  // 리다이렉트 URL 생성
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
  const redirectUrl = `${clientUrl}/auth/callback?token=${token}`;
  res.redirect(redirectUrl);
};

// 추가 함수들 (MongoDB 없을 때 더미 구현)
const updateProfile = async (req, res) => {
  res.json({ message: 'MongoDB가 필요합니다' });
};

const changePassword = async (req, res) => {
  res.json({ message: 'MongoDB가 필요합니다' });
};

module.exports = {
  register,
  login,
  getMe,
  socialLogin,
  updateProfile,
  changePassword
};