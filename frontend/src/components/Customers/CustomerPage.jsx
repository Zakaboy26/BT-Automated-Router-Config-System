import React, { useRef, useState, useEffect } from "react";
import {
    InputLabel,
    MenuItem,
    Tooltip,
    Typography,
    Container
} from "@mui/material";
import {
    StyledSelect,
    StyledFormControl,
    StyledTextField,
    CardContainer,
    MainContainer,
    NameContainer,
    ToggleNameButton,
    ButtonContainer,
    SaveButton,
    DeleteButton,
    TopDecoration,
    BottomDecoration,
    Footer
} from "../../styles/PageStyles";
import Sidebar from "../Navigation/Sidebar";
import useAuth from "../Auth/useAuth";
import RouterPresetForm from "../RouterPresets/RouterPresetsForm";

const CustomerPage = () => {
    const { userRole, activeTab, setActiveTab } = useAuth();
    const [customers, setCustomers] = useState([]);
    const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
    const [newCustomerName, setNewCustomerName] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [routers, setRouters] = useState([]);
    const [routerPresets, setRouterPresets] = useState([]);
    const routerPresetFormRef = useRef();

    useEffect(() => {
        fetch("http://localhost:8080/api/customers")
            .then((response) => response.json())
            .then((data) => setCustomers(data))
            .catch((error) => console.error("Error fetching customers:", error));
    }, []);

    useEffect(() => {
        fetch("http://localhost:8080/api/routers")
            .then((res) => res.json())
            .then((data) => setRouters(data))
            .catch((err) => console.error("Error fetching routers:", err));
    }, []);

    useEffect(() => {
        if (selectedCustomer) {
            fetch(`http://localhost:8080/api/router-presets/customer/${selectedCustomer.customerID}`)
                .then((res) => res.json())
                .then((data) => setRouterPresets(data))
                .catch((err) => console.error("Error fetching router presets:", err));
        } else {
            setRouterPresets([]);
        }
    }, [selectedCustomer]);

    const clearForm = () => {
        setNewCustomerName("");
        setSelectedCustomer(null);
        routerPresetFormRef.current?.clearForm();
    };

    const handleCustomerChange = (event) => {
        const selectedId = parseInt(event.target.value, 10);
        const customer = customers.find((r) => r.customerID === selectedId);
        clearForm();
        setSelectedCustomer(customer || null);
    };

    const handleSave = () => {
        const customerName = isAddingNewCustomer ? newCustomerName : selectedCustomer?.customerName;
        if (!customerName?.trim()) {
            alert("Please enter a customer name before saving.");
            return;
        }

        const customerData = {
            customerID: isAddingNewCustomer ? null : selectedCustomer?.customerID,
            customerName: customerName.trim(),
        };

        fetch("http://localhost:8080/api/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customerData),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Failed to save customer.");
                return response.json();
            })
            .then((data) => {
                alert("Customer saved successfully!");
                setCustomers((prev) => {
                    const existingIndex = prev.findIndex((r) => r.customerID === data.customerID);
                    if (existingIndex !== -1) {
                        const updated = [...prev];
                        updated[existingIndex] = data;
                        return updated;
                    }
                    return [...prev, data];
                });
                setSelectedCustomer(data);
            })
            .catch((error) => {
                console.error("Error saving customer:", error);
                alert("Error saving customer.");
            });
    };

    const handleDelete = () => {
        if (!selectedCustomer?.customerID) {
            alert("Please select a customer to delete.");
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectedCustomer.customerName}?`)) {
            fetch(`http://localhost:8080/api/customers/${selectedCustomer.customerID}`, {
                method: "DELETE",
            })
                .then((response) => {
                    if (!response.ok) throw new Error("Failed to delete customer.");
                })
                .then(() => {
                    alert("Customer deleted successfully!");
                    setCustomers(prev => prev.filter(r => r.customerID !== selectedCustomer.customerID));
                    clearForm();
                })
                .catch(error => {
                    console.error("Delete error:", error);
                    alert("Error deleting customer.");
                });
        }
    };

    return (
        <MainContainer>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} />

            <Container maxWidth="md" sx={{ position: "relative", py: 4 }}>
                <TopDecoration />
                <BottomDecoration />

                <CardContainer active={true} sx={{ m: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", mb: 2 }}>
                        Customers
                    </Typography>

                    <StyledFormControl fullWidth>
                        {!isAddingNewCustomer && (
                            <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                                Customer
                            </InputLabel>
                        )}
                        <NameContainer>
                            {isAddingNewCustomer ? (
                                <StyledTextField
                                    fullWidth
                                    label="New Customer Name"
                                    value={newCustomerName}
                                    onChange={(e) => setNewCustomerName(e.target.value)}
                                    autoFocus
                                />
                            ) : (
                                <StyledSelect
                                    onChange={handleCustomerChange}
                                    value={selectedCustomer?.customerID || ""}
                                    fullWidth
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        <em>Required</em>
                                    </MenuItem>
                                    {[...customers]
                                        .sort((a, b) => a.customerName.localeCompare(b.customerName))
                                        .map((customer) => (
                                            <MenuItem key={customer.customerID} value={customer.customerID}>
                                                {customer.customerName}
                                            </MenuItem>
                                        ))}
                                </StyledSelect>
                            )}
                            <Tooltip
                                title={isAddingNewCustomer ? "Switch to find an existing customer." : "Switch to add a new customer."}
                                arrow enterDelay={250} leaveDelay={100}
                            >
                                <ToggleNameButton
                                    onClick={() => {
                                        setIsAddingNewCustomer(!isAddingNewCustomer);
                                        clearForm();
                                    }}
                                    className={isAddingNewCustomer ? "close-mode" : ""}
                                />
                            </Tooltip>
                        </NameContainer>
                    </StyledFormControl>

                    <ButtonContainer>
                        <Tooltip title="Save the new customer." arrow enterDelay={250} leaveDelay={100}>
                            <SaveButton onClick={handleSave} disabled={!isAddingNewCustomer}>
                                Save Customer
                            </SaveButton>
                        </Tooltip>
                        <Tooltip title="Delete the selected customer." arrow enterDelay={250} leaveDelay={100}>
                            <DeleteButton onClick={handleDelete} disabled={!selectedCustomer}>
                                Delete Customer
                            </DeleteButton>
                        </Tooltip>
                    </ButtonContainer>

                    <RouterPresetForm
                        ref={routerPresetFormRef}
                        customer={selectedCustomer}
                        routers={routers}
                        routerPresets={routerPresets}
                        setRouterPresets={setRouterPresets}
                    />
                </CardContainer>

                <Footer>
                    <Typography variant="caption">
                        © 2025 BT IoT Router Services. All rights reserved.
                    </Typography>
                </Footer>
            </Container>
        </MainContainer>
    );
};

export default CustomerPage;
