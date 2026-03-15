import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';

const DOMINIOS = [
    {
        nome: 'Comunicação e Linguagem',
        questoes: [
            'Demonstra intenção comunicativa (olhar, gesto, vocalização ou fala).',
            'Compreende quando alguém fala diretamente com ele(a).',
            'Responde ao próprio nome.',
            'Inicia comunicação espontaneamente.',
            'Mantém troca comunicativa (turnos).',
            'Usa palavras, gestos ou símbolos para pedir algo.',
            'Usa comunicação para recusar algo.',
            'Compreende instruções simples (1 passo).',
            'Compreende instruções com mais de um passo.',
            'Demonstra compreensão de rotinas escolares.',
            'Usa linguagem funcional no contexto escolar.',
            'Usa comunicação alternativa (figuras, olhar, tecnologia) de forma intencional.',
            'Expressa desconforto de forma compreensível.',
            'Expressa preferência.',
            'Mantém atenção à fala do outro por alguns segundos.',
            'Usa comunicação para interação social (não apenas para pedir).',
            'Demonstra compreensão de tom emocional da fala.',
            'Generaliza comunicação aprendida para outros contextos.',
            'Necessita mediação constante para se comunicar.',
            'Comunicação permite participação em atividades escolares.',
        ],
    },
    {
        nome: 'Cognição e Aprendizagem Funcional',
        questoes: [
            'Demonstra curiosidade pelo ambiente.',
            'Mantém atenção na atividade proposta.',
            'Reconhece objetos familiares.',
            'Reconhece pessoas familiares.',
            'Aprende por repetição estruturada.',
            'Generaliza aprendizagem para outro contexto.',
            'Reconhece símbolos funcionais (figuras, palavras, sinais).',
            'Demonstra memória funcional.',
            'Participa de atividades pedagógicas adaptadas.',
            'Reconhece quantidades básicas.',
            'Reconhece letras ou palavras funcionais.',
            'Demonstra compreensão de causa e efeito.',
            'Mantém-se na atividade até o final.',
            'Necessita constante redirecionamento.',
            'Aprende melhor com apoio visual.',
            'Aprende melhor com mediação direta do adulto.',
            'Responde a estímulos sensoriais organizados.',
            'Demonstra progresso quando há rotina previsível.',
            'Objetivos acadêmicos formais são funcionais para ele(a).',
            'Participa do processo educativo de forma significativa.',
        ],
    },
    {
        nome: 'Funções Executivas',
        questoes: [
            'Inicia atividades sem ajuda.',
            'Mantém atenção sustentada.',
            'Planeja ações simples.',
            'Organiza materiais escolares.',
            'Segue sequência de tarefas.',
            'Inibe impulsos motores (apresenta agitação motora constante ou regular).',
            'Tolera frustração.',
            'Aceita mudança de rotina.',
            'Regula comportamento diante de desafio.',
            'Necessita apoio constante para iniciar tarefas.',
            'Demonstra flexibilidade cognitiva.',
            'Consegue esperar sua vez.',
            'Retoma atividade após pausa.',
            'Demonstra autorregulação com apoio visual.',
            'Demonstra autorregulação sem apoio externo.',
        ],
    },
    {
        nome: 'Comportamento, Interação Social e Emocional',
        questoes: [
            'Demonstra interesse por outras pessoas.',
            'Interage com adultos.',
            'Interage com pares.',
            'Busca ajuda quando necessário.',
            'Demonstra comportamento de "evitação" (isolamento, afastamento, resposta impulsiva ao toque).',
            'Apresenta estereotipias motoras (ex: flapping de mãos).',
            'Estereotipias interferem na aprendizagem.',
            'Demonstra ansiedade frente a demandas.',
            'Demonstra comportamentos disruptivos.',
            'Compreende regras sociais básicas.',
            'Aceita mediação emocional.',
            'Demonstra sinais claros de bem-estar.',
            'Demonstra sinais claros de desconforto.',
            'Participa de atividades em grupo.',
            'Prefere interação individual.',
            'Reage positivamente ao reforço.',
            'Demonstra vínculo com adulto de referência.',
            'Demonstra vínculo com colegas.',
            'Necessita apoio constante para regulação emocional.',
            'Consegue se acalmar com estratégias estruturadas.',
        ],
    },
    {
        nome: 'Motricidade e Autonomia Funcional',
        questoes: [
            'Controle postural adequado.',
            'Mobilidade independente.',
            'Mobilidade com auxílio.',
            'Uso funcional de membros superiores.',
            'Coordenação motora fina funcional.',
            'Consegue manusear materiais escolares.',
            'Necessita ajuda total para locomoção.',
            'Necessita ajuda total para posicionamento.',
            'Alimenta-se de forma independente na escola.',
            'Alimenta-se com ajuda parcial.',
            'Alimenta-se com ajuda total.',
            'Realiza higiene com independência.',
            'Realiza higiene com ajuda.',
            'Demonstra consciência corporal.',
            'Participa fisicamente das atividades.',
            'Responde a estímulos táteis.',
            'Responde a estímulos auditivos.',
            'Responde a estímulos visuais.',
            'Demonstra conforto postural durante atividades.',
            'Demonstra sinais de dor ou desconforto físico.',
            'Necessita acompanhamento 1:1 contínuo.',
            'Permanece em ambiente escolar com segurança.',
            'Participa das rotinas escolares.',
            'Demonstra progressos funcionais ao longo do tempo.',
            'Necessidades físicas impactam diretamente a aprendizagem.',
        ],
    },
];

const DEF_VISUAL_BARREIRAS = [
    'Tamanho inadequado de fonte',
    'Contraste insuficiente',
    'Excesso de elementos visuais',
    'Ícones pouco claros',
    'Dificuldade na leitura de imagens ou gráficos',
];

const ESCALA = [
    { value: 0, label: '0 – Não realiza / totalmente dependente' },
    { value: 1, label: '1 – Realiza apenas com ajuda total e constante' },
    { value: 2, label: '2 – Realiza com ajuda parcial / modelagem frequente' },
    { value: 3, label: '3 – Realiza com pouca ajuda / lembretes ocasionais' },
    { value: 4, label: '4 – Realiza de forma independente e consistente' },
];

const PERFIL_LABELS: Record<number, { label: string; color: string; desc: string }> = {
    1: { label: 'Perfil 1 – TEA Nível 2', color: 'text-purple-700 bg-purple-100', desc: 'Apoio substancial + adaptação curricular + mediação contínua' },
    2: { label: 'Perfil 2 – DI Leve + TEA', color: 'text-blue-700 bg-blue-100', desc: 'Apoio pedagógico estruturado + currículo funcional + reforço emocional' },
    3: { label: 'Perfil 3 – DI Severa + Motora', color: 'text-red-700 bg-red-100', desc: 'Apoio muito substancial 1:1 + foco em comunicação, conforto e inclusão afetiva' },
    4: { label: 'Perfil 4 – Baixa Complexidade', color: 'text-green-700 bg-green-100', desc: 'Estratégias pedagógicas universais, sem necessidade de apoio especializado contínuo' },
    5: { label: 'Perfil 5 – Deficiência Visual', color: 'text-amber-700 bg-amber-100', desc: 'Acessibilidade visual + recursos de ampliação e contraste + autonomia digital monitorada' },
};

const DEF_VISUAL_TAB = 5;
const STORAGE_KEY = (id: string) => `sondagem_draft_${id}`;

export default function Sondagem() {
    const { studentId } = useParams<{ studentId: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // Determina URL de volta com base na rota atual
    const backUrl = location.pathname.startsWith('/admin')
        ? '/admin/sondagem'
        : '/school/sondagem';

    const [dominioAtual, setDominioAtual] = useState(0);
    const [scores, setScores] = useState<(number | null)[]>(Array(100).fill(null));
    const [defVisual, setDefVisual] = useState<boolean | null>(null);
    const [dvAutonomia, setDvAutonomia] = useState('');
    const [dvBarreiras, setDvBarreiras] = useState<string[]>([]);
    const [dvAcessoVisual, setDvAcessoVisual] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [resultado, setResultado] = useState<{ score: number; perfil: number; persona: number; deficiencia_visual: boolean } | null>(null);
    const [erro, setErro] = useState('');
    const [salvando, setSalvando] = useState(false);

    // ── Carregar rascunho do localStorage ao montar ──────────────────────────
    useEffect(() => {
        if (!studentId) return;
        try {
            const raw = localStorage.getItem(STORAGE_KEY(studentId));
            if (raw) {
                const draft = JSON.parse(raw);
                if (draft.scores) setScores(draft.scores);
                if (draft.defVisual !== undefined) setDefVisual(draft.defVisual);
                if (draft.dvAutonomia) setDvAutonomia(draft.dvAutonomia);
                if (draft.dvBarreiras) setDvBarreiras(draft.dvBarreiras);
                if (draft.dvAcessoVisual) setDvAcessoVisual(draft.dvAcessoVisual);
                if (draft.dominioAtual !== undefined) setDominioAtual(draft.dominioAtual);
            }
        } catch {}
    }, [studentId]);

    // ── Auto-salvar no localStorage a cada mudança ───────────────────────────
    useEffect(() => {
        if (!studentId) return;
        const draft = { scores, defVisual, dvAutonomia, dvBarreiras, dvAcessoVisual, dominioAtual };
        localStorage.setItem(STORAGE_KEY(studentId), JSON.stringify(draft));
        // Feedback visual de "salvo"
        setSalvando(true);
        const t = setTimeout(() => setSalvando(false), 800);
        return () => clearTimeout(t);
    }, [scores, defVisual, dvAutonomia, dvBarreiras, dvAcessoVisual, dominioAtual]);

    const offsetDominio = DOMINIOS.slice(0, dominioAtual).reduce((acc, d) => acc + d.questoes.length, 0);
    const questoesDominio = dominioAtual < DOMINIOS.length ? DOMINIOS[dominioAtual].questoes : [];

    const setScore = (globalIndex: number, value: number) => {
        setScores(prev => {
            const next = [...prev];
            next[globalIndex] = value;
            return next;
        });
    };

    const dominioCompleto = dominioAtual < DOMINIOS.length
        ? questoesDominio.every((_, i) => scores[offsetDominio + i] !== null)
        : defVisual !== null;

    const totalRespondidas = scores.filter(s => s !== null).length;
    const progresso = Math.round((totalRespondidas / 100) * 100);

    const toggleBarreira = (b: string) => {
        setDvBarreiras(prev => prev.includes(b) ? prev.filter(x => x !== b) : [...prev, b]);
    };

    const handleEnviar = async () => {
        if (scores.some(s => s === null)) {
            setErro('Responda todas as 100 questões antes de enviar.');
            return;
        }
        if (defVisual === null) {
            setErro('Responda a etapa de Deficiência Visual antes de enviar.');
            return;
        }
        setEnviando(true);
        setErro('');
        try {
            const res = await api.post(`/students/${studentId}/sondagem`, {
                scores,
                deficiencia_visual: defVisual,
            });
            // Limpar rascunho após envio bem-sucedido
            if (studentId) localStorage.removeItem(STORAGE_KEY(studentId));
            setResultado(res.data.data);
        } catch {
            setErro('Erro ao enviar sondagem. Tente novamente.');
        } finally {
            setEnviando(false);
        }
    };

    if (resultado) {
        const p = PERFIL_LABELS[resultado.perfil];
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-8 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Sondagem concluída!</h2>
                    <p className="text-gray-500 mb-2">Pontuação total: <span className="font-bold text-gray-800">{resultado.score} / 400</span></p>
                    {resultado.deficiencia_visual && (
                        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-1 inline-block mb-4">
                            Deficiência Visual identificada — perfil determinado por diagnóstico
                        </p>
                    )}
                    <div className={`inline-block px-4 py-2 rounded-full font-semibold text-sm mb-3 ${p.color}`}>
                        {p.label}
                    </div>
                    <p className="text-gray-600 text-sm mb-8">{p.desc}</p>
                    <button
                        onClick={() => navigate(backUrl)}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium"
                    >
                        Voltar para Sondagem
                    </button>
                </div>
            </div>
        );
    }

    const todosOsDominiosConcluidos = DOMINIOS.every((d, i) => {
        const off = DOMINIOS.slice(0, i).reduce((acc, x) => acc + x.questoes.length, 0);
        return d.questoes.every((_, j) => scores[off + j] !== null);
    });

    const hasDraft = scores.some(s => s !== null);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(backUrl)}
                        className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        ←
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">Sondagem de Perfil Educacional</h1>
                        <p className="text-xs text-gray-500">Instrumento de Avaliação Educacional Funcional</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {hasDraft && (
                        <span className={`text-xs transition-colors ${salvando ? 'text-amber-500' : 'text-green-600'}`}>
                            {salvando ? '💾 Salvando...' : '✓ Rascunho salvo'}
                        </span>
                    )}
                    <div className="text-right">
                        <p className="text-sm text-gray-500">{totalRespondidas} / 100 respondidas</p>
                        <div className="w-40 bg-gray-200 rounded-full h-2 mt-1">
                            <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${progresso}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto p-6">
                {/* Tabs dos domínios + Deficiência Visual */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    {DOMINIOS.map((d, i) => {
                        const off = DOMINIOS.slice(0, i).reduce((acc, x) => acc + x.questoes.length, 0);
                        const completo = d.questoes.every((_, j) => scores[off + j] !== null);
                        return (
                            <button
                                key={i}
                                onClick={() => setDominioAtual(i)}
                                className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                    dominioAtual === i
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : completo
                                        ? 'bg-green-50 text-green-700 border-green-300'
                                        : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
                                }`}
                            >
                                {completo && dominioAtual !== i ? '✓ ' : ''}{d.nome}
                            </button>
                        );
                    })}
                    <button
                        onClick={() => setDominioAtual(DEF_VISUAL_TAB)}
                        className={`whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                            dominioAtual === DEF_VISUAL_TAB
                                ? 'bg-amber-500 text-white border-amber-500'
                                : defVisual !== null
                                ? 'bg-green-50 text-green-700 border-green-300'
                                : 'bg-white text-amber-600 border-amber-200 hover:border-amber-400'
                        }`}
                    >
                        {defVisual !== null && dominioAtual !== DEF_VISUAL_TAB ? '✓ ' : ''}👁 Deficiência Visual
                    </button>
                </div>

                {/* Escala de referência */}
                {dominioAtual < DOMINIOS.length && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-6">
                        <p className="text-xs font-semibold text-indigo-700 mb-2 uppercase tracking-wide">Escala de Respostas</p>
                        <div className="flex flex-wrap gap-3">
                            {ESCALA.map(e => (
                                <span key={e.value} className="text-xs text-indigo-600">
                                    <strong>{e.value}</strong> – {e.label.split('–')[1].trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Etapa de Deficiência Visual ── */}
                {dominioAtual === DEF_VISUAL_TAB && (
                    <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
                        <div>
                            <h2 className="text-base font-bold text-gray-800 mb-1">Perfil 5 – Deficiência Visual</h2>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Este perfil é atribuído diretamente quando há diagnóstico de baixa visão, visão subnormal ou dificuldades visuais,
                                independentemente da pontuação obtida nas demais etapas.
                            </p>
                        </div>
                        <div className="border rounded-xl p-4 bg-amber-50 border-amber-200">
                            <p className="text-sm font-semibold text-amber-800 mb-3">
                                O aluno possui diagnóstico de baixa visão, visão subnormal ou dificuldades visuais significativas?
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDefVisual(true)}
                                    className={`px-5 py-2 rounded-lg border-2 text-sm font-semibold transition-colors ${defVisual === true ? 'bg-amber-500 border-amber-500 text-white' : 'border-gray-200 text-gray-600 hover:border-amber-400'}`}
                                >
                                    Sim
                                </button>
                                <button
                                    onClick={() => setDefVisual(false)}
                                    className={`px-5 py-2 rounded-lg border-2 text-sm font-semibold transition-colors ${defVisual === false ? 'bg-gray-600 border-gray-600 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}
                                >
                                    Não
                                </button>
                            </div>
                        </div>
                        {defVisual === true && (
                            <div className="space-y-5">
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Nível de autonomia digital observado</p>
                                    <div className="flex flex-col gap-2">
                                        {['Autonomia plena', 'Autonomia parcial', 'Necessita mediação'].map(op => (
                                            <label key={op} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${dvAutonomia === op ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}>
                                                <input type="radio" name="dvAutonomia" value={op} checked={dvAutonomia === op} onChange={() => setDvAutonomia(op)} className="text-amber-500" />
                                                <span className="text-sm text-gray-700">{op}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Barreiras de acessibilidade identificadas (opcional)</p>
                                    <div className="grid grid-cols-1 gap-2">
                                        {DEF_VISUAL_BARREIRAS.map(b => (
                                            <label key={b} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${dvBarreiras.includes(b) ? 'border-amber-400 bg-amber-50' : 'border-gray-200 hover:border-amber-300'}`}>
                                                <input type="checkbox" checked={dvBarreiras.includes(b)} onChange={() => toggleBarreira(b)} className="text-amber-500 rounded" />
                                                <span className="text-sm text-gray-700">{b}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Observações sobre acesso visual ao conteúdo (opcional)</p>
                                    <textarea
                                        rows={3}
                                        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
                                        placeholder="Ex: precisa de zoom, prefere fundo escuro com texto claro..."
                                        value={dvAcessoVisual}
                                        onChange={e => setDvAcessoVisual(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                        {defVisual === false && (
                            <p className="text-sm text-gray-500 bg-gray-50 rounded-xl p-4 border">
                                Nenhum indicativo de deficiência visual. O perfil será determinado pela pontuação da sondagem.
                            </p>
                        )}
                    </div>
                )}

                {/* ── Questões do domínio atual ── */}
                {dominioAtual < DOMINIOS.length && (
                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-base font-bold text-gray-800 mb-5 pb-3 border-b">
                            {DOMINIOS[dominioAtual].nome}
                            <span className="ml-2 text-xs text-gray-400 font-normal">({questoesDominio.length} questões)</span>
                        </h2>
                        <div className="space-y-6">
                            {questoesDominio.map((q, i) => {
                                const gi = offsetDominio + i;
                                return (
                                    <div key={gi} className="border-b pb-5 last:border-0 last:pb-0">
                                        <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                                            <span className="font-semibold text-gray-400 mr-2">{gi + 1}.</span>{q}
                                        </p>
                                        <div className="flex gap-2 flex-wrap">
                                            {[0, 1, 2, 3, 4].map(v => (
                                                <button
                                                    key={v}
                                                    onClick={() => setScore(gi, v)}
                                                    className={`w-10 h-10 rounded-lg border-2 font-bold text-sm transition-colors ${
                                                        scores[gi] === v
                                                            ? 'bg-indigo-600 border-indigo-600 text-white'
                                                            : 'border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
                                                    }`}
                                                >
                                                    {v}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Navegação */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => setDominioAtual(p => Math.max(0, p - 1))}
                        disabled={dominioAtual === 0}
                        className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40"
                    >
                        ← Anterior
                    </button>

                    {dominioAtual < DEF_VISUAL_TAB ? (
                        <button
                            onClick={() => setDominioAtual(p => p + 1)}
                            disabled={!dominioCompleto}
                            className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-40"
                        >
                            Próximo →
                        </button>
                    ) : (
                        <button
                            onClick={handleEnviar}
                            disabled={enviando || scores.some(s => s === null) || defVisual === null}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50"
                        >
                            {enviando ? 'Enviando...' : 'Finalizar Sondagem'}
                        </button>
                    )}
                </div>

                {!todosOsDominiosConcluidos && dominioAtual === DEF_VISUAL_TAB && (
                    <p className="text-amber-600 text-xs mt-2 text-center">Atenção: ainda há questões não respondidas nos domínios anteriores.</p>
                )}

                {erro && <p className="text-red-600 text-sm mt-3 text-center">{erro}</p>}
            </div>
        </div>
    );
}
