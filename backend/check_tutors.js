const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const tutors = await prisma.tutor.findMany({
        include: { user: true, Students: true }
    });
    console.log('--- TUTOR PROFILES ---');
    tutors.forEach(t => {
        console.log(`Tutor: ${t.name} (${t.email})`);
        console.log(`  Linked User ID: ${t.user_id}`);
        console.log(`  Linked Students: ${t.Students.map(s => s.name).join(', ')}`);
        console.log('---');
    });

    const users = await prisma.user.findMany({
        where: { role: 'tutor' }
    });
    console.log('--- TUTOR USERS (LOGIN ACCOUNTS) ---');
    users.forEach(u => {
        console.log(`User: ${u.name} (${u.email}) - ID: ${u.id}`);
    });
}

main().catch(console.error).finally(() => prisma.$disconnect());
