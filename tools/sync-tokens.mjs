// Keeps a repo's copy of the design tokens identical to design/tokens.css (the only reference).
//   node tools/sync-tokens.mjs <file>          write the copy at <file>
//   node tools/sync-tokens.mjs --check <file>  exit 1 if the copy is missing or differs (CI)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const header = "/* Copie générée depuis lun-docs/design/tokens.css : ne pas modifier ici */\n";

const lf = (text) => text.replace(/\r\n/g, '\n');

export function syncTokens(root, target, { check }) {
  const expected = header + lf(fs.readFileSync(path.join(root, 'design', 'tokens.css'), 'utf8'));
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
  const target = args.find((a) => a !== '--check');
  if (!target) {
    console.error('usage: node tools/sync-tokens.mjs [--check] <file>');
    process.exit(2);
  }
  const { changed } = syncTokens(root, path.resolve(target), { check });
  if (check && changed.length) {
    for (const f of changed) console.error(`out of sync: ${f}`);
    console.error('run: node <lun-docs>/tools/sync-tokens.mjs <file>');
    process.exit(1);
  }
  console.log(check ? 'tokens: OK' : `tokens: ${changed.length} file(s) written`);
}
