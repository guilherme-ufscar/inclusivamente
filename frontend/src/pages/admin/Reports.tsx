import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { FileText, Download, BarChart2 } from 'lucide-react';

interface Report {
    id: string;
    student_id: string;
    period_start: string;
    period_end: string;
    activities_with_tutor_count: number;
    tutor_recommendation: string;
    summary_text: string;
    Student?: { name: string };
}

interface Student {
    id: string;
    name: string;
}

export default function ReportsPage() {
    const [reports, setReports] = useState<Report[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const res = await api.get('/reports');
            setReports(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch reports', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
        api.get('/students').then(res => setStudents(res.data.data)).catch(console.error);
    }, []);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudentId) return;
        setIsGenerating(true);
        try {
            await api.post('/reports/generate', { student_id: selectedStudentId });
            setIsModalOpen(false);
            fetchReports();
        } catch (err) {
            alert('Erro ao gerar relatório (ou não há histórico de atividades suficiente).');
        } finally {
            setIsGenerating(false);
        }
    };

    const getRecommendationColor = (rec: string) => {
        switch (rec) {
            case 'continuous': return 'bg-red-100 text-red-800 border-red-200';
            case 'sporadic': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'not_needed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            default: return 'bg-slate-100 text-slate-800 border-slate-200';
        }
    };

    const translateRecommendation = (rec: string) => {
        switch (rec) {
            case 'continuous': return 'Apoio Contínuo';
            case 'sporadic': return 'Apoio Esporádico';
            case 'not_needed': return 'Apoio Desnecessário';
            default: return 'Indefinido';
        }
    };

    const handleDownloadPDF = (report: Report) => {
        const printWindow = window.open('', '', 'width=800,height=600');
        if (!printWindow) return;

        printWindow.document.write(`
          <html>
            <head>
              <title>Relatório Inclusiva Mente - ${report.Student?.name}</title>
              <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #334155; line-height: 1.6; }
                .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
                h1 { color: #0f172a; margin: 0; font-size: 24px; }
                .meta { background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 30px; font-size: 14px; color: #64748b; border: 1px solid #e2e8f0; }
                .meta span { display: block; margin-bottom: 5px; }
                .meta strong { color: #334155; }
                .content { padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
                h3 { margin-top: 0; color: #0f172a; }
                .recommendation { margin-top: 30px; font-weight: bold; padding: 15px; background: #f1f5f9; border-left: 5px solid #3b82f6; color: #1e293b; border-radius: 4px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Parecer de Desenvolvimento Analítico</h1>
                <div style="text-align: right; color: #94a3b8; font-size: 12px;">Inclusiva Mente Educa<br/>Data Emissão: ${new Date().toLocaleDateString('pt-BR')}</div>
              </div>
              <div class="meta">
                <span><strong>Aluno Avaliado:</strong> ${report.Student?.name}</span>
                <span><strong>Período Analisado:</strong> ${new Date(report.period_start).toLocaleDateString('pt-BR')} a ${new Date(report.period_end).toLocaleDateString('pt-BR')}</span>
                <span><strong>Atividades Acompanhadas Computadas:</strong> ${report.activities_with_tutor_count}</span>
              </div>
              <div class="content">
                <h3>Síntese Qualitativa da Inteligência Artificial</h3>
                <p>${report.summary_text.replace(/\n/g, '<br/>')}</p>
              </div>
              <div class="recommendation">
                Recomendação da Motor de Regras BNCC/Plataforma:<br/>
                <span style="font-size: 18px; color: #2563eb; display: inline-block; margin-top: 8px;">${translateRecommendation(report.tutor_recommendation).toUpperCase()}</span>
              </div>
              <script>
                setTimeout(() => {
                  window.print();
                  window.close();
                }, 500);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Relatórios Analíticos</h1>
                    <p className="text-slate-500 mt-1">Geração de pareceres IA e análise de evolução do paciente/estudante.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="shrink-0">
                    <BarChart2 className="w-5 h-5 mr-2" />
                    Gerar Novo Parecer
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {isLoading ? (
                    <div className="p-12 text-center text-slate-400 border border-slate-200 rounded-2xl">Carregando relatórios...</div>
                ) : reports.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 border border-slate-200 rounded-2xl bg-white">
                        <FileText className="w-12 h-12 mx-auto text-slate-200 mb-3" />
                        Nenhum relatório emitido ainda.
                    </div>
                ) : (
                    reports.map(report => (
                        <Card key={report.id} className="glass-panel overflow-hidden border-none shadow-sm transition-shadow">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between py-4">
                                <div>
                                    <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-brand-primary" />
                                        Parecer de Desenvolvimento: {report.Student?.name || 'Aluno Desconhecido'}
                                    </CardTitle>
                                    <p className="text-sm text-slate-500 mt-1">Período: {new Date(report.period_start).toLocaleDateString()} a {new Date(report.period_end).toLocaleDateString()}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getRecommendationColor(report.tutor_recommendation)}`}>
                                    Recomendação de Tutor: {translateRecommendation(report.tutor_recommendation)}
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-4 gap-6">
                                    <div className="md:col-span-3 space-y-4">
                                        <div>
                                            <h4 className="font-medium text-slate-900 mb-2">Resumo da IA</h4>
                                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed">
                                                {report.summary_text}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Métricas</p>
                                            <p className="text-sm text-slate-800">
                                                <strong>Atividades c/ Tutor:</strong> {report.activities_with_tutor_count}
                                            </p>
                                        </div>
                                        <Button
                                            variant="outline"
                                            className="w-full"
                                            onClick={() => handleDownloadPDF(report)}
                                        >
                                            <Download className="w-4 h-4 mr-2" /> Exportar PDF
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sintetizar Novo Parecer">
                <form onSubmit={handleGenerate} className="space-y-4">
                    <p className="text-sm text-slate-600 mb-4">
                        A emissão de parecer irá consolidar as atividades recentes do aluno e usar o motor de regras pedagógico para recomendar continuidade de tutoria intensiva ou espaçada.
                    </p>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Aluno</label>
                        <select
                            required
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                        >
                            <option value="" disabled>Selecione quem será avaliado</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" isLoading={isGenerating}>Montar Relatório</Button>
                    </div>
                </form>
            </Modal>

        </div>
    );
}
