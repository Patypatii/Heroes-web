import { useAuth } from "@/context/AuthContext";

interface DefaultMemberViewProps {
    children?: React.ReactNode;
}

export default function DefaultMemberView({ children }: DefaultMemberViewProps) {
    const { user, isLoading } = useAuth();

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If user is authenticated, show the children (regular content)
    if (user) {
        // For admin users, show admin-specific layout
        if (user.role === 'admin' || user.role === 'staff') {
            return (
                <div className="min-h-screen bg-gray-50">
                    {children}
                </div>
            );
        }

        // For regular members, show normal content
        return <>{children}</>;
    }

    // For unauthenticated users, render the children (marketing content from parent)
    return <>{children}</>;
}
