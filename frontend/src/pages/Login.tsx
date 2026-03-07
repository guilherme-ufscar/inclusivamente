import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                login(response.data.data.token, response.data.data.user);
                navigate(`/${response.data.data.user.role}/dashboard`);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao conectar no servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#13365A]/10 via-white to-[#0099D7]/10 p-4 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-primary/10 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-secondary/10 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>

            {/* Mascots */}
            <img src="/gato-macho-cartoon.webp" alt="Mascot" className="absolute -bottom-4 -left-4 w-48 h-48 object-contain opacity-40 lg:opacity-100 hidden sm:block" />
            <img src="/gato-femea-cartoon.webp" alt="Mascot" className="absolute -top-4 -right-4 w-48 h-48 object-contain opacity-40 lg:opacity-100 hidden sm:block" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md z-10"
            >
                <Card className="glass-panel border-0 shadow-2xl">
                    <CardHeader className="space-y-4 pb-8 pt-8">
                        <div className="flex justify-center">
                            <img src="/logo.svg" alt="Inclusiva Mente Educa" className="h-20 w-auto drop-shadow-sm" />
                        </div>
                        <div className="text-center space-y-1">
                            <CardTitle className="text-2xl font-heading text-[#13365A] font-bold">Inclusiva Mente Educa</CardTitle>
                            <p className="text-sm text-slate-500">Transformando a Educação Especial</p>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-6">
                            {error && (
                                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-100">
                                    <AlertCircle className="h-4 w-4 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        label="E-mail"
                                        type="email"
                                        placeholder="voce@exemplo.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10"
                                    />
                                    <Mail className="absolute bottom-3 left-3 h-5 w-5 text-slate-400" />
                                </div>

                                <div className="relative">
                                    <Input
                                        label="Senha"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10"
                                    />
                                    <Lock className="absolute bottom-3 left-3 h-5 w-5 text-slate-400" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary" />
                                    <span className="text-slate-600">Lembrar-me</span>
                                </label>
                                <a href="#" className="font-medium text-brand-primary hover:text-brand-secondary transition-colors">
                                    Esqueceu a senha?
                                </a>
                            </div>

                            <Button type="submit" className="w-full text-base bg-brand-primary hover:bg-brand-primary/90 py-6" isLoading={isLoading}>
                                Entrar na Plataforma
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
