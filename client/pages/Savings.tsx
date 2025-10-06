import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    PiggyBank,
    Plus,
    Minus,
    Eye,
    TrendingUp,
    DollarSign,
    Target,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface SavingsAccount {
    id: string;
    userId: string; // camelCase for consistency
    amount: number;
    interestRate: number; // camelCase for consistency
    startDate: string; // camelCase for consistency
    maturityDate?: string; // camelCase for consistency
    status: string;
    createdAt: string; // camelCase for consistency
    updatedAt: string; // camelCase for consistency
    depositMpesaId?: string; // camelCase for consistency
    withdrawalMpesaId?: string; // camelCase for consistency
}

interface SavingsStats {
    totalSavings: number;
    totalWithdrawals: number;
    activeSavings: number;
    interestEarned: number;
    nextMaturity?: string;
    netSavings: number;
}

export default function Savings() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [savingsAccounts, setSavingsAccounts] = useState<SavingsAccount[]>([]);
    const [savingsStats, setSavingsStats] = useState<SavingsStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        fetchSavingsData();
    }, [isAuthenticated, navigate]);

    const fetchSavingsData = async () => {
        try {
            setLoading(true);
            console.log("🔍 Fetching savings data...");

            const [accountsResponse, statsResponse] = await Promise.all([
                api("/savings"),
                api("/savings/stats")
            ]);

            console.log("📊 Accounts response:", accountsResponse);
            console.log("📊 Stats response:", statsResponse);
            console.log("📊 Accounts response.savings:", accountsResponse.savings);
            console.log("📊 Stats response.stats:", statsResponse.stats);

            // Check if the response structure is correct
            if (accountsResponse.savings) {
                console.log("✅ Found savings array with", accountsResponse.savings.length, "items");
                console.log("📋 First savings item:", accountsResponse.savings[0]);
            } else {
                console.log("❌ No savings array found in response");
            }

            if (statsResponse.stats) {
                console.log("✅ Found stats object:", statsResponse.stats);
            } else {
                console.log("❌ No stats object found in response");
            }

            setSavingsAccounts(accountsResponse.savings || []);

            // Handle stats response - provide default values if stats is null or empty
            const stats = statsResponse.stats || {
                totalSavings: 0,
                totalWithdrawals: 0,
                activeSavings: 0,
                interestEarned: 0,
                nextMaturity: null,
                netSavings: 0
            };
            setSavingsStats(stats);
        } catch (error: any) {
            console.error("❌ Error fetching savings data:", error);
            toast({
                title: "Error",
                description: "Failed to load savings data",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const createTestData = async () => {
        try {
            console.log("🧪 Creating test savings data...");
            const response = await api("/savings/test", { method: "POST" });
            console.log("✅ Test data created:", response);

            toast({
                title: "Success",
                description: "Test savings data created successfully",
            });

            // Refresh the data
            fetchSavingsData();
        } catch (error: any) {
            console.error("❌ Error creating test data:", error);
            toast({
                title: "Error",
                description: "Failed to create test data",
                variant: "destructive",
            });
        }
    };

    const formatCurrency = (amount: number) => {
        if (isNaN(amount) || amount === null || amount === undefined) {
            return "Ksh 0.00";
        }
        return new Intl.NumberFormat("en-KE", {
            style: "currency",
            currency: "KES",
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleDateString("en-KE", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-green-100 text-green-800";
            case "paused":
                return "bg-yellow-100 text-yellow-800";
            case "closed":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleDeposit = async (accountId: string) => {
        try {
            // This would typically open a deposit modal
            toast({
                title: "Deposit",
                description: "Deposit feature coming soon!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to initiate deposit",
                variant: "destructive",
            });
        }
    };

    const handleWithdraw = async (accountId: string) => {
        try {
            // This would typically open a withdrawal modal
            toast({
                title: "Withdrawal",
                description: "Withdrawal feature coming soon!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to initiate withdrawal",
                variant: "destructive",
            });
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Savings</h1>
                            <p className="text-gray-600">
                                Manage your savings accounts and track your progress
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex space-x-2">
                            <Button
                                onClick={() => navigate("/savings/new")}
                                className="w-full sm:w-auto"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Savings Account
                            </Button>
                            <Button
                                onClick={createTestData}
                                variant="outline"
                                className="w-full sm:w-auto"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Test Data
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Balance
                            </CardTitle>
                            <PiggyBank className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-24" />
                            ) : (
                                <div className="text-2xl font-bold text-green-600">
                                    {formatCurrency(savingsStats?.totalSavings || 0)}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Deposits
                            </CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-24" />
                            ) : (
                                <div className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(savingsStats?.totalSavings || 0)}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Withdrawals
                            </CardTitle>
                            <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-24" />
                            ) : (
                                <div className="text-2xl font-bold text-orange-600">
                                    {formatCurrency(savingsStats?.totalWithdrawals || 0)}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Monthly Goal
                            </CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-24" />
                            ) : (
                                <div className="text-2xl font-bold">
                                    {formatCurrency(savingsStats?.netSavings || 0)}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Progress Bar */}
                {savingsStats && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Monthly Savings Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Net Savings</span>
                                    <span className="font-medium">
                                        {formatCurrency(savingsStats.netSavings || 0)}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-green-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${Math.min((savingsStats.netSavings || 0) / 10000 * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>0</span>
                                    <span>{formatCurrency(10000)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Savings Accounts */}
                <Card>
                    <CardHeader>
                        <CardTitle>Savings Accounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4 p-6 border rounded-lg">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                ))}
                            </div>
                        ) : savingsAccounts.length > 0 ? (
                            <div className="space-y-4">
                                {savingsAccounts.map((account) => (
                                    <div
                                        key={account.id}
                                        className="flex flex-col lg:flex-row lg:items-center justify-between p-6 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start space-x-4 mb-4 lg:mb-0">
                                            <div className="p-3 rounded-full bg-blue-100">
                                                <PiggyBank className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Savings Account {account.id.slice(-4)}
                                                    </h3>
                                                    <Badge className={getStatusColor(account.status)}>
                                                        {account.status}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Balance:</span> {formatCurrency(account.amount || 0)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Interest Rate:</span> {account.interestRate || 0}%
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Created:</span> {formatDate(account.createdAt)}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Start Date:</span> {formatDate(account.startDate)}
                                                    </div>
                                                    {account.maturityDate && (
                                                        <div>
                                                            <span className="font-medium">Maturity:</span> {formatDate(account.maturityDate)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/savings/${account.id}`)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View Details
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => handleDeposit(account.id)}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Deposit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleWithdraw(account.id)}
                                                className="border-orange-600 text-orange-600 hover:bg-orange-50"
                                            >
                                                <Minus className="h-4 w-4 mr-1" />
                                                Withdraw
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <PiggyBank className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No savings accounts found
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Start your savings journey by creating your first savings account!
                                </p>
                                <Button onClick={() => navigate("/savings/new")}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Savings Account
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    );
}

