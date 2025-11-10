import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Typography,
  Box,
  Container,
  CircularProgress,
  Fade,
  Button,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Simulated function to get the logged-in user's email
const getUserEmail = () => {
  return localStorage.getItem("userEmail") || "unknown@domain.com";
};

// Styled Components
const TopBar = styled(Box)({
  width: "100%",
  background: "linear-gradient(135deg, #5f00a7, #9b42c3)",
  color: "#fff",
  padding: "20px",
  textAlign: "center",
  fontWeight: "bold",
  boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
});

const StyledContainer = styled(Box)({
  display: "flex",
  minHeight: "100vh",
  background: "linear-gradient(to bottom right, #f7f3fc 0%, #ece6f4 100%)",
  paddingTop: "60px",
  paddingBottom: "20px",
  justifyContent: "center",
});

const FlowCard = styled(Box)({
  background: "#ffffff",
  borderRadius: "16px",
  padding: "30px",
  boxShadow: "0 15px 40px rgba(0,0,0,0.2)",
  width: "90%",
  maxWidth: "1100px",
  transition: "all 0.3s ease",
});

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold",
  fontSize: "16px",
  padding: "12px",
  backgroundColor: "#f3f1fc",
});

const StyledTableRow = styled(TableRow)({
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "#f8f5ff",
    cursor: "pointer",
  },
});

const StatusSelect = styled(Select)({
  width: "100%",
  "& .MuiSelect-select": {
    padding: "10px",
  },
});

// Main Component
const RouterRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loggedInUserEmail = getUserEmail();

  useEffect(() => {
    setLoading(true);
    axios.get("/api/orders")
        .then((response) => {
          const updatedRequests = response.data.map((req) => ({
            ...req,
            requesterName: req.sitePrimaryEmail || "Unknown",
          }));
          setRequests(updatedRequests);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching requests:", error);
          setLoading(false);
        });
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/orders/${id}/status`, { status: newStatus });
      setRequests((prev) =>
          prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
      );
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  return (
      <>
        <TopBar>
          <Typography variant="h5">📡 Admin - Router Request Management</Typography>
        </TopBar>
        <StyledContainer>
          <Container maxWidth="lg">
            <Fade in={true} timeout={600}>
              <FlowCard>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h4" fontWeight="bold">
                    All Router Requests
                  </Typography>
                  <Button
                      variant="contained"
                      onClick={() => navigate("/home")}
                      style={{
                        background: "linear-gradient(45deg, #ff4081, #ff80ab)",
                        color: "#fff",
                        padding: "10px 20px",
                        fontSize: "14px",
                      }}
                  >
                    ⬅ Back to Dashboard
                  </Button>
                </Box>

                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
                      <CircularProgress size={50} />
                    </Box>
                ) : requests.length === 0 ? (
                    <Typography variant="h6" textAlign="center" color="textSecondary">
                      🚀 No router requests found. Check back later!
                    </Typography>
                ) : (
                    <Paper sx={{ overflowX: "auto", mt: 2, borderRadius: 2, boxShadow: "0px 10px 25px rgba(0,0,0,0.1)" }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <StyledTableCell align="center">Reference #</StyledTableCell>
                            <StyledTableCell align="center">Requester (Email)</StyledTableCell>
                            <StyledTableCell align="center">Request Date</StyledTableCell>
                            <StyledTableCell align="center">Priority</StyledTableCell>
                            <StyledTableCell align="center">Status</StyledTableCell>
                            <StyledTableCell align="center">Update</StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {requests.map((req) => (
                              <StyledTableRow key={req.id}>
                                <TableCell align="center">
                                  <Tooltip title="Unique Tracking Reference">
                                    <Typography variant="body1" fontWeight="bold" color="primary">
                                      {req.trackingReference || "N/A"}
                                    </Typography>
                                  </Tooltip>
                                </TableCell>
                                <TableCell align="center">{req.requesterName}</TableCell>
                                <TableCell align="center">{new Date(req.orderDate).toLocaleDateString()}</TableCell>
                                <TableCell align="center">
                                  <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color={
                                        req.priorityLevel === "Critical"
                                            ? "error"
                                            : req.priorityLevel === "High"
                                                ? "warning"
                                                : "textPrimary"
                                      }
                                  >
                                    {req.priorityLevel}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Typography
                                      variant="body1"
                                      fontWeight="bold"
                                      color={
                                        req.status === "PENDING"
                                            ? "warning"
                                            : req.status === "CONFIRMED"
                                                ? "success"
                                                : req.status === "IN_PRODUCTION"
                                                    ? "info"
                                                    : "error"
                                      }
                                  >
                                    {req.status}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <StatusSelect
                                      value={req.status}
                                      onChange={(e) => updateStatus(req.id, e.target.value)}
                                  >
                                    <MenuItem value="PENDING">Pending</MenuItem>
                                    <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                                    <MenuItem value="IN_PRODUCTION">In Production</MenuItem>
                                    <MenuItem value="QUALITY_CHECK">Quality Check</MenuItem>
                                    <MenuItem value="READY_FOR_SHIPPING">Ready for Shipping</MenuItem>
                                    <MenuItem value="IN_TRANSIT">In Transit</MenuItem>
                                    <MenuItem value="DELIVERED">Delivered</MenuItem>
                                    <MenuItem value="CANCELLED">Cancelled</MenuItem>
                                  </StatusSelect>
                                </TableCell>
                              </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Paper>
                )}
              </FlowCard>
            </Fade>
          </Container>
        </StyledContainer>
      </>
  );
};

export default RouterRequestManagement;
