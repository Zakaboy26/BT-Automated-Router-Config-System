import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TwoFAModal from './TwoFAModal';
import {
    TextField, Button, Typography, Link, Alert,
    InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AuthContainer, AuthCard, Logo } from '../../styles/AuthStyles';
import btLogo from '../../assets/BT_logo_purple.png';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    // TwoFA state
    const [showTwoFAModal, setShowTwoFAModal] = useState(false);
    const [emailForTwoFA, setEmailForTwoFA] = useState('');
    const [twoFACode, setTwoFACode] = useState('');
    const [twoFACodeError, setTwoFACodeError] = useState('');

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!formData.password) newErrors.password = 'Password is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        if (!validateForm()) return;

        setIsLoggingIn(true);
        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.status === 429) { // Too Many Requests
                const retryAfter = data.retryAfter || 15;
                setServerError(`Too many login attempts. Please try again in ${retryAfter} seconds.`);
                return;
            }

            if (res.ok && data.twoFARequired) {
                setEmailForTwoFA(formData.email);
                setShowTwoFAModal(true);
            } else if (res.ok && data.token) {
                localStorage.setItem('token', data.token);
                navigate('/home');
            } else {
                setServerError(data.message || 'Login failed');
            }
        } catch {
            setServerError('Network error');
        }
        setIsLoggingIn(false);
    };

    const handleTwoFAVerify = async () => {
        setTwoFACodeError('');
        try {
            const res = await fetch('http://localhost:8080/api/auth/verify-twofa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailForTwoFA, code: twoFACode })
            });
            const data = await res.json();

            if (res.ok && data.token) {
                localStorage.setItem('token', data.token);
                setShowTwoFAModal(false);
                navigate('/home');
            } else {
                setTwoFACodeError(data.message || 'Invalid or expired code');
            }
        } catch {
            setTwoFACodeError('Verification failed');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <AuthContainer>
            <Logo src={btLogo} alt="BT Logo" />
            <AuthCard elevation={3}>
                <Typography variant="h5">Login</Typography>
                <form onSubmit={handleLoginSubmit} style={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Email Address"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        label="Password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        required
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                    {serverError && <Alert severity="error" sx={{ mt: 2 }}>{serverError}</Alert>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, bgcolor: '#6200aa' }}
                    >
                        {isLoggingIn ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                        {/*Login*/}
                    </Button>
                    <Typography align="center">
                        <Link component="button" onClick={() => navigate('/forgot-password')} sx={{ color: '#6200aa', mr: 2 }}>
                            Forgot Password?
                        </Link>
                        Don't have an account?{' '}
                        <Link component="button" onClick={() => navigate('/register')} sx={{ color: '#6200aa' }}>
                            Register here
                        </Link>
                    </Typography>
                </form>
            </AuthCard>

            {/* TwoFA Modal */}
            <TwoFAModal
                open={showTwoFAModal}
                email={emailForTwoFA}
                code={twoFACode}
                setCode={setTwoFACode}
                codeError={twoFACodeError}
                onClose={() => setShowTwoFAModal(false)}
                onSubmit={handleTwoFAVerify}
            />
        </AuthContainer>
    );
};

export default Login;
