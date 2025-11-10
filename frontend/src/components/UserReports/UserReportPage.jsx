import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Container, TextField, Button, Snackbar, MenuItem, Select,
  InputLabel, FormControl, Toolbar, CircularProgress, Fade, Paper
} from '@mui/material';
import { styled } from '@mui/system';
import Sidebar from '../Navigation/Sidebar';
import useAuth from '../Auth/useAuth';

const issueTypes = [
  'Damaged Router',
  'Delayed Delivery',
  'Incorrect Configuration',
  'Lost Package',
  'No Communication from Support',
  'Other Router Issue'
];

const MainContainer = styled(Box)({
  display: 'flex',
  minHeight: '100vh',
  background: 'linear-gradient(to bottom right, #f7f3fc 0%, #ece6f4 100%)',
  position: 'relative',
  overflow: 'hidden'
});

const ContentContainer = styled(Box)({
  flexGrow: 1,
  height: '100vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column'
});

const TopBar = styled(Box)({
  width: '100%',
  background: 'linear-gradient(135deg, #5f00a7, #9b42c3)',
  color: '#fff',
  padding: '16px',
  boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
  textAlign: 'center',
  position: 'relative',
  zIndex: 2
});

const FlowCard = styled(Paper)(({ theme }) => ({
  position: 'relative',
  padding: theme.spacing(5),
  background: '#fff',
  borderRadius: '24px',
  boxShadow: '0 25px 60px rgba(0,0,0,0.1)',
  maxWidth: '720px',
  margin: 'auto',
  marginTop: theme.spacing(6),
  animation: 'fadeInUp 0.6s ease-out'
}));

const GradientButton = styled(Button)({
  background: 'linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)',
  color: '#fff',
  fontWeight: 'bold',
  padding: '12px 28px',
  borderRadius: '12px',
  fontSize: '1rem',
  boxShadow: '0 8px 20px rgba(98, 0, 170, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    background: 'linear-gradient(45deg, #5a0099 30%, #7e1e9e 90%)',
    boxShadow: '0 12px 24px rgba(98, 0, 170, 0.35)'
  }
});

export default function UserReportPage() {
  const { activeTab, setActiveTab } = useAuth();
  const [type, setType] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [email, setEmail] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [userOrders, setUserOrders] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/orders/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data && res.data.length > 0) {
          setUserOrders(res.data);
          setEmail(res.data[0].sitePrimaryEmail);
        }
      } catch (err) {
        console.error('Failed to fetch user orders:', err);
      }
    };

    fetchUserOrders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!type || !referenceNumber || !email || !date || !description) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post('/api/user-reports',
        {
          issueType: type,
          referenceNumber,
          email,
          date,
          explanation: description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccess(true);
      setType('');
      setReferenceNumber('');
      setDate('');
      setDescription('');
    } catch (err) {
      setError('Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContainer>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <ContentContainer>
        <TopBar>
          <Toolbar>
            <Typography variant="h5" fontWeight="bold">
              BT IoT Router Services — Report an Issue
            </Typography>
          </Toolbar>
        </TopBar>

        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3 }}>
          <Container maxWidth="md">
            <Fade in timeout={500}>
              <FlowCard>
                {userOrders.length === 0 ? (
                  <Typography variant="h6" align="center" color="text.secondary">
                    You need to submit a router request before reporting an issue.
                  </Typography>
                ) : (
                  <>
                    <Typography variant="h4" fontWeight="bold" mb={2}>
                      Report an Issue with Your Router
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={3}>
                      Fill in the details below to report a problem related to your recent router request.
                    </Typography>
                    {error && <Typography color="error" mb={2}>{error}</Typography>}
                    {success && <Typography sx={{ color: 'green', mb: 2 }}>Report submitted successfully!</Typography>}
                    <form onSubmit={handleSubmit}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Issue Type</InputLabel>
                        <Select
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          required
                        >
                          <MenuItem value=""><em>Select an issue type</em></MenuItem>
                          {issueTypes.map((option) => (
                            <MenuItem key={option} value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth margin="normal">
                        <InputLabel>Reference Number</InputLabel>
                        <Select
                          value={referenceNumber}
                          onChange={(e) => setReferenceNumber(e.target.value)}
                          required
                        >
                          <MenuItem value=""><em>Select a reference</em></MenuItem>
                          {userOrders.map(order => (
                            <MenuItem key={order.referenceNumber} value={order.referenceNumber}>
                              {order.referenceNumber}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        margin="normal"
                        type="email"
                        label="Your Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        type="date"
                        label="Date of Issue"
                        InputLabelProps={{ shrink: true }}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Describe the issue in detail"
                        multiline
                        rows={6}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                      <Box mt={4} display="flex" justifyContent="flex-end">
                        <GradientButton type="submit" disabled={loading}>
                          {loading ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Submit Report'}
                        </GradientButton>
                      </Box>
                    </form>
                  </>
                )}
              </FlowCard>
            </Fade>
          </Container>
        </Box>

        <Snackbar
          open={!!error || success}
          autoHideDuration={4000}
          onClose={() => { setError(''); setSuccess(false); }}
          message={error || (success && 'Report submitted successfully!')}
        />
      </ContentContainer>
    </MainContainer>
  );
}
