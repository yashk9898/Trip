const { getTextModel, getVisionModel } = require('../config/gemini');
const { getNimClient } = require('../config/nim');
const fs = require('fs');
const path = require('path');

// ── UTILS ─────────────────────────────────────────────────────────────────────
const parseJSONSafely = (text) => {
  let cleaned = text.trim();
  const fenceMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch) cleaned = fenceMatch[1];
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');
  return JSON.parse(cleaned);
};

const fileToGenerativePart = (filePath, mimeType) => {
  const data = fs.readFileSync(filePath);
  return {
    inlineData: {
      data: data.toString('base64'),
      mimeType,
    },
  };
};

const fileToNimImageMessage = (filePath, mimeType) => {
  const data = fs.readFileSync(filePath);
  const base64Data = data.toString('base64');
  return {
    type: 'image_url',
    image_url: {
      url: `data:${mimeType};base64,${base64Data}`,
    },
  };
};

// ── PROMPTS ───────────────────────────────────────────────────────────────────
const EXTRACTION_PROMPT = `
You are an expert travel document parser. Extract ALL travel booking information from the provided document(s).

Return a VALID JSON object (no markdown fences, no extra text) with this EXACT structure:
{
  "travelerName": "Primary traveler's full name or null",
  "travelers": ["array of all passenger/guest names"],
  "origin": "Origin city/airport",
  "destination": "Primary destination city/country",
  "tripStartDate": "YYYY-MM-DD or descriptive date string",
  "tripEndDate": "YYYY-MM-DD or descriptive date string",
  "flights": [
    {
      "airline": "Airline name",
      "flightNumber": "Flight number e.g. AI202",
      "from": "Departure airport code or city",
      "to": "Arrival airport code or city",
      "departure": "Date and time of departure",
      "arrival": "Date and time of arrival",
      "class": "Economy/Business/First",
      "pnr": "PNR/booking reference",
      "passengers": ["list of passenger names"]
    }
  ],
  "hotels": [
    {
      "name": "Hotel name",
      "location": "City, Country",
      "checkIn": "Check-in date",
      "checkOut": "Check-out date",
      "roomType": "Room type",
      "guests": 1,
      "confirmationNo": "Booking confirmation number"
    }
  ],
  "trains": [
    {
      "trainName": "Train name",
      "trainNumber": "Train number",
      "from": "Departure station",
      "to": "Arrival station",
      "departure": "Date and time",
      "arrival": "Date and time",
      "class": "Class of travel",
      "pnr": "PNR number",
      "passengers": ["passenger names"]
    }
  ],
  "otherBookings": []
}

Rules:
- Return ONLY valid JSON. No explanations, no markdown.
- Use null for any field you cannot find.
- Extract every booking detail visible in the document.
- If a field is unknown, use null, not empty string.
`;

const buildItineraryPrompt = (extractedData) => `
You are a world-class travel planner with deep expertise in crafting luxury, personalized travel experiences.

Based on the following booking data, create a comprehensive, day-by-day travel itinerary:

BOOKING DATA:
${JSON.stringify(extractedData, null, 2)}

Generate a VALID JSON object (no markdown, no extra text) with this EXACT structure:
{
  "destination": "Primary destination name",
  "origin": "Origin city",
  "duration": "X days / Y nights",
  "tripType": "Leisure/Business/Adventure/Cultural",
  "summary": "2-3 sentence engaging trip overview",
  "highlights": ["Top 5 trip highlights as strings"],
  "days": [
    {
      "day": 1,
      "date": "Date string e.g. Mon, 15 Jul",
      "title": "Catchy day title e.g. 'Arrival & City Discovery'",
      "theme": "Theme/focus of the day",
      "morning": "Detailed morning activities and suggestions (2-3 sentences)",
      "afternoon": "Detailed afternoon plan (2-3 sentences)",
      "evening": "Evening activities, dinner recommendations (2-3 sentences)",
      "night": "Nighttime suggestions or rest",
      "accommodation": "Hotel name and brief note or null",
      "meals": ["Breakfast recommendation", "Lunch recommendation", "Dinner recommendation"],
      "transport": "Transport used this day",
      "highlights": ["Key highlight 1", "Key highlight 2"],
      "tips": "Practical tip for this day",
      "estimatedCost": "Rough daily budget estimate"
    }
  ],
  "essentials": ["Packing list item 1", "Packing list item 2", "...at least 8 items"],
  "travelTips": ["Cultural tip", "Safety tip", "Budget tip", "...at least 5 tips"],
  "estimatedBudget": "Total estimated trip budget range",
  "bestTimeToVisit": "Best season/time info",
  "currency": "Local currency",
  "language": "Local language(s)",
  "timezone": "Timezone"
}

Rules:
- Return ONLY valid JSON. No markdown fences. No explanations.
- Generate a day for EVERY day of the trip (travel days, layovers, check-in/out days ALL count).
- Day 1 should account for arrival/travel time.
- Last day should account for departure.
- Make activities SPECIFIC to the destination.
- Be enthusiastic and inspiring while staying practical.
- If dates are unclear, infer a 5-day trip starting from the booking date.
`;

// ── PRIMARY CONTROLLERS (NIM) ─────────────────────────────────────────────────
const runNimExtraction = async (files, extractedPdfTexts) => {
  const nimClient = getNimClient();
  const content = [{ type: 'text', text: EXTRACTION_PROMPT }];

  for (const text of extractedPdfTexts) {
    if (text) content.push({ type: 'text', text: `\n\nDocument content:\n${text}` });
  }

  for (const file of files) {
    if (file.fileType === 'image' || file.mimetype?.startsWith('image/')) {
      try {
        content.push(fileToNimImageMessage(file.path, file.mimetype));
      } catch (err) {
        console.warn(`Could not read image file ${file.filename}:`, err.message);
      }
    }
  }

  if (content.length <= 1) {
    throw new Error('No processable content found in uploaded files');
  }

  const response = await nimClient.chat.completions.create({
    model: 'meta/llama-3.2-90b-vision-instruct',
    messages: [{ role: 'user', content }],
    temperature: 0.1,
    max_tokens: 2000,
  });

  return parseJSONSafely(response.choices[0].message.content);
};

const runNimGeneration = async (extractedData) => {
  const nimClient = getNimClient();
  const prompt = buildItineraryPrompt(extractedData);

  const response = await nimClient.chat.completions.create({
    model: 'meta/llama-3.1-8b-instruct',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.6,
    max_tokens: 3000,
    response_format: { type: 'json_object' },
  });

  return parseJSONSafely(response.choices[0].message.content);
};

// ── FALLBACK CONTROLLERS (GEMINI) ─────────────────────────────────────────────
const runGeminiExtraction = async (files, extractedPdfTexts) => {
  const model = getVisionModel();
  const parts = [{ text: EXTRACTION_PROMPT }];

  for (const text of extractedPdfTexts) {
    if (text) parts.push({ text: `\n\nDocument content:\n${text}` });
  }

  for (const file of files) {
    if (file.fileType === 'image' || file.mimetype?.startsWith('image/')) {
      try {
        parts.push(fileToGenerativePart(file.path, file.mimetype));
      } catch (err) {
        console.warn(`Could not read image file ${file.filename}:`, err.message);
      }
    }
  }

  if (parts.length <= 1) {
    throw new Error('No processable content found in uploaded files');
  }

  const result = await model.generateContent(parts);
  return parseJSONSafely(result.response.text());
};

const runGeminiGeneration = async (extractedData) => {
  const model = getTextModel();
  const prompt = buildItineraryPrompt(extractedData);

  const result = await model.generateContent(prompt);
  return parseJSONSafely(result.response.text());
};

// ── EXPORTED WRAPPERS (NIM -> GEMINI FALLBACK) ────────────────────────────────
const extractBookingData = async (files, extractedPdfTexts = []) => {
  try {
    console.log('🤖 Attempting extraction with NVIDIA NIM...');
    return await runNimExtraction(files, extractedPdfTexts);
  } catch (error) {
    console.warn('⚠️ NVIDIA NIM Extraction failed, falling back to Gemini API:', error.message);
    try {
      console.log('🤖 Attempting extraction with Google Gemini...');
      return await runGeminiExtraction(files, extractedPdfTexts);
    } catch (geminiError) {
      console.error('❌ Both AI extractions failed. Gemini error:', geminiError.message);
      throw new Error('AI could not parse the document. Please ensure it is a valid travel booking document.');
    }
  }
};

const generateItinerary = async (extractedData) => {
  try {
    console.log('✨ Attempting generation with NVIDIA NIM...');
    return await runNimGeneration(extractedData);
  } catch (error) {
    console.warn('⚠️ NVIDIA NIM Generation failed, falling back to Gemini API:', error.message);
    try {
      console.log('✨ Attempting generation with Google Gemini...');
      return await runGeminiGeneration(extractedData);
    } catch (geminiError) {
      console.error('❌ Both AI generations failed. Gemini error:', geminiError.message);
      throw new Error('AI itinerary generation failed. Please try again.');
    }
  }
};

module.exports = { extractBookingData, generateItinerary };
