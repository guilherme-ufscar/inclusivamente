const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("=== STUDENTS ===");
    const students = await prisma.student.findMany({ select: { id: true, name: true, user_id: true } });
    students.forEach(s => console.log(`Name: ${s.name} | ID: ${s.id} | UserID: ${s.user_id}`));
}
main().finally(() => prisma.$disconnect());
