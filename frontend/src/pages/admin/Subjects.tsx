import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import Input from '../../components/ui/Input';
import api from '../../services/api';
import { Plus, BookOpen, Brain, Music, Palette, Square, Pencil, Trash2 } from 'lucide-react';

interface Subject {
    id: string;
    name: string;
    icon?: string;
    color?: string;
    _count?: { Chapters: number };
}

const iconMap: Record<string, any> = {
    BookOpen, Brain, Music, Palette, Square
};

export default function SubjectsPage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ name: '', icon: 'BookOpen', color: 'text-blue-600' });

    const fetchSubjects = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/subjects');
            setSubjects(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleOpenModal = (s?: Subject) => {
        if (s) {
            setEditingId(s.id);
            setFormData({
                name: s.name,
                icon: s.icon || 'BookOpen',
                color: s.color || 'text-blue-600'
            });
        } else {
            setEditingId(null);
            setFormData({ name: '', icon: 'BookOpen', color: 'text-blue-600' });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/subjects/${editingId}`, formData);
            } else {
                await api.post('/subjects', formData);
            }
            setIsModalOpen(false);
            fetchSubjects();
        } catch (err) {
            alert('Erro ao salvar matéria.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir esta matéria? Isso pode afetar capítulos vinculados.')) {
            try {
                await api.delete(`/subjects/${id}`);
                fetchSubjects();
            } catch (err) {
                alert('Erro ao excluir.');
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Matérias & Disciplinas</h1>
                    <p className="text-slate-500 mt-1">Gestão da base curricular e categorias de atividades.</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-5 h-5 mr-2" />
                    Nova Matéria
                </Button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-48 bg-slate-100 animate-pulse rounded-2xl" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {subjects.map((subject) => {
                        const IconComp = iconMap[subject.icon || 'BookOpen'] || BookOpen;
                        return (
                            <Card key={subject.id} className="glass-panel border-none shadow-sm hover:translate-y-[-4px] transition-all group">
                                <CardContent className="p-8 text-center flex flex-col items-center relative">
                                    <div className={`w-16 h-16 bg-slate-50 ${subject.color || 'text-blue-600'} rounded-2xl flex items-center justify-center mb-4`}>
                                        <IconComp className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">{subject.name}</h3>
                                    <p className="text-sm text-slate-400 mt-1">{subject._count?.Chapters || 0} Capítulos vinculados</p>

                                    <div className="mt-6 flex gap-2">
                                        <button onClick={() => handleOpenModal(subject)} className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(subject.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Matéria' : 'Nova Matéria'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Nome da Matéria" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Ícone</label>
                            <select
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                                value={formData.icon}
                                onChange={e => setFormData({ ...formData, icon: e.target.value })}
                            >
                                <option value="BookOpen">Livro</option>
                                <option value="Brain">Cérebro</option>
                                <option value="Music">Música</option>
                                <option value="Palette">Artes</option>
                                <option value="Square">Matemática</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Cor</label>
                            <select
                                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
                                value={formData.color}
                                onChange={e => setFormData({ ...formData, color: e.target.value })}
                            >
                                <option value="text-blue-600">Azul</option>
                                <option value="text-amber-600">Amarelo</option>
                                <option value="text-emerald-600">Verde</option>
                                <option value="text-pink-600">Rosa</option>
                                <option value="text-purple-600">Roxo</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
