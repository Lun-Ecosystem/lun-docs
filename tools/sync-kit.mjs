// Keeps a repo's copy of the front kit identical to design/kit/ (the only reference).
//   node tools/sync-kit.mjs <dir>          write the copy into <dir>
//   node tools/sync-kit.mjs --check <dir>  exit 1 if a file is missing, differs or is not in the kit (CI)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const HEADER = 'Copie générée depuis lun-docs/design/kit : ne pas modifier ici';

const lf = (text) => text.replace(/\r\n/g, '\n');

function withHeader(file, text) {
  if (file.endsWith('.svelte')) return `<!-- ${HEADER} -->\n${text}`;
  if (file.endsWith('.css')) return `/* ${HEADER} */\n${text}`;
  return `// ${HEADER}\n${text}`;
}

function list(dir, base = dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? list(full, base) : [path.relative(base, full)];
  });
}

export function syncKit(root, target, { check }) {
  const source = path.join(root, 'design', 'kit');
  const files = list(source);
  const changed = [];
  for (const rel of files) {
    const expected = withHeader(rel, lf(fs.readFileSync(path.join(source, rel), 'utf8')));
    const dest = path.join(target, rel);
    const current = fs.existsSync(dest) ? lf(fs.readFileSync(dest, 'utf8')) : null;
    if (current === expected) continue;
    changed.push(dest);
    if (!check) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, expected);
    }
  }
  const known = new Set(files);
  for (const rel of list(target)) if (!known.has(rel)) changed.push(path.join(target, rel));
  return { changed };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const args = process.argv.slice(2);
  const check = args.includes('--check');
  const target = args.find((a) => !a.startsWith('--'));
  if (!target) {
    console.error('usage: node tools/sync-kit.mjs [--check] <dir>');
    process.exit(2);
  }
  const { changed } = syncKit(root, path.resolve(target), { check });
  if (check && changed.length) {
    for (const f of changed) console.error(`out of sync: ${f}`);
    console.error('run: node <lun-docs>/tools/sync-kit.mjs <dir>');
    process.exit(1);
  }
  console.log(check ? 'kit: OK' : `kit: ${changed.length} file(s) written or extra`);
}
