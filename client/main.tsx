import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import LoanApplication from "./pages/LoanApplication";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Membership from "./pages/Membership";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminApplications from "./pages/admin/Applications";
import AdminLoans from "./pages/admin/Loans";
import AdminSavings from "./pages/admin/Savings";
import AdminTransactions from "./pages/admin/Transactions";
import ManualDeposits from "./pages/admin/ManualDeposits";
import AdminSettings from "./pages/admin/Settings";
import AdminReports from "./pages/admin/Reports";
import { Login } from "./pages/auth";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Loans from "./pages/Loans";
import Savings from "./pages/Savings";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import TransactionDetail from "./pages/TransactionDetail";
import NewSavings from "./pages/NewSavings";
import SavingsDetail from "./pages/SavingsDetail";
import LoanDetail from "./pages/LoanDetail";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import ApplicationDetail from "./pages/admin/ApplicationDetail";
import UserDetail from "./pages/admin/UserDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthProvider>
                {(() => {
                    const useHash = (typeof window !== "undefined" && window.location.hostname.endsWith("github.io")) || import.meta.env.VITE_USE_HASH_ROUTER === 'true';
                    const Router = useHash ? HashRouter : BrowserRouter;
                    return (
                        <Router>
                            <Routes>
                                {/* Public Routes - Available to all users */}
                                <Route path="/" element={<Index />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/contact" element={<Contact />} />
                                <Route path="/services" element={<Services />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/privacy" element={<Privacy />} />
                                <Route path="/terms" element={<Terms />} />
                                <Route path="/cookies" element={<Cookies />} />

                                {/* Protected Routes - Available to all authenticated users */}
                                <Route path="/dashboard" element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                } />
                                <Route path="/apply" element={
                                    <ProtectedRoute>
                                        <LoanApplication />
                                    </ProtectedRoute>
                                } />
                                <Route path="/loans" element={
                                    <ProtectedRoute>
                                        <Loans />
                                    </ProtectedRoute>
                                } />
                                <Route path="/savings" element={
                                    <ProtectedRoute>
                                        <Savings />
                                    </ProtectedRoute>
                                } />
                                <Route path="/transactions" element={
                                    <ProtectedRoute>
                                        <Transactions />
                                    </ProtectedRoute>
                                } />
                                <Route path="/membership" element={
                                    <ProtectedRoute>
                                        <Membership />
                                    </ProtectedRoute>
                                } />
                                <Route path="/profile" element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                } />
                                <Route path="/transactions/:id" element={
                                    <ProtectedRoute>
                                        <TransactionDetail />
                                    </ProtectedRoute>
                                } />
                                <Route path="/savings/new" element={
                                    <ProtectedRoute>
                                        <NewSavings />
                                    </ProtectedRoute>
                                } />
                                <Route path="/savings/:id" element={
                                    <ProtectedRoute>
                                        <SavingsDetail />
                                    </ProtectedRoute>
                                } />
                                <Route path="/loans/:id" element={
                                    <ProtectedRoute>
                                        <LoanDetail />
                                    </ProtectedRoute>
                                } />

                                {/* Admin Routes - Require Admin/Staff Role */}
                                <Route path="/admin" element={
                                    <ProtectedRoute roles={["admin", "staff"]}>
                                        <AdminLayout>
                                            <AdminDashboard />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/users" element={
                                    <ProtectedRoute roles={["admin", "staff"]}>
                                        <AdminLayout>
                                            <AdminUsers />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/users/:id" element={
                                    <ProtectedRoute roles={["admin", "staff"]}>
                                        <AdminLayout>
                                            <UserDetail />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/applications" element={
                                    <ProtectedRoute roles={["admin", "staff"]}>
                                        <AdminLayout>
                                            <AdminApplications />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/applications/:id" element={
                                    <ProtectedRoute roles={["admin", "staff"]}>
                                        <AdminLayout>
                                            <ApplicationDetail />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/loans" element={
                                    <ProtectedRoute roles={["admin", "staff"]}>
                                        <AdminLayout>
                                            <AdminLoans />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/savings" element={
                                    <ProtectedRoute roles={["admin", "staff"]}>
                                        <AdminLayout>
                                            <AdminSavings />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/transactions" element={
                                    <ProtectedRoute roles={["admin", "staff"]}>
                                        <AdminLayout>
                                            <AdminTransactions />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/manual-deposits" element={
                                    <ProtectedRoute roles={["admin", "staff"]}>
                                        <AdminLayout>
                                            <ManualDeposits />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/settings" element={
                                    <ProtectedRoute roles={["admin", "staff"]}>
                                        <AdminLayout>
                                            <AdminSettings />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />
                                <Route path="/admin/reports" element={
                                    <ProtectedRoute roles={["admin", "staff"]}>
                                        <AdminLayout>
                                            <AdminReports />
                                        </AdminLayout>
                                    </ProtectedRoute>
                                } />

                                {/* Catch-all Route */}
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Router>
                    );
                })()}
            </AuthProvider>
        </TooltipProvider>
    </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);





