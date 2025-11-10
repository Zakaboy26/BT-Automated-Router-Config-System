import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const ChangePasswordModal = ({ open, onClose }) => {
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleVisibility = (field) => {
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
    };

    const handleSubmit = () => {
        const { currentPassword, newPassword, confirmPassword } = formData;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return setError("All fields are required.");
        }

        if (newPassword !== confirmPassword) {
            return setError("New passwords do not match.");
        }

        setLoading(true);
        setError("");

        fetch("/api/user/change-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            credentials: "include",
            body: JSON.stringify(formData),
        })
            .then((res) => {
                setLoading(false);
                if (!res.ok) {
                    return res.text().then((msg) => {
                        throw new Error(msg || "Password change failed.");
                    });
                }
                return res.json();
            })
            .then(() => {
                setSuccess(true);
                setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                setTimeout(() => {
                    setSuccess(false);
                    onClose();
                }, 2000);
            })
            .catch((err) => {
                setError(err.message || "Something went wrong.");
            });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>Password updated successfully!</Alert>}

                {/* Current Password */}
                <TextField
                    label="Current Password"
                    type={showPassword.current ? "text" : "password"}
                    fullWidth
                    margin="dense"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => toggleVisibility("current")} edge="end">
                                    {showPassword.current ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* New Password */}
                <TextField
                    label="New Password"
                    type={showPassword.new ? "text" : "password"}
                    fullWidth
                    margin="dense"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => toggleVisibility("new")} edge="end">
                                    {showPassword.new ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Confirm New Password */}
                <TextField
                    label="Confirm New Password"
                    type={showPassword.confirm ? "text" : "password"}
                    fullWidth
                    margin="dense"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => toggleVisibility("confirm")} edge="end">
                                    {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={20} /> : "Change Password"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangePasswordModal;
