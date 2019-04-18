const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const hackPath = `${root}/node_modules/@ngtools/webpack/src`;
const hackFileName = `${hackPath}/angular_compiler_plugin.js`;
const hackFileNameHacked = `${hackFileName}.hacked`;

const hack = () => {
    if (!fs.existsSync(hackFileNameHacked)) {
        const problemCode = fs.readFileSync(hackFileName).toString('utf-8').split('\n');
        for (let index in problemCode) {
            let line = problemCode[ index ];
            if (line.includes('removeDecorators')) {
                if (!line.startsWith('//')) {
                    line = '//' + line;
                    problemCode[ index ] = line;
                }
                break;
            }
        }

        const generatedHack = problemCode.join('\n');
        fs.writeFileSync(hackFileName, generatedHack);
        fs.writeFile(hackFileNameHacked, '@ngtool/webpack angular decorators remove', function (err) {
            if (err) {
                throw err;
            }
        });
    }
};

module.exports.hack = hack;