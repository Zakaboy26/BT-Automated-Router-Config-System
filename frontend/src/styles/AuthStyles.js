import { styled, keyframes } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

const btPurple = '#5514B4';
const btMagenta = '#ED0082';

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

const gradientBg = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
`;

export const AuthContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: '100vh',
    padding: theme.spacing(4),
    background: `linear-gradient(135deg, ${btPurple}15, ${btMagenta}15)`,
    backgroundSize: '400% 400%',
    animation: `${gradientBg} 15s ease infinite`,
    position: 'relative',

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '5px',
        background: `linear-gradient(90deg, ${btPurple}, ${btMagenta})`,
    }
}));

export const AuthCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
    animation: `${fadeIn} 0.6s ease-out`,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(85, 20, 180, 0.1)',
    border: `1px solid ${btPurple}15`,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',

    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: `0 12px 40px rgba(85, 20, 180, 0.15)`,
    },

    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(3),
        margin: theme.spacing(2)
    }
}));

export const Logo = styled('img')(({ theme }) => ({
    width: 150,
    marginBottom: 24,
    animation: `${fadeIn} 0.8s ease-out`,
    transition: 'transform 0.3s ease',

    '&:hover': {
        transform: 'scale(1.05)',
    },

    [theme.breakpoints.down('sm')]: {
        width: 120,
        marginBottom: theme.spacing(2)
    }
}));


export const GradientButton = styled('button')(({ theme }) => ({
    background: `linear-gradient(45deg, ${btPurple}, ${btMagenta})`,
    border: 'none',
    borderRadius: '25px',
    color: 'white',
    padding: '12px 24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',

    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 5px 15px rgba(237, 0, 130, 0.3)',
    },
    '&:active': {
        transform: 'translateY(0)',
    }
}));

export const InputField = styled('input')(({ theme }) => ({
    width: '100%',
    padding: '12px 16px',
    marginBottom: '16px',
    borderRadius: '8px',
    border: `1px solid ${btPurple}30`,
    transition: 'all 0.3s ease',

    '&:focus': {
        outline: 'none',
        borderColor: btMagenta,
        boxShadow: `0 0 0 3px ${btMagenta}20`,
    }
}));