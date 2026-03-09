
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const student = await prisma.student.findFirst();
    const activity = { id: 'test-activity-id' }; // Just for testing the structure

    if (student) {
        console.log('Valid Student ID:', student.id);
    } else {
        console.log('No students found in DB');
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
