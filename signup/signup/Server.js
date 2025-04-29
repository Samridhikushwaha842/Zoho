const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const zohoMeeting = require('./Zoho'); // Updated import
// const zohoMeeting = require('./zohoMeeting');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/user', (req, res) => {
  res.send('🟢 Server is running.');
});

app.post('/api/signup', async (req, res) => {
  console.log('Request Body:', JSON.stringify(req.body, null, 2)); // Add this line
  
  try {
    if (!req.body) {
      return res.status(400).json({ error: 'Request body is missing' });
    }

    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing fields',
        received: { name, email, password }
      });
    }

    console.log('Creating meeting for:', name); // Add this line
    const meetingData = await zohoMeeting.createMeeting(name);
    
    res.status(200).json({
      message: 'Signup successful',
      meeting: {
        id: meetingData.meeting_key,
        url: meetingData.web_url,
        topic: meetingData.topic
      }
    });
  } catch (error) {
    console.error('Full error:', error);
    res.status(500).json({ 
      error: 'Meeting creation failed',
      details: {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});