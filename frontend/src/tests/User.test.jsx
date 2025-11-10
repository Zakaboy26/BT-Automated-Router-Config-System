import { render, screen, waitFor } from "@testing-library/react";
import User from "../components/UserList/User";
import {BrowserRouter} from "react-router";

// Enable fetch mocks before each test
beforeEach(() => {
    fetch.resetMocks();
});

test("renders user list correctly", async () => {
    // Mock API response
    fetch.mockResponseOnce(
        JSON.stringify([
            { id: 1, firstName: "John", lastName: "Doe", email: "john@example.com", role: "USER" },
            { id: 2, firstName: "Jane", lastName: "Smith", email: "jane@example.com", role: "ADMIN" },
        ])
    );

    // Render component
    render(
        <BrowserRouter>
            <User url="http://localhost:8080/api/admin/users" />
        </BrowserRouter>
    );

    // Wait for users to load
    await waitFor(() => expect(screen.getByText("John Doe")).toBeInTheDocument());
    await waitFor(() => expect(screen.getByText("Jane Smith")).toBeInTheDocument());

    // Ensure correct number of users are displayed
    const userCards = screen.getAllByText(/email:/i);
    expect(userCards.length).toBe(2);
});
