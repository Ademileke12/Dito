const axios = require('axios');
const chalk = require('chalk');

// Obfuscated Key to prevent casual editing
const SECRET = 'dito-secure-squad';
const ENCRYPTED_KEY = 'U15EW05HVVZARAcUR0FFWF1VXEVbTBJTUEZHVEgXR0A=';

function getApiKey() {
    try {
        const text = Buffer.from(ENCRYPTED_KEY, 'base64').toString('binary');
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ SECRET.charCodeAt(i % SECRET.length);
            result += String.fromCharCode(charCode);
        }
        return result;
    } catch (e) {
        return '';
    }
}

const API_KEY = getApiKey();
const API_URL = 'https://api.xroute.ai/deepseek/v1/chat/completions';

/**
 * Sends the project context to DeepSeek AI via Xroute
 * @param {Array<{path: string, content: string}>} files - The project files
 * @param {string} prompt - The specific analysis prompt
 * @returns {Promise<string>} - The AI's response
 */
async function analyzeWithGrok(files, prompt) {
    if (process.env.MOCK_AI) {
        console.log(chalk.yellow("⚠️  Using MOCK AI Response"));
        return `# MOCK DeepSeek Report\n\n## Grade: F\n\nCritical Issue: SQL Injection detected.`;
    }

    // Construct context
    let context = "Here is the codebase:\n\n";
    for (const file of files) {
        context += `File: ${file.path}\n\`\`\`\n${file.content}\n\`\`\`\n\n`;
    }

    const messages = [
        {
            role: 'system',
            content: 'You are an expert Senior Software Engineer and Security Researcher. You audit code for vibe coding pitfalls.'
        },
        {
            role: 'user',
            content: `${prompt}\n\n${context}`
        }
    ];

    try {
        const response = await axios.post(API_URL, {
            model: 'deepseek-v3-2-251201',
            messages: messages,
            stream: false // Keeping stream false for simpler CLI handling
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.data.choices || !response.data.choices.length) {
            // Check for specific Xroute error formats
            if (response.data.error) {
                throw new Error(`API Error: ${JSON.stringify(response.data.error)}`);
            }
            throw new Error(`Invalid API Response: ${JSON.stringify(response.data)}`);
        }

        return response.data.choices[0].message.content;

    } catch (error) {
        if (error.response) {
            // Log more details for debugging
            console.error(chalk.red("\nAPI Error Details:"), JSON.stringify(error.response.data, null, 2));
            throw new Error(`Grok API Error: ${error.response.status}`);
        } else {
            throw error;
        }
    }
}

module.exports = { analyzeWithGrok };
