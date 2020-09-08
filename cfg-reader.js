/**
 * @function cfgReader
 * @param {String} cfgFile file location of the config file to read
 * @returns {Object} The return object will be a set of KVP storing the config.  If there's no config file, 
 *  the object will store the shortened error info from the catch.
 */
const cfgReader = cfgFile => {
    const fs = require('fs');
    let cfgVals = {};
    let file = null;

    /**
     * For sake of performance, readFileSync will be the only call in the try/catch block.  Otherwise, this module won't
     * be able to benefit from V8's internal optimization.
     */ 
    try {
        file = fs.readFileSync(cfgFile,'utf-8');
    } catch (e) {
        cfgVals = {...e};
    }

    /**
     * If the file exists, split the file's contents by line break and walk the resulting array of strings by skipping over
     * comments('#'), empty lines, and any otherwise erroneous lines. As we parse the array, separate the key/value pair by splitting
     * on the equal sign('=') and storing the left-hand as the key and the right-hand side as the value inside cfgVals.
     */
    if (!!file) {
        file.split('\n').forEach(val => {
            val = val.replace(/\s*/g,'');
            if (val.length > 0 && val[0]!== '#') {
                const item = val.split('=');

                if (item.length > 1) {
                    const i = item[0];
                    let v = item[1];
                    //Check to see if the value is a number...
                    const f = parseFloat(v);

                    /**
                     * ...if it is, convert to a number, otherwise check and see if the value is on|off, yes|no, true|false, and convert 
                     * that to bool.  If it still fails those checks, then we know we're dealing with a string value.
                     */ 
                    cfgVals[i] = !isNaN(f) ? f : v.match(/(on|true|yes)/i) ? true : v.match(/(off|false|no)/i) ? false : v;
                }
            }
        });
    }

    return cfgVals;
};

module.exports = cfgReader;