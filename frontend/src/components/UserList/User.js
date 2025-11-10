import React, { useEffect, useState } from "react";
import {
    MainContainer, ScrollableContainer, HeaderBar,
    ResponsiveGrid, FeatureCard, CardIcon
} from "../../styles/HomeStyles";
import { Toolbar, Typography, Box, IconButton, CircularProgress, Button, TextField, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import PeopleIcon from "@mui/icons-material/People";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useNavigate } from "react-router";
import Sidebar from "../Navigation/Sidebar";
import useAuth from "../Auth/useAuth";

function User({url}) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUpdateOverlay, setShowUpdateOverlay] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});
    const token = localStorage.getItem("token");
    const [activeTab, setActiveTab] = useState("")

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! Status: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching users:", err);
                setError(err.message || "An unexpected error occurred.");
                setLoading(false);
            });
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
    };

    const handleDeleteUser = () => {
        if (!selectedUser) return;
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedUser.firstName} ${selectedUser.lastName}?`);
        if (!confirmDelete) return;

        fetch(`http://localhost:8080/api/admin/users/${selectedUser.email}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) throw new Error("Failed to delete user.");
                alert(`${selectedUser.firstName} has been deleted.`);
                setSelectedUser(null);
                fetchUsers();
            })
            .catch(err => console.error("Error deleting user:", err));
    };

    const handleUpdateUser = () => {
        if (!selectedUser) return;

        // Ask for confirmation before opening overlay
        const confirmUpdate = window.confirm(`Are you sure you want to update ${selectedUser.firstName} ${selectedUser.lastName}?`);
        if (!confirmUpdate) return;

        setUpdatedUser({ ...selectedUser });
        setShowUpdateOverlay(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser(prevState => ({ ...prevState, [name]: value }));
    };

    const handleUpdateSubmit = () => {
        fetch(`http://localhost:8080/api/admin/users/${updatedUser.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updatedUser)
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to update user.");
                alert(`${updatedUser.firstName} has been updated.`);
                setShowUpdateOverlay(false);
                fetchUsers();
            })
            .catch(err => console.error("Error updating user:", err));
    };

    const handleCloseOverlay = () => {
        setShowUpdateOverlay(false);
    };

    const handleDrawerToggle = () => {
        setSelectedUser(null);
    };
    if (loading) {
        return (
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                bgcolor: "#f8f9fa"
            }}>
                <CircularProgress sx={{ color: "#6200aa" }} />
                <Typography variant="h6" sx={{ mt: 2 }}>Loading Users...</Typography>
            </Box>
        );
    }

    return (
        <MainContainer>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <Box component="main" sx={{ flexGrow: 1, height: "100vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <HeaderBar position="static">
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: "none" }, color: "white" }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h5" sx={{ color: "white", fontWeight: 500, letterSpacing: "0.5px", flexGrow: 1 }}>
                            User Management
                        </Typography>
                    </Toolbar>
                </HeaderBar>

                <ScrollableContainer sx={{ p: 3, flexGrow: 1 }}>
                    <ResponsiveGrid>
                        {users.map(user => (
                            <FeatureCard key={user.id} active onClick={() => handleSelectUser(user)} sx={{ cursor: "pointer", border: selectedUser?.id === user.id ? "2px solid #6200aa" : "none" }}>
                                <CardIcon active><PeopleIcon /></CardIcon>
                                <Typography variant="h6">{user.firstName} {user.lastName}</Typography>
                                <Typography variant="body2"><strong>Email:</strong> {user.email}</Typography>
                                <Typography variant="body2"><strong>Role:</strong> {user.role}</Typography>
                            </FeatureCard>
                        ))}
                    </ResponsiveGrid>
                </ScrollableContainer>

                {selectedUser && (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                        <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={handleUpdateUser}>Edit</Button>
                        <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteUser} sx={{ ml: 2 }}>Delete</Button>
                    </Box>
                )}
            </Box>

            {showUpdateOverlay && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: { xs: 0, sm: "240px" }, // shift right when sidebar is visible
                        width: { xs: "100vw", sm: "calc(100vw - 240px)" },
                        height: "100vh",
                        bgcolor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1300 // make sure it appears above other elements
                    }}
                >
                    <Box sx={{ bgcolor: "white", p: 3, borderRadius: "10px", width: "400px" }}>
                        <Typography variant="h6">Update User</Typography>
                        <TextField fullWidth label="First Name" name="firstName" value={updatedUser.firstName} onChange={handleInputChange} sx={{ my: 1 }} />
                        <TextField fullWidth label="Last Name" name="lastName" value={updatedUser.lastName} onChange={handleInputChange} sx={{ my: 1 }} />
                        <TextField fullWidth label="email" name="email" value={updatedUser.email} type={"email"} onChange={handleInputChange} />
                        <FormControl fullWidth sx={{ my: 1 }}>
                            <InputLabel>Role</InputLabel>
                            <Select name="role" value={updatedUser.role} variant={"filled"} onChange={handleInputChange}>
                                <MenuItem value="ADMIN">Admin</MenuItem>
                                <MenuItem value="SUPPORT_AGENT">Support Agent</MenuItem>
                                <MenuItem value="USER">User</MenuItem>
                            </Select>
                        </FormControl>
                        <Button variant="contained" onClick={handleUpdateSubmit}>Save</Button>
                        <Button variant="outlined" onClick={handleCloseOverlay} sx={{ ml: 2 }}>Cancel</Button>
                    </Box>
                </Box>
            )}
        </MainContainer>
    );
}

export default User;
