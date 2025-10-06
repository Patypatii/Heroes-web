import { useAuth } from "@/context/AuthContext";
import AdminNav from "./AdminNav";
import AdminFooter from "./AdminFooter";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, isLoading } = useAuth();
    const [stats, setStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                console.log('Fetching admin stats...');
                const response = await api('/admin/dashboard');
                console.log('Admin stats response:', response);
                console.log('Admin stats data:', response.data);
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
                // Set default stats on error
                setStats({
                    users: { total: 0, verified: 0, staff: 0, pending: 0 },
                    loans: { active: 0, totalAmount: 0, overdue: 0 },
                    savings: { totalAccounts: 0, totalBalance: 0 },
                    applications: { total: 0, pending: 0, approved: 0, rejected: 0 },
                    transactions: { total: 0, recent: 0 }
                });
            } finally {
                setStatsLoading(false);
            }
        };

        if (user && (user.role === 'admin' || user.role === 'staff')) {
            fetchStats();
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Navigation - Show for admin/staff users */}
            <AdminNav user={user} isLoading={isLoading} />

            <main className="flex-1">
                {children}
            </main>

            {/* Admin Footer - Show for admin/staff users */}
            <AdminFooter
                user={user}
                isLoading={isLoading || statsLoading}
                stats={stats}
            />
        </div>
    );
}
