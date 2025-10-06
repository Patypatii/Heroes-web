import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BarChart3,
    PieChart,
    LineChart,
    TrendingUp,
    TrendingDown,
    Users,
    CreditCard,
    PiggyBank,
    FileText,
    Download,
    Calendar,
    Filter,
    RefreshCw,
    Eye,
    DollarSign,
    Activity,
    AlertCircle,
    CheckCircle,
    Clock
} from "lucide-react";

export default function AdminReports() {
    const [selectedReport, setSelectedReport] = useState("overview");
    const [dateRange, setDateRange] = useState("30");
    const [loading, setLoading] = useState(false);
    const [reportData, setReportData] = useState(null);

    const reportTypes = [
        { value: "overview", label: "System Overview", icon: BarChart3 },
        { value: "users", label: "User Analytics", icon: Users },
        { value: "loans", label: "Loan Reports", icon: CreditCard },
        { value: "savings", label: "Savings Reports", icon: PiggyBank },
        { value: "transactions", label: "Transaction Reports", icon: FileText },
        { value: "financial", label: "Financial Summary", icon: DollarSign },
        { value: "performance", label: "Performance Metrics", icon: Activity }
    ];

    const generateReport = async () => {
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setReportData({
                generated: new Date().toISOString(),
                type: selectedReport,
                dateRange: dateRange
            });
        } catch (error) {
            console.error("Error generating report:", error);
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = (format: string) => {
        console.log(`Downloading ${selectedReport} report as ${format}`);
        // Implement actual download logic
    };

    const mockOverviewData = {
        totalUsers: 1247,
        activeLoans: 456,
        totalSavings: 2300000,
        pendingApplications: 23,
        monthlyGrowth: 12.5,
        loanDisbursed: 850000,
        savingsDeposits: 450000,
        overdueLoans: 12
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
                            <p className="text-gray-600">Generate and view system reports and analytics</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Button
                                variant="outline"
                                onClick={generateReport}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <RefreshCw className="h-4 w-4 mr-2" />
                                        Generate Report
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Report Controls */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Report Configuration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Report Type</label>
                                <Select value={selectedReport} onValueChange={setSelectedReport}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select report type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {reportTypes.map((type) => {
                                            const Icon = type.icon;
                                            return (
                                                <SelectItem key={type.value} value={type.value}>
                                                    <div className="flex items-center space-x-2">
                                                        <Icon className="h-4 w-4" />
                                                        <span>{type.label}</span>
                                                    </div>
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Date Range</label>
                                <Select value={dateRange} onValueChange={setDateRange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select date range" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">Last 7 days</SelectItem>
                                        <SelectItem value="30">Last 30 days</SelectItem>
                                        <SelectItem value="90">Last 90 days</SelectItem>
                                        <SelectItem value="365">Last year</SelectItem>
                                        <SelectItem value="all">All time</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Export Format</label>
                                <div className="flex space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => downloadReport('pdf')}
                                    >
                                        <Download className="h-4 w-4 mr-1" />
                                        PDF
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => downloadReport('excel')}
                                    >
                                        <Download className="h-4 w-4 mr-1" />
                                        Excel
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => downloadReport('csv')}
                                    >
                                        <Download className="h-4 w-4 mr-1" />
                                        CSV
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockOverviewData.totalUsers.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                <TrendingUp className="h-3 w-3 inline mr-1" />
                                +12% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockOverviewData.activeLoans.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                <TrendingUp className="h-3 w-3 inline mr-1" />
                                +8% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
                            <PiggyBank className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">KSh {mockOverviewData.totalSavings.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                <TrendingUp className="h-3 w-3 inline mr-1" />
                                +15% from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockOverviewData.pendingApplications}</div>
                            <p className="text-xs text-muted-foreground">
                                <Clock className="h-3 w-3 inline mr-1" />
                                Awaiting review
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Report Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Financial Overview */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <DollarSign className="h-5 w-5" />
                                <span>Financial Overview</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Loans Disbursed This Month</span>
                                    <span className="font-semibold">KSh {mockOverviewData.loanDisbursed.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Savings Deposits</span>
                                    <span className="font-semibold">KSh {mockOverviewData.savingsDeposits.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Monthly Growth</span>
                                    <Badge className="bg-green-100 text-green-800">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        +{mockOverviewData.monthlyGrowth}%
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Overdue Loans</span>
                                    <Badge className="bg-red-100 text-red-800">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        {mockOverviewData.overdueLoans}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* System Performance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Activity className="h-5 w-5" />
                                <span>System Performance</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">System Uptime</span>
                                    <Badge className="bg-green-100 text-green-800">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        99.9%
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Response Time</span>
                                    <span className="font-semibold">120ms</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Database Performance</span>
                                    <Badge className="bg-green-100 text-green-800">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Excellent
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">API Usage</span>
                                    <span className="font-semibold">2.3M requests</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <Clock className="h-5 w-5" />
                                <span>Recent Activity</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm">New user registration: John Doe</p>
                                        <p className="text-xs text-gray-500">2 minutes ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm">Loan application submitted: KSh 50,000</p>
                                        <p className="text-xs text-gray-500">15 minutes ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm">Payment received: KSh 5,000</p>
                                        <p className="text-xs text-gray-500">1 hour ago</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                    <div className="flex-1">
                                        <p className="text-sm">System backup completed</p>
                                        <p className="text-xs text-gray-500">2 hours ago</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <BarChart3 className="h-5 w-5" />
                                <span>Quick Reports</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Button variant="outline" className="w-full justify-start">
                                    <Eye className="h-4 w-4 mr-2" />
                                    User Growth Report
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Loan Performance Report
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Financial Summary Report
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <Eye className="h-4 w-4 mr-2" />
                                    Transaction Analysis
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
