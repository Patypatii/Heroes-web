import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Mail, Phone, Calendar, Shield, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

interface UserDetail {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  role: string;
  isVerified: boolean;
  membershipNumber: string;
  nationalId: string;
  kraPin: string;
  placeOfBirth: string;
  createdAt: string;
  updatedAt: string;
  loanApplications: Array<{
    id: string;
    loanType: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
  activeLoans: Array<{
    id: string;
    amount: number;
    interestRate: number;
    termMonths: number;
    status: string;
    createdAt: string;
  }>;
  savingsAccounts: Array<{
    id: string;
    accountType: string;
    currentBalance: number;
    interestRate: number;
    createdAt: string;
  }>;
  recentTransactions: Array<{
    id: string;
    transactionType: string;
    amount: number;
    description: string;
    status: string;
    createdAt: string;
  }>;
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const response = await api(`/admin/users/${id}`);
        console.log('User details response:', response);
        
        if (response.success && response.data) {
          const userData = response.data.user;
          setUser({
            id: userData.id,
            fullName: userData.fullName,
            email: userData.email || "N/A",
            phoneNumber: userData.phoneNumber,
            role: userData.role,
            isVerified: userData.isVerified,
            membershipNumber: userData.membershipNumber,
            nationalId: userData.nationalId || "N/A",
            kraPin: userData.kraPin || "N/A",
            placeOfBirth: userData.placeOfBirth || "N/A",
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            loanApplications: response.data.loanApplications || [],
            activeLoans: response.data.activeLoans || [],
            savingsAccounts: response.data.savingsAccounts || [],
            recentTransactions: response.data.recentTransactions || []
          });
        }
      } catch (error: any) {
        console.error("Error fetching user details:", error);
        toast({
          title: "Error",
          description: "Failed to load user details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">Loading user details...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-6">The requested user could not be found.</p>
          <Button onClick={() => navigate("/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate("/admin")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-600">Member ID: {user.membershipNumber}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={user.isVerified ? 'default' : 'secondary'}>
            {user.isVerified ? 'Verified' : 'Unverified'}
          </Badge>
          <Badge variant="outline">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary-600" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-gray-900">{user.fullName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-gray-900">{user.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">National ID</p>
                  <p className="text-gray-900">{user.nationalId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">KRA PIN</p>
                  <p className="text-gray-900">{user.kraPin}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Place of Birth</p>
                  <p className="text-gray-900">{user.placeOfBirth}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Member Since</p>
                  <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Last Updated</p>
                  <p className="text-gray-900">{new Date(user.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Loans */}
          <Card>
            <CardHeader>
              <CardTitle>Active Loans</CardTitle>
            </CardHeader>
            <CardContent>
              {user.activeLoans.length > 0 ? (
                <div className="space-y-4">
                  {user.activeLoans.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Loan #{loan.id}</p>
                        <p className="text-sm text-gray-600">KES {loan.amount.toLocaleString()}</p>
                        <p className="text-sm text-gray-500">{loan.termMonths} months • {loan.interestRate}% interest</p>
                      </div>
                      <div className="text-right">
                        <Badge variant={loan.status === 'active' ? 'default' : 'secondary'}>
                          {loan.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(loan.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No active loans found</p>
              )}
            </CardContent>
          </Card>

          {/* Savings Accounts */}
          <Card>
            <CardHeader>
              <CardTitle>Savings Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {user.savingsAccounts.length > 0 ? (
                <div className="space-y-4">
                  {user.savingsAccounts.map((saving) => (
                    <div key={saving.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{saving.accountType}</p>
                        <p className="text-sm text-gray-600">Account #{saving.id}</p>
                        <p className="text-sm text-gray-500">{saving.interestRate}% interest rate</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">KES {saving.currentBalance.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(saving.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No savings accounts found</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              {user.recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {user.recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.transactionType}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">KES {transaction.amount.toLocaleString()}</p>
                        <Badge variant={transaction.status === 'completed' ? 'default' : 'secondary'}>
                          {transaction.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No recent transactions found</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Actions Sidebar */}
        <div className="space-y-6">
          {/* User Actions */}
          <Card>
            <CardHeader>
              <CardTitle>User Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit User
              </Button>
              <Button variant="outline" className="w-full">
                <Shield className="mr-2 h-4 w-4" />
                {user.isVerified ? 'Unverify User' : 'Verify User'}
              </Button>
              <Button variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </Button>
              <Button variant="outline" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                Call User
              </Button>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete User
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Loans:</span>
                <span className="font-medium">{user.activeLoans.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Savings Accounts:</span>
                <span className="font-medium">{user.savingsAccounts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Savings:</span>
                <span className="font-medium">
                  KES {user.savingsAccounts.reduce((sum, s) => sum + s.currentBalance, 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Recent Transactions:</span>
                <span className="font-medium">{user.recentTransactions.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


