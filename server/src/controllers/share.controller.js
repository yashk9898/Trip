const Itinerary = require('../models/Itinerary');

/**
 * GET /api/share/:token
 * Public endpoint — no auth required
 * Returns a publicly shared itinerary by its share token
 */
const getSharedItinerary = async (req, res, next) => {
  try {
    const { token } = req.params;

    const itinerary = await Itinerary.findOne({
      shareToken: token,
      isPublic: true,
      status: 'ready',
    })
      .populate('userId', 'name') // Include creator's name only
      .lean();

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: 'This itinerary does not exist or is no longer shared.',
      });
    }

    // Increment view count
    await Itinerary.findByIdAndUpdate(itinerary._id, { $inc: { viewCount: 1 } });

    // Return public-safe data (exclude sensitive extraction data)
    const publicData = {
      _id: itinerary._id,
      title: itinerary.title,
      itinerary: itinerary.itinerary,
      createdAt: itinerary.createdAt,
      viewCount: itinerary.viewCount + 1,
      creator: itinerary.userId?.name || 'Anonymous Traveler',
      shareToken: itinerary.shareToken,
    };

    res.json({ success: true, data: { itinerary: publicData } });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSharedItinerary };
