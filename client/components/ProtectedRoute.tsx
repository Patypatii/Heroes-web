import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: ("admin" | "staff" | "member")[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  roles,
  requireAuth = true,
  redirectTo = "/login"
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log("🔍 ProtectedRoute - Auth state:", {
    isAuthenticated,
    hasUser: !!user,
    userRole: user?.role,
    isVerified: user?.isVerified,
    requireAuth,
    roles,
    isLoading
  });

  // Show loading state while authentication is being checked
  if (isLoading) {
    console.log("⏳ ProtectedRoute - Loading authentication state...");
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log("❌ ProtectedRoute - Redirecting to login: Not authenticated");
    return <Navigate to={redirectTo} replace />;
  }

  // If specific roles are required but user doesn't have the right role
  if (roles && user && !roles.includes(user.role || "member")) {
    console.log("❌ ProtectedRoute - Redirecting to home: Wrong role");
    return <Navigate to="/" replace />;
  }

  // If user is not verified and trying to access protected routes
  if (requireAuth && user && !user.isVerified) {
    console.log("❌ ProtectedRoute - Redirecting to login: User not verified");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ ProtectedRoute - Access granted");
  return children;
}
