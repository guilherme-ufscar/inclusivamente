import { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import api from '../../services/api';
import { MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface Checkin {
    id: string;
    student_id: string;
    student?: { name: string };
    channel: string;
    status: string;
    sent_at: string;
}

export default function CheckinsPage() {
    const [checkins, setCheckins] = useState<Checkin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);

    const fetchData = async () => {
        try {
            const res = await api.get('/students'); // Fetching students to simulate check-in list
            // For demo, we'll map students to checkins
            const demoCheckins = res.data.data.map((s: any) => ({
                id: s.id,
                student_id: s.id,
                student: { name: s.name },
                channel: 'WhatsApp',
                status: 'pending',
                sent_at: '-'
            }));
            setCheckins(demoCheckins);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSendAll = async () => {
        setIsSending(true);
        try {
            await api.post('/checkins/send', {
                student_ids: checkins.map(c => c.id),
                channel: 'whatsapp'
            });
            alert('Check-ins "Troca 360" disparados com sucesso via WhatsApp!');
            setCheckins(prev => prev.map(c => ({ ...c, status: 'sent', sent_at: new Date().toLocaleString() })));
        } catch (err) {
            alert('Erro ao disparar mensagens.');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 tracking-tight">Troca 360 Graus</h1>
                    <p className="text-slate-500 mt-1">Check-in semanal automático com as famílias via WhatsApp.</p>
                </div>
                <Button onClick={handleSendAll} disabled={isSending || checkins.length === 0}>
                    {isSending ? 'Enviando...' : (
                        <>
                            <Send className="w-5 h-5 mr-2" />
                            Disparar Ciclo Semanal
                        </>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? <p>Carregando...</p> : checkins.map((c) => (
                    <Card key={c.id} className="glass-panel border-none shadow-sm overflow-hidden">
                        <div className={`h-2 ${c.status === 'sent' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-brand-primary/10 rounded-xl text-brand-primary">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                {c.status === 'sent' ? (
                                    <span className="flex items-center text-xs font-bold text-emerald-600 uppercase">
                                        <CheckCircle2 className="w-4 h-4 mr-1" /> Enviado
                                    </span>
                                ) : (
                                    <span className="flex items-center text-xs font-bold text-amber-600 uppercase">
                                        <AlertCircle className="w-4 h-4 mr-1" /> Pendente
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-slate-900">{c.student?.name}</h3>
                            <p className="text-xs text-slate-500 mt-1">Responsável aguarda atualização.</p>

                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-400">Canal:</span>
                                    <span className="font-medium text-slate-700">{c.channel}</span>
                                </div>
                                <div className="flex justify-between text-xs mt-2">
                                    <span className="text-slate-400">Último Envio:</span>
                                    <span className="font-medium text-slate-700">{c.sent_at}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
