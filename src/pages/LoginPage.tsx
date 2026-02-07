import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { login } from '../services/auth';

export function LoginPage() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (login(password)) {
            navigate('/admin');
        } else {
            setError('Mot de passe incorrect');
            setPassword('');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-display font-bold text-gradient mb-2">
                        PNPE Galerie
                    </h1>
                    <p className="text-white/70">Connexion Administrateur</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        type="password"
                        label="Mot de passe"
                        placeholder="Entrez votre mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={error}
                        autoFocus
                    />

                    <Button type="submit" className="w-full" size="lg">
                        <LogIn className="mr-2 inline" size={20} />
                        Se connecter
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-white/50">
                    <p>Mot de passe par défaut : pnpe2024</p>
                </div>
            </Card>
        </div>
    );
}
