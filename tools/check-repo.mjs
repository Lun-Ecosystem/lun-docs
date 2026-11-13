// Repository checks for lun-docs. Each check returns a list of error messages (empty when OK).
// Run directly (`npm run check`) to run every check and exit 1 on any error.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { checkRegistry, checkAdrs, parseProjects } from './check-registry.mjs';
import { checkVersions } from './check-version.mjs';

export const REQUIRED_FILES = [
  'README.md',
  'vision.md',
  'standards/essentiel.md',
  'standards/workflow.md',
  'standards/git.md',
  'standards/environnements.md',
  'standards/structure-projet.md',
  'standards/qualite.md',
  'standards/securite.md',
  'standards/stack.md',
  'standards/contrat-satellite.md',
  'standards/design.md',
  'adr/README.md',
  'adr/0001-referentiel-et-methode.md',
  'registry.yaml',
  'community-skills.md',
  'templates/project/README.md',
  'templates/project/CLAUDE.md',
  'templates/project/.claude/settings.json',
  'templates/project/.github/pull_request_template.md',
  '.github/pull_request_template.md',
  'templates/project/hooks/pre-push',
  'LICENSE',
  'docs/specs/2026-10-19-referentiel-design.md',
];

const SKIPPED_DIRS = new Set(['node_modules', '.git', '.superpowers']);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIPPED_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

/** Files git would track (tracked + untracked not ignored); a plain walk outside a git repo. */
function listFiles(root) {
  try {
    const out = execFileSync('git', ['-C', root, 'ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return out.split('\0').filter(Boolean).map((f) => path.join(root, f)).filter((f) => fs.existsSync(f));
  } catch {
    return walk(root);
  }
}

const rel = (root, file) => path.relative(root, file).split(path.sep).join('/');

export function checkRequiredFiles(root, required) {
  return required.filter((f) => !fs.existsSync(path.join(root, f))).map((f) => `missing: ${f}`);
}

/** Two files that must stay the same, line endings aside: a copy kept by hand, with no generator. */
export function checkSameFile(root, a, b) {
  const read = (f) => fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n');
  if (!fs.existsSync(path.join(root, a)) || !fs.existsSync(path.join(root, b))) return [];
  return read(a) === read(b) ? [] : [`${a} differs from ${b}: copy one onto the other`];
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
// Home network names; .local and .internal stay out: fixtures and plans use them as example domains.
const HOME_NAME = /\b[\w-]+(?:\.[\w-]+)*\.(?:lan|home\.arpa)\b/g;
// IPv6 unique local (fd00::/8): fd, two hex digits, then at least two more groups. allow-address
const ULA = /(?<![\w:])fd[0-9a-f]{2}(?::[0-9a-f]{0,4}){2,}(?![\w:])/gi;
const TEST_FILE = /\.(?:test|spec)\.[^./\\]+$/;

function isInternal(a, b) {
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // Tailscale CGNAT range
  return false;
}

export function checkNoInternalAddresses(root) {
  const errors = [];
  for (const file of listFiles(root)) {
    if (TEST_FILE.test(file)) continue; // fixtures contain addresses on purpose
    const text = fs.readFileSync(file, 'utf8');
    if (text.includes('\0')) continue; // binary file
    const lines = text.split(/\r?\n/);
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
      for (const m of line.matchAll(HOME_NAME)) errors.push(`${rel(root, file)}:${i + 1}: home network name ${m[0]}`);
      for (const m of line.matchAll(ULA)) errors.push(`${rel(root, file)}:${i + 1}: IPv6 unique local ${m[0]}`);
    });
  }
  return errors;
}

const HERE = path.dirname(fileURLToPath(import.meta.url));
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** The names of the private repositories, read in the registry next to this script. */
function privateNames() {
  const { projects } = parseProjects(fs.readFileSync(path.join(HERE, '..', 'registry.yaml'), 'utf8'));
  return projects.filter((p) => p.visibilite === 'prive' && p.depot).map((p) => p.depot.split('/').pop());
}

// A GitHub link leaves the line before the search, unless it points into the files (blob/, tree/).
const GITHUB_LINK = /(?:https?:\/\/)?github\.com\/[\w.-]+\/[\w.-]+(?![\w.-]|\/(?:blob|tree)\/)(?:\/[^\s)\]>"'`]*)?/g;
// In lun-docs only: the source folders of the core, written without its name.
const CORE_FOLDERS = /(?<![\w.-])(?:core|ui)[\\/]src\b[\w.@\\/-]*/g;
// Dated plans and specs up to the cut-off are history; the living ones stay checked.
const DATED = /^docs\/(?:plans|specs)\/(\d{4}-\d{2}-\d{2})-/;
const CUT_OFF = '2026-11-12';
const LIVING = new Set(['docs/plans/2026-11-07-feuille-de-route-mvp.md', 'docs/specs/2026-11-10-etat-cible-cadrage.md']);
const HISTORY = new Set(['docs/mise-en-service-desktop.md', 'docs/plans/2026-11-08-bascule-nas.md']);

function isHistory(file) {
  if (LIVING.has(file)) return false;
  const date = file.match(DATED)?.[1];
  return HISTORY.has(file) || (date !== undefined && date <= CUT_OFF);
}

/** A path inside a private repository, written in this one. `docs`: the rules of lun-docs itself. */
export function checkNoPrivateNames(root, { docs = false } = {}) {
  const names = privateNames().map(escape).join('|');
  const patterns = [
    new RegExp(String.raw`(?<![\w@-])(?:${names})[\\/][\w.@\\/-]+`, 'g'),
    new RegExp(String.raw`@(?:${names})/[\w.-]*`, 'g'), // a package of a private repository
  ];
  if (docs) patterns.push(CORE_FOLDERS);
  const errors = [];
  for (const file of listFiles(root)) {
    const name = rel(root, file);
    if (TEST_FILE.test(file) || (docs && isHistory(name))) continue;
    const text = fs.readFileSync(file, 'utf8');
    if (text.includes('\0')) continue; // binary file
    text.split(/\r?\n/).forEach((line, i) => {
      if (line.includes('allow-private')) return; // documented example, reviewed by hand
      const bare = line.replace(GITHUB_LINK, '');
      for (const re of patterns) {
        for (const m of bare.matchAll(re)) errors.push(`${name}:${i + 1}: inside a private repository: ${m[0]}`);
      }
    });
  }
  return errors;
}

const SOUND = /\.(?:wav|flac|mp3|ogg|oga|opus|m4a|aac|aiff?|wma)$/i;
const MODEL = /\.(?:onnx|ort|pt|pth|ckpt|safetensors|gguf|ggml|tflite|pb|h5|bin)$/i;

/** No sound; a model only with a SOURCE.md, in its folder, that carries its SHA-256. */
export function checkMedia(root) {
  const errors = [];
  for (const file of listFiles(root)) {
    const name = rel(root, file);
    if (SOUND.test(file)) errors.push(`${name}: a sound stays out of the repository`);
    if (!MODEL.test(file)) continue;
    const source = path.join(path.dirname(file), 'SOURCE.md');
    const sha = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
    if (!fs.existsSync(source) || !fs.readFileSync(source, 'utf8').toLowerCase().includes(sha)) {
      errors.push(`${name}: a model needs a SOURCE.md in its folder with its SHA-256 (${sha})`);
    }
  }
  return errors;
}

export function runAll(root) {
  return [
    ...checkRequiredFiles(root, REQUIRED_FILES),
    ...checkMaxLines(root, 'standards', 150),
    ...checkMaxLines(root, 'templates/project/CLAUDE.md', 100),
    ...checkSameFile(root, '.github/pull_request_template.md', 'templates/project/.github/pull_request_template.md'),
    ...checkNoInternalAddresses(root),
    ...checkNoPrivateNames(root, { docs: true }),
    ...checkMedia(root),
    ...checkAdrs(root),
    ...(fs.existsSync(path.join(root, 'plugin/.claude-plugin/plugin.json')) ? checkVersions(root) : []),
    ...(fs.existsSync(path.join(root, 'registry.yaml'))
      ? checkRegistry(fs.readFileSync(path.join(root, 'registry.yaml'), 'utf8'))
      : []),
  ];
}

// No flag: every check of lun-docs. On any other repository:
//   --public <dir>     internal addresses, paths of a private repository, sounds and models (public satellites)
//   --addresses <dir>  internal addresses only (the private repositories)
const FLAGS = ['--public', '--addresses'];

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const unknown = args.filter((a) => a.startsWith('--') && !FLAGS.includes(a));
  if (unknown.length) {
    console.error(`unknown flag: ${unknown.join(', ')} (known: ${FLAGS.join(', ')})`);
    process.exit(1);
  }
  const flag = FLAGS.find((f) => args.includes(f));
  const root = flag ? path.resolve(args[args.indexOf(flag) + 1] ?? '.') : path.resolve(HERE, '..');
  const errors =
    flag === '--public'
      ? [...checkNoInternalAddresses(root), ...checkNoPrivateNames(root), ...checkMedia(root)]
      : flag === '--addresses'
        ? checkNoInternalAddresses(root)
        : runAll(root);
  for (const e of errors) console.error(e);
  console.log(errors.length ? `${errors.length} error(s)` : 'check: OK');
  if (flag === '--public') console.log(`checked: ${path.basename(root)}`);
  process.exit(errors.length ? 1 : 0);
}
