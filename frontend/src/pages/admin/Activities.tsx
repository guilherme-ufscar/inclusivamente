import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { Play, Check, Activity, MessageSquare } from 'lucide-react';

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
}

export default function ActivitiesPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [tutors, setTutors] = useState<any[]>([]);
    const [selectedStudentId, setSelectedStudentId] = useState<string>('');
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Modals state
    const [isStartModalOpen, setIsStartModalOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

    const [startForm, setStartForm] = useState({ activity_id: '', has_tutor: false, tutor_id: '' });
    const [feedbackForm, setFeedbackForm] = useState({ autonomy_level: 'medium', tutor_intervention_needed: 'yes', tutor_observations: '' });

    useEffect(() => {
        api.get('/students').then(res => setStudents(res.data.data)).catch(console.error);
        api.get('/tutors').then(res => setTutors(res.data.data)).catch(console.error);
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

    const handleStartActivity = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/activities/start', { ...startForm, student_id: selectedStudentId });
            const novaAtividadeId = res.data.data.id;

            setIsStartModalOpen(false);
            fetchActivities();

            // Aqui é onde passamos o ID para o jogo!
            const gameUrl = `https://jogos.inclusivamenteeduca.com/jogar?log_id=${novaAtividadeId}`;

            if (window.confirm(`Atividade registrada no sistema!\n\nO servidor gerou o seguinte log_id para esta sessão: \n${novaAtividadeId}\n\nÉ este ID que precisa ser passado para o jogo pela URL.\nDeseja simular a abertura do jogo (em nova aba) agora?`)) {
                window.open(gameUrl, '_blank');
            }
        } catch (err: any) {
            console.error('Erro detalhado:', err.response?.data);
            alert('Erro ao iniciar atividade: ' + (err.response?.data?.message || err.message));
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
                        disabled={!selectedStudentId}
                        onClick={() => setIsStartModalOpen(true)}
                        variant="primary"
                    >
                        <Play className="w-4 h-4 mr-2" /> Iniciar Atividade
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
                                <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div>
                                        <h4 className="font-semibold text-slate-800">Atividade: {log.activity_id}</h4>
                                        <p className="text-xs text-slate-500">Iniciado em: {new Date(log.started_at).toLocaleString('pt-BR')}</p>
                                        {log.completed_at && (
                                            <>
                                                <p className="text-xs text-emerald-600 mt-1">Concluído em: {new Date(log.completed_at).toLocaleString('pt-BR')}</p>
                                                {/* Exibição dos dados do game/webhook */}
                                                <div className="flex gap-3 mt-2 mb-1 text-xs">
                                                    {log.correct_count !== undefined && (
                                                        <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md border border-emerald-100">
                                                            Acertos: <strong className="font-bold">{log.correct_count}</strong>
                                                        </span>
                                                    )}
                                                    {log.errors_count !== undefined && (
                                                        <span className="bg-red-50 text-red-700 px-2 py-1 rounded-md border border-red-100">
                                                            Erros: <strong className="font-bold">{log.errors_count}</strong>
                                                        </span>
                                                    )}
                                                    {log.time_spent !== undefined && (
                                                        <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                                                            Tempo: {log.time_spent}s
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

            {/* Start Activity Modal */}
            <Modal isOpen={isStartModalOpen} onClose={() => setIsStartModalOpen(false)} title="Iniciar Nova Atividade">
                <form onSubmit={handleStartActivity} className="space-y-4">
                    <Input
                        label="Identificador / Nome da Atividade"
                        required
                        placeholder="Ex: Jogo da Memória"
                        value={startForm.activity_id}
                        onChange={e => setStartForm({ ...startForm, activity_id: e.target.value })}
                    />
                    <div className="flex items-center gap-2 mt-4">
                        <input
                            type="checkbox"
                            id="has_tutor"
                            checked={startForm.has_tutor}
                            onChange={e => setStartForm({ ...startForm, has_tutor: e.target.checked })}
                            className="rounded h-4 w-4 text-brand-primary focus:ring-brand-primary border-slate-300"
                        />
                        <label htmlFor="has_tutor" className="text-sm font-medium text-slate-700 cursor-pointer">Atividade acompanhada por Tutor?</label>
                    </div>

                    {startForm.has_tutor && (
                        <div className="space-y-1 mt-4 animate-in fade-in slide-in-from-top-1">
                            <label className="text-sm font-medium text-slate-700">Tutor Responsável</label>
                            <select
                                required={startForm.has_tutor}
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none bg-white shadow-sm"
                                value={startForm.tutor_id}
                                onChange={e => setStartForm({ ...startForm, tutor_id: e.target.value })}
                            >
                                <option value="" disabled>Selecione o tutor avaliador</option>
                                {tutors.length > 0 ? (
                                    tutors.map(t => <option key={t.id} value={t.id}>{t.name} ({t.specialty || 'Geral'})</option>)
                                ) : (
                                    <option disabled>Nenhum tutor cadastrado para esta escola</option>
                                )}
                            </select>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsStartModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Iniciar</Button>
                    </div>
                </form>
            </Modal>

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
