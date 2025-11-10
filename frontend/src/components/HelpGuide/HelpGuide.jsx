import React, { useState, useRef } from 'react';
import {
    Typography,
    Box,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    IconButton,
    Slider,
    Grid,
    Divider,
    Fade,
    Container,
    Toolbar
} from '@mui/material';
import { styled } from "@mui/system";
import {
    ExpandMore as ExpandMoreIcon,
    PlayArrow as PlayArrowIcon,
    Pause as PauseIcon,
    Speed as SpeedIcon,
    Help as HelpIcon,
    Troubleshoot as TroubleshootIcon,
    VideoLibrary as VideoLibraryIcon,
    Router as RouterIcon,
    LocalShipping as LocalShippingIcon,
    Menu as MenuIcon,
    Support as SupportIcon
} from '@mui/icons-material';
import ReactPlayer from 'react-player';
import {
    MainContainer,
    AnimatedComponent,
    FeatureCard,
    HeaderBar,
    ScrollableContainer,
} from '../../styles/HomeStyles';
import Sidebar from '../Navigation/Sidebar';

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

const HelpGuide = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [expandedSection, setExpandedSection] = useState('general');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('help');
    const playerRef = useRef(null);

    const handleSpeedChange = (event, newValue) => {
        setPlaybackSpeed(newValue);
    };

    const handleAccordionChange = (section) => (event, isExpanded) => {
        setExpandedSection(isExpanded ? section : false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleSeekTo = (timeInSeconds) => {
        playerRef.current.seekTo(timeInSeconds);
        setIsPlaying(true);
    };

    const helpSections = [
        {
            id: 'general',
            title: 'General Overview',
            content: (
                <Box>
                    <Typography paragraph>
                        Learn how to navigate the BT Router Management System and understand its key features and functionalities.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography
                            component="span"
                            sx={{
                                cursor: 'pointer',
                                color: '#6200aa',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => handleSeekTo(0)}
                        >
                            0:00 - System Introduction
                        </Typography>
                        <Typography
                            component="span"
                            sx={{
                                cursor: 'pointer',
                                color: '#6200aa',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => handleSeekTo(18)}
                        >
                            0:18 - Dashboard Overview
                        </Typography>
                        <Typography
                            component="span"
                            sx={{
                                cursor: 'pointer',
                                color: '#6200aa',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => handleSeekTo(24)}
                        >
                            0:24 - Chatbot Guide
                        </Typography>
                    </Box>
                </Box>
            ),
            icon: <HelpIcon />
        },
        {
            id: 'router-requests',
            title: 'Router Requests',
            content: (
                <Box>
                    <Typography paragraph>
                        Learn how to submit and manage router requests, including creating new requests and tracking their status.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography
                            component="span"
                            sx={{
                                cursor: 'pointer',
                                color: '#6200aa',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => handleSeekTo(72)}
                        >
                            1:12 - Creating New Requests
                        </Typography>
                        <Typography
                            component="span"
                            sx={{
                                cursor: 'pointer',
                                color: '#6200aa',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => handleSeekTo(133)}
                        >
                            2:13 - Request Form Presets
                        </Typography>
                    </Box>
                </Box>
            ),
            icon: <RouterIcon />
        },
        {
            id: 'order-tracking',
            title: 'Order Tracking',
            content: (
                <Box>
                    <Typography paragraph>
                        Learn how to track orders, view order history, and manage order statuses effectively.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography
                            component="span"
                            sx={{
                                cursor: 'pointer',
                                color: '#6200aa',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => handleSeekTo(189)}
                        >
                            3:09 - Order Tracking Basics
                        </Typography>
                        <Typography
                            component="span"
                            sx={{
                                cursor: 'pointer',
                                color: '#6200aa',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => handleSeekTo(221)}
                        >
                            3:41 - Status Updates
                        </Typography>
                    </Box>
                </Box>
            ),
            icon: <LocalShippingIcon />
        },
        {
            id: 'support',
            title: 'Contact Support',
            content: (
                <Box>
                    <Typography paragraph>
                        Learn how to contact our support team for assistance with any technical difficulties or questions you may have.
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography
                            component="span"
                            sx={{
                                cursor: 'pointer',
                                color: '#6200aa',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => handleSeekTo(224)}
                        >
                            3:44 - Support Access
                        </Typography>
                    </Box>
                </Box>
            ),
            icon: <SupportIcon />
        }
    ];

    return (
        <MainContainer>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <Box component="main" sx={{ flexGrow: 1, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <HeaderBar position="static">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{
                                mr: 2,
                                display: { sm: 'none' },
                                color: 'white'
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h5" sx={{
                            color: 'white',
                            fontWeight: 500,
                            letterSpacing: '0.5px',
                            flexGrow: 1
                        }}>
                            Help Guide & Tutorials
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
                                    <FeatureCard active={true} sx={{ m: 3 }}>
                                        <Grid container spacing={3}>
                                            {/* Left Column - General Guide with Timesatmps */}
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="h3" gutterBottom sx={{
                                                    mb: 4,
                                                    fontWeight: 600,
                                                    background: 'linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}>
                                                    General Guide & Timestamps
                                                </Typography>

                                                <Box sx={{ mb: 4 }}>
                                                    {helpSections.map((section) => (
                                                        <Accordion
                                                            key={section.id}
                                                            expanded={expandedSection === section.id}
                                                            onChange={handleAccordionChange(section.id)}
                                                            sx={{
                                                                mb: 1,
                                                                '&:before': {
                                                                    display: 'none',
                                                                },
                                                                '&.MuiAccordion-root': {
                                                                    border: '1px solid rgba(98, 0, 170, 0.1)',
                                                                    borderRadius: '8px',
                                                                    '&:hover': {
                                                                        borderColor: 'rgba(98, 0, 170, 0.3)',
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <AccordionSummary
                                                                expandIcon={<ExpandMoreIcon />}
                                                                sx={{
                                                                    '& .MuiAccordionSummary-content': {
                                                                        alignItems: 'center',
                                                                    }
                                                                }}
                                                            >
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    {section.icon}
                                                                    <Typography sx={{ color: '#6200aa', fontWeight: 500 }}>
                                                                        {section.title}
                                                                    </Typography>
                                                                </Box>
                                                            </AccordionSummary>
                                                            <AccordionDetails>
                                                                {section.content}
                                                            </AccordionDetails>
                                                        </Accordion>
                                                    ))}
                                                </Box>
                                            </Grid>

                                            {/* Right Column - Video Tutorial */}
                                            <Grid item xs={12} md={6}>
                                                <Typography variant="h3" gutterBottom sx={{
                                                    mb: 4,
                                                    fontWeight: 600,
                                                    background: 'linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent'
                                                }}>
                                                    Video Tutorial
                                                </Typography>

                                                <Box sx={{ mb: 3 }}>
                                                    <ReactPlayer
                                                        ref={playerRef}
                                                        url="https://www.youtube.com/watch?v=qICYqx55yJ0"
                                                        playing={isPlaying}
                                                        controls
                                                        width="100%"
                                                        playbackRate={playbackSpeed}
                                                    />
                                                </Box>

                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                    <IconButton
                                                        onClick={() => setIsPlaying(!isPlaying)}
                                                        color="primary"
                                                        sx={{ color: '#6200aa' }}
                                                    >
                                                        {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                                                    </IconButton>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                                        <SpeedIcon sx={{ color: '#6200aa' }} />
                                                        <Slider
                                                            value={playbackSpeed}
                                                            onChange={handleSpeedChange}
                                                            min={0.5}
                                                            max={2}
                                                            step={0.1}
                                                            marks
                                                            sx={{
                                                                width: '100%',
                                                                '& .MuiSlider-thumb': {
                                                                    color: '#6200aa',
                                                                },
                                                                '& .MuiSlider-track': {
                                                                    color: '#6200aa',
                                                                },
                                                                '& .MuiSlider-mark': {
                                                                    backgroundColor: '#6200aa',
                                                                }
                                                            }}
                                                        />
                                                    </Box>
                                                </Box>

                                                <Typography variant="body2" color="text.secondary">
                                                    Adjust playback speed using the slider above. Available speeds: 0.5x to 2x
                                                </Typography>
                                            </Grid>
                                        </Grid>
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

export default HelpGuide;