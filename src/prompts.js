const ANALYSIS_PROMPT = `
Analyze the provided codebase for the following critical issues. Be extremely thorough and strict.

1. **Security Vulnerabilities**:
    - JSON/SQL Injection?
    - XSS?
    - **CSRF**: Are state-changing operations protected?
    - **Unrestricted File Uploads**: Are file types and sizes validated?
    - **Database Security**: Are connection strings exposed? Are credentials hardcoded? Is the database configured insecurely (if visible)?
    - **Data Leaks**: Is PII (Personally Identifiable Information) logged or exposed?
2. **Secret Leaks**: Are there hardcoded API keys, tokens, or passwords? (Check for "sk-", "ghp_", "password", "db_pass", "JWT_SECRET").
3. **Performance**: Loop inefficiencies? Memory leaks? N+1 queries?
4. **Code Quality**: Spaghetti code? Variable naming? file structure? Missing documentation?
5. **Logic Bugs**: obvious runtime errors?
6. **Edge Cases**: What happens if inputs are null, empty, or malformed?
7. **Operational Maturity**: 
    - **Error Logging**: Is error handling consistent?
    - **Stack Trace Exposure**: Do 500 errors leak internal paths/stacks to the user?
    - **Rate Limiting**: Is there any protection against brute-force/DoS?
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
- **SQL Injection**: payloads on identified endpoints or form fields.
- **XSS**: payloads for any input fields/URL params found in the code.
- **CSRF**: Test if state-changing endpoints (POST/PUT/DELETE) can be hit without tokens.
- **Secret Checks**: Test if known sensitive paths or files (like /.env or /config) are publicly accessible.
- **DoS/Payload size**: Large payloads for identified POST routes or file uploads.
- **Malformed Data**: Malformed JSON/Headers for identified API routes.
- **Error Handling**: Trigger a 500 error and check if the response contains stack traces or internal paths.
- **Rate Limiting**: Rapid fire 10 requests to an endpoint and check if it starts returning 429.

**Test Logic**:
- A test should **PASS** if the server handles the attack gracefully (returns a 4xx error, a clean error message, or uses 429 for rate limiting).
- A test should **FAIL** if the server crashes (ECONNREFUSED/500), reflects an XSS payload raw, reveals secrets, or leaks stack traces.

**Output Format**:
You MUST return the test script wrapped in a unique delimiter. 
Everything between "---BEGIN DITO TESTS---" and "---END DITO TESTS---" must be valid, standalone Javascript.

**Rules for Test Code**:
- Use the **GLOBAL native fetch API** only.
- **DO NOT** use 'require("node-fetch")', 'require("fetch")', or any 'import' statement.
- **DO NOT** add any headers or setups for fetch libraries. Assume it is available globally.
- **NEVER** use Jest/Mocha globals like 'test()', 'expect()', or 'describe()'.
- The script must be self-contained and run with 'node dito_generated_tests.js'.
- Use 'console.log("PASS: ...")' or 'console.log("FAIL: ...")'.
- Wait 1s between requests (unless specifically testing rate limiting).
- Use a base URL like 'const BASE_URL = process.env.BASE_URL || "http://localhost:3000";'.

---BEGIN DITO TESTS---
// Start your standalone script here
---END DITO TESTS---
`;

module.exports = { ANALYSIS_PROMPT, TEST_GENERATION_PROMPT };
