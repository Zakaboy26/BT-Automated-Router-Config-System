import { styled, keyframes } from '@mui/material/styles';
import { Box, Drawer, Card, AppBar } from '@mui/material';

const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const borderGlow = keyframes`
    0% {
        box-shadow: 0 0 5px rgba(98, 0, 170, 0.2);
    }
    50% {
        box-shadow: 0 0 20px rgba(98, 0, 170, 0.4);
    }
    100% {
        box-shadow: 0 0 5px rgba(98, 0, 170, 0.2);
    }
`;

const gradientMove = keyframes`
    0% {
        background-position: 0 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0 50%;
    }
`;

export const MainContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    position: 'relative',
    overflow: 'hidden'
}));

export const ScrollableContainer = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    overflow: 'auto',
    '&::-webkit-scrollbar': {
        width: '6px',
    },
    '&::-webkit-scrollbar-track': {
        background: 'rgba(255,255,255,0.1)',
    },
    '&::-webkit-scrollbar-thumb': {
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '3px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(255,255,255,0.3)',
    }
}));

export const HeaderBar = styled(AppBar)(({ theme }) => ({
    background: "linear-gradient(90deg, #6200AA, #7c00d7)", // Same as sidebar.
    boxShadow: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    position: 'relative',
    zIndex: theme.zIndex.drawer + 1,
    '& .MuiToolbar-root': {
        minHeight: '64px',
    }
}));

export const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: 280,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
        width: 280,
        boxSizing: 'border-box',
        backgroundColor: '#6200aa',
        color: 'white',
        borderRight: 'none',
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        }
    }
}));

export const NavButton = styled(Box)(({ theme, active }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.3s ease',
    backgroundColor: active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    color: 'white',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        transform: 'translateX(5px)'
    },
    '&.disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
        '&:hover': {
            transform: 'none'
        }
    }
}));

export const FeatureCard = styled(Card)(({ theme, active }) => ({
    minHeight: '150px', // uniform card height
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: active ? 'pointer' : 'not-allowed',
    opacity: active ? 1 : 0.6,
    background: active ? 'white' : '#f5f5f5',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': active && {
        transform: 'translateY(-4px)',
        boxShadow: '0 12px 20px -10px rgba(98, 0, 170, 0.3)',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: active ? 'linear-gradient(90deg, #6200aa, #9c27b0, #6200aa)' : '#cccccc',
        backgroundSize: '200% 200%',
        animation: active ? `${gradientMove} 3s ease infinite` : 'none'
    }
}));

export const Logo = styled('img')({
    height: '40px',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    '&:hover': {
        transform: 'scale(1.05)'
    }
});

// export const AnimatedComponent = styled(Box)(({ delay = 0 }) => ({
//     animation: `${fadeIn} 0.6s ease-out ${delay}s both`
// }));


export const AnimatedComponent = styled(Box)(({ delay = 0 }) => ({
    animation: `${fadeIn} 0.6s ease-out ${delay}s both`,
    position: 'relative',
    zIndex: 1
})); // just to prevent the possibility of flickering 


export const CardIcon = styled(Box)(({ theme, active }) => ({
    width: 60,
    height: 60,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: active ? 'rgba(98, 0, 170, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    marginBottom: theme.spacing(2),
    transition: 'all 0.3s ease',
    '& svg': {
        fontSize: 30,
        color: active ? '#6200aa' : '#999'
    }
}));

export const ResponsiveGrid = styled(Box)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: theme.spacing(2), // just condensed it down
    padding: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
        gridTemplateColumns: 'repeat(2, 1fr)'
    },
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(3, 1fr)'
    }
}));

