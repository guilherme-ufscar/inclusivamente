import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding the database...');

    console.log('Clearing existing data...');
    // Delete in reverse order of dependencies
    await prisma.familyCheckin.deleteMany();
    await prisma.activityLog.deleteMany();
    await prisma.report.deleteMany();
    await prisma.anamnesisResponse.deleteMany();
    await prisma.cognitiveProfile.deleteMany();
    await prisma.activityBncc.deleteMany();
    await prisma.student.deleteMany();
    await prisma.tutor.deleteMany();
    await prisma.user.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.subject.deleteMany();
    await prisma.class.deleteMany();
    await prisma.school.deleteMany();
    await prisma.anamnesisQuestion.deleteMany();
    await prisma.anamnesisSphere.deleteMany();
    await prisma.bnccCompetence.deleteMany();
    await prisma.guardian.deleteMany();
    await prisma.kinshipType.deleteMany();

    // 1. Create a Master School
    console.log('Creating Master School...');
    const masterSchool = await prisma.school.create({
        data: {
            name: 'Escola Inclusiva Mente',
            email: 'contato@inclusivamenteeduca.com',
            phone: '11999999999',
            address: 'Brasil'
        }
    });

    // 2. Create Admin and Roles
    console.log('Creating Admin...');
    const adminPassword = await bcrypt.hash('Inclusivamente#2026', 10);
    const admin = await prisma.user.create({
        data: {
            name: 'Administrador Geral',
            email: 'admin@inclusivamenteeduca.com',
            password_hash: adminPassword,
            role: 'admin',
            school_id: masterSchool.id
        }
    });

    console.log('Seed completed successfully for production!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
