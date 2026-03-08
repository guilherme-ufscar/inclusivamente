const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const logs = await prisma.activityLog.findMany({
        select: {
            id: true,
            student_id: true,
            started_at: true,
            completed_at: true,
            student: { select: { name: true } }
        }
    });
    console.log(JSON.stringify(logs, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
