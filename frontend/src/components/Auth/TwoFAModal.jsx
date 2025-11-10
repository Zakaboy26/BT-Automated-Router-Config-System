import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    Button,
    Alert
} from '@mui/material';

const TwoFAModal = ({ open, onClose, onSubmit, email, code, setCode, codeError }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Two-Factor Authentication</DialogTitle>
            <DialogContent>
                <p>
                    Enter the code sent to <strong>{email}</strong>
                </p>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Verification Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                {codeError && <Alert severity="error">{codeError}</Alert>}
                <Button
                    variant="contained"
                    fullWidth
                    onClick={onSubmit}
                    sx={{ mt: 2, backgroundColor: "#600d87", color: "white" }}
                >
                    Verify
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default TwoFAModal;
