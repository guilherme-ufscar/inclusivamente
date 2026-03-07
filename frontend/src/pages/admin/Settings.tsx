import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { Save, User, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Configurações da Conta</h1>
                <p className="text-slate-500 mt-1">Gerencie suas credenciais e preferências do sistema Inclusiva Mente.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">

                <div className="md:col-span-2 space-y-6">
                    <Card className="glass-panel border-none shadow-sm">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User className="w-5 h-5 text-brand-primary" />
                                Dados do Perfil
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Nome Completo"
                                        defaultValue={user?.name || ''}
                                    />
                                    <Input
                                        label="E-mail de Acesso"
                                        type="email"
                                        defaultValue={user?.email || ''}
                                    />
                                </div>
                                <div className="pt-2">
                                    <Button type="submit">
                                        <Save className="w-4 h-4 mr-2" /> Salvar Perfil
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="glass-panel border-none shadow-sm border-t-4 border-t-red-500">
                        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                            <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                                <ShieldCheck className="w-5 h-5" />
                                Segurança e Senhas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                                <Input
                                    label="Senha Atual"
                                    type="password"
                                    placeholder="••••••••"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="Nova Senha"
                                        type="password"
                                        placeholder="••••••••"
                                    />
                                    <Input
                                        label="Confirmar Nova Senha"
                                        type="password"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="pt-2">
                                    <Button type="button" variant="outline">
                                        Atualizar Senha
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-brand-primary text-white border-none shadow-md">
                        <CardContent className="p-6">
                            <h3 className="font-heading font-semibold text-lg mb-2">Permissões de Acesso</h3>
                            <p className="text-brand-primary-light text-sm mb-4">
                                Sua conta atual possui o nível de acesso <b>{user?.role}</b>.
                            </p>
                            <div className="p-3 bg-white/10 rounded-xl text-sm leading-relaxed">
                                {user?.role === 'admin' && 'Você tem acesso total à plataforma (CRUDs globais, motor de IA e relatórios cruzados).'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
