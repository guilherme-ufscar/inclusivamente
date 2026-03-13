import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import api from '../../services/api';
import { Search, GraduationCap, ClipboardEdit, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Student {
    id: string;
    name: string;
    birth_date: string;
    grade_level: string;
    school_id: string;
    School?: { name: string };
    Reports?: Array<{ tutor_recommendation: string }>;
}

export default function MyStudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            try {
                const res = await api.get('/students');
                setStudents(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch students', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Meus Alunos</h1>
                <p className="text-slate-500 mt-1">Acompanhe os alunos sob sua supervisão tutorial.</p>
            </div>

            <Card className="glass-panel border-none shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-white/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar aluno..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Aluno</th>
                                <th className="px-6 py-4">Série / Grau</th>
                                <th className="px-6 py-4">Status Tutorial</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">Carregando...</td></tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <GraduationCap className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                        Nenhum aluno vinculado.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center font-bold text-brand-primary">
                                                {student.name.charAt(0)}
                                            </div>
                                            <span>{student.name}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{student.grade_level}</td>
                                        <td className="px-6 py-4">
                                            {student.Reports?.[0]?.tutor_recommendation === 'continuous' ? (
                                                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase">Foco Crítico</span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">Estável</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/tutor/students/${student.id}/profile`)}
                                                    title="Ver Perfil"
                                                    className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                                                >
                                                    <UserCircle className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/tutor/activities?student=${student.id}`)}
                                                    className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg"
                                                >
                                                    <ClipboardEdit className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
