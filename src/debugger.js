const fs = require('fs');
const chalk = require('chalk');
const { analyzeWithGrok } = require('./ai');

/**
 * Debugs a specific file using AI.
 * @param {string} filePath - Absolute path to the file.
 * @param {string} errorHint - Optional error message or hint from the user.
 * @returns {Promise<{explanation: string, fixedCode: string}>}
 */
async function debugFile(filePath, errorHint) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Construct a focused prompt for debugging
    let prompt = `Act as a Senior Software Debugger. I have a bug in the following file.\n`;
    if (errorHint) {
        prompt += `User Check/Error Message: "${errorHint}"\n`;
    }
    prompt += `\nAnalyze the code deeply. Explain the bug clearly and provide the FIXED code within a code block.\n`;

    // Reuse the existing AI client, wrapping the single file in the expected array structure
    const files = [{ path: filePath, content: content }];

    const aiResponse = await analyzeWithGrok(files, prompt);

    return aiResponse;
}

module.exports = { debugFile };
