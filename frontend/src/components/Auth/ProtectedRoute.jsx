import { Navigate } from 'react-router';

const ProtectedRoute = ({ children }) => {
    // Check if JWT token exists in localStorage
    const token = localStorage.getItem('token');

    // Redirect to login if no token found
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        // Decode and verify JWT token expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp < Date.now() / 1000) {
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        // Handle invalid token by removing it and redirecting
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }

    // If token is valid, render the protected component
    return children;
};

export default ProtectedRoute;