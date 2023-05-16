const fs = require('fs');

const target = 'dist';
['package.json'].forEach(file => fs.copyFileSync(file, `${target}/${file}`));
