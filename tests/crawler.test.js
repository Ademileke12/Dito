const { crawlProject } = require('../src/crawler');
const fs = require('fs');
const path = require('path');

describe('Crawler Module', () => {
    const testDir = path.join(__dirname, 'test-crawler-env');

    beforeAll(() => {
        // Setup a temporary test directory structure
        if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
        fs.mkdirSync(testDir);

        // Create regular file
        fs.writeFileSync(path.join(testDir, 'file.js'), 'console.log("hello");');

        // Create nested file
        fs.mkdirSync(path.join(testDir, 'src'));
        fs.writeFileSync(path.join(testDir, 'src/utils.js'), 'module.exports = {};');

        // Create ignored dir (node_modules)
        fs.mkdirSync(path.join(testDir, 'node_modules'));
        fs.writeFileSync(path.join(testDir, 'node_modules/bad.js'), 'dont read me');

        // Create .gitignore and ignored file
        fs.writeFileSync(path.join(testDir, '.gitignore'), 'ignored.txt\nsecrets/');
        fs.writeFileSync(path.join(testDir, 'ignored.txt'), 'secret stuf');
        fs.mkdirSync(path.join(testDir, 'secrets'));
        fs.writeFileSync(path.join(testDir, 'secrets/key.pem'), 'KEY');
    });

    afterAll(() => {
        // Cleanup
        if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
    });

    test('should find valid files recursively', async () => {
        const files = await crawlProject(testDir);
        const paths = files.map(f => f.path);

        expect(paths).toContain('file.js');
        expect(paths).toContain('src/utils.js');
    });

    test('should ignore node_modules by default', async () => {
        const files = await crawlProject(testDir);
        const paths = files.map(f => f.path);

        expect(paths.some(p => p.includes('node_modules'))).toBe(false);
    });

    test('should respect .gitignore', async () => {
        const files = await crawlProject(testDir);
        const paths = files.map(f => f.path);

        expect(paths).not.toContain('ignored.txt');
        expect(paths.some(p => p.includes('secrets'))).toBe(false);
    });
});
