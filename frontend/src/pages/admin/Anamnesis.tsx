import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AnamnesisWizard from '../../components/anamnesis/AnamnesisWizard';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { UserPlus, UserRound } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    grade_level: string;
}

export default function AnamnesisPage() {
    const [searchParams] = useSearchParams();
    const studentIdParam = searchParams.get('studentId');
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(studentIdParam);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        // Carregar alunos para selecionar na interface de teste.
        api.get('/students').then(res => {
            setStudents(res.data.data);
        }).catch(console.error);
    }, []);

    useEffect(() => {
        if (studentIdParam) {
            setSelectedStudent(studentIdParam);
        }
    }, [studentIdParam]);

    if (isCompleted) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-96">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                    <UserPlus className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-heading font-bold text-slate-800 mb-2">Anamnese Concluída!</h2>
                <p className="text-slate-500 mb-8 max-w-md">O perfil cognitivo do aluno foi recalculado com sucesso com base nas respostas enviadas.</p>
                <Button onClick={() => { setIsCompleted(false); setSelectedStudent(null); }}>
                    Fazer Nova Anamnese
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Anamnese Guiada</h1>
                <p className="text-slate-500 mt-1">Construa o perfil neuropsicológico e pedagógico dos alunos seguindo os fluxos padronizados.</p>
            </div>

            {!selectedStudent ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Selecione um aluno</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {students.length === 0 && <p className="text-slate-500 p-4">Nenhum aluno cadastrado para exibir.</p>}
                        {students.map(student => (
                            <div
                                key={student.id}
                                onClick={() => setSelectedStudent(student.id)}
                                className="flex items-center p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-colors group"
                            >
                                <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center group-hover:bg-white group-hover:text-brand-primary shadow-sm transition-colors mr-4">
                                    <UserRound className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800">{student.name}</h4>
                                    <p className="text-sm text-slate-500">{student.grade_level}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            ) : (
                <div>
                    <div className="mb-4">
                        <Button variant="ghost" onClick={() => setSelectedStudent(null)}>Voltar para listagem</Button>
                    </div>
                    <AnamnesisWizard
                        studentId={selectedStudent}
                        onComplete={() => setIsCompleted(true)}
                    />
                </div>
            )}
        </div>
    );
}
