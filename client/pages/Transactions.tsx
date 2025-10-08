import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Download,
    RefreshCw,
    Calendar,
    CreditCard,
    PiggyBank,
    DollarSign,
    Eye,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
    id: string;
    title: string;
    description?: string;
    amount: number;
    type: "deposit" | "withdrawal" | "loan" | "repayment" | "interest" | "fee";
    status: "completed" | "pending" | "failed" | "cancelled";
    category: string;
    date: string;
    reference?: string;
    accountId?: string;
    accountName?: string;
}

interface TransactionSummary {
    totalDeposits: number;
    totalWithdrawals: number;
    totalLoans: number;
    totalRepayments: number;
    netAmount: number;
    transactionCount: number;
}

export default function Transactions() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [summary, setSummary] = useState<TransactionSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<string>("all");
    const [filterStatus, setFilterStatus] = useState<string>("all");

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
        fetchTransactions();
    }, [isAuthenticated, navigate]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const [transactionsResponse, summaryResponse] = await Promise.all([
                api(`/transactions/${user?.id}`),
                api(`/transactions/summary/${user?.id}`)
            ]);
            console.log('Transactions response:', transactionsResponse);
            console.log('Summary response:', summaryResponse);

            // Transform backend transaction format to frontend format
            const transformedTransactions = (transactionsResponse || []).map((txn: any) => ({
                id: txn.id,
                title: txn.title,
                description: txn.description,
                amount: Math.abs(parseFloat(txn.amount)),
                type: mapTransactionType(txn.transaction_type, txn.category),
                status: txn.status?.toLowerCase() || 'pending',
                category: txn.category || '',
                date: txn.created_at || txn.transaction_date,
                reference: txn.mpesa_receipt_number || txn.reference_number,
            }));

            setTransactions(transformedTransactions);
            setSummary(summaryResponse);
            console.log('Summary state set to:', summaryResponse);
        } catch (error: any) {
            console.error("Error fetching transactions:", error);
            toast({
                title: "Error",
                description: "Failed to load transactions",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Helper function to map transaction_type to display type
    const mapTransactionType = (transactionType: string, category?: string): "deposit" | "withdrawal" | "loan" | "repayment" | "interest" | "fee" => {
        switch (transactionType) {
            case 'deposit':
            case 'manual_deposit':
            case 'savings_deposit':
                return 'deposit';
            case 'withdrawal':
            case 'manual_withdrawal':
            case 'savings_withdrawal':
                return 'withdrawal';
            case 'loan_disbursement':
                return 'loan';
            case 'loan_repayment':
                return 'repayment';
            case 'interest':
                return 'interest';
            case 'fee':
                return 'fee';
            default:
                // Fallback to category if available
                if (category === 'deposit') return 'deposit';
                if (category === 'withdrawal') return 'withdrawal';
                return 'deposit';
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
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case "deposit":
                return <ArrowUpRight className="h-5 w-5 text-green-600" />;
            case "withdrawal":
                return <ArrowDownRight className="h-5 w-5 text-red-600" />;
            case "loan":
                return <CreditCard className="h-5 w-5 text-blue-600" />;
            case "repayment":
                return <DollarSign className="h-5 w-5 text-purple-600" />;
            case "interest":
                return <PiggyBank className="h-5 w-5 text-yellow-600" />;
            case "fee":
                return <DollarSign className="h-5 w-5 text-gray-600" />;
            default:
                return <DollarSign className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "failed":
                return "bg-red-100 text-red-800";
            case "cancelled":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "deposit":
                return "text-green-600";
            case "withdrawal":
                return "text-red-600";
            case "loan":
                return "text-blue-600";
            case "repayment":
                return "text-purple-600";
            case "interest":
                return "text-yellow-600";
            case "fee":
                return "text-gray-600";
            default:
                return "text-gray-600";
        }
    };

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === "all" || transaction.type === filterType;
        const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    const handleExport = () => {
        // This would typically export transactions to CSV or PDF
        toast({
            title: "Export",
            description: "Export feature coming soon!",
        });
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Transactions</h1>
                            <p className="text-gray-600">
                                View and manage your transaction history
                            </p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex space-x-2">
                            <Button
                                variant="outline"
                                onClick={handleExport}
                                className="w-full sm:w-auto"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                            <Button
                                variant="outline"
                                onClick={fetchTransactions}
                                className="w-full sm:w-auto"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                                <div className="text-2xl font-bold text-green-600">
                                    {console.log('Rendering totalDeposits:', summary?.totalDeposits)}
                                    {formatCurrency(summary?.totalDeposits || 0)}
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
                                <div className="text-2xl font-bold text-red-600">
                                    {formatCurrency(summary?.totalWithdrawals || 0)}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Net Amount
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-24" />
                            ) : (
                                <div className={`text-2xl font-bold ${(summary?.netAmount || 0) >= 0 ? "text-green-600" : "text-red-600"
                                    }`}>
                                    {formatCurrency(summary?.netAmount || 0)}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">
                                Total Transactions
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <div className="text-2xl font-bold">
                                    {summary?.transactionCount || 0}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search transactions..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Types</option>
                                    <option value="deposit">Deposits</option>
                                    <option value="withdrawal">Withdrawals</option>
                                    <option value="loan">Loans</option>
                                    <option value="repayment">Repayments</option>
                                    <option value="interest">Interest</option>
                                    <option value="fee">Fees</option>
                                </select>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                    <option value="failed">Failed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Transactions List */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Transaction History
                            {filteredTransactions.length !== transactions.length && (
                                <span className="text-sm font-normal text-gray-500 ml-2">
                                    ({filteredTransactions.length} of {transactions.length})
                                </span>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-4">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                ))}
                            </div>
                        ) : filteredTransactions.length > 0 ? (
                            <div className="space-y-4">
                                {filteredTransactions.map((transaction) => (
                                    <div
                                        key={transaction.id}
                                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 rounded-full bg-gray-100">
                                                {getTransactionIcon(transaction.type)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h3 className="font-medium text-gray-900">
                                                        {transaction.title}
                                                    </h3>
                                                    <Badge className={getStatusColor(transaction.status)}>
                                                        {transaction.status}
                                                    </Badge>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {transaction.description && (
                                                        <p className="mb-1">{transaction.description}</p>
                                                    )}
                                                    <div className="flex items-center space-x-4">
                                                        <span className="capitalize">{transaction.type}</span>
                                                        <span>•</span>
                                                        <span>{transaction.category}</span>
                                                        <span>•</span>
                                                        <span>{formatDate(transaction.date)}</span>
                                                        {transaction.reference && (
                                                            <>
                                                                <span>•</span>
                                                                <span>Ref: {transaction.reference}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    {transaction.accountName && (
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            Account: {transaction.accountName}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className={`text-lg font-semibold ${getTypeColor(transaction.type)}`}>
                                                {transaction.type === "deposit" || transaction.type === "interest" ? "+" : "-"}
                                                {formatCurrency(transaction.amount)}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigate(`/transactions/${transaction.id}`)}
                                                className="text-gray-500 hover:text-gray-700"
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No transactions found
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    {searchTerm || filterType !== "all" || filterStatus !== "all"
                                        ? "Try adjusting your search or filters"
                                        : "You haven't made any transactions yet"}
                                </p>
                                {searchTerm || filterType !== "all" || filterStatus !== "all" ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearchTerm("");
                                            setFilterType("all");
                                            setFilterStatus("all");
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                ) : (
                                    <div className="flex space-x-2 justify-center">
                                        <Button onClick={() => navigate("/savings")}>
                                            <PiggyBank className="h-4 w-4 mr-2" />
                                            Start Saving
                                        </Button>
                                        <Button variant="outline" onClick={() => navigate("/loans")}>
                                            <CreditCard className="h-4 w-4 mr-2" />
                                            Apply for Loan
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Footer />
        </div>
    );
}


