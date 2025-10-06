import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, FileText, Calendar, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface Application {
    id: string;
    applicantName: string;
    email: string;
    phone: string;
    loanType: string;
    amount: number;
    term: number;
    purpose: string;
    status: string;
    submittedAt: string;
    documents: {
        idFront: string;
        idBack: string;
        payslips: string;
        bankStatements: string;
        additional: string;
    };
}

export default function ApplicationDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [application, setApplication] = useState<Application | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Fetch application details from API
        // For now, using mock data
        setTimeout(() => {
            setApplication({
                id: id || "",
                applicantName: "John Doe",
                email: "john@example.com",
                phone: "+254700123456",
                loanType: "Personal Loan",
                amount: 500000,
                term: 24,
                purpose: "Home improvement and emergency expenses",
                status: "pending",
                submittedAt: "2024-01-15T10:30:00Z",
                documents: {
                    idFront: "https://example.com/id-front.jpg",
                    idBack: "https://example.com/id-back.jpg",
                    payslips: "https://example.com/payslips.pdf",
                    bankStatements: "https://example.com/bank-statements.pdf",
                    additional: "https://example.com/additional.pdf"
                }
            });
            setLoading(false);
        }, 1000);
    }, [id]);

    const handleStatusUpdate = (newStatus: string) => {
        // TODO: Update application status via API
        console.log(`Updating application ${id} status to ${newStatus}`);
        if (application) {
            setApplication({ ...application, status: newStatus });
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">Loading application details...</div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Not Found</h1>
                    <p className="text-gray-600 mb-6">The requested application could not be found.</p>
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
                        <h1 className="text-3xl font-bold text-gray-900">Application Details</h1>
                        <p className="text-gray-600">Application ID: {application.id}</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant={application.status === 'approved' ? 'default' : application.status === 'rejected' ? 'destructive' : 'secondary'}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Applicant Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <User className="h-5 w-5 text-primary-600" />
                                <span>Applicant Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                                    <p className="text-gray-900">{application.applicantName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Email</p>
                                    <p className="text-gray-900">{application.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Phone</p>
                                    <p className="text-gray-900">{application.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Submitted</p>
                                    <p className="text-gray-900">{new Date(application.submittedAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Loan Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <DollarSign className="h-5 w-5 text-primary-600" />
                                <span>Loan Details</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Loan Type</p>
                                    <p className="text-gray-900">{application.loanType}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Amount</p>
                                    <p className="text-gray-900">KES {application.amount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Term</p>
                                    <p className="text-gray-900">{application.term} months</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Monthly Payment</p>
                                    <p className="text-gray-900">KES {Math.round(application.amount / application.term).toLocaleString()}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">Purpose</p>
                                <p className="text-gray-900">{application.purpose}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Documents */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <FileText className="h-5 w-5 text-primary-600" />
                                <span>Documents</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">National ID Front</p>
                                    <Button variant="outline" size="sm" onClick={() => window.open(application.documents.idFront, '_blank')}>
                                        View Document
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">National ID Back</p>
                                    <Button variant="outline" size="sm" onClick={() => window.open(application.documents.idBack, '_blank')}>
                                        View Document
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Payslips</p>
                                    <Button variant="outline" size="sm" onClick={() => window.open(application.documents.payslips, '_blank')}>
                                        View Document
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm font-medium">Bank Statements</p>
                                    <Button variant="outline" size="sm" onClick={() => window.open(application.documents.bankStatements, '_blank')}>
                                        View Document
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Actions Sidebar */}
                <div className="space-y-6">
                    {/* Status Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => handleStatusUpdate('approved')}
                                disabled={application.status === 'approved'}
                            >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Approve Application
                            </Button>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={() => handleStatusUpdate('rejected')}
                                disabled={application.status === 'rejected'}
                            >
                                <XCircle className="mr-2 h-4 w-4" />
                                Reject Application
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleStatusUpdate('pending')}
                            >
                                Mark as Pending
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Contact Applicant */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Contact Applicant</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full" onClick={() => window.open(`mailto:${application.email}`)}>
                                Send Email
                            </Button>
                            <Button variant="outline" className="w-full" onClick={() => window.open(`tel:${application.phone}`)}>
                                Call Phone
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}


