import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Plus, Book, Layers, Pencil, Trash2, ArrowRight } from 'lucide-react';

interface Subject {
    id: string;
    name: string;
}

interface Chapter {
    id: string;
    name: string;
    subject_id: string;
    subject?: { name: string };
    order: number;
}

export default function ChaptersPage() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({ name: '', subject_id: '', order: 0 });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [chRes, subRes] = await Promise.all([
                api.get('/subjects/chapters'),
                api.get('/subjects')
            ]);
            setChapters(chRes.data.data || []);
            setSubjects(subRes.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (c?: Chapter) => {
        if (c) {
            setEditingId(c.id);
            setFormData({ name: c.name, subject_id: c.subject_id, order: c.order });
        } else {
            setEditingId(null);
            setFormData({ name: '', subject_id: '', order: (chapters.length + 1) });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/subjects/chapters/${editingId}`, formData);
            } else {
                await api.post('/subjects/chapters', formData);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert('Erro ao salvar capítulo.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir este capítulo?')) {
            try {
                await api.delete(`/subjects/chapters/${id}`);
                fetchData();
            } catch (err) {
                alert('Erro ao excluir.');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Capítulos & Conteúdos</h1>
                    <p className="text-slate-500 mt-1">Organização modular dos temas por matéria curricular.</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Capítulo
                </Button>
            </div>

            <Card className="glass-panel border-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Ordem</th>
                                <th className="px-6 py-4">Capítulo</th>
                                <th className="px-6 py-4">Matéria</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {isLoading ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center">Carregando...</td></tr>
                            ) : chapters.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        <Layers className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        Nenhum capítulo cadastrado.
                                    </td>
                                </tr>
                            ) : (
                                chapters.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 font-mono text-slate-400">#{c.order}</td>
                                        <td className="px-6 py-4 font-bold text-slate-900">{c.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {c.subject?.name || 'Indefinida'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(c)} className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(c.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Capítulo' : 'Novo Capítulo'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Nome do Capítulo" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Matéria Relacionada</label>
                        <select
                            required
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                            value={formData.subject_id}
                            onChange={e => setFormData({ ...formData, subject_id: e.target.value })}
                        >
                            <option value="" disabled>Selecione a matéria</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <Input label="Ordem de Exibição" type="number" required value={formData.order.toString()} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) })} />
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
