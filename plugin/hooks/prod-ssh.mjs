// The prod guard (standards/environnements.md, "Jouer une commande sur la prod"): nothing is parsed.
// When the instance declares its prod hosts, a command line that names one is refused, wherever the name
// stands; the only road to prod is the launcher, prod-run.mjs, which never takes the host on its line.
// The guard also refuses what it could not read anyway (an SSH client with a variable, an encoded command,
// a remote container engine) and protects its own files. One more belt, not a proof of safety.
// Nothing of an instance lives here: hosts, list and paths come from the environment.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HOOKS_DIR = path.dirname(fileURLToPath(import.meta.url));
// A name this common would refuse ordinary lines, or tell nothing apart.
const COMMON = new Set(['localhost', 'local', 'host', 'docker', 'github', 'github.com', 'prod', 'main', 'origin', 'node', 'test', '127.0.0.1']);

const RULE = 'Stop: CrOliX decides (standards/environnements.md, "Jouer une commande sur la prod")';
// Fixed by category: no word of the command, no advice.
export const REFUSALS = {
  mention: `prod guard: this line names a production host. ${RULE}`,
  file: `prod guard: this line names a file or a setting of the guard. ${RULE}`,
  write: `prod guard: a file of the guard is not written by the session. ${RULE}`,
  unreadable: `prod guard: a remote client whose target cannot be read, while prod hosts are declared. ${RULE}`,
  encoded: `prod guard: an encoded command cannot be read, while prod hosts are declared. ${RULE}`,
  engine: `prod guard: a remote context or host of the container engine, while prod hosts are declared. ${RULE}`,
  internal: `prod guard: the guard failed while prod hosts are declared. ${RULE}`,
};

/**
 * The data of the instance. No host: the guard is off. A host too short, too common or that is not a
 * host name throws: opening in silence would switch the guard off, so the hook then refuses everything.
 */
export function loadProdConfig(env = process.env) {
  const hosts = (env.LUN_PROD_SSH_HOSTS ?? '').split(/[\s,]+/).filter(Boolean);
  if (hosts.some((h) => !/^[a-z0-9.:-]{4,}$/i.test(h) || COMMON.has(h.toLowerCase()))) {
    throw new Error('prod guard: LUN_PROD_SSH_HOSTS holds a host name too short, too common or badly written '
      + '(at least 4 characters among letters, digits, dot, colon, dash): the guard refuses everything until it is fixed');
  }
  const allowFile = env.LUN_PROD_SSH_ALLOW_FILE || undefined;
  const more = (env.LUN_PROD_SSH_PROTECT ?? '').split(path.delimiter).filter(Boolean);
  return { hosts, allowFile, protectedPaths: [...(allowFile ? [allowFile] : []), ...more, HOOKS_DIR] };
}

// What a shell drops or glues before it reads a word: quotes, a caret, invisible characters.
const unquote = (text) => text.replace(/[\p{Cf}'"“”‘’«»^]/gu, '');
const slashes = (p) => p.replace(/\\/g, '/').replace(/\/(\.?\/)+/g, '/').toLowerCase().replace(/\/+$/, '');
/** A path and its other writing on Windows: c:/x and /c/x. */
function forms(p) {
  const n = slashes(p);
  return [n, n.replace(/^([a-z]):\//, '/$1/'), n.replace(/^\/([a-z])\//, '$1:/')];
}

function namesProtected(command, protectedPaths) {
  let text = slashes(unquote(command).replace(/\p{Cc}/gu, ''));
  while (/\/[^/\s]+\/\.\.\//.test(text)) text = text.replace(/\/[^/\s]+\/\.\.\//, '/');
  const paths = protectedPaths.filter(Boolean).flatMap(forms);
  for (const p of paths) text = text.replaceAll(`${p}/prod-run.mjs`, ''); // the launcher is called by its path
  return paths.some((p) => text.includes(p));
}

const CLIENT = /(^|[\s;|&(){}/])(ssh-copy-id|sshfs|ssh|scp|sftp|rsync|mosh|autossh|plink|putty|slogin|pscp|psftp)(\.exe)?(?![\w.-])([^;|&\n)}]*)/gi;

/** An SSH client with a variable, a substitution, an expression, braces or a splat on its line, or with no target. */
function unreadableClient(text) {
  return [...text.matchAll(CLIENT)].some((m) => {
    const rest = m[4];
    if (/[$`{(]|%\w+%|(^|\s)@/.test(rest)) return true;
    const before = text.slice(0, m.index + m[1].length).replace(/[\w.:/~-]*$/, '').trimEnd();
    const starts = before === '' || /[;|&\n({]$/.test(before);
    return starts && !rest.split(/\s+/).some((w) => w && !w.startsWith('-'));
  });
}

const ENCODED = [
  /\b(powershell|pwsh)(\.exe)?\s[^;|&\n]*?-(e|ec|en[a-z]*)(\s|$)/i,
  /frombase64string/i,
];
const DECODE = /base64\s+(-d|-D|--decode)\b/;
const RUNS_IT = /\|\s*[\w./-]*(sh|iex|python\d?|node|perl|ruby)\b|\beval\b|\bsource\b|\$\(|`|<\(/;
const ENGINE = [
  /docker_context/i,
  /\bdocker(\.exe)?(\s+-\S+)*\s+(-c|--context\S*|context)(\s|$)/,
  /DOCKER_HOST\s*=\s*\S*[$`]/i,
  /\bdocker\S*\s[^;|&\n]*(-H|--host)[\s=]*\S*[$`]/,
];

/** The text as a shell would glue it: quotes, escapes, control and invisible characters dropped, no case. */
const glue = (text) => unquote(text).replace(/[\p{Cc}`\\]/gu, '').toLowerCase();
const namesHost = (text, prod) => prod.hosts.some((h) => glue(text).includes(h.toLowerCase()));

/**
 * The refusal of a command line, or null. Off without a declared host; an error is a refusal.
 * @param {string} command
 * @param {{ hosts?: string[], protectedPaths?: string[], allowFile?: string } | undefined} prod
 */
export function commandReason(command, prod) {
  if (!prod?.hosts?.length) return null;
  try {
    if (namesHost(command, prod)) return REFUSALS.mention;
    const glued = glue(command);
    // The settings of the guard, its files by their path, the list by its name alone (a relative path).
    const list = prod.allowFile ? slashes(prod.allowFile).split('/').pop() : null;
    if (glued.includes('lun_prod_ssh_') || (list && glued.includes(list)) || namesProtected(command, prod.protectedPaths ?? [])) return REFUSALS.file;
    const shown = unquote(command).replace(/\r/g, '\n');
    const read = [shown.replace(/\\/g, '/'), shown.replace(/\\/g, '')]; // a Windows path, or a sh escape
    if (read.some((t) => ENCODED.some((re) => re.test(t)) || (DECODE.test(t) && RUNS_IT.test(t)))) return REFUSALS.encoded;
    if (read.some((t) => ENGINE.some((re) => re.test(t)))) return REFUSALS.engine;
    if (read.some(unreadableClient)) return REFUSALS.unreadable;
    return null;
  } catch {
    return REFUSALS.internal;
  }
}

/**
 * The refusal of a write, or null: a file of the guard (the list, the hooks, the declared paths), or a
 * text that names a prod host (a script written now and run later would go around the mention rule).
 */
export function writeReason(filePath, cwd, prod, written = []) {
  if (!prod?.hosts?.length) return null;
  try {
    if (written.some((text) => typeof text === 'string' && namesHost(text, prod))) return REFUSALS.mention;
    const file = slashes(filePath);
    const target = path.posix.normalize(/^([a-z]:)?\//.test(file) ? file : `${slashes(cwd ?? process.cwd())}/${file}`);
    const guarded = (prod.protectedPaths ?? []).filter(Boolean).flatMap(forms);
    return forms(target).some((t) => guarded.some((p) => t === p || t.startsWith(`${p}/`))) ? REFUSALS.write : null;
  } catch {
    return REFUSALS.internal;
  }
}
