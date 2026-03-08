const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testGenerate(id) {
    try {
        const start = new Date(new Date().setMonth(new Date().getMonth() - 1));
        const end = new Date();

        const logs = await prisma.activityLog.findMany({
            where: {
                student_id: id,
                started_at: { gte: start, lte: end },
                completed_at: { not: null }
            }
        });

        console.log(`Found ${logs.length} logs for student ${id}`);

        const activities_with_tutor_count = logs.filter(l => l.has_tutor).length;
        const activities_without_tutor_count = logs.length - activities_with_tutor_count;

        let autonomyScore = 0;
        let autonomyEntries = 0;
        logs.forEach(l => {
            if (l.autonomy_level) {
                if (l.autonomy_level === 'high') autonomyScore += 100;
                if (l.autonomy_level === 'medium') autonomyScore += 50;
                if (l.autonomy_level === 'low') autonomyScore += 0;
                autonomyEntries++;
            }
        });

        const autonomy_percentage = autonomyEntries > 0 ? (autonomyScore / autonomyEntries) :
            (activities_without_tutor_count / (logs.length || 1)) * 100;

        let tutorLevel = 'sporadic';
        if (autonomy_percentage > 70) tutorLevel = 'not_needed';
        else if (autonomy_percentage < 30) tutorLevel = 'continuous';

        const count = logs.length;
        let text = `O aluno completou ${count} atividades no período. `;
        if (count > 0) {
            if (autonomy_percentage > 70) {
                text += 'Seu nível de autonomia é notavelmente alto na maioria das tarefas.';
            } else if (autonomy_percentage < 30) {
                text += 'Tem apresentado forte dependência nas dinâmicas e precisa de apoio tutorial consistente.';
            } else {
                text += 'Sua autonomia é mediana, precisando de breves intervenções pontuais do tutor.';
            }
        } else {
            text = 'Nenhuma atividade registrada no período.';
            tutorLevel = 'not_needed';
        }

        const report = await prisma.report.create({
            data: {
                student_id: id,
                period_start: start,
                period_end: end,
                summary_text: text,
                activities_with_tutor_count,
                activities_without_tutor_count,
                autonomy_percentage,
                tutor_recommendation: tutorLevel,
                generated_by: 'system_test'
            }
        });

        console.log('Report generated:', report);
    } catch (error) {
        console.error('Error generating report:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Get first student ID and test
prisma.student.findFirst().then(s => {
    if (s) testGenerate(s.id);
    else console.log('No students found');
});
