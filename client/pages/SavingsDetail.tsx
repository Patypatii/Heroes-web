import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, PiggyBank, DollarSign, Calendar, TrendingUp, Target, Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface SavingsAccount {
  id: string;
  user_id: string;
  amount: number;
  interest_rate: number;
  start_date: string;
  maturity_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
  deposit_mpesa_id?: string;
  withdrawal_mpesa_id?: string;
  interestEarned?: number;
  transactions?: Array<{
    id: string;
    type: string;
    amount: number;
    date: string;
  }>;
}

export default function SavingsDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [account, setAccount] = useState<SavingsAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavingsDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await api(`/savings/${id}`);
        if (response.success) {
          setAccount(response.savings);
        } else {
          toast({
            title: "Error",
            description: "Failed to load savings account details",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching savings details:", error);
        toast({
          title: "Error",
          description: "Failed to load savings account details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSavingsDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading account details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Account Not Found</h1>
            <p className="text-gray-600 mb-6">The requested savings account could not be found.</p>
            <Button onClick={() => navigate("/savings")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Savings
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const progressPercentage = 0; // No target amount in current schema

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'matured':
        return 'secondary';
      case 'closed':
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
            <Button variant="outline" onClick={() => navigate("/savings")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Savings
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Savings Account</h1>
              <p className="text-gray-600">Account #{account.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusColor(account.status)}>
              {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <PiggyBank className="h-5 w-5 text-primary-600" />
                  <span>Account Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="p-4 bg-primary-100 rounded-lg">
                    <PiggyBank className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      KES {(account.amount || 0).toLocaleString()}
                    </h3>
                    <p className="text-gray-600">Current Balance</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                    <p className="text-gray-900">{account.interest_rate || 0}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Contributions</p>
                    <p className="text-gray-900">KES {(account.amount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Interest Earned</p>
                    <p className="text-gray-900">KES 0</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Contribution</p>
                    <p className="text-gray-900">N/A</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Account Created</p>
                    <p className="text-gray-900">{new Date(account.created_at).toLocaleDateString()}</p>
                  </div>
                  {account.maturity_date && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Maturity Date</p>
                      <p className="text-gray-900">{new Date(account.maturity_date).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary-600" />
                  <span>Account Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Current Balance</span>
                    <span className="text-lg font-semibold">KES {(account.amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Interest Rate</span>
                    <span className="text-lg font-semibold">{account.interest_rate || 0}% p.a.</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Status</span>
                    <Badge variant={getStatusColor(account.status)}>
                      {account.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {account.transactions && account.transactions.length > 0 ? (
                  <div className="space-y-4">
                    {account.transactions.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${transaction.type === 'deposit' ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                            {transaction.type === 'deposit' ? (
                              <Plus className="h-4 w-4 text-green-600" />
                            ) : (
                              <TrendingUp className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${transaction.type === 'deposit' ? 'text-green-600' : 'text-blue-600'
                            }`}>
                            {transaction.type === 'deposit' ? '+' : '+'}KES {(transaction.amount || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">No transactions found</p>
                )}
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
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Make Deposit
                </Button>
                <Button variant="outline" className="w-full">
                  <Minus className="mr-2 h-4 w-4" />
                  Withdraw
                </Button>
                <Button variant="outline" className="w-full">
                  <DollarSign className="mr-2 h-4 w-4" />
                  View Statement
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  Set Auto-Deposit
                </Button>
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Account Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <span className="font-medium">Savings Account</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Interest Rate</span>
                  <span className="font-medium">{account.interest_rate || 0}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant={getStatusColor(account.status)}>
                    {account.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Interest</span>
                  <span className="font-medium text-green-600">
                    KES {(account.interestEarned || 0).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Help */}
            <Card className="bg-primary-50">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-primary-900 mb-2">Need Help?</h3>
                <p className="text-sm text-primary-700 mb-4">
                  Our savings team is here to help with your account
                </p>
                <Button variant="outline" className="border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

