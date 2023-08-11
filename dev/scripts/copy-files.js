// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('node:fs');

const target = 'dist';
['package.json', 'README.md', 'LICENSE'].forEach((file) =>
  fs.copyFileSync(file, `${target}/${file}`)
);
