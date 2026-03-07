import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { Plus, School, GraduationCap } from 'lucide-react';

export default function ClassesPage() {
    const [schools, setSchools] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const res = await api.get('/schools');
                setSchools(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchools();
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Gestão de Turmas</h1>
                    <p className="text-slate-500 mt-1">Organização de grupos de alunos por instituição e nível.</p>
                </div>
                <Button>
                    <Plus className="w-5 h-5 mr-2" />
                    Criar Turma
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? <p>Carregando...</p> : schools.map((school) => (
                    <Card key={school.id} className="glass-panel border-none shadow-sm overflow-hidden">
                        <div className="bg-brand-primary/10 p-4 border-b border-brand-primary/20 flex items-center gap-3">
                            <School className="w-5 h-5 text-brand-primary" />
                            <h2 className="font-bold text-slate-900">{school.name}</h2>
                        </div>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-brand-primary/30 transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                            <GraduationCap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">1º Ano - Manhã</p>
                                            <p className="text-xs text-slate-500">22 Alunos • Fundamental I</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-brand-primary bg-brand-primary/5 px-2 py-1 rounded">Ver Detalhes</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-brand-primary/30 transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                            <GraduationCap className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">2º Ano - Tarde</p>
                                            <p className="text-xs text-slate-500">18 Alunos • Fundamental I</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-brand-primary bg-brand-primary/5 px-2 py-1 rounded">Ver Detalhes</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
