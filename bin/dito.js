#!/usr/bin/env node

const { Command } = require('commander');
const ora = require('ora');
const chalk = require('chalk');
const path = require('path');
const { crawlProject } = require('../src/crawler');
const { analyzeWithGrok } = require('../src/ai');
const { ANALYSIS_PROMPT, TEST_GENERATION_PROMPT } = require('../src/prompts');
const { generateOutput } = require('../src/generator');
const { loadConfig } = require('../src/config');
const { generateFixPrompts } = require('../src/fix_generator');
const figlet = require('figlet');
const boxen = require('boxen');
const inquirer = require('inquirer');

const program = new Command();

program
    .name('dito')
    .description('AI-powered vibe coding auditor and test generator (Powered by Groq)')
    .version('1.0.0');



program
    .command('analyze <directory>')
    .description('Analyze a project directory')
    .action(async (directory) => {
        const targetDir = path.resolve(directory);

        // Load Config
        const config = loadConfig(targetDir);

        console.log(chalk.bold.cyan(`\n🔮 DITO: Initializing Vibe Check on ${targetDir}`));
        if (config.strictness !== 'standard') {
            console.log(chalk.gray(`   Mode: ${config.strictness}`));
        }
        console.log(''); // spacer

        const spinner = ora('Crawling project files...').start();

        try {
            // 1. Crawl Files
            // Pass config ignore list to crawler (TODO: update crawler to accept ignore list)
            const files = await crawlProject(targetDir);
            if (files.length === 0) {
                spinner.fail('No matching files found to analyze.');
                return;
            }
            spinner.succeed(`Found ${files.length} files.`);

            // 2. Analyze with AI
            spinner.start('Consulting Groq AI (Llama 3)...');

            let fullPrompt = `${ANALYSIS_PROMPT}\n\n${TEST_GENERATION_PROMPT}`;
            if (config.strictness === 'chill') {
                fullPrompt += "\n\n(Note: Be lenient with the grading. This is a hackathon project.)";
            } else if (config.strictness === 'strict') {
                fullPrompt += "\n\n(Note: Be extremely strict. This is mission-critical enterprise code.)";
            }

            const aiResponse = await analyzeWithGrok(files, fullPrompt);
            spinner.succeed('Analysis complete!');

            // 3. Generate Output
            await generateOutput(aiResponse, targetDir);

            // 4. Generate Fix Prompts
            generateFixPrompts(aiResponse, targetDir);

            // 5. Final Summary Box
            console.log('\n' + boxen(chalk.bold.magenta('✨ Dito Vibe Check Complete! ✨') +
                '\n\n' +
                chalk.white('📄 Report: ') + chalk.underline('dito-report.md') + '\n' +
                chalk.white('🛠️  Fixes:  ') + chalk.underline('dito-fixes.md') + '\n' +
                chalk.white('🧪 Tests:  ') + chalk.underline('dito_generated_tests.js'),
                { padding: 1, borderColor: 'green', borderStyle: 'round' })
            );

        } catch (error) {
            spinner.fail('An error occurred.');
            console.error(chalk.red(error.message));
            // Helpful hint if it's the specific API error
            if (error.message.includes('401')) {
                console.log(chalk.yellow('ℹ️  Unauthorized. Please check your Groq API key.'));
            }
            if (error.message.includes('503') || error.message.includes('500')) {
                console.log(chalk.yellow('ℹ️  The Groq API seems to be experiencing issues. Try again later or use MOCK_AI=true.'));
            }
        }
    });

const { debugFile } = require('../src/debugger');

// ... existing code ...

program
    .command('debug <file> [error]')
    .description('Debug a specific file with AI assistance')
    .action(async (file, error) => {
        const targetFile = path.resolve(file);
        console.log(chalk.bold.cyan(`\n🐛 DITO DEBUGGER: Analyzing ${targetFile}`));
        if (error) {
            console.log(chalk.yellow(`   Hint: "${error}"`));
        }

        const spinner = ora('Thinking...').start();

        try {
            const response = await debugFile(targetFile, error);
            spinner.stop();

            console.log('\n' + boxen(response, {
                padding: 1,
                title: 'Debugger Output',
                borderColor: 'red',
                borderStyle: 'double'
            }));

        } catch (err) {
            spinner.fail('Debugging failed.');
            console.error(chalk.red(err.message));
        }
    });

// Display enhanced banner
function displayBanner() {
    console.clear();
    
    // Large ASCII art logo
    const logo = figlet.textSync('DITO', { 
        font: 'ANSI Shadow',
        horizontalLayout: 'default'
    });
    
    console.log(chalk.hex('#FF8C69')(logo));
    console.log(chalk.gray('    Dito CLI v1.0'));
    console.log(chalk.gray('    Created by Ademileke (@Ademileke12)\n'));
}

// Main interactive menu
async function showMainMenu() {
    displayBanner();
    
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: chalk.green('What would you like to do?') + chalk.gray(' (Use arrow keys)'),
            choices: [
                new inquirer.Separator(chalk.cyan('--- Analysis Commands ---')),
                { name: '🔍 Full Project Analysis', value: 'analyze' },
                { name: '🛡️  Security Audit Only', value: 'security-audit' },
                { name: '⚡ Performance Check', value: 'performance' },
                { name: '🧪 Testing Coverage Analysis', value: 'testing' },
                { name: '📊 Code Quality Review', value: 'quality' },
                { name: '🐛 Debug Specific File', value: 'debug' },
                
                new inquirer.Separator(chalk.cyan('--- Configuration ---')),
                { name: '📁 Initialize Dito Config', value: 'init' },
                { name: '⚙️  Adjust Strictness Level', value: 'strictness' },
                { name: '🚫 Manage Ignore Patterns', value: 'ignore' },
                { name: '📋 View Current Settings', value: 'view-config' },
                
                new inquirer.Separator(chalk.cyan('--- Utilities ---')),
                { name: '📄 View Generated Reports', value: 'view-reports' },
                { name: '🗑️  Delete All Reports', value: 'delete' },
                { name: '⚡ Available CLI Commands', value: 'commands' },
                { name: '☁️  MCP Servers', value: 'mcp' },
                
                new inquirer.Separator(chalk.cyan('--- Help ---')),
                { name: '❓ Help & Documentation', value: 'help' },
                { name: '👋 Exit', value: 'exit' }
            ],
            pageSize: 23
        }
    ]);

    return action;
}

// Handle menu actions
// Handle menu actions
async function handleAction(action) {
    switch (action) {
        case 'analyze':
            await handleAnalyze();
            break;
        case 'security-audit':
            await handleSecurityAudit();
            break;
        case 'performance':
            await handlePerformanceCheck();
            break;
        case 'testing':
            await handleTestingAnalysis();
            break;
        case 'quality':
            await handleQualityReview();
            break;
        case 'debug':
            await handleDebug();
            break;
        case 'init':
            await handleInit();
            break;
        case 'strictness':
            await handleStrictnessSettings();
            break;
        case 'ignore':
            await handleIgnorePatterns();
            break;
        case 'view-config':
            await handleViewConfig();
            break;
        case 'view-reports':
            await handleViewReports();
            break;
        case 'delete':
            await handleDelete();
            break;
        case 'commands':
            await handleCommands();
            break;
        case 'mcp':
            await handleMCP();
            break;
        case 'help':
            await handleHelp();
            break;
        case 'exit':
            console.log(chalk.yellow('\n👋 Goodbye!\n'));
            process.exit(0);
    }
}

// Action handlers

// Action handlers
async function handleAnalyze() {
    const { dir } = await inquirer.prompt([{
        type: 'input',
        name: 'dir',
        message: 'Enter project directory path:',
        default: './'
    }]);
    
    console.log(chalk.cyan('\n🔮 Running Full Analysis...\n'));
    console.log(chalk.gray('Checking: Security, Performance, Code Quality, Testing, Logic Bugs\n'));
    
    await runAnalysis(dir, 'full');
    await returnToMenu();
}

async function handleSecurityAudit() {
    const { dir } = await inquirer.prompt([{
        type: 'input',
        name: 'dir',
        message: 'Enter project directory path:',
        default: './'
    }]);
    
    console.log(chalk.cyan('\n🛡️  Running Security Audit...\n'));
    console.log(chalk.gray('Checking: SQL Injection, XSS, CSRF, Secret Leaks, Auth Issues\n'));
    
    await runAnalysis(dir, 'security');
    await returnToMenu();
}

async function handlePerformanceCheck() {
    const { dir } = await inquirer.prompt([{
        type: 'input',
        name: 'dir',
        message: 'Enter project directory path:',
        default: './'
    }]);
    
    console.log(chalk.cyan('\n⚡ Running Performance Analysis...\n'));
    console.log(chalk.gray('Checking: Memory Leaks, N+1 Queries, Loop Inefficiencies, Bundle Size\n'));
    
    await runAnalysis(dir, 'performance');
    await returnToMenu();
}

async function handleTestingAnalysis() {
    const { dir } = await inquirer.prompt([{
        type: 'input',
        name: 'dir',
        message: 'Enter project directory path:',
        default: './'
    }]);
    
    console.log(chalk.cyan('\n🧪 Running Testing Coverage Analysis...\n'));
    console.log(chalk.gray('Checking: Unit Tests, Integration Tests, E2E Tests, Test Pyramid\n'));
    
    await runAnalysis(dir, 'testing');
    await returnToMenu();
}

async function handleQualityReview() {
    const { dir } = await inquirer.prompt([{
        type: 'input',
        name: 'dir',
        message: 'Enter project directory path:',
        default: './'
    }]);
    
    console.log(chalk.cyan('\n📊 Running Code Quality Review...\n'));
    console.log(chalk.gray('Checking: Code Structure, Naming, Documentation, Best Practices\n'));
    
    await runAnalysis(dir, 'quality');
    await returnToMenu();
}

async function handleDebug() {
    const { file } = await inquirer.prompt([{
        type: 'input',
        name: 'file',
        message: 'Enter file path to debug:',
    }]);
    
    const { error } = await inquirer.prompt([{
        type: 'input',
        name: 'error',
        message: 'Describe the bug (optional):',
    }]);

    await program.parseAsync(['node', 'dito', 'debug', file, error || '']);
    await returnToMenu();
}

// Core analysis function with specialized modes
async function runAnalysis(directory, mode = 'full') {
    const targetDir = path.resolve(directory);
    const config = loadConfig(targetDir);
    const spinner = ora('Crawling project files...').start();

    try {
        const files = await crawlProject(targetDir);
        if (files.length === 0) {
            spinner.fail('No matching files found to analyze.');
            return;
        }
        spinner.succeed(`Found ${files.length} files.`);

        spinner.start('Consulting Groq AI (Llama 3)...');

        // Build specialized prompt based on mode
        let customPrompt = getPromptForMode(mode);
        
        if (config.strictness === 'chill') {
            customPrompt += "\n\n(Note: Be lenient with the grading. This is a hackathon project.)";
        } else if (config.strictness === 'strict') {
            customPrompt += "\n\n(Note: Be extremely strict. This is mission-critical enterprise code.)";
        }

        const aiResponse = await analyzeWithGrok(files, customPrompt);
        spinner.succeed('Analysis complete!');

        // Generate output with mode-specific naming
        const reportName = mode === 'full' ? 'dito-report.md' : `dito-${mode}-report.md`;
        const reportPath = path.join(targetDir, reportName);
        const fs = require('fs');
        fs.writeFileSync(reportPath, aiResponse);
        
        console.log(chalk.green(`\n✓ Report generated: ${reportName}`));

        // Generate fix prompts
        generateFixPrompts(aiResponse, targetDir);

        // Generate tests only for security and full analysis
        if (mode === 'security' || mode === 'full') {
            const testMatch = aiResponse.match(/---BEGIN DITO TESTS---([\s\S]*?)---END DITO TESTS---/);
            if (testMatch) {
                const testPath = path.join(targetDir, 'dito_generated_tests.js');
                fs.writeFileSync(testPath, testMatch[1].trim());
                console.log(chalk.green(`✓ Test Suite generated: dito_generated_tests.js`));
            }
        }

        console.log('\n' + boxen(
            chalk.bold.magenta('✨ Dito Analysis Complete! ✨') +
            '\n\n' +
            chalk.white('📄 Report: ') + chalk.underline(reportName) + '\n' +
            chalk.white('🛠️  Fixes:  ') + chalk.underline('dito-fixes.md'),
            { padding: 1, borderColor: 'green', borderStyle: 'round' }
        ));

    } catch (error) {
        spinner.fail('An error occurred.');
        console.error(chalk.red(error.message));
    }
}

// Get specialized prompts for different analysis modes
function getPromptForMode(mode) {
    const { ANALYSIS_PROMPT, TEST_GENERATION_PROMPT } = require('../src/prompts');
    
    switch (mode) {
        case 'security':
            return `
Focus ONLY on Security Vulnerabilities in the provided codebase:

1. **Injection Attacks**: SQL Injection, NoSQL Injection, Command Injection, XSS
2. **Authentication & Authorization**: Weak passwords, missing auth, broken access control
3. **CSRF Protection**: Are state-changing operations protected?
4. **Secret Management**: Hardcoded API keys, tokens, passwords, database credentials
5. **Data Exposure**: PII leaks, sensitive data in logs, exposed stack traces
6. **File Upload Security**: Unrestricted file types, missing validation
7. **Rate Limiting**: Protection against brute-force and DoS attacks
8. **Cryptography**: Weak encryption, insecure random number generation

Return a detailed security report with:
- Security Grade (A-F)
- Critical vulnerabilities with severity (Critical/High/Medium/Low)
- Exploit scenarios for each vulnerability
- Specific code fixes with secure alternatives

${TEST_GENERATION_PROMPT}
`;

        case 'performance':
            return `
Focus ONLY on Performance Issues in the provided codebase:

1. **Memory Management**: Memory leaks, excessive memory usage, garbage collection issues
2. **Database Queries**: N+1 queries, missing indexes, inefficient queries
3. **Loop Optimization**: Nested loops, unnecessary iterations, blocking operations
4. **Async/Await**: Blocking async calls, missing parallelization opportunities
5. **Bundle Size**: Large dependencies, unused imports, code splitting opportunities
6. **Caching**: Missing cache strategies, inefficient cache invalidation
7. **API Calls**: Redundant requests, missing request batching
8. **Rendering**: Unnecessary re-renders, missing memoization

Return a performance report with:
- Performance Grade (A-F)
- Specific bottlenecks with estimated impact
- Optimization recommendations with code examples
- Expected performance improvements
`;

        case 'testing':
            return `
Focus ONLY on Testing Strategy & Coverage in the provided codebase:

1. **Test Coverage**: Unit tests, integration tests, E2E tests presence
2. **Test Quality**: Test assertions, edge cases, error scenarios
3. **Test Pyramid**: Proper distribution of test types
4. **Testing Infrastructure**: CI/CD integration, test environments, test data management
5. **Specialized Testing**: API testing, security testing, performance testing
6. **Test Maintainability**: Test organization, naming, documentation
7. **Mocking & Stubbing**: Proper use of test doubles
8. **Platform Coverage**: Cross-browser, multi-device, multi-OS testing

Return a testing report with:
- Testing Grade (A-F)
- Coverage gaps with priority
- Missing test types
- Recommended test cases to add
- Testing infrastructure improvements
`;

        case 'quality':
            return `
Focus ONLY on Code Quality in the provided codebase:

1. **Code Structure**: File organization, separation of concerns, modularity
2. **Naming Conventions**: Variable, function, class naming clarity
3. **Documentation**: Comments, JSDoc, README completeness
4. **Code Duplication**: DRY violations, repeated logic
5. **Complexity**: Cyclomatic complexity, deeply nested code
6. **Error Handling**: Consistent error handling, proper error messages
7. **Type Safety**: TypeScript usage, type annotations, type checking
8. **Best Practices**: Framework-specific patterns, industry standards
9. **Maintainability**: Code readability, refactoring opportunities

Return a code quality report with:
- Quality Grade (A-F)
- Specific quality issues with examples
- Refactoring recommendations
- Best practice violations
`;

        default: // full
            return `${ANALYSIS_PROMPT}\n\n${TEST_GENERATION_PROMPT}`;
    }
}

async function handleDelete() {
    const fs = require('fs');
    const files = ['dito-report.md', 'dito-fixes.md', 'dito_generated_tests.js'];
    
    console.log(chalk.yellow('\n🗑️  Deleting generated reports...\n'));
    
    files.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(chalk.green(`✓ Deleted ${file}`));
        } else {
            console.log(chalk.gray(`- ${file} not found`));
        }
    });
    
    await returnToMenu();
}

async function handleConfig() {
    console.log(chalk.cyan('\n⚙️  Configuration Management\n'));
    console.log('Create or edit .ditorc.json to customize Dito behavior.');
    console.log(chalk.gray('Example: { "strictness": "strict", "ignore": ["node_modules/**"] }\n'));
    await returnToMenu();
}


async function handleInit() {
    const fs = require('fs');
    console.log(chalk.cyan('\n📁 Initializing Dito Configuration...\n'));
    
    const { strictness } = await inquirer.prompt([{
        type: 'list',
        name: 'strictness',
        message: 'Select strictness level:',
        choices: [
            { name: 'Chill - Lenient for hackathons/prototypes', value: 'chill' },
            { name: 'Standard - Balanced approach (recommended)', value: 'standard' },
            { name: 'Strict - Enterprise-grade scrutiny', value: 'strict' }
        ],
        default: 'standard'
    }]);
    
    const defaultConfig = {
        strictness: strictness,
        ignore: [
            'node_modules/**',
            'dist/**',
            'build/**',
            '*.min.js',
            'coverage/**',
            '.git/**'
        ]
    };
    
    if (fs.existsSync('.ditorc.json')) {
        const { overwrite } = await inquirer.prompt([{
            type: 'confirm',
            name: 'overwrite',
            message: '.ditorc.json already exists. Overwrite?',
            default: false
        }]);
        
        if (!overwrite) {
            console.log(chalk.yellow('\n⚠ Configuration not changed.'));
            await returnToMenu();
            return;
        }
    }
    
    fs.writeFileSync('.ditorc.json', JSON.stringify(defaultConfig, null, 2));
    console.log(chalk.green('\n✓ Created .ditorc.json'));
    console.log(chalk.gray(`Strictness: ${strictness}`));
    console.log(chalk.gray(`Ignore patterns: ${defaultConfig.ignore.length} patterns\n`));
    
    await returnToMenu();
}

async function handleStrictnessSettings() {
    const fs = require('fs');
    console.log(chalk.cyan('\n⚙️  Strictness Level Settings\n'));
    
    let config = { strictness: 'standard', ignore: [] };
    if (fs.existsSync('.ditorc.json')) {
        config = JSON.parse(fs.readFileSync('.ditorc.json', 'utf8'));
    }
    
    console.log(chalk.gray(`Current: ${config.strictness}\n`));
    
    const { strictness } = await inquirer.prompt([{
        type: 'list',
        name: 'strictness',
        message: 'Select new strictness level:',
        choices: [
            { name: 'Chill - Lenient for hackathons/prototypes', value: 'chill' },
            { name: 'Standard - Balanced approach', value: 'standard' },
            { name: 'Strict - Enterprise-grade scrutiny', value: 'strict' }
        ],
        default: config.strictness
    }]);
    
    config.strictness = strictness;
    fs.writeFileSync('.ditorc.json', JSON.stringify(config, null, 2));
    console.log(chalk.green(`\n✓ Strictness updated to: ${strictness}\n`));
    
    await returnToMenu();
}

async function handleIgnorePatterns() {
    const fs = require('fs');
    console.log(chalk.cyan('\n🚫 Manage Ignore Patterns\n'));
    
    let config = { strictness: 'standard', ignore: [] };
    if (fs.existsSync('.ditorc.json')) {
        config = JSON.parse(fs.readFileSync('.ditorc.json', 'utf8'));
    }
    
    console.log(chalk.white('Current ignore patterns:'));
    if (config.ignore.length === 0) {
        console.log(chalk.gray('  (none)'));
    } else {
        config.ignore.forEach(pattern => {
            console.log(chalk.gray(`  - ${pattern}`));
        });
    }
    console.log('');
    
    const { action } = await inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
            { name: 'Add new pattern', value: 'add' },
            { name: 'Remove pattern', value: 'remove' },
            { name: 'Reset to defaults', value: 'reset' },
            { name: 'Back to menu', value: 'back' }
        ]
    }]);
    
    if (action === 'back') {
        await returnToMenu();
        return;
    }
    
    if (action === 'add') {
        const { pattern } = await inquirer.prompt([{
            type: 'input',
            name: 'pattern',
            message: 'Enter glob pattern to ignore (e.g., "*.test.js"):',
        }]);
        
        if (pattern) {
            config.ignore.push(pattern);
            fs.writeFileSync('.ditorc.json', JSON.stringify(config, null, 2));
            console.log(chalk.green(`\n✓ Added pattern: ${pattern}\n`));
        }
    } else if (action === 'remove' && config.ignore.length > 0) {
        const { pattern } = await inquirer.prompt([{
            type: 'list',
            name: 'pattern',
            message: 'Select pattern to remove:',
            choices: config.ignore
        }]);
        
        config.ignore = config.ignore.filter(p => p !== pattern);
        fs.writeFileSync('.ditorc.json', JSON.stringify(config, null, 2));
        console.log(chalk.green(`\n✓ Removed pattern: ${pattern}\n`));
    } else if (action === 'reset') {
        config.ignore = ['node_modules/**', 'dist/**', 'build/**', '*.min.js', 'coverage/**', '.git/**'];
        fs.writeFileSync('.ditorc.json', JSON.stringify(config, null, 2));
        console.log(chalk.green('\n✓ Reset to default patterns\n'));
    }
    
    await returnToMenu();
}

async function handleViewConfig() {
    const fs = require('fs');
    console.log(chalk.cyan('\n📋 Current Dito Configuration\n'));
    
    if (!fs.existsSync('.ditorc.json')) {
        console.log(chalk.yellow('⚠ No .ditorc.json found. Using defaults.'));
        console.log(chalk.gray('\nDefaults:'));
        console.log(chalk.gray('  Strictness: standard'));
        console.log(chalk.gray('  Ignore: node_modules/**, dist/**, *.min.js\n'));
    } else {
        const config = JSON.parse(fs.readFileSync('.ditorc.json', 'utf8'));
        console.log(chalk.white('Strictness: ') + chalk.green(config.strictness));
        console.log(chalk.white('\nIgnore Patterns:'));
        config.ignore.forEach(pattern => {
            console.log(chalk.gray(`  - ${pattern}`));
        });
        console.log('');
    }
    
    await returnToMenu();
}

async function handleViewReports() {
    const fs = require('fs');
    const glob = require('glob');
    
    console.log(chalk.cyan('\n📄 Generated Reports\n'));
    
    const reportFiles = glob.sync('dito-*.md').concat(glob.sync('dito_generated_tests.js'));
    
    if (reportFiles.length === 0) {
        console.log(chalk.gray('No reports found. Run an analysis first.\n'));
        await returnToMenu();
        return;
    }
    
    reportFiles.forEach(file => {
        const stats = fs.statSync(file);
        const size = (stats.size / 1024).toFixed(2);
        console.log(chalk.white(`📄 ${file}`) + chalk.gray(` (${size} KB)`));
    });
    
    console.log('');
    
    const { viewFile } = await inquirer.prompt([{
        type: 'confirm',
        name: 'viewFile',
        message: 'Would you like to view a report?',
        default: false
    }]);
    
    if (viewFile) {
        const { file } = await inquirer.prompt([{
            type: 'list',
            name: 'file',
            message: 'Select report to view:',
            choices: reportFiles
        }]);
        
        const content = fs.readFileSync(file, 'utf8');
        console.log('\n' + boxen(content.substring(0, 500) + '...', {
            padding: 1,
            title: file,
            borderColor: 'cyan'
        }));
        console.log(chalk.gray(`\n(Showing first 500 characters. Open ${file} to view full report)\n`));
    }
    
    await returnToMenu();
}

async function handleSecurityAudit() {
    const { dir } = await inquirer.prompt([{
        type: 'input',
        name: 'dir',
        message: 'Enter project directory path:',
        default: './'
    }]);
    
    console.log(chalk.cyan('\n🛡️  Running Security Audit...\n'));
    console.log(chalk.gray('Checking: SQL Injection, XSS, CSRF, Secret Leaks, Auth Issues\n'));
    
    await runAnalysis(dir, 'security');
    await returnToMenu();
}

async function handlePerformanceCheck() {
    const { dir } = await inquirer.prompt([{
        type: 'input',
        name: 'dir',
        message: 'Enter project directory path:',
        default: './'
    }]);
    
    console.log(chalk.cyan('\n⚡ Running Performance Analysis...\n'));
    console.log(chalk.gray('Checking: Memory Leaks, N+1 Queries, Loop Inefficiencies, Bundle Size\n'));
    
    await runAnalysis(dir, 'performance');
    await returnToMenu();
}

async function handleTestingAnalysis() {
    const { dir } = await inquirer.prompt([{
        type: 'input',
        name: 'dir',
        message: 'Enter project directory path:',
        default: './'
    }]);
    
    console.log(chalk.cyan('\n🧪 Running Testing Coverage Analysis...\n'));
    console.log(chalk.gray('Checking: Unit Tests, Integration Tests, E2E Tests, Test Pyramid\n'));
    
    await runAnalysis(dir, 'testing');
    await returnToMenu();
}

async function handleQualityReview() {
    const { dir } = await inquirer.prompt([{
        type: 'input',
        name: 'dir',
        message: 'Enter project directory path:',
        default: './'
    }]);
    
    console.log(chalk.cyan('\n📊 Running Code Quality Review...\n'));
    console.log(chalk.gray('Checking: Code Structure, Naming, Documentation, Best Practices\n'));
    
    await runAnalysis(dir, 'quality');
    await returnToMenu();
}

async function handleDebug() {
    const { file } = await inquirer.prompt([{
        type: 'input',
        name: 'file',
        message: 'Enter file path to debug:',
    }]);
    
    const { error } = await inquirer.prompt([{
        type: 'input',
        name: 'error',
        message: 'Describe the bug (optional):',
    }]);

    await program.parseAsync(['node', 'dito', 'debug', file, error || '']);
    await returnToMenu();
}

// Core analysis function with specialized modes
async function runAnalysis(directory, mode = 'full') {
    const targetDir = path.resolve(directory);
    const config = loadConfig(targetDir);
    const spinner = ora('Crawling project files...').start();

    try {
        const files = await crawlProject(targetDir);
        if (files.length === 0) {
            spinner.fail('No matching files found to analyze.');
            return;
        }
        spinner.succeed(`Found ${files.length} files.`);

        spinner.start('Consulting Groq AI (Llama 3)...');

        // Build specialized prompt based on mode
        let customPrompt = getPromptForMode(mode);
        
        if (config.strictness === 'chill') {
            customPrompt += "\n\n(Note: Be lenient with the grading. This is a hackathon project.)";
        } else if (config.strictness === 'strict') {
            customPrompt += "\n\n(Note: Be extremely strict. This is mission-critical enterprise code.)";
        }

        const aiResponse = await analyzeWithGrok(files, customPrompt);
        spinner.succeed('Analysis complete!');

        // Generate output with mode-specific naming
        const reportName = mode === 'full' ? 'dito-report.md' : `dito-${mode}-report.md`;
        const reportPath = path.join(targetDir, reportName);
        const fs = require('fs');
        fs.writeFileSync(reportPath, aiResponse);
        
        console.log(chalk.green(`\n✓ Report generated: ${reportName}`));

        // Generate fix prompts
        generateFixPrompts(aiResponse, targetDir);

        // Generate tests only for security and full analysis
        if (mode === 'security' || mode === 'full') {
            const testMatch = aiResponse.match(/---BEGIN DITO TESTS---([\s\S]*?)---END DITO TESTS---/);
            if (testMatch) {
                const testPath = path.join(targetDir, 'dito_generated_tests.js');
                fs.writeFileSync(testPath, testMatch[1].trim());
                console.log(chalk.green(`✓ Test Suite generated: dito_generated_tests.js`));
            }
        }

        console.log('\n' + boxen(
            chalk.bold.magenta('✨ Dito Analysis Complete! ✨') +
            '\n\n' +
            chalk.white('📄 Report: ') + chalk.underline(reportName) + '\n' +
            chalk.white('🛠️  Fixes:  ') + chalk.underline('dito-fixes.md'),
            { padding: 1, borderColor: 'green', borderStyle: 'round' }
        ));

    } catch (error) {
        spinner.fail('An error occurred.');
        console.error(chalk.red(error.message));
    }
}

// Get specialized prompts for different analysis modes
function getPromptForMode(mode) {
    const { ANALYSIS_PROMPT, TEST_GENERATION_PROMPT } = require('../src/prompts');
    
    switch (mode) {
        case 'security':
            return `
Focus ONLY on Security Vulnerabilities in the provided codebase:

1. **Injection Attacks**: SQL Injection, NoSQL Injection, Command Injection, XSS
2. **Authentication & Authorization**: Weak passwords, missing auth, broken access control
3. **CSRF Protection**: Are state-changing operations protected?
4. **Secret Management**: Hardcoded API keys, tokens, passwords, database credentials
5. **Data Exposure**: PII leaks, sensitive data in logs, exposed stack traces
6. **File Upload Security**: Unrestricted file types, missing validation
7. **Rate Limiting**: Protection against brute-force and DoS attacks
8. **Cryptography**: Weak encryption, insecure random number generation

Return a detailed security report with:
- Security Grade (A-F)
- Critical vulnerabilities with severity (Critical/High/Medium/Low)
- Exploit scenarios for each vulnerability
- Specific code fixes with secure alternatives

${TEST_GENERATION_PROMPT}
`;

        case 'performance':
            return `
Focus ONLY on Performance Issues in the provided codebase:

1. **Memory Management**: Memory leaks, excessive memory usage, garbage collection issues
2. **Database Queries**: N+1 queries, missing indexes, inefficient queries
3. **Loop Optimization**: Nested loops, unnecessary iterations, blocking operations
4. **Async/Await**: Blocking async calls, missing parallelization opportunities
5. **Bundle Size**: Large dependencies, unused imports, code splitting opportunities
6. **Caching**: Missing cache strategies, inefficient cache invalidation
7. **API Calls**: Redundant requests, missing request batching
8. **Rendering**: Unnecessary re-renders, missing memoization

Return a performance report with:
- Performance Grade (A-F)
- Specific bottlenecks with estimated impact
- Optimization recommendations with code examples
- Expected performance improvements
`;

        case 'testing':
            return `
Focus ONLY on Testing Strategy & Coverage in the provided codebase:

1. **Test Coverage**: Unit tests, integration tests, E2E tests presence
2. **Test Quality**: Test assertions, edge cases, error scenarios
3. **Test Pyramid**: Proper distribution of test types
4. **Testing Infrastructure**: CI/CD integration, test environments, test data management
5. **Specialized Testing**: API testing, security testing, performance testing
6. **Test Maintainability**: Test organization, naming, documentation
7. **Mocking & Stubbing**: Proper use of test doubles
8. **Platform Coverage**: Cross-browser, multi-device, multi-OS testing

Return a testing report with:
- Testing Grade (A-F)
- Coverage gaps with priority
- Missing test types
- Recommended test cases to add
- Testing infrastructure improvements
`;

        case 'quality':
            return `
Focus ONLY on Code Quality in the provided codebase:

1. **Code Structure**: File organization, separation of concerns, modularity
2. **Naming Conventions**: Variable, function, class naming clarity
3. **Documentation**: Comments, JSDoc, README completeness
4. **Code Duplication**: DRY violations, repeated logic
5. **Complexity**: Cyclomatic complexity, deeply nested code
6. **Error Handling**: Consistent error handling, proper error messages
7. **Type Safety**: TypeScript usage, type annotations, type checking
8. **Best Practices**: Framework-specific patterns, industry standards
9. **Maintainability**: Code readability, refactoring opportunities

Return a code quality report with:
- Quality Grade (A-F)
- Specific quality issues with examples
- Refactoring recommendations
- Best practice violations
`;

        default: // full
            return `${ANALYSIS_PROMPT}\n\n${TEST_GENERATION_PROMPT}`;
    }
}

async function handleDelete() {
    const fs = require('fs');
    const files = ['dito-report.md', 'dito-fixes.md', 'dito_generated_tests.js'];
    
    console.log(chalk.yellow('\n🗑️  Deleting generated reports...\n'));
    
    files.forEach(file => {
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            console.log(chalk.green(`✓ Deleted ${file}`));
        } else {
            console.log(chalk.gray(`- ${file} not found`));
        }
    });
    
    await returnToMenu();
}

async function handleConfig() {
    console.log(chalk.cyan('\n⚙️  Configuration Management\n'));
    console.log('Create or edit .ditorc.json to customize Dito behavior.');
    console.log(chalk.gray('Example: { "strictness": "strict", "ignore": ["node_modules/**"] }\n'));
    await returnToMenu();
}

async function handleInit() {
    const fs = require('fs');
    console.log(chalk.cyan('\n📁 Initializing Dito project...\n'));
    
    const defaultConfig = {
        strictness: 'standard',
        ignore: ['node_modules/**', 'dist/**', '*.min.js']
    };
    
    if (!fs.existsSync('.ditorc.json')) {
        fs.writeFileSync('.ditorc.json', JSON.stringify(defaultConfig, null, 2));
        console.log(chalk.green('✓ Created .ditorc.json'));
    } else {
        console.log(chalk.yellow('⚠ .ditorc.json already exists'));
    }
    
    await returnToMenu();
}

async function handleSecurity() {
    console.log(chalk.cyan('\n🔒 Security & Permissions\n'));
    console.log('Dito scans for:');
    console.log('  • SQL Injection vulnerabilities');
    console.log('  • XSS and CSRF issues');
    console.log('  • Hardcoded secrets and API keys');
    console.log('  • Exposed PII');
    console.log('  • Missing rate limiting\n');
    await returnToMenu();
}

async function handleMCP() {
    console.log(chalk.cyan('\n☁️  MCP Servers\n'));
    console.log('MCP (Model Context Protocol) integration coming soon!');
    console.log(chalk.gray('This will allow Dito to connect with external AI services.\n'));
    await returnToMenu();
}

async function handleCommands() {
    console.log(chalk.cyan('\n⚡ Available Commands\n'));
    console.log(chalk.white('dito analyze <directory>') + chalk.gray(' - Analyze a project'));
    console.log(chalk.white('dito debug <file> [error]') + chalk.gray(' - Debug a specific file'));
    console.log(chalk.white('dito --version') + chalk.gray('           - Show version'));
    console.log(chalk.white('dito --help') + chalk.gray('              - Show help\n'));
    await returnToMenu();
}

async function handleSettings() {
    const { setting } = await inquirer.prompt([{
        type: 'list',
        name: 'setting',
        message: 'Choose a setting to configure:',
        choices: [
            { name: 'Strictness Level', value: 'strictness' },
            { name: 'Ignore Patterns', value: 'ignore' },
            { name: 'Back to Main Menu', value: 'back' }
        ]
    }]);
    
    if (setting === 'back') {
        return;
    }
    
    if (setting === 'strictness') {
        const { level } = await inquirer.prompt([{
            type: 'list',
            name: 'level',
            message: 'Select strictness level:',
            choices: ['chill', 'standard', 'strict']
        }]);
        console.log(chalk.green(`\n✓ Strictness set to: ${level}\n`));
    }
    
    await returnToMenu();
}

async function handleHelp() {
    console.log(chalk.cyan('\n❓ Dito Help & Documentation\n'));
    console.log('Dito is an AI-powered code auditor that finds:');
    console.log('  • Security vulnerabilities');
    console.log('  • Performance issues');
    console.log('  • Code quality problems');
    console.log('  • Missing tests\n');
    console.log('For full documentation, visit: https://github.com/Ademileke12/Dito\n');
    await returnToMenu();
}

async function returnToMenu() {
    const { continue: cont } = await inquirer.prompt([{
        type: 'confirm',
        name: 'continue',
        message: 'Return to main menu?',
        default: true
    }]);
    
    if (cont) {
        await main();
    } else {
        console.log(chalk.yellow('\n👋 Goodbye!\n'));
        process.exit(0);
    }
}

// Main entry point
async function main() {
    const action = await showMainMenu();
    await handleAction(action);
}

// Check if no arguments provided, launch interactive menu
if (!process.argv.slice(2).length) {
    main().catch(err => {
        console.error(chalk.red('Error:'), err.message);
        process.exit(1);
    });
} else {
    program.parse(process.argv);
}
