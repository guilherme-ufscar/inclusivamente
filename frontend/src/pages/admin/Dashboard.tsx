import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import api from '../../services/api';
import { Users, School, BrainCircuit, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        schools: 0,
        tutors: 0,
        students: 0,
        activities: 0
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [schoolsRes, tutorsRes, studentsRes] = await Promise.all([
                    api.get('/schools'),
                    api.get('/tutors'),
                    api.get('/students')
                ]);

                setStats({
                    schools: schoolsRes.data.data?.length || 0,
                    tutors: tutorsRes.data.data?.length || 0,
                    students: studentsRes.data.data?.length || 0,
                    activities: 24 // Mock placeholder until global activities route exists
                });
            } catch (error) {
                console.error('Failed to load dashboard data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <img src="/gato-macho-cartoon.webp" alt="Mascot" className="w-16 h-16 object-contain" />
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Dashboard General</h1>
                        <p className="text-slate-500 mt-1">Bem-vindo(a) ao painel de controle central da Inclusiva Mente Educa.</p>
                    </div>
                </div>
                <img src="/gato-femea-cartoon.webp" alt="Mascot" className="w-16 h-16 object-contain hidden lg:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <Card className="glass-panel border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Escolas Parceiras</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">{isLoading ? '-' : stats.schools}</h3>
                            </div>
                            <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
                                <School className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Tutores Ativos</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">{isLoading ? '-' : stats.tutors}</h3>
                            </div>
                            <div className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
                                <Users className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Alunos Atendidos</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">{isLoading ? '-' : stats.students}</h3>
                            </div>
                            <div className="p-3 bg-brand-secondary/10 rounded-xl text-brand-secondary">
                                <BrainCircuit className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Atividades Realizadas</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">{isLoading ? '-' : stats.activities}</h3>
                            </div>
                            <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-panel border-none shadow-sm border-l-4 border-l-red-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-slate-800">Alunos que precisam de tutor</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-red-600">3</div>
                            <div className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase">Crítico</div>
                        </div>
                        <p className="text-sm text-slate-500 mt-2">Alunos com autonomia baixa registrada nas últimas atividades.</p>
                        <button onClick={() => navigate('/admin/students')} className="text-brand-primary text-sm font-semibold mt-4 hover:underline">Ver Listagem Completa →</button>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-none shadow-sm border-l-4 border-l-amber-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-slate-800">Check-ins Pendentes</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div className="text-3xl font-bold text-amber-600">12</div>
                            <div className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase">Troca 360</div>
                        </div>
                        <p className="text-sm text-slate-500 mt-2">Famílias aguardando mensagem semanal de acompanhamento.</p>
                        <button onClick={() => navigate('/admin/checkins')} className="text-brand-primary text-sm font-semibold mt-4 hover:underline">Disparar WhatsApp →</button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle>Engajamento Semanal</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80 flex items-center justify-center text-slate-400">
                        {/* Chart.js integration goes here */}
                        <p>Gráfico de Atividades (Mock)</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle>Alertas e Recomendações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                                <strong>Atenção:</strong> 3 alunos necessitam revisão na intervenção de tutor (Autonomia baixa).
                            </div>
                            <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-sm border border-amber-100">
                                Lembrete: Atualize os dados de anamnese das novas turmas.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    );
}
