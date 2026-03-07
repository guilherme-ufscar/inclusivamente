import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { Plus, Pencil, Trash2, Search, Users, ShieldAlert } from 'lucide-react';

interface Tutor {
    id: string;
    name: string;
    email: string;
    specialty: string;
    school_id: string;
    School?: { name: string };
    is_active: boolean;
}

interface School {
    id: string;
    name: string;
}

export default function StaffPage() {
    const [tutors, setTutors] = useState<Tutor[]>([]);
    const [schools, setSchools] = useState<School[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        specialty: '',
        school_id: ''
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [tutorsRes, schoolsRes] = await Promise.all([
                api.get('/tutors'),
                api.get('/schools')
            ]);
            setTutors(tutorsRes.data.data || []);
            setSchools(schoolsRes.data.data || []);
        } catch (err) {
            console.error('Failed to fetch data', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (tutor?: Tutor) => {
        if (tutor) {
            setEditingId(tutor.id);
            setFormData({
                name: tutor.name,
                email: tutor.email || '',
                specialty: tutor.specialty || '',
                school_id: tutor.school_id || ''
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', email: '', specialty: '', school_id: schools[0]?.id || '' });
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
                await api.put(`/tutors/${editingId}`, formData);
            } else {
                await api.post('/tutors', formData);
            }
            handleCloseModal();
            fetchData();
        } catch (err: any) {
            console.error('Failed to save tutor', err);
            alert(err.response?.data?.message || 'Erro ao salvar tutor.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir este tutor? Os relatórios e atividades vinculados serão impactados.')) {
            try {
                await api.delete(`/tutors/${id}`);
                fetchData();
            } catch (err) {
                console.error('Failed to delete tutor', err);
                alert('Erro ao excluir tutor.');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Tutores Especializados</h1>
                    <p className="text-slate-500 mt-1">Gestão de corpo docente e profissionais de Inclusão Ativa.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="shrink-0">
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Tutor
                </Button>
            </div>

            <Card className="glass-panel border-none shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-white/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou especialidade..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-brand-accent outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Tutor</th>
                                <th className="px-6 py-4">Especialidade / Foco</th>
                                <th className="px-6 py-4">Escola Vinculada</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">Curregando dados...</td>
                                </tr>
                            ) : tutors.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                        Nenhum tutor cadastrado.
                                    </td>
                                </tr>
                            ) : (
                                tutors.map((tutor) => (
                                    <tr key={tutor.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600">
                                                {tutor.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="block">{tutor.name}</span>
                                                <span className="block text-xs text-slate-400 font-normal">{tutor.email || 'Sem e-mail'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-accent/10 text-brand-accent border border-brand-accent/20">
                                                {tutor.specialty || 'Geral'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {tutor.School?.name || 'Escola não encontrada'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(tutor)}
                                                    className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tutor.id)}
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
                title={editingId ? 'Editar Tutor' : 'Novo Tutor'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">

                    {!schools.length && (
                        <div className="p-3 bg-amber-50 text-amber-700 rounded-lg text-sm flex items-start gap-3 border border-amber-200">
                            <ShieldAlert className="w-5 h-5 shrink-0" />
                            <p>Nenhuma escola cadastrada ainda. Você precisa de pelo menos uma escola ativa para vincular tutores.</p>
                        </div>
                    )}

                    <Input
                        label="Nome Completo"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="E-mail"
                            type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <Input
                            label="Especialidade Principal"
                            placeholder="ex: TEA, TDAH, Libras..."
                            value={formData.specialty}
                            onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Escola Vinculada <span className="text-red-500">*</span></label>
                        <select
                            required
                            className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            value={formData.school_id}
                            onChange={e => setFormData({ ...formData, school_id: e.target.value })}
                        >
                            <option value="" disabled>Selecione uma escola</option>
                            {schools.map(school => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={!schools.length}>
                            {editingId ? 'Salvar Alterações' : 'Cadastrar Tutor'}
                        </Button>
                    </div>
                </form>
            </Modal>

        </div>
    );
}
