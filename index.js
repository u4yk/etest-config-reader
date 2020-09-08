const cfg = require('./cfg-reader')(process.argv[2] || '');
console.log(cfg);