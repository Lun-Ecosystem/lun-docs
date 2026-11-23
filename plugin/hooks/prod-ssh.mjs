// The laptop side of the prod guard (standards/environnements.md, "Jouer une commande sur la prod").
// The guard proper is the door on the prod host (tools/prod-gate/). This is a belt against a mistake, not
// against a session that goes around it: when the instance declares its prod hosts, a command line or a
// written text that names one is refused, and so is what could not be read anyway (an SSH client with a
// variable, an encoded command, a remote container engine). Nothing is parsed, nothing of an instance
// lives here: the hosts come from the environment.

// A name this common would refuse ordinary lines, or tell nothing apart.
const COMMON = new Set(['localhost', 'local', 'host', 'docker', 'github', 'github.com', 'prod', 'main', 'origin', 'node', 'test', '127.0.0.1']);

const RULE = 'Stop: CrOliX decides (standards/environnements.md, "Jouer une commande sur la prod")';
// Fixed by category: no word of the command, no advice.
export const REFUSALS = {
  mention: `prod guard: this names a production host. ${RULE}`,
  unreadable: `prod guard: a remote client whose target cannot be read, while prod hosts are declared. ${RULE}`,
  encoded: `prod guard: an encoded command cannot be read, while prod hosts are declared. ${RULE}`,
  engine: `prod guard: a remote context or host of the container engine, while prod hosts are declared. ${RULE}`,
  internal: `prod guard: the guard failed while prod hosts are declared. ${RULE}`,
};

/**
 * The hosts of the instance. None: the belt is off. A host too short, too common or that is not a host
 * name throws: opening in silence would switch the belt off, so the hook then refuses everything.
 */
export function loadProdConfig(env = process.env) {
  const hosts = (env.LUN_PROD_SSH_HOSTS ?? '').split(/[\s,]+/).filter(Boolean);
  if (hosts.some((h) => !/^[a-z0-9.:-]{4,}$/i.test(h) || COMMON.has(h.toLowerCase()))) {
    throw new Error('prod guard: LUN_PROD_SSH_HOSTS holds a host name too short, too common or badly written '
      + '(at least 4 characters among letters, digits, dot, colon, dash): the guard refuses everything until it is fixed');
  }
  return { hosts };
}

// What a shell drops before it reads a word: quotes, a caret, an escape, invisible characters.
const unquote = (text) => text.replace(/[\p{Cf}'"“”‘’«»^]/gu, '');
const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** True when the text names a prod host, on name boundaries: not a piece of a longer word or address. */
function namesHost(text, prod) {
  const bare = unquote(text).replace(/[`\\]/g, '').toLowerCase();
  // A control character glues two pieces for one shell and separates them for another: both readings.
  const readings = [bare.replace(/\p{Cc}/gu, ''), bare.replace(/\p{Cc}/gu, ' ')];
  return prod.hosts.some((h) => {
    const name = new RegExp(`(?<![a-z0-9_-])(?<![0-9]\\.)${escapeRegExp(h.toLowerCase())}(?![a-z0-9_-])(?!\\.[0-9])`);
    return readings.some((t) => name.test(t));
  });
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

/**
 * The refusal of a command line, or null. Off without a declared host; an error is a refusal.
 * @param {string} command
 * @param {{ hosts?: string[] } | undefined} prod
 */
export function commandReason(command, prod) {
  if (!prod?.hosts?.length) return null;
  try {
    if (namesHost(command, prod)) return REFUSALS.mention;
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

/** The refusal of a write, or null: a path or a text that names a prod host (a script written now, run later). */
export function writeReason(filePath, prod, written = []) {
  if (!prod?.hosts?.length) return null;
  try {
    const texts = [String(filePath), ...written.filter((text) => text != null)];
    return texts.some((text) => namesHost(text, prod)) ? REFUSALS.mention : null;
  } catch {
    return REFUSALS.internal;
  }
}
