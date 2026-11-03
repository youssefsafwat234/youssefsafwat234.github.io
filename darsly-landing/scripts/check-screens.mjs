// Fails the build if a screen code used in src/ has no public/screens/<code>.webp
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const files = [];
const walk = (d) => readdirSync(d).forEach((f) => { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : /\.(jsx?|mjs)$/.test(f) && files.push(p); });
walk('src');
const codes = new Set();
for (const f of files) for (const m of readFileSync(f, 'utf8').matchAll(/['"]((?:ST|L|A)\d+\.\d+)['"]/g)) codes.add(m[1]);
const missing = [...codes].filter((c) => !existsSync(`public/screens/${c}.webp`));
if (missing.length) { console.error('Missing screens:', missing.join(', ')); process.exit(1); }
console.log(`screens ok (${codes.size})`);
