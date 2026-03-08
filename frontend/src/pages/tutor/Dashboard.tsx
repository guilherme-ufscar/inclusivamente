import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import api from '../../services/api';
import { Users2, ClipboardCheck, Activity, Award } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function TutorDashboard() {
    const { user } = useAuth(); // Keep user for the greeting
    const [stats, setStats] = useState({
        students: 0,
        pendingFeedbacks: 0,
        activitiesToday: 0
    });

    useEffect(() => {
        const fetchTutorData = async () => {
            try {
                const studentsRes = await api.get('/students');
                setStats({
                    students: studentsRes.data.data?.length || 0,
                    pendingFeedbacks: 2,
                    activitiesToday: 5
                });
            } catch (error) {
                console.error('Failed to load tutor data', error);
            }
        };
        fetchTutorData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                        <Award className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Olá, Prof. {user?.name.split(' ')[0]}</h1>
                        <p className="text-slate-500 mt-1">Aqui está um resumo do acompanhamento dos seus alunos hoje.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-panel border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Meus Alunos</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.students}</h3>
                            </div>
                            <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
                                <Users2 className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Feedbacks Pendentes</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.pendingFeedbacks}</h3>
                            </div>
                            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                                <ClipboardCheck className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Atividades Realizadas (Hoje)</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.activitiesToday}</h3>
                            </div>
                            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                                <Activity className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle>Próximas Intervenções</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="p-8 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                            Lista de intervenções agendadas aparecerá aqui.
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-slate-200">
                    <CardHeader>
                        <CardTitle>Últimos Alertas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                                <strong>Alerta:</strong> João Pedro apresentou nível de autonomia baixo em "Atividade Física - Coordenação".
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
