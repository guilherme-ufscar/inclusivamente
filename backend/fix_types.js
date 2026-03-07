const fs = require('fs');
const path = require('path');

const walkSync = function (dir, filelist) {
    var files = fs.readdirSync(dir);
    filelist = filelist || [];
    files.forEach(function (file) {
        if (fs.statSync(dir + '/' + file).isDirectory()) {
            filelist = walkSync(dir + '/' + file, filelist);
        }
        else if (file.endsWith('.ts')) {
            filelist.push(dir + '/' + file);
        }
    });
    return filelist;
};

const tsFiles = walkSync('./src/modules');

tsFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    content = content.replace(/req\.params;/g, 'req.params as any;');
    content = content.replace(/req\.query;/g, 'req.query as any;');

    fs.writeFileSync(file, content, 'utf8');
});
console.log('Fixed typescript typings in controllers.');
