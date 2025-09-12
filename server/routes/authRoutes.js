const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { register, login, checkUserId, checkEmail, getMe, updateProfile, changePassword, verifyEmail, resendVerificationEmail } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { passport, generateToken } = require('../config/passport');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// 아이디 중복 체크
router.get('/check-userid/:userId', checkUserId);

// 이메일 중복 체크
router.get('/check-email/:email', checkEmail);

router.post('/register', register);

router.post('/login', login);

// 이메일 인증 관련 라우트
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);

router.get('/me', protect, getMe);

router.put(
  '/profile',
  protect,
  [
    body('username').optional().isLength({ min: 3 }).withMessage('사용자명은 최소 3자 이상이어야 합니다'),
    body('bio').optional().isLength({ max: 500 }).withMessage('자기소개는 최대 500자까지 가능합니다'),
  ],
  handleValidationErrors,
  updateProfile
);

router.put(
  '/password',
  protect,
  [
    body('currentPassword').notEmpty().withMessage('현재 비밀번호를 입력하세요'),
    body('newPassword').isLength({ min: 6 }).withMessage('새 비밀번호는 최소 6자 이상이어야 합니다'),
  ],
  handleValidationErrors,
  changePassword
);

// Debug route
router.get('/debug', (req, res) => {
  res.json({ message: 'Auth routes are working', passport: !!passport });
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { 
  scope: ['profile', 'email'],
  prompt: 'consent select_account' // 매번 동의 및 계정 선택 화면 표시
}));

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = generateToken(req.user._id);
    const user = {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      profileImage: req.user.profileImage,
      onboardingCompleted: true  // MVP에서는 온보딩 없음
    };
    
    // auth-bridge.html로 리다이렉트 (토큰과 사용자 정보 포함)
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const redirectUrl = `${clientUrl}/auth-bridge.html?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
    console.log('🔍 Google Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  }
);

// Kakao OAuth routes - only if KAKAO_CLIENT_ID is configured
if (process.env.KAKAO_CLIENT_ID) {
  router.get('/kakao', passport.authenticate('kakao', { 
    prompt: 'login' // 매번 카카오 로그인 화면 표시
  }));

  router.get('/kakao/callback',
    passport.authenticate('kakao', { session: false }),
    (req, res) => {
      console.log('🔍 Kakao callback hit!');
      console.log('CLIENT_URL from env:', process.env.CLIENT_URL);
      
      const token = generateToken(req.user._id);
      const user = {
        _id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        profileImage: req.user.profileImage,
        onboardingCompleted: true  // MVP에서는 온보딩 없음
      };
    
    // auth-bridge.html로 리다이렉트 (토큰과 사용자 정보 포함)
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const redirectUrl = `${clientUrl}/auth-bridge.html?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`;
    console.log('🔍 Redirecting to:', redirectUrl);
    res.redirect(redirectUrl);
  }
  );
}

module.exports = router;