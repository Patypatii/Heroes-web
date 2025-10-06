import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Shield,
    CreditCard,
    PiggyBank,
    FileText,
    Edit,
    Camera,
    CheckCircle,
    Clock,
} from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }
    }, [isAuthenticated, navigate]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-KE", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusColor = (isVerified: boolean) => {
        return isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800";
    };

    const getStatusIcon = (isVerified: boolean) => {
        return isVerified ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
            <Clock className="h-4 w-4 text-yellow-600" />
        );
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600">
                        Manage your account information and preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Profile Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    Personal Information
                                </CardTitle>
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Profile Photo */}
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                                            {user?.idPhotoUrl ? (
                                                <img
                                                    src={user.idPhotoUrl}
                                                    alt="Profile"
                                                    className="w-20 h-20 rounded-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                        e.currentTarget.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <User className="h-8 w-8 text-primary-600" style={{ display: user?.idPhotoUrl ? 'none' : 'flex' } as React.CSSProperties} />
                                        </div>
                                        <Button
                                            size="sm"
                                            className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0"
                                        >
                                            <Camera className="h-3 w-3" />
                                        </Button>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {user?.fullName}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            {user?.membershipNumber}
                                        </p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            {getStatusIcon(user?.isVerified || false)}
                                            <Badge className={getStatusColor(user?.isVerified || false)}>
                                                {user?.isVerified ? "Verified" : "Pending Verification"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-3">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Phone Number</p>
                                            <p className="font-medium">{user?.phoneNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Email</p>
                                            <p className="font-medium">{user?.email || "Not provided"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Place of Birth</p>
                                            <p className="font-medium">{user?.placeOfBirth || "Not provided"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-sm text-gray-500">Member Since</p>
                                            <p className="font-medium">
                                                {user?.createdAt ? formatDate(user.createdAt) : "Not available"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Account Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Shield className="h-5 w-5 mr-2" />
                                    Account Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Membership Number</p>
                                        <p className="font-mono text-lg font-semibold text-primary-600">
                                            {user?.membershipNumber}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">National ID</p>
                                        <p className="font-medium">{user?.nationalId || "Not provided"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">KRA PIN</p>
                                        <p className="font-medium">{user?.kraPin || "Not provided"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">Account Role</p>
                                        <Badge className="bg-blue-100 text-blue-800">
                                            {user?.role || "Member"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Actions Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    className="w-full justify-start"
                                    onClick={() => navigate("/loans")}
                                >
                                    <CreditCard className="h-4 w-4 mr-2" />
                                    My Loans
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate("/savings")}
                                >
                                    <PiggyBank className="h-4 w-4 mr-2" />
                                    My Savings
                                </Button>

                                <Button
                                    variant="outline"
                                    className="w-full justify-start"
                                    onClick={() => navigate("/transactions")}
                                >
                                    <FileText className="h-4 w-4 mr-2" />
                                    Transactions
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Account Status */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Verification Status</span>
                                    <Badge className={getStatusColor(user?.isVerified || false)}>
                                        {user?.isVerified ? "Verified" : "Pending"}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Account Type</span>
                                    <span className="text-sm font-medium">{user?.role || "Member"}</span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-600">Member Since</span>
                                    <span className="text-sm font-medium">
                                        {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Security</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-start">
                                    <Shield className="h-4 w-4 mr-2" />
                                    Change Password
                                </Button>

                                <Button variant="outline" className="w-full justify-start">
                                    <Phone className="h-4 w-4 mr-2" />
                                    Update Phone
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




