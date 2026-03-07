const { execSync } = require('child_process');
try {
    const result = execSync('npx prisma validate', { encoding: 'utf-8' });
    console.log('SUCCESS:', result);
} catch (e) {
    console.log('ERROR:', e.stderr || e.stdout || e.message);
}
