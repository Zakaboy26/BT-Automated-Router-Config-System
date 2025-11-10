import React, { useState } from 'react';
import {
    Typography,
    Box,
    TextField,
    Button,
    Alert,
    Container,
    Fade,
    Toolbar
} from '@mui/material';
import { styled } from "@mui/system";
import { Search as SearchIcon } from '@mui/icons-material';
import {
    MainContainer,
    FeatureCard,
    AnimatedComponent,
    ScrollableContainer,
    HeaderBar
} from '../../styles/HomeStyles';
import Sidebar from '../Navigation/Sidebar';
import useAuth from "../Auth/useAuth";

// Background Decorations
const BackgroundDecoration = styled("div")({
    position: "absolute",
    borderRadius: "50%",
    zIndex: 0,
    opacity: 0.2
});

const TopDecoration = styled(BackgroundDecoration)({
    top: "-100px",
    left: "-100px",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, #6200aa, transparent)"
});

const BottomDecoration = styled(BackgroundDecoration)({
    bottom: "-100px",
    right: "-100px",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, #8e24aa, transparent)"
});

const Footer = styled(Box)({
    textAlign: "center",
    color: "#888",
    padding: "24px",
    position: "relative",
    zIndex: 1
});

const TrackOrderSearch = () => {
    const { userRole, loading, navigate, activeTab, setActiveTab } = useAuth();
    const [referenceNumber, setReferenceNumber] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!referenceNumber.trim()) {
            setError('Please enter a reference number');
            return;
        }
        navigate(`/order-tracking/${referenceNumber.trim()}`);
    };

    return (
        <MainContainer>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />

            <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <HeaderBar position="static">
                    <Toolbar>
                        <Typography variant="h5" sx={{
                            color: 'white',
                            fontWeight: 500,
                            letterSpacing: '0.5px',
                            flexGrow: 1
                        }}>
                            Track Your Order
                        </Typography>
                    </Toolbar>
                </HeaderBar>

                <ScrollableContainer>
                    <Container maxWidth="lg" sx={{ position: 'relative', py: 4 }}>
                        <TopDecoration />
                        <BottomDecoration />
                        <Fade in={true} timeout={600}>
                            <Box>
                                <AnimatedComponent>
                                    <FeatureCard active={true} sx={{
                                        width: '100%',
                                        maxWidth: '800px',
                                        margin: '40px auto',
                                        p: 6,
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        <Typography variant="h3" gutterBottom sx={{
                                            mb: 4,
                                            fontWeight: 600,
                                            background: 'linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}>
                                            Track Your Router Order
                                        </Typography>

                                        <Typography variant="h6" sx={{ mb: 5, color: 'text.secondary' }}>
                                            Enter your order reference number below to check its current status and progress
                                        </Typography>

                                        <form onSubmit={handleSubmit}>
                                            <TextField
                                                fullWidth
                                                variant="outlined"
                                                placeholder="e.g., BT-12345678"
                                                value={referenceNumber}
                                                onChange={(e) => setReferenceNumber(e.target.value)}
                                                error={!!error}
                                                helperText={error}
                                                sx={{
                                                    mb: 4,
                                                    '& .MuiOutlinedInput-root': {
                                                        fontSize: '1.2rem',
                                                        height: '60px'
                                                    }
                                                }}
                                            />

                                            <Button
                                                type="submit"
                                                variant="contained"
                                                size="large"
                                                startIcon={<SearchIcon />}
                                                fullWidth
                                                sx={{
                                                    bgcolor: '#6200aa',
                                                    height: '56px',
                                                    fontSize: '1.1rem',
                                                    '&:hover': {
                                                        bgcolor: '#4b0082'
                                                    }
                                                }}
                                            >
                                                Track Order
                                            </Button>
                                        </form>
                                    </FeatureCard>
                                </AnimatedComponent>

                                <Footer>
                                    <Typography variant="caption">
                                        © 2025 BT IoT Router Services. All rights reserved.
                                    </Typography>
                                </Footer>
                            </Box>
                        </Fade>
                    </Container>
                </ScrollableContainer>
            </Box>
        </MainContainer>
    );
};

export default TrackOrderSearch;