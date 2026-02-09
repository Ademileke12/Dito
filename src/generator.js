const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * Parses the AI response and saves the report and test files.
 * @param {string} aiResponse - The raw response from Grok.
 * @param {string} targetDir - The directory to save the output.
 */
async function generateOutput(aiResponse, targetDir) {
    const reportPath = path.join(targetDir, 'dito-report.md');
    const testPath = path.join(targetDir, 'dito_generated_tests.js');

    console.log(chalk.blue(`\nProcessing AI Response...`));

    // 1. Save the full report
    // We assume the AI returns the markdown report as the main body.
    // Ideally, we might ask the AI to separate them, but for now, we'll save the whole thing as the report
    // and try to extract the code block for the tests.

    fs.writeFileSync(reportPath, aiResponse);
    console.log(chalk.green(`✓ Report generated: ${reportPath}`));

    // 2. Extract Test Code
    // We prefer the custom DITO delimiters for perfect extraction.
    const delimiterRegex = /---BEGIN DITO TESTS---([\s\S]*?)---END DITO TESTS---/;
    const delimiterMatch = aiResponse.match(delimiterRegex);

    if (delimiterMatch) {
        testCode = delimiterMatch[1].trim();
        // Remove potential markdown code block markers if the AI accidentally included them inside delimiters
        testCode = testCode.replace(/^```javascript\n?/, '').replace(/\n?```$/, '').trim();

        // Safety Clean: Remove any LLM-induced require('fetch') or node-fetch lines
        testCode = testCode.replace(/^.*require\(['"](node-)?fetch['"]\).*$/gm, '');
        testCode = testCode.replace(/^.*import .* from ['"](node-)?fetch['"].*$/gm, '');
        testCode = testCode.trim();
    } else {
        // Fallback to markdown extraction if delimiters are missing (V1 compatibility)
        const codeBlockRegex = /```javascript([\s\S]*?)```/g;
        let match;
        while ((match = codeBlockRegex.exec(aiResponse)) !== null) {
            if (match[1].includes('fetch') || match[1].includes('require')) {
                testCode = match[1].trim();
            }
        }
    }

    if (testCode) {
        fs.writeFileSync(testPath, testCode);
        console.log(chalk.green(`✓ Test Suite generated: ${testPath}`));
        console.log(chalk.yellow(`\nTo run tests: node ${path.relative(process.cwd(), testPath)}`));
    } else {
        console.warn(chalk.yellow('⚠ Could not extract test code automatically. Please check the report manually.'));
    }
}

module.exports = { generateOutput };
