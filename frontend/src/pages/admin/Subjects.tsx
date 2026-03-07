import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { Plus, BookOpen, Brain, Music, Palette, Square } from 'lucide-react';

const subjects = [
    { id: '1', name: 'Língua Portuguesa', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { id: '2', name: 'Matemática', icon: Square, color: 'text-amber-600', bg: 'bg-amber-50' },
    { id: '3', name: 'Ciências', icon: Brain, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { id: '4', name: 'Artes', icon: Palette, color: 'text-pink-600', bg: 'bg-pink-50' },
    { id: '5', name: 'Música', icon: Music, color: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function SubjectsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Matérias & Disciplinas</h1>
                    <p className="text-slate-500 mt-1">Gestão da base curricular e categorias de atividades.</p>
                </div>
                <Button>
                    <Plus className="w-5 h-5 mr-2" />
                    Nova Matéria
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {subjects.map((subject) => (
                    <Card key={subject.id} className="glass-panel border-none shadow-sm hover:translate-y-[-4px] transition-all cursor-pointer">
                        <CardContent className="p-8 text-center flex flex-col items-center">
                            <div className={`w-16 h-16 ${subject.bg} ${subject.color} rounded-2xl flex items-center justify-center mb-4`}>
                                <subject.icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">{subject.name}</h3>
                            <p className="text-sm text-slate-400 mt-1">12 Atividades vinculadas</p>
                            <div className="mt-6 flex gap-2">
                                <Button variant="ghost" className="text-xs h-8">Editar</Button>
                                <Button variant="ghost" className="text-xs h-8 text-red-500 hover:bg-red-50">Excluir</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
