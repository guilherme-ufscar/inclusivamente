const { execSync } = require('child_process');
const fs = require('fs');
try {
    execSync('npx prisma validate', { encoding: 'utf-8' });
    console.log('SUCCESS');
} catch (e) {
    fs.writeFileSync('err.txt', e.stdout + '\n\n' + e.stderr + '\n\n' + e.message);
}
