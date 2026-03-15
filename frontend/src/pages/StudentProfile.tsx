import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import api from '../services/api';
import {
    ArrowLeft, User, GraduationCap, School, Calendar, Heart, Brain,
    Activity, CheckCircle2, XCircle, Clock, TrendingUp, TrendingDown,
    AlertTriangle, Star, BookOpen, Users, FileText, Coins, ChevronDown,
    ChevronUp, Filter, Minus, Lock, ClipboardList
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, PointElement, LineElement,
    ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, PointElement, LineElement,
    ArcElement, Title, Tooltip, Legend, Filler
);

// ─── Types ───────────────────────────────────────────────────────────────────

interface StudentDetail {
    id: string;
    name: string;
    birth_date: string;
    grade_level?: string;
    cpf?: string;
    rg?: string;
    diagnosis?: string;
    needs_tutor?: boolean;
    status?: string;
    coins?: number;
    persona?: number;
    sondagem_completed?: boolean;
    sondagem_score?: number;
    sondagem_perfil?: number;
    School?: { name: string };
    class?: { name: string };
    Tutors?: Array<{ id: string; name: string }>;
    guardian?: {
        name: string;
        cpf?: string;
        phone?: string;
        email?: string;
        address?: string;
        KinshipType?: { name: string };
    };
    user?: { email?: string };
}

interface ActivityLog {
    id: string;
    started_at: string;
    completed_at?: string;
    time_spent?: number;
    errors_count?: number;
    correct_count?: number;
    difficulty_perceived?: 'easy' | 'medium' | 'hard';
    autonomy_level?: 'high' | 'medium' | 'low';
    has_tutor?: boolean;
    tutor_intervention_needed?: 'yes' | 'no' | 'partial';
    tutor_observations?: string;
    activity_id?: string;
}

interface CognitiveProfile {
    cognitive_level?: string;
    learning_style?: string;
    special_needs?: string;
    summary?: string;
}

interface Report {
    id: string;
    period_start?: string;
    period_end?: string;
    summary_text?: string;
    tutor_recommendation?: string;
    autonomy_percentage?: number;
    activities_with_tutor_count?: number;
    activities_without_tutor_count?: number;
    tutor_observations?: string;
    generated_at?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const calcAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
};

const formatDate = (d?: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('pt-BR');
};

const formatTime = (seconds?: number) => {
    if (!seconds) return '—';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const diagnosisColor = (d?: string) => {
    if (!d) return 'bg-slate-100 text-slate-600';
    const map: Record<string, string> = {
        TEA: 'bg-blue-100 text-blue-700',
        TDAH: 'bg-amber-100 text-amber-700',
        Dislexia: 'bg-purple-100 text-purple-700',
        DI: 'bg-rose-100 text-rose-700',
    };
    return map[d] || 'bg-teal-100 text-teal-700';
};

const autonomyLabel = (level?: string) => {
    if (level === 'high') return { label: 'Alta', cls: 'bg-emerald-100 text-emerald-700' };
    if (level === 'medium') return { label: 'Média', cls: 'bg-amber-100 text-amber-700' };
    if (level === 'low') return { label: 'Baixa', cls: 'bg-red-100 text-red-700' };
    return { label: '—', cls: 'bg-slate-100 text-slate-500' };
};

const difficultyLabel = (d?: string) => {
    if (d === 'easy') return { label: 'Fácil', cls: 'bg-emerald-50 text-emerald-600' };
    if (d === 'medium') return { label: 'Médio', cls: 'bg-amber-50 text-amber-600' };
    if (d === 'hard') return { label: 'Difícil', cls: 'bg-red-50 text-red-600' };
    return { label: '—', cls: 'bg-slate-50 text-slate-400' };
};

const recLabel = (r?: string) => {
    if (r === 'continuous') return { label: 'Contínuo', cls: 'bg-red-100 text-red-700' };
    if (r === 'sporadic') return { label: 'Esporádico', cls: 'bg-amber-100 text-amber-700' };
    if (r === 'not_needed') return { label: 'Não Necessário', cls: 'bg-emerald-100 text-emerald-700' };
    return { label: '—', cls: 'bg-slate-100 text-slate-500' };
};

const personaLabel = (p?: number) => {
    if (p === 1) return 'TEA Nível 2';
    if (p === 2) return 'DI Leve + TEA';
    if (p === 3) return 'DI Severa + Motora';
    if (p === 4) return 'Deficiência Visual';
    return 'Padrão';
};

const cogLevelLabel = (l?: string) => {
    const map: Record<string, string> = {
        very_low: 'Muito Baixo', low: 'Baixo', medium: 'Médio',
        high: 'Alto', very_high: 'Muito Alto',
    };
    return map[l || ''] || l || '—';
};

const learningStyleLabel = (s?: string) => {
    const map: Record<string, string> = {
        visual: 'Visual', auditivo: 'Auditivo', cinestesico: 'Cinestésico',
    };
    return map[s || ''] || s || '—';
};

// ─── Activity filter types ────────────────────────────────────────────────────

type ActivityFilter = 'all' | 'with_tutor' | 'without_tutor' | 'easy' | 'medium' | 'hard' | 'autonomy_high' | 'autonomy_medium' | 'autonomy_low';

const ACTIVITY_FILTERS: { value: ActivityFilter; label: string }[] = [
    { value: 'all', label: 'Todas' },
    { value: 'with_tutor', label: 'Com Tutor' },
    { value: 'without_tutor', label: 'Sem Tutor' },
    { value: 'easy', label: 'Fácil' },
    { value: 'medium', label: 'Médio' },
    { value: 'hard', label: 'Difícil' },
    { value: 'autonomy_high', label: 'Autonomia Alta' },
    { value: 'autonomy_medium', label: 'Autonomia Média' },
    { value: 'autonomy_low', label: 'Autonomia Baixa' },
];

function filterActivities(logs: ActivityLog[], filter: ActivityFilter): ActivityLog[] {
    if (filter === 'all') return logs;
    if (filter === 'with_tutor') return logs.filter(l => l.has_tutor);
    if (filter === 'without_tutor') return logs.filter(l => !l.has_tutor);
    if (filter === 'easy') return logs.filter(l => l.difficulty_perceived === 'easy');
    if (filter === 'medium') return logs.filter(l => l.difficulty_perceived === 'medium');
    if (filter === 'hard') return logs.filter(l => l.difficulty_perceived === 'hard');
    if (filter === 'autonomy_high') return logs.filter(l => l.autonomy_level === 'high');
    if (filter === 'autonomy_medium') return logs.filter(l => l.autonomy_level === 'medium');
    if (filter === 'autonomy_low') return logs.filter(l => l.autonomy_level === 'low');
    return logs;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, sub, color = 'brand-primary' }: {
    icon: React.ReactNode; label: string; value: string | number; sub?: string; color?: string;
}) {
    return (
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-xl bg-${color}/10 flex items-center justify-center text-${color} shrink-0`}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
                <p className="text-xl font-bold text-slate-900 leading-tight">{value}</p>
                {sub && <p className="text-xs text-slate-400">{sub}</p>}
            </div>
        </div>
    );
}

// ─── Section Title ────────────────────────────────────────────────────────────

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
    return (
        <div className="flex items-center gap-2 mb-4">
            <span className="text-brand-primary">{icon}</span>
            <h2 className="text-lg font-bold text-slate-800 font-heading">{title}</h2>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudentProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    const [student, setStudent] = useState<StudentDetail | null>(null);
    const [activities, setActivities] = useState<ActivityLog[]>([]);
    const [cognitiveProfile, setCognitiveProfile] = useState<CognitiveProfile | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');
    const [showAllActivities, setShowAllActivities] = useState(false);

    const backUrl = location.pathname.startsWith('/admin')
        ? '/admin/students'
        : location.pathname.startsWith('/school')
        ? '/school/students'
        : '/tutor/students';

    useEffect(() => {
        if (!id) return;
        const fetchAll = async () => {
            setIsLoading(true);
            try {
                const [studentRes, activitiesRes, profileRes, reportsRes] = await Promise.allSettled([
                    api.get(`/students/${id}`),
                    api.get(`/students/${id}/activities`),
                    api.get(`/students/${id}/cognitive-profile`),
                    api.get(`/students/${id}/reports`),
                ]);

                if (studentRes.status === 'fulfilled') {
                    setStudent(studentRes.value.data.data || studentRes.value.data);
                }
                if (activitiesRes.status === 'fulfilled') {
                    const raw = activitiesRes.value.data.data || activitiesRes.value.data || [];
                    setActivities(Array.isArray(raw) ? raw : []);
                }
                if (profileRes.status === 'fulfilled') {
                    setCognitiveProfile(profileRes.value.data.data || profileRes.value.data);
                }
                if (reportsRes.status === 'fulfilled') {
                    const raw = reportsRes.value.data.data || reportsRes.value.data || [];
                    setReports(Array.isArray(raw) ? raw : []);
                }
            } catch (e) {
                console.error('Error fetching student profile:', e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAll();
    }, [id]);

    // ── Computed stats ──────────────────────────────────────────────────────

    const totalCorrect = activities.reduce((s, a) => s + (a.correct_count || 0), 0);
    const totalErrors = activities.reduce((s, a) => s + (a.errors_count || 0), 0);
    const totalActivities = activities.length;
    const completedActivities = activities.filter(a => a.completed_at);
    const avgTime = completedActivities.length
        ? Math.round(completedActivities.reduce((s, a) => s + (a.time_spent || 0), 0) / completedActivities.length)
        : 0;
    const withTutorCount = activities.filter(a => a.has_tutor).length;
    const autonomyHighCount = activities.filter(a => a.autonomy_level === 'high').length;
    const autonomyPct = totalActivities > 0 ? Math.round((autonomyHighCount / totalActivities) * 100) : 0;

    // ── Chart data ──────────────────────────────────────────────────────────

    const doughnutData = {
        labels: ['Acertos', 'Erros'],
        datasets: [{
            data: [totalCorrect || 0, totalErrors || 0],
            backgroundColor: ['#10b981', '#f43f5e'],
            borderWidth: 0,
        }],
    };

    // Activities per month (last 6 months)
    const monthlyMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        monthlyMap[key] = 0;
    }
    activities.forEach(a => {
        const d = new Date(a.started_at);
        const key = d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
        if (key in monthlyMap) monthlyMap[key]++;
    });
    const barData = {
        labels: Object.keys(monthlyMap),
        datasets: [{
            label: 'Atividades',
            data: Object.values(monthlyMap),
            backgroundColor: '#6366f1',
            borderRadius: 6,
        }],
    };

    // Autonomy trend (last 10 activities, score: high=3, medium=2, low=1)
    const autonomyScore = (l?: string) => l === 'high' ? 3 : l === 'medium' ? 2 : l === 'low' ? 1 : null;
    const last10 = [...activities].slice(0, 10).reverse();
    const lineData = {
        labels: last10.map((_, i) => `#${i + 1}`),
        datasets: [{
            label: 'Autonomia',
            data: last10.map(a => autonomyScore(a.autonomy_level)),
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139,92,246,0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#8b5cf6',
        }],
    };

    // Difficulty distribution
    const easyCount = activities.filter(a => a.difficulty_perceived === 'easy').length;
    const mediumCount = activities.filter(a => a.difficulty_perceived === 'medium').length;
    const hardCount = activities.filter(a => a.difficulty_perceived === 'hard').length;
    const difficultyData = {
        labels: ['Fácil', 'Médio', 'Difícil'],
        datasets: [{
            data: [easyCount, mediumCount, hardCount],
            backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
            borderWidth: 0,
        }],
    };

    // ── Filtered + paginated activities ─────────────────────────────────────

    const filteredActivities = filterActivities(activities, activityFilter);
    const displayedActivities = showAllActivities ? filteredActivities : filteredActivities.slice(0, 10);

    // ── Render ──────────────────────────────────────────────────────────────

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">Carregando perfil...</p>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="flex flex-col items-center justify-center min-h-96 gap-4">
                <AlertTriangle className="w-12 h-12 text-slate-300" />
                <p className="text-slate-500">Aluno não encontrado.</p>
                <button onClick={() => navigate(backUrl)} className="text-brand-primary text-sm underline">Voltar</button>
            </div>
        );
    }

    const isSchool = location.pathname.startsWith('/school');

    return (
        <div className="space-y-6 pb-12">
            {/* ── Banner de Bloqueio ────────────────────────────────────── */}
            {!student.sondagem_completed && (
                <div className="flex items-center justify-between gap-4 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                            <Lock className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-red-700">Perfil bloqueado – Sondagem pendente</p>
                            <p className="text-xs text-red-500 mt-0.5">Este aluno não pode acessar a plataforma de jogos até que a sondagem de perfil seja respondida.</p>
                        </div>
                    </div>
                    {isSchool && (
                        <button
                            onClick={() => navigate(`/school/students/${student.id}/sondagem`)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-xl whitespace-nowrap transition-colors shrink-0"
                        >
                            <ClipboardList className="w-4 h-4" />
                            Responder Sondagem
                        </button>
                    )}
                </div>
            )}

            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="flex items-start gap-4">
                <button
                    onClick={() => navigate(backUrl)}
                    className="mt-1 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 flex items-center gap-4 flex-wrap">
                    <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-2xl">
                        {student.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">
                                {student.name}
                            </h1>
                            {student.diagnosis && (
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${diagnosisColor(student.diagnosis)}`}>
                                    {student.diagnosis}
                                </span>
                            )}
                            {student.needs_tutor && (
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-700">
                                    Precisa de Tutor
                                </span>
                            )}
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${student.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                {student.status === 'active' ? 'Ativo' : student.status || 'Ativo'}
                            </span>
                        </div>
                        <p className="text-slate-500 mt-0.5 text-sm flex items-center gap-2">
                            <School className="w-4 h-4" /> {student.School?.name || '—'}
                            {student.class?.name && <><span className="text-slate-300">•</span> Turma: {student.class.name}</>}
                            {student.grade_level && <><span className="text-slate-300">•</span> {student.grade_level}</>}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Quick stats ──────────────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                    icon={<Calendar className="w-5 h-5" />}
                    label="Idade"
                    value={`${calcAge(student.birth_date)} anos`}
                    sub={formatDate(student.birth_date)}
                />
                <StatCard
                    icon={<Activity className="w-5 h-5" />}
                    label="Total Atividades"
                    value={totalActivities}
                    sub={`${withTutorCount} com tutor`}
                    color="brand-accent"
                />
                <StatCard
                    icon={<TrendingUp className="w-5 h-5" />}
                    label="Autonomia Alta"
                    value={`${autonomyPct}%`}
                    sub={`${autonomyHighCount} de ${totalActivities} atividades`}
                    color="brand-primary"
                />
                <StatCard
                    icon={<Star className="w-5 h-5" />}
                    label="Moedas no Jogo"
                    value={student.coins ?? 0}
                    sub={`Persona: ${personaLabel(student.persona)}`}
                    color="brand-accent"
                />
            </div>

            {/* ── Dados Pessoais ───────────────────────────────────────── */}
            <Card className="glass-panel border-none shadow-sm p-6">
                <SectionTitle icon={<User className="w-5 h-5" />} title="Dados Pessoais" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {[
                        { label: 'Data de Nascimento', value: formatDate(student.birth_date) },
                        { label: 'CPF', value: student.cpf || '—' },
                        { label: 'RG', value: student.rg || '—' },
                        { label: 'Diagnóstico', value: student.diagnosis || '—' },
                        { label: 'Série / Grau', value: student.grade_level || '—' },
                        { label: 'Turma', value: student.class?.name || '—' },
                        { label: 'Escola', value: student.School?.name || '—' },
                        { label: 'Precisa Tutor', value: student.needs_tutor ? 'Sim' : 'Não' },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-3">
                            <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
                            <p className="text-slate-800 font-semibold">{value}</p>
                        </div>
                    ))}
                </div>

                {student.Tutors && student.Tutors.length > 0 && (
                    <div className="mt-4">
                        <p className="text-xs text-slate-400 font-medium mb-2">Tutores Vinculados</p>
                        <div className="flex flex-wrap gap-2">
                            {student.Tutors.map(t => (
                                <span key={t.id} className="px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-semibold">
                                    {t.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </Card>

            {/* ── Responsável ──────────────────────────────────────────── */}
            {student.guardian && (
                <Card className="glass-panel border-none shadow-sm p-6">
                    <SectionTitle icon={<Heart className="w-5 h-5" />} title="Responsável" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {[
                            { label: 'Nome', value: student.guardian.name },
                            { label: 'Parentesco', value: student.guardian.KinshipType?.name || '—' },
                            { label: 'CPF', value: student.guardian.cpf || '—' },
                            { label: 'Telefone', value: student.guardian.phone || '—' },
                            { label: 'E-mail', value: student.guardian.email || '—' },
                            { label: 'Endereço', value: student.guardian.address || '—' },
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-slate-50 rounded-xl p-3">
                                <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
                                <p className="text-slate-800 font-semibold">{value}</p>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* ── Desempenho ───────────────────────────────────────────── */}
            <Card className="glass-panel border-none shadow-sm p-6">
                <SectionTitle icon={<TrendingUp className="w-5 h-5" />} title="Desempenho" />

                {totalActivities === 0 ? (
                    <p className="text-center text-slate-400 text-sm py-8">Nenhuma atividade registrada ainda.</p>
                ) : (
                    <>
                        {/* Summary stats */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                            {[
                                { icon: <CheckCircle2 className="w-4 h-4" />, label: 'Acertos', value: totalCorrect, cls: 'text-emerald-600' },
                                { icon: <XCircle className="w-4 h-4" />, label: 'Erros', value: totalErrors, cls: 'text-rose-500' },
                                { icon: <Clock className="w-4 h-4" />, label: 'Tempo Médio', value: formatTime(avgTime), cls: 'text-blue-500' },
                                { icon: <Users className="w-4 h-4" />, label: 'Com Tutor', value: `${withTutorCount}/${totalActivities}`, cls: 'text-violet-500' },
                                { icon: <TrendingUp className="w-4 h-4" />, label: 'Autonomia Alta', value: `${autonomyPct}%`, cls: 'text-brand-primary' },
                            ].map(({ icon, label, value, cls }) => (
                                <div key={label} className="bg-slate-50 rounded-xl p-3 text-center">
                                    <div className={`flex justify-center mb-1 ${cls}`}>{icon}</div>
                                    <p className="text-lg font-bold text-slate-800">{value}</p>
                                    <p className="text-xs text-slate-400">{label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Charts */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Acertos x Erros */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-4">
                                <p className="text-sm font-semibold text-slate-600 mb-3 text-center">Acertos × Erros</p>
                                <div className="h-44 flex items-center justify-center">
                                    {(totalCorrect + totalErrors) > 0 ? (
                                        <Doughnut
                                            data={doughnutData}
                                            options={{
                                                cutout: '65%',
                                                plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
                                                maintainAspectRatio: false,
                                            }}
                                        />
                                    ) : (
                                        <p className="text-slate-300 text-xs text-center">Sem dados de acertos/erros</p>
                                    )}
                                </div>
                            </div>

                            {/* Atividades por mês */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-4">
                                <p className="text-sm font-semibold text-slate-600 mb-3 text-center">Atividades por Mês</p>
                                <div className="h-44">
                                    <Bar
                                        data={barData}
                                        options={{
                                            maintainAspectRatio: false,
                                            plugins: { legend: { display: false } },
                                            scales: {
                                                y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 10 } } },
                                                x: { ticks: { font: { size: 10 } } },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Tendência de autonomia */}
                            <div className="bg-white rounded-2xl border border-slate-100 p-4">
                                <p className="text-sm font-semibold text-slate-600 mb-3 text-center">Tendência de Autonomia</p>
                                <div className="h-44">
                                    {last10.some(a => a.autonomy_level) ? (
                                        <Line
                                            data={lineData}
                                            options={{
                                                maintainAspectRatio: false,
                                                plugins: { legend: { display: false } },
                                                scales: {
                                                    y: {
                                                        min: 0, max: 3, ticks: {
                                                            stepSize: 1, font: { size: 10 },
                                                            callback: (v) => v === 1 ? 'Baixa' : v === 2 ? 'Média' : v === 3 ? 'Alta' : '',
                                                        },
                                                    },
                                                    x: { ticks: { font: { size: 10 } } },
                                                },
                                            }}
                                        />
                                    ) : (
                                        <p className="text-slate-300 text-xs text-center mt-8">Sem dados de autonomia</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Dificuldade */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div className="bg-white rounded-2xl border border-slate-100 p-4">
                                <p className="text-sm font-semibold text-slate-600 mb-3 text-center">Distribuição de Dificuldade</p>
                                <div className="h-40 flex items-center justify-center">
                                    {(easyCount + mediumCount + hardCount) > 0 ? (
                                        <Doughnut
                                            data={difficultyData}
                                            options={{
                                                cutout: '55%',
                                                plugins: { legend: { position: 'bottom', labels: { font: { size: 11 } } } },
                                                maintainAspectRatio: false,
                                            }}
                                        />
                                    ) : (
                                        <p className="text-slate-300 text-xs">Sem dados</p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-slate-100 p-4">
                                <p className="text-sm font-semibold text-slate-600 mb-3">Evolução do Progresso no Jogo</p>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>Acurácia</span>
                                            <span>{(totalCorrect + totalErrors) > 0 ? Math.round((totalCorrect / (totalCorrect + totalErrors)) * 100) : 0}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-emerald-500 rounded-full transition-all"
                                                style={{ width: `${(totalCorrect + totalErrors) > 0 ? Math.round((totalCorrect / (totalCorrect + totalErrors)) * 100) : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>Autonomia Geral</span>
                                            <span>{autonomyPct}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-brand-primary rounded-full transition-all"
                                                style={{ width: `${autonomyPct}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                                            <span>Atividades sem Tutor</span>
                                            <span>{totalActivities > 0 ? Math.round(((totalActivities - withTutorCount) / totalActivities) * 100) : 0}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-violet-500 rounded-full transition-all"
                                                style={{ width: `${totalActivities > 0 ? Math.round(((totalActivities - withTutorCount) / totalActivities) * 100) : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </Card>

            {/* ── Histórico de Atividades ──────────────────────────────── */}
            <Card className="glass-panel border-none shadow-sm p-6">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <SectionTitle icon={<Activity className="w-5 h-5" />} title="Histórico de Atividades" />
                    <div className="flex items-center gap-1 flex-wrap">
                        <Filter className="w-4 h-4 text-slate-400 mr-1" />
                        {ACTIVITY_FILTERS.map(f => (
                            <button
                                key={f.value}
                                onClick={() => { setActivityFilter(f.value); setShowAllActivities(false); }}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                    activityFilter === f.value
                                        ? 'bg-brand-primary text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredActivities.length === 0 ? (
                    <p className="text-center text-slate-400 text-sm py-8">Nenhuma atividade neste filtro.</p>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-3">Data</th>
                                        <th className="px-4 py-3">Duração</th>
                                        <th className="px-4 py-3">Acertos</th>
                                        <th className="px-4 py-3">Erros</th>
                                        <th className="px-4 py-3">Dificuldade</th>
                                        <th className="px-4 py-3">Autonomia</th>
                                        <th className="px-4 py-3">Tutor</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {displayedActivities.map((a) => {
                                        const aut = autonomyLabel(a.autonomy_level);
                                        const diff = difficultyLabel(a.difficulty_perceived);
                                        return (
                                            <tr key={a.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-4 py-3 text-slate-600">{formatDate(a.started_at)}</td>
                                                <td className="px-4 py-3 text-slate-600">{formatTime(a.time_spent)}</td>
                                                <td className="px-4 py-3">
                                                    <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                                        <CheckCircle2 className="w-3.5 h-3.5" /> {a.correct_count ?? '—'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="flex items-center gap-1 text-rose-500 font-medium">
                                                        <XCircle className="w-3.5 h-3.5" /> {a.errors_count ?? '—'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${diff.cls}`}>
                                                        {diff.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${aut.cls}`}>
                                                        {aut.label}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {a.has_tutor ? (
                                                        <span className="text-brand-primary font-semibold text-xs">Sim</span>
                                                    ) : (
                                                        <span className="text-slate-400 text-xs">Não</span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {filteredActivities.length > 10 && (
                            <div className="text-center mt-4">
                                <button
                                    onClick={() => setShowAllActivities(v => !v)}
                                    className="inline-flex items-center gap-1.5 text-sm text-brand-primary font-medium hover:underline"
                                >
                                    {showAllActivities
                                        ? <><ChevronUp className="w-4 h-4" /> Mostrar menos</>
                                        : <><ChevronDown className="w-4 h-4" /> Ver todas ({filteredActivities.length} atividades)</>
                                    }
                                </button>
                            </div>
                        )}
                    </>
                )}
            </Card>

            {/* ── Anamnese & Perfil Cognitivo ──────────────────────────── */}
            <Card className="glass-panel border-none shadow-sm p-6">
                <SectionTitle icon={<Brain className="w-5 h-5" />} title="Anamnese & Perfil Cognitivo" />

                {!cognitiveProfile ? (
                    <div className="text-center py-8">
                        <Brain className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                        <p className="text-slate-400 text-sm">Nenhum perfil cognitivo gerado ainda.</p>
                        <p className="text-slate-300 text-xs mt-1">Complete a anamnese para gerar o perfil.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-2xl p-4 border border-violet-100">
                                <p className="text-xs text-violet-500 font-semibold uppercase tracking-wide mb-1">Nível Cognitivo</p>
                                <p className="text-xl font-bold text-violet-800">{cogLevelLabel(cognitiveProfile.cognitive_level)}</p>
                            </div>
                            <div className="bg-gradient-to-br from-sky-50 to-cyan-50 rounded-2xl p-4 border border-sky-100">
                                <p className="text-xs text-sky-500 font-semibold uppercase tracking-wide mb-1">Estilo de Aprendizado</p>
                                <p className="text-xl font-bold text-sky-800">{learningStyleLabel(cognitiveProfile.learning_style)}</p>
                            </div>
                            <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-100">
                                <p className="text-xs text-rose-500 font-semibold uppercase tracking-wide mb-1">Necessidades Especiais</p>
                                <p className="text-sm font-semibold text-rose-800">
                                    {cognitiveProfile.special_needs
                                        ? (() => {
                                            try {
                                                const parsed = JSON.parse(cognitiveProfile.special_needs);
                                                return Array.isArray(parsed) ? parsed.join(', ') : cognitiveProfile.special_needs;
                                            } catch {
                                                return cognitiveProfile.special_needs;
                                            }
                                        })()
                                        : '—'
                                    }
                                </p>
                            </div>
                        </div>

                        {cognitiveProfile.summary && (
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-2 flex items-center gap-1">
                                    <BookOpen className="w-3.5 h-3.5" /> Resumo do Perfil
                                </p>
                                <p className="text-slate-700 text-sm leading-relaxed">{cognitiveProfile.summary}</p>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* ── Avaliações do Tutor ──────────────────────────────────── */}
            <Card className="glass-panel border-none shadow-sm p-6">
                <SectionTitle icon={<FileText className="w-5 h-5" />} title="Avaliações do Tutor" />

                {reports.length === 0 ? (
                    <div className="text-center py-8">
                        <FileText className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                        <p className="text-slate-400 text-sm">Nenhuma avaliação gerada ainda.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reports.map((r) => {
                            const rec = recLabel(r.tutor_recommendation);
                            return (
                                <div key={r.id} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                                    <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                                        <div>
                                            <p className="text-xs text-slate-400">
                                                {r.period_start && r.period_end
                                                    ? `${formatDate(r.period_start)} – ${formatDate(r.period_end)}`
                                                    : r.generated_at ? `Gerado em ${formatDate(r.generated_at)}` : '—'
                                                }
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${rec.cls}`}>
                                                Suporte {rec.label}
                                            </span>
                                            {r.autonomy_percentage != null && (
                                                <span className="text-xs text-slate-500 font-medium">
                                                    {r.autonomy_percentage}% autonomia
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {r.summary_text && (
                                        <p className="text-slate-700 text-sm leading-relaxed mb-3">{r.summary_text}</p>
                                    )}

                                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                                        {r.activities_with_tutor_count != null && (
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5" />
                                                {r.activities_with_tutor_count} com tutor
                                            </span>
                                        )}
                                        {r.activities_without_tutor_count != null && (
                                            <span className="flex items-center gap-1">
                                                <Minus className="w-3.5 h-3.5" />
                                                {r.activities_without_tutor_count} sem tutor
                                            </span>
                                        )}
                                    </div>

                                    {r.tutor_observations && (
                                        <div className="mt-3 pt-3 border-t border-slate-100">
                                            <p className="text-xs text-slate-400 font-medium mb-1">Observações do Tutor</p>
                                            <p className="text-slate-600 text-xs leading-relaxed">{r.tutor_observations}</p>
                                        </div>
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
