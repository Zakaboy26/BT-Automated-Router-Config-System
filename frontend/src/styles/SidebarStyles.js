import { styled, keyframes } from "@mui/material/styles";
import { Box, Drawer } from "@mui/material";

const borderGlow = keyframes`
    0% { box-shadow: 0 0 5px rgba(98, 0, 170, 0.2); }
    50% { box-shadow: 0 0 20px rgba(98, 0, 170, 0.4); }
    100% { box-shadow: 0 0 5px rgba(98, 0, 170, 0.2); }
`;

const gradientMove = keyframes`
    0% { background-position: 0 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0 50%; }
`;

// Sidebar Drawer Styling.
export const StyledDrawer = styled(Drawer)(({ theme }) => ({
    width: 280,
    flexShrink: 0,

    "& .MuiDrawer-paper": {
        width: 280,
        boxSizing: "border-box",
        background: "linear-gradient(90deg, #4A148C, #6200AA)",
        color: "white",
        borderRight: "none",
    },
}));

// Sidebar Button Styling.
export const NavButton = styled(Box)(({ theme, active }) => ({
    padding: theme.spacing(2),
    margin: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    transition: "all 0.3s ease",
    backgroundColor: active ? "rgba(255, 255, 255, 0.1)" : "transparent",
    color: "white",
    fontWeight: "bold",
    textDecoration: "none",

    "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        transform: "translateX(5px)",
        animation: `${borderGlow} 1.5s infinite alternate`,
    },
    "&.disabled": {
        opacity: 0.5,
        cursor: "not-allowed",

        "&:hover": {
            transform: "none",
        },
    },
}));
