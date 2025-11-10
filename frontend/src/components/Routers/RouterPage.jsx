import React, {useState, useEffect, useRef} from "react";
import {
    Box,
    Container,
    FormControlLabel,
    InputLabel,
    MenuItem,
    TextField,
    Tooltip,
    Typography,
} from "@mui/material";
import {
    DeleteOutlined,
    Edit,
    EditNote,
    EditOff,
} from "@mui/icons-material";
import {
    EditButton,
    StyledSelect,
    StyledFormControl,
    StyledTextField,
    StyledSwitch,
    StyledSpinner,
    CardContainer,
    MainContainer,
    NameContainer,
    ToggleNameButton,
    StyledColumn,
    ButtonContainer,
    SaveButton,
    DeleteButton,
    TopDecoration,
    BottomDecoration,
    Footer,
    EditHintBox
} from "../../styles/PageStyles";
import Sidebar from "../Navigation/Sidebar";
import useAuth from "../Auth/useAuth";

const RouterPage = () => {
    const {userRole, activeTab, setActiveTab} = useAuth();
    const [routers, setRouters] = useState([]);
    const [isAddingNewRouter, setIsAddingNewRouter] = useState(false);
    const [newRouterName, setNewRouterName] = useState("");
    const [selectedRouter, setSelectedRouter] = useState(null);
    const [outsideConnections, setOutsideConnections] = useState([]);
    const [insideConnections, setInsideConnections] = useState([]);
    const [ethernetPorts, setEthernetPorts] = useState(null);
    const [serialPorts, setSerialPorts] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);

    // Outside Connection Type-related.
    const [outsideOptions, setOutsideOptions] = useState([]);
    const [isEditingOutside, setIsEditingOutside] = useState(false);
    const [newOutsideOption, setNewOutsideOption] = useState("");
    const [editingOutsideID, setEditingOutsideID] = useState(null);
    const [editedOutsideName, setEditedOutsideName] = useState("");
    const [loadingOutsideOptions, setLoadingOutsideOptions] = useState(true);
    const [showEditHint, setShowEditHint] = useState(false);

    // Inside Connection Type-related.
    const [insideOptions, setInsideOptions] = useState([]);
    const [loadingInsideOptions, setLoadingInsideOptions] = useState(true);

    /* Lifecycle Effects. */
    useEffect(() => {
        fetch("http://localhost:8080/api/routers")
            .then((response) => response.json())
            .then((data) => setRouters(data))
            .catch((error) => console.error("Error fetching routers:", error));
    }, []);

    // For connection type rendering.
    useEffect(() => {
        setLoadingOutsideOptions(true);
        setLoadingInsideOptions(true);

        fetch("http://localhost:8080/api/connection-types?type=OUTSIDE")
            .then(res => res.json())
            .then(data => setOutsideOptions(data))
            .catch(err => console.error("Error fetching outside connection types:", err))
            .finally(() => setLoadingOutsideOptions(false));

        fetch("http://localhost:8080/api/connection-types?type=INSIDE")
            .then(res => res.json())
            .then(data => setInsideOptions(data))
            .catch(err => console.error("Error fetching inside connection types:", err))
            .finally(() => setLoadingInsideOptions(false));
    }, []);

    // For EditHint timeout.
    useEffect(() => {
        if (showEditHint) {
            const timeout = setTimeout(() => setShowEditHint(false), 5000);
            return () => clearTimeout(timeout);
        }
    }, [showEditHint]);

    /* Form Handlers. */
    // Resets all form fields to their default (empty) values.
    const clearForm = () => {
        setSelectedRouter(null);
        setOutsideConnections([]);
        setInsideConnections([]);
        setEthernetPorts("");
        setSerialPorts("");
        setNewOutsideOption("");
    }

    // Updates the form fields when a different selection in the drop-down box is made.
    const handleRouterChange = (event) => {
        const selectedId = parseInt(event.target.value, 10);
        const router = routers.find((r) => r.routerID === selectedId);
        setSelectedRouter(router || null);

        if (router) {
            setOutsideConnections(router.outsideConnectionTypes?.split(", ") || []);
            setInsideConnections(router.insideConnectionTypes?.split(", ") || []);
            setEthernetPorts(router.ethernetPorts || "");
            setSerialPorts(router.serialPorts || "");
        } else {
            setOutsideConnections([]);
            setInsideConnections([]);
            setEthernetPorts("");
            setSerialPorts("");
        }
    };

    // Toggles connection types based on checkbox state. Triggers display of relevant fields.
    const handleSwitchChange = (type, checked, isOutside) => {
        if (isOutside) {
            setOutsideConnections((prev) =>
                checked ? [...prev, type] : prev.filter((item) => item !== type)
            );
        } else {
            setInsideConnections((prev) =>
                checked ? [...prev, type] : prev.filter((item) => item !== type)
            );
        }
    };

    /* Button Handlers. */
    // References the Edit Button for hint positioning.
    const editButtonRef = useRef(null);

    // Saves the router details to the database if the router exists; adds the new router if not.
    const handleSave = () => {
        // Check for validation errors before saving.
        const validationErrors = getValidationErrors();
        if (validationErrors.length > 0) {
            setValidationErrors(validationErrors);
            return;
        }

        const routerName = isAddingNewRouter ? newRouterName : selectedRouter?.routerName;

        if (!routerName?.trim()) {
            alert("Please enter a router name before saving.");
            return;
        }

        // Creates the routerData object with all relevant fields from the router form.
        const routerData = {
            routerID: isAddingNewRouter ? null : selectedRouter?.routerID,
            routerName: routerName.trim(),
            outsideConnectionTypes: outsideConnections,
            insideConnectionTypes: insideConnections,
            ethernetPorts: insideConnections.includes("ETHERNET") ? Number(ethernetPorts) : null,
            serialPorts: insideConnections.includes("SERIAL") ? Number(serialPorts) : null,
        };

        fetch("http://localhost:8080/api/routers", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(routerData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to save router.");
                }
                return response.json();
            })
            .then((data) => {
                alert("Router saved successfully!");
                setRouters((prev) => {
                    const existingRouterIndex = prev.findIndex((r) => r.routerID === data.routerID);
                    if (existingRouterIndex !== -1) {
                        const updatedRouters = [...prev];
                        updatedRouters[existingRouterIndex] = data;
                        return updatedRouters;
                    }
                    return [...prev, data];
                });

                setSelectedRouter(data);
            })
            .catch((error) => {
                console.error("Error saving router:", error);
                alert("Error saving router.");
            });
    };

    // Deletes a router from the database.
    const handleDelete = () => {
        if (!selectedRouter || !selectedRouter.routerID) {
            alert("Please select a router to delete.");
            return;
        }

        if (window.confirm(`Are you sure you want to delete ${selectedRouter.routerName}?`)) {
            fetch(`http://localhost:8080/api/routers/${selectedRouter.routerID}`, {
                method: "DELETE",
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to delete router.");
                    }
                })
                .then(() => {
                    alert("Router deleted successfully!");
                    // Update the list of routers in the drop-down box.
                    setRouters(prev => prev.filter(r => r.routerID !== selectedRouter.routerID));
                    clearForm();
                })
                .catch(error => {
                    console.error("Delete error:", error);
                    alert("Error deleting router.");
                });
        }
    };

    /* Validation. */
    const getValidationErrors = () => {
        const errors = [];

        // Router selected.
        if (!isAddingNewRouter && !selectedRouter)
            errors.push("Router selection is required.");
        // Router name specified.
        if (isAddingNewRouter && !newRouterName.trim())
            errors.push("New router name is required.");

        // Outside connection selected.
        if (outsideConnections.length === 0)
            errors.push("At least one outside connection must be selected.");
        // Inside connection selected.
        if (insideConnections.length === 0)
            errors.push("At least one inside connection must be selected.");

        // Maximum Ethernet ports specified.
        if (insideConnections.includes("ETHERNET")) {
            if (!ethernetPorts || isNaN(Number(ethernetPorts)))
                errors.push("You must specify the maximum number of Ethernet Ports.");
            else if (Number(ethernetPorts) <= 0)
                errors.push("Maximum number of Ethernet Ports must be greater than 0.");
        }

        // Maximum Serial ports specified.
        if (insideConnections.includes("SERIAL")) {
            if (!serialPorts || isNaN(Number(serialPorts)))
                errors.push("You must specify the maximum number of Serial Ports.");
            else if (Number(serialPorts) <= 0)
                errors.push("Maximum number of Serial Ports must be greater than 0.");
        }

        return errors;
    };

    // Validation error message styling.
    const ValidationErrorDisplay = ({ errors }) =>
        errors.length > 0 && (
            <Box sx={{ mt: 1 }}>
                {errors.map((error, i) => (
                    <Typography key={i} variant="body2" color="error">
                        • {error}
                    </Typography>
                ))}
            </Box>
        );

    return (
        <MainContainer>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole}/>

            <Container
                maxWidth="md"
                sx={{
                    position: "relative",
                    py: 4,
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                }}
            >
                <TopDecoration/>
                <BottomDecoration/>

                <CardContainer active={true} sx={{m: 3}}>
                    <Typography variant="h5" sx={{fontWeight: "bold", textAlign: "center", mb: 2}}>
                        Router Configurations
                    </Typography>

                    <StyledFormControl fullWidth sx={{mb: 2}}>
                        {!isAddingNewRouter && (
                            <InputLabel sx={{backgroundColor: "white", px: 0.5}}>
                                Select a router...
                            </InputLabel>
                        )}
                        <NameContainer>
                            {isAddingNewRouter ? (
                                <StyledTextField
                                    fullWidth
                                    label="New Router Name"
                                    value={newRouterName}
                                    onChange={(e) => setNewRouterName(e.target.value)}
                                    autoFocus
                                />
                            ) : (
                                <StyledSelect
                                    onChange={handleRouterChange}
                                    value={selectedRouter?.routerID || ""}
                                    fullWidth
                                    displayEmpty
                                    disabled={isEditingOutside}
                                >
                                    <MenuItem value="" disabled>
                                        Select a router...
                                    </MenuItem>
                                    {routers.map((router) => (
                                        <MenuItem key={router.routerID} value={router.routerID}>
                                            {router.routerName}
                                        </MenuItem>
                                    ))}
                                </StyledSelect>
                            )}

                            <Tooltip
                                title={isAddingNewRouter ? "Switch to find an existing router." : "Switch to add a new router."}
                                arrow enterDelay={250} leaveDelay={100}>
                                <ToggleNameButton
                                    onClick={() => {
                                        setIsAddingNewRouter(!isAddingNewRouter);
                                        clearForm();
                                    }}
                                    disabled={isEditingOutside}
                                    className={isAddingNewRouter ? "close-mode" : ""}
                                />
                            </Tooltip>
                        </NameContainer>
                    </StyledFormControl>

                    <Box sx={{ display: "flex", alignItems: "center", mt: 2, mb: 1, position: "relative" }}>
                        <Typography variant="h6" sx={{ mr: 1, mb: 0 }}>
                            Outside Connection Types
                        </Typography>
                        <Tooltip title="Edit outside connection types." arrow enterDelay={250} leaveDelay={100}>
                            <EditButton
                                ref={editButtonRef}
                                onClick={() => {
                                    setIsEditingOutside(prev => {
                                        const newEditingState = !prev;
                                        clearForm();
                                        if (newEditingState) {
                                            setShowEditHint(true);
                                        } else {
                                            setEditingOutsideID(null);
                                            setEditedOutsideName("");
                                        }
                                        return newEditingState;
                                    });
                                }}
                            >
                                {isEditingOutside ? <EditOff fontSize="small" /> : <EditNote fontSize="small" />}
                            </EditButton>
                        </Tooltip>
                        {showEditHint && editButtonRef.current && (
                            <EditHintBox
                                style={{
                                    position: "absolute",
                                    left: editButtonRef.current.offsetLeft + 30,
                                    zIndex: 9999
                                }}
                            >
                                <span style={{ fontSize: "1em" }}>⮜ </span>
                                Click again when done editing.
                            </EditHintBox>
                        )}
                    </Box>
                    {isEditingOutside && (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: -1, mb: 0 }}>
                            <StyledTextField
                                label="New Outside Connection Type"
                                size="small"
                                value={newOutsideOption}
                                onChange={(e) => setNewOutsideOption(e.target.value)}
                                fullWidth
                            />
                            <SaveButton
                                onClick={() => {
                                    const trimmed = newOutsideOption.trim();
                                    if (!trimmed) return;

                                    fetch("http://localhost:8080/api/connection-types", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ connectionName: trimmed, connectionType: "OUTSIDE" }),
                                    })
                                        .then((res) => {
                                            if (!res.ok) throw new Error("Failed to add connection type");
                                            return res.json();
                                        })
                                        .then((newType) => {
                                            setOutsideOptions(prev => [...prev, newType]);
                                            setNewOutsideOption("");
                                        })
                                        .catch(err => {
                                            console.error(err);
                                            alert("Error adding connection type.");
                                        });
                                }}
                                disabled={!newOutsideOption.trim()}
                                sx={{ px: 2, mb: 2 }}
                            >
                                Add
                            </SaveButton>
                        </Box>
                    )}

                    {loadingOutsideOptions ? (
                        <StyledSpinner />
                    ) : (
                        <StyledColumn>
                            {outsideOptions
                                .filter((option) => option.connectionType === "OUTSIDE")
                                .map((option) => (
                                <Box key={option.connectionID} sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                                    <FormControlLabel
                                        control={
                                            <StyledSwitch
                                                checked={outsideConnections.includes(option.connectionName)}
                                                disabled={isEditingOutside}
                                                onChange={(e) =>
                                                    handleSwitchChange(option.connectionName, e.target.checked, true)
                                                }
                                            />
                                        }
                                        label={
                                            editingOutsideID === option.connectionID ? (
                                                <StyledTextField
                                                    size="small"
                                                    value={editedOutsideName}
                                                    onChange={(e) => setEditedOutsideName(e.target.value)}
                                                    sx={{ height: 38, minWidth: 120 }}
                                                />
                                            ) : (
                                                option.connectionName
                                            )
                                        }
                                    />

                                    {isEditingOutside && (
                                        <>
                                            {editingOutsideID === option.connectionID ? (
                                                <EditButton
                                                    onClick={() => {
                                                        const trimmed = editedOutsideName.trim();
                                                        // If name unchanged, exit edit mode.
                                                        if (trimmed === option.connectionName) {
                                                            setEditingOutsideID(null);
                                                            setEditedOutsideName("");
                                                            return;
                                                        }

                                                        // Otherwise proceed with update.
                                                        if (!trimmed) return;

                                                        fetch(`http://localhost:8080/api/connection-types`, {
                                                            method: "POST",
                                                            headers: { "Content-Type": "application/json" },
                                                            body: JSON.stringify({
                                                                connectionID: option.connectionID,
                                                                connectionName: trimmed,
                                                                connectionType: "OUTSIDE"
                                                            }),
                                                        })
                                                            .then((res) => {
                                                                if (!res.ok) throw new Error("Failed to update");
                                                                return res.json();
                                                            })
                                                            .then((updated) => {
                                                                setOutsideOptions(prev =>
                                                                    prev.map((o) =>
                                                                        o.connectionID === option.connectionID ? updated : o
                                                                    )
                                                                );
                                                                setEditingOutsideID(null);
                                                                setEditedOutsideName("");
                                                            })
                                                            .catch(console.error);
                                                    }}
                                                    sx={{ height: 24, minWidth: 24 }}
                                                >
                                                    ✓
                                                </EditButton>
                                            ) : (
                                                <EditButton
                                                    onClick={() => {
                                                        setEditingOutsideID(option.connectionID);
                                                        setEditedOutsideName(option.connectionName);
                                                    }}
                                                    sx={{ height: 24, minWidth: 24 }}
                                                >
                                                    <Edit fontSize="small" />
                                                </EditButton>
                                            )}
                                            <EditButton
                                                onClick={async () => {
                                                    const confirmDelete = window.confirm(
                                                        `Are you sure you want to delete '${option.connectionName}'? This will remove it from all router configurations.`
                                                    );
                                                    if (!confirmDelete) return;

                                                    try {
                                                        const res = await fetch(`http://localhost:8080/api/connection-types/${option.connectionID}`, {
                                                            method: "DELETE",
                                                            headers: {
                                                                "Content-Type": "application/json",
                                                                "Authorization": `Bearer ${localStorage.getItem("token")}`
                                                            },
                                                        });

                                                        if (!res.ok) {
                                                            const errorText = await res.text();
                                                            throw new Error(`Failed to delete: ${res.status} - ${errorText}`);
                                                        }

                                                        setOutsideOptions(prev =>
                                                            prev.filter((o) => o.connectionID !== option.connectionID)
                                                        );
                                                    } catch (err) {
                                                        console.error("Delete error:", err);
                                                        alert(err.message || "Error deleting connection type.");
                                                    }
                                                }}
                                                sx={{ minWidth: 26 }}
                                            >
                                                <DeleteOutlined fontSize="small" />
                                            </EditButton>

                                        </>
                                    )}
                                </Box>
                                ))}
                        </StyledColumn>
                    )}

                    <Typography variant="h6" sx={{ mt: 2 }}>Inside Connection Types</Typography>
                    {loadingInsideOptions ? (
                        <StyledSpinner />
                    ) : (
                        <StyledColumn>
                        <Tooltip title={<span>Select <strong>Ethernet</strong> as the inside connection.</span>} arrow enterDelay={250} leaveDelay={100}>
                            <FormControlLabel
                                control={
                                    <StyledSwitch
                                        checked={insideConnections.includes("ETHERNET")}
                                        disabled={isEditingOutside}
                                        onChange={(e) => handleSwitchChange("ETHERNET", e.target.checked, false)}
                                    />
                                }
                                label="Ethernet"
                            />
                        </Tooltip>
                        {insideConnections.includes("ETHERNET") && (
                            <Tooltip title={<span>Enter number of Ethernet ports (0–32767)</span>} arrow enterDelay={250} leaveDelay={100}>
                                <TextField
                                    fullWidth
                                    label="Maximum Ethernet Ports"
                                    type="number"
                                    value={ethernetPorts || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "" || (Number(value) >= 0 && Number(value) <= 32767)) {
                                            setEthernetPorts(value === "" ? null : Number(value));
                                        }
                                    }}
                                    sx={{ mt: 1, mb: 2 }}
                                />
                            </Tooltip>
                        )}

                        <Tooltip title={<span>Select <strong>Serial</strong> as the inside connection.</span>} arrow enterDelay={250} leaveDelay={100}>
                            <FormControlLabel
                                control={
                                    <StyledSwitch
                                        checked={insideConnections.includes("SERIAL")}
                                        disabled={isEditingOutside}
                                        onChange={(e) => handleSwitchChange("SERIAL", e.target.checked, false)}
                                    />
                                }
                                label="Serial"
                            />
                        </Tooltip>
                        {insideConnections.includes("SERIAL") && (
                            <Tooltip title={<span>Enter number of Serial ports (0–32767)</span>} arrow enterDelay={250} leaveDelay={100}>
                                <TextField
                                    fullWidth
                                    label="Maximum Serial Ports"
                                    type="number"
                                    value={serialPorts || ""}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (value === "" || (Number(value) >= 0 && Number(value) <= 32767)) {
                                            setSerialPorts(value === "" ? null : Number(value));
                                        }
                                    }}
                                    sx={{ mt: 1, mb: 2 }}
                                />
                            </Tooltip>
                        )}
                        </StyledColumn>
                    )}

                    <ValidationErrorDisplay errors={validationErrors} />
                    <ButtonContainer>
                        <SaveButton
                            onClick={handleSave}
                            disabled={
                                isEditingOutside ||
                                loadingInsideOptions || loadingOutsideOptions ||
                                (isAddingNewRouter ? !newRouterName.trim() : !selectedRouter)}
                        >
                            Save
                        </SaveButton>
                        <DeleteButton
                            onClick={handleDelete}
                            disabled={isEditingOutside || loadingInsideOptions || loadingOutsideOptions || !selectedRouter}
                        >
                            Delete
                        </DeleteButton>
                    </ButtonContainer>
                </CardContainer>

                <Footer>
                    <Typography variant="caption">
                        © 2025 BT IoT Router Services. All rights reserved.
                    </Typography>
                </Footer>

            </Container>
        </MainContainer>
    );
}

export default RouterPage;
