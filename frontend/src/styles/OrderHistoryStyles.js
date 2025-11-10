import { styled } from "@mui/material/styles";
import { Box, TableContainer, TableHead, TableRow, TableCell, Button, Typography } from "@mui/material";

// Page layout styles
export const PageContainer = styled(Box)({
    padding: "2rem",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
});

// Title & description styles
export const Title = styled(Typography)({
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
});

export const Description = styled(Typography)({
    color: "#666",
    marginBottom: "2rem",
});

// Table styles
export const TableWrapper = styled(TableContainer)({
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
});

export const StyledTableHead = styled(TableHead)({
    backgroundColor: "#4A148C",
    "& th": {
        color: "white",
        fontWeight: "bold",
    }
});

export const TableRowStyled = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(even)": {
        backgroundColor: "#f9f9f9",
    },
}));

export const TableCellStyled = styled(TableCell)({
    padding: "12px 16px",
});

export const ActionButton = styled(Button)({
    color: "#4A148C",
    fontWeight: "600",
    textTransform: "none",
    marginRight: "10px",
});
