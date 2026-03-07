import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { Plus, Pencil, Trash2, Heart } from 'lucide-react';

interface KinshipType {
    id: string;
    name: string;
}

export default function KinshipPage() {
    const [records, setRecords] = useState<KinshipType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({ name: '' });

    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/anamnesis/kinship');
            setRecords(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleOpenModal = (r?: KinshipType) => {
        if (r) {
            setEditingId(r.id);
            setFormData({ name: r.name });
        } else {
            setEditingId(null);
            setFormData({ name: '' });
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
                await api.put(`/anamnesis/kinship/${editingId}`, formData);
            } else {
                await api.post('/anamnesis/kinship', formData);
            }
            handleCloseModal();
            fetchRecords();
        } catch (err) {
            alert('Erro ao salvar.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir este grau de parentesco?')) {
            try {
                await api.delete(`/anamnesis/kinship/${id}`);
                fetchRecords();
            } catch (err) {
                alert('Erro ao excluir.');
            }
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Graus de Parentesco</h1>
                    <p className="text-slate-500 mt-1">Configuração de vínculos familiares para responsáveis.</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-5 h-5 mr-2" />
                    Novo Vínculo
                </Button>
            </div>

            <Card className="glass-panel border-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Vínculo Familiar</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={2} className="px-6 py-8 text-center">Carregando...</td></tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-12 text-center text-slate-500">
                                        <Heart className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                        Nenhum vínculo cadastrado.
                                    </td>
                                </tr>
                            ) : (
                                records.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                                                <Heart className="w-4 h-4" />
                                            </div>
                                            {r.name}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(r)} className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(r.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? 'Editar Vínculo' : 'Novo Grau de Parentesco'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Descrição do Vínculo" placeholder="ex: Pai, Mãe, Tutor Legal" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
