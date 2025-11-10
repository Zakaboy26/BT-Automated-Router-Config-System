import { styled, keyframes } from "@mui/system";
import {
    Box,
    Button,
    ButtonGroup,
    Paper,
    Select,
    Slider,
    Switch,
    FormControl,
    TextField,
    Card,
    CircularProgress,
} from "@mui/material";

export const flash = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
`;

// Makes adjustments to existing variations of @mui/material imports.
const sharedInputStyles = {
    height: "56px",

    '& .MuiOutlinedInput-root': {
        height: "56px",
        alignItems: "center",

        '&.Mui-disabled': {
            opacity: 0.3,
        },
    },

    '& .MuiInputLabel-outlined': {
        transform: "translate(14px, 18px) scale(1)",

        '&.Mui-disabled': {
            color: "#aaa"
        }
    },

    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
        transform: "translate(14px, -6px) scale(0.75)"
    }
};

// Exports restyled variations of existing @mui/material imports.
export const StyledSelect = styled(Select)(sharedInputStyles);
export const StyledFormControl = styled(FormControl)(sharedInputStyles);
export const StyledTextField = styled(TextField)(sharedInputStyles);
export const StyledSwitch = styled(Switch)({
    '& .MuiSwitch-switchBase': {
        color: '#9c27b0 !important',
        '&.Mui-checked': {
            color: '#5f00a7 !important',
        },
        '&.Mui-disabled': {
            color: '#bdbdbd !important',
        },
    },

    '& .MuiSwitch-track': {
        backgroundColor: '#ce8ee8 !important',
    },

    '&.Mui-checked': {
        '& .MuiSwitch-track': {
            backgroundColor: '#5f00a7 !important',
        },
    },

    '&.Mui-disabled': {
        '& .MuiSwitch-track': {
            backgroundColor: '#818181 !important',
        },
        opacity: '0.4 !important',
    },
});

export const StyledSlider = styled(Slider)(({ theme }) => ({
    height: 8,
    padding: "13px 0",

    "& .MuiSlider-track": {
        height: 8,
        border: "none",
        background: "none",
    },

    "& .MuiSlider-rail": {
        height: 8,
        opacity: 1,
        background: "linear-gradient(90deg, #6200aa 0%, #c51688 100%)",
    },

    "& .MuiSlider-thumb": {
        height: 20,
        width: 20,
        background: "linear-gradient(90deg, #6200aa 0%, #c51688 100%)",
        border: "2px solid #fff",
        boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
        transition: "0.3s",
        "&:hover, &.Mui-focusVisible": {
            boxShadow: "0 0 0 8px rgba(197, 22, 136, 0.55)",
        },
        "&:active": {
            boxShadow: "0 0 0 14px rgba(197, 22, 136, 0.75)",
        },
    },

    "& .MuiSlider-mark": {
        backgroundColor: "#fff",
        height: 5,
        width: 5,
        borderRadius: "50%",
        top: "50%",
        transform: "translate(-50%, -50%)",
    },

    "& .MuiSlider-markLabel": {
        color: "rgba(0,0,0,0.87)",
        fontSize: "0.9rem",
    },
}));

export const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: theme.spacing(2),

    "& .MuiButton-root": {
        border: "none",
        padding: "6px 20px",
        fontWeight: 600,
        fontSize: "0.875rem",
        textTransform: "none",
        backgroundColor: "#f3e5f5",
        color: "#6200aa",
        transition: "all 0.3s ease-in-out",

        "&:hover": {
            backgroundColor: "#e0d4f3",
            color: "#6200aa"
        }
    },

    // Left button.
    "& .MuiButton-root:first-of-type.MuiButton-contained": {
        background: "linear-gradient(45deg, #6200aa 0%, #8e24aa 100%)",
        color: "#fff"
    },

    // Right button.
    "& .MuiButton-root:last-of-type.MuiButton-contained": {
        background: "linear-gradient(45deg, #8e24aa 0%, #6200aa 100%)", // reversed
        color: "#fff"
    }
}));

export const CardContainer = styled(Card)(({ theme, active }) => ({
    padding: theme.spacing(3),
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    background: '#fff',
    position: 'relative',
    overflow: 'hidden',

    '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: active ? 'linear-gradient(90deg, #6200aa, #9c27b0, #6200aa)' : '#cccccc',
        backgroundSize: '200% 200%',
    }
}));

export const BackgroundDecoration = styled("div")({
    position: "absolute",
    borderRadius: "50%",
    zIndex: 0,
    opacity: 0.2
});

export const TopDecoration = styled(BackgroundDecoration)({
    top: "-100px",
    left: "-100px",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, #6200aa, transparent)"
});

export const BottomDecoration = styled(BackgroundDecoration)({
    bottom: "-100px",
    right: "-100px",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, #8e24aa, transparent)"
});

export const Footer = styled(Box)({
    textAlign: "center",
    color: "#888",
    padding: "24px",
    position: "relative",
    zIndex: 1
});

export const MainContainer = styled(Box)({
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #f7f3fc 0%, #ece6f4 100%)",

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
});

export const ContentArea = styled(Box)({
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
});

export const FormWrapper = styled(Paper)({
    width: "100%",
    maxWidth: "600px",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
});

export const SectionDivider = styled(Box)({
    height: "1px",
    width: "100%",
    background: "linear-gradient(to right, #ccc, #aaa, #ccc)",
    margin: "5px 0",
    opacity: 0.7,
});

export const LabeledDivider = styled(Box)({
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    width: "100%",
    margin: "15px 0",
    color: "#666",
    fontWeight: "bold",
    fontSize: "14px",
    '&::before, &::after': {
        content: '""',
        flex: 1,
        borderBottom: "1px solid #ccc",
        margin: "0 12px",
    },
});

export const NameContainer = styled(Box)({
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%",
    transition: "all 0.3s ease",
    position: "relative"
});

export const ToggleNameButton = styled(Button)({
    color: "#5f00a7",
    minWidth: "0 !important",
    width: "56px",
    height: "56px",
    padding: "0 !important",
    position: "relative",

    "&:hover": {
        background: "none",
        opacity: 0.8
    },

    "&:active": {
        opacity: 0.6
    },

    "&.Mui-disabled": {
        opacity: 0.4,
        pointerEvents: "none",

        "&::before, &::after": {
            backgroundColor: "#888"
        }
    },

    "&::before, &::after": {
        content: '""',
        position: "absolute",
        backgroundColor: "#5f00a7",
        transition: "transform 0.2s ease"
    },
    // "+"-icon.
    "&:not(.close-mode)::before": {
        width: "24px",
        height: "6px",
        left: "calc(50% - 12px)",
        top: "calc(50% - 2px)"
    },
    "&:not(.close-mode)::after": {
        width: "6px",
        height: "24px",
        left: "calc(50% - 2px)",
        top: "calc(50% - 12px)"
    },

    // "x"-icon.
    "&.close-mode::before, &.close-mode::after": {
        width: "28px",
        height: "6px",
        left: "calc(50% - 14px)",
        top: "calc(50% - 3px)",
        backgroundColor: "#5f00a7"
    },
    "&.close-mode::before": {
        transform: "rotate(45deg)"
    },
    "&.close-mode::after": {
        transform: "rotate(-45deg)"
    }
});

export const StyledColumn = styled(Box)({
    display: "flex",
    flexDirection: "column",
});

export const ButtonContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    width: "100%",
    gap: "10px",

    // [Default] On extra-small (xs [< 600px]) screens and under, buttons stack top-to-bottom.
    flexDirection: "column",

    // For small (sm [> 600px]) screens and above, buttons stack side-by-side.
    [theme.breakpoints.up("sm")]: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
}));

export const BaseButton = styled(Button)(({ theme }) => ({
    color: "#fff",
    padding: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "16px",
    borderRadius: "6px",
    transition: "background 0.3s ease",

    // [Default] On extra-small (xs [< 600px]) screens and under, buttons stack top-to-bottom.
    minWidth: "100%",
    maxWidth: "100%",

    // For small (sm [> 600px]) screens and above, buttons stack side-by-side.
    [theme.breakpoints.up("sm")]: {
        minWidth: "49.5%",
        maxWidth: "49.5%",
    },

    "&.Mui-disabled": {
        background: "linear-gradient(135deg, #8a8a8a, #bfbfbf)", // dark grey → light grey
        color: "#e0e0e0",
        cursor: "not-allowed",
    }
}));

export const SaveButton = styled(BaseButton)({
    background: "linear-gradient(135deg, #5f00a7, #9b42c3)",
    "&:hover": { background: "linear-gradient(135deg, #4b0082, #8a2be2)" },
    "&:active": { background: "linear-gradient(135deg, #3a0063, #6b1aa1)" },
});

export const DeleteButton = styled(BaseButton)({
    background: "linear-gradient(135deg, #a00050, #de4c8d)",
    "&:hover": { background: "linear-gradient(135deg, #8a003f, #c73b70)" },
    "&:active": { background: "linear-gradient(135deg, #6d002f, #9e1c4d)" },
});

export const EditButton = styled("button")(({ theme }) => ({
    width: 24,
    height: 24,
    fontSize: "0.9rem",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#f3e5f5",
    color: "#6a1b9a",
    padding: 0,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.2s ease",

    "&:hover": {
        backgroundColor: "#e1bee7",
    }
}));

export const StyledSpinner = styled(CircularProgress)(({ theme }) => ({
    color: "#7e57c2",
    size: 32,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2),
}));

export const EditHintBox = styled(Box)(({ theme }) => ({
    padding: "6px 12px",
    backgroundColor: "#f3e5f5",
    color: "#6a1b9a",
    borderRadius: "6px",
    fontSize: "0.85rem",
    position: "absolute",
    animation: `${flash} 1.6s infinite ease-in-out`,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    pointerEvents: "none",
}));

