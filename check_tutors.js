const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tutors = await prisma.tutor.findMany({
        include: { user: true }
    });
    console.log('Tutors:', JSON.stringify(tutors, null, 2));

    const users = await prisma.user.findMany({
        where: { role: 'tutor' }
    });
    console.log('Tutor Users:', JSON.stringify(users, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
