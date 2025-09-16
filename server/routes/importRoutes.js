const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const {
  parseNaverShareLink,
  searchNaverPlace,
  batchImportPlaces,
  handleNaverOAuthCallback
} = require('../controllers/importController');

// 네이버 공유 링크 파싱
router.post('/naver-link', optionalAuth, parseNaverShareLink);

// 네이버 장소 검색
router.get('/search-naver', searchNaverPlace);

// 배치 임포트
router.post('/batch', optionalAuth, batchImportPlaces);

// 네이버 OAuth 콜백
router.get('/naver/callback', handleNaverOAuthCallback);

module.exports = router;