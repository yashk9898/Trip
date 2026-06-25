const pdfParse = require('pdf-parse');
const fs = require('fs');

/**
 * Extract text from a PDF file
 * @param {string} filePath - Absolute path to the PDF file
 * @returns {Promise<string>} Extracted text content
 */
const extractPdfText = async (filePath) => {
  try {
    const buffer = fs.readFileSync(filePath);
    const data = await pdfParse(buffer);

    // Normalize whitespace
    const text = data.text
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    return text;
  } catch (error) {
    console.error(`PDF extraction error for ${filePath}:`, error.message);
    throw new Error(`Could not read PDF file: ${error.message}`);
  }
};

/**
 * Extract text from multiple PDF files
 * @param {Array} files - Array of file objects with .path and .mimetype
 * @returns {Promise<string[]>} Array of extracted texts
 */
const extractPdfTexts = async (files) => {
  const pdfFiles = files.filter(f => f.mimetype === 'application/pdf');
  const results = await Promise.allSettled(
    pdfFiles.map(f => extractPdfText(f.path))
  );

  return results
    .filter(r => r.status === 'fulfilled' && r.value)
    .map(r => r.value);
};

module.exports = { extractPdfText, extractPdfTexts };
