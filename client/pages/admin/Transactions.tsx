import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import {
    BarChart3,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    DollarSign,
    TrendingUp,
    TrendingDown,
    User,
    Calendar,
    CreditCard,
    PiggyBank,
    ArrowUpRight,
    ArrowDownLeft
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await api('/admin/transactions');
            setTransactions(response.data.transactions || []);
        } catch (error: any) {
            console.error("Error fetching transactions:", error);
            // Handle error - could show toast notification
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(transaction => {
        const matchesSearch = transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.phoneNumber.includes(searchTerm) ||
            transaction.membershipNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === "all" || transaction.transactionType === filterType;

        return matchesSearch && matchesType;
    });

    const getTransactionTypeBadge = (type: string) => {
        switch (type) {
            case "deposit":
                return <Badge className="bg-green-100 text-green-800"><ArrowDownLeft className="h-3 w-3 mr-1" />Deposit</Badge>;
            case "withdrawal":
                return <Badge className="bg-red-100 text-red-800"><ArrowUpRight className="h-3 w-3 mr-1" />Withdrawal</Badge>;
            case "loan_disbursement":
                return <Badge className="bg-blue-100 text-blue-800"><CreditCard className="h-3 w-3 mr-1" />Loan Disbursement</Badge>;
            case "loan_payment":
                return <Badge className="bg-purple-100 text-purple-800"><PiggyBank className="h-3 w-3 mr-1" />Loan Payment</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">{type}</Badge>;
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
            case "failed":
                return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
        }
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case "deposit":
                return <TrendingUp className="h-4 w-4 text-green-600" />;
            case "withdrawal":
                return <TrendingDown className="h-4 w-4 text-red-600" />;
            case "loan_disbursement":
                return <CreditCard className="h-4 w-4 text-blue-600" />;
            case "loan_payment":
                return <PiggyBank className="h-4 w-4 text-purple-600" />;
            default:
                return <DollarSign className="h-4 w-4 text-gray-600" />;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-KE', {
            style: 'currency',
            currency: 'KES'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-KE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-20 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Transaction Management</h1>
                            <p className="text-gray-600">Monitor and manage all system transactions</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{transactions.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(transactions
                                    .filter(t => t.transactionType === "deposit" && t.status === "completed")
                                    .reduce((sum, t) => sum + t.amount, 0))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
                            <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(transactions
                                    .filter(t => t.transactionType === "withdrawal" && t.status === "completed")
                                    .reduce((sum, t) => sum + t.amount, 0))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{transactions.filter(t => t.status === "pending").length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Filter & Search</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        placeholder="Search transactions by member name, phone, reference, or description..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={filterType === "all" ? "default" : "outline"}
                                    onClick={() => setFilterType("all")}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={filterType === "deposit" ? "default" : "outline"}
                                    onClick={() => setFilterType("deposit")}
                                >
                                    Deposits
                                </Button>
                                <Button
                                    variant={filterType === "withdrawal" ? "default" : "outline"}
                                    onClick={() => setFilterType("withdrawal")}
                                >
                                    Withdrawals
                                </Button>
                                <Button
                                    variant={filterType === "loan_disbursement" ? "default" : "outline"}
                                    onClick={() => setFilterType("loan_disbursement")}
                                >
                                    Loan Disbursements
                                </Button>
                                <Button
                                    variant={filterType === "loan_payment" ? "default" : "outline"}
                                    onClick={() => setFilterType("loan_payment")}
                                >
                                    Loan Payments
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Transactions Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredTransactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            {getTransactionIcon(transaction.transactionType)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{transaction.memberName}</h3>
                                            <p className="text-sm text-gray-500">{transaction.phoneNumber}</p>
                                            <p className="text-sm text-gray-500">{transaction.membershipNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6">
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-gray-900">{formatCurrency(transaction.amount)}</p>
                                            <p className="text-sm text-gray-500">{transaction.description}</p>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-900">{transaction.reference}</p>
                                            <p className="text-sm text-gray-500">Reference</p>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-900">{formatDate(transaction.timestamp)}</p>
                                            <p className="text-sm text-gray-500">Date & Time</p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {getTransactionTypeBadge(transaction.transactionType)}
                                            {getStatusBadge(transaction.status)}
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/admin/transactions/${transaction.id}`)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <User className="h-4 w-4 mr-2" />
                                                    View Member
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <BarChart3 className="h-4 w-4 mr-2" />
                                                    Transaction History
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}

                            {filteredTransactions.length === 0 && (
                                <div className="text-center py-8">
                                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
