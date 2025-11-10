import React, { useCallback, useEffect, useState } from "react";
import { fetchOrderDetails, fetchOrderHistory, reorderRouter } from "../services/orderService";
import RouterDetailsModal from "../components/OrderHistory/RouterDetailsModal";
import {
    Table,
    TableBody,
    TableContainer,
    TableRow,
    Paper,
    CircularProgress,
    Box,
    Snackbar,
    Alert,
} from "@mui/material";
import {
    Title,
    Description,
    TableWrapper,
    StyledTableHead,
    TableCellStyled,
    TableRowStyled,
    ActionButton,
} from "../styles/OrderHistoryStyles";
import { styled } from "@mui/system";
import Sidebar from "../components/Navigation/Sidebar";
import useAuth from "../components/Auth/useAuth";
import OrderExport from "../components/OrderHistory/OrderExport";
import { Link } from "react-router-dom";

const MainContainer = styled(Box)({
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #f7f3fc 0%, #ece6f4 100%)",
});

const ContentArea = styled(Box)({
    flexGrow: 1,
    display: "flex",
    padding: "40px",
    gap: "32px", // Adds spacing between columns
});

const MainContent = styled(Box)({
    flex: 3, // 75% of available space
    minWidth: 0, // Fixes flex item overflow
    paddingRight: "24px",
    borderRight: "1px solid #e0e0e0",
});

const ExportAside = styled(Box)({
    flex: 1, // 25% of available space
    minWidth: "300px",
    paddingLeft: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
});

const StyledPaper = styled(Paper)({
    width: "100%",
    maxWidth: "900px",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#fff",
});

const StyledActionButton = styled(ActionButton)({
    background: "linear-gradient(135deg, #5f00a7, #9b42c3)",
    color: "#fff",
    fontWeight: "bold",
    "&:hover": {
        background: "linear-gradient(135deg, #4b0082, #8a2be2)",
    },
});

const OrderHistoryPage = () => {
    const { userRole, activeTab, setActiveTab, loading, setLoading } = useAuth();

    const [orders, setOrders] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const loadOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchOrderHistory();
            setOrders(data);
        } catch (error) {
            console.error("Error loading orders:", error);
        } finally {
            setLoading(false);
        }
    }, [setLoading]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleReorder = async (orderId) => {
        try {
            const response = await reorderRouter(orderId);
            if (response.success) {
                showSnackbar("Order successfully placed!", "success");
                await loadOrders();
            } else {
                showSnackbar(response.message || "Failed to place order. Please try again.", "error");
            }
        } catch {
            showSnackbar("Failed to place order. Please try again.", "error");
        }
    };

    const handleViewDetails = async (orderId) => {
        try {
            const order = await fetchOrderDetails(orderId);
            if (order) {
                setSelectedOrder(order);
                setModalOpen(true);
            } else {
                showSnackbar("Order details not found.", "error");
            }
        } catch {
            showSnackbar("Failed to load order details.", "error");
        }
    };

    return (
        <MainContainer>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />

            <ContentArea>
                <MainContent>
                    <StyledPaper elevation={3}>
                        <Title>Order History</Title>
                        <Description>
                            View your previous orders or reorder your most frequently purchased items below.
                        </Description>

                        {loading ? (
                            <CircularProgress />
                        ) : orders.length === 0 ? (
                            <Description>No orders found.</Description>
                        ) : (
                            <TableWrapper>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <StyledTableHead>
                                            <TableRow>
                                                <TableCellStyled>REFERENCE</TableCellStyled>
                                                <TableCellStyled>CUSTOMER</TableCellStyled>
                                                <TableCellStyled>SITE</TableCellStyled>
                                                <TableCellStyled>ROUTER MODEL</TableCellStyled>
                                                <TableCellStyled>PRIORITY</TableCellStyled>
                                                <TableCellStyled>STATUS</TableCellStyled>
                                                <TableCellStyled>ACTIONS</TableCellStyled>
                                            </TableRow>
                                        </StyledTableHead>
                                        <TableBody>
                                            {orders.map((order) => (
                                                <TableRowStyled key={order.routerOrderID}>
                                                    <TableCellStyled>
                                                        <Link to={`/order-tracking/${order.referenceNumber}`} style={{ color: "#6200aa", textDecoration: "underline", fontWeight: 500 }}>
                                                            {order.referenceNumber}
                                                        </Link>
                                                    </TableCellStyled>

                                                    <TableCellStyled>{order.customer?.customerName || "N/A"}</TableCellStyled>
                                                    <TableCellStyled>{order.siteName}</TableCellStyled>
                                                    <TableCellStyled>{order.router?.routerName}</TableCellStyled>
                                                    <TableCellStyled>{order.priorityLevel}</TableCellStyled>
                                                    <TableCellStyled>{order.status || "Processing"}</TableCellStyled>
                                                    <TableCellStyled>
                                                        <Box display="flex" flexDirection="column" gap={1}>
                                                            <StyledActionButton onClick={() => handleViewDetails(order.routerOrderID)}>
                                                                View Details
                                                            </StyledActionButton>
                                                            <StyledActionButton onClick={() => handleReorder(order.routerOrderID)}>
                                                                Re-order Router
                                                            </StyledActionButton>
                                                        </Box>
                                                    </TableCellStyled>
                                                </TableRowStyled>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </TableWrapper>
                        )}

                        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                            <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                                {snackbar.message}
                            </Alert>
                        </Snackbar>

                        <RouterDetailsModal open={modalOpen} onClose={() => setModalOpen(false)} order={selectedOrder} />
                    </StyledPaper>
                </MainContent>

                <ExportAside>
                    <StyledPaper elevation={3} sx={{ height: "fit-content" }}>
                        <OrderExport />
                    </StyledPaper>
                </ExportAside>
            </ContentArea>
        </MainContainer>
    );
};

export default OrderHistoryPage;
