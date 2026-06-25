const express = require('express');
const { getSharedItinerary } = require('../controllers/share.controller');

const router = express.Router();

// Public — no auth required
router.get('/:token', getSharedItinerary);

module.exports = router;
