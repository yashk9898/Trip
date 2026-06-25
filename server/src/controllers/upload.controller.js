const Itinerary = require('../models/Itinerary');
const { extractBookingData } = require('../services/ai.service');
const { extractPdfTexts } = require('../services/pdf.service');
const fs = require('fs');
const path = require('path');

/**
 * POST /api/upload/documents
 * Upload travel documents and extract booking data using AI
 */
const uploadDocuments = async (req, res, next) => {
  const uploadedFiles = req.files || [];

  if (!uploadedFiles.length) {
    return res.status(400).json({
      success: false,
      message: 'Please upload at least one travel document (PDF or image).',
    });
  }

  // Create an itinerary record in 'uploading' status immediately
  const itinerary = await Itinerary.create({
    userId: req.user._id,
    title: req.body.title || 'My Travel Itinerary',
    status: 'uploading',
    uploadedFiles: uploadedFiles.map(f => ({
      filename: f.filename,
      originalName: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      fileType: f.mimetype === 'application/pdf' ? 'pdf' : 'image',
    })),
  });

  // Process async (don't block response)
  processDocuments(itinerary._id, uploadedFiles).catch(err => {
    console.error('Background processing error:', err.message);
  });

  res.status(202).json({
    success: true,
    message: 'Documents uploaded. AI is extracting booking information...',
    data: {
      itineraryId: itinerary._id,
      status: itinerary.status,
      fileCount: uploadedFiles.length,
    },
  });
};

/**
 * Background processing: extract data from uploaded files
 */
const processDocuments = async (itineraryId, files) => {
  try {
    // Update status to extracting
    await Itinerary.findByIdAndUpdate(itineraryId, { status: 'extracting' });

    // Extract PDF texts
    const pdfTexts = await extractPdfTexts(files);

    // AI extraction
    const extractedData = await extractBookingData(files, pdfTexts);

    // Build a good title
    const destination = extractedData.destination || 'Unknown';
    const origin = extractedData.origin || '';
    const title = origin
      ? `${origin} → ${destination} Trip`
      : `${destination} Trip`;

    await Itinerary.findByIdAndUpdate(itineraryId, {
      status: 'ready',
      extractedData,
      title,
    });

    console.log(`✅ Extraction complete for itinerary ${itineraryId}`);
  } catch (error) {
    console.error(`❌ Extraction failed for itinerary ${itineraryId}:`, error.message);
    await Itinerary.findByIdAndUpdate(itineraryId, {
      status: 'failed',
      errorMessage: error.message,
    });
  }
};

/**
 * GET /api/upload/status/:itineraryId
 * Poll for extraction status
 */
const getUploadStatus = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.itineraryId,
      userId: req.user._id,
    }).select('status extractedData errorMessage title');

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found.' });
    }

    res.json({
      success: true,
      data: {
        status: itinerary.status,
        title: itinerary.title,
        extractedData: itinerary.status === 'ready' ? itinerary.extractedData : null,
        errorMessage: itinerary.errorMessage,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadDocuments, getUploadStatus };
