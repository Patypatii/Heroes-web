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
    CreditCard,
    Plus,
    Eye,
    Calendar,
    DollarSign,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    XCircle,
    Clock,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Loan {
    id: string;
    amount: number;
    interestRate: number; // camelCase for consistency
    status: string;
    dueDate: string; // camelCase for consistency
    createdAt: string; // camelCase for consistency
    approvedAt?: string; // camelCase for consistency
    disbursedAt?: string; // camelCase for consistency
    repaidAt?: string; // camelCase for consistency
}

export default function Loans() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loans, setLoans] = useState<Loan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        fetchLoans();
    }, [isAuthenticated, navigate]);

    const fetchLoans = async () => {
        try {
            setLoading(true);
            console.log("🔍 Fetching loans...");
            const response = await api("/loans");
            console.log("📊 Loans API response:", response);
            console.log("📊 Response success:", response.success);
            console.log("📊 Response loans:", response.loans);
            setLoans(response.loans || []);
        } catch (error: any) {
            console.error("❌ Error fetching loans:", error);
            console.error("❌ Error details:", error.message);

            // Enhanced error handling
            let errorMessage = "Failed to load loans";
            if (error.message) {
                try {
                    const errorData = JSON.parse(error.message);
                    errorMessage = errorData.message || errorMessage;
                } catch {
                    errorMessage = error.message;
                }
            }

            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
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

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved":
            case "disbursed":
                return <CheckCircle className="h-5 w-5 text-green-600" />;
            case "pending":
                return <Clock className="h-5 w-5 text-yellow-600" />;
            case "rejected":
                return <XCircle className="h-5 w-5 text-red-600" />;
            case "overdue":
                return <AlertCircle className="h-5 w-5 text-red-600" />;
            default:
                return <Clock className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved":
            case "disbursed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            case "overdue":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "Under Review";
            case "approved":
                return "Approved";
            case "disbursed":
                return "Disbursed";
            case "rejected":
                return "Rejected";
            case "overdue":
                return "Overdue";
            case "repaid":
                return "Repaid";
            default:
                return status;
        }
    };

    const canRepay = (loan: Loan) => {
        return loan.status === "disbursed" || loan.status === "overdue";
    };

    const handleRepay = async (loanId: string) => {
        try {
            // This would typically open a repayment modal or redirect to repayment page
            toast({
                title: "Repayment",
                description: "Repayment feature coming soon!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to initiate repayment",
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Loans</h1>
                            <p className="text-gray-600">
                                Manage your loan applications and repayments
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0">
                            <Button
                                onClick={() => navigate("/apply")}
                                className="w-full sm:w-auto"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Apply for Loan
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Loans
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <div className="text-2xl font-bold">
                                    {loans.length}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Active Loans
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <div className="text-2xl font-bold text-green-600">
                                    {loans.filter(loan => loan.status === "disbursed" || loan.status === "overdue").length}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Amount
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-24" />
                            ) : (
                                <div className="text-2xl font-bold">
                                    {formatCurrency(loans.reduce((sum, loan) => sum + (loan.amount || 0), 0))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Loans List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Loan Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                        <Skeleton className="h-6 w-20" />
                                    </div>
                                ))}
                            </div>
                        ) : loans.length > 0 ? (
                            <div className="space-y-4">
                                {loans.map((loan) => (
                                    <div
                                        key={loan.id}
                                        className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start space-x-4 mb-4 sm:mb-0">
                                            <div className="p-3 rounded-full bg-gray-100">
                                                {getStatusIcon(loan.status)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        {formatCurrency(loan.amount)}
                                                    </h3>
                                                    <Badge className={getStatusColor(loan.status)}>
                                                        {getStatusText(loan.status)}
                                                    </Badge>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <span className="font-medium">Interest Rate:</span> {loan.interestRate || 0}%
                                                    </div>
                                                    <div>
                                                        <span className="font-medium">Applied:</span> {formatDate(loan.createdAt)}
                                                    </div>
                                                    {loan.dueDate && (
                                                        <div>
                                                            <span className="font-medium">Due Date:</span> {formatDate(loan.dueDate)}
                                                        </div>
                                                    )}
                                                    {loan.approvedAt && (
                                                        <div>
                                                            <span className="font-medium">Approved:</span> {formatDate(loan.approvedAt)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => navigate(`/loans/${loan.id}`)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View Details
                                            </Button>
                                            {canRepay(loan) && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleRepay(loan.id)}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <DollarSign className="h-4 w-4 mr-1" />
                                                    Repay
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <CreditCard className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No loans found
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    You haven't applied for any loans yet. Apply now to get started!
                                </p>
                                <Button onClick={() => navigate("/apply")}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Apply for Loan
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

