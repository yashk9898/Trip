const express = require('express');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const { uploadDocuments, getUploadStatus } = require('../controllers/upload.controller');

const router = express.Router();

// Upload multiple documents (up to 10 files)
router.post('/documents', protect, upload.array('documents', 10), uploadDocuments);

// Poll upload/extraction status
router.get('/status/:itineraryId', protect, getUploadStatus);

module.exports = router;
