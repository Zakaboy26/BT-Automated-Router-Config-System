import React from "react";
import { MemoryRouter } from "react-router";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import RouterPage from "../components/Routers/RouterPage";

jest.setTimeout(10000);

/* Mock Data. */
const mockRouters = [
    {
        routerID: 1,
        routerName: "Virtual Access - GW1042M",
        outsideConnectionTypes: "Mobile Radio - UK SIM, VSAT Satellite - Internet",
        insideConnectionTypes: "ETHERNET, SERIAL",
        ethernetPorts: 4,
        serialPorts: 2
    }, {
        routerID: 2,
        routerName: "Virtual Access - GW1400M",
        outsideConnectionTypes: "Mobile Radio - UK SIM, VSAT Satellite - Internet",
        insideConnectionTypes: "ETHERNET, SERIAL",
        ethernetPorts: 4,
        serialPorts: 2
    },
];

// Helper to render with Router context.
const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("RouterPage", () => {
    beforeEach(() => {
        // Defaults in setupTests.js file.
    });

    // Tests loading.
    test("Renders without crashing.", async () => {
        fetch.mockResponseOnce(JSON.stringify(mockRouters));
        renderWithRouter(<RouterPage />);
        expect(await screen.findByText(/Router Configurations/i)).toBeInTheDocument();
    });

    // Tests toggle button.
    test("Can toggle to 'New Router' mode.", async () => {
        fetch.mockResponseOnce(JSON.stringify(mockRouters));
        renderWithRouter(<RouterPage />);
        const toggleButton = screen.getByRole("button", {
            name: /Switch to add a new router/i,
        });

        fireEvent.click(toggleButton);
        expect(await screen.findByLabelText("New Router Name")).toBeInTheDocument();
    });

    // Tests 'Save' disabled/enabled.
    test("Disables 'Save' button if name is empty; enables when valid.", async () => {
        fetch.mockResponseOnce(JSON.stringify(mockRouters));
        renderWithRouter(<RouterPage />);

        // Toggle to "New Router" mode.
        const toggleButton = await screen.findByRole("button", {
            name: /switch to add a new router/i
        });
        fireEvent.click(toggleButton);

        // Save button should be disabled initially.
        const saveBtn = await screen.findByText("Save");
        expect(saveBtn).toBeDisabled();

        // Fill in valid name.
        const nameInput = await screen.findByLabelText("New Router Name");
        fireEvent.change(nameInput, { target: { value: "My Test Router" } });

        // Save button should now be enabled.
        expect(saveBtn).not.toBeDisabled();
    });

    // Tests drop-down functionality.
    test("Displays router drop-down after fetch.", async () => {
        fetch.mockResponseOnce(JSON.stringify(mockRouters));
        renderWithRouter(<RouterPage />);

        // Open the drop-down.
        const dropdownTrigger = await screen.findByRole("combobox");
        fireEvent.mouseDown(dropdownTrigger);

        // Search for the options.
        expect(await screen.findByText(/GW1042M/i)).toBeInTheDocument();
        expect(screen.getByText(/GW1400M/i)).toBeInTheDocument();
    });

    // Tests deleting a router.
    test("Deletes an existing router.", async () => {
        fetch.mockResponseOnce(JSON.stringify(mockRouters));
        renderWithRouter(<RouterPage />);

        // Select router.
        const dropdown = await screen.findByRole("combobox");
        fireEvent.mouseDown(dropdown);
        fireEvent.click(await screen.findByText(/GW1042M/i));

        // Confirm window.confirm call.
        window.confirm = jest.fn(() => true);

        // Click Delete.
        fireEvent.click(screen.getByText("Delete"));

        // Assert fetch DELETE called.
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                `http://localhost:8080/api/routers/${mockRouters[0].routerID}`,
                expect.objectContaining({ method: "DELETE" })
            );
        });

        // Assert alert was shown.
        expect(global.alert).toHaveBeenCalledWith("Router deleted successfully!");
    });

    // Tests loading and displaying connection types.
    test("Loads and displays outside and inside connection types", async () => {
        // Mock API responses.
        fetch.mockResponseOnce(JSON.stringify(mockRouters)); // Routers
        fetch.mockResponseOnce(JSON.stringify([ // Outside connections
            { connectionID: 1, connectionName: "Mobile Radio", connectionType: "OUTSIDE" }
        ]));
        fetch.mockResponseOnce(JSON.stringify([ // Inside connections
            { connectionID: 2, connectionName: "ETHERNET", connectionType: "INSIDE" }
        ]));

        renderWithRouter(<RouterPage />);

        // Check if outside connection is rendered.
        await waitFor(() => {
            expect(screen.getByText("Mobile Radio")).toBeInTheDocument();
        });
    });

    // Tests edit mode hint.
    test("Shows and hides edit hint when editing outside connections", async () => {
        renderWithRouter(<RouterPage />);

        // Click edit button.
        fireEvent.click(screen.getByLabelText("Edit outside connection types."));

        // Check hint appears.
        expect(screen.getByText(/Click again when done editing/i)).toBeInTheDocument();

        // Wait for timeout.
        await waitFor(() => {
            expect(screen.queryByText(/Click again/i)).not.toBeInTheDocument();
        }, { timeout: 5100 });
    });

    // Tests Ethernet/Serial connections.
    test("Toggles Ethernet/Serial connections and shows port fields", async () => {
        // Mock API responses.
        fetch.mockResponses(
            JSON.stringify(mockRouters), // Routers
            JSON.stringify([ // Outside connections
                { connectionID: 1, connectionName: "Mobile Radio", connectionType: "OUTSIDE" }
            ]),
            JSON.stringify([ // Inside connections (required for Ethernet/Serial switches)
                { connectionID: 2, connectionName: "ETHERNET", connectionType: "INSIDE" },
                { connectionID: 3, connectionName: "SERIAL", connectionType: "INSIDE" }
            ])
        );

        renderWithRouter(<RouterPage />);

        // Wait for connection types to load.
        await screen.findByText("Mobile Radio");

        // Get the switches using their accessible names.
        const ethernetSwitch = await screen.findByRole("checkbox", { name: /Ethernet/i });
        const serialSwitch = await screen.findByRole("checkbox", { name: /Serial/i });

        // Toggle Ethernet.
        fireEvent.click(ethernetSwitch);
        expect(await screen.findByLabelText("Maximum Ethernet Ports")).toBeInTheDocument();

        // Toggle Serial.
        fireEvent.click(serialSwitch);
        expect(await screen.findByLabelText("Maximum Serial Ports")).toBeInTheDocument();
    });

    // Tests saving errors.
    test("Shows error alert when saving fails", async () => {
        // Mock API responses.
        fetch.mockResponses(
            JSON.stringify(mockRouters), // /api/routers
            JSON.stringify([{  // /api/connection-types?type=OUTSIDE
                connectionID: 1,
                connectionName: "Mobile Radio",
                connectionType: "OUTSIDE"
            }]),
            JSON.stringify([{  // /api/connection-types?type=INSIDE
                connectionID: 2,
                connectionName: "ETHERNET",
                connectionType: "INSIDE"
            }])
        );

        // Mock alert.
        const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});

        renderWithRouter(<RouterPage />);

        // Wait for dropdown options to load.
        const dropdown = await screen.findByRole("combobox");
        fireEvent.mouseDown(dropdown);

        const dropdownOption = await screen.findByText(/Virtual Access - GW1042M/i);
        expect(dropdownOption).toBeInTheDocument();

        // Switch to new router mode.
        const toggleButton = await screen.findByLabelText(/switch to add a new router/i);
        fireEvent.click(toggleButton);

        // Fill form.
        const nameInput = await screen.findByLabelText('New Router Name');
        fireEvent.change(nameInput, { target: { value: 'Test Router' } });

        // Select connections.
        const mobileRadioSwitch = await screen.findByRole('checkbox', {
            name: /Mobile Radio/i
        });
        fireEvent.click(mobileRadioSwitch);

        const ethernetSwitch = await screen.findByRole('checkbox', {
            name: /Ethernet/i
        });
        fireEvent.click(ethernetSwitch);

        // Fill ports.
        const portsInput = await screen.findByLabelText('Maximum Ethernet Ports');
        fireEvent.change(portsInput, { target: { value: '4' } });

        // Mock failed save.
        fetch.mockRejectOnce(new Error('API error'));

        // Save.
        fireEvent.click(await screen.findByText('Save'));

        // Verify error handling.
        await waitFor(() => {
            expect(mockAlert).toHaveBeenCalledWith('Error saving router.');
        });

        mockAlert.mockRestore();
    });

    // Tests validation errors for connections.
    test("Shows validation errors when missing outside/inside connections", async () => {
        fetch.mockResponses(
            JSON.stringify(mockRouters),
            JSON.stringify([{ connectionID: 1, connectionName: "Mobile Radio", connectionType: "OUTSIDE" }]),
            JSON.stringify([{ connectionID: 2, connectionName: "ETHERNET", connectionType: "INSIDE" }])
        );

        renderWithRouter(<RouterPage />);

        // Switch to new router mode.
        fireEvent.click(await screen.findByRole("button", { name: /Switch to add/i }));

        // Enter valid name.
        fireEvent.change(await screen.findByLabelText("New Router Name"), {
            target: { value: "Test Router" }
        });

        // Attempt save with no connections selected.
        fireEvent.click(screen.getByText("Save"));

        // Verify validation errors.
        await waitFor(() => {
            expect(screen.getByText(/outside connection.*selected/i)).toBeInTheDocument();
            expect(screen.getByText(/inside connection.*selected/i)).toBeInTheDocument();
        });
    });

    // Tests deleting an outside connection type.
    test("Deletes an outside connection type", async () => {
        const mockConnection = { connectionID: 1, connectionName: "VSAT", connectionType: "OUTSIDE" };

        fetch.mockResponses(
            JSON.stringify(mockRouters),
            JSON.stringify([mockConnection]),
            JSON.stringify([])
        );
        window.confirm = jest.fn(() => true);

        renderWithRouter(<RouterPage />);

        // Enter edit mode.
        fireEvent.click(await screen.findByLabelText("Edit outside connection types."));

        // Wait for the delete icon to appear.
        const allButtons = await screen.findAllByRole("button");

        // Log button HTML to help us debug.
        allButtons.forEach((btn, i) => {
            console.log(`Button ${i}:`, btn.innerHTML);
        });

        // Try to find the delete button based on SVG content.
        const deleteButton = allButtons.find(btn =>
            btn.innerHTML.toLowerCase().includes("svg") &&
            btn.innerHTML.toLowerCase().includes("delete")
        );

        expect(deleteButton).toBeDefined(); // This helps catch when it's not found.
        fireEvent.click(deleteButton);

        // Assert DELETE request.
        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                "http://localhost:8080/api/connection-types/1",
                expect.objectContaining({ method: "DELETE" })
            );
        });
    });

    // Tests clearForm when toggling between modes.
    test("Resets form when toggling between new/existing modes", async () => {
        fetch.mockResponseOnce(JSON.stringify(mockRouters));
        renderWithRouter(<RouterPage />);

        // Toggle to "New Router" mode and fill some data.
        fireEvent.click(await screen.findByRole("button", { name: /Switch to add/i }));
        fireEvent.change(await screen.findByLabelText("New Router Name"), {
            target: { value: "Test Router" }
        });

        // Toggle back to "Find Existing Router" mode.
        fireEvent.click(await screen.findByRole("button", { name: /Switch to find/i }));

        // Make sure the "New Router Name" input is removed.
        expect(screen.queryByLabelText("New Router Name")).not.toBeInTheDocument();

        // Confirm the combobox placeholder is showing again.
        const combobox = await screen.findByRole("combobox");
        expect(combobox.textContent).toMatch(/Select a router/i);
    });

});
