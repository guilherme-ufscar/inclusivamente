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

    const [isLoading, setIsLoading] = useState(true);
    const [students, setStudents] = useState<any[]>([]);
    const [timeline, setTimeline] = useState<any[]>([]);

    useEffect(() => {
        const fetchParentData = async () => {
            try {
                const res = await api.get('/guardians/me/dashboard');
                if (res.data.success) {
                    setStats(res.data.data.stats);
                    setStudents(res.data.data.students);
                    setTimeline(res.data.data.timeline);
                }
            } catch (error) {
                console.error('Failed to load parent data', error);
            } finally {
                setIsLoading(false);
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
                        <p className="text-slate-500 mt-1">Acompanhe de perto a evolução e o bem-estar {students.length > 0 ? `de ${students.map(s => s.name.split(' ')[0]).join(', ')}` : 'do seu filho'}.</p>
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
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-400">Carregando dados...</div>
                    ) : timeline.length === 0 ? (
                        <div className="p-12 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                            Nenhuma atividade ou relatório foi registrado ainda.
                        </div>
                    ) : (
                        <div className="relative border-l-2 border-brand-primary/20 ml-3 space-y-6 pb-4">
                            {timeline.map((item, idx) => (
                                <div key={`${item.id}-${idx}`} className="relative pl-6">
                                    <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${item.type === 'report' ? 'bg-blue-500' : 'bg-brand-primary'}`} />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{new Date(item.date).toLocaleString('pt-BR')}</p>
                                        <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">{item.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
