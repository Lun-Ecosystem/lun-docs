// Copies the standards each skill needs into plugin/skills/<skill>/references/, so the installed
// plugin carries them. standards/ stays the single source: copies are generated, never edited.
//   node tools/sync-standards.mjs          write the copies
//   node tools/sync-standards.mjs --check  exit 1 if any copy is missing or differs (CI)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const header = (source) => `<!-- Copie générée depuis ${source} : ne pas modifier ici -->\n`;

export function syncStandards(root, map, { check }) {
  const changed = [];
  for (const [skill, sources] of Object.entries(map)) {
    for (const source of sources) {
      const expected = header(source) + fs.readFileSync(path.join(root, source), 'utf8').replace(/\r\n/g, '\n');
      const target = path.join('plugin', 'skills', skill, 'references', path.basename(source));
      const full = path.join(root, target);
      const current = fs.existsSync(full) ? fs.readFileSync(full, 'utf8').replace(/\r\n/g, '\n') : null;
      if (current === expected) continue;
      changed.push(target.split(path.sep).join('/'));
      if (!check) {
        fs.mkdirSync(path.dirname(full), { recursive: true });
        fs.writeFileSync(full, expected);
      }
    }
  }
  return { changed };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const map = JSON.parse(fs.readFileSync(path.join(root, 'tools', 'standards-map.json'), 'utf8'));
  const check = process.argv.includes('--check');
  const { changed } = syncStandards(root, map, { check });
  if (check && changed.length) {
    for (const f of changed) console.error(`out of sync: ${f}`);
    console.error('run: npm run sync');
    process.exit(1);
  }
  console.log(check ? 'sync: OK' : `sync: ${changed.length} file(s) written`);
}
