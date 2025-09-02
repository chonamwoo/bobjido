const express = require('express');
const router = express.Router();
const { searchRestaurants } = require('../controllers/searchController');

// 일반 사용자용 맛집 검색 (인증 불필요)
router.get('/restaurants', searchRestaurants);

module.exports = router;