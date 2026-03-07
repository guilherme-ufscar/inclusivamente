import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import api from '../../services/api';
import { HeartHandshake, Calendar, User, MessageSquare } from 'lucide-react';

interface ActivityLog {
    id: string;
    activity_id: string;
    completed_at: string;
    has_tutor: boolean;
    tutor_id: string;
    tutor_observations: string;
    autonomy_level: string;
    tutor?: { name: string, specialty: string };
}

export default function TutorHistoryPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Assuming we fetch global tutor history for all students for admin
                const res = await api.get('/activities/history'); // Need to check if this exists or use a student-specific one
                setLogs(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch tutor history', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Histórico de Tutoria</h1>
                <p className="text-slate-500 mt-1">Linha do tempo de acompanhamentos e intervenções especializadas.</p>
            </div>

            <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-8 py-4">
                {isLoading ? (
                    <p className="text-slate-400">Carregando histórico...</p>
                ) : logs.length === 0 ? (
                    <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center">
                        <HeartHandshake className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        <p className="text-slate-500">Nenhum registro de tutoria encontrado para este período.</p>
                    </div>
                ) : (
                    logs.map((log) => (
                        <div key={log.id} className="relative">
                            <span className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white ring-4 ring-slate-50">
                                <User className="w-4 h-4" />
                            </span>
                            <Card className="glass-panel border-none shadow-sm max-w-2xl">
                                <CardHeader className="pb-2 border-b border-slate-50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-base font-bold text-slate-800">
                                                Apoio em: {log.activity_id}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {new Date(log.completed_at).toLocaleString('pt-BR')}
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${log.autonomy_level === 'high' ? 'bg-emerald-100 text-emerald-700' :
                                                log.autonomy_level === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            Autonomia: {log.autonomy_level}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs">
                                            {log.tutor?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">{log.tutor?.name}</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">{log.tutor?.specialty}</p>
                                        </div>
                                    </div>
                                    {log.tutor_observations && (
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 italic text-sm text-slate-600">
                                            <MessageSquare className="w-4 h-4 inline mr-2 text-slate-400" />
                                            "{log.tutor_observations}"
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
