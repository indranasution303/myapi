// Import dependencies
const express = require('express');
const fs = require('fs');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const authToken = req.headers['authorization'];
    if (!authToken || authToken !== `Bearer ${process.env.AUTH_TOKEN}`) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
};

// Endpoint to get a random URL
app.get('/random-url', authenticateToken, (req, res) => {
    fs.readFile('url.txt', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        // Split URLs by newline character
        const urls = data.trim().split('\n');

        // Select a random URL
        const randomIndex = Math.floor(Math.random() * urls.length);
        const randomUrl = urls[randomIndex];

        res.json({ url: randomUrl });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
