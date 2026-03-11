const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const logs = await prisma.activityLog.findMany({
        orderBy: { created_at: 'desc' },
        take: 3
    });
    console.log(logs.map(l => ({
        id: l.id,
        started_at: l.started_at,
        completed_at: l.completed_at,
        time_spent: l.time_spent
    })));
}

main().finally(() => prisma.$disconnect());
