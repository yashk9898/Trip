const crypto = require('crypto');

/**
 * Generate a URL-safe unique share token
 * @param {number} length - Length of the token (default: 16)
 * @returns {string} URL-safe token
 */
const generateShareToken = (length = 16) => {
  return crypto.randomBytes(length).toString('base64url').slice(0, length);
};

module.exports = { generateShareToken };
