import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Pencil, Trash2, Search, Heart } from 'lucide-react';

interface KinshipType {
    id: string;
    name: string;
}

interface Student {
    id: string;
    name: string;
}

interface GuardianUser {
    id: string;
    name: string;
    email: string;
    phone?: string;
    kinship_type_id?: string;
    kinship_type?: { name: string };
    student_id?: string;
}

const maskPhone = (v: string) => {
    return v.replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
};

export default function SchoolGuardians() {
    const { user } = useAuth();
    const schoolId = user?.school_id;
    const [guardians, setGuardians] = useState<GuardianUser[]>([]);
    const [kinships, setKinships] = useState<KinshipType[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        kinship_type_id: '',
        student_id: ''
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [guardiansRes, kinshipsRes, studentsRes] = await Promise.all([
                api.get('/guardians', { params: { school_id: schoolId } }),
                api.get('/anamnesis/kinship'),
                api.get('/students', { params: { school_id: schoolId } })
            ]);
            setGuardians(guardiansRes.data.data || []);
            setKinships(kinshipsRes.data.data || []);
            setStudents(studentsRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [schoolId]);

    const handleOpenModal = (g?: GuardianUser) => {
        if (g) {
            setEditingId(g.id);
            setFormData({
                name: g.name,
                email: g.email || '',
                password: '',
                phone: g.phone || '',
                kinship_type_id: g.kinship_type_id || '',
                student_id: g.student_id || ''
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', email: '', password: '', phone: '', kinship_type_id: kinships[0]?.id || '', student_id: '' });
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
            if (editingId) {
                await api.put(`/guardians/${editingId}`, formData);
            } else {
                if (!formData.password) {
                    alert('Por favor, informe uma senha para criar o acesso do responsável.');
                    return;
                }
                const registerPayload = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: 'parent',
                    phone: formData.phone,
                    kinship_type_id: formData.kinship_type_id,
                    student_id: formData.student_id
                };
                await api.post('/auth/register', registerPayload);
            }
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            console.error('Failed to save guardian', err);
            alert(err.response?.data?.message || 'Erro ao salvar responsável.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir este responsável do sistema?')) {
            try {
                await api.delete(`/guardians/${id}`);
                fetchData();
            } catch (err) {
                alert('Erro ao excluir responsável.');
            }
        }
    };

    const filtered = guardians.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Responsáveis e Familiares</h1>
                    <p className="text-slate-500 mt-1">Gestão de acessos das famílias aos relatórios e evolução dos alunos.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="shrink-0">
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Responsável
                </Button>
            </div>

            <Card className="glass-panel border-none shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-white/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou e-mail..."
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
                                <th className="px-6 py-4">Responsável</th>
                                <th className="px-6 py-4">Contato / E-mail</th>
                                <th className="px-6 py-4">Vínculo</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Carregando dados...</td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <Heart className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                        Nenhum responsável cadastrado.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((g: any) => (
                                    <tr key={g.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600">
                                                {g.name.charAt(0)}
                                            </div>
                                            <span>{g.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="block text-sm text-slate-600">{g.email || 'Sem e-mail'}</span>
                                            <span className="block text-xs text-slate-400 font-normal">{g.phone || 'Sem telefone'}</span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {g.kinship_type?.name || 'Não informado'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(g)}
                                                    className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(g.id)}
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
                title={editingId ? 'Editar Responsável' : 'Novo Login para Responsável'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nome Completo"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="E-mail (Login de acesso)"
                            type="email"
                            required={!editingId}
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        {!editingId && (
                            <Input
                                label="Senha de Acesso"
                                type="password"
                                required
                                placeholder="Crie uma senha"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                            />
                        )}
                        <Input
                            label="Telefone / WhatsApp"
                            placeholder="(00) 00000-0000"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: maskPhone(e.target.value) })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Grau de Parentesco</label>
                        <select
                            className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            value={formData.kinship_type_id}
                            onChange={e => setFormData({ ...formData, kinship_type_id: e.target.value })}
                        >
                            <option value="">Selecione um vínculo</option>
                            {kinships.map(k => (
                                <option key={k.id} value={k.id}>{k.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Vincular a um Aluno (Opcional)</label>
                        <select
                            className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            value={formData.student_id}
                            onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                        >
                            <option value="">Nenhum vínculo inicial</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {editingId ? 'Salvar Alterações' : 'Cadastrar Responsável'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
