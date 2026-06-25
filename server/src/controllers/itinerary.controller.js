const Itinerary = require('../models/Itinerary');
const { generateItinerary } = require('../services/ai.service');
const { generateShareToken } = require('../utils/shareToken');

/**
 * POST /api/itinerary/generate
 * Generate AI itinerary from extracted booking data
 */
const generate = async (req, res, next) => {
  try {
    const { itineraryId } = req.body;

    if (!itineraryId) {
      return res.status(400).json({ success: false, message: 'itineraryId is required.' });
    }

    const itinerary = await Itinerary.findOne({
      _id: itineraryId,
      userId: req.user._id,
    });

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found.' });
    }

    if (itinerary.status === 'generating') {
      return res.status(409).json({ success: false, message: 'Itinerary is already being generated.' });
    }

    if (!itinerary.extractedData) {
      return res.status(400).json({
        success: false,
        message: 'No extracted data found. Please upload documents first.',
      });
    }

    // Set status to generating immediately
    itinerary.status = 'generating';
    await itinerary.save();

    // Background generation
    generateInBackground(itinerary._id, itinerary.extractedData).catch(err => {
      console.error('Background generation error:', err.message);
    });

    res.status(202).json({
      success: true,
      message: 'AI is generating your personalized itinerary...',
      data: { itineraryId: itinerary._id, status: 'generating' },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Background: generate itinerary and save to DB
 */
const generateInBackground = async (itineraryId, extractedData) => {
  try {
    const generatedItinerary = await generateItinerary(extractedData);

    const shareToken = generateShareToken();

    await Itinerary.findByIdAndUpdate(itineraryId, {
      status: 'ready',
      itinerary: generatedItinerary,
      title: `${generatedItinerary.origin || 'Home'} → ${generatedItinerary.destination} Trip`,
      shareToken,
      isPublic: false,
    });

    console.log(`✅ Itinerary generated for ${itineraryId}`);
  } catch (error) {
    console.error(`❌ Generation failed for ${itineraryId}:`, error.message);
    await Itinerary.findByIdAndUpdate(itineraryId, {
      status: 'failed',
      errorMessage: error.message,
    });
  }
};

/**
 * GET /api/itinerary
 * Get all itineraries for logged-in user (paginated)
 */
const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const status = req.query.status; // optional filter

    const query = { userId: req.user._id };
    if (status) query.status = status;

    const [itineraries, total] = await Promise.all([
      Itinerary.find(query)
        .select('-extractedData.rawText -itinerary.days.morning -itinerary.days.afternoon -itinerary.days.evening')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Itinerary.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        itineraries,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/itinerary/:id
 * Get a single itinerary by ID (must belong to user)
 */
const getOne = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found.' });
    }

    res.json({ success: true, data: { itinerary } });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/itinerary/:id/status
 * Poll generation status
 */
const getStatus = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).select('status errorMessage itinerary title shareToken isPublic');

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found.' });
    }

    res.json({
      success: true,
      data: {
        status: itinerary.status,
        title: itinerary.title,
        errorMessage: itinerary.errorMessage,
        itinerary: itinerary.status === 'ready' ? itinerary.itinerary : null,
        shareToken: itinerary.shareToken,
        isPublic: itinerary.isPublic,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/itinerary/:id
 */
const deleteItinerary = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found.' });
    }

    res.json({ success: true, message: 'Itinerary deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/itinerary/:id/share
 * Toggle public sharing
 */
const toggleShare = async (req, res, next) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!itinerary) {
      return res.status(404).json({ success: false, message: 'Itinerary not found.' });
    }

    if (itinerary.status !== 'ready') {
      return res.status(400).json({
        success: false,
        message: 'Can only share a completed itinerary.',
      });
    }

    itinerary.isPublic = !itinerary.isPublic;

    // Generate share token if not exists
    if (!itinerary.shareToken) {
      itinerary.shareToken = generateShareToken();
    }

    await itinerary.save();

    const shareUrl = itinerary.isPublic
      ? `${process.env.CLIENT_URL}/share/${itinerary.shareToken}`
      : null;

    res.json({
      success: true,
      message: itinerary.isPublic ? 'Itinerary is now public.' : 'Itinerary is now private.',
      data: {
        isPublic: itinerary.isPublic,
        shareToken: itinerary.shareToken,
        shareUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generate, getAll, getOne, getStatus, deleteItinerary, toggleShare };
