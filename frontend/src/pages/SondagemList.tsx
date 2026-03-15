import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { ClipboardList, Lock, CheckCircle2, Search, ChevronRight, RefreshCw } from 'lucide-react';

const PERFIL_INFO: Record<number, { label: string; color: string }> = {
    1: { label: 'TEA Nível 2', color: 'text-purple-700 bg-purple-100' },
    2: { label: 'DI Leve + TEA', color: 'text-blue-700 bg-blue-100' },
    3: { label: 'DI Severa + Motora', color: 'text-red-700 bg-red-100' },
    4: { label: 'Baixa Complexidade', color: 'text-green-700 bg-green-100' },
    5: { label: 'Deficiência Visual', color: 'text-amber-700 bg-amber-100' },
};

const PERSONA_LABEL: Record<number, string> = {
    0: 'Padrão', 1: 'TEA Nível 2', 2: 'DI Leve + TEA',
    3: 'DI Severa + Motora', 4: 'Deficiência Visual',
};

interface Student {
    id: string;
    name: string;
    birth_date: string;
    grade_level?: string;
    sondagem_completed: boolean;
    sondagem_score?: number;
    sondagem_perfil?: number;
    persona?: number;
    School?: { name: string };
    class?: { name: string };
}

export default function SondagemList() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [tab, setTab] = useState<'pendentes' | 'concluidos'>('pendentes');
    const [search, setSearch] = useState('');

    const isAdmin = user?.role === 'admin';
    const sondagemBase = isAdmin ? '/admin/sondagem' : '/school/sondagem';
    const sondagemFormBase = isAdmin ? '/admin' : '/school';

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            try {
                const params: any = {};
                if (!isAdmin && user?.school_id) params.school_id = user.school_id;
                const res = await api.get('/students', { params });
                setStudents(res.data.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, [user]);

    // Auto-open a student's sondagem if studentId param provided (coming from student table)
    useEffect(() => {
        const sid = searchParams.get('studentId');
        if (sid) {
            navigate(`${sondagemFormBase}/students/${sid}/sondagem`);
        }
    }, [searchParams]);

    const filtered = students
        .filter(s => tab === 'pendentes' ? !s.sondagem_completed : s.sondagem_completed)
        .filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

    const pendentesCount = students.filter(s => !s.sondagem_completed).length;
    const concluidosCount = students.filter(s => s.sondagem_completed).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Sondagem de Perfil</h1>
                <p className="text-slate-500 mt-1">Instrumento de Avaliação Educacional Funcional — acompanhe o status de todos os alunos.</p>
            </div>

            {/* Tabs + busca */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
                <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                        <button
                            onClick={() => setTab('pendentes')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'pendentes' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <Lock className="w-4 h-4" />
                            Pendentes
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === 'pendentes' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'}`}>{pendentesCount}</span>
                        </button>
                        <button
                            onClick={() => setTab('concluidos')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'concluidos' ? 'bg-white text-green-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Concluídos
                            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${tab === 'concluidos' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>{concluidosCount}</span>
                        </button>
                    </div>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar aluno..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                        />
                    </div>
                </div>

                {/* Lista */}
                <div className="divide-y divide-slate-50">
                    {isLoading ? (
                        <div className="py-16 text-center text-slate-400 text-sm">Carregando...</div>
                    ) : filtered.length === 0 ? (
                        <div className="py-16 text-center">
                            <ClipboardList className="w-10 h-10 mx-auto text-slate-200 mb-3" />
                            <p className="text-slate-400 text-sm">
                                {tab === 'pendentes' ? 'Nenhum aluno com sondagem pendente.' : 'Nenhuma sondagem concluída ainda.'}
                            </p>
                        </div>
                    ) : filtered.map(student => (
                        <div key={student.id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/60 transition-colors">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border shrink-0 ${student.sondagem_completed ? 'bg-brand-secondary/10 border-brand-secondary/20 text-brand-secondary' : 'bg-red-50 border-red-200 text-red-400'}`}>
                                    {student.sondagem_completed ? student.name.charAt(0) : <Lock className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-semibold text-slate-800 truncate">{student.name}</p>
                                    <p className="text-xs text-slate-400">
                                        {student.class?.name || 'Sem turma'}{student.grade_level ? ` · ${student.grade_level}` : ''}
                                        {isAdmin && student.School?.name ? ` · ${student.School.name}` : ''}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0 ml-4">
                                {student.sondagem_completed && student.sondagem_perfil ? (
                                    <>
                                        <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${PERFIL_INFO[student.sondagem_perfil]?.color}`}>
                                            {PERFIL_INFO[student.sondagem_perfil]?.label}
                                        </span>
                                        <span className="hidden md:block text-xs text-slate-400">
                                            Pontuação: <strong className="text-slate-600">{student.sondagem_score ?? '—'}</strong>/400
                                        </span>
                                        <span className="text-xs text-slate-400 hidden lg:block">
                                            Persona: <strong className="text-slate-600">{PERSONA_LABEL[student.persona ?? 0]}</strong>
                                        </span>
                                        <button
                                            onClick={() => navigate(`${sondagemFormBase}/students/${student.id}/sondagem`)}
                                            title="Refazer / Editar Sondagem"
                                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-500 border border-slate-200 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                                        >
                                            <RefreshCw className="w-3.5 h-3.5" /> Editar
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => navigate(`${sondagemFormBase}/students/${student.id}/sondagem`)}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                                    >
                                        <ClipboardList className="w-3.5 h-3.5" /> Responder
                                    </button>
                                )}
                                <button
                                    onClick={() => navigate(`${isAdmin ? '/admin' : '/school'}/students/${student.id}/profile`)}
                                    className="p-1.5 text-slate-400 hover:text-indigo-500 transition-colors"
                                    title="Ver Perfil"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
