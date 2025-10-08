import { Button } from "@/components/ui/button";
import { Menu, X, Shield, Phone, Mail, Building2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  console.log("🔍 Header - Auth state:", { user, isLoading, userRole: user?.role });
  console.log("🔍 Header - User object:", user);

  // Check if we're on an admin page
  const isAdminPage = location.pathname.startsWith('/admin');

  // Show navigation for admin users only when they're NOT on admin pages
  const shouldShowNavigation = !user || !(user.role === "admin" || user.role === "staff") || !isAdminPage;

  const handleDownloadAPK = () => {
    // Show toast notification
    toast({
      title: "Download Started",
      description: "The app is coming soon to Google Play Store. For now, you can download the APK directly.",
    });

    // Trigger download
    const link = document.createElement('a');
    link.href = '/Heroes MF.apk';
    link.download = 'Heroes-MF.apk';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Don't render anything while loading
  if (isLoading) {
    return (
      <div className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-primary-200">
                <Building2 className="h-10 w-10 text-primary-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-600">Heroes SACCO</h1>
                <p className="text-xs text-muted-foreground">Financial Solutions</p>
              </div>
            </div>
            <div className="animate-pulse bg-gray-200 h-8 w-24 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar - Hide for admin users on admin pages since AdminNav shows contact info */}
      {shouldShowNavigation && (
        <div className="bg-primary-600 text-white py-2">
          <div className="container mx-auto px-4 flex justify-between items-center text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Phone className="h-3 w-3" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-1">
                <Mail className="h-3 w-3" />
                <span>info@heroessacco.co.ke</span>
              </div>
            </div>
            <div className="hidden md:block">
              <span>Serving Heroes Since 1995</span>
            </div>
          </div>
        </div>
      )}

      {/* Main navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white p-3 rounded-lg shadow-lg border-2 border-primary-200">
              <img
                src="/logo.png"
                alt="Heroes SACCO Logo"
                className="h-10 w-10 object-contain filter brightness-110 contrast-110"
                style={{
                  minWidth: '15px',
                  minHeight: '15px',
                  maxWidth: '25px',
                  maxHeight: '25px'
                }}
                onError={(e) => {
                  console.log('Logo failed to load, showing fallback');
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
                onLoad={() => console.log('Logo loaded successfully')}
              />
              <Building2
                className="h-10 w-10 text-primary-600 hidden"
                style={{ display: 'none' }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-600">
                Heroes SACCO
              </h1>
              <p className="text-xs text-muted-foreground">
                Financial Solutions
              </p>
            </div>
          </div>

          {/* Desktop navigation - Hide for admin users on admin pages since they have AdminNav */}
          {shouldShowNavigation && (
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Home
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Dashboard
                </Link>
              )}
              {user && (
                <Link
                  to="/loans"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Loans
                </Link>
              )}
              {user && (
                <Link
                  to="/savings"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Savings
                </Link>
              )}
              {user && (
                <Link
                  to="/transactions"
                  className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Transactions
                </Link>
              )}
              <Link
                to="/services"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Services
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          )}

          {/* Desktop CTA buttons - Hide for admin users on admin pages */}
          {shouldShowNavigation && (
            <div className="hidden md:flex items-center space-x-3">
              {!user ? (
                <>
                  <Button
                    variant="outline"
                    className="border-primary-600 text-primary-600 hover:bg-primary-50"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                </>
              ) : (
                <>
                  {(user.role === "admin" || user.role === "staff") && (
                    <Button variant="outline" onClick={() => navigate("/admin")}>
                      Admin
                    </Button>
                  )}
                  <ProfileDropdown />
                </>
              )}
              <Button className="bg-primary-600 hover:bg-primary-700" onClick={handleDownloadAPK}>
                Download App
              </Button>
            </div>
          )}

          {/* Mobile menu button - Hide for admin users on admin pages */}
          {shouldShowNavigation && (
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          )}
        </div>

        {/* Mobile menu - Hide for admin users on admin pages */}
        {isMenuOpen && shouldShowNavigation && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {user && (
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {user && (
                <Link
                  to="/loans"
                  className="text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Loans
                </Link>
              )}
              {user && (
                <Link
                  to="/savings"
                  className="text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Savings
                </Link>
              )}
              {user && (
                <Link
                  to="/transactions"
                  className="text-gray-700 hover:text-primary-600 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Transactions
                </Link>
              )}
              <Link
                to="/services"
                className="text-gray-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                {!user ? (
                  <>
                    <Button
                      variant="outline"
                      className="border-primary-600 text-primary-600 hover:bg-primary-50"
                      onClick={() => { navigate("/login"); setIsMenuOpen(false); }}
                    >
                      Login
                    </Button>
                  </>
                ) : (
                  <div className="w-full">
                    {(user.role === "admin" || user.role === "staff") && (
                      <Button variant="outline" className="w-full mb-3" onClick={() => { navigate("/admin"); setIsMenuOpen(false); }}>
                        Admin
                      </Button>
                    )}
                    <ProfileDropdown />
                  </div>
                )}
                <Button className="bg-primary-600 hover:bg-primary-700" onClick={() => { navigate("/apply"); setIsMenuOpen(false); }}>
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
