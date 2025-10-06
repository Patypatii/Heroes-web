import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    User,
    Settings,
    LogOut,
    CreditCard,
    PiggyBank,
    FileText,
    Shield,
    ChevronDown,
} from "lucide-react";

export default function ProfileDropdown() {
    const { user, logout, isLoading } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
        setIsOpen(false);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setIsOpen(false);
    };

    // Don't render if loading or no user
    if (isLoading || !user) return null;

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center space-x-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
                >
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center overflow-hidden">
                        {user?.idPhotoUrl ? (
                            <img
                                src={user.idPhotoUrl}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                    if (nextElement) {
                                        nextElement.style.display = 'flex';
                                    }
                                }}
                            />
                        ) : null}
                        <User className="h-4 w-4 text-white" style={{ display: user?.idPhotoUrl ? 'none' : 'flex' } as React.CSSProperties} />
                    </div>
                    {/* <div className="hidden sm:block text-left">
                        <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.membershipNumber}</p>
                    </div> */}
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.fullName}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.membershipNumber}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.phoneNumber}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => handleNavigation("/dashboard")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleNavigation("/loans")}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>My Loans</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleNavigation("/savings")}>
                    <PiggyBank className="mr-2 h-4 w-4" />
                    <span>My Savings</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleNavigation("/transactions")}>
                    <FileText className="mr-2 h-4 w-4" />
                    <span>Transactions</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => handleNavigation("/profile")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                </DropdownMenuItem>

                {user.role === "admin" || user.role === "staff" ? (
                    <DropdownMenuItem onClick={() => handleNavigation("/admin")}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                    </DropdownMenuItem>
                ) : null}

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

