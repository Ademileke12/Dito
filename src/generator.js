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
    // Regex to find javascript code blocks that look like the test suite
    const codeBlockRegex = /```javascript([\s\S]*?)```/g;
    let match;
    let testCode = '';

    // Find the last code block or a reliable one that looks like the test suite?
    // Our prompt asks for "standalone test-runner.js", so we look for that.
    while ((match = codeBlockRegex.exec(aiResponse)) !== null) {
        if (match[1].includes('axios') || match[1].includes('fetch') || match[1].includes('require')) {
            testCode = match[1].trim();
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
