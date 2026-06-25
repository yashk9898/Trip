const express = require('express');
const { protect } = require('../middleware/auth');
const {
  generate,
  getAll,
  getOne,
  getStatus,
  deleteItinerary,
  toggleShare,
} = require('../controllers/itinerary.controller');

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/generate', generate);
router.get('/', getAll);
router.get('/:id', getOne);
router.get('/:id/status', getStatus);
router.delete('/:id', deleteItinerary);
router.patch('/:id/share', toggleShare);

module.exports = router;
