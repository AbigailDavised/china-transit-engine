import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('dist/cjs');
for (const file of fs.readdirSync(dir)) {
  if (file.endsWith('.js')) {
    const full = path.join(dir, file);
    const content = fs.readFileSync(full, 'utf8').replace(/require\("\.\/data\.js"\)/g, 'require("./data.cjs")');
    const target = path.join(dir, file.replace(/\.js$/, '.cjs'));
    fs.writeFileSync(target, content, 'utf8');
    fs.unlinkSync(full);
  }
}
