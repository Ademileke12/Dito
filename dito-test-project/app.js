const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// HARDCODED SECRET!
const API_KEY = "12345-SUPER-SECRET-KEY";

app.use(bodyParser.json());

// NO INPUT VALIDATION!
// SQL INJECTION!
app.get('/user', (req, res) => {
    const userId = req.query.id;
    // Vibe coding: no database library, just string concatenation
    const query = "SELECT * FROM users WHERE id = " + userId;
    console.log("Running query: " + query);
    // db.run(query) ...
    res.send("User data");
});

// UNRESTRICTED FILE UPLOAD!
app.post('/upload', (req, res) => {
    // Vibe coding: no checks on file type or size
    res.send("File uploaded!");
});

// NO ERROR HANDLING!
app.get('/crash', (req, res) => {
    throw new Error("Boom!");
});

app.listen(3000, () => {
    console.log('App listening on port 3000');
});
