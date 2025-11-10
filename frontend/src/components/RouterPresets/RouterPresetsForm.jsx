import React, { useEffect, useState, useImperativeHandle, forwardRef } from "react";
import {
    Box,
    FormControlLabel,
    InputAdornment,
    InputLabel,
    MenuItem,
    TextField,
    Tooltip,
    Typography
} from "@mui/material";
import {
    StyledSelect,
    StyledFormControl,
    SectionDivider,
    StyledSwitch,
    ToggleNameButton,
    StyledColumn,
    ButtonContainer,
    SaveButton,
    DeleteButton,
    NameContainer
} from "../../styles/PageStyles";

const RouterPresetForm = forwardRef(({ customer, routers, routerPresets, setRouterPresets }, ref) => {
    const [isAddingNewPreset, setIsAddingNewPreset] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState(null);
    const [presetName, setPresetName] = useState("");
    const [selectedRouterName, setSelectedRouterName] = useState("");
    const [primaryOutside, setPrimaryOutside] = useState("");
    const [secondaryOutside, setSecondaryOutside] = useState("");
    const [insideConnections, setInsideConnections] = useState([]);
    const [ethernetPorts, setEthernetPorts] = useState(null);
    const [serialPorts, setSerialPorts] = useState(null);
    const [vlans, setVlans] = useState("");
    const [dhcp, setDhcp] = useState(false);
    const [additionalInformation, setAdditionalInformation] = useState("");
    const [validationErrors, setValidationErrors] = useState([]);

    /* Lifecycle Effects. */
    useEffect(() => {
        if (!customer) {
            setSelectedPreset(null);
            setIsAddingNewPreset(false);
        }
    }, [customer]);

    // Allows the parent form/page to use the listed functions.
    useImperativeHandle(ref, () => ({
        clearForm
    }));

    /* Form Handlers. */
    // Resets all form fields to their default (empty) values.
    const clearForm = () => {
        setSelectedPreset(null);
        setPresetName("");
        setSelectedRouterName("");
        setPrimaryOutside("");
        setSecondaryOutside("");
        setInsideConnections([]);
        setEthernetPorts(null);
        setSerialPorts(null);
        setVlans("");
        setDhcp(false);
        setAdditionalInformation("");
    };

    // Updates the form fields when a different selection in the drop-down box is made.
    const handlePresetChange = (e) => {
        const selectedId = parseInt(e.target.value);
        const routerPreset = routerPresets.find(p => p.routerPresetID === selectedId);
        console.log("Selected preset:", routerPreset); // <- ADD THIS
        if (routerPreset) {
            setSelectedPreset(routerPreset);
            setPresetName(routerPreset.routerPresetName);
            setSelectedRouterName(routerPreset.router.routerName);
            setPrimaryOutside(routerPreset.primaryOutsideConnections || "");
            setSecondaryOutside(routerPreset.secondaryOutsideConnections || "");
            setInsideConnections(routerPreset.insideConnections ? routerPreset.insideConnections.split(', ') : []);
            setEthernetPorts(routerPreset.numberOfEthernetPorts || null);
            setSerialPorts(routerPreset.numberOfSerialPorts || null);
            setVlans(routerPreset.vlans || "");
            setDhcp(routerPreset.dhcp || false);
            setAdditionalInformation(routerPreset.additionalInformation || "");
        }
    };

    // Toggles connection types based on checkbox state. Triggers display of relevant fields.
    const handleSwitchChange = (type, checked) => {
        setInsideConnections(prev => {
            const updated = checked ? [...prev, type] : prev.filter(item => item !== type);
            if (type === "ETHERNET" && !checked) {
                setVlans("");
                setDhcp(false);
            }
            return updated;
        });
    };

    // Handles updates to the Ethernet port field with validation.
    const handleEthernetPortChange = (e) => {
        const value = Number(e.target.value);
        if (!isNaN(value) && value >= 0 && value <= maxEthernet) {
            setEthernetPorts(value);
        } else if (e.target.value === "") {
            setEthernetPorts(null);
        }
    };

    // Handles updates to the Serial port field with validation.
    const handleSerialPortChange = (e) => {
        const value = Number(e.target.value);
        if (!isNaN(value) && value >= 0 && value <= maxSerial) {
            setSerialPorts(value);
        } else if (e.target.value === "") {
            setSerialPorts(null);
        }
    };

    // Updates router selection and auto-generates a preset name based on selected router.
    const handleRouterSelect = (e) => {
        const selectedName = e.target.value;
        setSelectedRouterName(selectedName);

        const count = routerPresets.filter(p => p.customer?.customerID === customer?.customerID).length + 1;
        setPresetName(`Preset ${count} - ${selectedName}`);
    };

    /* Button Handlers. */
    // Saves the router preset details to the database if the router preset exists; adds the new router preset if not.
    const handleSave = () => {

        // Save validation implementation.
        const errors = getValidationErrors();
        setValidationErrors(errors);
        if (errors.length > 0) return;

        // Determine combined insideConnection string
        const insideConnectionString = insideConnections.join(', ');

        // Creates the presetData object with all relevant fields from the router preset form.
        const presetData = {
            routerPresetID: isAddingNewPreset ? null : selectedPreset?.routerPresetID,
            routerPresetName: presetName,
            customer: { customerID: customer?.customerID },
            router: { routerID: routers.find(r => r.routerName === selectedRouterName)?.routerID },
            primaryOutsideConnections: primaryOutside,
            secondaryOutsideConnections: secondaryOutside,
            insideConnections: insideConnectionString,
            numberOfEthernetPorts: insideConnections.includes("ETHERNET") ? ethernetPorts : null,
            numberOfSerialPorts: insideConnections.includes("SERIAL") ? serialPorts : null,
            vlans: insideConnections.includes("ETHERNET") ? vlans : "UNSPECIFIED",
            dhcp,
            additionalInformation: additionalInformation.trim() || null,
        };

        fetch("http://localhost:8080/api/router-presets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(presetData),
        })
            .then(res => res.json())
            .then(saved => {
                alert("Preset saved.");
                setRouterPresets(prev => {
                    const exists = prev.find(p => p.routerPresetID === saved.routerPresetID);
                    if (exists) {
                        return prev.map(p => p.routerPresetID === saved.routerPresetID ? saved : p);
                    }
                    return [...prev, saved];
                });
                setSelectedPreset(saved);
                setIsAddingNewPreset(false);
            })
            .catch(err => {
                console.error("Save error:", err);
                alert("Error saving preset.");
            });
    };

    // Deletes a router preset from the database.
    const handleDelete = () => {
        if (!selectedPreset) return;
        if (!window.confirm(`Delete ${selectedPreset.routerPresetName}?`)) return;

        fetch(`http://localhost:8080/api/router-presets/${selectedPreset.routerPresetID}`, {
            method: "DELETE"
        })
            .then(() => {
                alert("Preset deleted.");
                setRouterPresets(prev => prev.filter(p => p.routerPresetID !== selectedPreset.routerPresetID));
                clearForm();
            })
            .catch(err => {
                console.error("Delete error:", err);
                alert("Error deleting preset.");
            });
    };

    /* Form State Helpers. */
    // Drop-down options.
    const vlanOptions = ["UNSPECIFIED", "SPECIFIED", "OPEN_TRUNK"];

    // Converts enum-like strings like "OPEN_TRUNK" to "Open Trunk".
    const formatEnumLabel = (value) =>
        value
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

    // Retrieves the full router object from the selected router name.
    const selectedRouter = routers.find(r => r.routerName === selectedRouterName);

    // Determines maximum port limits from selected router.
    const maxEthernet = selectedRouter?.ethernetPorts ?? 0;
    const maxSerial = selectedRouter?.serialPorts ?? 0;

    // Extracts available outside connection options from selected router.
    const outsideOptions = (selectedRouter?.outsideConnectionTypes || "")
        .split(", ")
        .filter((opt) => typeof opt === "string" && opt.trim() !== "");

    // Filters out primary connection to populate secondary outside connection drop-down.
    const secondaryOptions = outsideOptions.filter(opt => opt !== primaryOutside);

    /* Validation Logic. */
    const getValidationErrors = () => {
        const errors = [];

        if (!presetName.trim()) { errors.push("Preset name is required."); }
        if (!selectedRouterName.trim()) { errors.push("A router must be selected."); }
        if (!primaryOutside) { errors.push("Primary outside connection is required."); }
        if (insideConnections.length === 0) { errors.push("At least one inside connection type must be selected."); }
        if (vlans !== "OPEN_TRUNK" && dhcp) { errors.push("DHCP can only be enabled when VLANs is set to 'OPEN_TRUNK'."); }
        if (insideConnections.includes('SERIAL') && serialPorts < 1) { errors.push("At least 1 serial port required when using SERIAL connections"); }
        if (insideConnections.includes('ETHERNET') && ethernetPorts < 1) { errors.push("At least 1 ethernet port required when using ETHERNET connections"); }
        if (additionalInformation.length > 500) { errors.push("Additional information must be less than 500 characters"); }

        return errors;
    };

    // noinspection XmlDeprecatedElement
    return (
        <>
            <SectionDivider sx={{ mt: 2, mb: 2 }}/>

            <StyledFormControl fullWidth sx={{ mb: 0 }}>
                {!isAddingNewPreset && (
                    <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                        Router Preset
                    </InputLabel>
                )}
                <NameContainer>
                    {isAddingNewPreset ? (
                        <>
                            <InputLabel sx={{ backgroundColor: "white", px: 0.5, pr: 1 }}>
                                Routers
                            </InputLabel>
                            <Tooltip title={<span>Select a <strong>router</strong> to add a new preset for.</span>} arrow enterDelay={250} leaveDelay={100}>
                                <StyledSelect
                                    fullWidth
                                    value={selectedRouterName}
                                    onChange={handleRouterSelect}
                                    displayEmpty
                                    disabled={!customer}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Required</em>
                                    </MenuItem>
                                    {routers.map(r => (
                                        <MenuItem key={r.routerID} value={r.routerName}>
                                            {r.routerName}
                                        </MenuItem>
                                    ))}
                                </StyledSelect>
                            </Tooltip>
                        </>
                    ) : (
                        <StyledSelect
                            value={selectedPreset?.routerPresetID || ""}
                            onChange={handlePresetChange}
                            displayEmpty
                            fullWidth
                            disabled={!customer}
                        >
                            <MenuItem value="" disabled>
                                <em>Required</em>
                            </MenuItem>
                            {routerPresets.map(p => (
                                <MenuItem key={p.routerPresetID} value={p.routerPresetID}>
                                    {p.routerPresetName}
                                </MenuItem>
                            ))}
                        </StyledSelect>
                    )}
                    <Tooltip title={isAddingNewPreset ? "Switch to find an existing preset." : "Switch to add a new preset."} arrow enterDelay={250} leaveDelay={100}>
                        <ToggleNameButton
                            onClick={() => {
                                setIsAddingNewPreset(prev => !prev);
                                clearForm();
                            }}
                            className={isAddingNewPreset ? "close-mode" : ""}
                            disabled={!customer}
                        />
                    </Tooltip>
                </NameContainer>
            </StyledFormControl>

            <Typography variant="h6" sx={{ mt: 2 }}>Outside Connection Types</Typography>
            <StyledFormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="primary-outside-label">Primary Outside Connection</InputLabel>

                <Tooltip title={<span>Select the <strong>primary</strong> outside connection.</span>} arrow enterDelay={250} leaveDelay={100}>
                    <StyledSelect
                        labelId="primary-outside-label"
                        label="Primary Outside Connection"
                        value={primaryOutside}
                        onChange={(e) => setPrimaryOutside(e.target.value)}
                        disabled={!customer || outsideOptions.length === 0}
                    >
                        <MenuItem value="" disabled>
                            <em>Required</em>
                        </MenuItem>
                        {outsideOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </StyledSelect>
                </Tooltip>
            </StyledFormControl>

            <StyledFormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel id="secondary-outside-label">Secondary Outside Connection</InputLabel>

                <Tooltip title={<span>Select the <strong>secondary</strong> outside connection. <hr /> This cannot be the same as the primary outside connection.</span>} arrow enterDelay={250} leaveDelay={100}>
                    <StyledSelect
                        labelId="secondary-outside-label"
                        label="Secondary Outside Connection"
                        value={secondaryOutside}
                        onChange={(e) => setSecondaryOutside(e.target.value)}
                        disabled={!customer || secondaryOptions.length === 0}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {secondaryOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </StyledSelect>
                </Tooltip>
            </StyledFormControl>

            <Typography variant="h6" sx={{ mt: 2 }}>Inside Connection Types</Typography>
            <StyledColumn>
                <Tooltip title={<span>Select <strong>Ethernet</strong> as the inside connection.</span>} arrow enterDelay={250} leaveDelay={100}>
                    <FormControlLabel
                        control={
                            <StyledSwitch
                                checked={insideConnections.includes("ETHERNET")}
                                onChange={(e) => handleSwitchChange("ETHERNET", e.target.checked)}
                                disabled={!customer || maxEthernet === 0}
                            />
                        }
                        label="Ethernet"
                    />
                </Tooltip>
                {insideConnections.includes("ETHERNET") && (
                    <Tooltip title={<span>Number cannot exceed the maximum port configuration.</span>} arrow enterDelay={250} leaveDelay={100}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Ethernet Ports"
                            value={ethernetPorts || ""}
                            onChange={handleEthernetPortChange}
                            sx={{ mt: 1, mb: 1 }}
                            disabled={!customer}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <span style={{ fontSize: "0.85em", color: "#888", whiteSpace: "nowrap" }}>
                                            Maximum Ports: {maxEthernet}
                                        </span>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Tooltip>
                )}

                <Tooltip title={<span>Select <strong>Serial</strong> as the inside connection.</span>} arrow enterDelay={250} leaveDelay={100}>
                    <FormControlLabel
                        control={
                            <StyledSwitch
                                checked={insideConnections.includes("SERIAL")}
                                onChange={(e) => handleSwitchChange("SERIAL", e.target.checked)}
                                disabled={!customer || maxSerial === 0}
                            />
                        }
                        label="Serial"
                    />
                </Tooltip>
                {insideConnections.includes("SERIAL") && (
                    <Tooltip title={<span>Number cannot exceed the maximum port configuration.</span>} arrow enterDelay={250} leaveDelay={100}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Serial Ports"
                            value={serialPorts || ""}
                            onChange={handleSerialPortChange}
                            sx={{ mt: 1, mb: 1 }}
                            disabled={!customer}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <span style={{ fontSize: "0.85em", color: "#888", whiteSpace: "nowrap" }}>
                                            Maximum Ports: {maxSerial}
                                        </span>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Tooltip>
                )}
            </StyledColumn>

            <Tooltip title={
                <span>If <strong>Ethernet</strong> is selected, please select a VLANs configuration.
                    <hr /><strong>Unspecified</strong> (Default): No further action.
                    <br /><strong>Specified</strong>: Specify in additional information.
                    <br /><strong>Open Trunk</strong>: Choose to enable or disable DHCP.
                </span>
                } arrow enterDelay={250} leaveDelay={100}>
                <StyledFormControl fullWidth sx={{ mt: 1 }}>
                    <InputLabel id="vlans-label">VLANs</InputLabel>
                    <StyledSelect
                        labelId="vlans-label"
                        label="VLANs"
                        value={vlans}
                        onChange={(e) => setVlans(e.target.value)}
                        disabled={!customer || !insideConnections.includes("ETHERNET")}
                    >
                        <MenuItem value="" disabled>
                            <em>Required</em>
                        </MenuItem>
                        {vlanOptions.map(vlan => (
                            <MenuItem key={vlan} value={vlan}>
                                {formatEnumLabel(vlan)}
                            </MenuItem>
                        ))}
                    </StyledSelect>
                </StyledFormControl>
            </Tooltip>

            <Tooltip title={
                <span>Enable or disable DHCP for this configuration.
                    <hr />Only an option if <strong>Open Trunk</strong> is selected in VLANs.
                </span>
                } arrow enterDelay={250} leaveDelay={100}
            >
                <FormControlLabel
                    control={
                        <StyledSwitch
                            checked={dhcp}
                            onChange={(e) => setDhcp(e.target.checked)}
                            disabled={!customer || vlans !== "OPEN_TRUNK"}
                        />
                    }
                    label="DHCP"
                    sx={{ mt: 1, mb: -1 }}
                />
            </Tooltip>

            <Tooltip title="Any extra notes or special configuration details." arrow enterDelay={250} leaveDelay={100}>
                <TextField
                    fullWidth
                    label="Additional Information"
                    value={additionalInformation}
                    onChange={(e) => setAdditionalInformation(e.target.value)}
                    multiline
                    rows={4}
                    margin="normal"
                    inputProps={{
                        maxLength: 500,
                    }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <span style={{ position: 'absolute', bottom: 8, right: 12, fontSize: '0.85em', color: '#888' }}>
                                    {`${additionalInformation.length}/500`}
                                </span>
                            </InputAdornment>
                        )
                    }}
                    disabled={!customer}
                />
            </Tooltip>

            {validationErrors.length > 0 && (
                <Box sx={{ mt: 2 }}>
                    {validationErrors.map((error, idx) => (
                        <Typography key={idx} color="error" variant="body2" sx={{ mb: 0.5 }}>
                            • {error}
                        </Typography>
                    ))}
                </Box>
            )}

            <ButtonContainer>
                <SaveButton onClick={handleSave} disabled={!customer}>Save Preset</SaveButton>
                <DeleteButton onClick={handleDelete} disabled={!customer || !selectedPreset}>Delete Preset</DeleteButton>
            </ButtonContainer>
        </>

    );
});

export default RouterPresetForm;
