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

// Login command removed. API key is now embedded.

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
                new inquirer.Separator(chalk.cyan('--- Commands ---')),
                { name: '🔍 Search & analyze project', value: 'analyze' },
                { name: '📦 Analyze specific directory', value: 'analyze-dir' },
                { name: '🗑️  Delete generated reports', value: 'delete' },
                
                new inquirer.Separator(chalk.cyan('--- Configuration ---')),
                { name: '⚙️  DITO.md Management', value: 'config' },
                { name: '📁 Project Initialization', value: 'init' },
                { name: '🔒 Permissions & Security', value: 'security' },
                
                new inquirer.Separator(chalk.cyan('--- Advanced ---')),
                { name: '☁️  MCP Servers', value: 'mcp' },
                { name: '⚡ Commands', value: 'commands' },
                { name: '⚙️  Settings', value: 'settings' },
                
                new inquirer.Separator(chalk.cyan('--- Help ---')),
                { name: '❓ Help & Documentation', value: 'help' },
                { name: '👋 Exit', value: 'exit' }
            ],
            pageSize: 20
        }
    ]);

    return action;
}

// Handle menu actions
async function handleAction(action) {
    switch (action) {
        case 'analyze':
            await handleAnalyze();
            break;
        case 'analyze-dir':
            await handleAnalyzeDirectory();
            break;
        case 'delete':
            await handleDelete();
            break;
        case 'config':
            await handleConfig();
            break;
        case 'init':
            await handleInit();
            break;
        case 'security':
            await handleSecurity();
            break;
        case 'mcp':
            await handleMCP();
            break;
        case 'commands':
            await handleCommands();
            break;
        case 'settings':
            await handleSettings();
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
async function handleAnalyze() {
    const { dir } = await inquirer.prompt([{
        type: 'input',
        name: 'dir',
        message: 'Enter project directory path:',
        default: './'
    }]);
    
    await program.parseAsync(['node', 'dito', 'analyze', dir]);
    await returnToMenu();
}

async function handleAnalyzeDirectory() {
    const { dir } = await inquirer.prompt([{
        type: 'input',
        name: 'dir',
        message: 'Enter specific directory to analyze:',
        default: './'
    }]);
    
    await program.parseAsync(['node', 'dito', 'analyze', dir]);
    await returnToMenu();
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
