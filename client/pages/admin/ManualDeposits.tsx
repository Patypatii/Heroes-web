import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import {
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    User,
    Calendar,
    CreditCard,
    AlertCircle,
    DollarSign
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function ManualDeposits() {
    const [manualTransactions, setManualTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
    const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
    const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
    const [adminNotes, setAdminNotes] = useState("");
    const [processing, setProcessing] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchManualTransactions();
    }, []);

    const fetchManualTransactions = async () => {
        try {
            setLoading(true);
            const response = await api('/admin/manual-deposits');
            setManualTransactions(response.data || []);
        } catch (error: any) {
            console.error("Error fetching manual transactions:", error);
            toast({
                title: "Error",
                description: "Failed to fetch manual transactions",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = manualTransactions.filter(transaction => {
        const matchesSearch = transaction.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.phone_number?.includes(searchTerm) ||
            transaction.deposit_reference?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = filterStatus === "all" || transaction.status === filterStatus;
        const matchesType = filterType === "all" || transaction.transaction_type === filterType;

        return matchesSearch && matchesStatus && matchesType;
    });

    const getStatusBadge = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
                return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
            case "failed":
                return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
        }
    };

    const handleApprovalAction = (deposit: any, action: 'approve' | 'reject') => {
        setSelectedDeposit(deposit);
        setApprovalAction(action);
        setAdminNotes("");
        setApprovalDialogOpen(true);
    };

    const confirmApproval = async () => {
        if (!selectedDeposit || !approvalAction) return;

        setProcessing(true);
        try {
            await api(`/manual-deposit/admin/${selectedDeposit.id}/status`, {
                method: "PUT",
                body: {
                    status: approvalAction,
                    adminNotes: adminNotes.trim() || undefined
                }
            });

            toast({
                title: "Success",
                description: `Manual transaction ${approvalAction}d successfully`,
            });

            // Refresh the list
            await fetchManualTransactions();

            // Close dialog
            setApprovalDialogOpen(false);
            setSelectedDeposit(null);
            setApprovalAction(null);
            setAdminNotes("");

        } catch (error: any) {
            console.error("Error updating manual deposit status:", error);
            toast({
                title: "Error",
                description: `Failed to ${approvalAction} manual deposit`,
                variant: "destructive",
            });
        } finally {
            setProcessing(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Manual Transactions</h1>
                <p className="text-gray-600">Review and approve manual deposit and withdrawal requests</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Pending</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {manualTransactions.filter(d => d.status === 'Pending').length}
                                </p>
                            </div>
                            <Clock className="h-8 w-8 text-yellow-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    KSH {manualTransactions.reduce((sum, d) => sum + Math.abs(parseFloat(d.amount || 0)), 0).toFixed(2)}
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Today's Requests</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {manualTransactions.filter(d => {
                                        const today = new Date().toDateString();
                                        return new Date(d.created_at).toDateString() === today;
                                    }).length}
                                </p>
                            </div>
                            <Calendar className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search by name, phone, or reference..."
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
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Types</option>
                                <option value="manual_deposit">Deposits</option>
                                <option value="manual_withdrawal">Withdrawals</option>
                            </select>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Manual Transactions List */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Manual Transaction Requests
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading manual transactions...</p>
                        </div>
                    ) : filteredTransactions.length === 0 ? (
                        <div className="text-center py-8">
                            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No manual transactions found</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredTransactions.map((transaction) => (
                                <div key={transaction.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <User className="h-4 w-4 text-gray-500" />
                                                <span className="font-medium text-gray-900">
                                                    {transaction.full_name || 'Unknown User'}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {transaction.phone_number}
                                                </span>
                                                {getStatusBadge(transaction.status)}
                                                <Badge className={transaction.transaction_type === 'manual_deposit' 
                                                    ? "bg-blue-100 text-blue-800" 
                                                    : "bg-orange-100 text-orange-800"}>
                                                    {transaction.transaction_type === 'manual_deposit' ? 'Deposit' : 'Withdrawal'}
                                                </Badge>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                                <div>
                                                    <span className="text-gray-500">Amount:</span>
                                                    <p className={`font-semibold ${transaction.transaction_type === 'manual_deposit' 
                                                        ? 'text-green-600' 
                                                        : 'text-red-600'}`}>
                                                        KSH {Math.abs(parseFloat(transaction.amount || 0)).toFixed(2)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Reference:</span>
                                                    <p className="font-mono">{transaction.deposit_reference}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Business Account:</span>
                                                    <p className="font-mono">{transaction.business_account_number}</p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Submitted:</span>
                                                    <p>{formatDate(transaction.created_at)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {transaction.status === 'Pending' && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprovalAction(transaction, 'approve')}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleApprovalAction(transaction, 'reject')}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Approval Dialog */}
            <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {approvalAction === 'approve' ? 'Approve' : 'Reject'} Manual Transaction
                        </DialogTitle>
                        <DialogDescription>
                            {approvalAction === 'approve' 
                                ? 'Are you sure you want to approve this manual transaction?'
                                : 'Are you sure you want to reject this manual transaction?'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    {selectedDeposit && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500">User:</span>
                                        <p className="font-medium">{selectedDeposit.full_name}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Amount:</span>
                                        <p className={`font-medium ${selectedDeposit.transaction_type === 'manual_deposit' 
                                            ? 'text-green-600' 
                                            : 'text-red-600'}`}>
                                            KSH {Math.abs(parseFloat(selectedDeposit.amount)).toFixed(2)}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Reference:</span>
                                        <p className="font-mono">{selectedDeposit.deposit_reference}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Account:</span>
                                        <p className="font-mono">{selectedDeposit.business_account_number}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Admin Notes {approvalAction === 'reject' && '(Required for rejection)'}
                                </label>
                                <Textarea
                                    placeholder={approvalAction === 'approve'
                                        ? 'Optional notes about this approval...'
                                        : 'Please provide a reason for rejection...'
                                    }
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={3}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setApprovalDialogOpen(false)}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmApproval}
                            disabled={processing || (approvalAction === 'reject' && !adminNotes.trim())}
                            className={approvalAction === 'approve'
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-red-600 hover:bg-red-700'
                            }
                        >
                            {processing ? 'Processing...' : `${approvalAction === 'approve' ? 'Approve' : 'Reject'} Transaction`}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
