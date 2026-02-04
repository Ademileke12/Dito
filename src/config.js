const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const CONFIG_FILE = '.ditorc.json';

const DEFAULTS = {
    ignore: [],
    strictness: 'standard', // 'chill', 'standard', 'strict'
    autoFix: false // Not used in V2 yet, but reserved
};

/**
 * Loads configuration from .ditorc.json in the target directory or its parents.
 * @param {string} targetDir 
 */
function loadConfig(targetDir) {
    // Simple look in targetDir for now
    const configPath = path.join(targetDir, CONFIG_FILE);

    if (fs.existsSync(configPath)) {
        try {
            const raw = fs.readFileSync(configPath, 'utf8');
            const data = JSON.parse(raw);
            console.log(chalk.gray(`Found config at ${configPath}`));
            return { ...DEFAULTS, ...data };
        } catch (e) {
            console.warn(chalk.yellow(`Warning: Malformed ${CONFIG_FILE}. Using defaults.`));
        }
    }

    return DEFAULTS;
}

module.exports = { loadConfig };
