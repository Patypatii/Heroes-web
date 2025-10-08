import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

interface AdminRedirectProps {
    children: React.ReactNode;
}

export default function AdminRedirect({ children }: AdminRedirectProps) {
    const { user, isLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // If user is admin/staff and trying to access non-admin routes, redirect to admin dashboard
        if (user && (user.role === "admin" || user.role === "staff") && !location.pathname.startsWith("/admin")) {
            console.log("🔄 AdminRedirect - Redirecting admin user to admin dashboard");
            navigate("/admin", { replace: true });
        }
    }, [user, navigate, location.pathname]);

    // If user is admin/staff, don't render the regular content
    if (user && (user.role === "admin" || user.role === "staff")) {
        return null; // Will redirect to admin dashboard
    }

    // For regular users, render the content normally
    return <>{children}</>;
}




















