const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  date: { type: String },
  title: { type: String },
  theme: { type: String },
  morning: { type: String },
  afternoon: { type: String },
  evening: { type: String },
  night: { type: String },
  accommodation: { type: String },
  meals: [{ type: String }],
  transport: { type: String },
  tips: { type: String },
  highlights: [{ type: String }],
  estimatedCost: { type: String },
}, { _id: false });

const flightSchema = new mongoose.Schema({
  airline: String,
  flightNumber: String,
  from: String,
  to: String,
  departure: String,
  arrival: String,
  class: String,
  pnr: String,
  passengers: [String],
}, { _id: false });

const hotelSchema = new mongoose.Schema({
  name: String,
  location: String,
  checkIn: String,
  checkOut: String,
  roomType: String,
  guests: Number,
  confirmationNo: String,
}, { _id: false });

const trainSchema = new mongoose.Schema({
  trainName: String,
  trainNumber: String,
  from: String,
  to: String,
  departure: String,
  arrival: String,
  class: String,
  pnr: String,
  passengers: [String],
}, { _id: false });

const extractedDataSchema = new mongoose.Schema({
  travelerName: String,
  travelers: [String],
  origin: String,
  destination: String,
  tripStartDate: String,
  tripEndDate: String,
  flights: [flightSchema],
  hotels: [hotelSchema],
  trains: [trainSchema],
  otherBookings: [mongoose.Schema.Types.Mixed],
  rawText: String,
}, { _id: false });

const itineraryDataSchema = new mongoose.Schema({
  destination: String,
  origin: String,
  duration: String,
  tripType: String,
  summary: String,
  highlights: [String],
  days: [daySchema],
  essentials: [String],
  travelTips: [String],
  estimatedBudget: String,
  bestTimeToVisit: String,
  currency: String,
  language: String,
  timezone: String,
}, { _id: false });

const uploadedFileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number },
  fileType: { type: String, enum: ['pdf', 'image'] },
}, { _id: false });

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      default: 'My Travel Itinerary',
    },
    status: {
      type: String,
      enum: ['uploading', 'extracting', 'generating', 'ready', 'failed'],
      default: 'uploading',
      index: true,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    uploadedFiles: [uploadedFileSchema],
    extractedData: {
      type: extractedDataSchema,
      default: null,
    },
    itinerary: {
      type: itineraryDataSchema,
      default: null,
    },
    // Sharing
    shareToken: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    // Metadata
    tags: [String],
    coverImage: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for destination thumbnail or summary
itinerarySchema.virtual('destinationSummary').get(function () {
  if (this.itinerary?.destination) return this.itinerary.destination;
  if (this.extractedData?.destination) return this.extractedData.destination;
  return 'Unknown Destination';
});

// Index for efficient user queries
itinerarySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Itinerary', itinerarySchema);
