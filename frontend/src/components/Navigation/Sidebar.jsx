import React, { useState } from "react";
import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Drawer,
    IconButton,
    CircularProgress
} from "@mui/material";
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Router as RouterIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    History as HistoryIcon,
    Support as SupportIcon,
    ExitToApp as LogoutIcon,
    LocalShipping as LocalShippingIcon,
    Help as HelpIcon, Settings
} from "@mui/icons-material";
import { StyledDrawer, NavButton } from "../../styles/SidebarStyles";
import btLogo from "../../assets/BT_logo_white.png";
import useAuth from "../Auth/useAuth";
import { useTheme, useMediaQuery } from "@mui/material";

const Sidebar = ({ activeTab, setActiveTab }) => {
    const { loading, navigate, isAllowed, handleLogout } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const navItems = [
        {
            id: 'dashboard',
            icon: DashboardIcon,
            label: 'Dashboard',
            allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
            path: '/home'
        },
        {
            id: 'routers',
            icon: RouterIcon,
            label: 'Routers',
            allowedRoles: ['ADMIN'],
            path: '/routers'
        },
        {
            id: 'customers',
            icon: PeopleIcon,
            label: 'Customers',
            allowedRoles: ['ADMIN'],
            path: '/customers'
        },
        {
            id: 'users',
            icon: PeopleIcon,
            label: 'Users',
            allowedRoles: ['ADMIN'],
            path: '/users'
        },
        {
            id: 'requests',
            icon: AssignmentIcon,
            label: 'Router Requests',
            allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
            path: '/router-requests'
        },
        {
            id: 'history',
            icon: HistoryIcon,
            label: 'Order History',
            allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
            path: '/order-history'
        },
        {
            id: 'contact',
            icon: SupportIcon,
            label: 'Contact Us',
            allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
            path: '/contact'
        },
        {
            id: 'track-order',
            icon: LocalShippingIcon,
            label: 'Track Order',
            allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
            path: '/track-order'
        },
        {
            id: 'help',
            icon: HelpIcon,
            label: 'Help Guide',
            allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
            path: '/help'
        },
        {
            id: 'settings',
            icon: Settings,
            label: 'Settings',
            allowedRoles: ['ADMIN', 'SUPPORT_AGENT', 'USER'],
            path: '/settings'
        }
    ];

    const logoutItem = {
        id: 'logout',
        icon: LogoutIcon,
        label: 'Logout',
    };

    const handleNavigation = (path, id) => {
        setActiveTab(id);
        navigate(path);
        if (isMobile) setMobileOpen(false);
    };

    const toggleDrawer = () => setMobileOpen(!mobileOpen);

    const drawerContent = (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={btLogo} alt="BT Logo" style={{ width: "80px", cursor: "pointer" }} onClick={() => navigate("/home")} />
            </Box>
            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1 }}>
                    <CircularProgress sx={{ color: "white" }} />
                </Box>
            ) : (
                <List>
                    {navItems
                        .filter((item) => isAllowed(item.allowedRoles))
                        .map((item) => (
                            <ListItem key={item.id} disablePadding>
                                <NavButton
                                    active={activeTab === item.id}
                                    onClick={() => handleNavigation(item.path, item.id)}
                                    sx={{ width: "100%" }}
                                >
                                    <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                                        <item.icon />
                                    </ListItemIcon>
                                    <ListItemText primary={item.label} />
                                </NavButton>
                            </ListItem>
                        ))}
                </List>
            )}

            <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />

            <NavButton onClick={handleLogout} sx={{ m: 2 }}>
                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                    {<logoutItem.icon />}
                </ListItemIcon>
                <ListItemText primary={logoutItem.label} />
            </NavButton>
        </Box>
    );

    return (
        <>
            {isMobile && (
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={toggleDrawer}
                    sx={{
                        position: "fixed",
                        top: "10px",
                        left: "10px",
                        ml: "2px",
                        mr: "2px",
                        zIndex: 1301,
                        bgcolor: "#6200aa",
                        color: "white",
                        p: 1.2,
                        borderRadius: "8px",
                        "&:hover": {
                            bgcolor: "#4b0082"
                        }
                    }}
                >
                    <MenuIcon />
                </IconButton>
            )}

            <StyledDrawer variant="permanent" sx={{ display: { xs: "none", sm: "block" } }}>
                {drawerContent}
            </StyledDrawer>

            <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={toggleDrawer}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: "block", sm: "none" },
                    "& .MuiDrawer-paper": {
                        width: 280,
                        bgcolor: "#6200aa",
                    },
                }}
            >
                {drawerContent}
            </Drawer>
        </>
    );
};

export default Sidebar;