import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { Plus, Pencil, Trash2, Search, GraduationCap, ClipboardEdit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Student {
    id: string;
    name: string;
    birth_date: string;
    grade_level: string;
    school_id: string;
    class_id?: string;
    School?: { name: string };
    class?: { name: string };
    Tutors?: Array<{ id: string, name: string }>;
    Reports?: Array<{ tutor_recommendation: string }>;
}

interface School {
    id: string;
    name: string;
}

interface ClassData {
    id: string;
    name: string;
    school_id: string;
}

interface Tutor {
    id: string;
    name: string;
    school_id: string;
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        birth_date: '',
        grade_level: '',
        school_id: '',
        class_id: '',
        tutor_ids: [] as string[]
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [studentsRes, schoolsRes, classesRes, tutorsRes] = await Promise.all([
                api.get('/students'),
                api.get('/schools'),
                api.get('/classes'),
                api.get('/tutors')
            ]);
            setStudents(studentsRes.data.data || []);
            setSchools(schoolsRes.data.data || []);
            setClasses(classesRes.data.data || []);
            setTutors(tutorsRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (student?: Student) => {
        if (student) {
            setEditingId(student.id);
            setFormData({
                name: student.name,
                birth_date: student.birth_date ? new Date(student.birth_date).toISOString().split('T')[0] : '',
                grade_level: student.grade_level || '',
                school_id: student.school_id || '',
                class_id: student.class_id || '',
                tutor_ids: student.Tutors?.map(t => t.id) || []
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                birth_date: '',
                grade_level: '',
                school_id: schools[0]?.id || '',
                class_id: '',
                tutor_ids: []
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Formata a data para ISO complementar se necessário no Prisma
            const payload = {
                ...formData,
                birth_date: new Date(formData.birth_date).toISOString()
            };

            if (editingId) {
                await api.put(`/students/${editingId}`, payload);
            } else {
                await api.post('/students', payload);
            }
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            console.error('Failed to save student', err);
            alert(err.response?.data?.message || 'Erro ao salvar aluno.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir este aluno? Toda a anamnese, perfil cognitivo e histórico de atividades serão perdidos permanentemente.')) {
            try {
                await api.delete(`/students/${id}`);
                fetchData();
            } catch (err) {
                console.error('Failed to delete student', err);
                alert('Erro ao excluir aluno.');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Gestão de Alunos</h1>
                    <p className="text-slate-500 mt-1">Acompanhamento e cadastro de perfis estudantis para inclusão.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="shrink-0">
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Aluno
                </Button>
            </div>

            <Card className="glass-panel border-none shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-white/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar pelo nome do aluno..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Aluno</th>
                                <th className="px-6 py-4">Turma</th>
                                <th className="px-6 py-4">Série / Grau</th>
                                <th className="px-6 py-4">Tutores</th>
                                <th className="px-6 py-4">Necessita Tutor?</th>
                                <th className="px-6 py-4">Escola Matrícula</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-slate-500">Caregando alunos...</td>
                                </tr>
                            ) : students.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        <GraduationCap className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                        Nenhum aluno cadastrado no sistema.
                                    </td>
                                </tr>
                            ) : (
                                students.map((student) => (
                                    <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center font-bold text-brand-secondary">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="block">{student.name}</span>
                                                <span className="block text-xs text-slate-400 font-normal">
                                                    Nascimento: {new Date(student.birth_date).toLocaleDateString('pt-BR')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">
                                            {student.class?.name || 'Sem turma'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {student.grade_level || 'Não informado'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {student.Tutors && student.Tutors.length > 0 ? (
                                                    student.Tutors.map(t => (
                                                        <span key={t.id} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[10px] font-medium border border-indigo-100">
                                                            {t.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-slate-400 text-xs italic">Sem tutor</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {student.Reports && student.Reports.length > 0 ? (
                                                <div className="flex items-center gap-2">
                                                    {student.Reports[0].tutor_recommendation === 'continuous' && (
                                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase ring-1 ring-inset ring-red-600/20">Sim (Contínuo)</span>
                                                    )}
                                                    {student.Reports[0].tutor_recommendation === 'sporadic' && (
                                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 uppercase ring-1 ring-inset ring-amber-600/20">Esporádico</span>
                                                    )}
                                                    {student.Reports[0].tutor_recommendation === 'not_needed' && (
                                                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase ring-1 ring-inset ring-emerald-600/20">Não</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 text-xs italic">Sem dados</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {student.School?.name || 'Escola não encontrada'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/admin/anamnesis?studentId=${student.id}`)}
                                                    title="Fazer Anamnese"
                                                    className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                                                >
                                                    <ClipboardEdit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenModal(student)}
                                                    className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Editar Aluno' : 'Novo Aluno'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nome Completo do Aluno"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Data de Nascimento"
                            type="date"
                            required
                            value={formData.birth_date}
                            onChange={e => setFormData({ ...formData, birth_date: e.target.value })}
                        />
                        <Input
                            label="Série / Nível Escolar"
                            placeholder="ex: 1º Ano EF"
                            value={formData.grade_level}
                            onChange={e => setFormData({ ...formData, grade_level: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Escola Matrícula <span className="text-red-500">*</span></label>
                        <select
                            required
                            className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            value={formData.school_id}
                            onChange={e => setFormData({ ...formData, school_id: e.target.value })}
                        >
                            <option value="" disabled>Selecione a instituição de ensino</option>
                            {schools.map(school => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Turma (Opcional)</label>
                        <select
                            className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            value={formData.class_id}
                            onChange={e => setFormData({ ...formData, class_id: e.target.value })}
                        >
                            <option value="">Nenhuma turma</option>
                            {classes.filter(c => c.school_id === formData.school_id).map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Tutores Responsáveis</label>
                        <div className="grid grid-cols-2 gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50/50 max-h-32 overflow-y-auto">
                            {tutors.filter(t => t.school_id === formData.school_id).map(tutor => (
                                <label key={tutor.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded-md transition-colors">
                                    <input
                                        type="checkbox"
                                        className="rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                                        checked={formData.tutor_ids.includes(tutor.id)}
                                        onChange={(e) => {
                                            const newIds = e.target.checked
                                                ? [...formData.tutor_ids, tutor.id]
                                                : formData.tutor_ids.filter(id => id !== tutor.id);
                                            setFormData({ ...formData, tutor_ids: newIds });
                                        }}
                                    />
                                    <span className="text-xs text-slate-700 truncate">{tutor.name}</span>
                                </label>
                            ))}
                            {tutors.filter(t => t.school_id === formData.school_id).length === 0 && (
                                <p className="text-[10px] text-slate-400 col-span-2 italic">Nenhum tutor cadastrado nesta escola.</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={!schools.length}>
                            {editingId ? 'Salvar Alterações' : 'Cadastrar Aluno'}
                        </Button>
                    </div>
                </form>
            </Modal>

        </div>
    );
}
