import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Pencil, Trash2, Search, HeartHandshake } from 'lucide-react';

interface Tutor {
    id: string;
    name: string;
    email: string;
    phone: string;
    specialty: string;
}

export default function SchoolTutors() {
    const { user } = useAuth();
    const schoolId = user?.school_id;
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialty: ''
    });

    const fetchTutors = async () => {
        setIsLoading(true);
        try {
            const res = await api.get(`/schools/${schoolId}/tutors`);
            setTutors(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch tutors', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchTutors(); }, [schoolId]);

    const handleOpenModal = (tutor?: Tutor) => {
        if (tutor) {
            setEditingId(tutor.id);
            setFormData({ name: tutor.name, email: tutor.email || '', phone: tutor.phone || '', specialty: tutor.specialty || '' });
        } else {
            setEditingId(null);
            setFormData({ name: '', email: '', phone: '', specialty: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...formData, school_id: schoolId };
            if (editingId) {
                await api.put(`/tutors/${editingId}`, payload);
            } else {
                await api.post('/tutors', payload);
            }
            setIsModalOpen(false);
            setEditingId(null);
            fetchTutors();
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Erro ao salvar tutor.';
            alert(msg);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir este tutor?')) {
            try {
                await api.delete(`/tutors/${id}`);
                fetchTutors();
            } catch (err) {
                alert('Erro ao excluir tutor.');
            }
        }
    };

    const filtered = tutors.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Tutores</h1>
                    <p className="text-slate-500 mt-1">Gerencie os tutores vinculados à sua escola.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="shrink-0">
                    <Plus className="w-5 h-5 mr-2" /> Novo Tutor
                </Button>
            </div>

            <Card className="glass-panel border-none shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-white/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Buscar tutores..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Nome</th>
                                <th className="px-6 py-4">E-mail</th>
                                <th className="px-6 py-4">Telefone</th>
                                <th className="px-6 py-4">Especialidade</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">Carregando...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        <HeartHandshake className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                        Nenhum tutor cadastrado.
                                    </td>
                                </tr>
                            ) : filtered.map(tutor => (
                                <tr key={tutor.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-brand-accent/10 text-brand-accent flex items-center justify-center font-bold text-sm">
                                            {tutor.name.charAt(0)}
                                        </div>
                                        {tutor.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{tutor.email || '-'}</td>
                                    <td className="px-6 py-4 text-slate-600">{tutor.phone || '-'}</td>
                                    <td className="px-6 py-4 text-slate-600">{tutor.specialty || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenModal(tutor)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDelete(tutor.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); }} title={editingId ? 'Editar Tutor' : 'Novo Tutor'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Nome Completo" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <Input label="E-mail" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Telefone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        <Input label="Especialidade" value={formData.specialty} onChange={e => setFormData({ ...formData, specialty: e.target.value })} />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => { setIsModalOpen(false); setEditingId(null); }}>Cancelar</Button>
                        <Button type="submit">{editingId ? 'Salvar Alterações' : 'Cadastrar Tutor'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
