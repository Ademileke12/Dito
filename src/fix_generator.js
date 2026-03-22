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

    let issues = [];
    
    // Try to parse multiple issue sections
    const sections = [
        'Critical Issues',
        'Critical Vulnerabilities',
        'Security Issues',
        'Performance Issues',
        'Code Quality Issues',
        'Testing Issues',
        'Improvements',
        'Warnings'
    ];

    sections.forEach(sectionName => {
        const sectionRegex = new RegExp(`${sectionName}[\\s\\S]*?(?=(##|###|\\*\\*[A-Z]|$))`, 'i');
        const match = reportContent.match(sectionRegex);

        if (match) {
            const section = match[0];
            // Match numbered items: 1. **Title** or - **Title**
            const items = section.split(/\n\s*(?:\d+\.|-)\s+/);

            items.forEach(item => {
                const boldMatch = item.match(/\*\*(.*?)\*\*(?::)?\s*([\s\S]*)/);
                if (boldMatch) {
                    const title = boldMatch[1].trim();
                    let description = boldMatch[2].trim();

                    // Clean up description
                    description = description.replace(/^[\s\S]*?\n\s*\*?\s*/, '').split('\n')[0].trim();

                    if (title && description && title.length > 3) {
                        // Avoid duplicates
                        if (!issues.find(i => i.title === title)) {
                            issues.push({ title, description, section: sectionName });
                        }
                    }
                }
            });
        }
    });

    // Always create the file, even if no issues found
    let output = `# 🛠️ Dito Fix Prompts\n\n`;
    output += `Use these prompts with any AI (ChatGPT, DeepSeek, Claude) to fix the issues found in your code.\n\n`;
    
    if (issues.length === 0) {
        output += `## No Issues Found\n\n`;
        output += `Great job! Dito didn't find any specific issues that need fixing.\n\n`;
        output += `However, you can still use the full report to improve your code quality.\n\n`;
        output += `### 📋 General Improvement Prompt:\n`;
        output += `\`\`\`\n`;
        output += `Act as a Senior Software Engineer. Review my codebase and suggest improvements for:\n\n`;
        output += `1. Code organization and structure\n`;
        output += `2. Performance optimizations\n`;
        output += `3. Security best practices\n`;
        output += `4. Testing coverage\n`;
        output += `5. Documentation\n\n`;
        output += `Provide specific, actionable recommendations.\n`;
        output += `\`\`\`\n\n`;
    } else {
        output += `Found ${issues.length} issue(s) to address.\n\n`;
        output += `---\n\n`;

        issues.forEach((issue, index) => {
            output += `## Fix #${index + 1}: ${issue.title}\n\n`;
            output += `**Category**: ${issue.section}\n\n`;
            output += `**Issue**: ${issue.description}\n\n`;
            output += `### 📋 Copy & Paste Prompt:\n`;
            output += `\`\`\`\n`;
            output += `Act as a Senior Software Engineer. I have a code issue in my project.\n\n`;
            output += `ISSUE: ${issue.title} - ${issue.description}\n\n`;
            output += `TASK: Analyze the relevant files in my project and rewrite the code to fix this issue according to industry best practices. Ensure the fix is secure, efficient, and maintainable.\n`;
            output += `\`\`\`\n\n`;
            output += `---\n\n`;
        });
    }

    try {
        fs.writeFileSync(fixesPath, output);
        console.log(chalk.green(`✓ Fix Prompts generated: ${fixesPath} (${issues.length} issue${issues.length !== 1 ? 's' : ''})`));
    } catch (error) {
        console.error(chalk.red(`✗ Failed to generate fix prompts: ${error.message}`));
    }
}

module.exports = { generateFixPrompts };
