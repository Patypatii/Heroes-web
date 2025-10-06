import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DefaultMemberView from "@/components/DefaultMemberView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    CreditCard,
    PiggyBank,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Plus,
    RefreshCw,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface DashboardData {
    totalBalance: number;
    totalSavings: number;
    totalLoans: number;
    recentTransactions: Array<{
        id: string;
        title: string;
        amount: number;
        type: string;
        status: string;
        date: string;
    }>;
    activeLoans: Array<{
        id: string;
        amount: number;
        status: string;
        dueDate: string;
    }>;
    savingsAccounts: Array<{
        id: string;
        amount: number;
        status: string;
        interestRate: number;
    }>;
}

export default function Dashboard() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        fetchDashboardData();
    }, [isAuthenticated, navigate]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Fetch dashboard data from backend
            const response = await api("/dashboard");
            setDashboardData(response);
        } catch (error: any) {
            console.error("Error fetching dashboard data:", error);
            toast({
                title: "Error",
                description: "Failed to load dashboard data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency: "KES",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-KE", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
            case "active":
            case "approved":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "failed":
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <DefaultMemberView>
            <div className="min-h-screen bg-gray-50">
                <Header />

                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    {/* Welcome Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Welcome back, {user?.fullName || "User"}!
                        </h1>
                        <p className="text-gray-600">
                            Here's an overview of your financial accounts
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Total Balance */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Total Balance
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <Skeleton className="h-8 w-24" />
                                ) : (
                                    <div className="text-2xl font-bold text-green-600">
                                        {formatCurrency(dashboardData?.totalBalance || 0)}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Total Savings */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Total Savings
                                </CardTitle>
                                <PiggyBank className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <Skeleton className="h-8 w-24" />
                                ) : (
                                    <div className="text-2xl font-bold text-blue-600">
                                        {formatCurrency(dashboardData?.totalSavings || 0)}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Active Loans */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Active Loans
                                </CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <Skeleton className="h-8 w-24" />
                                ) : (
                                    <div className="text-2xl font-bold text-orange-600">
                                        {formatCurrency(dashboardData?.totalLoans || 0)}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    Quick Actions
                                </CardTitle>
                                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="flex space-x-2">
                                    <Button
                                        size="sm"
                                        onClick={() => navigate("/loans")}
                                        className="flex-1"
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Apply
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => navigate("/savings")}
                                        className="flex-1"
                                    >
                                        <PiggyBank className="h-4 w-4 mr-1" />
                                        Save
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Transactions */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle>Recent Transactions</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate("/transactions")}
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        View All
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="space-y-4">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="flex items-center space-x-4">
                                                    <Skeleton className="h-10 w-10 rounded-full" />
                                                    <div className="space-y-2 flex-1">
                                                        <Skeleton className="h-4 w-3/4" />
                                                        <Skeleton className="h-3 w-1/2" />
                                                    </div>
                                                    <Skeleton className="h-4 w-16" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : dashboardData?.recentTransactions?.length ? (
                                        <div className="space-y-4">
                                            {dashboardData.recentTransactions.slice(0, 5).map((transaction) => (
                                                <div
                                                    key={transaction.id}
                                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 rounded-full bg-gray-100">
                                                            {transaction.type === "deposit" ? (
                                                                <ArrowUpRight className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <ArrowDownRight className="h-4 w-4 text-red-600" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {transaction.title}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {formatDate(transaction.date)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p
                                                            className={`font-medium ${transaction.type === "deposit"
                                                                ? "text-green-600"
                                                                : "text-red-600"
                                                                }`}
                                                        >
                                                            {transaction.type === "deposit" ? "+" : "-"}
                                                            {formatCurrency(transaction.amount)}
                                                        </p>
                                                        <Badge
                                                            className={`text-xs ${getStatusColor(transaction.status)}`}
                                                        >
                                                            {transaction.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                            <p>No recent transactions</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => navigate("/transactions")}
                                            >
                                                View All Transactions
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar - Active Loans & Savings */}
                        <div className="space-y-6">
                            {/* Active Loans */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">Active Loans</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate("/loans")}
                                    >
                                        View All
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="space-y-3">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="space-y-2">
                                                    <Skeleton className="h-4 w-3/4" />
                                                    <Skeleton className="h-3 w-1/2" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : dashboardData?.activeLoans?.length ? (
                                        <div className="space-y-3">
                                            {dashboardData.activeLoans.slice(0, 3).map((loan) => (
                                                <div
                                                    key={loan.id}
                                                    className="p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
                                                    onClick={() => navigate(`/loans/${loan.id}`)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {formatCurrency(loan.amount)}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                Due: {formatDate(loan.dueDate)}
                                                            </p>
                                                        </div>
                                                        <Badge className={getStatusColor(loan.status)}>
                                                            {loan.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                            <p className="text-sm">No active loans</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => navigate("/loans")}
                                            >
                                                Apply Now
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Savings Accounts */}
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">Savings Accounts</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => navigate("/savings")}
                                    >
                                        View All
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {loading ? (
                                        <div className="space-y-3">
                                            {[...Array(3)].map((_, i) => (
                                                <div key={i} className="space-y-2">
                                                    <Skeleton className="h-4 w-3/4" />
                                                    <Skeleton className="h-3 w-1/2" />
                                                </div>
                                            ))}
                                        </div>
                                    ) : dashboardData?.savingsAccounts?.length ? (
                                        <div className="space-y-3">
                                            {dashboardData.savingsAccounts.slice(0, 3).map((savings) => (
                                                <div
                                                    key={savings.id}
                                                    className="p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer"
                                                    onClick={() => navigate(`/savings/${savings.id}`)}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {formatCurrency(savings.amount)}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {savings.interestRate}% interest
                                                            </p>
                                                        </div>
                                                        <Badge className={getStatusColor(savings.status)}>
                                                            {savings.status}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            <PiggyBank className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                            <p className="text-sm">No savings accounts</p>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="mt-2"
                                                onClick={() => navigate("/savings")}
                                            >
                                                Start Saving
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </DefaultMemberView>
    );
}


