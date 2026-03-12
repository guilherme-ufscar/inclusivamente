import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { FileText, Search, ChevronRight, User, Calendar, BarChart2, Download, BrainCircuit } from 'lucide-react';

interface Student {
    id: string;
    name: string;
    class?: { name: string };
    grade_level: string;
}

interface Report {
    id: string;
    student_id: string;
    period_start: string;
    period_end: string;
    summary_text: string;
    activities_with_tutor_count: number;
    activities_without_tutor_count: number;
    autonomy_percentage: number;
    tutor_recommendation: string;
    tutor_observations: string;
    generated_at: string;
    student?: { name: string };
}

export default function SchoolReports() {
    const { user } = useAuth();
    const schoolId = user?.school_id;
    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Generation modal state
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [genStudentId, setGenStudentId] = useState('');
    const [filterType, setFilterType] = useState('period');
    const [activityCount, setActivityCount] = useState(5);
    const [startDate, setStartDate] = useState(() => {
        const d = new Date();
        d.setMonth(d.getMonth() - 1);
        return d.toISOString().split('T')[0];
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await api.get('/students', { params: { school_id: schoolId } });
                setStudents(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch students', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStudents();
    }, [schoolId]);

    const handleSelectStudent = async (student: Student) => {
        setSelectedStudent(student);
        try {
            const res = await api.get(`/students/${student.id}/reports`);
            setReports(res.data.data || []);
        } catch (err) {
            console.error('Failed to fetch reports', err);
            setReports([]);
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!genStudentId) return;
        setIsGenerating(true);
        try {
            await api.post(`/students/${genStudentId}/reports/generate`, {
                filter_type: filterType,
                activity_count: activityCount,
                period_start: startDate,
                period_end: endDate
            });
            setIsGenerateOpen(false);
            // If we're viewing the same student, refresh
            if (selectedStudent && selectedStudent.id === genStudentId) {
                handleSelectStudent(selectedStudent);
            }
            alert('Parecer gerado com sucesso!');
        } catch (err) {
            alert('Erro ao gerar relatório. Verifique se o aluno possui atividades registradas.');
        } finally {
            setIsGenerating(false);
        }
    };

    const getRecommendationBadge = (rec: string) => {
        const map: Record<string, { color: string; label: string }> = {
            not_needed: { color: 'bg-emerald-100 text-emerald-700', label: 'Apoio Desnecessário' },
            sporadic: { color: 'bg-amber-100 text-amber-700', label: 'Apoio Esporádico' },
            continuous: { color: 'bg-red-100 text-red-700', label: 'Apoio Contínuo' },
        };
        const info = map[rec] || { color: 'bg-slate-100 text-slate-500', label: rec || '-' };
        return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${info.color}`}>{info.label}</span>;
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
        const studentName = report.student?.name || selectedStudent?.name || 'Aluno';
        const printWindow = window.open('', '', 'width=900,height=800');
        if (!printWindow) return;

        printWindow.document.write(`
          <html>
            <head>
              <title>Parecer Analítico - ${studentName}</title>
              <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
              <style>
                * { box-sizing: border-box; }
                body { font-family: 'Inter', sans-serif; padding: 40px; color: #334155; line-height: 1.6; background-color: #f8fafc; margin: 0; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                .page { background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); max-width: 900px; margin: 0 auto; }
                .header { border-bottom: 2px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
                h1 { color: #0f172a; margin: 0; font-size: 28px; font-weight: 800; }
                .subtitle { color: #64748b; font-size: 15px; font-weight: 500; }
                .dashboard-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; }
                .stat-card { background: #f1f5f9; padding: 16px 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
                .stat-label { font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.05em; }
                .stat-value { font-size: 20px; color: #0f172a; font-weight: 800; }
                h3 { margin: 0 0 16px 0; color: #0f172a; font-size: 16px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
                .ai-summary { background: #f8fafc; border-left: 4px solid #10b981; padding: 24px; border-radius: 0 12px 12px 0; color: #334155; font-size: 15px; line-height: 1.7; }
                .tutor-section { background: #fffbeb; border: 1px solid #fde68a; padding: 24px; border-radius: 12px; margin-bottom: 32px; }
                .tutor-section h3 { color: #b45309; }
                .recommendation { margin-top: 20px; padding: 32px; background: #eff6ff; border-radius: 16px; border: 1px solid #bfdbfe; text-align: center; }
                .recommendation .label { font-size: 13px; color: #3b82f6; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 8px; }
                .recommendation .value { font-size: 28px; color: #1d4ed8; font-weight: 800; }
                .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 13px; font-weight: 500; }
                @media print { body { background-color: white; padding: 0; } .page { box-shadow: none; padding: 0; border-radius: 0; max-width: 100%; } }
              </style>
            </head>
            <body>
              <div class="page">
                  <div class="header">
                      <div>
                          <h1>Parecer de Desenvolvimento</h1>
                          <div class="subtitle">Documento Analítico Oficial</div>
                      </div>
                      <div style="text-align: right;">
                          <img src="${window.location.origin}/logo.svg" onerror="this.src='https://via.placeholder.com/150x50?text=Inclusiva+Mente'" style="height:52px;object-fit:contain" alt="Logo" />
                          <div style="color: #94a3b8; font-size: 12px; margin-top: 8px; font-weight: 500;">Emissão: ${new Date().toLocaleDateString('pt-BR')}</div>
                      </div>
                  </div>
                  
                  <div class="dashboard-grid">
                      <div class="stat-card">
                          <div class="stat-label">Aluno Avaliado</div>
                          <div class="stat-value" style="color: #3b82f6;">${studentName}</div>
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
                  
                  <div style="margin-bottom: 32px;">
                      <h3><span style="display:inline-block;width:10px;height:10px;background:#10b981;border-radius:50%;"></span> Síntese Qualitativa Inteligente</h3>
                      <div class="ai-summary">
                          ${report.summary_text.replace(/\n/g, '<br/>')}
                      </div>
                  </div>

                  ${report.tutor_observations ? `
                  <div class="tutor-section">
                      <h3><span style="display:inline-block;width:10px;height:10px;background:#f59e0b;border-radius:50%;"></span> Parecer Técnico do Especialista</h3>
                      <div style="color: #451a03; font-size: 15px; line-height: 1.7;">
                          ${report.tutor_observations.replace(/\n/g, '<br/>')}
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
                  setTimeout(() => { window.print(); window.close(); }, 800);
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
    };

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Detail view for selected student
    if (selectedStudent) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => setSelectedStudent(null)}>← Voltar</Button>
                        <div>
                            <h1 className="text-2xl font-heading font-bold text-slate-900">Relatórios & Feedback</h1>
                            <p className="text-slate-500">Aluno: <strong>{selectedStudent.name}</strong> - {selectedStudent.class?.name || 'Sem turma'}</p>
                        </div>
                    </div>
                    <Button onClick={() => { setGenStudentId(selectedStudent.id); setIsGenerateOpen(true); }} className="shrink-0">
                        <BarChart2 className="w-5 h-5 mr-2" /> Gerar Parecer
                    </Button>
                </div>

                {reports.length === 0 ? (
                    <Card className="shadow-sm">
                        <CardContent className="p-12 text-center text-slate-500">
                            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                            Nenhum relatório disponível para este aluno. Clique em "Gerar Parecer" para criar o primeiro.
                        </CardContent>
                    </Card>
                ) : reports.map(report => (
                    <Card key={report.id} className="shadow-sm border-slate-200">
                        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-brand-primary" />
                                    Parecer de Desenvolvimento
                                </CardTitle>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(report.period_start).toLocaleDateString('pt-BR')} — {new Date(report.period_end).toLocaleDateString('pt-BR')}
                                    </span>
                                    {getRecommendationBadge(report.tutor_recommendation)}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-5">
                            {/* AI Summary */}
                            <div>
                                <h4 className="font-medium text-slate-900 mb-2 flex items-center gap-2">
                                    <BrainCircuit className="w-4 h-4 text-emerald-500" />
                                    Síntese Qualitativa (IA)
                                </h4>
                                <div
                                    className="p-4 bg-slate-50 rounded-xl border-l-4 border-l-emerald-400 text-sm text-slate-700 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: report.summary_text.replace(/\n/g, '<br/>') }}
                                />
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                                    <p className="text-2xl font-bold text-brand-primary">{report.activities_with_tutor_count}</p>
                                    <p className="text-xs text-slate-500 mt-1">Com Tutor</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                                    <p className="text-2xl font-bold text-brand-secondary">{report.activities_without_tutor_count}</p>
                                    <p className="text-xs text-slate-500 mt-1">Sem Tutor</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                                    <p className="text-2xl font-bold text-brand-accent">{Math.round(report.autonomy_percentage)}%</p>
                                    <p className="text-xs text-slate-500 mt-1">Autonomia</p>
                                </div>
                                <div className="bg-white rounded-xl p-4 border border-slate-100 text-center">
                                    <p className="text-xs text-slate-500 mb-2">Recomendação</p>
                                    {getRecommendationBadge(report.tutor_recommendation)}
                                </div>
                            </div>

                            {/* Tutor observations */}
                            {report.tutor_observations && (
                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                                    <p className="text-sm font-medium text-amber-800 mb-1">Observações do Tutor</p>
                                    <p className="text-sm text-amber-700">{report.tutor_observations}</p>
                                </div>
                            )}

                            {/* Footer actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                <span className="text-xs text-slate-400">
                                    Gerado em: {new Date(report.generated_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                                </span>
                                <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(report)}>
                                    <Download className="w-4 h-4 mr-2" /> Exportar PDF
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Generate Report Modal */}
                {renderGenerateModal()}
            </div>
        );
    }

    function renderGenerateModal() {
        return (
            <Modal isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} title="Gerar Novo Parecer">
                <form onSubmit={handleGenerate} className="space-y-4">
                    <p className="text-sm text-slate-600 mb-4">
                        O parecer irá consolidar as atividades recentes do aluno e usar o motor de regras pedagógico para recomendar continuidade de tutoria.
                    </p>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-slate-700">Aluno</label>
                        <select
                            required
                            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            value={genStudentId}
                            onChange={(e) => setGenStudentId(e.target.value)}
                        >
                            <option value="" disabled>Selecione quem será avaliado</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.name} {s.class?.name ? `(${s.class.name})` : ''}</option>)}
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
                                <input type="date" required className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-medium text-slate-700">Data Final</label>
                                <input type="date" required className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-700">Quantidade de Atividades Recentes</label>
                            <input type="number" min={1} required className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-brand-primary outline-none" value={activityCount} onChange={(e) => setActivityCount(Number(e.target.value))} />
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="ghost" onClick={() => setIsGenerateOpen(false)}>Cancelar</Button>
                        <Button type="submit" isLoading={isGenerating}>Gerar Parecer</Button>
                    </div>
                </form>
            </Modal>
        );
    }

    // Student list view
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Relatórios & Feedback</h1>
                    <p className="text-slate-500 mt-1">Gere pareceres e visualize relatórios de desempenho dos alunos.</p>
                </div>
                <Button onClick={() => { setGenStudentId(''); setIsGenerateOpen(true); }} className="shrink-0">
                    <BarChart2 className="w-5 h-5 mr-2" /> Gerar Novo Parecer
                </Button>
            </div>

            <Card className="glass-panel border-none shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-white/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="text" placeholder="Buscar aluno..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-brand-primary outline-none" />
                    </div>
                </div>
                <div className="divide-y divide-slate-100">
                    {isLoading ? (
                        <div className="p-8 text-center text-slate-500">Carregando alunos...</div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center text-slate-500">
                            <User className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                            Nenhum aluno encontrado.
                        </div>
                    ) : filtered.map(student => (
                        <button
                            key={student.id}
                            onClick={() => handleSelectStudent(student)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold">
                                    {student.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{student.name}</p>
                                    <p className="text-xs text-slate-500">{student.class?.name || 'Sem turma'} - {student.grade_level || 'Sem série'}</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400" />
                        </button>
                    ))}
                </div>
            </Card>

            {/* Generate Report Modal */}
            {renderGenerateModal()}
        </div>
    );
}
