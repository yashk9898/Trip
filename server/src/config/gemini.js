const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

const getGeminiClient = () => {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
};

const getTextModel = () => {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
};

const getVisionModel = () => {
  const client = getGeminiClient();
  return client.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
};

module.exports = { getTextModel, getVisionModel, getGeminiClient };
