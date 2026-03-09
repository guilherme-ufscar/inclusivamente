import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import api from '../../services/api';
import { FileText, Download, CheckCircle2 } from 'lucide-react';

interface Report {
    id: string;
    period_start: string;
    period_end: string;
    summary_text: string;
    tutor_recommendation: string;
    generated_at: string;
    student_name?: string;
}

export default function FamilyReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get('/guardians/me/reports');
                setReports(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch reports', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Relatórios de Evolução</h1>
                <p className="text-slate-500 mt-1">Acompanhe os pareceres pedagógicos e o desenvolvimento mensal.</p>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-slate-400">Carregando relatórios...</div>
            ) : reports.length === 0 ? (
                <Card className="p-12 text-center text-slate-400 border-2 border-dashed border-slate-100">
                    Nenhum relatório disponível no momento.
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {reports.map((report) => (
                        <Card key={report.id} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">Relatório Mensal - {new Date(report.generated_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</CardTitle>
                                        <p className="text-xs text-slate-400">Aluno: <strong className="font-semibold">{report.student_name}</strong> | Gerado em {new Date(report.generated_at).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                </div>
                                <button className="flex items-center gap-2 text-brand-primary text-sm font-semibold hover:underline">
                                    <Download className="w-4 h-4" />
                                    Baixar PDF
                                </button>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 line-clamp-2">
                                    {report.summary_text}
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-600">
                                    <CheckCircle2 className="w-4 h-4" />
                                    RELATÓRIO VALIDADO PELO TUTOR
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
