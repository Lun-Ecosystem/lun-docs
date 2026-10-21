// Keeps a repo's copy of the design tokens identical to design/tokens.css (the only reference).
//   node tools/sync-tokens.mjs [--monde <name>] <file>          write the copy at <file>
//   node tools/sync-tokens.mjs --check [--monde <name>] <file>  exit 1 if the copy is missing or differs (CI)
// --monde keeps the common base and only the [data-monde='<name>'] block (others are dropped).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const header = "/* Copie générée depuis lun-docs/design/tokens.css : ne pas modifier ici */\n";

const lf = (text) => text.replace(/\r\n/g, '\n');

const worldBlock = /\/\* @monde (\w+) \*\/\n([\s\S]*?)\/\* @fin-monde \*\/\n?/g;

export function worlds(source) {
  return [...source.matchAll(worldBlock)].map((m) => m[1]);
}

export function filterMonde(source, monde) {
  return source.replace(worldBlock, (_, name, body) => (name === monde ? body : '')).replace(/\n{3,}/g, '\n\n');
}

export function syncTokens(root, target, { check, monde }) {
  let source = lf(fs.readFileSync(path.join(root, 'design', 'tokens.css'), 'utf8'));
  if (monde) {
    if (!worlds(source).includes(monde)) throw new Error(`unknown world: ${monde}`);
    source = filterMonde(source, monde);
  }
  const expected = header + source;
  const current = fs.existsSync(target) ? lf(fs.readFileSync(target, 'utf8')) : null;
  if (current === expected) return { changed: [] };
  if (!check) {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, expected);
  }
  return { changed: [target] };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const mi = args.indexOf('--monde');
  const monde = mi >= 0 ? args[mi + 1] : undefined;
  const target = args.filter((a, i) => !a.startsWith('--') && i !== mi + 1 || (mi < 0 && !a.startsWith('--')))[0];
  if (!target || (mi >= 0 && !monde)) {
    console.error('usage: node tools/sync-tokens.mjs [--check] [--monde <name>] <file>');
    process.exit(2);
  }
  let changed;
  try {
    ({ changed } = syncTokens(root, path.resolve(target), { check, monde }));
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
  if (check && changed.length) {
    for (const f of changed) console.error(`out of sync: ${f}`);
    console.error('run: node <lun-docs>/tools/sync-tokens.mjs [--monde <name>] <file>');
    process.exit(1);
  }
  console.log(check ? 'tokens: OK' : `tokens: ${changed.length} file(s) written`);
}
