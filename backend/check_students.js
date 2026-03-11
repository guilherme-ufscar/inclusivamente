const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const students = await prisma.student.findMany({ select: { id: true, name: true } });
    console.log("=== IDs dos Alunos ===\n");
    students.forEach(s => console.log(`🧑 ${s.name} \n🔑 ID: ${s.id}\n`));
}
main().finally(() => prisma.$disconnect());
