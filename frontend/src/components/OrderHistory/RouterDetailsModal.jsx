import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Divider,
    Box
} from "@mui/material";

const RouterDetailsModal = ({ open, onClose, order }) => {
    if (!order) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    <Typography><strong>Reference:</strong> {order.referenceNumber}</Typography>
                    <Typography><strong>Customer:</strong> {order.customer?.customerName || "N/A"}</Typography>
                    <Typography><strong>Router Model:</strong> {order.router?.routerName || "N/A"}</Typography>
                    <Typography><strong>Quantity:</strong> {order.numRouters}</Typography>
                    <Typography><strong>Priority:</strong> {order.priorityLevel}</Typography>
                    <Typography><strong>Status:</strong> {order.status}</Typography>
                    <Typography><strong>Order Date:</strong> {order?.orderDate ? new Date(order.orderDate).toLocaleString() : "N/A"}</Typography>

                    <Divider />

                    <Typography><strong>Primary Connection:</strong> {order.primaryOutsideConnections}</Typography>
                    <Typography><strong>Secondary Connection:</strong> {order.secondaryOutsideConnections}</Typography>
                    <Typography><strong>Inside Connections:</strong> {order.insideConnections}</Typography>
                    <Typography><strong>VLAN:</strong> {order.vlans}</Typography>
                    <Typography><strong>DHCP Enabled:</strong> {order.dhcp ? "Yes" : "No"}</Typography>

                    <Divider />

                    <Typography><strong>Site Name:</strong> {order.siteName}</Typography>
                    <Typography><strong>Contact Name:</strong> {order.siteContactName}</Typography>
                    <Typography><strong>Email:</strong> {order.sitePrimaryEmail}</Typography>
                    <Typography><strong>Phone Number:</strong> {order.sitePhoneNumber || "N/A"}</Typography>
                    <Typography><strong>Address:</strong> {order.siteAddress}, {order.sitePostcode}</Typography>

                    <Typography><strong>Additional Information:</strong> {order.additionalInformation || "None"}</Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RouterDetailsModal;
