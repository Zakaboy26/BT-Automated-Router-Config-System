import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import {
    TextField,
    Button,
    Typography,
    Link,
    Alert,
} from '@mui/material';
import { AuthContainer, AuthCard, Logo } from '../../styles/AuthStyles';
import btLogo from '../../assets/BT_logo_purple.png';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsSubmitting(true);

        if (!email) {
            setError('Email is required');
            setIsSubmitting(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setSuccess('Password reset link has been sent to your email');
                setTimeout(() => navigate('/login'), 3000);
            } else {
                const text = await response.text();
                setError(text || 'User not found with this email');
            }
        } catch (error) {
            setError('Server is not responding. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthContainer>
            <Logo src={btLogo} alt="BT Logo" />
            <AuthCard elevation={3}>
                <Typography variant="h5" gutterBottom>
                    Reset Password
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 3, textAlign: 'center' }}>
                    Enter your email address and we'll send you a link to reset your password.
                </Typography>
                <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!error}
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {success}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            mt: 3,
                            mb: 2,
                            bgcolor: '#6200aa',
                            '&:hover': {
                                bgcolor: '#4a0080'
                            }
                        }}
                    >
                        {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                    <Typography align="center">
                        <Link
                            component="button"
                            variant="body2"
                            onClick={() => navigate('/login')}
                            sx={{ color: '#6200aa' }}
                        >
                            Back to Login
                        </Link>
                    </Typography>
                </form>
            </AuthCard>
        </AuthContainer>
    );
};

export default ForgotPassword;