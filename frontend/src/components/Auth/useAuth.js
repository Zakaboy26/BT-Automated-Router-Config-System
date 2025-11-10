import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { navItems } from "../Navigation/navConfig";

// Centralised Sidebar role-based logic.
const useAuth = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const payload = JSON.parse(atob(token.split(".")[1]));
                setUserRole(payload.role);
                setLoading(false);
            } catch (error) {
                console.error("Error decoding token:", error);
                navigate("/login");
            }
        } else {
            navigate("/login");
        }
    }, [navigate]);

    // Automatically set activeTab based on URL if other methods fail.
    useEffect(() => {
        const matchingNavItem = navItems.find((item) => item.path === location.pathname);
        if (matchingNavItem) {
            setActiveTab(matchingNavItem.id);
        }
    }, [location.pathname]);

    // Centralised role-check.
    const isAllowed = (allowedRoles) => userRole && allowedRoles.includes(userRole);

    // Centralised logout.
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return { userRole, loading, setLoading, navigate, activeTab, setActiveTab, isAllowed, handleLogout };
};

export default useAuth;
