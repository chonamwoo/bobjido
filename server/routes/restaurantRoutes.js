const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect, optionalAuth } = require('../middleware/auth');
const {
  searchRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  uploadRestaurantImages,
  verifyRestaurant,
  getRestaurantsByLocation,
  searchKakaoPlaces,
  searchNaverPlaces,
} = require('../controllers/restaurantController');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'restaurant-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB per file
  },
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('이미지 파일만 업로드 가능합니다'));
    }
  }
});

router.get('/', searchRestaurants); // 모든 레스토랑 조회
router.get('/search', searchRestaurants);
router.get('/search/kakao', searchKakaoPlaces);
router.get('/search/naver', searchNaverPlaces);
router.get('/location', getRestaurantsByLocation);
router.get('/:id', optionalAuth, getRestaurant);
router.post('/', protect, createRestaurant);
router.put('/:id', protect, updateRestaurant);
router.post('/:id/images', protect, upload.array('images', 5), uploadRestaurantImages);
router.post('/:id/verify', protect, verifyRestaurant);

module.exports = router;