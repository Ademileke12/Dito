# Dito Codebase Review & Recommendations

## Executive Summary
Dito is a well-structured CLI tool with good separation of concerns. However, there are opportunities for improvement in code organization, security, testing, and documentation.

---

## 1. Code Organization & Structure

### ✅ Strengths
- Clear separation between CLI (`bin/`), core logic (`src/`), and tests (`tests/`)
- Modular design with single-responsibility functions
- Good use of async/await patterns

### ⚠️ Issues & Recommendations

#### Issue 1.1: Large `bin/dito.js` file (700+ lines)
**Problem**: The main CLI file contains menu logic, handlers, analysis functions, and prompts all in one file.

**Recommendation**: Split into modules
```javascript
// Suggested structure:
bin/
  dito.js (entry point only)
src/
  cli/
    menu.js (showMainMenu, displayBanner)
    handlers.js (all handle* functions)
    prompts.js (getPromptForMode - move from bin/)
  analysis/
    runner.js (runAnalysis function)
    modes.js (analysis mode configurations)
```

**Action**:
```bash
# Create new structure
mkdir -p src/cli src/analysis
# Move functions to appropriate files
```

#### Issue 1.2: Hardcoded prompts in `bin/dito.js`
**Problem**: The `getPromptForMode()` function with 150+ lines of prompt text is in the main CLI file.

**Recommendation**: Move to `src/analysis/prompts.js` or extend existing `src/prompts.js`
```javascript
// src/analysis/prompts.js
const { ANALYSIS_PROMPT, TEST_GENERATION_PROMPT } = require('../prompts');

const MODE_PROMPTS = {
    security: {
        focus: 'Security Vulnerabilities',
        checks: [
            'Injection Attacks',
            'Authentication & Authorization',
            // ...
        ],
        template: (checks) => `Focus ONLY on ${checks.join(', ')}...`
    },
    // ... other modes
};

function getPromptForMode(mode) {
    const config = MODE_PROMPTS[mode];
    if (!config) return `${ANALYSIS_PROMPT}\n\n${TEST_GENERATION_PROMPT}`;
    return config.template(config.checks);
}
```

#### Issue 1.3: Missing error boundaries
**Problem**: No centralized error handling for the CLI.

**Recommendation**: Add error handler wrapper
```javascript
// src/cli/errorHandler.js
function withErrorHandler(fn) {
    return async (...args) => {
        try {
            return await fn(...args);
        } catch (error) {
            console.error(chalk.red('\n❌ Error:'), error.message);
            if (process.env.DEBUG) {
                console.error(chalk.gray(error.stack));
            }
            await returnToMenu();
        }
    };
}

// Usage in handlers
const handleSecurityAudit = withErrorHandler(async () => {
    // ... handler code
});
```

---

## 2. Performance Optimizations

### Issue 2.1: Synchronous file operations in crawler
**Problem**: `fs.readFileSync` blocks the event loop for each file.

**Current** (`src/crawler.js:48-54`):
```javascript
const content = fs.readFileSync(filePath, 'utf8');
fileContents.push({ path: file, content: content });
```

**Recommendation**: Use async file reading with concurrency control
```javascript
const pLimit = require('p-limit');
const limit = pLimit(10); // Max 10 concurrent reads

const filePromises = validFiles.map(file => 
    limit(async () => {
        const filePath = path.join(absoluteDir, file);
        const stats = await fs.promises.stat(filePath);
        if (stats.size > 1024 * 1024) return null;
        
        try {
            const content = await fs.promises.readFile(filePath, 'utf8');
            return { path: file, content };
        } catch (e) {
            console.warn(`Error reading ${file}: ${e.message}`);
            return null;
        }
    })
);

const results = await Promise.all(filePromises);
const fileContents = results.filter(Boolean);
```

**Install**: `npm install p-limit`

### Issue 2.2: No caching for repeated analyses
**Problem**: Re-analyzing the same directory crawls files every time.

**Recommendation**: Add optional file hash-based caching
```javascript
// src/cache.js
const crypto = require('crypto');
const fs = require('fs');

class AnalysisCache {
    constructor(cacheDir = '.dito-cache') {
        this.cacheDir = cacheDir;
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }
    }

    getCacheKey(files) {
        const hash = crypto.createHash('sha256');
        files.forEach(f => hash.update(f.path + f.content));
        return hash.digest('hex');
    }

    get(key) {
        const cachePath = path.join(this.cacheDir, `${key}.json`);
        if (fs.existsSync(cachePath)) {
            const cached = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
            // Check if cache is less than 1 hour old
            if (Date.now() - cached.timestamp < 3600000) {
                return cached.data;
            }
        }
        return null;
    }

    set(key, data) {
        const cachePath = path.join(this.cacheDir, `${key}.json`);
        fs.writeFileSync(cachePath, JSON.stringify({
            timestamp: Date.now(),
            data
        }));
    }
}
```

### Issue 2.3: Large AI responses not streamed
**Problem**: Waiting for entire AI response before showing anything.

**Recommendation**: Add streaming support for better UX
```javascript
// src/ai.js - add streaming option
async function analyzeWithGrokStream(files, prompt, onChunk) {
    const response = await axios.post(API_URL, {
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        stream: true
    }, {
        headers: { /* ... */ },
        responseType: 'stream'
    });

    let fullResponse = '';
    response.data.on('data', (chunk) => {
        const text = chunk.toString();
        fullResponse += text;
        if (onChunk) onChunk(text);
    });

    return new Promise((resolve) => {
        response.data.on('end', () => resolve(fullResponse));
    });
}
```

---

## 3. Security Best Practices

### 🔴 Critical Issue 3.1: Hardcoded API key with weak obfuscation
**Problem**: API key in `src/ai.js` uses XOR "encryption" which is trivially reversible.

**Current** (`src/ai.js:4-6`):
```javascript
const SECRET = 'dito-secure-squad';
const ENCRYPTED_KEY = 'AxofMFwmLRlHRlBpKwgkBwYjXEVYRgMBNDIWHE9ANywrJyA6IThaNxIQBBc9QRYyFjYWLjwcJE8=';
```

**Recommendation**: Use environment variables
```javascript
// src/ai.js
function getApiKey() {
    // Priority: env var > config file > prompt user
    if (process.env.GROQ_API_KEY) {
        return process.env.GROQ_API_KEY;
    }
    
    const configPath = path.join(os.homedir(), '.dito', 'config.json');
    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        return config.apiKey;
    }
    
    throw new Error('GROQ_API_KEY not found. Set it via: export GROQ_API_KEY=your_key');
}
```

**Update README**:
```markdown
## Setup

1. Get your Groq API key from https://console.groq.com
2. Set environment variable:
   ```bash
   export GROQ_API_KEY=your_key_here
   # Or add to ~/.bashrc or ~/.zshrc
   ```
3. Run dito
```

### Issue 3.2: No input validation
**Problem**: User inputs (directory paths, file paths) aren't validated.

**Recommendation**: Add validation helpers
```javascript
// src/utils/validation.js
const path = require('path');
const fs = require('fs');

function validateDirectory(dir) {
    const resolved = path.resolve(dir);
    
    if (!fs.existsSync(resolved)) {
        throw new Error(`Directory does not exist: ${dir}`);
    }
    
    if (!fs.statSync(resolved).isDirectory()) {
        throw new Error(`Not a directory: ${dir}`);
    }
    
    // Prevent analyzing system directories
    const dangerous = ['/etc', '/sys', '/proc', 'C:\\Windows'];
    if (dangerous.some(d => resolved.startsWith(d))) {
        throw new Error(`Cannot analyze system directory: ${dir}`);
    }
    
    return resolved;
}

function validateFile(file) {
    const resolved = path.resolve(file);
    
    if (!fs.existsSync(resolved)) {
        throw new Error(`File does not exist: ${file}`);
    }
    
    if (!fs.statSync(resolved).isFile()) {
        throw new Error(`Not a file: ${file}`);
    }
    
    return resolved;
}
```

### Issue 3.3: Potential command injection in debug handler
**Problem**: Using `program.parseAsync` with user input.

**Current** (`bin/dito.js` - handleDebug):
```javascript
await program.parseAsync(['node', 'dito', 'debug', file, error || '']);
```

**Recommendation**: Call the debug function directly
```javascript
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

    // Direct call instead of parseAsync
    const targetFile = validateFile(file);
    const spinner = ora('Analyzing...').start();
    
    try {
        const response = await debugFile(targetFile, error);
        spinner.stop();
        console.log('\n' + boxen(response, {
            padding: 1,
            title: 'Debug Results',
            borderColor: 'red'
        }));
    } catch (err) {
        spinner.fail('Debugging failed.');
        console.error(chalk.red(err.message));
    }
    
    await returnToMenu();
}
```

---

## 4. Testing Coverage

### Current State
- ✅ Crawler tests exist and are comprehensive
- ❌ No tests for CLI handlers
- ❌ No tests for AI integration
- ❌ No tests for fix generator
- ❌ No integration tests

### Recommendations

#### 4.1: Add handler tests
```javascript
// tests/handlers.test.js
const { handleSecurityAudit } = require('../src/cli/handlers');

jest.mock('inquirer');
jest.mock('../src/analysis/runner');

describe('Handler Functions', () => {
    test('handleSecurityAudit prompts for directory', async () => {
        inquirer.prompt.mockResolvedValue({ dir: './test' });
        
        await handleSecurityAudit();
        
        expect(inquirer.prompt).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.objectContaining({ name: 'dir' })
            ])
        );
    });
});
```

#### 4.2: Add AI integration tests with mocking
```javascript
// tests/ai.test.js
const { analyzeWithGrok } = require('../src/ai');
const axios = require('axios');

jest.mock('axios');

describe('AI Integration', () => {
    test('handles API errors gracefully', async () => {
        axios.post.mockRejectedValue({
            response: { status: 503, data: { error: 'Service unavailable' } }
        });
        
        await expect(analyzeWithGrok([], 'test'))
            .rejects.toThrow('Groq API Error: 503');
    });
    
    test('respects MOCK_AI environment variable', async () => {
        process.env.MOCK_AI = 'true';
        
        const result = await analyzeWithGrok([], 'test');
        
        expect(result).toContain('MOCK');
        expect(axios.post).not.toHaveBeenCalled();
    });
});
```

#### 4.3: Add E2E tests
```javascript
// tests/e2e.test.js
const { spawn } = require('child_process');

describe('End-to-End Tests', () => {
    test('CLI launches and shows menu', (done) => {
        const cli = spawn('node', ['bin/dito.js']);
        
        let output = '';
        cli.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        setTimeout(() => {
            expect(output).toContain('What would you like to do?');
            expect(output).toContain('Security Audit Only');
            cli.kill();
            done();
        }, 2000);
    });
});
```

#### 4.4: Add test coverage reporting
```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  },
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 70,
        "lines": 70,
        "statements": 70
      }
    }
  }
}
```

---

## 5. Documentation

### Current State
- ✅ Comprehensive README
- ✅ Quick start guide
- ❌ No API documentation
- ❌ No contribution guidelines
- ❌ No inline JSDoc for complex functions

### Recommendations

#### 5.1: Add JSDoc comments
```javascript
/**
 * Analyzes a project directory with specialized mode
 * @param {string} directory - Absolute or relative path to project
 * @param {'full'|'security'|'performance'|'testing'|'quality'} mode - Analysis mode
 * @returns {Promise<void>}
 * @throws {Error} If directory doesn't exist or analysis fails
 * @example
 * await runAnalysis('./my-project', 'security');
 */
async function runAnalysis(directory, mode = 'full') {
    // ...
}
```

#### 5.2: Create CONTRIBUTING.md
```markdown
# Contributing to Dito

## Development Setup
1. Fork and clone
2. `npm install`
3. `npm test` to run tests
4. Make changes
5. Add tests
6. Submit PR

## Code Style
- Use async/await over callbacks
- Add JSDoc for public functions
- Keep functions under 50 lines
- Use meaningful variable names

## Testing
- Write tests for new features
- Maintain 70%+ coverage
- Run `npm test` before committing
```

#### 5.3: Add API documentation
```markdown
# API Documentation

## Core Functions

### `crawlProject(directory)`
Recursively scans directory for code files.

**Parameters:**
- `directory` (string): Path to scan

**Returns:** `Promise<Array<{path: string, content: string}>>`

**Example:**
\`\`\`javascript
const files = await crawlProject('./my-app');
console.log(`Found ${files.length} files`);
\`\`\`

### `analyzeWithGrok(files, prompt)`
Sends files to Groq AI for analysis.

**Parameters:**
- `files` (Array): File objects from crawlProject
- `prompt` (string): Analysis instructions

**Returns:** `Promise<string>` - AI response

**Throws:** API errors, network errors
```

#### 5.4: Add inline comments for complex logic
```javascript
// src/fix_generator.js
function generateFixPrompts(reportContent, targetDir) {
    // Parse multiple issue types to ensure we catch all problems
    // regardless of how the AI formats the report
    const sections = ['Critical Issues', 'Security Issues', /* ... */];
    
    sections.forEach(sectionName => {
        // Use regex to find section boundaries
        // Matches: "## Section Name" followed by content until next section
        const sectionRegex = new RegExp(/* ... */);
        // ...
    });
}
```

---

## 6. Additional Recommendations

### 6.1: Add CI/CD
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

### 6.2: Add linting
```bash
npm install --save-dev eslint
npx eslint --init
```

```json
// package.json
{
  "scripts": {
    "lint": "eslint src/ bin/ tests/",
    "lint:fix": "eslint src/ bin/ tests/ --fix"
  }
}
```

### 6.3: Add dependency security scanning
```json
// package.json
{
  "scripts": {
    "audit": "npm audit",
    "audit:fix": "npm audit fix"
  }
}
```

### 6.4: Add changelog automation
```bash
npm install --save-dev standard-version
```

```json
// package.json
{
  "scripts": {
    "release": "standard-version"
  }
}
```

---

## Priority Action Items

### High Priority (Do First)
1. ✅ **Security**: Remove hardcoded API key, use environment variables
2. ✅ **Security**: Add input validation for paths
3. ✅ **Testing**: Add tests for handlers and AI integration
4. ✅ **Performance**: Make file reading async

### Medium Priority (Do Next)
5. ✅ **Organization**: Split bin/dito.js into modules
6. ✅ **Documentation**: Add JSDoc comments
7. ✅ **Testing**: Add E2E tests
8. ✅ **CI/CD**: Set up GitHub Actions

### Low Priority (Nice to Have)
9. ✅ **Performance**: Add caching
10. ✅ **Performance**: Add streaming for AI responses
11. ✅ **Documentation**: Create API docs
12. ✅ **Tooling**: Add linting and formatting

---

## Estimated Impact

| Improvement | Effort | Impact | Priority |
|-------------|--------|--------|----------|
| Remove hardcoded API key | 2 hours | High | Critical |
| Add input validation | 3 hours | High | Critical |
| Split bin/dito.js | 4 hours | Medium | High |
| Add handler tests | 6 hours | High | High |
| Make file reading async | 2 hours | Medium | Medium |
| Add JSDoc comments | 4 hours | Medium | Medium |
| Add caching | 6 hours | Low | Low |

---

## Conclusion

Dito is a solid foundation with good architecture. The main areas for improvement are:
1. **Security** - Remove hardcoded secrets
2. **Testing** - Increase coverage from ~30% to 70%+
3. **Organization** - Break up large files
4. **Documentation** - Add inline docs and API reference

Implementing the high-priority items will significantly improve code quality, security, and maintainability.
