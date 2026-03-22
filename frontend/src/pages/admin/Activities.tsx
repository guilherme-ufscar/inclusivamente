import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { Check, Activity, MessageSquare, RefreshCw, BookOpen, GraduationCap, Layers, BarChart2, Hash } from 'lucide-react';

interface Student {
    id: string;
    name: string;
}

interface ActivityLog {
    id: string;
    activity_id: string;
    started_at: string;
    completed_at: string | null;
    has_tutor: boolean;
    autonomy_level: string | null;
    tutor_observations: string | null;
    correct_count?: number;
    errors_count?: number;
    time_spent?: number;
    bncc_codigo?: string | null;
}

const MATERIA_MAP: Record<string, string> = {
    mt: 'Matemática', lp: 'Língua Portuguesa', cn: 'Ciências',
    hi: 'História', ge: 'Geografia', ar: 'Arte',
    ef: 'Educação Física', er: 'Ensino Religioso', li: 'Língua Inglesa',
};

function parseActivityId(activityId: string) {
    if (!activityId) return null;
    const parts = activityId.split('_');
    if (parts.length < 5) return null;
    const anoRaw = parts[0];
    const anoNum = parseInt(anoRaw, 10);
    return {
        ano: isNaN(anoNum) ? anoRaw : `${anoNum}º Ano`,
        disciplina: MATERIA_MAP[parts[1].toLowerCase()] || parts[1].toUpperCase(),
        pilula: parts[2],
        nivel: parts[3],
        atividade: parts.slice(4).join('_'),
    };
}

export default function ActivitiesPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Modals state
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

    const [feedbackForm, setFeedbackForm] = useState({ autonomy_level: 'medium', tutor_intervention_needed: 'yes', tutor_observations: '' });

    useEffect(() => {
        api.get('/students').then(res => setStudents(res.data.data)).catch(console.error);
    }, []);

    useEffect(() => {
        if (selectedStudentId) {
            fetchActivities();
        } else {
            setActivities([]);
        }
    }, [selectedStudentId]);

    const fetchActivities = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/students/${selectedStudentId}/activities`);
            setActivities(res.data.data);
        } catch (err) {
            console.error('Failed to fetch activities', err);
        } finally {
            setIsLoading(false);
        }
    };


    const handleFinishActivity = async (id: string) => {
        try {
            await api.post(`/activities/${id}/finish`, { time_spent: 30 }); // Dummy payload for simple finish
            fetchActivities();
        } catch (err: any) {
            alert('Erro ao finalizar atividade: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLogId) return;
        try {
            await api.post(`/activities/${selectedLogId}/tutor-feedback`, feedbackForm);
            setIsFeedbackModalOpen(false);
            fetchActivities();
        } catch (err: any) {
            alert('Erro ao enviar feedback: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Atividades Corporais</h1>
                    <p className="text-slate-500 mt-1">Acompanhamento e registro do desenvolvimento prático dos alunos.</p>
                </div>
            </div>

            <Card className="glass-panel border-none shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-white/50">
                    <div className="flex-1 max-w-md">
                        <select
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                        >
                            <option value="">Selecione um Aluno para visualizar o histórico</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <Button
                        disabled={!selectedStudentId || isLoading}
                        onClick={() => fetchActivities()}
                        variant="primary"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} /> Atualizar Histórico
                    </Button>
                </div>

                <div className="p-0">
                    {!selectedStudentId ? (
                        <div className="p-12 text-center text-slate-400">
                            <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>Selecione um aluno acima para visualizar ou registrar atividades.</p>
                        </div>
                    ) : isLoading ? (
                        <div className="p-12 text-center text-slate-400">Carregando histórico...</div>
                    ) : activities.length === 0 ? (
                        <div className="p-12 text-center text-slate-400">Nenhuma atividade registrada para este aluno.</div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {activities.map(log => (
                                <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        {(() => {
                                            const parsed = parseActivityId(log.activity_id);
                                            return parsed ? (
                                                <div className="mb-2">
                                                    <h4 className="font-semibold text-slate-800 mb-1">{parsed.atividade}</h4>
                                                    <div className="flex flex-wrap gap-2 text-xs">
                                                        <span className="bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                                                            <BookOpen className="w-3 h-3" /> {parsed.disciplina}
                                                        </span>
                                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                            <GraduationCap className="w-3 h-3" /> {parsed.ano}
                                                        </span>
                                                        <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                            <Layers className="w-3 h-3" /> Pílula {parsed.pilula}
                                                        </span>
                                                        <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                            <BarChart2 className="w-3 h-3" /> Nível {parsed.nivel}
                                                        </span>
                                                        {log.bncc_codigo && (
                                                            <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-mono font-semibold flex items-center gap-1">
                                                                <Hash className="w-3 h-3" /> {log.bncc_codigo}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <h4 className="font-semibold text-slate-800 mb-1">{log.activity_id}</h4>
                                            );
                                        })()}
                                        <p className="text-xs text-slate-500">Iniciado em: {new Date(log.started_at).toLocaleString('pt-BR')}</p>
                                        {log.completed_at && (
                                            <>
                                                <p className="text-xs text-emerald-600 mt-1">Concluído em: {new Date(log.completed_at).toLocaleString('pt-BR')}</p>
                                                <div className="flex gap-3 mt-2 mb-1 text-xs">
                                                    {log.correct_count !== undefined && (
                                                        <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-100">
                                                            Acertos: <strong>{log.correct_count}</strong>
                                                        </span>
                                                    )}
                                                    {log.errors_count !== undefined && (
                                                        <span className="bg-red-50 text-red-700 px-2 py-1 rounded-md border border-red-100">
                                                            Erros: <strong>{log.errors_count}</strong>
                                                        </span>
                                                    )}
                                                    {log.time_spent !== undefined && (
                                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                                                            Tempo: {Math.floor(log.time_spent / 60)}m {log.time_spent % 60}s
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                        {log.tutor_observations && (
                                            <p className="text-sm mt-2 text-slate-600 italic border-l-2 border-brand-accent pl-2">
                                                "{log.tutor_observations}"
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {!log.completed_at ? (
                                            <Button size="sm" onClick={() => handleFinishActivity(log.id)}>
                                                <Check className="w-4 h-4 mr-2" /> Finalizar
                                            </Button>
                                        ) : log.has_tutor && !log.tutor_observations ? (
                                            <Button
                                                size="sm"
                                                variant="accent"
                                                onClick={() => { setSelectedLogId(log.id); setIsFeedbackModalOpen(true); }}
                                            >
                                                <MessageSquare className="w-4 h-4 mr-2" /> Avaliar (Tutor)
                                            </Button>
                                        ) : (log.completed_at && (
                                            <span className="text-xs font-semibold px-2 py-1 bg-slate-100 text-slate-500 rounded border border-slate-200">
                                                Finalizado
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>


            {/* Tutor Feedback Modal */}
            <Modal isOpen={isFeedbackModalOpen} onClose={() => setIsFeedbackModalOpen(false)} title="Feedback do Tutor">
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Nível de Autonomia Observado</label>
                        <select
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            value={feedbackForm.autonomy_level}
                            onChange={e => setFeedbackForm({ ...feedbackForm, autonomy_level: e.target.value })}
                        >
                            <option value="high">Alto (Realizou sozinho)</option>
                            <option value="medium">Médio (Precisou de leves dicas)</option>
                            <option value="low">Baixo (Apoio braçal/constante)</option>
                        </select>
                    </div>

                    <div className="space-y-1 mt-4">
                        <label className="text-sm font-medium text-slate-700">Intervenção necessária?</label>
                        <select
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            value={feedbackForm.tutor_intervention_needed}
                            onChange={e => setFeedbackForm({ ...feedbackForm, tutor_intervention_needed: e.target.value })}
                        >
                            <option value="no">Não</option>
                            <option value="partial">Parcialmente</option>
                            <option value="yes">Sim</option>
                        </select>
                    </div>

                    <div className="space-y-1 mt-4">
                        <label className="text-sm font-medium text-slate-700">Observações Clínicas / Comportamentais</label>
                        <textarea
                            required
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
                            rows={4}
                            placeholder="Descreva a atitude do aluno, dificuldades encontradas, etc..."
                            value={feedbackForm.tutor_observations}
                            onChange={e => setFeedbackForm({ ...feedbackForm, tutor_observations: e.target.value })}
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsFeedbackModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" variant="accent">Salvar Avaliação</Button>
                    </div>
                </form>
            </Modal>

        </div>
    );
}
