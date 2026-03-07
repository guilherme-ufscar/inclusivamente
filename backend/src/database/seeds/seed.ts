import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding the database...');

    console.log('Clearing existing data...');
    // Delete in reverse order of dependencies
    await prisma.report.deleteMany();
    await prisma.activityLog.deleteMany();
    await prisma.anamnesisResponse.deleteMany();
    await prisma.anamnesisQuestion.deleteMany();
    await prisma.bnccCompetence.deleteMany();
    await prisma.anamnesisSphere.deleteMany();
    await prisma.student.deleteMany();
    await prisma.tutor.deleteMany();
    await prisma.user.deleteMany();
    await prisma.school.deleteMany();

    // 1. Create a Master School
    const masterSchool = await prisma.school.create({
        data: {
            name: 'Escola Inclusiva Modelo',
            email: 'contato@escolamodelo.com',
            phone: '11999999999',
            address: 'Rua da Inclusão, 123'
        }
    });

    // 2. Create Admin and Roles
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
        data: {
            name: 'Administrador Geral',
            email: 'admin@inclusivamente.com',
            password_hash: adminPassword,
            role: 'admin',
            school_id: masterSchool.id
        }
    });

    // 3. Create Tutors
    const tutor1 = await prisma.tutor.create({
        data: {
            name: 'Ana Professora (Tutor Autismo)',
            email: 'ana.tutor@escola.com',
            school_id: masterSchool.id,
            specialty: 'TEA'
        }
    });

    // 4. Create Anamnesis Spheres and Questions
    const cognitiveSphere = await prisma.anamnesisSphere.create({
        data: { name: 'Desenvolvimento Cognitivo', order_index: 1 }
    });

    await prisma.anamnesisQuestion.create({
        data: {
            sphere_id: cognitiveSphere.id,
            question_text: 'O aluno reconhece letras e sílabas simples?',
            question_type: 'single_choice',
            options_json: JSON.stringify(['Sim', 'Não', 'Parcialmente', 'Em desenvolvimento'])
        }
    });

    // 5. Create a Student
    const student = await prisma.student.create({
        data: {
            name: 'João Pedro',
            birth_date: new Date('2018-05-15'),
            school_id: masterSchool.id,
            grade_level: '1º Ano EF'
        }
    });

    // 6. Create BNCC Code
    const bncc1 = await prisma.bnccCompetence.create({
        data: {
            code: 'EF01LP05',
            title: 'Compreender o sistema de escrita alfabética',
            stage: 'Ensino Fundamental',
            subject: 'Língua Portuguesa'
        }
    });

    // 7. Seed Activities (To show Tutor motor)
    // 3 activities with tutor, high autonomy score on the last one to show 'sporadic' recommendation or low autonomy to show 'continuous'
    await prisma.activityLog.create({
        data: {
            student_id: student.id,
            activity_id: 'game-123',
            started_at: new Date(new Date().setDate(new Date().getDate() - 3)),
            completed_at: new Date(new Date().setDate(new Date().getDate() - 3)),
            has_tutor: true,
            tutor_id: tutor1.id,
            autonomy_level: 'low',
            tutor_intervention_needed: 'yes'
        }
    });

    await prisma.activityLog.create({
        data: {
            student_id: student.id,
            activity_id: 'game-124',
            started_at: new Date(new Date().setDate(new Date().getDate() - 2)),
            completed_at: new Date(new Date().setDate(new Date().getDate() - 2)),
            has_tutor: true,
            tutor_id: tutor1.id,
            autonomy_level: 'low',
            tutor_intervention_needed: 'yes'
        }
    });

    await prisma.activityLog.create({
        data: {
            student_id: student.id,
            activity_id: 'game-125',
            started_at: new Date(new Date().setDate(new Date().getDate() - 1)),
            completed_at: new Date(new Date().setDate(new Date().getDate() - 1)),
            has_tutor: true,
            tutor_id: tutor1.id,
            autonomy_level: 'low',
            tutor_intervention_needed: 'yes'
        }
    });

    // 8. Generate Report manually
    await prisma.report.create({
        data: {
            student_id: student.id,
            period_start: new Date(new Date().setDate(new Date().getDate() - 30)),
            period_end: new Date(),
            summary_text: 'O João Pedro completou 3 atividades. O aluno requer apoio contínuo. Notou-se alta dependência de tutor nas últimas atividades.',
            activities_with_tutor_count: 3,
            activities_without_tutor_count: 0,
            autonomy_percentage: 0,
            tutor_recommendation: 'continuous'
        }
    });

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
