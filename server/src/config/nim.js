const OpenAI = require('openai');

let nimClient = null;

const getNimClient = () => {
  if (!nimClient) {
    if (!process.env.NVIDIA_API_KEY) {
      throw new Error('NVIDIA_API_KEY is not set in environment variables');
    }
    nimClient = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });
  }
  return nimClient;
};

module.exports = { getNimClient };
