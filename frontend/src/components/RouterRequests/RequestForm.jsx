import React, { useEffect, useState } from "react";
import {
  Button, Typography, Box, Container, Snackbar, MenuItem,
  InputLabel, CircularProgress, Fade, Stepper, Step,
  StepLabel, Checkbox, FormControlLabel, Tooltip, InputAdornment,
} from "@mui/material";
import {
  StyledButtonGroup,
  StyledSelect,
  StyledSlider,
  StyledSwitch,
  StyledFormControl,
  StyledTextField,
  CardContainer,
  MainContainer,
  TopDecoration,
  BottomDecoration,
  Footer
} from "../../styles/PageStyles";
import Sidebar from "../Navigation/Sidebar";
import useAuth from "../Auth/useAuth";

const steps = [
  "Customer",
  "Router Model",
  "Outside Connection",
  "Inside Connection",
  "Contact Details",
  "Additional Information"
];

const RequestForm = () => {
  const { activeTab, setActiveTab } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");

  const [routers, setRouters] = useState([]);
  const [usePresetMode, setUsePresetMode] = useState(true);
  const [routerPresets, setRouterPresets] = useState([]);
  const [filteredPresets, setFilteredPresets] = useState([]);

  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);

  const [formData, setFormData] = useState({
    customerID: "",
    routerID: "",
    routerPresetID: null,
    primaryOutsideConnections: "",
    secondaryOutsideConnections: "",
    insideConnections: [],
    numberOfEthernetPorts: "",
    numberOfSerialPorts: "",
    vlans: "",
    dhcp: false,
    numRouters: 1,
    siteName: "",
    siteAddress: "",
    sitePostcode: "",
    sitePrimaryEmail: "",
    siteSecondaryEmail: "",
    sitePhoneNumber: "",
    siteContactName: "",
    priorityLevel: "Low",
    additionalInformation: "",
    addAnotherRouter: false
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/customers")
        .then(res => res.json())
        .then(setCustomers)
        .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/routers")
        .then(res => res.json())
        .then(setRouters)
        .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8080/api/router-presets")
        .then(res => res.json())
        .then(setRouterPresets)
        .catch(console.error);
  }, []);

  useEffect(() => {
    const customerPresets = routerPresets.filter(p => p.customer?.customerID === formData.customerID);
    setFilteredPresets(customerPresets);
  }, [formData.customerID, routerPresets]);

  const getSelectedRouter = () => {
    return routers.find(
        (r) =>
            r.routerID === formData.routerID ||
            r.routerID === routerPresets.find((p) => p.routerPresetID === Number(formData.routerPresetID))?.router?.routerID
    );
  };

  const getMaxPorts = () => {
    const selected = getSelectedRouter();
    return {
      maxEthernet: selected?.ethernetPorts ?? 0,
      maxSerial: selected?.serialPorts ?? 0
    };
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "routerPresetID") {
      const preset = routerPresets.find(p => p.routerPresetID === Number(value));
      if (preset) {
        const hasEthernet = preset.insideConnections?.includes("ETHERNET");
        const hasSerial = preset.insideConnections?.includes("SERIAL");

        setFormData(prev => ({
          ...prev,
          routerPresetID: preset.routerPresetID,
          routerID: preset.router?.routerID || "",
          primaryOutsideConnections: preset.primaryOutsideConnections || "",
          secondaryOutsideConnections: preset.secondaryOutsideConnections || "",
          insideConnections: preset.insideConnections?.split(", ") || [],
          numberOfEthernetPorts: hasEthernet ? preset.numberOfEthernetPorts || "" : "",
          numberOfSerialPorts: hasSerial ? preset.numberOfSerialPorts || "" : "",
          vlans: preset.vlans || "",
          dhcp: !!preset.dhcp,
          additionalInformation: preset.additionalInformation || ""
        }));
      }
      return;
    }

    if (name === "routerID") {
      setFormData(prev => ({
        ...prev,
        routerID: value,
        routerPresetID: ""
      }));
      return;
    }

    const { maxEthernet, maxSerial } = getMaxPorts();
    if (name === "numberOfEthernetPorts" && Number(value) > maxEthernet) return;
    if (name === "numberOfSerialPorts" && Number(value) > maxSerial) return;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleInsideConnectionToggle = (type, checked) => {
    setFormData(prev => {
      const updated = checked
          ? [...prev.insideConnections, type]
          : prev.insideConnections.filter(c => c !== type);

      return {
        ...prev,
        insideConnections: updated,
        vlans: updated.includes("ETHERNET") ? prev.vlans : "",
        dhcp: updated.includes("ETHERNET") && prev.vlans === "OPEN_TRUNK" ? prev.dhcp : false
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = getValidationErrors();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);
    const token = localStorage.getItem("token");

    try {
      let finalCustomerID = formData.customerID;

      // Step 1: Create a new customer if needed
      if (isAddingNewCustomer) {
        console.log("Creating new customer:", newCustomerName.trim());
        const customerRes = await fetch("http://localhost:8080/api/customers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            customerID: null,
            customerName: newCustomerName.trim()
          })
        });

        if (!customerRes.ok) {
          const customerError = await customerRes.text();
          console.error("Customer creation failed:", customerError);
          throw new Error("Failed to create customer");
        }

        const createdCustomer = await customerRes.json();
        console.log("Customer created:", createdCustomer);
        finalCustomerID = createdCustomer.customerID;
        setCustomers((prev) => [...prev, createdCustomer]);
      }

      // Step 2: Build the order payload
      const orderPayload = {
        customerId: finalCustomerID,
        routerId: formData.routerID || null,
        routerPresetId: formData.routerPresetID || null,
        primaryOutsideConnections: formData.primaryOutsideConnections,
        secondaryOutsideConnections: formData.secondaryOutsideConnections,
        insideConnections: formData.insideConnections.join(", "),
        numberOfEthernetPorts: formData.numberOfEthernetPorts,
        numberOfSerialPorts: formData.numberOfSerialPorts,
        vlans: formData.vlans,
        dhcp: formData.dhcp,
        numRouters: formData.numRouters,
        siteName: formData.siteName,
        siteAddress: formData.siteAddress,
        sitePostcode: formData.sitePostcode,
        sitePrimaryEmail: formData.sitePrimaryEmail,
        siteSecondaryEmail: formData.siteSecondaryEmail,
        sitePhoneNumber: formData.sitePhoneNumber,
        siteContactName: formData.siteContactName,
        priorityLevel: formData.priorityLevel,
        additionalInformation: formData.additionalInformation,
        addAnotherRouter: formData.addAnotherRouter
      };

      console.log("Sending order payload:", orderPayload);

      // Step 3: Submit the order
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(orderPayload)
      });

      const text = await res.text();
      console.log("Raw response text from /api/orders:", text);

      let savedOrder = null;
      try {
        savedOrder = text ? JSON.parse(text) : null;
        console.log("Parsed order response object:", savedOrder);
      } catch (err) {
        console.warn("Invalid JSON returned from order submission:", err);
        throw new Error("Unexpected response from order API.");
      }

      // ✅ Debug step: Inspect key names
      if (savedOrder && typeof savedOrder === "object") {
        console.log("Order keys:", Object.keys(savedOrder));
      }

      if (!res.ok) {
        throw new Error("Order API response was not OK.");
      }

      if (!savedOrder?.routerOrderID) {
        console.error("No 'routerOrderID' found in saved order response!");
        throw new Error("Order submission failed or no ID returned.");
      }

      console.log("Order created successfully. ID:", savedOrder.routerOrderID);

      // Step 4: Create tracking record
      console.log("Creating order tracking for ID:", savedOrder.routerOrderID);
      const trackingRes = await fetch("/api/order-tracking/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ orderId: savedOrder.routerOrderID })
      });

      if (!trackingRes.ok) {
        const trackingErrorText = await trackingRes.text();
        console.error("Tracking creation failed:", trackingErrorText);
        throw new Error("Failed to create tracking record.");
      }

      const tracking = await trackingRes.json();
      console.log("Tracking record created:", tracking);

      setMessage(`Order submitted! Reference: ${tracking.referenceNumber}`);

      // Step 5: Reset form
      setFormData({
        customerID: "",
        routerID: "",
        routerPresetID: null,
        primaryOutsideConnections: "",
        secondaryOutsideConnections: "",
        insideConnections: [],
        numberOfEthernetPorts: "",
        numberOfSerialPorts: "",
        vlans: "",
        dhcp: false,
        numRouters: 1,
        siteName: "",
        siteAddress: "",
        sitePostcode: "",
        sitePrimaryEmail: "",
        siteSecondaryEmail: "",
        sitePhoneNumber: "",
        siteContactName: "",
        priorityLevel: "Low",
        additionalInformation: "",
        addAnotherRouter: false
      });

      setNewCustomerName("");
      setIsAddingNewCustomer(false);
      setActiveStep(0);
    } catch (error) {
      console.error("Submission failed:", error);
      setMessage("Failed to submit order.");
    } finally {
      setIsLoading(false);
      setOpenSnackbar(true);
    }
  };

  const getValidationErrors = () => {
    const errors = [];

    if (!formData.customerID && !isAddingNewCustomer)
      errors.push("Customer selection is required.");
    if (isAddingNewCustomer && !newCustomerName.trim())
      errors.push("New customer name is required.");

    if (activeStep === 1) {
      if (usePresetMode && !formData.routerPresetID)
        errors.push("Router preset is required.");
      if (!usePresetMode && !formData.routerID)
        errors.push("Router model is required.");
    }

    if (activeStep === 2 && !formData.primaryOutsideConnections)
      errors.push("Primary outside connection is required.");

    if (activeStep === 3) {
      if (formData.insideConnections.length === 0)
        errors.push("At least one inside connection must be selected.");

      const { maxEthernet, maxSerial } = getMaxPorts();

      if (formData.insideConnections.includes("ETHERNET")) {
        if (!formData.numberOfEthernetPorts)
          errors.push("Ethernet ports required.");
        if (Number(formData.numberOfEthernetPorts) > maxEthernet)
          errors.push(`Ethernet ports cannot exceed ${maxEthernet}.`);
      }

      if (formData.insideConnections.includes("SERIAL")) {
        if (!formData.numberOfSerialPorts)
          errors.push("Serial ports required.");
        if (Number(formData.numberOfSerialPorts) > maxSerial)
          errors.push(`Serial ports cannot exceed ${maxSerial}.`);
      }
    }

    if (activeStep === 4) {
      if (!formData.siteName.trim())
        errors.push("Site name is required.");
      if (!formData.siteAddress.trim())
        errors.push("Address is required.");
      if (!formData.sitePostcode.trim())
        errors.push("Postcode is required.");
      if (
          !formData.sitePrimaryEmail.trim() ||
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.sitePrimaryEmail)
      )
        errors.push("Valid primary email is required.");
      if (!formData.sitePhoneNumber.trim())
        errors.push("Phone number is required.");
      if (!formData.siteContactName.trim())
        errors.push("Contact name is required.");
    }

    if (activeStep === 5) {
      if (!formData.priorityLevel)
        errors.push("Priority level is required.");
      if (formData.additionalInformation.length > 500)
        errors.push("Additional information must be less than 500 characters.");
    }

    return errors;
  };

  const ValidationErrorDisplay = ({ errors }) =>
      errors.length > 0 && (
          <Box sx={{ mt: 2, mb: -2 }}>
            {errors.map((error, idx) => (
                <Typography key={idx} color="error" variant="body2" sx={{ mb: 0.5 }}>
                  • {error}
                </Typography>
            ))}
          </Box>
      );

  const handleNext = () => {
    const errors = getValidationErrors();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors([]);
    setActiveStep((prev) => prev + 1);
  };

  const getStepContent = (step) => {
    const selectedRouter = routers.find(
        r => r.routerID === formData.routerID ||
            r.routerID === routerPresets.find((p) => p.routerPresetID === Number(formData.routerPresetID))?.router?.routerID
    );

    const { maxEthernet, maxSerial } = getMaxPorts();
    const priorityLabels = ["Low", "Medium", "High", "Urgent", "Critical"];
    const priorityMarks = priorityLabels.map((label, index) => ({ value: index, label }));
    const priorityIndex = priorityLabels.indexOf(formData.priorityLevel);

    switch (step) {
      case 0:
        return (
            <>
              <Tooltip title="Select an existing customer or create a new one" arrow>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <StyledButtonGroup variant="contained" disableElevation>
                    <Button
                        onClick={() => setIsAddingNewCustomer(false)}
                        variant={!isAddingNewCustomer ? "contained" : "text"}
                    >
                      Existing Customer
                    </Button>
                    <Button
                        onClick={() => setIsAddingNewCustomer(true)}
                        variant={isAddingNewCustomer ? "contained" : "text"}
                    >
                      New Customer
                    </Button>
                  </StyledButtonGroup>
                </Box>
              </Tooltip>

              {isAddingNewCustomer ? (
                  <StyledFormControl fullWidth>
                    <StyledTextField
                        fullWidth
                        label="New Customer"
                        value={newCustomerName}
                        onChange={(e) => setNewCustomerName(e.target.value)}
                        autoFocus
                        error={validationErrors.some(e => e.includes("New customer name"))}
                    />
                  </StyledFormControl>
              ) : (
                  <StyledFormControl fullWidth>
                    <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                      Customer
                    </InputLabel>
                    <StyledSelect
                        value={formData.customerID || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, customerID: e.target.value }))}
                        fullWidth
                        displayEmpty
                        error={validationErrors.some(e => e.includes("Customer selection"))}
                    >
                      <MenuItem value="" disabled><em>Required</em></MenuItem>
                      {[...customers]
                          .sort((a, b) => a.customerName.localeCompare(b.customerName))
                          .map((c) => (
                              <MenuItem key={c.customerID} value={c.customerID}>
                                {c.customerName}
                              </MenuItem>
                          ))}
                    </StyledSelect>
                  </StyledFormControl>
              )}

              <ValidationErrorDisplay errors={validationErrors} />
            </>
        );

      case 1:
        return (
            <>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <StyledButtonGroup variant="contained" disableElevation>
                  <Button
                      onClick={() => setUsePresetMode(true)}
                      variant={usePresetMode ? "contained" : "text"}
                  >
                    Preset Configuration
                  </Button>
                  <Button
                      onClick={() => setUsePresetMode(false)}
                      variant={!usePresetMode ? "contained" : "text"}
                  >
                    New Configuration
                  </Button>
                </StyledButtonGroup>
              </Box>

              {usePresetMode ? (
                  <StyledFormControl fullWidth sx={{ mb: 0 }}>
                    <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                      Router Preset
                    </InputLabel>
                    <StyledSelect
                        value={formData.routerPresetID || ""}
                        onChange={(e) => handleChange({ target: { name: "routerPresetID", value: e.target.value } })}
                        fullWidth
                        displayEmpty
                        error={validationErrors.some(e => e.includes("Router preset"))}
                    >
                      <MenuItem value="" disabled><em>Required</em></MenuItem>
                      {[...filteredPresets]
                          .sort((a, b) => a.routerPresetName.localeCompare(b.routerPresetName))
                          .map((preset) => (
                              <MenuItem key={preset.routerPresetID} value={preset.routerPresetID}>
                                {preset.routerPresetName}
                              </MenuItem>
                          ))}
                    </StyledSelect>
                  </StyledFormControl>
              ) : (
                  <StyledFormControl fullWidth sx={{ mb: 0 }}>
                    <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                      Router Model
                    </InputLabel>
                    <StyledSelect
                        value={formData.routerID || ""}
                        onChange={(e) => handleChange({ target: { name: "routerID", value: e.target.value } })}
                        fullWidth
                        displayEmpty
                        error={validationErrors.some(e => e.includes("Router model"))}
                    >
                      <MenuItem value="" disabled><em>Required</em></MenuItem>
                      {[...routers]
                          .sort((a, b) => a.routerName.localeCompare(b.routerName))
                          .map((router) => (
                              <MenuItem key={router.routerID} value={router.routerID}>
                                {router.routerName}
                              </MenuItem>
                          ))}
                    </StyledSelect>
                  </StyledFormControl>
              )}

              <ValidationErrorDisplay errors={validationErrors} />
            </>
        );

      case 2:
        const availableOutsideConnections = selectedRouter?.outsideConnectionTypes
            ? selectedRouter.outsideConnectionTypes.split(",").map((t) => t.trim())
            : [];

        return (
            <Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
              <StyledFormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                  Primary Outside Connection
                </InputLabel>
                <StyledSelect
                    value={formData.primaryOutsideConnections || ""}
                    onChange={(e) => setFormData((prev) => ({
                      ...prev,
                      primaryOutsideConnections: e.target.value,
                      secondaryOutsideConnections:
                          e.target.value === prev.secondaryOutsideConnections ? "" : prev.secondaryOutsideConnections
                    }))}
                    fullWidth
                    displayEmpty
                    error={validationErrors.some(e => e.includes("Primary outside"))}
                >
                  <MenuItem value="" disabled><em>Required</em></MenuItem>
                  {availableOutsideConnections.map((opt) => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </StyledSelect>
              </StyledFormControl>

              <StyledFormControl fullWidth>
                <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                  Secondary Outside Connection (Optional)
                </InputLabel>
                <StyledSelect
                    value={formData.secondaryOutsideConnections || ""}
                    onChange={(e) => setFormData((prev) => ({
                      ...prev,
                      secondaryOutsideConnections: e.target.value
                    }))}
                    fullWidth
                    displayEmpty
                >
                  <MenuItem value=""><em>Optional</em></MenuItem>
                  {availableOutsideConnections
                      .filter((opt) => opt !== formData.primaryOutsideConnections)
                      .map((opt) => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                      ))}
                </StyledSelect>
              </StyledFormControl>

              <ValidationErrorDisplay errors={validationErrors} />
            </Box>
        );

      case 3:
        return (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Tooltip
                  title={
                    !selectedRouter?.insideConnectionTypes?.includes("ETHERNET")
                        ? <span><strong>Disabled</strong>: Ethernet is not a valid option for this router model.</span>
                        : <span>Select <strong>Ethernet</strong> as the inside connection.</span>
                  }
                  arrow
              >
                <FormControlLabel
                    control={
                      <StyledSwitch
                          checked={formData.insideConnections.includes("ETHERNET")}
                          onChange={(e) => handleInsideConnectionToggle("ETHERNET", e.target.checked)}
                          disabled={!selectedRouter?.insideConnectionTypes?.includes("ETHERNET")}
                      />
                    }
                    label="Ethernet"
                />
              </Tooltip>

              {formData.insideConnections.includes("ETHERNET") && (
                  <Tooltip title="Number cannot exceed the maximum port configuration" arrow>
                    <StyledTextField
                        fullWidth
                        type="number"
                        label="Ethernet Ports"
                        name="numberOfEthernetPorts"
                        value={formData.numberOfEthernetPorts}
                        onChange={handleChange}
                        InputProps={{
                          endAdornment: (
                              <InputAdornment position="end">
                      <span style={{ fontSize: "0.85em", color: "#888" }}>
                        Maximum Ports: {maxEthernet}
                      </span>
                              </InputAdornment>
                          )
                        }}
                    />
                  </Tooltip>
              )}

              <Tooltip
                  title={
                    !selectedRouter?.insideConnectionTypes?.includes("SERIAL")
                        ? <span><strong>Disabled</strong>: Serial is not a valid option for this router model.</span>
                        : <span>Select <strong>Serial</strong> as the inside connection.</span>
                  }
                  arrow
              >
                <FormControlLabel
                    control={
                      <StyledSwitch
                          checked={formData.insideConnections.includes("SERIAL")}
                          onChange={(e) => handleInsideConnectionToggle("SERIAL", e.target.checked)}
                          disabled={!selectedRouter?.insideConnectionTypes?.includes("SERIAL")}
                      />
                    }
                    label="Serial"
                />
              </Tooltip>

              {formData.insideConnections.includes("SERIAL") && (
                  <Tooltip title="Number cannot exceed the maximum port configuration" arrow>
                    <StyledTextField
                        fullWidth
                        type="number"
                        label="Serial Ports"
                        name="numberOfSerialPorts"
                        value={formData.numberOfSerialPorts}
                        onChange={handleChange}
                        InputProps={{
                          endAdornment: (
                              <InputAdornment position="end">
                      <span style={{ fontSize: "0.85em", color: "#888" }}>
                        Maximum Ports: {maxSerial}
                      </span>
                              </InputAdornment>
                          )
                        }}
                    />
                  </Tooltip>
              )}

              <Tooltip title={
                <span>If <strong>Ethernet</strong> is selected, please select a VLANs configuration.
                    <hr /><strong>Unspecified</strong> (Default): No further action.
                    <br /><strong>Specified</strong>: Specify in additional information.
                    <br /><strong>Open Trunk</strong>: Choose to enable or disable DHCP.
                </span>
              } arrow enterDelay={250} leaveDelay={100}>
                <StyledFormControl fullWidth>
                  <InputLabel sx={{ backgroundColor: "white", px: 0.5 }}>
                    VLANs
                  </InputLabel>
                  <StyledSelect
                      name="vlans"
                      value={formData.vlans}
                      onChange={handleChange}
                      disabled={!formData.insideConnections.includes("ETHERNET")}
                      fullWidth
                  >
                    <MenuItem value=""><em>Required</em></MenuItem>
                    {["UNSPECIFIED", "SPECIFIED", "OPEN_TRUNK"].map(opt => (
                        <MenuItem key={opt} value={opt}>
                          {opt.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
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
                          checked={formData.dhcp}
                          onChange={(e) => setFormData(prev => ({ ...prev, dhcp: e.target.checked }))}
                          disabled={formData.vlans !== "OPEN_TRUNK"}
                      />
                    }
                    label="DHCP"
                />
              </Tooltip>

              <ValidationErrorDisplay errors={validationErrors} />
            </Box>
        );

      case 4:
        return (
            <>
              <StyledTextField fullWidth label="Site Name" name="siteName" sx={{ mb: 2 }} value={formData.siteName} onChange={handleChange} />
              <StyledTextField fullWidth label="Address" name="siteAddress" sx={{ mb: 2 }} value={formData.siteAddress} onChange={handleChange} />
              <StyledTextField fullWidth label="Postcode" name="sitePostcode" sx={{ mb: 2 }} value={formData.sitePostcode} onChange={handleChange} />
              <StyledTextField fullWidth label="Primary Email" name="sitePrimaryEmail" sx={{ mb: 2 }} value={formData.sitePrimaryEmail} onChange={handleChange} />
              <StyledTextField fullWidth label="Secondary Email (Optional)" name="siteSecondaryEmail" sx={{ mb: 2 }} value={formData.siteSecondaryEmail} onChange={handleChange} />
              <StyledTextField fullWidth label="Phone Number" name="sitePhoneNumber" sx={{ mb: 2 }} value={formData.sitePhoneNumber} onChange={handleChange} />
              <StyledTextField fullWidth label="Contact Name" name="siteContactName" value={formData.siteContactName} onChange={handleChange} />

              <ValidationErrorDisplay errors={validationErrors} />
            </>
        );

      case 5:
        return (
            <>
              <Tooltip title="Select the number of the configured routers the customer wants to order." arrow>
                <StyledTextField
                    fullWidth
                    type="number"
                    label="Number of Routers"
                    name="numRouters"
                    value={formData.numRouters}
                    onChange={handleChange}
                    inputProps={{ min: 1 }}
                />
              </Tooltip>

              <Tooltip title="Select the priority level for this request" arrow>
                <Typography sx={{ mt: 2 }}>Priority Level</Typography>
                <StyledSlider
                    value={priorityIndex !== -1 ? priorityIndex : 0}
                    onChange={(e, newValue) => setFormData(prev => ({
                      ...prev,
                      priorityLevel: priorityLabels[newValue],
                    }))}
                    step={1}
                    marks={priorityMarks}
                    min={0}
                    max={4}
                    valueLabelDisplay="off"
                />
              </Tooltip>

              <Tooltip title="Additional configuration details (max 500 characters)" arrow>
                <StyledTextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Additional Information"
                    name="additionalInformation"
                    value={formData.additionalInformation}
                    onChange={handleChange}
                    inputProps={{ maxLength: 500 }}
                />
              </Tooltip>

              <FormControlLabel
                  control={
                    <Checkbox
                        name="addAnotherRouter"
                        checked={formData.addAnotherRouter}
                        onChange={handleChange}
                    />
                  }
                  label="Add another router?"
              />

              <ValidationErrorDisplay errors={validationErrors} />
            </>
        );

      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  return (
      <MainContainer>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <Container
            maxWidth="md"
            sx={{
              position: "relative",
              py: 4,
              minHeight: "100vh", // full height of viewport
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // vertical centering
              alignItems: "center",     // optional: horizontal centering
            }}
        >
          <TopDecoration />
          <BottomDecoration />
          <Fade in timeout={600}>
            <CardContainer active={true} sx={{ m: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Request a Router
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                  Complete the form steps below to submit your router request.
                </Typography>
              </Box>
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mt: 2, mb: 4 }}>
                {steps.map((label, idx) => (
                    <Step key={idx}>
                      <StepLabel
                          sx={{
                            '& .MuiStepIcon-root': {
                              background: "linear-gradient(90deg, #6200aa 0%, #c51688 100%)",
                              borderRadius: '50%',
                              color: 'transparent',
                              '& .MuiStepIcon-text': {
                                fill: '#fff'
                              }
                            },
                            '& .Mui-active .MuiStepIcon-root': {
                              background: "linear-gradient(90deg, #6200aa 0%, #c51688 100%)",
                              boxShadow: '0 0 8px 3px rgba(197, 22, 136, 0.4)',
                              '& .MuiStepIcon-text': {
                                fill: '#fff'
                              }
                            },
                            '& .Mui-completed .MuiStepIcon-root': {
                              color: '#fff',
                              background: '#6200aa',
                              border: '2px solid #c51688',

                              '& .MuiStepIcon-text': {
                                fill: '#fff'
                              }
                            }
                          }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                ))}
              </Stepper>
              <form>
                {getStepContent(activeStep)}
                <Box
                    sx={{
                      display: "flex",
                      justifyContent: activeStep === 0 ? "flex-end" : "space-between",
                      mt: 4
                    }}
                >
                  {activeStep > 0 && (
                      <Button
                          onClick={() => {
                            setValidationErrors([]);
                            setActiveStep((prev) => prev - 1);
                          }}
                          sx={{
                            background: "linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)",
                            color: "#fff",
                            fontWeight: "bold",
                            px: 3,
                            '&:hover': {
                              background: "linear-gradient(45deg, #5a0099 30%, #7e1e9e 90%)"
                            }
                          }}
                      >
                        Back
                      </Button>
                  )}
                  {activeStep < steps.length - 1 ? (
                      <Button
                          onClick={handleNext}
                          sx={{
                            background: "linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)",
                            color: "#fff",
                            fontWeight: "bold",
                            px: 3,
                            '&:hover': {
                              background: "linear-gradient(45deg, #5a0099 30%, #7e1e9e 90%)"
                            }
                          }}
                      >
                        Next
                      </Button>
                  ) : (
                      <Button
                          onClick={handleSubmit} // only fires when user explicitly clicks Submit
                          disabled={isLoading}
                          sx={{
                            background: "linear-gradient(45deg, #6200aa 30%, #8e24aa 90%)",
                            color: "#fff",
                            fontWeight: "bold",
                            px: 3,
                            '&:hover': {
                              background: "linear-gradient(45deg, #5a0099 30%, #7e1e9e 90%)"
                            }
                          }}
                      >
                        {isLoading ? <CircularProgress size={20} /> : "Submit"}
                      </Button>
                  )}
                </Box>
              </form>
            </CardContainer>
          </Fade>
          <Footer>
            <Typography variant="caption">© 2025 BT IoT Router Services. All rights reserved.</Typography>
          </Footer>
        </Container>
        <Snackbar
            open={openSnackbar}
            autoHideDuration={4000}
            onClose={() => setOpenSnackbar(false)}
            message={message}
        />
      </MainContainer>
  );
};

export default RequestForm;
