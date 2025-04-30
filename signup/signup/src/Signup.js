import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';

function SignupForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [meetingDetails, setMeetingDetails] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: '',
    }));
    setSuccessMsg('');
    setErrorMsg('');
    setMeetingDetails(null);
  };

  const validate = () => {
    let temp = {};
    temp.name = formData.name ? '' : 'Name is required.';
    temp.email = /\S+@\S+\.\S+/.test(formData.email) ? '' : 'Email is not valid.';
    temp.password = formData.password.length >= 6 ? '' : 'Password must be at least 6 characters.';
    setErrors(temp);
    return Object.values(temp).every((x) => x === '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        console.log('Submitting form data:', formData);
        const res = await axios.post('http://localhost:5000/api/signup', formData, {
          headers: { 'Content-Type': 'application/json' },
        });
        setSuccessMsg(res.data.message);
        setMeetingDetails(res.data.meeting);
        setFormData({ name: '', email: '', password: '' });
      } catch (error) {
        const serverError = error.response?.data?.error || 'Something went wrong.';
        setErrorMsg(serverError);
        console.error('Error submitting form:', serverError);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 5, bgcolor: '#e3f2fd' }}>
        <Typography variant="h5" gutterBottom align="center">
          Sign Up
        </Typography>

        {successMsg && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMsg}
            {meetingDetails && (
              <Box mt={1}>
                <Typography variant="body2">
                  Meeting URL:{' '}
                  <a href={meetingDetails.meeting_url} target="_blank" rel="noopener noreferrer">
                    Join Meeting
                  </a>
                </Typography>
                <Typography variant="body2">Meeting ID: {meetingDetails.meeting_id}</Typography>
              </Box>
            )}
          </Alert>
        )}
        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Box component="form" noValidate onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={Boolean(errors.password)}
            helperText={errors.password}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default SignupForm;