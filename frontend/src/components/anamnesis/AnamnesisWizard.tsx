import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { CheckCircle2, Circle, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import api from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Sphere {
    id: string;
    name: string;
    order_index: number;
    Questions: Question[];
}

interface Question {
    id: string;
    question_text: string;
    question_type: string;
    options_json: string;
    is_required: boolean;
}

export default function AnamnesisWizard({ studentId, onComplete }: { studentId: string, onComplete?: () => void }) {
    const [spheres, setSpheres] = useState<Sphere[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [responses, setResponses] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchAnamnesisForm = async () => {
            try {
                const res = await api.get('/anamnesis/spheres');
                if (res.data.success) {
                    setSpheres(res.data.data);
                }
            } catch (err) {
                console.error('Failed to load anamnesis structure', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnamnesisForm();
    }, []);

    const handleResponseChange = (questionId: string, value: any) => {
        setResponses(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleNext = () => {
        if (currentStep < spheres.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            submitAnamnesis();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const submitAnamnesis = async () => {
        setIsSaving(true);
        try {
            const payload = Object.keys(responses).map(qId => ({
                question_id: qId,
                answer_json: JSON.stringify(responses[qId])
            }));

            // Assuming PUT array handles multiple inserts/updates based on our backend implementation
            await api.put(`/students/${studentId}/anamnesis/responses`, payload);

            // Also potentially trigger a profile recalculation
            await api.post(`/students/${studentId}/cognitive-profile/recalculate`);

            if (onComplete) onComplete();

        } catch (error) {
            console.error('Failed to save anamnesis', error);
            alert('Erro ao salvar anamnese');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-12 text-center text-slate-500 animate-pulse">Carregando formulário de anamnese...</div>;
    if (!spheres.length) return <div className="p-12 text-center text-slate-500">Nenhuma esfera de anamnese configurada.</div>;

    const currentSphere = spheres[currentStep];

    return (
        <div className="max-w-4xl mx-auto">

            {/* Stepper */}
            <div className="flex items-center justify-between mb-8 overflow-x-auto pb-4 custom-scrollbar">
                {spheres.map((sphere, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div key={sphere.id} className="flex flex-col items-center relative min-w-[120px] shrink-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors z-10 bg-white
                ${isCompleted ? 'border-brand-accent text-brand-accent' : isCurrent ? 'border-brand-primary text-brand-primary' : 'border-slate-200 text-slate-300'}`}>
                                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="font-semibold">{index + 1}</span>}
                            </div>
                            <span className={`mt-2 text-xs font-medium text-center px-2 ${isCurrent ? 'text-brand-primary' : 'text-slate-500'}`}>
                                {sphere.name}
                            </span>

                            {/* Connector Line */}
                            {index < spheres.length - 1 && (
                                <div className={`absolute top-5 left-1/2 w-full h-[2px] -z-0
                  ${isCompleted ? 'bg-brand-accent' : 'bg-slate-200'}`} />
                            )}
                        </div>
                    );
                })}
            </div>

            <Card className="glass-panel overflow-hidden border-none shadow-md">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                    <CardTitle className="text-xl text-slate-800">{currentSphere.name}</CardTitle>
                    <p className="text-sm text-slate-500 mt-1">Responda as perguntas relativas a esta fase cognitiva ou motora do aluno.</p>
                </CardHeader>

                <CardContent className="p-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="p-6 md:p-8 space-y-8"
                        >
                            {currentSphere.Questions?.length === 0 ? (
                                <p className="text-center text-slate-500 italic">Nenhuma pergunta cadastrada nesta esfera.</p>
                            ) : (
                                currentSphere.Questions.map((q) => {
                                    let options: string[] = [];
                                    try { options = JSON.parse(q.options_json || '[]'); } catch { /* ignore */ }

                                    return (
                                        <div key={q.id} className="space-y-3">
                                            <label className="text-base font-medium text-slate-800 block">
                                                {q.question_text} {q.is_required && <span className="text-red-500">*</span>}
                                            </label>

                                            {q.question_type === 'single_choice' && (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    {options.map((opt, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => handleResponseChange(q.id, opt)}
                                                            className={`flex items-center p-3 sm:px-4 rounded-xl border text-sm text-left transition-all ${responses[q.id] === opt
                                                                    ? 'border-brand-primary bg-brand-primary/5 ring-1 ring-brand-primary text-brand-primary font-medium'
                                                                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                                                                }`}
                                                        >
                                                            {responses[q.id] === opt ? (
                                                                <CheckCircle2 className="w-5 h-5 mr-3 shrink-0" />
                                                            ) : (
                                                                <Circle className="w-5 h-5 mr-3 shrink-0 text-slate-300" />
                                                            )}
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {q.question_type === 'text' && (
                                                <textarea
                                                    className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-brand-primary focus:border-transparent outline-none transition-shadow"
                                                    rows={3}
                                                    placeholder="Descreva detalhadamente..."
                                                    value={responses[q.id] || ''}
                                                    onChange={(e) => handleResponseChange(q.id, e.target.value)}
                                                />
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>

                <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={handlePrev}
                        disabled={currentStep === 0 || isSaving}
                        className="text-slate-600"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" /> Anterior
                    </Button>

                    <Button
                        onClick={handleNext}
                        isLoading={isSaving}
                        className="px-8"
                    >
                        {currentStep === spheres.length - 1 ? (
                            <><Save className="w-4 h-4 mr-2" /> Salvar Anamnese</>
                        ) : (
                            <>Próxima Etapa <ArrowRight className="w-4 h-4 ml-2" /></>
                        )}
                    </Button>
                </div>
            </Card>

        </div>
    );
}
