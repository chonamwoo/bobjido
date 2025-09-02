const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { register, login, getMe, updateProfile, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { passport, generateToken } = require('../config/passport');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  '/register',
  [
    body('username').isLength({ min: 3 }).withMessage('사용자명은 최소 3자 이상이어야 합니다'),
    body('email').isEmail().withMessage('유효한 이메일을 입력하세요'),
    body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다'),
  ],
  handleValidationErrors,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('유효한 이메일을 입력하세요'),
    body('password').notEmpty().withMessage('비밀번호를 입력하세요'),
  ],
  handleValidationErrors,
  login
);

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
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

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
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
    res.redirect(`${clientUrl}/auth-bridge.html?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  }
);

// Kakao OAuth routes
router.get('/kakao', passport.authenticate('kakao'));

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
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
    console.log('🔍 Redirecting to:', clientUrl);
    res.redirect(`${clientUrl}/auth-bridge.html?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  }
);

module.exports = router;