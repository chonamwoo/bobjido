const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  updateGlobalProfile,
  discoverByLocation,
  getTravelRecommendations,
  addLocalRecommendation
} = require('../controllers/globalDiscoveryController');

router.use(protect);

router.post('/profile', updateGlobalProfile);
router.get('/discover', discoverByLocation);
router.post('/travel-recommendations', getTravelRecommendations);
router.post('/local-recommendation', addLocalRecommendation);

module.exports = router;