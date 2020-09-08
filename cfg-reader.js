const fs = require('fs');
let cfgVals = {};
let file = null;

const cfgReader = cfgFile => {
    try {
        file = fs.readFileSync(cfgFile,'utf-8');
    } catch (e) {
        cfgVals = {...e};
    }

    if (!!file) {
        file.split('\n').forEach(val => {
            val = val.replace(/\s*/g,'');
            if (val.length > 0 && val[0]!== '#') {
                const item = val.split('=');

                if (item.length > 1) {
                    const i = item[0];
                    let v = item[1];
                    const f = parseFloat(v);

                    cfgVals[i] = !isNaN(f) ? f : v.match(/(on|true|yes)/i) ? true : v.match(/(off|false|no)/i) ? false : v;
                }
            }
        });
    }

    return cfgVals;
};

module.exports = cfgReader;