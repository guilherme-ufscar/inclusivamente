import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';

interface ClassItem {
    id: string;
    name: string;
    grade: string;
    school_id: string;
}

export default function SchoolClasses() {
    const { user } = useAuth();
    const schoolId = user?.school_id;
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({ name: '', grade: '' });

    const fetchClasses = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/classes', { params: { school_id: schoolId } });
            setClasses(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch classes', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchClasses(); }, [schoolId]);

    const handleOpenModal = (cls?: ClassItem) => {
        if (cls) {
            setEditingId(cls.id);
            setFormData({ name: cls.name, grade: cls.grade || '' });
        } else {
            setEditingId(null);
            setFormData({ name: '', grade: '' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = { ...formData, school_id: schoolId };
            if (editingId) {
                await api.put(`/classes/${editingId}`, payload);
            } else {
                await api.post('/classes', payload);
            }
            setIsModalOpen(false);
            setEditingId(null);
            fetchClasses();
        } catch (err) {
            alert('Erro ao salvar turma.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
            try {
                await api.delete(`/classes/${id}`);
                fetchClasses();
            } catch (err) {
                alert('Erro ao excluir turma.');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Turmas</h1>
                    <p className="text-slate-500 mt-1">Gerencie as turmas da sua escola.</p>
                </div>
                <Button onClick={() => handleOpenModal()} className="shrink-0">
                    <Plus className="w-5 h-5 mr-2" /> Nova Turma
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full text-center text-slate-500 py-12">Carregando...</div>
                ) : classes.length === 0 ? (
                    <div className="col-span-full text-center text-slate-500 py-12">
                        <GraduationCap className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                        Nenhuma turma cadastrada.
                    </div>
                ) : classes.map(cls => (
                    <Card key={cls.id} className="glass-panel border-none shadow-sm hover:shadow-md transition-all">
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 text-brand-secondary flex items-center justify-center">
                                        <GraduationCap className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">{cls.name}</h3>
                                        <p className="text-sm text-slate-500">{cls.grade || 'Sem série definida'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={() => handleOpenModal(cls)} className="p-2 text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors">
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(cls.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); }} title={editingId ? 'Editar Turma' : 'Nova Turma'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Nome da Turma" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: 3º Ano A" />
                    <Input label="Série/Ano" value={formData.grade} onChange={e => setFormData({ ...formData, grade: e.target.value })} placeholder="Ex: 3º Ano" />
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => { setIsModalOpen(false); setEditingId(null); }}>Cancelar</Button>
                        <Button type="submit">{editingId ? 'Salvar' : 'Criar Turma'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
