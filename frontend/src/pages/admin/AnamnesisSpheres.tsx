import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { Plus, Pencil, Trash2, ClipboardCheck } from 'lucide-react';

interface Sphere {
    id: string;
    name: string;
    description: string;
    order_index: number;
    is_active: boolean;
}

export default function AnamnesisSpheresPage() {
    const [spheres, setSpheres] = useState<Sphere[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        order_index: 0,
        is_active: true
    });

    const fetchSpheres = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/anamnesis/spheres');
            setSpheres(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSpheres();
    }, []);

    const handleOpenModal = (sphere?: Sphere) => {
        if (sphere) {
            setEditingId(sphere.id);
            setFormData({
                name: sphere.name,
                description: sphere.description || '',
                order_index: sphere.order_index,
                is_active: sphere.is_active
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', description: '', order_index: spheres.length + 1, is_active: true });
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
                await api.put(`/anamnesis/spheres/${editingId}`, formData);
            } else {
                await api.post('/anamnesis/spheres', formData);
            }
            handleCloseModal();
            fetchSpheres();
        } catch (err: any) {
            alert('Erro ao salvar esfera.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir esta esfera da anamnese?')) {
            try {
                await api.delete(`/anamnesis/spheres/${id}`);
                fetchSpheres();
            } catch (err) {
                alert('Erro ao excluir.');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Esferas da Anamnese</h1>
                    <p className="text-slate-500 mt-1">Definição das áreas de investigação clínica e pedagógica.</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-5 h-5 mr-2" />
                    Nova Esfera
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? <p>Carregando...</p> : spheres.map((sphere) => (
                    <Card key={sphere.id} className="glass-panel border-none shadow-sm group">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary font-bold">
                                    #{sphere.order_index}
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleOpenModal(sphere)} className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(sphere.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                <ClipboardCheck className="w-5 h-5 text-brand-secondary" />
                                {sphere.name}
                            </h3>
                            <p className="text-sm text-slate-500 mt-2 line-clamp-2">{sphere.description || 'Sem descrição.'}</p>
                            <div className="mt-4 pt-4 border-t border-slate-50">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${sphere.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                    {sphere.is_active ? 'Ativa' : 'Inativa'}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? 'Editar Esfera' : 'Nova Esfera de Anamnese'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Nome da Esfera" placeholder="ex: Desenvolvimento Motor" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <Input label="Ordem de Exibição" type="number" required value={formData.order_index} onChange={e => setFormData({ ...formData, order_index: Number(e.target.value) })} />
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">Descrição / Objetivo</label>
                        <textarea className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[80px]" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_active" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} />
                        <label htmlFor="is_active" className="text-sm text-slate-700">Esfera Ativa</label>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
