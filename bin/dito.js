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

const program = new Command();

console.log(
    chalk.green(
        figlet.textSync('D I T O', { horizontalLayout: 'full' })
    )
);

program
    .name('dito')
    .description('AI-powered vibe coding auditor and test generator (Powered by DeepSeek)')
    .version('2.0.0');

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
            spinner.start('Consulting OpenAI GPT-5 (via Xroute)...');

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
            if (error.message.includes('503') || error.message.includes('500')) {
                console.log(chalk.yellow('ℹ️  The Xroute API seems to be experiencing issues. Try again later or use MOCK_AI=true.'));
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

// ... existing imports ...
const inquirer = require('inquirer');

// ... existing code ...

// Check if no arguments provided, launch interactive menu
if (!process.argv.slice(2).length) {
    (async () => {
        console.log(chalk.green(figlet.textSync('D I T O', { horizontalLayout: 'full' })));
        console.log(chalk.cyan('Welcome to Dito CLI - The Vibe Coding Auditor\n'));

        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                    { name: '🔮 Analyze a Project', value: 'analyze' },
                    { name: '🐛 Debug a specific File', value: 'debug' },
                    { name: '🚪 Exit', value: 'exit' }
                ]
            }
        ]);

        if (action === 'exit') {
            console.log('Bye! 👋');
            process.exit(0);
        }

        if (action === 'analyze') {
            const { dir } = await inquirer.prompt([{
                type: 'input',
                name: 'dir',
                message: 'Enter project directory path:',
                default: './'
            }]);
            // Re-run program with analyze command
            await program.parseAsync(['node', 'dito', 'analyze', dir]);
        }

        if (action === 'debug') {
            const { file } = await inquirer.prompt([{
                type: 'input',
                name: 'file',
                message: 'Enter file path:',
            }]);
            const { error } = await inquirer.prompt([{
                type: 'input',
                name: 'error',
                message: 'Describe the bug (optional):',
            }]);

            await program.parseAsync(['node', 'dito', 'debug', file, error]);
        }
    })();
} else {
    program.parse(process.argv);
}
