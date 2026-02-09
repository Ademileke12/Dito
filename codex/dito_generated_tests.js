// dito_generated_tests.js
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

// Test 1: SQL Injection attempt on '/about' endpoint
fetch(`${BASE_URL}/about?name=Robert'); DROP TABLE Students; --`)
  .then(response => {
    if (response.status === 400 || response.status === 404) {
      console.log('PASS: SQL Injection attempt failed');
    } else {
      console.log('FAIL: SQL Injection attempt successful');
    }
  })
  .catch(error => {
    console.error(error);
  });

// Test 2: XSS payload on '/contact' endpoint
fetch(`${BASE_URL}/contact?name=<script>alert('XSS')</script>`)
  .then(response => {
    if (response.status === 400 || response.status === 404) {
      console.log('PASS: XSS payload attempt failed');
    } else {
      console.log('FAIL: XSS payload attempt successful');
    }
  })
  .catch(error => {
    console.error(error);
  });

// Test 3: Large payload on '/about' endpoint
const largePayload = new Array(10000).fill('a').join('');
fetch(`${BASE_URL}/about?name=${largePayload}`)
  .then(response => {
    if (response.status === 400 || response.status === 404) {
      console.log('PASS: Large payload attempt failed');
    } else {
      console.log('FAIL: Large payload attempt successful');
    }
  })
  .catch(error => {
    console.error(error);
  });

// Test 4: Malformed JSON on '/contact' endpoint
fetch(`${BASE_URL}/contact`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: '{ invalid: json }'
})
  .then(response => {
    if (response.status === 400 || response.status === 404) {
      console.log('PASS: Malformed JSON attempt failed');
    } else {
      console.log('FAIL: Malformed JSON attempt successful');
    }
  })
  .catch(error => {
    console.error(error);
  });

// Wait 1 second between requests
setTimeout(() => {
  // Run the next test
}, 1000);