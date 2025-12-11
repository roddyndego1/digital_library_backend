const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database
const db = require('./db');

// Test endpoint
app.get("/", (req, res) => {
    res.send("Digital Library Backend Running");
});

// Example query test endpoint
app.get("/test-db", async (req, res) => {
    try {
        const result = await db.query("SELECT NOW()");
        res.json({ success: true, time: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
});
