import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import api from '../../services/api';
import { BrainCircuit, FileText, Calendar, Heart } from 'lucide-react';

export default function ParentDashboard() {
    const [stats, setStats] = useState({
        totalActivities: 0,
        lastReportDate: '',
        autonomyTrend: 'Estável'
    });

    useEffect(() => {
        const fetchParentData = async () => {
            try {
                // In a real scenario, we would filter by the student(s) linked to this parent
                const reportsRes = await api.get('/reports');
                setStats({
                    totalActivities: 12,
                    lastReportDate: reportsRes.data.data?.[0]?.generated_at ? new Date(reportsRes.data.data[0].generated_at).toLocaleDateString('pt-BR') : 'Não disponível',
                    autonomyTrend: 'Em Crescimento'
                });
            } catch (error) {
                console.error('Failed to load parent data', error);
            }
        };
        fetchParentData();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-brand-secondary/10 flex items-center justify-center text-brand-secondary">
                        <Heart className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Painel da Família</h1>
                        <p className="text-slate-500 mt-1">Acompanhe de perto a evolução e o bem-estar do seu filho.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass-panel border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Atividades Realizadas</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">{stats.totalActivities}</h3>
                            </div>
                            <div className="p-3 bg-brand-secondary/10 rounded-xl text-brand-secondary">
                                <BrainCircuit className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Último Relatório</p>
                                <h3 className="text-xl font-bold text-slate-900 mt-2">{stats.lastReportDate}</h3>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
                                <FileText className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-none shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Evolução da Autonomia</p>
                                <h3 className="text-xl font-bold text-brand-secondary mt-2">{stats.autonomyTrend}</h3>
                            </div>
                            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600">
                                <Calendar className="w-6 h-6" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm border-slate-200">
                <CardHeader>
                    <CardTitle>Linha do Tempo de Evolução</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="p-12 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                        Gráfico de progresso pedagógico e socioemocional será exibido aqui.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
