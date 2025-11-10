import React, { useState, useEffect } from 'react';
import {
    Typography,
    IconButton,
    Box,
    Stepper,
    Step,
    StepLabel,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Divider,
    Alert,
    Toolbar,
    Container,
    Fade
} from '@mui/material';
import { styled } from "@mui/system";
import {
    LocalShipping,
    Assignment,
    Build,
    CheckCircle,
    Cancel,
    Settings,
    Menu as MenuIcon
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
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

const OrderTracking = () => {
    const { referenceNumber } = useParams();
    const navigate = useNavigate();
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modifyDialogOpen, setModifyDialogOpen] = useState(false);
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [modifiedQuantity, setModifiedQuantity] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [activeTab, setActiveTab] = useState('track-order');

    const steps = [
        { label: 'Order Placed', icon: Assignment },
        { label: 'Confirmed', icon: CheckCircle },
        { label: 'In Production', icon: Build },
        { label: 'Quality Check', icon: CheckCircle },
        { label: 'Ready for Shipping', icon: Settings },
        { label: 'In Transit', icon: LocalShipping },
        { label: 'Delivered', icon: CheckCircle }
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUserRole(payload.role);
            } catch (error) {
                console.error('Error decoding token:', error);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log("Fetching tracking for:", referenceNumber);
                const response = await fetch(`/api/order-tracking/${referenceNumber}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch order details');
                }
                const data = await response.json();
                setOrderDetails(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [referenceNumber]);

    const getStepIndex = (status) => {
        const statusMap = {
            'PENDING': 0,
            'CONFIRMED': 1,
            'IN_PRODUCTION': 2,
            'QUALITY_CHECK': 3,
            'READY_FOR_SHIPPING': 4,
            'IN_TRANSIT': 5,
            'DELIVERED': 6,
            'CANCELLED': -1
        };
        return statusMap[status] || 0;
    };

    const handleModifyOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/order-tracking/${referenceNumber}/modify`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    numRouters: parseInt(modifiedQuantity)
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to modify order');
            }

            const updatedOrder = await response.json();
            setOrderDetails(updatedOrder);
            setModifyDialogOpen(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleCancelOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/order-tracking/${referenceNumber}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel order');
            }

            const updatedOrder = await response.json();
            setOrderDetails(updatedOrder);
            setCancelDialogOpen(false);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress sx={{ color: '#6200aa' }} />
            </Box>
        );
    }

    return (
        <MainContainer>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />
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
                            Order Tracking
                        </Typography>
                        <Button color="inherit" onClick={() => navigate('/home')}>
                            Back to Dashboard
                        </Button>
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
                                        {error && (
                                            <Alert severity="error" sx={{ mb: 2 }}>
                                                {error}
                                            </Alert>
                                        )}

                                        <Box sx={{ mb: 4 }}>
                                            <Typography variant="h3" gutterBottom sx={{
                                                mb: 4,
                                                fontWeight: 600,
                                                background: 'linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent'
                                            }}>
                                                Order Details
                                            </Typography>
                                            <Typography variant="h6" sx={{ mb: 5, color: 'text.secondary' }}>
                                                Reference Number: {orderDetails?.referenceNumber}
                                            </Typography>
                                            {orderDetails?.status === 'CANCELLED' && (
                                                <Alert severity="warning" sx={{ mt: 2 }}>
                                                    This order has been cancelled
                                                </Alert>
                                            )}
                                        </Box>

                                        <Divider sx={{ my: 3 }} />

                                        <Box sx={{ mb: 4 }}>
                                            <Typography variant="h5" gutterBottom sx={{
                                                fontWeight: 600,
                                                background: 'linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent'
                                            }}>
                                                Order Progress
                                            </Typography>
                                            <Stepper
                                                activeStep={getStepIndex(orderDetails?.status)}
                                                alternativeLabel
                                                sx={{
                                                    mt: 3,
                                                    '& .MuiStepLabel-root .MuiStepLabel-label': {
                                                        color: 'text.secondary',
                                                    },
                                                    '& .MuiStepLabel-root .MuiStepLabel-label.Mui-active': {
                                                        color: '#6200aa',
                                                        fontWeight: 600,
                                                    },
                                                    '& .MuiStepLabel-root .MuiStepLabel-label.Mui-completed': {
                                                        color: '#6200aa',
                                                    },
                                                    '& .MuiStepIcon-root': {
                                                        color: 'grey.300',
                                                    },
                                                    '& .MuiStepIcon-root.Mui-active': {
                                                        color: '#6200aa',
                                                    },
                                                    '& .MuiStepIcon-root.Mui-completed': {
                                                        color: '#6200aa',
                                                    },
                                                    '& .MuiStepConnector-line': {
                                                        borderColor: 'grey.300',
                                                    },
                                                    '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': {
                                                        borderColor: '#6200aa',
                                                    },
                                                    '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
                                                        borderColor: '#6200aa',
                                                    }
                                                }}
                                            >
                                                {steps.map((step, index) => (
                                                    <Step key={index}>
                                                        <StepLabel StepIconComponent={step.icon}>
                                                            {step.label}
                                                        </StepLabel>
                                                    </Step>
                                                ))}
                                            </Stepper>
                                        </Box>

                                        <Divider sx={{ my: 3 }} />

                                        <Box sx={{ mb: 4 }}>
                                            <Typography variant="h5" gutterBottom sx={{
                                                fontWeight: 600,
                                                background: 'linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent'
                                            }}>
                                                Order Information
                                            </Typography>
                                            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                                                <Typography variant="body1">
                                                    Router Type: {orderDetails?.routerName}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Quantity: {orderDetails?.numRouters}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Site Name: {orderDetails?.siteName}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                startIcon={<Settings />}
                                                disabled={!orderDetails?.canModify}
                                                onClick={() => setModifyDialogOpen(true)}
                                            >
                                                Modify Order
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                startIcon={<Cancel />}
                                                disabled={!orderDetails?.canCancel}
                                                onClick={() => setCancelDialogOpen(true)}
                                            >
                                                Cancel Order
                                            </Button>
                                        </Box>
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

            <Dialog open={modifyDialogOpen} onClose={() => setModifyDialogOpen(false)}>
                <DialogTitle>Modify Order</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Quantity"
                        type="number"
                        fullWidth
                        value={modifiedQuantity}
                        onChange={(e) => setModifiedQuantity(e.target.value)}
                        InputProps={{ inputProps: { min: 1 } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModifyDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleModifyOrder} variant="contained">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                <DialogTitle>Cancel Order</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to cancel this order? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCancelDialogOpen(false)}>No, Keep Order</Button>
                    <Button onClick={handleCancelOrder} color="error" variant="contained">
                        Yes, Cancel Order
                    </Button>
                </DialogActions>
            </Dialog>
        </MainContainer>
    );
};

export default OrderTracking;