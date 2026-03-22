# Dito Quick Start Guide

## Installation

```bash
# Clone the repository
git clone https://github.com/Ademileke12/Dito.git
cd Dito

# Install dependencies
npm install

# Make globally available (optional)
sudo npm link
```

## Basic Usage

### Launch Interactive Menu
```bash
dito
```

### Quick Analysis
```bash
# Full analysis
dito analyze ./my-project

# Debug specific file
dito debug ./src/auth.js "Returns 500 error"
```

## Analysis Modes

| Mode | Command | What It Checks | Output Files |
|------|---------|----------------|--------------|
| **Full Analysis** | `dito analyze ./project` | Everything | `dito-report.md`, `dito-fixes.md`, `dito_generated_tests.js` |
| **Security Audit** | Interactive menu | SQL Injection, XSS, CSRF, Secrets | `dito-security-report.md`, `dito-fixes.md`, tests |
| **Performance** | Interactive menu | Memory leaks, N+1 queries, Caching | `dito-performance-report.md`, `dito-fixes.md` |
| **Testing** | Interactive menu | Test coverage, CI/CD, Test pyramid | `dito-testing-report.md`, `dito-fixes.md` |
| **Code Quality** | Interactive menu | Structure, Naming, Documentation | `dito-quality-report.md`, `dito-fixes.md` |

## Configuration

### Create Config File
```bash
dito → Initialize Dito Config
```

### Manual Configuration
Create `.ditorc.json`:
```json
{
  "strictness": "standard",
  "ignore": [
    "node_modules/**",
    "dist/**",
    "*.min.js"
  ]
}
```

### Strictness Levels
- **chill**: Lenient (hackathons, prototypes)
- **standard**: Balanced (recommended)
- **strict**: Enterprise-grade

## Common Tasks

### View All Reports
```bash
dito → View Generated Reports
```

### Clean Up Reports
```bash
dito → Delete All Reports
```

### Change Strictness
```bash
dito → Adjust Strictness Level
```

### Add Ignore Pattern
```bash
dito → Manage Ignore Patterns → Add new pattern
```

## Running Generated Tests

```bash
# Start your application first
node app.js

# In another terminal, run tests
node dito_generated_tests.js
```

## Tips

1. **Start with Security Audit** if you're concerned about vulnerabilities
2. **Use Performance Check** before deploying to production
3. **Run Testing Analysis** to improve test coverage
4. **Use Code Quality Review** for refactoring guidance
5. **Adjust strictness** based on project maturity:
   - Prototype → Chill
   - Development → Standard
   - Production → Strict

## Troubleshooting

### Command not found
```bash
sudo npm link
```

### API timeout
```bash
MOCK_AI=true dito analyze ./project
```

### Module errors
```bash
npm install
```

## Next Steps

1. Run your first analysis: `dito analyze ./`
2. Review the generated report
3. Use fix prompts from `dito-fixes.md`
4. Run security tests: `node dito_generated_tests.js`
5. Configure `.ditorc.json` for your project

## Resources

- Full Documentation: [README.md](README.md)
- Upgrade Details: [DITO_UPGRADE_SUMMARY.md](DITO_UPGRADE_SUMMARY.md)
- GitHub: https://github.com/Ademileke12/Dito
