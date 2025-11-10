import { useEffect, useState } from "react";
import ChangePasswordModal from "../components/UserSettings/ChangePasswordModal";
import Sidebar from "../components/Navigation/Sidebar";
import {
    Container,
    Typography,
    TextField,
    Button,
    Select,
    MenuItem,
    Paper,
    Divider,
    FormControlLabel,
    Checkbox,
    Switch,
    Snackbar,
    Alert,
    Box,
} from "@mui/material";
import Grid2 from "@mui/material/Grid2";
import { styled } from "@mui/system";

const SettingsContainer = styled(Paper)(({ theme }) => ({
    maxWidth: "800px",
    margin: "auto",
    padding: "30px",
    marginTop: "40px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
}));

const SectionTitle = styled(Typography)({
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px",
});

const PageWrapper = styled("div")({
    display: "flex",
});

//initial commit - testing for branch retry-user-settings1

const UserSettingsPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        businessType: "",
        vatNumber: "",
        billingAddress: "",
        twoFactorAuth: false,
        orderUpdates: false,
        billingNotifications: false,
        marketingEmails: false,
    });

    const [originalData, setOriginalData] = useState({});
    const [isChanged, setIsChanged] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    // Sidebar state
    const [activeTab, setActiveTab] = useState("Settings");

    useEffect(() => {
        fetch("/api/user/settings", {
            credentials: "include",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setFormData(data);
                setOriginalData(data);
            })
            .catch((err) => console.error("Error fetching user settings:", err));
    }, []);

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
        setIsChanged(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("/api/user/settings", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            credentials: "include",
            body: JSON.stringify(formData),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Update failed");
                return res.json();
            })
            .then(() => {
                setSuccessMessage(true);
                setOriginalData(formData);
                setIsChanged(false);
            })
            .catch((err) => console.error("Error updating settings:", err));
    };

    return (
        <PageWrapper>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

            <Container>
                <SettingsContainer>
                    <Typography variant="h5" sx={{ fontWeight: "bold", marginBottom: "10px" }}>
                        SETTINGS
                    </Typography>
                    <Typography variant="body2" sx={{ marginBottom: "20px" }}>
                        Manage your account, preferences, and security settings.
                    </Typography>

                    <Divider sx={{ marginBottom: "20px" }} />

                    <form onSubmit={handleSubmit}>
                        <SectionTitle>ACCOUNT SETTINGS</SectionTitle>
                        <Grid2 container spacing={2}>
                            <Grid2 xs={12} sm={6}>
                                <TextField label="First Name" fullWidth margin="normal" name="firstName" value={formData.firstName} onChange={handleChange} />
                            </Grid2>
                            <Grid2 xs={12} sm={6}>
                                <TextField label="Last Name" fullWidth margin="normal" name="lastName" value={formData.lastName} onChange={handleChange} />
                            </Grid2>
                        </Grid2>

                        <TextField label="Email Address" fullWidth margin="normal" name="email" value={formData.email} disabled />
                        <TextField label="Phone Number" fullWidth margin="normal" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />

                        <Divider sx={{ margin: "20px 0" }} />

                        <SectionTitle>BUSINESS & BILLING</SectionTitle>
                        <Select fullWidth displayEmpty name="businessType" value={formData.businessType} onChange={handleChange}>
                            <MenuItem value="">Select Business Type</MenuItem>
                            <MenuItem value="Small Business">Small Business</MenuItem>
                            <MenuItem value="Enterprise">Enterprise</MenuItem>
                            <MenuItem value="Individual">Individual</MenuItem>
                        </Select>
                        <TextField label="VAT Number" fullWidth margin="normal" name="vatNumber" value={formData.vatNumber} onChange={handleChange} />
                        <TextField label="Billing Address" fullWidth margin="normal" name="billingAddress" value={formData.billingAddress} onChange={handleChange} />

                        <Divider sx={{ margin: "20px 0" }} />

                        <SectionTitle>SECURITY & ACCESS</SectionTitle>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 2 }}>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#600d87", color: "white" }}
                                onClick={() => setShowPasswordModal(true)}
                            >
                                Change Password
                            </Button>

                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={formData.twoFactorAuth}
                                        onChange={handleChange}
                                        name="twoFactorAuth"
                                    />
                                }
                                label="Enable Two-Factor Authentication"
                            />
                        </Box>

                        <Divider sx={{ margin: "20px 0" }} />

                        <SectionTitle>NOTIFICATION PREFERENCES</SectionTitle>
                        <FormControlLabel control={<Checkbox checked={formData.orderUpdates} onChange={handleChange} name="orderUpdates" />} label="Order Updates" />
                        <FormControlLabel control={<Checkbox checked={formData.billingNotifications} onChange={handleChange} name="billingNotifications" />} label="Billing Notifications" />
                        <FormControlLabel control={<Checkbox checked={formData.marketingEmails} onChange={handleChange} name="marketingEmails" />} label="Marketing Emails" />

                        <Divider sx={{ margin: "30px 0 20px" }} />

                        {/* BUTTON ROW */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                gap: 2,
                                mt: 3,
                                flexWrap: "wrap",
                            }}
                        >
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "red", color: "white", flex: 1 }}
                                onClick={async () => {
                                    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) return;

                                    try {
                                        const res = await fetch("/api/user/settings", {
                                            method: "DELETE",
                                            headers: {
                                                Authorization: "Bearer " + localStorage.getItem("token"),
                                            },
                                            credentials: "include",
                                        });

                                        if (res.ok) {
                                            localStorage.removeItem("token");
                                            alert("Your account has been deleted.");
                                            window.location.href = "/login";
                                        } else {
                                            const errText = await res.text();
                                            alert("Failed to delete account: " + errText);
                                        }
                                    } catch (err) {
                                        console.error("Delete error:", err);
                                        alert("An error occurred while deleting your account.");
                                    }
                                }}
                            >
                                Delete Account
                            </Button>

                            <Button
                                variant="outlined"
                                sx={{ color: "#600d87", borderColor: "#600d87", flex: 1 }}
                                onClick={() => {
                                    fetch("/api/user/export", {
                                        method: "GET",
                                        headers: {
                                            Authorization: "Bearer " + localStorage.getItem("token"),
                                        },
                                        credentials: "include",
                                    })
                                        .then((res) => {
                                            if (!res.ok) throw new Error("Export failed");
                                            return res.blob();
                                        })
                                        .then((blob) => {
                                            const url = window.URL.createObjectURL(new Blob([blob]));
                                            const link = document.createElement("a");
                                            link.href = url;
                                            link.setAttribute("download", "bt_data_export.csv");
                                            document.body.appendChild(link);
                                            link.click();
                                            link.remove();
                                        })
                                        .catch((err) => console.error("Export error:", err));
                                }}
                            >
                                Request Data Export
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ backgroundColor: "#600d87", color: "white", flex: 1 }}
                                disabled={!isChanged}
                            >
                                Apply Changes
                            </Button>
                        </Box>
                    </form>
                </SettingsContainer>

                <Snackbar open={successMessage} autoHideDuration={3000} onClose={() => setSuccessMessage(false)}>
                    <Alert onClose={() => setSuccessMessage(false)} severity="success" sx={{ width: "100%" }}>
                        Changes applied successfully!
                    </Alert>
                </Snackbar>

                {/* Password Modal */}
                <ChangePasswordModal open={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
            </Container>
        </PageWrapper>
    );
};

export default UserSettingsPage;
