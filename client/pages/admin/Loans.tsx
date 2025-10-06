import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import {
    CreditCard,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    DollarSign,
    Calendar,
    User,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export default function AdminLoans() {
    const [loans, setLoans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            setLoading(true);
            const response = await api('/admin/loans');
            console.log('Loans response:', response);
            console.log('Response structure:', {
                hasData: !!response.data,
                hasDataData: !!response.data?.data,
                hasLoans: !!response.data?.data?.loans,
                loansCount: response.data?.data?.loans?.length || 0,
                firstLoan: response.data?.data?.loans?.[0]
            });
            // Fix: Backend returns data in response.data.data.loans
            const loansData = response.data?.data?.loans || response.data?.loans || [];
            setLoans(loansData);
            console.log('Set loans:', loansData.length, 'loans');
        } catch (error: any) {
            console.error("Error fetching loans:", error);
            // Handle error - could show toast notification
        } finally {
            setLoading(false);
        }
    };

    const filteredLoans = loans.filter(loan => {
        const matchesSearch = (loan.borrowerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (loan.phoneNumber || '').includes(searchTerm) ||
            (loan.membershipNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (loan.loanType || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === "all" || loan.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "disbursed":
                return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
            case "completed":
                return <Badge className="bg-blue-100 text-blue-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
            case "overdue":
                return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="h-3 w-3 mr-1" />Overdue</Badge>;
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
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
            day: 'numeric'
        });
    };

    const getProgressPercentage = (paymentsMade: number, totalPayments: number) => {
        return Math.round((paymentsMade / totalPayments) * 100);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                        <div className="space-y-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Loan Management</h1>
                            <p className="text-gray-600">Monitor and manage active loans and payments</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {(() => {
                                    const activeLoans = loans.filter(l => l.status === "disbursed");
                                    console.log('Active loans calculation:', { totalLoans: loans.length, activeLoans: activeLoans.length, statuses: loans.map(l => l.status) });
                                    return activeLoans.length;
                                })()}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Overdue Loans</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{loans.filter(l => l.status === "overdue").length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(loans
                                    .filter(loan => loan.status === 'disbursed' || loan.status === 'overdue')
                                    .reduce((sum, loan) => sum + (loan.loanAmount || 0), 0)
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed Loans</CardTitle>
                            <CheckCircle className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{loans.filter(l => l.status === "completed").length}</div>
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
                                        placeholder="Search loans by borrower name, phone, membership number, or loan type..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={filterStatus === "all" ? "default" : "outline"}
                                    onClick={() => setFilterStatus("all")}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={filterStatus === "disbursed" ? "default" : "outline"}
                                    onClick={() => setFilterStatus("disbursed")}
                                >
                                    Active
                                </Button>
                                <Button
                                    variant={filterStatus === "overdue" ? "default" : "outline"}
                                    onClick={() => setFilterStatus("overdue")}
                                >
                                    Overdue
                                </Button>
                                <Button
                                    variant={filterStatus === "completed" ? "default" : "outline"}
                                    onClick={() => setFilterStatus("completed")}
                                >
                                    Completed
                                </Button>
                                <Button
                                    variant={filterStatus === "pending" ? "default" : "outline"}
                                    onClick={() => setFilterStatus("pending")}
                                >
                                    Pending
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Loans Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Loans ({filteredLoans.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredLoans.map((loan) => (
                                <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{loan.borrowerName}</h3>
                                            <p className="text-sm text-gray-500">{loan.phoneNumber}</p>
                                            <p className="text-sm text-gray-500">{loan.membershipNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6">
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-gray-900">{formatCurrency(loan.loanAmount || 0)}</p>
                                            <p className="text-sm text-gray-500">{loan.loanType || 'Personal Loan'}</p>
                                            {loan.totalCharges && (
                                                <p className="text-xs text-red-600">Charges: {formatCurrency(loan.totalCharges)}</p>
                                            )}
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-900">{formatCurrency(loan.remainingBalance || loan.loanAmount || 0)}</p>
                                            <p className="text-sm text-gray-500">Remaining Balance</p>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-900">{formatCurrency(loan.monthlyPayment || 0)}</p>
                                            <p className="text-sm text-gray-500">Monthly Payment</p>
                                        </div>

                                        <div className="text-center">
                                            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary-600 transition-all duration-300"
                                                    style={{ width: `${getProgressPercentage(loan.paymentsMade || 0, loan.totalPayments || 1)}%` }}
                                                ></div>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">{loan.paymentsMade || 0}/{loan.totalPayments || 1} payments</p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {getStatusBadge(loan.status)}
                                            {loan.overdueAmount && (
                                                <Badge className="bg-red-100 text-red-800">
                                                    {formatCurrency(loan.overdueAmount)} overdue
                                                </Badge>
                                            )}
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/admin/loans/${loan.id}`)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <DollarSign className="h-4 w-4 mr-2" />
                                                    Record Payment
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <TrendingUp className="h-4 w-4 mr-2" />
                                                    View History
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}

                            {filteredLoans.length === 0 && (
                                <div className="text-center py-8">
                                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No loans found</h3>
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
