import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users2, HeartHandshake, GraduationCap, BrainCircuit, Activity, ClipboardList } from 'lucide-react';

export default function SchoolDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ students: 0, tutors: 0, classes: 0, activities: 0 });
    const [schoolName, setSchoolName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const schoolId = user?.school_id;
                const [studentsRes, tutorsRes, classesRes, schoolRes] = await Promise.all([
                    api.get('/students', { params: { school_id: schoolId } }),
                    api.get(`/schools/${schoolId}/tutors`),
                    api.get('/classes', { params: { school_id: schoolId } }),
                    api.get(`/schools/${schoolId}`),
                ]);

                setStats({
                    students: studentsRes.data.data?.length || 0,
                    tutors: tutorsRes.data.data?.length || 0,
                    classes: classesRes.data.data?.length || 0,
                    activities: 0
                });
                const school = schoolRes.data.data || schoolRes.data;
                setSchoolName(school?.name || '');
            } catch (error) {
                console.error('Failed to load school dashboard data', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const statCards = [
        { label: 'Alunos Matriculados', value: stats.students, icon: Users2, color: 'brand-primary', path: '/school/students' },
        { label: 'Tutores Vinculados', value: stats.tutors, icon: HeartHandshake, color: 'brand-accent', path: '/school/tutors' },
        { label: 'Turmas Ativas', value: stats.classes, icon: GraduationCap, color: 'brand-secondary', path: '/school/classes' },
        { label: 'Atividades', value: stats.activities, icon: BrainCircuit, color: 'slate-600', path: '/school/activities' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                        <GraduationCap className="w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">
                            {schoolName ? schoolName : 'Painel da Escola'}
                        </h1>
                        <p className="text-slate-500 mt-1">Bem-vindo(a) ao painel de gestão{schoolName ? ` de ${schoolName}` : ' escolar'}.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <Card
                        key={card.label}
                        className="glass-panel border-none shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5"
                        onClick={() => navigate(card.path)}
                    >
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{card.label}</p>
                                    <h3 className="text-3xl font-bold text-slate-900 mt-2">{isLoading ? '-' : card.value}</h3>
                                </div>
                                <div className={`p-3 bg-${card.color}/10 rounded-xl text-${card.color}`}>
                                    <card.icon className="w-6 h-6" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="glass-panel border-none shadow-sm border-l-4 border-l-brand-primary cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/school/anamnesis')}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-brand-primary" />
                            Sondagem Pedagógica
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-sm text-slate-500">Realize a sondagem pedagógica dos alunos para construir o perfil de aprendizagem individual.</p>
                        <button className="text-brand-primary text-sm font-semibold mt-4 hover:underline">Acessar Sondagem →</button>
                    </CardContent>
                </Card>

                <Card className="glass-panel border-none shadow-sm border-l-4 border-l-amber-500 cursor-pointer hover:shadow-md transition-all" onClick={() => navigate('/school/reports')}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-amber-500" />
                            Relatórios & Feedback aos Pais
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <p className="text-sm text-slate-500">Visualize os relatórios de desempenho e envie feedback personalizado às famílias.</p>
                        <button className="text-brand-primary text-sm font-semibold mt-4 hover:underline">Ver Relatórios →</button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
