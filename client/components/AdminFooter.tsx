import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Shield,
    Users,
    CreditCard,
    PiggyBank,
    FileText,
    BarChart3,
    Settings,
    Activity,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    Eye,
    Edit,
    Download,
    Database,
    Bell,
    Mail,
    Calendar,
    Search,
    Filter,
    Plus,
    Home,
    Building2,
    UserCog,
    ClipboardList,
    PieChart,
    LineChart,
    MoreHorizontal,
    ExternalLink,
    HelpCircle,
    Info,
} from "lucide-react";

interface AdminFooterProps {
    user: any;
    isLoading?: boolean;
    className?: string;
    stats?: {
        users?: {
            total?: number;
            verified?: number;
            staff?: number;
            pending?: number;
        };
        loans?: {
            active?: number;
            totalAmount?: number;
            overdue?: number;
        };
        savings?: {
            totalAccounts?: number;
            totalBalance?: number;
        };
        applications?: {
            total?: number;
            pending?: number;
            approved?: number;
            rejected?: number;
        };
        transactions?: {
            total?: number;
            recent?: number;
        };
    };
}

export default function AdminFooter({ user, isLoading = false, className = "", stats }: AdminFooterProps) {
    // Don't render if loading or user is not admin/staff
    if (isLoading || !user || (user.role !== "admin" && user.role !== "staff")) {
        return null;
    }

    console.log('AdminFooter - Stats received:', stats);
    console.log('AdminFooter - Users:', stats?.users);
    console.log('AdminFooter - Loans:', stats?.loans);
    console.log('AdminFooter - Applications:', stats?.applications);

    const quickStats = [
        {
            label: "Total Users",
            value: stats?.users?.total !== undefined ? stats.users.total.toLocaleString() : "Loading...",
            icon: Users,
            color: "text-blue-600"
        },
        {
            label: "Active Loans",
            value: stats?.loans?.active !== undefined ? stats.loans.active.toLocaleString() : "Loading...",
            icon: CreditCard,
            color: "text-green-600"
        },
        {
            label: "Total Savings",
            value: stats?.savings?.totalBalance !== undefined ?
                (stats.savings.totalBalance > 0 ? `KSh ${(stats.savings.totalBalance / 1000000).toFixed(1)}M` : "KSh 0.0M") :
                "Loading...",
            icon: PiggyBank,
            color: "text-purple-600"
        },
        {
            label: "Pending Apps",
            value: stats?.applications?.pending !== undefined ? stats.applications.pending.toLocaleString() : "Loading...",
            icon: ClipboardList,
            color: "text-orange-600"
        },
    ];

    const quickActions = [
        { label: "New User", path: "/admin/users", icon: Plus },
        { label: "View Reports", path: "/admin/reports", icon: BarChart3 },
        { label: "Settings", path: "/admin/settings", icon: Settings },
    ];

    return (
        <div className={`bg-gray-900 text-white border-t border-gray-700 ${className}`}>
            {/* Quick Stats Bar */}
            <div className="bg-gray-800 py-3">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            {quickStats.map((stat, index) => {
                                const Icon = stat.icon;
                                return (
                                    <div key={index} className="flex items-center space-x-2">
                                        <Icon className={`h-4 w-4 ${stat.color}`} />
                                        <span className="text-sm font-medium">{stat.value}</span>
                                        <span className="text-xs text-gray-400">{stat.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className="bg-blue-700 text-white text-xs">
                                {user.role.toUpperCase()}
                            </Badge>
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>System Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Admin Panel Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Shield className="h-5 w-5 text-blue-400" />
                            <h3 className="font-semibold">Admin Panel</h3>
                        </div>
                        <p className="text-sm text-gray-400">
                            Heroes SACCO Management System
                        </p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>Version 1.0.0</span>
                            <span>•</span>
                            <span>Last Updated: Today</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Quick Actions</h3>
                        <div className="space-y-2">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <Button
                                        key={index}
                                        variant="ghost"
                                        size="sm"
                                        className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                                        asChild
                                    >
                                        <Link to={action.path} className="flex items-center space-x-2">
                                            <Icon className="h-4 w-4" />
                                            <span>{action.label}</span>
                                        </Link>
                                    </Button>
                                );
                            })}
                        </div>
                    </div>

                    {/* System Status */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">System Status</h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">Database</span>
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span className="text-green-400">Online</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">API Server</span>
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <span className="text-green-400">Online</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-400">SMS Service</span>
                                <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                    <span className="text-yellow-400">Limited</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Tools */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Admin Tools</h3>
                        <div className="space-y-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                                asChild
                            >
                                <Link to="/admin/settings" className="flex items-center space-x-2">
                                    <Settings className="h-4 w-4" />
                                    <span>System Settings</span>
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                                asChild
                            >
                                <Link to="/admin/reports" className="flex items-center space-x-2">
                                    <BarChart3 className="h-4 w-4" />
                                    <span>Analytics & Reports</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-6 pt-4">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center space-x-4">
                            <span>© 2024 Heroes SACCO. All rights reserved.</span>
                            <span>•</span>
                            <span>Admin Panel</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white"
                                asChild
                            >
                                <Link to="/admin/settings" className="flex items-center space-x-1">
                                    <Settings className="h-4 w-4" />
                                    <span>Settings</span>
                                </Link>
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white"
                                asChild
                            >
                                <Link to="/admin/reports" className="flex items-center space-x-1">
                                    <BarChart3 className="h-4 w-4" />
                                    <span>Reports</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
