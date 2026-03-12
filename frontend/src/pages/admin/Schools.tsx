import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { Plus, Pencil, Trash2, Search, Building2, ShieldCheck, ShieldOff, Eye, EyeOff, KeyRound } from 'lucide-react';

interface School {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    has_account: boolean;
    account_email: string | null;
}

export default function SchoolsPage() {
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    });

    const fetchSchools = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/schools');
            if (res.data.success) {
                setSchools(res.data.data);
            }
        } catch (err) {
            console.error('Failed to fetch schools', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const handleOpenModal = (school?: School) => {
        if (school) {
            setEditingId(school.id);
            setFormData({
                name: school.name,
                email: school.email || '',
                phone: school.phone || '',
                address: school.address || '',
                password: ''
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', email: '', phone: '', address: '', password: '' });
        }
        setShowPassword(false);
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
                await api.put(`/schools/${editingId}`, formData);
            } else {
                if (!formData.email || !formData.password) {
                    alert('E-mail e senha são obrigatórios para criar a conta da escola.');
                    return;
                }
                await api.post('/schools', formData);
            }
            handleCloseModal();
            fetchSchools();
        } catch (err: any) {
            console.error('Failed to save school', err);
            const msg = err?.response?.data?.message || 'Erro ao salvar escola.';
            alert(msg);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta escola? Todos os dados vinculados (conta, alunos, tutores) podem ser afetados.')) {
            try {
                await api.delete(`/schools/${id}`);
                fetchSchools();
            } catch (err) {
                console.error('Failed to delete school', err);
                alert('Erro ao excluir escola.');
            }
        }
    };

    const filteredSchools = schools.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Escolas Parceiras</h1>
                    <p className="text-slate-500 mt-1">Gerenciamento completo das instituições conectadas à plataforma.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="shrink-0">
                    <Plus className="w-5 h-5 mr-2" />
                    Nova Escola
                </Button>
            </div>

            <Card className="glass-panel border-none shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-white/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar escolas..."
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
                                <th className="px-6 py-4">Nome da Escola</th>
                                <th className="px-6 py-4">E-mail / Login</th>
                                <th className="px-6 py-4">Telefone</th>
                                <th className="px-6 py-4 text-center">Conta</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Carregando dados...</td>
                                </tr>
                            ) : filteredSchools.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <Building2 className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                        Nenhuma escola cadastrada no momento.
                                    </td>
                                </tr>
                            ) : (
                                filteredSchools.map((school) => (
                                    <tr key={school.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                                                {school.name.charAt(0)}
                                            </div>
                                            {school.name}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{school.email || '-'}</td>
                                        <td className="px-6 py-4 text-slate-600">{school.phone || '-'}</td>
                                        <td className="px-6 py-4 text-center">
                                            {school.has_account ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                                                    <ShieldCheck className="w-3.5 h-3.5" /> Ativo
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500">
                                                    <ShieldOff className="w-3.5 h-3.5" /> Sem conta
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(school)}
                                                    className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(school.id)}
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
                title={editingId ? 'Editar Escola' : 'Nova Escola'}
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Dados da Instituição */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 border-b border-slate-100 pb-2">
                            Dados da Instituição
                        </h3>
                        <div className="space-y-4">
                            <Input
                                label="Nome da Instituição"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Telefone"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                                <Input
                                    label="Endereço (Opcional)"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Credenciais de Acesso */}
                    <div className="mt-6">
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-brand-primary" />
                            Credenciais de Acesso
                        </h3>
                        <p className="text-xs text-slate-400 mb-3">
                            {editingId
                                ? 'Altere o e-mail ou senha da conta. Deixe a senha em branco para manter a atual.'
                                : 'Defina o e-mail e senha que a escola usará para acessar o sistema.'}
                        </p>
                        <div className="space-y-4">
                            <Input
                                label="E-mail de Acesso"
                                type="email"
                                required={!editingId}
                                placeholder="escola@exemplo.com"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            <div>
                                <label className="text-sm font-medium text-slate-700">
                                    {editingId ? 'Nova Senha (opcional)' : 'Senha'}
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required={!editingId}
                                        placeholder={editingId ? 'Deixe em branco para manter' : 'Mínimo 6 caracteres'}
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-shadow"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button type="submit">
                            {editingId ? 'Salvar Alterações' : 'Cadastrar Escola'}
                        </Button>
                    </div>
                </form>
            </Modal>

        </div>
    );
}
