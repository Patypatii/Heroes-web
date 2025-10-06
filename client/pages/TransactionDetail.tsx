import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ReceiptText, Calendar, DollarSign, CreditCard, PiggyBank, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string;
  status: string;
  date: string;
  reference: string;
  category: string;
  balance: number;
}

export default function TransactionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await api(`/transactions/detail/${id}`);
        if (response.success) {
          setTransaction(response.transaction);
        } else {
          toast({
            title: "Error",
            description: "Failed to load transaction details",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching transaction details:", error);
        toast({
          title: "Error",
          description: "Failed to load transaction details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading transaction details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Transaction Not Found</h1>
            <p className="text-gray-600 mb-6">The requested transaction could not be found.</p>
            <Button onClick={() => navigate("/transactions")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Transactions
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'deposit':
        return <ArrowDownLeft className="h-8 w-8 text-green-600" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-8 w-8 text-red-600" />;
      case 'loan':
        return <CreditCard className="h-8 w-8 text-blue-600" />;
      case 'savings':
        return <PiggyBank className="h-8 w-8 text-purple-600" />;
      default:
        return <ReceiptText className="h-8 w-8 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate("/transactions")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Transactions
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction Details</h1>
              <p className="text-gray-600">Reference: {transaction.reference}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusColor(transaction.status)}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <ReceiptText className="h-5 w-5 text-primary-600" />
                  <span>Transaction Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="p-4 bg-gray-100 rounded-lg">
                    {getTransactionIcon()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {transaction.type === 'deposit' ? '+' : '-'}KES {transaction.amount.toLocaleString()}
                    </h3>
                    <p className="text-gray-600">{transaction.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Transaction Type</p>
                    <p className="text-gray-900 capitalize">{transaction.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p className="text-gray-900">{transaction.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date & Time</p>
                    <p className="text-gray-900">{new Date(transaction.date).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reference Number</p>
                    <p className="text-gray-900 font-mono">{transaction.reference}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary-600" />
                  <span>Transaction Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Amount</span>
                  <span className="font-semibold text-lg">
                    {transaction.type === 'deposit' ? '+' : '-'}KES {transaction.amount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Account Balance After</span>
                  <span className="font-semibold">KES {transaction.balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">Transaction Fee</span>
                  <span className="font-semibold">KES 0.00</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Status</span>
                  <Badge variant={getStatusColor(transaction.status)}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary-600" />
                  <span>Additional Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="text-gray-900">{transaction.description}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Processing Time</p>
                    <p className="text-gray-900">Instant</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Receipt Available</p>
                    <p className="text-gray-900">Yes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  Download Receipt
                </Button>
                <Button variant="outline" className="w-full">
                  Print Receipt
                </Button>
                <Button variant="outline" className="w-full">
                  Share Transaction
                </Button>
                <Button variant="outline" className="w-full">
                  Report Issue
                </Button>
              </CardContent>
            </Card>

            {/* Transaction Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transaction ID</span>
                  <span className="font-mono text-xs">{transaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Reference</span>
                  <span className="font-mono text-xs">{transaction.reference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Date</span>
                  <span className="text-xs">{new Date(transaction.date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Time</span>
                  <span className="text-xs">{new Date(transaction.date).toLocaleTimeString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

