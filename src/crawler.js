const glob = require('glob');
const fs = require('fs');
const path = require('path');
const ignore = require('ignore');

/**
 * Reads files from the target directory, respecting .gitignore
 * @param {string} dir - The directory to crawl
 * @returns {Promise<Array<{path: string, content: string}>>} - Array of file objects
 */
async function crawlProject(dir) {
    const absoluteDir = path.resolve(dir);
    const ig = ignore();

    // Load .gitignore if it exists
    const gitignorePath = path.join(absoluteDir, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
        ig.add(fs.readFileSync(gitignorePath).toString());
    }

    // Always ignore node_modules, .git, and common binary/lock files
    ig.add(['node_modules', '.git', 'package-lock.json', 'yarn.lock', 'dist', 'build', '.env']);

    return new Promise((resolve, reject) => {
        glob('**/*', {
            cwd: absoluteDir,
            nodir: true,
            dot: true,
            ignore: ['**/node_modules/**', '**/.git/**']
        }, (err, files) => {
            if (err) return reject(err);

            const validFiles = files.filter(file => !ig.ignores(file));
            const fileContents = [];

            for (const file of validFiles) {
                const filePath = path.join(absoluteDir, file);

                // Skip large files (> 1MB) or binary files (heuristic)
                const stats = fs.statSync(filePath);
                if (stats.size > 1024 * 1024) continue;

                const ext = path.extname(file).toLowerCase();
                if (['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip'].includes(ext)) continue;

                try {
                    const content = fs.readFileSync(filePath, 'utf8');
                    fileContents.push({
                        path: file,
                        content: content
                    });
                } catch (e) {
                    console.warn(`Error reading file ${file}: ${e.message}`);
                }
            }

            resolve(fileContents);
        });
    });
}

module.exports = { crawlProject };
