import { Navigate, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { isAuthenticated, logout } from '../../services/auth';
import { Button } from '../ui/Button';

export function AdminLayout() {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen">
            <header className="glass border-b border-white/10">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-2xl font-display font-bold text-gradient">
                        PNPE Galerie - Admin
                    </h1>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        <LogOut size={18} className="mr-2" />
                        Déconnexion
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}
