const axios = require('axios');

class ZohoMeeting {
  constructor() {
    this.config = {
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: process.env.REDIRECT_URI,
      accountsServer: 'https://accounts.zoho.com',
      meetingApi: 'https://api.zoom.us/v2' // Updated endpoint
    };
    this.accessToken = null;
  }

  async getAccessToken() {
    try {
      const response = await axios.post(
        `${this.config.accountsServer}/oauth/v2/token`,
        new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
          refresh_token: process.env.REFRESH_TOKEN
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Token error:', error.response?.data || error.message);
      throw error;
    }
  }

  async createMeeting(userName) {
    try {
      if (!userName) throw new Error('Name parameter is required');
      
      if (!this.accessToken) {
        await this.getAccessToken();
      }
  
      const response = await axios.post(
        `${this.config.meetingApi}/meetings`,
        {
          topic: `Welcome Meeting for ${userName}`,
          type: 'meeting',
          start_time: new Date(Date.now() + 30 * 60000).toISOString(),
          duration: 30,
          timezone: 'UTC'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      return response.data;
    } catch (error) {
      console.error('Meeting creation failed:', {
        error: error.response?.data || error.message,
        config: error.config
      });
      throw error;
    }
  }
}
module.exports = new ZohoMeeting();