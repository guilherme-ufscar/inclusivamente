import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Pencil, Trash2, Search, Users2, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    guardian?: {
        name: string;
        cpf?: string;
        phone?: string;
        address?: string;
    };
}

const maskCPF = (v: string) => {
    return v.replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
};

const maskCEP = (v: string) => {
    return v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 9);
};

const maskRG = (v: string) => {
    return v.replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{1})\d+?$/, '$1');
};

const maskPhone = (v: string) => {
    return v.replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
};

export default function SchoolStudents() {
    const { user } = useAuth();
    const navigate = useNavigate();
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
        guardian_cep: '',
        guardian_cpf: '',
        guardian_phone: '',
        guardian_address: ''
    });

    const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await res.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        guardian_address: `${data.logradouro}, Número, ${data.bairro}, ${data.localidade} - ${data.uf}`
                    }));
                }
            } catch (err) {
                console.error("Erro ao buscar CEP", err);
            }
        }
    };

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
                guardian_name: student.guardian?.name || '',
                guardian_cep: '',
                guardian_cpf: student.guardian?.cpf || '',
                guardian_phone: student.guardian?.phone || '',
                guardian_address: student.guardian?.address || ''
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '', birth_date: '', grade_level: '', class_id: '',
                cpf: '', rg: '', persona: 0, needs_tutor: false, tutor_ids: [],
                student_email: '', student_password: '',
                guardian_name: '', guardian_cep: '', guardian_cpf: '', guardian_phone: '', guardian_address: ''
            });
        }
        setClassMode('existing');
        setNewClassName('');
        setNewClassGrade('');
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            let classId = formData.class_id;

            if (classMode === 'new' && newClassName.trim()) {
                const classRes = await api.post('/classes', {
                    name: newClassName.trim(),
                    grade_level: newClassGrade.trim() || formData.grade_level,
                    school_id: schoolId
                });
                classId = classRes.data.data.id;
            }

            const payload = {
                ...formData,
                school_id: schoolId,
                class_id: classId,
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
            const msg = err?.response?.data?.message || 'Erro ao salvar aluno.';
            alert(msg);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir este aluno? Toda a anamnese, perfil cognitivo e histórico de atividades serão perdidos permanentemente.')) {
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
                                <th className="px-6 py-4">Aluno</th>
                                <th className="px-6 py-4">Turma</th>
                                <th className="px-6 py-4">Série</th>
                                <th className="px-6 py-4">Tutor(es)</th>
                                <th className="px-6 py-4">Necessita Tutor?</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">Carregando...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        <Users2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                        Nenhum aluno cadastrado.
                                    </td>
                                </tr>
                            ) : filtered.map(student => (
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
                                    <td className="px-6 py-4 text-slate-600 font-medium">{student.class?.name || 'Sem turma'}</td>
                                    <td className="px-6 py-4 text-slate-600">{student.grade_level || 'Não informado'}</td>
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
                                        {student.needs_tutor ? (
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 uppercase">Sim</span>
                                        ) : (
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">Não</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/school/students/${student.id}/profile`)}
                                                title="Ver Perfil"
                                                className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <UserCircle className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleOpenModal(student)} className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors">
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

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingId ? 'Editar Aluno' : 'Novo Aluno'}
                size="4xl"
            >
                <div className="max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6 pb-4">

                        {/* Seção: Dados do Aluno */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Dados do Aluno</h3>
                            <div className="space-y-4">
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
                                        label="Série / Ano"
                                        type="text"
                                        placeholder="ex: 1º Ano, Pré-escola, EJA..."
                                        value={formData.grade_level}
                                        onChange={e => setFormData({ ...formData, grade_level: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="CPF do Aluno"
                                        placeholder="000.000.000-00"
                                        value={formData.cpf}
                                        onChange={e => setFormData({ ...formData, cpf: maskCPF(e.target.value) })}
                                    />
                                    <Input
                                        label="RG do Aluno"
                                        placeholder="00.000.000-0"
                                        value={formData.rg}
                                        onChange={e => setFormData({ ...formData, rg: maskRG(e.target.value) })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">Diagnóstico / Espectro (Sondagem)</label>
                                        <select
                                            className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                            value={formData.persona}
                                            onChange={e => setFormData({ ...formData, persona: Number(e.target.value) })}
                                        >
                                            <option value={0}>0 - Default (Sem diagnóstico restrito)</option>
                                            <option value={1}>1 - TEA</option>
                                            <option value={2}>2 - TEA + DI</option>
                                            <option value={3}>3 - DI + TEA</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1 flex flex-col justify-end">
                                        <label className="flex items-center gap-2 cursor-pointer p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition h-11">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-brand-primary"
                                                checked={formData.needs_tutor}
                                                onChange={e => setFormData({ ...formData, needs_tutor: e.target.checked })}
                                            />
                                            <span className="text-sm font-medium text-slate-700">Necessita de Tutor Especializado</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seção: Acesso ao Jogo / Painel */}
                        {!editingId && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Acesso ao Jogo / Painel</h3>
                                <p className="text-xs text-slate-500 mb-3">Crie um login para o aluno acessar os minigames e as avaliações.</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="E-mail de Login do Aluno"
                                        type="email"
                                        placeholder="aluno@escola.com"
                                        value={formData.student_email}
                                        onChange={e => setFormData({ ...formData, student_email: e.target.value })}
                                    />
                                    <Input
                                        label="Senha"
                                        type="password"
                                        placeholder="Mínimo 6 caracteres"
                                        value={formData.student_password}
                                        onChange={e => setFormData({ ...formData, student_password: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Seção: Matrícula Escolar */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Matrícula Escolar</h3>
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
                                        <select
                                            className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                            value={formData.class_id}
                                            onChange={e => setFormData({ ...formData, class_id: e.target.value })}
                                        >
                                            <option value="">Nenhuma turma</option>
                                            {classes.map(c => (
                                                <option key={c.id} value={c.id}>{c.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                                            <Input
                                                label="Nome da Turma"
                                                required={classMode === 'new'}
                                                placeholder="Ex: Turma A, Manhã..."
                                                value={newClassName}
                                                onChange={e => setNewClassName(e.target.value)}
                                            />
                                            <Input
                                                label="Série/Nível da Turma"
                                                placeholder="Ex: 1º Ano, Pré-escola..."
                                                value={newClassGrade}
                                                onChange={e => setNewClassGrade(e.target.value)}
                                            />
                                            <p className="col-span-2 text-[10px] text-slate-400">A turma será vinculada automaticamente à sua escola.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-slate-700">Tutores Responsáveis</label>
                                    <div className="grid grid-cols-2 gap-2 p-3 border border-slate-200 rounded-xl bg-slate-50/50 max-h-32 overflow-y-auto">
                                        {tutors.map(tutor => (
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
                                        {tutors.length === 0 && (
                                            <p className="text-[10px] text-slate-400 col-span-2 italic">Nenhum tutor cadastrado nesta escola.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seção: Responsável Legal */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-4">Família / Responsável Legal</h3>
                            <div className="space-y-4">
                                <Input
                                    label="Nome Completo do Responsável"
                                    placeholder="Nome da mãe, pai ou responsável legal"
                                    value={formData.guardian_name}
                                    onChange={e => setFormData({ ...formData, guardian_name: e.target.value })}
                                />
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    <Input
                                        label="CPF do Responsável"
                                        placeholder="000.000.000-00"
                                        value={formData.guardian_cpf}
                                        onChange={e => setFormData({ ...formData, guardian_cpf: maskCPF(e.target.value) })}
                                    />
                                    <Input
                                        label="Telefone (WhatsApp)"
                                        placeholder="(00) 00000-0000"
                                        value={formData.guardian_phone}
                                        onChange={e => setFormData({ ...formData, guardian_phone: maskPhone(e.target.value) })}
                                    />
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-slate-700">CEP</label>
                                        <input
                                            type="text"
                                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                                            placeholder="00000-000"
                                            value={formData.guardian_cep}
                                            onChange={e => setFormData({ ...formData, guardian_cep: maskCEP(e.target.value) })}
                                            onBlur={handleCepBlur}
                                        />
                                    </div>
                                </div>
                                <Input
                                    label="Endereço Completo"
                                    placeholder="Rua, Número, Bairro, Cidade - UF"
                                    value={formData.guardian_address}
                                    onChange={e => setFormData({ ...formData, guardian_address: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="pt-6 mt-4 flex justify-end gap-3 sticky bottom-0 bg-white pb-2 border-t border-slate-100">
                            <Button type="button" variant="ghost" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                            <Button type="submit">
                                {editingId ? 'Salvar Alterações' : 'Cadastrar Aluno'}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}
