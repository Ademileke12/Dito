const ANALYSIS_PROMPT = `
Analyze the provided codebase for the following critical issues. Be extremely thorough and strict.

1. **Security Vulnerabilities**:
    - JSON/SQL Injection?
    - XSS?
    - Unrestricted File Uploads?
    - **Database Security**: Are connection strings exposed? Are credentials hardcoded? Is the database configured insecurely (if visible)?
    - **Data Leaks**: Is PII (Personally Identifiable Information) logged or exposed?
2. **Secret Leaks**: Are there hardcoded API keys, tokens, or passwords? (Check for "sk-", "ghp_", "password", "db_pass").
3. **Performance**: Loop inefficiencies? Memory leaks? N+1 queries?
4. **Code Quality**: Spaghetti code? Variable naming? file structure?
5. **Logic Bugs**: obvious runtime errors?
6. **Edge Cases**: What happens if inputs are null, empty, or malformed?
7. **Documentation**: Does the code explain itself? Are there comments? ("reading docs matters")
8. **Testing Strategy & Infrastructure**: 
    - **Automated Testing**: Are there unit tests, integration tests, E2E tests? Is there regression testing?
    - **Testing Environment**: Is there a sandbox/staging environment? Test user accounts?
    - **Platform Coverage**: Multi-platform testing (web, mobile)? Cross-browser? Multi-OS?
    - **Specialized Testing**: Chaos/fault injection? API testing? Manual exploratory testing?
    - **Test Pyramid**: Is there a proper test pyramid (more unit tests, fewer manual tests)?
    - **CI/CD Integration**: Are tests automated in the pipeline? Parallel test execution?
    - **Test Aspects**: Do tests describe "why" and "what" before "how"?

Return the report in the following Markdown format:
- Start with a strict "Grade" (A-F).
- Provide a summary of findings.
- List "Critical Issues" (Security/Crashing bugs).
- List "Improvements" (Code style, optimizations).
- For every critical issue, provide a "Recommended Fix" code block.
`;

const TEST_GENERATION_PROMPT = `
Based on the codebase provided, generate a comprehensive test suite.
Create a strict 'Attack Vector' test plan.

**CRITICAL**: Search the codebase for **actual URL endpoints**, API routes (like /api/*), or front-end fetch/axios calls. Use these real URLs for your tests. 
- If you find no local API routes (e.g. Next.js pages but no pages/api), **do not guess**. Instead, target the main page routes (/) and look for input forms in the JSX/HTML to attack.
- Clearly comment at the top of the test script whether endpoints were found or if you are targeting front-end routes.

Generate specific inputs/scripts to test realistically:
- SQL Injection attempts on identified endpoints or form fields.
- XSS payloads for any input fields/URL params found in the code.
- Large payloads for identified POST routes or file uploads.
- Malformed JSON/Headers for identified API routes.

**Test Logic**:
- A test should **PASS** if the server handles the attack gracefully (returns a 4xx error or a clean error message).
- A test should **FAIL** if the server crashes (ECONNREFUSED/500) or reflects an XSS payload raw in the response.

**Output Format**:
Return valid Javascript code (using the native global fetch API) that acts as a test script. 
Ensure the script is self-contained and has **no external dependencies** (no node-fetch, no axios).
The code should be ready to run as a standalone 'dito_generated_tests.js' with 'node dito_generated_tests.js'.
It should log 'PASS' or 'FAIL' for each test case.
Wait 1s between requests to avoid self-DoS if rate limiting is missing.
Use a base URL like 'const BASE_URL = process.env.BASE_URL || "http://localhost:3000";'.
`;

module.exports = { ANALYSIS_PROMPT, TEST_GENERATION_PROMPT };
