const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  analyzeTaste,
  getTasteProfile,
  confirmTasteProfile,
  getMatchingUsers,
  getAllTasteTypes,
  getRecommendationsByTaste,
  initTypes
} = require('../controllers/tasteProfileController');

router.get('/types', getAllTasteTypes);

router.use(protect);

router.post('/analyze', analyzeTaste);
router.get('/profile/:userId?', getTasteProfile);
router.post('/confirm', confirmTasteProfile);
router.get('/matching-users', getMatchingUsers);
router.get('/recommendations', getRecommendationsByTaste);

router.post('/init-types', initTypes);

module.exports = router;