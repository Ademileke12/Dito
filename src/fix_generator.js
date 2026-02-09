const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * Generates a `dito-fixes.md` file with copy-pasteable prompts.
 * @param {string} reportContent - The content of dito-report.md
 * @param {string} targetDir - The directory to save the fixes file
 */
function generateFixPrompts(reportContent, targetDir) {
    const fixesPath = path.join(targetDir, 'dito-fixes.md');

    // Naive parsing: Look for "Critical Issues" section and list items.
    // Ideally, we'd parse the structured output better, but regex will do for V2.

    let issues = [];
    const criticalRegex = /Critical Issues[\s\S]*?(?=(##|###|\*\*Improvements:|$))/i;
    const match = reportContent.match(criticalRegex);

    if (match) {
        const criticalSection = match[0];
        // Match numbered items: 1. **Title**
        const items = criticalSection.split(/\n\s*\d+\.\s+/);

        items.forEach(item => {
            const boldMatch = item.match(/\*\*(.*?)\*\*(?::)?\s*([\s\S]*)/);
            if (boldMatch) {
                const title = boldMatch[1].trim();
                let description = boldMatch[2].trim();

                // Clean up description if it starts with a newline and bullet points
                description = description.replace(/^[\s\S]*?\n\s*\*?\s*/, '').split('\n')[0].trim();

                if (title && description) {
                    issues.push({ title, description });
                }
            }
        });
    }

    if (issues.length === 0) {
        return; // No fixes to generate
    }

    let output = `# 🛠️ Dito Fix Prompts\n\n`;
    output += `Use these prompts with any AI (ChatGPT, DeepSeek, Claude) to fix the issues found in your code.\n\n`;
    output += `---\n\n`;

    issues.forEach((issue, index) => {
        output += `## Fix #${index + 1}: ${issue.title}\n\n`;
        output += `**Issue**: ${issue.description}\n\n`;
        output += `### 📋 Copy & Paste Prompt:\n`;
        output += `\`\`\`\n`;
        output += `Act as a Senior Security Engineer. I have a code issue in my project.\n\n`;
        output += `ISSUE: ${issue.title} - ${issue.description}\n\n`;
        output += `TASK: Analyze the relevant files in my project and rewrite the code to fix this issue according to industry best practices. Ensure the fix is secure and efficient.\n`;
        output += `\`\`\`\n\n`;
        output += `---\n\n`;
    });

    fs.writeFileSync(fixesPath, output);
    console.log(chalk.green(`✓ Fix Prompts generated: ${fixesPath}`));
}

module.exports = { generateFixPrompts };
