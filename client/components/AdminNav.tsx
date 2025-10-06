import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Users,
    CreditCard,
    PiggyBank,
    FileText,
    BarChart3,
    Settings,
    Shield,
    AlertCircle,
    CheckCircle,
    Clock,
    UserCheck,
    DollarSign,
    TrendingUp,
    Activity,
    Eye,
    Edit,
    Download,
    RefreshCw,
    Home,
    Building2,
    UserCog,
    ClipboardList,
    PieChart,
    LineChart,
    Database,
    Bell,
    Mail,
    Calendar,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
} from "lucide-react";

interface AdminNavProps {
    user: any;
    isLoading?: boolean;
    className?: string;
}

export default function AdminNav({ user, isLoading = false, className = "" }: AdminNavProps) {
    const location = useLocation();

    console.log("🔍 AdminNav - Props:", { user, isLoading, userRole: user?.role });
    console.log("🔍 AdminNav - User object:", user);

    // Don't render if loading or user is not admin/staff
    if (isLoading || !user || (user.role !== "admin" && user.role !== "staff")) {
        console.log("🔍 AdminNav - Not rendering:", {
            isLoading,
            hasUser: !!user,
            userRole: user?.role,
            isAdmin: user?.role === "admin",
            isStaff: user?.role === "staff"
        });
        return null;
    }

    console.log("🔍 AdminNav - Rendering admin navigation");

    const isActive = (path: string) => location.pathname === path;
    const isAdminActive = (path: string) => location.pathname.startsWith(path);

    const adminNavItems = [
        {
            label: "Dashboard",
            path: "/admin",
            icon: BarChart3,
            description: "Overview & Analytics"
        },
        {
            label: "Users",
            path: "/admin/users",
            icon: Users,
            description: "Manage Members"
        },
        {
            label: "Applications",
            path: "/admin/applications",
            icon: ClipboardList,
            description: "Loan Applications"
        },
        {
            label: "Loans",
            path: "/admin/loans",
            icon: CreditCard,
            description: "Loan Management"
        },
        {
            label: "Savings",
            path: "/admin/savings",
            icon: PiggyBank,
            description: "Savings Management"
        },
        {
            label: "Transactions",
            path: "/admin/transactions",
            icon: FileText,
            description: "All Transactions"
        },
        {
            label: "Manual Transactions",
            path: "/admin/manual-deposits",
            icon: DollarSign,
            description: "Approve Manual Transactions"
        },
        {
            label: "Reports",
            path: "/admin/reports",
            icon: PieChart,
            description: "Analytics & Reports"
        },
        {
            label: "Settings",
            path: "/admin/settings",
            icon: Settings,
            description: "System Settings"
        }
    ];

    return (
        <div className={`bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg ${className}`}>
            {/* Admin Banner */}
            <div className="bg-blue-900 py-2">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Shield className="h-5 w-5" />
                        <span className="font-semibold text-sm">
                            {user.role === "admin" ? "Administrator Panel" : "Staff Panel"}
                        </span>
                        <Badge variant="secondary" className="bg-blue-700 text-white text-xs">
                            {user.role.toUpperCase()}
                        </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-xs">
                        <span>Welcome, {user.fullName}</span>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span>Online</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Admin Navigation */}
            <div className="container mx-auto px-4">
                <nav className="flex items-center space-x-1 py-3 overflow-x-auto">
                    {/* Quick Actions */}
                    <div className="flex items-center space-x-2 mr-6">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-blue-700 hover:text-white"
                            asChild
                        >
                            <Link to="/admin">
                                <Home className="h-4 w-4 mr-1" />
                                Home
                            </Link>
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-blue-700 hover:text-white"
                            asChild
                        >
                            <Link to="/admin/users">
                                <Plus className="h-4 w-4 mr-1" />
                                New User
                            </Link>
                        </Button>
                    </div>

                    {/* Main Navigation Items */}
                    {adminNavItems.map((item) => {
                        const Icon = item.icon;
                        const active = isAdminActive(item.path);

                        return (
                            <Button
                                key={item.path}
                                size="sm"
                                variant={active ? "secondary" : "ghost"}
                                className={`text-sm font-medium transition-colors ${active
                                    ? "bg-white text-blue-800 hover:bg-gray-100"
                                    : "text-white hover:bg-blue-700 hover:text-white"
                                    }`}
                                asChild
                            >
                                <Link to={item.path} className="flex items-center space-x-2">
                                    <Icon className="h-4 w-4" />
                                    <span>{item.label}</span>
                                </Link>
                            </Button>
                        );
                    })}

                    {/* Admin Tools */}
                    <div className="flex items-center space-x-2 ml-6 pl-6 border-l border-blue-500">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-blue-700 hover:text-white"
                            title="Refresh Data"
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-blue-700 hover:text-white"
                            title="Notifications"
                        >
                            <Bell className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-blue-700 hover:text-white"
                            title="Search"
                        >
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                </nav>
            </div>
        </div>
    );
}
