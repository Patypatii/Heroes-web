import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, DollarSign, Calendar, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Loan {
  id: string;
  type: string;
  amount: number;
  remainingAmount: number;
  interestRate: number;
  term: number;
  monthlyPayment: number;
  status: string;
  createdAt: string;
  nextPaymentDate: string;
  totalPaid: number;
  remainingPayments: number;
  purpose: string;
  payments: Array<{
    id: string;
    amount: number;
    date: string;
    status: string;
    principal: number;
    interest: number;
  }>;
}

export default function LoanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loan, setLoan] = useState<Loan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoanDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await api(`/loans/${id}`);
        if (response.success) {
          setLoan(response.loan);
        } else {
          toast({
            title: "Error",
            description: "Failed to load loan details",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching loan details:", error);
        toast({
          title: "Error",
          description: "Failed to load loan details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLoanDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading loan details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Loan Not Found</h1>
            <p className="text-gray-600 mb-6">The requested loan could not be found.</p>
            <Button onClick={() => navigate("/loans")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Loans
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const progressPercentage = ((loan.amount - loan.remainingAmount) / loan.amount) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'overdue':
        return 'destructive';
      case 'pending':
        return 'outline';
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
            <Button variant="outline" onClick={() => navigate("/loans")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Loans
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{loan.type}</h1>
              <p className="text-gray-600">Loan #{loan.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant={getStatusColor(loan.status)}>
              {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Loan Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-primary-600" />
                  <span>Loan Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="p-4 bg-primary-100 rounded-lg">
                    <CreditCard className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      KES {loan.remainingAmount.toLocaleString()}
                    </h3>
                    <p className="text-gray-600">Remaining Balance</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Original Amount</p>
                    <p className="text-gray-900">KES {loan.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Interest Rate</p>
                    <p className="text-gray-900">{loan.interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Payment</p>
                    <p className="text-gray-900">KES {loan.monthlyPayment.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Remaining Payments</p>
                    <p className="text-gray-900">{loan.remainingPayments} months</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Paid</p>
                    <p className="text-gray-900">KES {loan.totalPaid.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Next Payment</p>
                    <p className="text-gray-900">{new Date(loan.nextPaymentDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary-600" />
                  <span>Repayment Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">Amount Paid</span>
                    <span className="text-lg font-semibold">
                      KES {loan.totalPaid.toLocaleString()} of KES {loan.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      {progressPercentage.toFixed(1)}% complete
                    </span>
                    <span className="text-gray-600">
                      {loan.remainingPayments} payments remaining
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Purpose */}
            <Card>
              <CardHeader>
                <CardTitle>Loan Purpose</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-900">{loan.purpose}</p>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                {loan.payments.length > 0 ? (
                  <div className="space-y-4">
                    {loan.payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-full ${payment.status === 'paid' ? 'bg-green-100' : 'bg-yellow-100'
                            }`}>
                            {payment.status === 'paid' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">Payment #{payment.id}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(payment.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">KES {payment.amount.toLocaleString()}</p>
                          <div className="text-sm text-gray-600">
                            <p>Principal: KES {payment.principal.toLocaleString()}</p>
                            <p>Interest: KES {payment.interest.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">No payments found</p>
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
                <Button className="w-full bg-primary-600 hover:bg-primary-700">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Make Payment
                </Button>
                <Button variant="outline" className="w-full">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Schedule
                </Button>
                <Button variant="outline" className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Download Statement
                </Button>
                <Button variant="outline" className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Set Auto-Pay
                </Button>
              </CardContent>
            </Card>

            {/* Loan Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Loan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Loan Type</span>
                  <span className="font-medium">{loan.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Interest Rate</span>
                  <span className="font-medium">{loan.interestRate}% p.a.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Term</span>
                  <span className="font-medium">{loan.term} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant={getStatusColor(loan.status)}>
                    {loan.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Interest</span>
                  <span className="font-medium text-red-600">
                    KES {(loan.amount * (loan.interestRate / 100) * (loan.term / 12)).toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Next Payment */}
            <Card className="bg-primary-50">
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-primary-900 mb-2">Next Payment Due</h3>
                <p className="text-2xl font-bold text-primary-600 mb-2">
                  KES {loan.monthlyPayment.toLocaleString()}
                </p>
                <p className="text-sm text-primary-700 mb-4">
                  Due: {new Date(loan.nextPaymentDate).toLocaleDateString()}
                </p>
                <Button className="w-full bg-primary-600 hover:bg-primary-700">
                  Pay Now
                </Button>
              </CardContent>
            </Card>

            {/* Help */}
            <Card>
              <CardContent className="p-6 text-center">
                <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Our loan team is here to help with your loan
                </p>
                <Button variant="outline" className="w-full">
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

