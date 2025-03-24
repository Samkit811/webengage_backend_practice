require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
// app.use(cors({
//     origin: "*",  // Adjust for production (e.g., origin: "https://yourfrontend.com")
//     methods: ["GET", "POST", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// }));
app.use(cors());

app.use(express.json());

const API_URL = "https://api.webengage.com/v1/accounts/58b004c1/users";
const API_KEY = process.env.WEBENGAGE_API_KEY; // Using environment variables for security

// Handle Preflight OPTIONS Request (Important for CORS)
app.options("/api/webengage", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(204).send(); // No content, just headers
});

app.post('/api/webengage', async (req, res) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
        });

        // explicitly set the CORS header in response
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});