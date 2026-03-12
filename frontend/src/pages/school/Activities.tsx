import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { BrainCircuit, Clock, CheckCircle2, AlertCircle, BookOpen, MessageSquare } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    class?: { name: string };
}

interface ActivityLog {
    id: string;
    student_id: string;
    activity_id: string;
    started_at: string;
    completed_at: string;
    time_spent: number;
    correct_count: number;
    errors_count: number;
    difficulty_perceived: string;
    autonomy_level: string;
    tutor_intervention_needed: string;
    tutor_observations: string;
    student?: { name: string };
}

export default function SchoolActivities() {
    const { user } = useAuth();
    const schoolId = user?.school_id;
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await api.get('/students', { params: { school_id: schoolId } });
                setStudents(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch students', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, [schoolId]);

    const handleStudentChange = async (studentId: string) => {
        setSelectedStudent(studentId);
        if (!studentId) { setActivities([]); return; }
        try {
            const res = await api.get(`/students/${studentId}/activities`);
            setActivities(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch activities', err);
        }
    };

    const formatDuration = (seconds: number) => {
        if (!seconds) return '-';
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}min ${s}s`;
    };

    const getAutonomyBadge = (level: string) => {
        const map: Record<string, { color: string; label: string }> = {
            high: { color: 'bg-emerald-100 text-emerald-700', label: 'Alta' },
            medium: { color: 'bg-amber-100 text-amber-700', label: 'Média' },
            low: { color: 'bg-red-100 text-red-700', label: 'Baixa' },
        };
        const info = map[level] || { color: 'bg-slate-100 text-slate-500', label: level || '-' };
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${info.color}`}>{info.label}</span>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Atividades</h1>
                <p className="text-slate-500 mt-1">Acompanhe as atividades realizadas pelos alunos da sua escola.</p>
            </div>

            <Card className="glass-panel border-none shadow-sm">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/50">
                    <div className="flex-1">
                        <label className="text-sm font-medium text-slate-700 mb-1 block">Selecione um Aluno</label>
                        <select
                            className="w-full max-w-md px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                            value={selectedStudent}
                            onChange={e => handleStudentChange(e.target.value)}
                        >
                            <option value="">Escolha um aluno...</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.name} {s.class?.name ? `(${s.class.name})` : ''}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {!selectedStudent ? (
                    <div className="p-12 text-center text-slate-500">
                        <BrainCircuit className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        Selecione um aluno para visualizar suas atividades.
                    </div>
                ) : activities.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        Nenhuma atividade registrada para este aluno.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {activities.map(act => (
                            <div key={act.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <BrainCircuit className="w-5 h-5 text-brand-primary" />
                                        <span className="font-medium text-slate-900">Atividade #{act.activity_id?.slice(-6)}</span>
                                    </div>
                                    <span className="text-xs text-slate-500">
                                        {new Date(act.started_at).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        {formatDuration(act.time_spent)}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        {act.correct_count || 0} acertos
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <AlertCircle className="w-4 h-4 text-red-400" />
                                        {act.errors_count || 0} erros
                                    </div>
                                    <div>
                                        Autonomia: {getAutonomyBadge(act.autonomy_level)}
                                    </div>
                                </div>
                                {act.tutor_observations && (
                                    <p className="mt-2 text-sm text-slate-500 italic bg-slate-50 rounded-lg p-3 flex items-start gap-2">
                                        <MessageSquare className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" /> {act.tutor_observations}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
