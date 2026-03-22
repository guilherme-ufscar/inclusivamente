import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { BrainCircuit, Clock, CheckCircle2, AlertCircle, BookOpen, MessageSquare, GraduationCap, Layers, BarChart2, Hash } from 'lucide-react';

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
    bncc_codigo?: string | null;
    student?: { name: string };
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
    const anoNum = parseInt(parts[0], 10);
    return {
        ano: isNaN(anoNum) ? parts[0] : `${anoNum}º Ano`,
        disciplina: MATERIA_MAP[parts[1].toLowerCase()] || parts[1].toUpperCase(),
        pilula: parts[2],
        nivel: parts[3],
        atividade: parts.slice(4).join('_'),
    };
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
                        {activities.map(act => {
                            const parsed = parseActivityId(act.activity_id);
                            return (
                                <div key={act.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                                    <div className="flex items-start justify-between mb-2 gap-4">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <BrainCircuit className="w-5 h-5 text-brand-primary shrink-0" />
                                            <span className="font-medium text-slate-900 truncate">
                                                {parsed ? parsed.atividade : `Atividade #${act.activity_id?.slice(-6)}`}
                                            </span>
                                        </div>
                                        <span className="text-xs text-slate-500 shrink-0">
                                            {new Date(act.started_at).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>

                                    {parsed && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            <span className="bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-md text-xs font-medium flex items-center gap-1">
                                                <BookOpen className="w-3 h-3" /> {parsed.disciplina}
                                            </span>
                                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-xs flex items-center gap-1">
                                                <GraduationCap className="w-3 h-3" /> {parsed.ano}
                                            </span>
                                            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-xs flex items-center gap-1">
                                                <Layers className="w-3 h-3" /> Pílula {parsed.pilula}
                                            </span>
                                            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-xs flex items-center gap-1">
                                                <BarChart2 className="w-3 h-3" /> Nível {parsed.nivel}
                                            </span>
                                            {act.bncc_codigo && (
                                                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-mono font-semibold flex items-center gap-1">
                                                    <Hash className="w-3 h-3" /> {act.bncc_codigo}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
}
