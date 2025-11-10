import React, { useState } from "react";

import {
    Button,
    CircularProgress,
    Typography,
    FormControlLabel, Checkbox
} from "@mui/material";
import { FileDownload as FileDownloadIcon} from "@mui/icons-material";
import { ScrollableContainer } from "../../styles/HomeStyles";
import {Title} from "../../styles/OrderHistoryStyles"
function OrderExport() {
    const [loading, setLoading] = useState(false);
    const [separateSheets, setSeparateSheets] = useState(false);
    const token = localStorage.getItem("token");


    const handleDownload = () => {
        setLoading(true);
        const separateSheetsToken = separateSheets.toString();
        fetch(`http://localhost:8080/api/spreadsheet/download?separateSheets=${separateSheetsToken}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to generate spreadsheet");
                }
                return response.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "orders.xlsx";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
            .catch(error => {
                console.error("Error:", error);
                alert("Error generating spreadsheet");
            })
            .finally(() => {
                setLoading(false);
            });
    };


    return (
        <ScrollableContainer sx={{ p: 3, flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Title>Download Order Spreadsheet</Title>
            <FormControlLabel
                control={<Checkbox checked={separateSheets} onChange={(e) => setSeparateSheets(e.target.checked)} />}
                label="Generate separate sheets per customer"
            />
            <Button variant="contained" color="primary" startIcon={<FileDownloadIcon />} onClick={handleDownload} disabled={loading}>
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Download Orders.xlsx"}
            </Button>
        </ScrollableContainer>
    );
}

export default OrderExport;
