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
Create a strict "Attack Vector" test plan.

Generate specific inputs/scripts to test:
- SQL Injection attempts on all endpoints.
- XSS payloads for input fields.
- Large payloads (DoS/Overflow).
- Malformed JSON/Headers.

**Output Format**:
Return valid Javascript code (using standard fetch or axios) that acts as a test script. 
The code should be ready to run as a standalone "test-runner.js".
It should log "PASS" or "FAIL" for each test case.
Wait 1s between requests to avoid self-DoS if rate limiting is missing.
`;

module.exports = { ANALYSIS_PROMPT, TEST_GENERATION_PROMPT };
