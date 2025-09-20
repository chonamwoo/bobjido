const express = require('express');
const router = express.Router();
const rankingController = require('../controllers/rankingController');
const { protect } = require('../middleware/auth');

// 카테고리별 랭킹 조회
router.get('/category/:category', rankingController.getCategoryRankings);

// 전체 카테고리 랭킹 요약
router.get('/all-categories', rankingController.getAllCategoryRankings);

// 사용자의 선호 음식 기반 추천
router.get('/recommendations', protect, rankingController.getRecommendedByPreferences);

// 사용자의 선호 음식 업데이트
router.put('/preferences/:userId', protect, rankingController.updatePreferredFoods);

// 사용자의 전문성 점수 업데이트 (내부 API)
router.post('/expertise/:userId', protect, rankingController.updateExpertiseScore);

module.exports = router;