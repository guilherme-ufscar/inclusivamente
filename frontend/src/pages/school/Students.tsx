import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Pencil, Trash2, Search, Users2 } from 'lucide-react';

interface Tutor {
    id: string;
    name: string;
}

interface ClassItem {
    id: string;
    name: string;
}

interface Student {
    id: string;
    name: string;
    birth_date: string;
    school_id: string;
    grade_level: string;
    status: string;
    class_id: string;
    cpf: string;
    rg: string;
    needs_tutor: boolean;
    persona: number;
    School?: { name: string };
    class?: { name: string };
    Tutors?: { id: string; name: string }[];
}

export default function SchoolStudents() {
    const { user } = useAuth();
    const schoolId = user?.school_id;
    const [students, setStudents] = useState<Student[]>([]);
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [classMode, setClassMode] = useState<'existing' | 'new'>('existing');
    const [newClassName, setNewClassName] = useState('');
    const [newClassGrade, setNewClassGrade] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        birth_date: '',
        grade_level: '',
        class_id: '',
        cpf: '',
        rg: '',
        persona: 0,
        needs_tutor: false,
        tutor_ids: [] as string[],
        student_email: '',
        student_password: '',
        guardian_name: '',
        guardian_cpf: '',
        guardian_phone: '',
        guardian_address: ''
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [studentsRes, tutorsRes, classesRes] = await Promise.all([
                api.get('/students', { params: { school_id: schoolId } }),
                api.get(`/schools/${schoolId}/tutors`),
                api.get('/classes', { params: { school_id: schoolId } })
            ]);
            setStudents(studentsRes.data.data || []);
            setTutors(tutorsRes.data.data || []);
            setClasses(classesRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch students', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [schoolId]);

    const handleOpenModal = (student?: Student) => {
        if (student) {
            setEditingId(student.id);
            setFormData({
                name: student.name,
                birth_date: student.birth_date?.split('T')[0] || '',
                grade_level: student.grade_level || '',
                class_id: student.class_id || '',
                cpf: student.cpf || '',
                rg: student.rg || '',
                persona: student.persona || 0,
                needs_tutor: student.needs_tutor,
                tutor_ids: student.Tutors?.map(t => t.id) || [],
                student_email: '',
                student_password: '',
                guardian_name: '',
                guardian_cpf: '',
                guardian_phone: '',
                guardian_address: ''
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '', birth_date: '', grade_level: '', class_id: '',
                cpf: '', rg: '', persona: 0, needs_tutor: false, tutor_ids: [],
                student_email: '', student_password: '',
                guardian_name: '', guardian_cpf: '', guardian_phone: '', guardian_address: ''
            });
        }
        setClassMode('existing');
        setNewClassName('');
        setNewClassGrade('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let classId = formData.class_id;

            // If creating a new class, do it first
            if (classMode === 'new' && newClassName.trim()) {
                const classRes = await api.post('/classes', {
                    name: newClassName.trim(),
                    grade_level: newClassGrade.trim() || formData.grade_level,
                    school_id: schoolId
                });
                classId = classRes.data.data.id;
            }

            const payload = { ...formData, school_id: schoolId, class_id: classId };
            if (editingId) {
                await api.put(`/students/${editingId}`, payload);
            } else {
                await api.post('/students', payload);
            }
            setIsModalOpen(false);
            setEditingId(null);
            fetchData();
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Erro ao salvar aluno.';
            alert(msg);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
            try {
                await api.delete(`/students/${id}`);
                fetchData();
            } catch (err) {
                alert('Erro ao excluir aluno.');
            }
        }
    };

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Alunos</h1>
                    <p className="text-slate-500 mt-1">Gerencie os alunos matriculados na sua escola.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="shrink-0">
                    <Plus className="w-5 h-5 mr-2" /> Novo Aluno
                </Button>
            </div>

            <Card className="glass-panel border-none shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-white/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar alunos..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Nome</th>
                                <th className="px-6 py-4">Turma</th>
                                <th className="px-6 py-4">Série</th>
                                <th className="px-6 py-4">Tutor(es)</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Carregando...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <Users2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                        Nenhum aluno cadastrado.
                                    </td>
                                </tr>
                            ) : filtered.map(student => (
                                <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-sm">
                                            {student.name.charAt(0)}
                                        </div>
                                        {student.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{student.class?.name || '-'}</td>
                                    <td className="px-6 py-4 text-slate-600">{student.grade_level || '-'}</td>
                                    <td className="px-6 py-4 text-slate-600">
                                        {student.Tutors?.map(t => t.name).join(', ') || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenModal(student)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(student.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); }} title={editingId ? 'Editar Aluno' : 'Novo Aluno'}>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">Dados Pessoais</h3>
                        <div className="space-y-4">
                            <Input label="Nome Completo" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Data de Nascimento" type="date" required value={formData.birth_date} onChange={e => setFormData({ ...formData, birth_date: e.target.value })} />
                                <Input label="Série/Ano" value={formData.grade_level} onChange={e => setFormData({ ...formData, grade_level: e.target.value })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="CPF" value={formData.cpf} onChange={e => setFormData({ ...formData, cpf: e.target.value })} />
                                <Input label="RG" value={formData.rg} onChange={e => setFormData({ ...formData, rg: e.target.value })} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">Matrícula</h3>
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-slate-700">Turma</label>
                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="classModeSchool" checked={classMode === 'existing'} onChange={() => setClassMode('existing')} className="text-brand-primary" />
                                        <span className="text-sm text-slate-700">Selecionar existente</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="classModeSchool" checked={classMode === 'new'} onChange={() => setClassMode('new')} className="text-brand-primary" />
                                        <span className="text-sm text-slate-700">Criar nova turma</span>
                                    </label>
                                </div>
                                {classMode === 'existing' ? (
                                    <select className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-primary outline-none" value={formData.class_id} onChange={e => setFormData({ ...formData, class_id: e.target.value })}>
                                        <option value="">Nenhuma turma</option>
                                        {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                        <Input label="Nome da Turma" required={classMode === 'new'} placeholder="Ex: Turma A, Manhã..." value={newClassName} onChange={e => setNewClassName(e.target.value)} />
                                        <Input label="Série/Nível" placeholder="Ex: 1º Ano, Pré-escola..." value={newClassGrade} onChange={e => setNewClassGrade(e.target.value)} />
                                        <p className="col-span-2 text-[10px] text-slate-400">A turma será vinculada automaticamente à sua escola.</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Tutor(es)</label>
                                <select multiple className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-brand-primary outline-none h-24" value={formData.tutor_ids} onChange={e => setFormData({ ...formData, tutor_ids: Array.from(e.target.selectedOptions, o => o.value) })}>
                                    {tutors.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                                <p className="text-[10px] text-slate-400 mt-1">Segure Ctrl para selecionar múltiplos.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" id="needs_tutor" checked={formData.needs_tutor} onChange={e => setFormData({ ...formData, needs_tutor: e.target.checked })} className="rounded" />
                                <label htmlFor="needs_tutor" className="text-sm text-slate-700">Necessita tutor</label>
                            </div>
                        </div>
                    </div>

                    {!editingId && (
                        <div>
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">Responsável</h3>
                            <div className="space-y-4">
                                <Input label="Nome do Responsável" value={formData.guardian_name} onChange={e => setFormData({ ...formData, guardian_name: e.target.value })} />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="CPF Responsável" value={formData.guardian_cpf} onChange={e => setFormData({ ...formData, guardian_cpf: e.target.value })} />
                                    <Input label="Telefone" value={formData.guardian_phone} onChange={e => setFormData({ ...formData, guardian_phone: e.target.value })} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => { setIsModalOpen(false); setEditingId(null); }}>Cancelar</Button>
                        <Button type="submit">{editingId ? 'Salvar Alterações' : 'Cadastrar Aluno'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
