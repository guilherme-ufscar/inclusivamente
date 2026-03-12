import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ClipboardList, ChevronRight, CheckCircle2, Circle, Search } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    grade_level: string;
    class?: { name: string };
}

interface Sphere {
    id: string;
    name: string;
    description: string;
    Questions: Question[];
}

interface Question {
    id: string;
    question_text: string;
    question_type: string;
    options_json: string | null;
    is_required: boolean;
}

interface AnamnesisResponse {
    question_id: string;
    answer_json: string;
}

export default function SchoolAnamnesis() {
    const { user } = useAuth();
    const schoolId = user?.school_id;
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [spheres, setSpheres] = useState<Sphere[]>([]);
    const [, setResponses] = useState<AnamnesisResponse[]>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [completedStudents, setCompletedStudents] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
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
            const [sphereRes, anamnesisRes] = await Promise.all([
                api.get('/anamnesis/spheres'),
                api.get(`/students/${student.id}/anamnesis`)
            ]);
            setSpheres(sphereRes.data.data || []);
            const existingResponses = anamnesisRes.data.data || [];
            setResponses(existingResponses);

            const answerMap: Record<string, string> = {};
            existingResponses.forEach((r: AnamnesisResponse) => {
                try {
                    answerMap[r.question_id] = JSON.parse(r.answer_json);
                } catch {
                    answerMap[r.question_id] = r.answer_json;
                }
            });
            setAnswers(answerMap);
        } catch (err) {
            console.error('Failed to load anamnesis', err);
        }
    };

    const handleSave = async () => {
        if (!selectedStudent) return;
        setIsSaving(true);
        try {
            const payload = Object.entries(answers).map(([question_id, answer]) => ({
                question_id,
                answer_json: JSON.stringify(answer)
            }));
            await api.post(`/students/${selectedStudent.id}/anamnesis/responses`, { responses: payload });
            setCompletedStudents(prev => new Set(prev).add(selectedStudent.id));
            alert('Sondagem salva com sucesso!');
        } catch (err) {
            alert('Erro ao salvar sondagem.');
        } finally {
            setIsSaving(false);
        }
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
                        <h1 className="text-2xl font-heading font-bold text-slate-900">Sondagem Pedagógica</h1>
                        <p className="text-slate-500">Aluno: <strong>{selectedStudent.name}</strong></p>
                    </div>
                </div>

                {spheres.map(sphere => (
                    <Card key={sphere.id} className="shadow-sm border-slate-200">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-brand-primary" />
                                {sphere.name}
                            </CardTitle>
                            {sphere.description && <p className="text-sm text-slate-500 mt-1">{sphere.description}</p>}
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {sphere.Questions.map(q => (
                                <div key={q.id} className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        {q.question_text}
                                        {q.is_required && <span className="text-red-500 ml-1">*</span>}
                                    </label>
                                    {q.question_type === 'text' && (
                                        <textarea
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-primary outline-none min-h-[80px]"
                                            value={answers[q.id] || ''}
                                            onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                                            placeholder="Digite sua resposta..."
                                        />
                                    )}
                                    {q.question_type === 'boolean' && (
                                        <div className="flex gap-4">
                                            {['Sim', 'Não'].map(opt => (
                                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name={q.id} value={opt} checked={answers[q.id] === opt} onChange={() => setAnswers({ ...answers, [q.id]: opt })} className="accent-brand-primary" />
                                                    <span className="text-sm text-slate-700">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                    {(q.question_type === 'single_choice') && q.options_json && (
                                        <div className="space-y-2">
                                            {JSON.parse(q.options_json).map((opt: string) => (
                                                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                                    <input type="radio" name={q.id} value={opt} checked={answers[q.id] === opt} onChange={() => setAnswers({ ...answers, [q.id]: opt })} className="accent-brand-primary" />
                                                    <span className="text-sm text-slate-700">{opt}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                    {q.question_type === 'number' && (
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                                            value={answers[q.id] || ''}
                                            onChange={e => setAnswers({ ...answers, [q.id]: e.target.value })}
                                        />
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}

                <div className="flex justify-end">
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Salvando...' : 'Salvar Sondagem'}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Sondagem Pedagógica</h1>
                <p className="text-slate-500 mt-1">Selecione um aluno para realizar ou visualizar a sondagem pedagógica.</p>
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
                            <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-3" />
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
                            <div className="flex items-center gap-2">
                                {completedStudents.has(student.id) ? (
                                    <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                                        <CheckCircle2 className="w-4 h-4" /> Respondida
                                    </span>
                                ) : (
                                    <Circle className="w-4 h-4 text-slate-300" />
                                )}
                                <ChevronRight className="w-5 h-5 text-slate-400" />
                            </div>
                        </button>
                    ))}
                </div>
            </Card>
        </div>
    );
}
