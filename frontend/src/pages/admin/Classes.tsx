import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Plus, School, GraduationCap, Pencil, Trash2 } from 'lucide-react';

interface ClassData {
    id: string;
    name: string;
    grade?: string;
    school_id: string;
    school?: { name: string };
    _count?: { Students: number };
}

interface Student {
    id: string;
    name: string;
}

interface School {
    id: string;
    name: string;
}

export default function ClassesPage() {
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [selectedClassName, setSelectedClassName] = useState('');
    const [classStudents, setClassStudents] = useState<Student[]>([]);

    const [formData, setFormData] = useState({ name: '', grade: '', school_id: '' });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [classRes, schoolRes] = await Promise.all([
                api.get('/classes'),
                api.get('/schools')
            ]);
            setClasses(classRes.data.data || []);
            setSchools(schoolRes.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (c?: ClassData) => {
        if (c) {
            setEditingId(c.id);
            setFormData({ name: c.name, grade: c.grade || '', school_id: c.school_id });
        } else {
            setEditingId(null);
            setFormData({ name: '', grade: '', school_id: schools[0]?.id || '' });
        }
        setIsModalOpen(true);
    };

    const handleViewStudents = async (c: ClassData) => {
        try {
            setSelectedClassName(c.name);
            const res = await api.get(`/students?class_id=${c.id}`);
            setClassStudents(res.data.data || []);
            setIsStudentsModalOpen(true);
        } catch (err) {
            alert('Erro ao carregar alunos da turma.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/classes/${editingId}`, formData);
            } else {
                await api.post('/classes', formData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert('Erro ao salvar turma.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir esta turma?')) {
            try {
                await api.delete(`/classes/${id}`);
                fetchData();
            } catch (err) {
                alert('Erro ao excluir.');
            }
        }
    };

    // Group classes by school
    const classesBySchool = schools.map(school => ({
        ...school,
        classes: classes.filter(c => c.school_id === school.id)
    })).filter(s => s.classes.length > 0 || !isLoading);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Gestão de Turmas</h1>
                    <p className="text-slate-500 mt-1">Organização de grupos de alunos por instituição e nível.</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-5 h-5 mr-2" />
                    Criar Turma
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                    <div className="p-8 text-center text-slate-500">Carregando...</div>
                ) : classesBySchool.length === 0 ? (
                    <div className="col-span-full p-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-100 text-slate-400">
                        Nenhuma escola ou turma cadastrada.
                    </div>
                ) : classesBySchool.map((school) => (
                    <Card key={school.id} className="glass-panel border-none shadow-sm overflow-hidden">
                        <div className="bg-brand-primary/10 p-4 border-b border-brand-primary/20 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <School className="w-5 h-5 text-brand-primary" />
                                <h2 className="font-bold text-slate-900">{school.name}</h2>
                            </div>
                        </div>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                {school.classes.length === 0 ? (
                                    <p className="text-sm text-slate-400 text-center py-4">Sem turmas cadastradas.</p>
                                ) : school.classes.map((c) => (
                                    <div key={c.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-brand-primary/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                                <GraduationCap className="w-5 h-5" />
                                            </div>
                                            <div className="cursor-pointer" onClick={() => handleViewStudents(c)}>
                                                <p className="text-sm font-bold text-slate-900">{c.name}</p>
                                                <p className="text-xs text-slate-500">{c._count?.Students || 0} Alunos • {c.grade || 'Nível não inf.'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleViewStudents(c)} className="text-xs font-bold text-brand-primary bg-brand-primary/5 px-2 py-1 rounded hover:bg-brand-primary/10 transition-colors mr-2">Ver Alunos</button>
                                            <button onClick={() => handleOpenModal(c)} className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Turma' : 'Criar Nova Turma'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Nome da Turma" placeholder="ex: 1º Ano A" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <Input label="Série/Nível" placeholder="ex: Fundamental I" value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })} />

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Escola</label>
                        <select
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                            value={formData.school_id}
                            onChange={e => setFormData({ ...formData, school_id: e.target.value })}
                            required
                        >
                            <option value="" disabled>Selecione a instituição</option>
                            {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Salvar Turma</Button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isStudentsModalOpen} onClose={() => setIsStudentsModalOpen(false)} title={`Alunos da Turma: ${selectedClassName}`}>
                <div className="space-y-4">
                    {classStudents.length === 0 ? (
                        <p className="text-center py-8 text-slate-400">Nenhum aluno vinculado a esta turma.</p>
                    ) : (
                        <div className="max-h-96 overflow-y-auto space-y-2">
                            {classStudents.map(s => (
                                <div key={s.id} className="p-3 bg-slate-50 rounded-xl flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold text-xs">
                                        {s.name.charAt(0)}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{s.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="pt-4 flex justify-end">
                        <Button onClick={() => setIsStudentsModalOpen(false)}>Fechar</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
