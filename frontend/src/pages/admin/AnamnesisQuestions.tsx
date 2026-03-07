import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { Plus, Pencil, Trash2, ListTodo } from 'lucide-react';

interface Sphere { id: string; name: string; }
interface Question {
    id: string;
    sphere_id: string;
    sphere?: { name: string };
    question_text: string;
    question_type: string;
    options_json: string;
    is_required: boolean;
    order_index: number;
}

export default function AnamnesisQuestionsPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [spheres, setSpheres] = useState<Sphere[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        sphere_id: '',
        question_text: '',
        question_type: 'text',
        options_json: '[]',
        is_required: true,
        order_index: 0
    });

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [qRes, sRes] = await Promise.all([
                api.get('/anamnesis/questions'),
                api.get('/anamnesis/spheres')
            ]);
            setQuestions(qRes.data.data || []);
            setSpheres(sRes.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleOpenModal = (q?: Question) => {
        if (q) {
            setEditingId(q.id);
            setFormData({
                sphere_id: q.sphere_id,
                question_text: q.question_text,
                question_type: q.question_type,
                options_json: q.options_json || '[]',
                is_required: q.is_required,
                order_index: q.order_index
            });
        } else {
            setEditingId(null);
            setFormData({
                sphere_id: spheres[0]?.id || '',
                question_text: '',
                question_type: 'text',
                options_json: '[]',
                is_required: true,
                order_index: questions.length + 1
            });
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
                await api.put(`/anamnesis/questions/${editingId}`, formData);
            } else {
                await api.post('/anamnesis/questions', formData);
            }
            handleCloseModal();
            fetchData();
        } catch (err) {
            alert('Erro ao salvar pergunta.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir esta pergunta? isso afetará os formulários futuros.')) {
            try {
                await api.delete(`/anamnesis/questions/${id}`);
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
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Perguntas da Anamnese</h1>
                    <p className="text-slate-500 mt-1">Configuração das questões dinâmicas de cada esfera.</p>
                </div>
                <Button onClick={() => handleOpenModal()} disabled={spheres.length === 0}>
                    <Plus className="w-5 h-5 mr-2" />
                    Nova Pergunta
                </Button>
            </div>

            <Card className="glass-panel border-none shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-4">Esfera / Ordem</th>
                                <th className="px-6 py-4">Pergunta</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center">Carregando...</td></tr>
                            ) : questions.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                        <ListTodo className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                        Nenhuma pergunta cadastrada.
                                    </td>
                                </tr>
                            ) : (
                                questions.map((q) => (
                                    <tr key={q.id} className="hover:bg-slate-50/50">
                                        <td className="px-6 py-4 text-xs">
                                            <span className="font-bold text-slate-700 block">{q.sphere?.name}</span>
                                            <span className="text-slate-400">Posição: {q.order_index}</span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 max-w-sm truncate" title={q.question_text}>
                                            {q.question_text}
                                            {q.is_required && <span className="ml-1 text-red-500">*</span>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] uppercase font-bold text-slate-600">
                                                {q.question_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(q)} className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(q.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
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

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? 'Editar Pergunta' : 'Nova Pergunta de Anamnese'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Esfera Correspondente</label>
                        <select className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" value={formData.sphere_id} onChange={e => setFormData({ ...formData, sphere_id: e.target.value })}>
                            {spheres.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <Input label="Texto da Pergunta" required value={formData.question_text} onChange={e => setFormData({ ...formData, question_text: e.target.value })} />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Tipo de Resposta</label>
                            <select className="flex h-11 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" value={formData.question_type} onChange={e => setFormData({ ...formData, question_type: e.target.value })}>
                                <option value="text">Texto Livre</option>
                                <option value="single_choice">Escolha Única</option>
                                <option value="multiple_choice">Múltipla Escolha</option>
                                <option value="boolean">Sim/Não</option>
                                <option value="number">Numérico</option>
                            </select>
                        </div>
                        <Input label="Ordem" type="number" required value={formData.order_index} onChange={e => setFormData({ ...formData, order_index: Number(e.target.value) })} />
                    </div>
                    {(formData.question_type === 'single_choice' || formData.question_type === 'multiple_choice') && (
                        <div>
                            <label className="text-sm font-medium text-slate-700 mb-1 block">Opções (JSON Array)</label>
                            <Input placeholder='["Opção 1", "Opção 2"]' value={formData.options_json} onChange={e => setFormData({ ...formData, options_json: e.target.value })} />
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="is_required" checked={formData.is_required} onChange={e => setFormData({ ...formData, is_required: e.target.checked })} />
                        <label htmlFor="is_required" className="text-sm text-slate-700">Obrigatória</label>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
                        <Button type="submit">Salvar Pergunta</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
