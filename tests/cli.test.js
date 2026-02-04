const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

describe('CLI Integration', () => {
    const binPath = path.join(__dirname, '../bin/dito.js');
    const testProject = path.join(__dirname, '../dito-test-project');

    test('should show help menu', () => {
        const output = execSync(`node ${binPath} --help`).toString();
        expect(output).toContain('Usage: dito');
        expect(output).toContain('analyze');
    });

    test('should run analysis in MOCK_AI mode', () => {
        // Ensure test project exists (should be created by previous steps)
        if (!fs.existsSync(testProject)) {
            fs.mkdirSync(testProject, { recursive: true });
            fs.writeFileSync(path.join(testProject, 'index.js'), 'console.log("hello");');
        }

        const output = execSync(`MOCK_AI=true node ${binPath} analyze ${testProject}`).toString();

        expect(output).toContain('Dito Vibe Check Complete');

        // Check artifacts created
        expect(fs.existsSync(path.join(testProject, 'dito-report.md'))).toBe(true);
    });
});
