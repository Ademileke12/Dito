const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const API_URL = process.env.API_URL || "http://localhost:3001/api";

// No local API routes found, targeting front-end routes
// Targeting the main page route (/) and looking for input forms in the JSX/HTML to attack

// SQL Injection Test
fetch(`${BASE_URL}/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: `question=' OR 1=1 --`,
})
.then((response) => {
  if (response.ok) {
    console.log("FAIL: SQL Injection test passed");
  } else {
    console.log("PASS: SQL Injection test failed");
  }
})
.catch((error) => {
  console.error(error);
});

// XSS Test
fetch(`${BASE_URL}/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  body: `answer=<script>alert('XSS')</script>`,
})
.then((response) => {
  if (response.ok) {
    console.log("FAIL: XSS test passed");
  } else {
    console.log("PASS: XSS test failed");
  }
})
.catch((error) => {
  console.error(error);
});

// CSRF Test
fetch(`${API_URL}/answer`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'What is the meaning of life?',
    answer: '42',
  }),
})
.then((response) => {
  if (response.ok) {
    console.log("FAIL: CSRF test passed");
  } else {
    console.log("PASS: CSRF test failed");
  }
})
.catch((error) => {
  console.error(error);
});

// Secret Checks
fetch(`${BASE_URL}/.env`)
.then((response) => {
  if (response.ok) {
    console.log("FAIL: Secret file found");
  } else {
    console.log("PASS: Secret file not found");
  }
})
.catch((error) => {
  console.error(error);
});

// DoS/Payload size Test
fetch(`${API_URL}/answer`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    question: 'What is the meaning of life?',
    answer: 'a'.repeat(10000),
  }),
})
.then((response) => {
  if (response.ok) {
    console.log("FAIL: DoS/Payload size test passed");
  } else {
    console.log("PASS: DoS/Payload size test failed");
  }
})
.catch((error) => {
  console.error(error);
});

// Malformed Data Test
fetch(`${API_URL}/answer`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: 'Invalid JSON',
})
.then((response) => {
  if (response.ok) {
    console.log("FAIL: Malformed Data test passed");
  } else {
    console.log("PASS: Malformed Data test failed");
  }
})
.catch((error) => {
  console.error(error);
});

// Error Handling Test
fetch(`${API_URL}/non-existent-endpoint`)
.then((response) => {
  if (response.ok) {
    console.log("FAIL: Error Handling test passed");
  } else {
    console.log("PASS: Error Handling test failed");
  }
})
.catch((error) => {
  console.error(error);
});

// Rate Limiting Test
for (let i = 0; i < 10; i++) {
  fetch(`${API_URL}/answer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      question: 'What is the meaning of life?',
      answer: '42',
    }),
  })
  .then((response) => {
    if (response.status === 429) {
      console.log("PASS: Rate Limiting test passed");
    } else {
      console.log("FAIL: Rate Limiting test failed");
    }
  })
  .catch((error) => {
    console.error(error);
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
//