import { Outlet } from 'react-router-dom';

export function PublicLayout() {
    return (
        <div className="min-h-screen">
            <header className="glass border-b border-white/10">
                <div className="container mx-auto px-4 py-4">
                    <h1 className="text-2xl font-display font-bold text-gradient">
                        PNPE Galerie
                    </h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>
        </div>
    );
}
