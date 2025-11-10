import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/orders/history";

export const fetchOrderHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No token found. User is not authenticated.");
        return [];
    }

    try {
        const response = await axios.get(API_BASE_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching order history:", error.response ? error.response.data : error.message);
        return [];
    }
};

// Function to re-order a router based on an existing order
export const reorderRouter = async (orderId) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.error("🔴 No token found. User is not authenticated.");
        return { success: false, message: "User not authenticated" };
    }

    console.log("🔵 Sending token:", token);  // Log the token to check if it's correct

    try {
        const response = await axios.post(`http://localhost:8080/api/orders/reorder/${orderId}`, {}, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Reorder successful:", response.data);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("🔴 Error reordering router:", error.response ? error.response.data : error.message);
        return { success: false, message: error.response ? error.response.data : error.message };
    }
};

// Function to get Order Details
export const fetchOrderDetails = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("🔴 No token found. User is not authenticated.");
        return null;
    }

    try {
        // ✅ FIX: Call `/api/orders/{orderId}`, NOT `/history/{orderId}`
        const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("🔴 Error fetching order details:", error.response ? error.response.data : error.message);
        return null;
    }
};