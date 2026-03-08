import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function run() {
    const log = await prisma.activityLog.findFirst();
    if (log) {
        console.log("ID_LOG:" + log.id);
    } else {
        console.log("Nenhum log encontrado. Execute o seed primeiro.");
    }
}
run().finally(() => prisma.$disconnect());
