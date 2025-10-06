import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";
import {
    PiggyBank,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    DollarSign,
    TrendingUp,
    User,
    Calendar,
    Plus,
    Minus
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export default function AdminSavings() {
    const [savings, setSavings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all");
    const navigate = useNavigate();

    useEffect(() => {
        fetchSavings();
    }, []);

    const fetchSavings = async () => {
        try {
            setLoading(true);
            const response = await api('/admin/savings');
            setSavings(response.data.savings || []);
        } catch (error: any) {
            console.error("Error fetching savings:", error);
            // Handle error - could show toast notification
        } finally {
            setLoading(false);
        }
    };

    const filteredSavings = savings.filter(saving => {
        const matchesSearch = saving.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            saving.phoneNumber.includes(searchTerm) ||
            saving.membershipNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            saving.accountType.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = filterType === "all" || saving.accountType.toLowerCase().includes(filterType.toLowerCase());

        return matchesSearch && matchesType;
    });

    const getAccountTypeBadge = (accountType: string) => {
        switch (accountType) {
            case "Regular Savings":
                return <Badge className="bg-blue-100 text-blue-800">{accountType}</Badge>;
            case "Fixed Deposit":
                return <Badge className="bg-purple-100 text-purple-800">{accountType}</Badge>;
            case "Emergency Fund":
                return <Badge className="bg-green-100 text-green-800">{accountType}</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">{accountType}</Badge>;
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
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Savings Management</h1>
                            <p className="text-gray-600">Monitor member savings accounts and transactions</p>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
                            <PiggyBank className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{savings.length}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(savings.reduce((sum, saving) => sum + saving.totalDeposits, 0))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(savings.reduce((sum, saving) => sum + saving.currentBalance, 0))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Interest Paid</CardTitle>
                            <Plus className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatCurrency(savings.reduce((sum, saving) => sum + saving.totalInterest, 0))}
                            </div>
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
                                        placeholder="Search savings by member name, phone, membership number, or account type..."
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
                                    variant={filterType === "regular" ? "default" : "outline"}
                                    onClick={() => setFilterType("regular")}
                                >
                                    Regular Savings
                                </Button>
                                <Button
                                    variant={filterType === "fixed" ? "default" : "outline"}
                                    onClick={() => setFilterType("fixed")}
                                >
                                    Fixed Deposit
                                </Button>
                                <Button
                                    variant={filterType === "emergency" ? "default" : "outline"}
                                    onClick={() => setFilterType("emergency")}
                                >
                                    Emergency Fund
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Savings Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Savings Accounts ({filteredSavings.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {filteredSavings.map((saving) => (
                                <div key={saving.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{saving.memberName}</h3>
                                            <p className="text-sm text-gray-500">{saving.phoneNumber}</p>
                                            <p className="text-sm text-gray-500">{saving.membershipNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-6">
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-gray-900">{formatCurrency(saving.currentBalance)}</p>
                                            <p className="text-sm text-gray-500">Current Balance</p>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-900">{saving.interestRate}% p.a.</p>
                                            <p className="text-sm text-gray-500">Interest Rate</p>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-900">
                                                {saving.monthlyDeposit > 0 ? formatCurrency(saving.monthlyDeposit) : 'N/A'}
                                            </p>
                                            <p className="text-sm text-gray-500">Monthly Deposit</p>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-sm font-medium text-gray-900">{formatCurrency(saving.totalInterest)}</p>
                                            <p className="text-sm text-gray-500">Interest Earned</p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            {getAccountTypeBadge(saving.accountType)}
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => navigate(`/admin/savings/${saving.id}`)}>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Record Deposit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Minus className="h-4 w-4 mr-2" />
                                                    Record Withdrawal
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

                            {filteredSavings.length === 0 && (
                                <div className="text-center py-8">
                                    <PiggyBank className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No savings accounts found</h3>
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
