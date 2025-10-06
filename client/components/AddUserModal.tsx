import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/api";
import { Loader2, UserPlus } from "lucide-react";

interface AddUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated: () => void;
}

export default function AddUserModal({ isOpen, onClose, onUserCreated }: AddUserModalProps) {
    const [formData, setFormData] = useState({
        fullName: "",
        nationalId: "",
        phoneNumber: "",
        email: "",
        firstName: "",
        lastName: "",
        role: "member",
        isVerified: false,
        pin: "",
        password: "",
        placeOfBirth: "",
        kraPin: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full name is required";
        }

        if (!formData.nationalId.trim()) {
            newErrors.nationalId = "National ID is required";
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
            newErrors.phoneNumber = "Please enter a valid phone number";
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (formData.pin && formData.pin.length < 4) {
            newErrors.pin = "PIN must be at least 4 digits";
        }

        if (formData.password && formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await api('/admin/users', {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            if (response.success) {
                onUserCreated();
                onClose();
                // Reset form
                setFormData({
                    fullName: "",
                    nationalId: "",
                    phoneNumber: "",
                    email: "",
                    firstName: "",
                    lastName: "",
                    role: "member",
                    isVerified: false,
                    pin: "",
                    password: "",
                    placeOfBirth: "",
                    kraPin: ""
                });
            } else {
                setErrors({ submit: response.message || "Failed to create user" });
            }
        } catch (error: any) {
            console.error("Error creating user:", error);
            if (error.field) {
                setErrors({ [error.field]: error.message });
            } else {
                setErrors({ submit: error.message || "Failed to create user" });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (!isLoading) {
            onClose();
            setErrors({});
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5" />
                        Add New User
                    </DialogTitle>
                    <DialogDescription>
                        Create a new user account. All fields marked with * are required.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name *</Label>
                            <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange("fullName", e.target.value)}
                                placeholder="Enter full name"
                                className={errors.fullName ? "border-red-500" : ""}
                            />
                            {errors.fullName && (
                                <p className="text-sm text-red-500">{errors.fullName}</p>
                            )}
                        </div>

                        {/* National ID */}
                        <div className="space-y-2">
                            <Label htmlFor="nationalId">National ID *</Label>
                            <Input
                                id="nationalId"
                                value={formData.nationalId}
                                onChange={(e) => handleInputChange("nationalId", e.target.value)}
                                placeholder="Enter national ID"
                                className={errors.nationalId ? "border-red-500" : ""}
                            />
                            {errors.nationalId && (
                                <p className="text-sm text-red-500">{errors.nationalId}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number *</Label>
                            <Input
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                placeholder="Enter phone number"
                                className={errors.phoneNumber ? "border-red-500" : ""}
                            />
                            {errors.phoneNumber && (
                                <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="Enter email address"
                                className={errors.email ? "border-red-500" : ""}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500">{errors.email}</p>
                            )}
                        </div>

                        {/* First Name */}
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                placeholder="Enter first name"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                placeholder="Enter last name"
                            />
                        </div>

                        {/* Role */}
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="member">Member</SelectItem>
                                    <SelectItem value="staff">Staff</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Place of Birth */}
                        <div className="space-y-2">
                            <Label htmlFor="placeOfBirth">Place of Birth</Label>
                            <Input
                                id="placeOfBirth"
                                value={formData.placeOfBirth}
                                onChange={(e) => handleInputChange("placeOfBirth", e.target.value)}
                                placeholder="Enter place of birth"
                            />
                        </div>

                        {/* KRA PIN */}
                        <div className="space-y-2">
                            <Label htmlFor="kraPin">KRA PIN</Label>
                            <Input
                                id="kraPin"
                                value={formData.kraPin}
                                onChange={(e) => handleInputChange("kraPin", e.target.value)}
                                placeholder="Enter KRA PIN"
                            />
                        </div>

                        {/* PIN */}
                        <div className="space-y-2">
                            <Label htmlFor="pin">PIN</Label>
                            <Input
                                id="pin"
                                type="password"
                                value={formData.pin}
                                onChange={(e) => handleInputChange("pin", e.target.value)}
                                placeholder="Enter PIN (4+ digits)"
                                className={errors.pin ? "border-red-500" : ""}
                            />
                            {errors.pin && (
                                <p className="text-sm text-red-500">{errors.pin}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                placeholder="Enter password (6+ characters)"
                                className={errors.password ? "border-red-500" : ""}
                            />
                            {errors.password && (
                                <p className="text-sm text-red-500">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    {/* Verification Status */}
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isVerified"
                            checked={formData.isVerified}
                            onCheckedChange={(checked) => handleInputChange("isVerified", checked as boolean)}
                        />
                        <Label htmlFor="isVerified">Mark as verified</Label>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                            {errors.submit}
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="mr-2 h-4 w-4" />
                                    Create User
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
