
<div align="center">

# 🔮 D I T O
**The AI-Powered "Vibe Coding" Auditor**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Powered By](https://img.shields.io/badge/Powered%20By-DeepSeek%20(Xroute)-blue)](https://deepseek.com)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)]()

</div>

---

## ⚡ What is Dito?

**Dito** is not just a linter. It's an intelligent AI agent that audits your codebase for "Vibe Coding" pitfalls. It reads your project, understands the context, and hunts for the things traditional linters miss.

> *"It's like having a Senior Security Engineer and a QA Lead strictly reviewing your weekend hackathon project."*

### ⚡ Features

**Dito strictly scans for:**
- 🚨 **Security Vulnerabilities** (SQL Injection, XSS, Unrestricted File Uploads)
- 🔑 **Secret Leaks** (Hardcoded API Keys, Credentials)
- 📉 **Performance Bottlenecks** (Memory leaks, N+1 queries)
- 📝 **Code Quality** (Spaghetti code, lack of documentation)
- 🧪 **Testing Strategy** (Missing tests, edge case handling)
- 🛡️ **Operational Maturity** (Error logging, stack traces, rate limiting)

---

## 🚀 Installation

### Prerequisites
- Node.js (v18+)

### Setup
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/ditto.git
    cd ditto
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Link Command** (Optional):
    ```bash
    npm link
    ```

---

## 🎮 Usage

### Analyze a Project
Run the auditor on any directory. No login or API keys required!
```bash
dito analyze ./path/to/my-project
```

### The Result
Dito will generate two key files in your project directory:

- 📄 **`dito-report.md`**: A detailed, graded report of your codebase with specific "Recommended Fixes".
- 🧪 **`dito_generated_tests.js`**: A ready-to-run test suite generated specifically to exploit the weaknesses found in your code (Attack Vector testing).

---

## 🛠️ Testing functionality

To verify Dito itself is working correctly, run the internal test suite:

```bash
npm test
```
*Runs Jest unit tests for Crawler, Generator, and CLI integration.*

---

## ⚠️ "Mock AI" Mode
If you don't have API keys handy, you can run Dito in **Mock Mode** to see how it behaves:

```bash
MOCK_AI=true dito analyze ./my-project
```
*This simulates an AI response finding SQL Injection flaws.*

---

<div align="center">
  <sub>Built with ❤️ by "Vibe Coders" for "Vibe Coders"</sub>
</div>
