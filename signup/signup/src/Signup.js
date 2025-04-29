require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database (replace with real database in production)
let users = [];

// Generate a random meeting ID and URL (simulating a video conferencing service)
function generateMeetingDetails() {
  const meetingId = uuidv4();
  return {
    meeting_id: meetingId,
    meeting_url: `https://example-video-service.com/meeting/${meetingId}`
  };
}

// GET API - Just for testing or getting user list
app.get('/api/signup', (req, res) => {
  res.json({
    message: 'Signup API is working',
    users: users.map(user => ({ name: user.name, email: user.email })) // Don't return passwords
  });
});

// POST API - User signup
app.post('/api/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email is not valid' });
    }

    // Password length check
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // In a real app, you would hash the password here
    const newUser = { name, email, password };
    users.push(newUser);

    // Generate meeting details (simulating a video meeting creation)
    const meetingDetails = generateMeetingDetails();

    res.status(201).json({
      message: 'User created successfully! A welcome meeting has been scheduled for you.',
      meeting: meetingDetails
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});