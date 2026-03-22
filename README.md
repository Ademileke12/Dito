
<div align="center">

# 🔮 D I T O
**The AI-Powered "Vibe Coding" Auditor**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Powered By](https://img.shields.io/badge/Powered%20By-Groq%20AI-orange)](https://groq.com)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)]()

</div>

---

## 🎉 What's New in v1.0

### 🎨 Enhanced Interactive UI
- **Modern ASCII Art Logo**: Retro-styled DITO banner with ANSI Shadow font
- **Organized Menu**: Categorized options with visual separators (Analysis, Configuration, Utilities, Help)
- **Color-Coded Interface**: Intuitive cyan headers, green success messages, yellow warnings

### 🔬 Specialized Analysis Modes
Choose the right analysis for your needs:
- **🔍 Full Project Analysis** - Complete audit of all aspects
- **🛡️ Security Audit Only** - Focused vulnerability scanning (SQL Injection, XSS, CSRF, secrets)
- **⚡ Performance Check** - Bottleneck detection (memory leaks, N+1 queries, caching)
- **🧪 Testing Coverage Analysis** - Test strategy evaluation (unit/integration/E2E, CI/CD)
- **📊 Code Quality Review** - Structure and best practices audit (naming, documentation, complexity)

### ⚙️ Interactive Configuration Manager
- **Initialize Config**: Guided setup wizard with strictness selection
- **Adjust Strictness**: Change analysis intensity (Chill/Standard/Strict)
- **Manage Ignore Patterns**: Add, remove, or reset file exclusions
- **View Settings**: Display current configuration

### 🛠️ New Utility Features
- **View Reports**: List and preview all generated reports with file sizes
- **Delete Reports**: Smart cleanup of all Dito-generated files
- **Commands Reference**: Quick access to CLI documentation
- **MCP Server Manager**: Configure and manage Model Context Protocol servers

### 📊 Mode-Specific Output
Each analysis mode generates tailored reports:
- `dito-security-report.md` for security audits
- `dito-performance-report.md` for performance checks
- `dito-testing-report.md` for testing analysis
- `dito-quality-report.md` for code quality reviews

---

## 📖 Table of Contents
- [What's New](#-whats-new-in-v10)
- [What is Dito?](#-what-is-dito)
- [Features](#-features)
- [Installation](#-installation)
- [Quick Start Guide](QUICK_START.md) ⚡
- [Usage](#-usage)
  - [Interactive Mode](#-interactive-mode)
  - [Analysis Modes](#analysis-modes)
  - [Analyze Command](#analyze-command)
  - [Debug Command](#debug-command)
- [Output Files](#-output-files)
- [Configuration](#-configuration)
- [Examples](#-examples)
- [Utility Commands](#-utility-commands)
- [Testing Dito](#-testing-dito)
- [Troubleshooting](#-troubleshooting)
- [Upgrade Summary](DITO_UPGRADE_SUMMARY.md) 📋

---

## ⚡ What is Dito?

**Dito** is not just a linter. It's an intelligent AI agent that audits your codebase for **"Vibe Coding"** pitfalls—the kind of bugs and security holes that slip through when you're moving fast and breaking things.

> *"It's like having a Senior Security Engineer and a QA Lead strictly reviewing your weekend hackathon project."*

Dito reads your entire project, understands the context, and hunts for issues that traditional linters miss. It then generates:
- 📄 A **detailed audit report** with grades and specific fixes
- 🛠️ **Copy-paste AI prompts** to fix each issue
- 🧪 **Attack vector tests** to prove the vulnerabilities exist

---

## ✨ Features

### 🔍 What Dito Scans For:

#### 🚨 Security Vulnerabilities
- SQL Injection, NoSQL Injection, Command Injection
- XSS (Cross-Site Scripting)
- CSRF (Cross-Site Request Forgery)
- Unrestricted File Uploads
- Database credential leaks
- Exposed PII (Personally Identifiable Information)
- Weak authentication & authorization
- Missing rate limiting

#### 🔑 Secret Leaks
- Hardcoded API Keys (`sk-`, `ghp_`, `AKIA`, etc.)
- Database passwords
- JWT secrets
- Private keys and certificates

#### 📉 Performance Issues
- Memory leaks and excessive memory usage
- N+1 database queries
- Inefficient loops and algorithms
- Blocking async operations
- Large bundle sizes
- Missing caching strategies
- Redundant API calls

#### 📝 Code Quality
- Poor code structure and organization
- Spaghetti code and tight coupling
- Poor variable/function naming
- Missing or inadequate documentation
- Code duplication (DRY violations)
- High cyclomatic complexity
- Inconsistent error handling

#### 🧪 Testing Strategy & Infrastructure
- Missing unit/integration/E2E tests
- Poor test coverage
- Test pyramid violations
- Lack of sandbox/staging environments
- No CI/CD automation
- Missing chaos/fault injection testing
- Cross-platform/browser coverage gaps
- Inadequate test documentation

#### 🛡️ Operational Maturity
- Inconsistent error logging
- Stack trace exposure to users
- Missing monitoring and alerting
- No graceful degradation
- Poor error messages

### 🎯 Advanced Features:

#### 🎨 Enhanced Interactive UI
- **Modern ASCII Art Logo**: Retro-styled DITO banner
- **Organized Menu Structure**: Categorized options with visual separators
- **Color-Coded Interface**: Intuitive color scheme for better UX
- **Return to Menu**: Seamless navigation between features

#### 🔬 Specialized Analysis Modes
- **Full Project Analysis**: Complete audit of all aspects
- **Security Audit Only**: Focused vulnerability scanning
- **Performance Check**: Bottleneck detection and optimization
- **Testing Analysis**: Coverage and quality evaluation
- **Code Quality Review**: Structure and best practices audit

#### ⚙️ Interactive Configuration Manager
- **Initialize Config**: Guided setup wizard
- **Adjust Strictness**: Change analysis intensity on the fly
- **Manage Ignore Patterns**: Add/remove/reset file exclusions
- **View Settings**: Display current configuration

#### 🛠️ Utility Tools
- **View Reports**: List and preview generated reports
- **Delete Reports**: Clean up all Dito-generated files
- **Commands Reference**: Quick access to CLI documentation
- **MCP Server Manager**: Configure Model Context Protocol servers
  - View configured servers
  - Add new MCP servers
  - Test connections
  - Manage server settings

#### 🤖 AI-Powered Features
- **Debug Mode**: AI-powered debugging for specific files
- **Fix Prompt Generator**: Creates `dito-fixes.md` with copy-pasteable prompts
- **Attack Vector Tests**: Generates executable security tests
- **Mode-Specific Reports**: Tailored output for each analysis type

---

## 🚀 Installation

### Prerequisites
- **Node.js** v18 or higher
- **npm** (comes with Node.js)

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ademileke12/Dito.git
   cd Dito
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Make it globally available** (Optional):
   ```bash
   sudo npm link
   ```
   After this, you can run `dito` from anywhere!
   
   *If you prefer not to install globally, use:*
   ```bash
   node bin/dito.js
   ```

---

## 🎮 Usage

### 🔮 Interactive Mode

Simply run `dito` without arguments to launch the enhanced interactive menu:

```bash
dito
```

**You'll see:**
```
██████╗ ██╗████████╗ ██████╗ 
██╔══██╗██║╚══██╔══╝██╔═══██╗
██║  ██║██║   ██║   ██║   ██║
██║  ██║██║   ██║   ██║   ██║
██████╔╝██║   ██║   ╚██████╔╝
╚═════╝ ╚═╝   ╚═╝    ╚═════╝ 
    Dito CLI v1.0
    Created by Ademileke (@Ademileke12)

? What would you like to do? (Use arrow keys)
--- Analysis Commands ---
❯ 🔍 Full Project Analysis
  🛡️  Security Audit Only
  ⚡ Performance Check
  🧪 Testing Coverage Analysis
  📊 Code Quality Review
  🐛 Debug Specific File
--- Configuration ---
  📁 Initialize Dito Config
  ⚙️  Adjust Strictness Level
  🚫 Manage Ignore Patterns
  📋 View Current Settings
--- Utilities ---
  📄 View Generated Reports
  🗑️  Delete All Reports
  ⚡ Available CLI Commands
--- Help ---
  ❓ Help & Documentation
  👋 Exit
```

---

### Analysis Modes

Dito now offers **specialized analysis modes** for targeted audits:

#### 🔍 Full Project Analysis
Complete audit covering all aspects:
```bash
dito analyze ./my-project
```
**Checks:** Security, Performance, Code Quality, Testing, Logic Bugs  
**Generates:** `dito-report.md`, `dito-fixes.md`, `dito_generated_tests.js`

#### 🛡️ Security Audit Only
Focused security vulnerability scanning:
```bash
# Via interactive menu
dito → Security Audit Only
```
**Checks:** SQL Injection, XSS, CSRF, Secret Leaks, Auth Issues, Rate Limiting  
**Generates:** `dito-security-report.md`, `dito-fixes.md`, `dito_generated_tests.js`

#### ⚡ Performance Check
Performance bottleneck detection:
```bash
# Via interactive menu
dito → Performance Check
```
**Checks:** Memory Leaks, N+1 Queries, Loop Inefficiencies, Bundle Size, Caching  
**Generates:** `dito-performance-report.md`, `dito-fixes.md`

#### 🧪 Testing Coverage Analysis
Test strategy and coverage evaluation:
```bash
# Via interactive menu
dito → Testing Coverage Analysis
```
**Checks:** Unit/Integration/E2E Tests, Test Pyramid, CI/CD Integration  
**Generates:** `dito-testing-report.md`, `dito-fixes.md`

#### 📊 Code Quality Review
Code structure and best practices audit:
```bash
# Via interactive menu
dito → Code Quality Review
```
**Checks:** Code Structure, Naming, Documentation, DRY Violations, Complexity  
**Generates:** `dito-quality-report.md`, `dito-fixes.md`

---

### Analyze Command

Audit an entire project directory (full analysis):

```bash
dito analyze ./path/to/your-project
```

**Example:**
```bash
dito analyze ./my-express-app
```

**What happens:**
1. 🔍 Crawls all files (respects `.gitignore` and `.ditorc.json` ignore patterns)
2. 🤖 Sends code to Groq AI (Llama 3) for deep analysis
3. 📊 Generates a graded report (A-F)
4. 🛠️ Creates fix prompts
5. 🧪 Generates attack vector tests

**Output:**
```
✨ Dito Analysis Complete! ✨

📄 Report: dito-report.md
🛠️  Fixes:  dito-fixes.md
🧪 Tests:  dito_generated_tests.js
```

---

### Debug Command

Debug a specific file with AI assistance:

```bash
dito debug <file-path> [error-description]
```

**Examples:**
```bash
# Basic usage
dito debug ./src/auth.js

# With error hint
dito debug ./api/users.js "Returns 500 on POST /users"
```

**Output:**
The AI will analyze the file and provide:
- 🔍 Bug explanation
- ✅ Fixed code
- 💡 Best practices

---

## 📦 Output Files

Dito generates different files based on the analysis mode selected:

### Mode-Specific Reports

#### Full Analysis
- `dito-report.md` - Complete audit report
- `dito-fixes.md` - Fix prompts for all issues
- `dito_generated_tests.js` - Attack vector tests

#### Security Audit
- `dito-security-report.md` - Security-focused report
- `dito-fixes.md` - Security fix prompts
- `dito_generated_tests.js` - Security attack tests

#### Performance Check
- `dito-performance-report.md` - Performance analysis
- `dito-fixes.md` - Optimization recommendations

#### Testing Analysis
- `dito-testing-report.md` - Test coverage report
- `dito-fixes.md` - Testing improvement suggestions

#### Code Quality Review
- `dito-quality-report.md` - Code quality assessment
- `dito-fixes.md` - Refactoring recommendations

### 1. Report Files (`dito-*-report.md`)
A comprehensive audit report containing:
- **Grade** (A-F)
- **Summary** of findings
- **Critical Issues** (security/crashes)
- **Warnings** (performance/quality)
- **Recommended Fixes** (step-by-step)

**Example snippet:**
```markdown
# Dito Security Audit Report

## Grade: D

### Critical Issues
1. **SQL Injection in `/user` endpoint**
   - Severity: Critical
   - Line 15: `const query = "SELECT * FROM users WHERE id = " + userId;`
   - Fix: Use parameterized queries
```

### 2. `dito-fixes.md`
Copy-pasteable AI prompts for each issue:

```markdown
## Fix #1: SQL Injection in /user endpoint

**Issue**: Raw string concatenation in SQL query

### 📋 Copy & Paste Prompt:
```
Act as a Senior Security Engineer. I have a code issue in my project.

ISSUE: SQL Injection in /user endpoint - Raw string concatenation in SQL query

TASK: Analyze the relevant files in my project and rewrite the code to fix this issue according to industry best practices. Ensure the fix is secure and efficient.
```
```

### 3. `dito_generated_tests.js`
Executable attack vector tests designed to exploit the specific vulnerabilities found in your project (generated for Security and Full Analysis modes only).

**How to run them:**
1.  **Start your application** (the one Dito analyzed) so it's running locally (usually on port 3000).
2.  **Open a new terminal** in the directory where the tests were generated.
3.  **Run the test suite**:
    ```bash
    node dito_generated_tests.js
    ```

> [!TIP]
> If your server is running on a different port, you can usually specify it via an environment variable if the AI included one:
> `BASE_URL=http://localhost:8080 node dito_generated_tests.js`

---

## ⚙️ Configuration

### Interactive Configuration

Dito now includes an **interactive configuration manager** accessible from the main menu:

#### 📁 Initialize Dito Config
Create a `.ditorc.json` file with guided setup:
```bash
dito → Initialize Dito Config
```
- Choose strictness level (Chill/Standard/Strict)
- Automatically sets up sensible ignore patterns
- Prompts before overwriting existing config

#### ⚙️ Adjust Strictness Level
Change analysis strictness on the fly:
```bash
dito → Adjust Strictness Level
```
- View current strictness
- Select new level with descriptions

#### 🚫 Manage Ignore Patterns
Add, remove, or reset ignore patterns:
```bash
dito → Manage Ignore Patterns
```
- View current patterns
- Add custom patterns (e.g., `*.test.js`)
- Remove specific patterns
- Reset to defaults

#### 📋 View Current Settings
Display active configuration:
```bash
dito → View Current Settings
```
- Shows strictness level
- Lists all ignore patterns

### Manual Configuration

Create a `.ditorc.json` in your project root to customize Dito's behavior:

```json
{
  "strictness": "strict",
  "ignore": [
    "node_modules/**",
    "dist/**",
    "build/**",
    "*.min.js",
    "coverage/**",
    ".git/**"
  ]
}
```

### Options:

| Option | Values | Description |
|--------|--------|-------------|
| `strictness` | `"chill"`, `"standard"`, `"strict"` | How harsh the AI should be |
| `ignore` | Array of glob patterns | Files/folders to skip |

**Strictness Levels:**
- **chill**: Lenient, good for hackathons and prototypes
- **standard**: Balanced approach (default, recommended)
- **strict**: Enterprise-grade scrutiny for production code

---

## 💡 Examples

### Example 1: Full Project Analysis

```bash
dito analyze ./my-api
```

**Sample Output:**
```
✨ Dito Analysis Complete! ✨

📄 Report: dito-report.md
🛠️  Fixes:  dito-fixes.md
🧪 Tests:  dito_generated_tests.js
```

**Report Preview:**
```
Grade: D

Critical Issues:
- SQL Injection in /users endpoint
- Hardcoded API key in config.js
- No rate limiting on /login

Performance Issues:
- N+1 query in /posts endpoint
- Memory leak in WebSocket handler

Tests Generated: 14 attack vectors
```

### Example 2: Security Audit Only

```bash
dito
# Select: 🛡️ Security Audit Only
# Enter: ./my-api
```

**Output:**
```
🛡️ Running Security Audit...
Checking: SQL Injection, XSS, CSRF, Secret Leaks, Auth Issues

✓ Report generated: dito-security-report.md
✓ Fix Prompts generated: dito-fixes.md
✓ Test Suite generated: dito_generated_tests.js
```

### Example 3: Performance Check

```bash
dito
# Select: ⚡ Performance Check
# Enter: ./my-app
```

**Output:**
```
⚡ Running Performance Analysis...
Checking: Memory Leaks, N+1 Queries, Loop Inefficiencies, Bundle Size

✓ Report generated: dito-performance-report.md
✓ Fix Prompts generated: dito-fixes.md
```

### Example 4: Debug a Crashing Route

```bash
dito debug ./routes/payment.js "Crashes with 'Cannot read property amount'"
```

**AI Response:**
```
Bug: Accessing req.body.amount without validation

Fixed Code:
if (!req.body || !req.body.amount) {
  return res.status(400).json({ error: 'Missing amount' });
}
```

### Example 5: Manage Configuration

```bash
dito
# Select: ⚙️ Adjust Strictness Level
# Choose: Strict - Enterprise-grade scrutiny

✓ Strictness updated to: strict
```

---

## 🧪 Testing Dito

Run Dito's internal test suite:

```bash
npm test
```

**What it tests:**
- File crawler logic
- Report generation
- CLI integration
- Mock AI responses

---

## 🛠️ Troubleshooting

### Issue: `dito: command not found`

**Solution:**
```bash
sudo npm link
# Then close and reopen your terminal
```

### Issue: `Permission denied` when running `dito`

**Solution:**
```bash
sudo chmod +x /path/to/Dito/bin/dito.js
```

### Issue: API timeout errors

**Cause:** Groq API is slow/down

**Solution:**
Use Mock mode:
```bash
MOCK_AI=true dito analyze ./project
```

### Issue: Tests fail with "ECONNREFUSED"

**Cause:** Server not running

**Solution:**
Start the server first:
```bash
# Terminal 1
node app.js

# Terminal 2
node dito_generated_tests.js
```

### Issue: Cannot find module errors after upgrade

**Solution:**
Reinstall dependencies:
```bash
npm install
```

### Issue: Menu not displaying correctly

**Cause:** Terminal doesn't support colors or Unicode

**Solution:**
- Use a modern terminal (iTerm2, Windows Terminal, GNOME Terminal)
- Ensure terminal supports UTF-8 encoding

### Issue: Reports not being generated

**Solution:**
1. Check if `.ditorc.json` ignore patterns are too broad
2. Verify project directory has analyzable files
3. Check console for error messages
4. Try with `MOCK_AI=true` to test without API calls

---

## 🔧 Utility Commands

### View Generated Reports
List all Dito-generated files and preview their contents:
```bash
dito → View Generated Reports
```
- Shows file sizes
- Allows preview of first 500 characters
- Quick access to analysis results

### Delete All Reports
Clean up all Dito-generated files:
```bash
dito → Delete All Reports
```
Removes:
- `dito-report.md`
- `dito-*-report.md` (all mode-specific reports)
- `dito-fixes.md`
- `dito_generated_tests.js`

### Available CLI Commands
View comprehensive command reference:
```bash
dito → Available CLI Commands
```
- Lists all analysis modes
- Shows CLI usage examples
- Quick reference guide

---

## 🤝 Contributing

Found a bug? Want a feature? Open an issue or PR!

---

## 📜 License

ISC License - See [LICENSE](LICENSE) for details

---

<div align="center">
  <sub>Built with ❤️ by "Vibe Coders" for "Vibe Coders"</sub>
</div>
