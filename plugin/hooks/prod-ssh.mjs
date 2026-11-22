// Guard on the commands played toward a production host over SSH (standards/environnements.md).
// A remote command passes only if all of it matches a line of the closed list of the instance, and a
// second barrier, written here, refuses what erases, shows a secret or raises privilege even if a line
// covered it. Whatever this file cannot read is refused when the target is prod: it is one more belt,
// not a proof of safety. Nothing of an instance lives here: hosts and list come from the environment.
import fs from 'node:fs';

const RULE =
  'Only the closed list is played on prod over SSH (standards/environnements.md, "Jouer une commande sur la prod"): stop, CrOliX decides';

/** The hosts and the list of the instance. No host: the guard is off. No readable list: nothing passes. */
export function loadProdConfig(env = process.env, readFile = (file) => fs.readFileSync(file, 'utf8')) {
  const hosts = (env.LUN_PROD_SSH_HOSTS ?? '').split(/[\s,]+/).filter(Boolean);
  let patterns = [];
  try {
    if (hosts.length && env.LUN_PROD_SSH_ALLOW_FILE) {
      patterns = readFile(env.LUN_PROD_SSH_ALLOW_FILE).split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
    }
  } catch {
    patterns = [];
  }
  return { hosts, patterns };
}

// ---- Reading a command line -------------------------------------------------------------------------

/**
 * Words and operators of a command line, for sh and PowerShell alike. A word keeps two doubts:
 * `x` when the shell would expand it ($, a substitution, a splat), `odd` when its value cannot be read
 * literally (x, an escape, a glob, a doubled quote, a character outside printable ASCII).
 * Returns null on an unclosed quote. `angle` keeps < and > as plain characters (the list's placeholders).
 */
function lex(text, angle = false) {
  const items = [];
  let word = null;
  let space = false; // a space of another kind (no-break, vertical…): PowerShell cuts there, sh does not
  const open = () => {
    word ??= { v: '', q: false, odd: space, x: false, sub: false };
    space = false;
    return word;
  };
  const close = () => { if (word) items.push(word); word = null; };
  const op = (name) => { close(); items.push({ op: name }); };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "'" || c === '"') {
      const w = open();
      w.q = true;
      let j = i + 1;
      for (; j < text.length && text[j] !== c; j++) {
        if (c === "'") { w.v += text[j]; continue; }
        if (text[j] === '\\' && j + 1 < text.length) { w.odd = true; w.v += text[j] + text[++j]; continue; }
        if (text[j] === '$' || text[j] === '`') {
          w.odd = w.x = true;
          if (text[j] === '`' || text[j + 1] === '(') w.sub = true;
        }
        w.v += text[j];
      }
      if (j >= text.length) return null;
      if (text[j + 1] === c) w.odd = true; // '' or "": one quote for PowerShell, nothing for sh
      i = j;
    } else if (c === ' ' || c === '\t') close();
    else if (c === '\n' || c === '\r') op('\n');
    else if (c === ';' || c === '(' || c === ')' || c === '{' || c === '}' || c === '`') op(c);
    else if (c === '&' || c === '|') {
      if (text[i + 1] === c) { op(c + c); i++; } else op(c);
    } else if ((c === '<' || c === '>') && !angle) {
      if (word && !word.q && /^\d+$/.test(word.v)) word = null; // the descriptor of 2>
      while (text[i + 1] === c) i++;
      const dup = c === '>' && text.slice(i + 1).match(/^&[\d-]+/); // 2>&1 goes nowhere new
      if (dup) { close(); i += dup[0].length; } else op(c);
    } else if (/\s/.test(c)) {
      if (word) word.odd = true;
      close();
      space = true;
    } else {
      const w = open();
      w.v += c;
      if (c === '$' || (c === '@' && w.v.length === 1 && !w.q)) w.odd = w.x = true;
      else if (/[\\*?[\]~#!]/.test(c) || c < ' ' || c > '~') w.odd = true;
    }
  }
  close();
  return items;
}

/** The commands of a local line: their words, the operators around them, whether a file feeds them. */
function segmentsOf(items) {
  const segs = [{ words: [], prev: null, next: null, stdin: false }];
  let skip = false; // the word after a redirection is a file, not an argument
  for (const it of items) {
    const seg = segs[segs.length - 1];
    if (!it.op) { if (!skip) seg.words.push(it); skip = false; continue; }
    skip = it.op === '<' || it.op === '>';
    if (it.op === '<') seg.stdin = true;
    if (skip) continue;
    seg.next = it.op;
    segs.push({ words: [], prev: it.op, next: null, stdin: false });
  }
  return segs.filter((s) => s.words.length > 0);
}

// ---- Naming the host and the tools ------------------------------------------------------------------

const sameHost = (a, b) => a === b || a.startsWith(`${b}.`) || (/[a-z]/.test(a) && b.startsWith(`${a}.`));

/** True when the text names a prod host: bare, with a user, a port, a scheme, a domain, another case. */
function mentions(text, hosts) {
  const parts = String(text).toLowerCase().replace(/\\/g, '').split(/[^a-z0-9.-]+/).map((p) => p.replace(/\.+$/, ''));
  return parts.some((p) => p && hosts.some((h) => sameHost(p, h.toLowerCase().replace(/\.+$/, ''))));
}

/** The names a command word can stand for: a Windows path, or a sh word with an escape in it. */
function names(value) {
  const clean = (s) => s.split('/').pop().toLowerCase().replace(/\.exe$/, '');
  return [clean(value.replace(/\\/g, '/')), clean(value.replace(/\\/g, ''))];
}
const isOneOf = (set, value) => names(value).some((n) => set.has(n));

const SSH = new Set(['ssh']);
const SSH_TOOLS = new Set(['scp', 'sftp', 'rsync', 'sshfs', 'ssh-copy-id', 'mosh', 'autossh', 'slogin', 'plink', 'pscp', 'psftp']);
const LAUNCHERS = new Set(['xargs', 'parallel', 'start-process', 'saps', 'start', 'alias', 'set-alias', 'new-alias', 'sal', 'nal']);
const EVALUATORS = new Set(['bash', 'sh', 'zsh', 'dash', 'ksh', 'fish', 'pwsh', 'powershell', 'cmd', 'wsl', 'eval', 'iex', 'invoke-expression']);
const INTERPRETERS = new Set(['python', 'python3', 'py', 'node', 'perl', 'ruby', 'php', 'deno', 'bun']);
const DOCKER = new Set(['docker', 'docker-compose', 'podman', 'nerdctl']);
const DOCKER_GLOBALS_WITH_VALUE = new Set(['--config', '-l', '--log-level', '--tlscacert', '--tlscert', '--tlskey', '-H', '--host']);

// ---- The refusal ------------------------------------------------------------------------------------

/** Names the first word of what is refused, never its arguments: they may carry a secret. */
function refuse(first, why) {
  const name = typeof first === 'string' ? first.split('/').pop() : '';
  const shown = /^[A-Za-z0-9._-]{1,30}$/.test(name) ? `"${name}"` : 'a command';
  return `prod ssh: ${shown} refused - ${why}. ${RULE}`;
}

// ---- The remote command: the second barrier, then the closed list -----------------------------------

const because = (words, why) => Object.fromEntries(words.split(' ').map((w) => [w, why]));
// Refused as the first word of a remote command, whatever the list says.
const REFUSED = {
  ...because('sudo su doas pkexec', 'raises privilege'),
  ...because('rm rmdir mv cp tee dd shred truncate unlink mkfs wipefs fdisk parted', 'erases or overwrites'),
  ...because('sh bash zsh dash ash ksh fish busybox python python3 perl ruby php node awk eval exec source . command env nohup xargs time timeout nice watch script screen tmux',
    'runs another command the guard cannot read'),
  ...because('printenv set export journalctl dmesg', 'shows an environment or a raw log'),
  ...because('ssh scp sftp rsync socat nc ncat netcat telnet curl wget autossh mosh', 'opens a connection or a port'),
  ...because('systemctl service reboot shutdown halt poweroff mount umount sysctl iptables nft ufw crontab useradd usermod userdel passwd chmod chown chgrp apt apt-get dpkg kill killall pkill',
    'changes the system'),
};
// Refused as any word of a container command: what `docker exec` would run inside.
const REFUSED_INSIDE = new Set('sudo su doas sh bash zsh dash ash ksh fish busybox env printenv rmdir mv shred truncate unlink dd'.split(' '));
// A file whose content is a secret, a key or a raw log.
const SECRET_FILE = /\.env(\.[\w-]+)?$|environ$|\.docker\/|config\.json$|\.ssh(\/|$)|(^|\/)id_[a-z0-9]+|authorized_keys|known_hosts|\.(pem|key|p12|pfx|kdbx|log)(\.\d+)?$|\/var\/log\/|\/var\/lib\/docker\/|shadow$|\.(netrc|npmrc|pgpass)$|htpasswd|secret|token|password|credential/i;
// A format that names fields one by one, among those that show no configuration.
const FORMAT_FIELD = /\{\{\.(State|Names?|Status|I[dD]|Image|Created|CreatedAt|RunningFor|RestartCount|Ports|Size|Driver|Service|Health|Repository|Tag|Scope)(\.[A-Za-z]+)*\}\}/g;
const safeFormat = (f) => f.includes('{{') && /^[ :,|/-]*$/.test(f.replace(FORMAT_FIELD, ''));

const base = (word) => word.split('/').pop();

/** The reason the code itself refuses a pipeline (arrays of words), or null. */
function barrier(pipeline) {
  const counted = pipeline.length === 2 && base(pipeline[0][0]) === 'grep' && /^wc -[cl]$/.test(pipeline[1].join(' '));
  for (const [k, words] of pipeline.entries()) {
    const cmd = base(words[0]);
    const has = (...list) => list.some((w) => words.includes(w));
    if (Object.hasOwn(REFUSED, cmd)) return `${cmd} ${REFUSED[cmd]}`;
    if (!counted && cmd !== 'stat' && words.some((w) => SECRET_FILE.test(w))) return 'it would show a secret, a key or a raw log';
    if (cmd === 'find' && words.some((w) => /^-(delete|exec|execdir|ok|okdir|fls|fprint.*)$/.test(w))) return 'find erases or runs another command';
    if (cmd === 'sed' && words.some((w) => /^-[a-zA-Z]*i|^--in-place/.test(w))) return 'sed -i overwrites a file';
    if (!DOCKER.has(cmd)) continue;

    if (has('run')) return 'docker run starts any container, with any right';
    if (has('attach')) return 'docker attach is an interactive session';
    if (has('prune')) return 'docker prune erases';
    if (has('volume') && has('rm', 'remove')) return 'docker volume rm erases a volume';
    if (has('down', 'rm') && words.some((w) => /^-[a-zA-Z]*v|^--volumes|^--rmi/.test(w))) return 'docker down or rm with its volumes erases';
    if (words.some((w) => REFUSED_INSIDE.has(base(w)))) return 'docker exec of a shell, an environment or an eraser';
    if (has('exec')) {
      if (has('rm')) return 'docker exec of a shell, an environment or an eraser';
      if (words.some((w) => /^-[it]+$|^-[ue]|^--(interactive|tty|user|privileged|env|env-file)(=|$)/.test(w))) {
        return 'docker exec interactive, as another user or with an environment';
      }
    }
    if (has('config') && !has('--services', '--volumes', '--images', '--profiles', '--quiet', '-q')) return 'docker compose config shows the resolved configuration';
    const inspect = has('inspect');
    const formats = [];
    words.forEach((w, i) => {
      if (w === '--format' || (inspect && w === '-f')) formats.push(words[i + 1] ?? '');
      else if (w.startsWith('--format=')) formats.push(w.slice('--format='.length));
    });
    if (inspect && formats.length === 0) return 'docker inspect without a format shows everything';
    if (!formats.every(safeFormat)) return 'a docker format that shows more than named fields';
    if (has('logs')) {
      const bounded = words.some((w, i) => (/^(--tail|-n)$/.test(w) && /^\d{1,6}$/.test(words[i + 1] ?? '')) || /^--tail=\d{1,6}$/.test(w));
      const next = pipeline[k + 1];
      // A filter that keeps something: not inverted, and a pattern too long to match every line.
      const filtered = next && base(next[0]) === 'grep' && !next.some((w) => /^-[a-zA-Z]*v|^--invert-match/.test(w)) &&
        next.slice(1).some((w) => !w.startsWith('-') && w.length >= 3);
      if (!bounded || !filtered) return 'docker logs shows a raw log: bound it with --tail and filter it with grep';
    }
  }
  return null;
}

const HOLES = {
  '<app>': (w) => /^[a-z0-9][a-z0-9_-]{0,39}$/.test(w),
  '<version>': (w) => /^\d{1,4}\.\d{1,4}\.\d{1,4}$/.test(w),
  '<int>': (w) => /^\d{1,6}$/.test(w),
  '<path>': (w) => /^\/[A-Za-z0-9._/-]*$/.test(w) && !w.includes('..'),
};

/** Pipelines (arrays of stages, arrays of words) of a line; `chain` false: a single pipeline. Null if unreadable. */
function pipelinesOf(text, { chain, angle }) {
  const items = lex(text, angle);
  if (!items) return null;
  const pipelines = [[[]]];
  for (const it of items) {
    const pipeline = pipelines[pipelines.length - 1];
    if (it.op === '|') pipeline.push([]);
    else if (chain && [';', '&&', '||', '&', '\n'].includes(it.op)) pipelines.push([[]]);
    else if (it.op || it.odd) return null;
    else pipeline[pipeline.length - 1].push(it);
  }
  const full = pipelines.filter((p) => p.some((stage) => stage.length > 0));
  return full.every((p) => p.every((stage) => stage.length > 0)) ? full : null;
}

const matches = (pipeline, pattern) =>
  pipeline.length === pattern.length &&
  pipeline.every((stage, s) => stage.length === pattern[s].length &&
    stage.every((w, i) => {
      const p = pattern[s][i];
      return !p.q && Object.hasOwn(HOLES, p.v) ? HOLES[p.v](w.v) : p.v === w.v;
    }));

/** The reason a remote command is refused, or null: every piece of a chain must pass both barriers. */
function remoteReason(text, patterns) {
  const first = text.trim().split(/\s+/)[0];
  const pipelines = pipelinesOf(text, { chain: true, angle: false });
  if (!pipelines) return refuse(first, 'the guard cannot read it as plain words (a variable, a substitution, a redirection, a glob, an escape)');
  if (pipelines.length === 0) return refuse(first, 'it is an interactive session');
  const list = patterns.map((p) => pipelinesOf(p, { chain: false, angle: true })?.[0]).filter(Boolean);
  for (const pipeline of pipelines) {
    const head = pipeline[0][0].v;
    const danger = barrier(pipeline.map((stage) => stage.map((w) => w.v)));
    if (danger) return refuse(head, danger);
    if (!list.some((pattern) => matches(pipeline, pattern))) return refuse(head, 'it is not, word for word, a line of the closed list');
  }
  return null;
}

// ---- The local command: does it reach prod, and by which door ---------------------------------------

const SSH_FLAGS = '46AaCfGgKkMNnqsTtVvXxYy';
const SSH_WITH_VALUE = 'BbcDEeFIiJLlmOoPpQRSWw';
// What a prod call may carry: nothing that forwards, proxies, shares a socket or opens a terminal.
const SSH_ALLOWED = 'qvTnCxak46pli';
const SSH_O_ALLOWED = new Set(['batchmode', 'connecttimeout', 'connectionattempts', 'stricthostkeychecking', 'serveraliveinterval',
  'serveralivecountmax', 'loglevel', 'identitiesonly', 'identityfile', 'port', 'user', 'compression', 'addressfamily',
  'passwordauthentication', 'preferredauthentications']);
const UNREADABLE = 'the guard cannot read its target or its options (a variable, an unknown option, another configuration file)';

function sshReason(args, seg, prod, depth) {
  const options = []; // [letter, value]
  let target = null;
  let i = 0;
  let readable = !['{', '(', '`'].includes(seg.next);
  for (; i < args.length && readable; i++) {
    const { v } = args[i];
    if (v === '--') { i++; if (target === null) target = args[i++] ?? null; break; }
    if (!v.startsWith('-')) {
      if (target !== null) break;
      target = args[i];
      continue;
    }
    if (v === '-') readable = false;
    for (let p = 1; p < v.length; p++) {
      if (SSH_WITH_VALUE.includes(v[p])) {
        const value = v.slice(p + 1) || args[++i]?.v;
        if (value === undefined) readable = false;
        options.push([v[p], value ?? '']);
        break;
      }
      if (!SSH_FLAGS.includes(v[p])) { readable = false; break; }
      options.push([v[p], '']);
    }
  }
  const head = args.slice(0, i);
  const command = args.slice(i);
  const host = target?.v.replace(/^ssh:\/\//i, '').replace(/^.*@/, '') ?? '';
  // Another writing of an address (decimal, hexadecimal, padded, IPv6) could be the prod one.
  const numeric = /^[0-9a-fx.:[\]]+$/i.test(host) && /^\d|[:[]/.test(host) && !/^((0|[1-9]\d{0,2})\.){3}(0|[1-9]\d{0,2})$/.test(host);
  if (!readable || numeric || head.some((w) => w.x) || options.some(([o]) => o === 'F')) return refuse('ssh', UNREADABLE);

  const isProd = (target && mentions(target.v, prod.hosts)) || options.some(([, value]) => mentions(value, prod.hosts));
  // Another host: its command may hop to prod.
  if (!isProd) return command.length ? scan(command.map((w) => w.v).join(' '), prod, depth + 1) : null;

  for (const [o, value] of options) {
    const ok = o === 'o' ? SSH_O_ALLOWED.has(value.trim().split(/[=\s]/)[0].toLowerCase()) : SSH_ALLOWED.includes(o);
    if (!ok) return refuse('ssh', `the option -${o} is not played toward prod (a terminal, a forwarding, a proxy, a shared socket)`);
  }
  if (seg.prev === '|' || seg.stdin) return refuse('ssh', 'a pipe or a file feeds it: the guard cannot read what prod would run');
  if (command.length === 0) return refuse('ssh', 'it is an interactive session');
  if (command.some((w) => w.odd)) {
    return refuse(command[0].odd ? null : command[0].v.trim().split(/\s+/)[0],
      'the guard cannot read it as plain words (a variable, a substitution, an escape, a glob)');
  }
  return remoteReason(command.map((w) => w.v).join(' '), prod.patterns);
}

function dockerReason(args, prod) {
  let globals = true;
  for (let i = 0; i < args.length; i++) {
    const { v, x } = args[i];
    if (v === 'context' || /^--context(=|$)/.test(v) || (globals && v === '-c')) {
      return refuse('docker', 'a docker context may point at prod and the guard cannot resolve it');
    }
    const value = /^(-H|--host)$/.test(v) ? args[i + 1] : /^(-H.|--host=)/.test(v) ? args[i] : null;
    if (value && (value.x || mentions(value.v, prod.hosts))) return refuse('docker', 'docker pointed at prod goes around the closed list');
    if (!v.startsWith('-')) globals = false;
    else if (globals && DOCKER_GLOBALS_WITH_VALUE.has(v)) i++;
    if (x && globals) globals = false;
  }
  return null;
}

function segmentReason(seg, prod, depth) {
  const { words } = seg;
  // A substitution inside double quotes runs on the laptop.
  for (const w of words) {
    if (!w.sub) continue;
    const reason = scan(w.v, prod, depth + 1);
    if (reason) return reason;
  }
  const line = words.map((w) => w.v).join(' ');
  for (const w of words) {
    const env = w.v.match(/^(?:\$env:)?DOCKER_(CONTEXT|HOST)\b/i);
    if (!env) continue;
    if (env[1].toUpperCase() === 'CONTEXT') return refuse('docker', 'a docker context may point at prod and the guard cannot resolve it');
    if (mentions(line, prod.hosts) || /[$`]/.test(line.replace(/\$env:/gi, ''))) return refuse('docker', 'docker pointed at prod goes around the closed list');
  }

  const k = words.findIndex((w) => !/^\w+=/.test(w.v));
  if (k < 0) return null;
  const cmd = words[k].v;
  const rest = words.slice(k + 1);
  const opensSsh = (value) => isOneOf(SSH, value) || isOneOf(SSH_TOOLS, value);
  if (isOneOf(LAUNCHERS, cmd) && rest.some((w) => opensSsh(w.v) || opensSsh(w.v.split('=').pop().trim().split(/\s+/)[0]))) {
    return refuse('ssh', 'an alias or a launcher hides its target from the guard');
  }
  if (isOneOf(EVALUATORS, cmd)) {
    for (const text of [...rest.map((w) => w.v), rest.map((w) => w.v).join(' ')]) {
      const reason = scan(text, prod, depth + 1);
      if (reason) return reason;
    }
  }
  if (isOneOf(INTERPRETERS, cmd) && rest.some((w) => mentions(w.v, prod.hosts))) {
    return refuse(null, 'an interpreter is given a prod host: the guard cannot read what it runs');
  }
  if (isOneOf(DOCKER, cmd)) {
    const reason = dockerReason(rest, prod);
    if (reason) return reason;
  }
  // ssh wherever it stands: after env, command, exec, sudo, timeout…
  const j = words.findIndex((w) => opensSsh(w.v));
  if (j < 0) return null;
  const args = words.slice(j + 1);
  if (isOneOf(SSH, words[j].v)) return sshReason(args, seg, prod, depth);
  if (args.some((w) => w.x || mentions(w.v, prod.hosts)) || ['{', '(', '`'].includes(seg.next)) {
    return refuse(names(words[j].v)[0], 'copies and other SSH tools toward prod are not played by the session');
  }
  return null;
}

// A heredoc, a here-string, an escaped quote, a backtick: sh and PowerShell do not cut them alike.
const AMBIGUOUS = /<<|@['"]|\\['"]|`/;

function scan(text, prod, depth) {
  const items = lex(text);
  const named = mentions(text.replace(/['"`^]/g, ''), prod.hosts);
  if ((!items || AMBIGUOUS.test(text) || depth > 5) && named) {
    return refuse(null, 'it names a prod host and the guard cannot cut it surely (a heredoc, an escaped or unclosed quote, a backtick)');
  }
  if (!items || depth > 5) return null;
  for (const seg of segmentsOf(items)) {
    const reason = segmentReason(seg, prod, depth);
    if (reason) return reason;
  }
  return null;
}

/**
 * The reason a local command is refused, or null. Off without a declared host.
 * @param {string} command
 * @param {{ hosts?: string[], patterns?: string[] } | undefined} prod
 */
export function prodReason(command, prod) {
  if (!prod?.hosts?.length) return null;
  const config = { hosts: prod.hosts, patterns: prod.patterns ?? [] };
  try {
    return scan(String(command), config, 0);
  } catch {
    // An error on a line that may reach prod is a refusal; on any other line it must not stop the work.
    const text = String(command);
    return mentions(text.replace(/['"`^]/g, ''), config.hosts) || /ssh|scp|sftp|rsync|DOCKER_(HOST|CONTEXT)/i.test(text)
      ? refuse(null, 'the guard failed while reading it')
      : null;
  }
}
