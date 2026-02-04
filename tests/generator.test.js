const { generateOutput } = require('../src/generator');
const fs = require('fs');
const path = require('path');

describe('Generator Module', () => {
    const testDir = path.join(__dirname, 'test-generator-env');

    beforeEach(() => {
        if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
        fs.mkdirSync(testDir);
    });

    afterEach(() => {
        if (fs.existsSync(testDir)) fs.rmSync(testDir, { recursive: true, force: true });
    });

    test('should save report and extract test code', async () => {
        const mockAiResponse = `
# Report
Everything is fine.

\`\`\`javascript
const axios = require('axios');
test('foo', () => {});
\`\`\`
    `;

        await generateOutput(mockAiResponse, testDir);

        const reportPath = path.join(testDir, 'dito-report.md');
        const testsPath = path.join(testDir, 'dito_generated_tests.js');

        expect(fs.existsSync(reportPath)).toBe(true);
        expect(fs.existsSync(testsPath)).toBe(true);

        const savedReport = fs.readFileSync(reportPath, 'utf8');
        expect(savedReport).toContain('# Report');

        const savedTests = fs.readFileSync(testsPath, 'utf8');
        expect(savedTests).toContain("require('axios')");
    });

    test('should handle missing test code gracefully', async () => {
        const mockAiResponse = `# Report\nNo tests here.`;

        // Spy on console.warn to suppress the output
        const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => { });

        await generateOutput(mockAiResponse, testDir);

        // Verify warning was logged but not printed
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();

        const testsPath = path.join(testDir, 'dito_generated_tests.js');
        expect(fs.existsSync(testsPath)).toBe(false);
    });
});
