
<div align="center">

# 🔮 D I T O
**The AI-Powered "Vibe Coding" Auditor**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Powered By](https://img.shields.io/badge/Powered%20By-OpenAI%20GPT--5-green)](https://openai.com)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)]()

</div>

---

## 📖 Table of Contents
- [What is Dito?](#-what-is-dito)
- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
  - [Interactive Mode](#-interactive-mode)
  - [Analyze Command](#analyze-command)
  - [Debug Command](#debug-command)
- [Output Files](#-output-files)
- [Configuration](#-configuration)
- [Examples](#-examples)
- [Testing Dito](#-testing-dito)
- [Troubleshooting](#-troubleshooting)

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
- 🚨 **Security Vulnerabilities**
  - SQL Injection, XSS, CSRF
  - Unrestricted File Uploads
  - Database credential leaks
  - Exposed PII (Personally Identifiable Information)
- 🔑 **Secret Leaks**
  - Hardcoded API Keys (`sk-`, `ghp_`, etc.)
  - Database passwords
  - JWT secrets
- 📉 **Performance Issues**
  - Memory leaks
  - N+1 queries
  - Inefficient loops
- 📝 **Code Quality**
  - Spaghetti code
  - Poor variable naming
  - Missing documentation
- 🧪 **Testing Strategy & Infrastructure**
  - Missing unit/integration/E2E tests
  - Lack of sandbox/staging environments
  - No CI/CD automation
  - Missing chaos/fault injection testing
  - Cross-platform/browser coverage gaps
  - Test pyramid violations
- 🛡️ **Operational Maturity**
  - Error logging
  - Stack trace exposure
  - Rate limiting

### 🎯 V2 Advanced Features:
- **Interactive Menu**: User-friendly TUI for selecting actions
- **Debug Mode**: AI-powered debugging for specific files
- **Fix Prompt Generator**: Creates `dito-fixes.md` with copy-pasteable prompts
- **Configuration Support**: Customize strictness and ignore patterns via `.ditorc.json`
- **Enhanced UI**: Beautiful terminal output with colors and boxes

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

Simply run `dito` without arguments to launch the interactive menu:

```bash
dito
```

**You'll see:**
```
  ____      ___     _____      ___  
 |  _ \    |_ _|   |_   _|    / _ \ 
 | | | |    | |      | |     | | | |
 | |_| |    | |      | |     | |_| |
 |____/    |___|     |_|      \___/ 

Welcome to Dito CLI - The Vibe Coding Auditor

? What would you like to do? (Use arrow keys)
❯ 🔮 Analyze a Project
  🐛 Debug a specific File
  🚪 Exit
```

---

### Analyze Command

Audit an entire project directory:

```bash
dito analyze ./path/to/your-project
```

**Example:**
```bash
dito analyze ./my-express-app
```

**What happens:**
1. 🔍 Crawls all files (respects `.gitignore`)
2. 🤖 Sends code to OpenAI GPT-5 for deep analysis
3. 📊 Generates a graded report (A-F)
4. 🛠️ Creates fix prompts
5. 🧪 Generates attack vector tests

**Output:**
```
✨ Dito Vibe Check Complete! ✨

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

### 1. `dito-report.md`
A comprehensive audit report containing:
- **Grade** (A-F)
- **Summary** of findings
- **Critical Issues** (security/crashes)
- **Warnings** (performance/quality)
- **Recommended Fixes** (step-by-step)

**Example snippet:**
```markdown
# Dito Audit Report

## Grade: D

### Critical Issues
1. **SQL Injection in `/user` endpoint**
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
Act as a Senior Security Engineer. Rewrite the following code to use parameterized queries...
```
```

### 3. `dito_generated_tests.js`
Executable attack vector tests:

```javascript
// Tests SQL injection, XSS, DoS, etc.
// Usage: node dito_generated_tests.js
```

---

## ⚙️ Configuration

Create a `.ditorc.json` in your project root to customize Dito's behavior:

```json
{
  "strictness": "strict",
  "ignore": [
    "legacy/**",
    "vendor/**",
    "*.min.js"
  ]
}
```

### Options:

| Option | Values | Description |
|--------|--------|-------------|
| `strictness` | `"chill"`, `"standard"`, `"strict"` | How harsh the AI should be |
| `ignore` | Array of glob patterns | Files/folders to skip |

**Strictness Levels:**
- **chill**: Lenient, good for hackathons
- **standard**: Balanced (default)
- **strict**: Enterprise-grade scrutiny

---

## 💡 Examples

### Example 1: Analyze a vulnerable Express app

```bash
dito analyze ./my-api
```

**Sample Output:**
```
Grade: F

Critical Issues:
- SQL Injection in /users endpoint
- Hardcoded API key in config.js
- No rate limiting on /login

Tests Generated: 14 attack vectors
```

### Example 2: Debug a crashing route

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

**Cause:** Xroute API is slow/down

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
