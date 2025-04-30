require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'Server is running',
    endpoints: {
      signup: 'POST /api/signup',
      users: 'GET /api/users'
    }
  });
});

let users = [];
let meetings = [];

const generateMeetingDetails = (email) => {
  const meetingId = `zoho-${Math.random().toString(36).substring(2, 15)}`;
  const meetingKey = Math.random().toString(36).substring(2, 10);
  const meetingUrl = `https://meetings.zoho.com/meeting/${meetingId}/${meetingKey}`;
  
  const meeting = {
    id: meetingId,
    key: meetingKey,
    email,
    meeting_url: meetingUrl,
    created_at: new Date().toISOString()
  };
  
  meetings.push(meeting);
  return meeting;
};

app.get('/api/users', (req, res) => {
  res.status(200).json({
    users: users.map(user => ({
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    })),
    count: users.length
  });
});

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const userExists = users.some(user => user.email === email);
    if (userExists) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const newUser = {
      name,
      email,
      password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    const meetingDetails = generateMeetingDetails(email);

    res.status(201).json({
      message: 'Registration successful!',
      meeting: {
        meeting_id: meetingDetails.id,
        meeting_key: meetingDetails.key,
        meeting_url: meetingDetails.meeting_url
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});