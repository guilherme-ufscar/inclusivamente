import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Search, ChevronRight, User, Calendar } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    class?: { name: string };
    grade_level: string;
}

interface Report {
    id: string;
    student_id: string;
    period_start: string;
    period_end: string;
    summary_text: string;
    activities_with_tutor_count: number;
    activities_without_tutor_count: number;
    autonomy_percentage: number;
    tutor_recommendation: string;
    tutor_observations: string;
    generated_at: string;
}

export default function SchoolReports() {
    const { user } = useAuth();
    const schoolId = user?.school_id;
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleSelectStudent = async (student: Student) => {
        setSelectedStudent(student);
        try {
            const res = await api.get(`/students/${student.id}/reports`);
            setReports(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch reports', err);
            setReports([]);
        }
    };

    const getRecommendationBadge = (rec: string) => {
        const map: Record<string, { color: string; label: string }> = {
            not_needed: { color: 'bg-emerald-100 text-emerald-700', label: 'Não necessário' },
            sporadic: { color: 'bg-amber-100 text-amber-700', label: 'Esporádico' },
            continuous: { color: 'bg-red-100 text-red-700', label: 'Contínuo' },
        };
        const info = map[rec] || { color: 'bg-slate-100 text-slate-500', label: rec || '-' };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${info.color}`}>{info.label}</span>;
    };

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedStudent) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => setSelectedStudent(null)}>← Voltar</Button>
                    <div>
                        <h1 className="text-2xl font-heading font-bold text-slate-900">Relatórios</h1>
                        <p className="text-slate-500">Aluno: <strong>{selectedStudent.name}</strong> • {selectedStudent.class?.name || 'Sem turma'}</p>
                    </div>
                </div>

                {reports.length === 0 ? (
                    <Card className="shadow-sm">
                        <CardContent className="p-12 text-center text-slate-500">
                            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                            Nenhum relatório disponível para este aluno.
                        </CardContent>
                    </Card>
                ) : reports.map(report => (
                    <Card key={report.id} className="shadow-sm border-slate-200">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-brand-primary" />
                                    Relatório
                                </CardTitle>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(report.period_start).toLocaleDateString('pt-BR')} — {new Date(report.period_end).toLocaleDateString('pt-BR')}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{report.summary_text}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                                    <p className="text-2xl font-bold text-brand-primary">{report.activities_with_tutor_count}</p>
                                    <p className="text-xs text-slate-500 mt-1">Com Tutor</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                                    <p className="text-2xl font-bold text-brand-secondary">{report.activities_without_tutor_count}</p>
                                    <p className="text-xs text-slate-500 mt-1">Sem Tutor</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                                    <p className="text-2xl font-bold text-brand-accent">{report.autonomy_percentage}%</p>
                                    <p className="text-xs text-slate-500 mt-1">Autonomia</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                                    <p className="text-xs text-slate-500 mb-2">Recomendação Tutor</p>
                                    {getRecommendationBadge(report.tutor_recommendation)}
                                </div>
                            </div>

                            {report.tutor_observations && (
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                    <p className="text-sm font-medium text-amber-800 mb-1">Observações do Tutor</p>
                                    <p className="text-sm text-amber-700">{report.tutor_observations}</p>
                                </div>
                            )}

                            <div className="text-xs text-slate-400 text-right">
                                Gerado em: {new Date(report.generated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Relatórios & Feedback</h1>
                <p className="text-slate-500 mt-1">Selecione um aluno para visualizar seus relatórios de desempenho.</p>
            </div>

            <Card className="glass-panel border-none shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-white/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Buscar aluno..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-500">Carregando alunos...</div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <User className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                            Nenhum aluno encontrado.
                        </div>
                    ) : filtered.map(student => (
                        <button
                            key={student.id}
                            onClick={() => handleSelectStudent(student)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{student.name}</p>
                                    <p className="text-xs text-slate-500">{student.class?.name || 'Sem turma'} • {student.grade_level || 'Sem série'}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                        </button>
                    ))}
                </div>
            </Card>
        </div>
    );
}
