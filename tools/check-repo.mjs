// Repository checks for lun-docs. Each check returns a list of error messages (empty when OK).
// Run directly (`npm run check`) to run every check and exit 1 on any error.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REQUIRED_FILES = [
  'README.md',
  'vision.md',
  'standards/essentiel.md',
  'standards/workflow.md',
  'standards/git.md',
  'standards/environnements.md',
  'LICENSE',
  'docs/specs/2026-10-19-referentiel-design.md',
];

const SKIPPED_DIRS = new Set(['node_modules', '.git', '.superpowers']);
const TEXT_EXTENSIONS = new Set(['.md', '.mjs', '.js', '.json', '.yaml', '.yml', '.sh', '.txt', '']);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIPPED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

const rel = (root, file) => path.relative(root, file).split(path.sep).join('/');

export function checkRequiredFiles(root, required) {
  return required.filter((f) => !fs.existsSync(path.join(root, f))).map((f) => `missing: ${f}`);
}

/** `target` is a directory (every .md inside, recursively) or a single file. */
export function checkMaxLines(root, target, max) {
  const full = path.join(root, target);
  if (!fs.existsSync(full)) return [];
  const files = fs.statSync(full).isDirectory() ? walk(full).filter((f) => f.endsWith('.md')) : [full];
  const errors = [];
  for (const file of files) {
    const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const lines = text.endsWith('\n') ? text.split('\n').length - 1 : text.split('\n').length;
    if (lines > max) errors.push(`${rel(root, file)}: ${lines} lines (max ${max})`);
  }
  return errors;
}

const IPV4 = /(?<![\w.#])(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})(?![\w.])/g;
const TAILNET = /\b[\w-]+(?:\.[\w-]+)*\.ts\.net\b/g;

function isInternal(a, b) {
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // Tailscale CGNAT range
  return false;
}

export function checkNoInternalAddresses(root) {
  const errors = [];
  for (const file of walk(root)) {
    if (!TEXT_EXTENSIONS.has(path.extname(file))) continue;
    if (file.endsWith('.test.mjs')) continue; // fixtures contain addresses on purpose
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      if (line.includes('allow-address')) return; // documented example, reviewed by hand
      for (const m of line.matchAll(IPV4)) {
        const [a, b, c, d] = m.slice(1, 5).map(Number);
        if ([a, b, c, d].some((n) => n > 255)) continue;
        if (isInternal(a, b)) errors.push(`${rel(root, file)}:${i + 1}: internal address ${m[0]}`);
      }
      for (const m of line.matchAll(TAILNET)) {
        errors.push(`${rel(root, file)}:${i + 1}: tailnet host ${m[0]}`);
      }
    });
  }
  return errors;
}

export function runAll(root) {
  return [
    ...checkRequiredFiles(root, REQUIRED_FILES),
    ...checkMaxLines(root, 'standards', 150),
    ...checkNoInternalAddresses(root),
  ];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const errors = runAll(root);
  for (const e of errors) console.error(e);
  console.log(errors.length ? `${errors.length} error(s)` : 'check: OK');
  process.exit(errors.length ? 1 : 0);
}
