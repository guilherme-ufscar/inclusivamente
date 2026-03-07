import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { Plus, Pencil, Trash2, Search, Compass } from 'lucide-react';

interface BnccCompetence {
    id: string;
    code: string;
    title: string;
    description: string;
    stage: string;
    subject: string;
}

export default function BnccPage() {
    const [records, setRecords] = useState<BnccCompetence[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState({
        code: '',
        title: '',
        description: '',
        stage: '',
        subject: ''
    });

    const fetchRecords = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/bncc');
            setRecords(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch BNCC data', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleOpenModal = (record?: BnccCompetence) => {
        if (record) {
            setEditingId(record.id);
            setFormData({
                code: record.code,
                title: record.title,
                description: record.description || '',
                stage: record.stage || '',
                subject: record.subject || ''
            });
        } else {
            setEditingId(null);
            setFormData({ code: '', title: '', description: '', stage: '', subject: '' });
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
                await api.put(`/bncc/${editingId}`, formData);
            } else {
                await api.post('/bncc', formData);
            }
            handleCloseModal();
            fetchRecords();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Erro ao salvar competência.');
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Excluir esta competência BNCC?')) {
            try {
                await api.delete(`/bncc/${id}`);
                fetchRecords();
            } catch (err) {
                alert('Erro ao excluir.');
            }
        }
    };

    const filteredRecords = records.filter(r =>
        r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Base Nacional (BNCC)</h1>
                    <p className="text-slate-500 mt-1">Gestão de competências e habilidades curriculares.</p>
                </div>
                <Button onClick={() => handleOpenModal()}>
                    <Plus className="w-5 h-5 mr-2" />
                    Nova Competência
                </Button>
            </div>

            <Card className="glass-panel border-none shadow-sm">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4 bg-white/50">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por código ou título..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Código / Título</th>
                                <th className="px-6 py-4">Componente / Etapa</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {isLoading ? (
                                <tr><td colSpan={3} className="px-6 py-8 text-center text-slate-500">Carregando...</td></tr>
                            ) : filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                                        <Compass className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                                        Nenhuma competência encontrada.
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-brand-primary">{record.code}</div>
                                            <div className="text-slate-900 font-medium max-w-xs truncate" title={record.title}>{record.title}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="block text-slate-700">{record.subject}</span>
                                            <span className="block text-xs text-slate-400">{record.stage}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => handleOpenModal(record)} className="p-2 text-slate-400 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors">
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(record.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingId ? 'Editar BNCC' : 'Nova Competência BNCC'}>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1">
                            <Input label="Código" placeholder="ex: EF01LP01" required value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} />
                        </div>
                        <div className="col-span-2">
                            <Input label="Título / Habilidade" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Etapa" placeholder="ex: Ensino Fundamental" value={formData.stage} onChange={e => setFormData({ ...formData, stage: e.target.value })} />
                        <Input label="Componente Curricular" placeholder="ex: Língua Portuguesa" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-slate-700 mb-1 block">Descrição Detalhada</label>
                        <textarea
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary min-h-[100px]"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={handleCloseModal}>Cancelar</Button>
                        <Button type="submit">{editingId ? 'Salvar Alterações' : 'Cadastrar'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
