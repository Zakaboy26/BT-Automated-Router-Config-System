import React, { useState } from 'react';
import {
    Typography,
    Box,
    TextField,
    Button,
    Paper,
    Grid,
    Alert,
    CircularProgress,
    IconButton,
    Tooltip,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from '@mui/material';
import {
    Email as EmailIcon,
    Chat as ChatIcon,
    Send as SendIcon,
    Phone as PhoneIcon,
    Business as BusinessIcon,
    Schedule as ScheduleIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import {
    MainContainer,
    AnimatedComponent,
    FeatureCard,
    HeaderBar,
    ScrollableContainer,
} from '../../styles/HomeStyles';
import Sidebar from '../Navigation/Sidebar';

const ContactForm = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(98, 0, 170, 0.1)',
    transition: 'all 0.3s ease',
    height: '100%',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(98, 0, 170, 0.2)',
    }
}));

const ContactCard = styled(FeatureCard)(({ theme }) => ({
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(98, 0, 170, 0.1)',
    transition: 'all 0.3s ease',
    height: '100%',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 40px rgba(98, 0, 170, 0.2)',
    }
}));

const ContactLink = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    cursor: 'pointer',
    padding: theme.spacing(1),
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.3s ease',
    '&:hover': {
        backgroundColor: 'rgba(98, 0, 170, 0.1)',
        transform: 'translateX(5px)'
    }
}));

const ContactUs = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        name: '',
        email: '',
        phone: '',
        orderReference: '',
        enquiryType: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [activeTab, setActiveTab] = useState('contact');

    const enquiryTypes = [
        { value: 'sales', label: 'Sales Enquiry' },
        { value: 'support', label: 'Technical Support' },
        { value: 'billing', label: 'Billing Enquiry' },
        { value: 'general', label: 'General Enquiry' }
    ];

    const validateForm = () => {
        const newErrors = {};
        if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.enquiryType) newErrors.enquiryType = 'Please select an enquiry type';
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to send message');

            setSuccess(true);
            setFormData({
                companyName: '',
                name: '',
                email: '',
                phone: '',
                orderReference: '',
                enquiryType: '',
                message: ''
            });
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleContactClick = (type) => {
        switch (type) {
            case 'email':
                window.location.href = 'mailto:ttgzee123@gmail.com';
                break;
            case 'teams':
                window.open('https://teams.microsoft.com/l/chat/new?attendees=abdirizakz@cardiff.ac.uk', '_blank');
                break;
            case 'phone':
                window.location.href = 'tel:+442920870000';
                break;
        }
    };

    return (
        <MainContainer>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <HeaderBar position="static">
                    <Typography variant="h5" sx={{ color: 'white', fontWeight: 500, letterSpacing: '0.5px' }}>
                        Contact Us
                    </Typography>
                </HeaderBar>

                <ScrollableContainer>
                    <Box sx={{ p: 4 }}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <AnimatedComponent>
                                    <ContactCard active={true}>
                                        <Typography variant="h4" gutterBottom sx={{
                                            fontWeight: 600,
                                            background: 'linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>
                                            What can we help you with?
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                                            We're here to help with all your questions and requests. Choose your preferred contact method below.
                                        </Typography>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                                            <Typography variant="h6" sx={{ color: '#6200aa' }}>
                                                Direct Contact
                                            </Typography>
                                            <ContactLink onClick={() => handleContactClick('email')}>
                                                <EmailIcon sx={{ color: '#6200aa' }} />
                                                <Typography variant="body1">
                                                    Email Support
                                                </Typography>
                                            </ContactLink>
                                            <ContactLink onClick={() => handleContactClick('teams')}>
                                                <ChatIcon sx={{ color: '#6200aa' }} />
                                                <Typography variant="body1">
                                                    Teams Support
                                                </Typography>
                                            </ContactLink>
                                            <ContactLink onClick={() => handleContactClick('phone')}>
                                                <PhoneIcon sx={{ color: '#6200aa' }} />
                                                <Typography variant="body1">
                                                    Phone Support
                                                </Typography>
                                            </ContactLink>
                                        </Box>

                                        <Divider sx={{ my: 3 }} />

                                        <Box sx={{ mb: 4 }}>
                                            <Typography variant="h6" gutterBottom sx={{ color: '#6200aa' }}>
                                                Support Hours
                                            </Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <ScheduleIcon sx={{ color: '#6200aa' }} />
                                                <Typography variant="body2">
                                                    Monday - Friday: 9:00 AM - 6:00 PM GMT
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </ContactCard>
                                </AnimatedComponent>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <AnimatedComponent delay={0.2}>
                                    <ContactForm component="form" onSubmit={handleSubmit}>
                                        <Typography variant="h5" gutterBottom sx={{ color: '#6200aa' }}>
                                            Send us a Message
                                        </Typography>

                                        {success && (
                                            <Alert severity="success" sx={{ mb: 2 }}>
                                                Thanks for your enquiry. We'll be in touch soon.
                                            </Alert>
                                        )}

                                        <TextField
                                            fullWidth
                                            label="Company Name"
                                            name="companyName"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            error={!!errors.companyName}
                                            helperText={errors.companyName}
                                            required
                                            InputProps={{
                                                startAdornment: <BusinessIcon sx={{ color: '#6200aa', mr: 1 }} />
                                            }}
                                        />

                                        <TextField
                                            fullWidth
                                            label="Your Name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            error={!!errors.name}
                                            helperText={errors.name}
                                            required
                                        />

                                        <TextField
                                            fullWidth
                                            label="Email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            required
                                        />

                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            error={!!errors.phone}
                                            helperText={errors.phone}
                                            required
                                        />

                                        <TextField
                                            fullWidth
                                            label="Order Reference (Optional)"
                                            name="orderReference"
                                            value={formData.orderReference}
                                            onChange={handleChange}
                                            error={!!errors.orderReference}
                                            helperText={errors.orderReference}
                                            InputLabelProps={{ shrink: true }}
                                            placeholder="Example: BT-1A2B3C4D"
                                        />

                                        <FormControl fullWidth error={!!errors.enquiryType}>
                                            <InputLabel>Enquiry Type</InputLabel>
                                            <Select
                                                name="enquiryType"
                                                value={formData.enquiryType}
                                                onChange={handleChange}
                                                label="Enquiry Type"
                                            >
                                                {enquiryTypes.map((type) => (
                                                    <MenuItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.enquiryType && (
                                                <FormHelperText>{errors.enquiryType}</FormHelperText>
                                            )}
                                        </FormControl>

                                        <TextField
                                            fullWidth
                                            label="Message"
                                            name="message"
                                            multiline
                                            rows={4}
                                            value={formData.message}
                                            onChange={handleChange}
                                            error={!!errors.message}
                                            helperText={errors.message}
                                            required
                                        />

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
                                            disabled={loading}
                                            sx={{
                                                mt: 2,
                                                bgcolor: '#6200aa',
                                                '&:hover': { bgcolor: '#4b0082' }
                                            }}
                                        >
                                            {loading ? 'Sending...' : 'Submit Enquiry'}
                                        </Button>
                                    </ContactForm>
                                </AnimatedComponent>
                            </Grid>
                        </Grid>
                    </Box>
                </ScrollableContainer>
            </Box>
        </MainContainer>
    );
};

export default ContactUs;