// test-runner.js
// Attack Vector Test Plan for Dito test app
// Usage: BASE_URL=http://localhost:3000 node test-runner.js

const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  validateStatus: () => true
});

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

const results = [];

async function runTest(name, fn) {
  try {
    const res = await fn();
    results.push({ name, status: res.pass ? 'PASS' : 'FAIL', details: res.details || '' });
    console.log(`${res.pass ? 'PASS' : 'FAIL'} - ${name}${res.details ? ` - ${res.details}` : ''}`);
  } catch (err) {
    results.push({ name, status: 'FAIL', details: err && err.message ? err.message : String(err) });
    console.log(`FAIL - ${name} - ${err && err.message ? err.message : String(err)}`);
  }
  await sleep(1000);
}

function enc(v) {
  return encodeURIComponent(v);
}

async function main() {
  console.log(`Starting tests against ${BASE_URL}`);

  // Smoke: server reachable
  await runTest('Server reachable (/user?id=1)', async () => {
    try {
      const r = await client.get(`/user?id=1`);
      const pass = r.status >= 200 && r.status < 600; // any response means server reachable
      return { pass, details: `HTTP ${r.status}` };
    } catch (e) {
      return { pass: false, details: e.message };
    }
  });

  // SQL Injection attempts on /user
  const sqliPayloads = [
    "1 OR 1=1",
    "0; DROP TABLE users;--",
    "' OR '1'='1",
    "1; SELECT pg_sleep(2); --"
  ];
  for (const payload of sqliPayloads) {
    await runTest(`SQLi attempt on /user?id=${payload}`, async () => {
      const r = await client.get(`/user?id=${enc(payload)}`);
      // Strict criterion: should reject with 4xx for invalid id
      const pass = r.status >= 400 && r.status < 500;
      return { pass, details: `HTTP ${r.status}` };
    });
  }

  // XSS payloads in /user query param
  const xssPayloads = [
    `<script>alert(1)</script>`,
    `"><img src=x onerror=alert(1)>`,
    `<svg onload=alert(1)>`
  ];
  for (const payload of xssPayloads) {
    await runTest(`XSS payload in /user?id=${payload}`, async () => {
      const r = await client.get(`/user?id=${enc(payload)}`);
      // Pass if rejected with 4xx. If the response body reflects the payload, hard FAIL.
      const body = typeof r.data === 'string' ? r.data : JSON.stringify(r.data);
      if (body && body.includes(payload)) {
        return { pass: false, details: `Reflected payload; HTTP ${r.status}` };
      }
      const pass = r.status >= 400 && r.status < 500;
      return { pass, details: `HTTP ${r.status}` };
    });
  }

  // Large payloads (DoS/Overflow) on /upload
  await runTest('Upload with ~50KB JSON (should be accepted under 100kb default)', async () => {
    const size = 50 * 1024;
    const big = 'A'.repeat(size);
    const r = await client.post('/upload', { data: big }, { headers: { 'Content-Type': 'application/json' } });
    // Default body-parser limit is 100kb; 50KB should be <= limit; expect 2xx
    const pass = r.status >= 200 && r.status < 300;
    return { pass, details: `HTTP ${r.status}` };
  });

  await runTest('Upload with ~150KB JSON (should be rejected 413)', async () => {
    const size = 150 * 1024;
    const big = 'B'.repeat(size);
    const r = await client.post('/upload', { data: big }, { headers: { 'Content-Type': 'application/json' } });
    const pass = r.status === 413; // Payload Too Large
    return { pass, details: `HTTP ${r.status}` };
  });

  // Malformed JSON/Headers on /upload
  await runTest('Upload with malformed JSON body (should be 400)', async () => {
    const r = await client.post('/upload', 'this is not json', {
      headers: { 'Content-Type': 'application/json' }
    });
    // body-parser should return 400 for invalid json
    const pass = r.status === 400;
    return { pass, details: `HTTP ${r.status}` };
  });

  await runTest('Upload with wrong content-type but body present (should reject)', async () => {
    // This endpoint doesn't validate content-type; strict expectation is to reject non-JSON for an upload route
    const r = await client.post('/upload', 'raw-bytes-as-text', {
      headers: { 'Content-Type': 'text/plain' }
    });
    // Expect 4xx; if 2xx, it's too permissive
    const pass = r.status >= 400 && r.status < 500;
    return { pass, details: `HTTP ${r.status}` };
  });

  // Crash behavior: endpoint should 500 but server must remain alive
  await runTest('/crash returns 500 (no stack leak ideally)', async () => {
    const r = await client.get('/crash');
    const body = typeof r.data === 'string' ? r.data : JSON.stringify(r.data);
    // Accept 500; but try to ensure no obvious stack traces in body (heuristic)
    const stackIndicators = ['Error:', 'at ', 'stack'];
    const stackLeak = stackIndicators.some(sig => body.includes(sig));
    const pass = r.status === 500 && !stackLeak;
    return { pass, details: `HTTP ${r.status}${stackLeak ? ' stack leaked' : ''}` };
  });

  await runTest('Server remains alive after /crash', async () => {
    // If server crashed, this request fails or connection refused
    try {
      const r = await client.get('/user?id=1');
      const pass = r.status >= 200 && r.status < 600; // any response is OK
      return { pass, details: `HTTP ${r.status}` };
    } catch (e) {
      return { pass: false, details: e.message };
    }
  });

  // Summary
  console.log('\n=== Test Summary ===');
  let passCount = 0, failCount = 0;
  for (const r of results) {
    if (r.status === 'PASS') passCount++; else failCount++;
  }
  console.log(`PASS: ${passCount}`);
  console.log(`FAIL: ${failCount}`);

  // Exit code indicates failure(s)
  process.exit(failCount > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal test runner error:', err);
  process.exit(2);
});