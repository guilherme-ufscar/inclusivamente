import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { FileText, Download, BarChart2, BrainCircuit } from 'lucide-react';

interface Report {
    id: string;
    student_id: string;
    period_start: string;
    period_end: string;
    activities_with_tutor_count: number;
    activities_without_tutor_count?: number;
    tutor_recommendation: string;
    summary_text: string;
    tutor_observations?: string;
    Student?: { name: string };
    student?: { name: string };
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
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [editingReport, setEditingReport] = useState<Report | null>(null);
    const [tutorObservation, setTutorObservation] = useState('');
    const [filterType, setFilterType] = useState('period');
    const [activityCount, setActivityCount] = useState(5);
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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
            await api.post(`/students/${selectedStudentId}/reports/generate`, {
                filter_type: filterType,
                activity_count: activityCount,
                period_start: startDate,
                period_end: endDate
            });
            setIsModalOpen(false);
            fetchReports();
        } catch (err: any) {
            const msg = err?.response?.data?.message || 'Erro ao gerar relatório (ou não há histórico de atividades suficiente).';
            alert(msg);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleOpenEdit = (report: Report) => {
        setEditingReport(report);
        setTutorObservation(report.tutor_observations || '');
        setIsEditModalOpen(true);
    };

    const handleSaveObservation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReport) return;
        setIsSaving(true);
        try {
            await api.put(`/reports/${editingReport.id}`, { tutor_observations: tutorObservation });
            setIsEditModalOpen(false);
            fetchReports();
        } catch (err) {
            alert('Erro ao salvar observações.');
        } finally {
            setIsSaving(false);
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
        const printWindow = window.open('', '', 'width=900,height=800');
        if (!printWindow) return;

        printWindow.document.write(`
          <html>
            <head>
              <title>Parecer Analítico - ${report.student?.name || report.Student?.name || 'Aluno'}</title>
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
              <style>
                * { box-sizing: border-box; }
                body { 
                    font-family: 'Inter', Tahoma, Geneva, Verdana, sans-serif; 
                    padding: 40px; 
                    color: #334155; 
                    line-height: 1.6; 
                    background-color: #f8fafc;
                    margin: 0;
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                .page {
                    background: white;
                    border-radius: 16px;
                    padding: 40px;
                    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
                    max-width: 900px;
                    margin: 0 auto;
                }
                .header { 
                    border-bottom: 2px solid #e2e8f0; 
                    padding-bottom: 24px; 
                    margin-bottom: 30px; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: flex-start; 
                }
                .header-info {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .logo {
                    height: 52px;
                    object-fit: contain;
                }
                h1 { color: #0f172a; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.02em; }
                .subtitle { color: #64748b; font-size: 15px; font-weight: 500; }
                
                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 16px;
                    margin-bottom: 32px;
                }
                .stat-card {
                    background: #f1f5f9;
                    padding: 16px 20px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                }
                .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.05em; }
                .stat-value { font-size: 20px; color: #0f172a; font-weight: 800; }

                .content-section {
                    margin-bottom: 32px;
                    background: white;
                }
                h3 { 
                    margin: 0 0 16px 0; 
                    color: #0f172a; 
                    font-size: 16px; 
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .ai-summary {
                    background: #f8fafc;
                    border-left: 4px solid #10b981;
                    padding: 24px;
                    border-radius: 0 12px 12px 0;
                    color: #334155;
                    font-size: 15px;
                    line-height: 1.7;
                }

                .tutor-section { 
                    background: #fffbeb; 
                    border: 1px solid #fde68a; 
                    padding: 24px; 
                    border-radius: 12px; 
                }
                .tutor-section h3 {
                    color: #b45309;
                }

                .recommendation { 
                    margin-top: 20px; 
                    padding: 32px; 
                    background: #eff6ff; 
                    border-radius: 16px;
                    border: 1px solid #bfdbfe;
                    text-align: center;
                }
                .recommendation .label {
                    font-size: 13px;
                    color: #3b82f6;
                    text-transform: uppercase;
                    font-weight: 700;
                    letter-spacing: 0.05em;
                    margin-bottom: 8px;
                }
                .recommendation .value {
                    font-size: 28px;
                    color: #1d4ed8;
                    font-weight: 800;
                }
                
                .footer {
                    margin-top: 40px;
                    padding-top: 24px;
                    border-top: 1px solid #e2e8f0;
                    text-align: center;
                    color: #94a3b8;
                    font-size: 13px;
                    font-weight: 500;
                }

                @media print {
                    body { background-color: white; padding: 0; }
                    .page { box-shadow: none; padding: 0; border-radius: 0; max-width: 100%; }
                    .stat-card { border-color: #cbd5e1; }
                }
              </style>
            </head>
            <body>
              <div class="page">
                  <div class="header">
                      <div class="header-info">
                          <h1>Parecer de Desenvolvimento</h1>
                          <div class="subtitle">Documento Analítico Oficial</div>
                      </div>
                      <div style="text-align: right;">
                          <img src="${window.location.origin}/logo.svg" onerror="this.src='https://via.placeholder.com/150x50?text=Inclusiva+Mente'" class="logo" alt="Logo da Plataforma" />
                          <div style="color: #94a3b8; font-size: 12px; margin-top: 8px; font-weight: 500;">Emissão: ${new Date().toLocaleDateString('pt-BR')}</div>
                      </div>
                  </div>
                  
                  <div class="dashboard-grid">
                      <div class="stat-card">
                          <div class="stat-label">Aluno Avaliado</div>
                          <div class="stat-value" style="color: #3b82f6;">${report.student?.name || report.Student?.name || 'Não Informado'}</div>
                      </div>
                      <div class="stat-card">
                          <div class="stat-label">Período de Análise</div>
                          <div class="stat-value" style="font-size: 16px; line-height: 1.4;">
                              ${new Date(report.period_start).toLocaleDateString('pt-BR')} <span style="color:#94a3b8;font-weight:500">até</span><br/>${new Date(report.period_end).toLocaleDateString('pt-BR')}
                          </div>
                      </div>
                      <div class="stat-card">
                          <div class="stat-label">Atividades Computadas</div>
                          <div class="stat-value">${(report.activities_without_tutor_count || 0) + (report.activities_with_tutor_count || 0)}</div>
                      </div>
                  </div>
                  
                  <div class="content-section">
                      <h3><span style="display:inline-block;width:10px;height:10px;background:#10b981;border-radius:50%;"></span> Síntese Qualitativa Inteligente</h3>
                      <div class="ai-summary">
                          ${report.summary_text.replace(/\n/g, '<br/>')}
                      </div>
                  </div>

                  ${report.tutor_observations ? `
                  <div class="content-section">
                      <div class="tutor-section">
                          <h3><span style="display:inline-block;width:10px;height:10px;background:#f59e0b;border-radius:50%;"></span> Parecer Técnico do Especialista</h3>
                          <div style="color: #451a03; font-size: 15px; line-height: 1.7;">
                              ${report.tutor_observations.replace(/\n/g, '<br/>')}
                          </div>
                      </div>
                  </div>
                  ` : ''}

                  <div class="recommendation">
                      <div class="label">Parecer do Motor Pedagógico</div>
                      <div class="value">${translateRecommendation(report.tutor_recommendation).toUpperCase()}</div>
                  </div>
                  
                  <div class="footer">
                      Documento gerado pelo Ecossistema Inclusiva Mente &copy; ${new Date().getFullYear()}<br/>
                      <span style="color: #cbd5e1; font-size: 11px; margin-top: 4px; display: block;">Uso restrito e confidencial. Informações protegidas por Lei.</span>
                  </div>
              </div>
              <script>
                  setTimeout(() => {
                      window.print();
                      window.close();
                  }, 800);
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
                                        Parecer de Desenvolvimento: {report.student?.name || report.Student?.name || 'Aluno Desconhecido'}
                                    </CardTitle>
                                    <p className="text-sm text-slate-500 mt-1">Período: {new Date(report.period_start).toLocaleDateString()} a {new Date(report.period_end).toLocaleDateString()}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getRecommendationColor(report.tutor_recommendation)}`}>
                                    Recomendação de Tutor: {translateRecommendation(report.tutor_recommendation)}
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="grid md:grid-cols-4 gap-6">
                                    <div className="md:col-span-3 space-y-6">
                                        <div>
                                            <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                                                <BrainCircuit className="w-4 h-4 text-emerald-500" />
                                                Resumo da IA
                                            </h4>
                                            <div
                                                className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-700 leading-relaxed max-h-64 overflow-y-auto custom-scrollbar"
                                                dangerouslySetInnerHTML={{ __html: report.summary_text.replace(/\n/g, '<br />') }}
                                            />
                                        </div>

                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-slate-900 flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-brand-primary" />
                                                    Parecer Técnico do Tutor
                                                </h4>
                                                <Button size="sm" variant="ghost" onClick={() => handleOpenEdit(report)} className="h-8 text-[10px] uppercase">
                                                    Editar Parecer
                                                </Button>
                                            </div>
                                            <div className="p-4 bg-white rounded-xl border border-slate-200 text-sm text-slate-700 min-h-[80px]">
                                                {report.tutor_observations ? (
                                                    <p>{report.tutor_observations}</p>
                                                ) : (
                                                    <span className="text-slate-400 italic">Nenhum parecer técnico registrado pelo tutor ainda.</span>
                                                )}
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
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Modo de Filtro</label>
                        <select
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="period">Por Período (Datas)</option>
                            <option value="quantity">Por Quantidade de Atividades</option>
                        </select>
                    </div>

                    {filterType === 'period' ? (
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Data Inicial</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Data Final</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Quantidade de Atividades Recentes</label>
                            <input
                                type="number"
                                min={1}
                                required
                                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                                value={activityCount}
                                onChange={(e) => setActivityCount(Number(e.target.value))}
                            />
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" isLoading={isGenerating}>Montar Relatório</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal de Edição de Parecer do Tutor */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Editar Parecer Técnico">
                <form onSubmit={handleSaveObservation} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Sua análise sobre a evolução do aluno</label>
                        <textarea
                            required
                            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                            rows={10}
                            placeholder="Descreva aqui sua opinião técnica, pontos de melhoria observados e retorno qualitativo..."
                            value={tutorObservation}
                            onChange={(e) => setTutorObservation(e.target.value)}
                        />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)}>Cancelar</Button>
                        <Button type="submit" isLoading={isSaving} variant="primary">Salvar Parecer</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
