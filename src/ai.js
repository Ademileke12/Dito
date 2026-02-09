const axios = require('axios');
const chalk = require('chalk');

// Obfuscated Key to prevent casual editing
const SECRET = 'dito-secure-squad';
const ENCRYPTED_KEY = 'AxofMFwmLRlHRlBpKwgkBwYjXEVYRgMBNDIWHE9ANywrJyA6IThaNxIQBBc9QRYyFjYWLjwcJE8=';

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
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Sends the project context to Groq AI
 * @param {Array<{path: string, content: string}>} files - The project files
 * @param {string} prompt - The specific analysis prompt
 * @returns {Promise<string>} - The AI's response
 */
async function analyzeWithGrok(files, prompt) {
    if (process.env.MOCK_AI) {
        console.log(chalk.yellow("⚠️  Using MOCK AI Response"));
        return `# MOCK Groq Report\n\n## Grade: F\n\nCritical Issue: SQL Injection detected.`;
    }

    // Construct context with total length management
    const MAX_CHAR_LIMIT = 30000; // ~6k-8k tokens, safe for Groq Free Tier (12k limit)
    let context = "Here is the codebase summary and key file contents:\n\n";

    // First, list all files found
    context += `Total Files in project: ${files.length}\nFiles: ${files.map(f => f.path).join(', ')}\n\n`;

    let currentLength = context.length;
    for (const file of files) {
        const fileHeader = `File: ${file.path}\n\`\`\`\n`;
        const fileFooter = `\n\`\`\`\n\n`;

        // If file is too large for remaining space, truncate it or skip
        let fileContent = file.content;
        if (currentLength + fileHeader.length + fileFooter.length + 100 > MAX_CHAR_LIMIT) {
            context += `... (Other files omitted due to size limits) ...\n`;
            break;
        }

        if (currentLength + fileHeader.length + fileContent.length + fileFooter.length > MAX_CHAR_LIMIT) {
            const remainingSpace = MAX_CHAR_LIMIT - currentLength - fileHeader.length - fileFooter.length - 50;
            fileContent = fileContent.substring(0, remainingSpace) + "\n... (File truncated due to size limits) ...";
        }

        const fileBlock = fileHeader + fileContent + fileFooter;
        context += fileBlock;
        currentLength += fileBlock.length;

        if (currentLength >= MAX_CHAR_LIMIT) break;
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
            model: 'llama-3.3-70b-versatile',
            messages: messages,
            stream: false
        }, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.data.choices || !response.data.choices.length) {
            if (response.data.error) {
                throw new Error(`API Error: ${JSON.stringify(response.data.error)}`);
            }
            throw new Error(`Invalid API Response: ${JSON.stringify(response.data)}`);
        }

        return response.data.choices[0].message.content;

    } catch (error) {
        if (error.response) {
            console.error(chalk.red("\nAPI Error Details:"), JSON.stringify(error.response.data, null, 2));
            throw new Error(`Groq API Error: ${error.response.status}`);
        } else {
            throw error;
        }
    }
}

module.exports = { analyzeWithGrok };
