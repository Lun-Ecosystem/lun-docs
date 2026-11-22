// The only road to prod (standards/environnements.md, "Jouer une commande sur la prod").
//   node prod-run.mjs <line> [arguments...]   plays one line of the closed list of the instance
//   node prod-run.mjs --list | --dry <line> [arguments...] | --check
// The whole list is checked at each start: a line badly written, or refused by the barrier written here,
// stops the launcher. The arguments are validated one by one against the jokers of the line, the remote
// command is the line itself, and ssh is started here, without a shell, with fixed options, toward the
// host of the configuration: the host never stands on the line of the session, nor in what is printed.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadProdConfig } from './prod-ssh.mjs';

// Not found on the search path, which a session can change.
const SSH = process.platform === 'win32' ? 'C:\\Windows\\System32\\OpenSSH\\ssh.exe' : '/usr/bin/ssh';
// No terminal, no input, nothing forwarded, no question asked; they win over the SSH configuration of the machine.
const SSH_OPTIONS = ['-T', '-n', '-a', '-x', '-o', 'ClearAllForwardings=yes', '-o', 'BatchMode=yes', '-o', 'ConnectTimeout=10',
  '-o', 'RequestTTY=no', '-o', 'RemoteCommand=none', '-o', 'PermitLocalCommand=no'];

const JOKERS = {
  app: [/^[a-z0-9][a-z0-9_-]{0,39}$/, '<app>: lower-case letters, digits, dash and underscore, forty characters at most, a letter or a digit first'],
  version: [/^\d{1,4}\.\d{1,4}\.\d{1,4}$/, '<version>: three numbers and two dots'],
  int: [/^\d{1,6}$/, '<int>: one to six digits'],
  path: [/^\/[A-Za-z0-9._/-]*$/, '<path>: an absolute path of letters, digits, dot, dash, underscore and slash, no parent folder'],
};
const JOKER = /<(app|version|int|path)>/g;
// A line: plain words, single quotes, pipes, and jokers standing alone.
const TOKEN = / *(?:(\|)|<(app|version|int|path)>(?= |$)|((?:[A-Za-z0-9_./:=%^@,+-]+|'[^'\p{Cc}\p{Cf}“”‘’]*')+)(?= |\||$))/uy;

// ---- The barrier: refused whatever the list says -----------------------------------------------------

const because = (words, why) => Object.fromEntries(words.split(' ').map((w) => [w, why]));
const REFUSED = {
  ...because('sudo su doas pkexec', 'raises privilege'),
  ...because('rm rmdir mv cp tee dd shred truncate unlink mkfs wipefs fdisk parted', 'erases or overwrites'),
  ...because('sh bash zsh dash ash ksh fish busybox python python3 perl ruby php node awk eval exec source . command env nohup xargs time timeout nice watch script screen tmux',
    'runs another command'),
  ...because('printenv set export journalctl dmesg', 'shows an environment or a raw log'),
  ...because('ssh scp sftp rsync socat nc ncat netcat telnet curl wget autossh mosh', 'opens a connection or a port'),
  ...because('systemctl service reboot shutdown halt poweroff mount umount sysctl iptables nft ufw crontab useradd usermod userdel passwd chmod chown chgrp apt apt-get dpkg kill killall pkill',
    'changes the system'),
};
// Refused as any word of a container command: what `docker exec` would run inside.
const REFUSED_INSIDE = new Set('sudo su doas sh bash zsh dash ash ksh fish busybox env printenv rmdir mv shred truncate unlink dd'.split(' '));
const SECRET_FILE = /\.env(\.[\w-]+)?$|environ$|\.docker\/|config\.json$|\.ssh(\/|$)|(^|\/)id_[a-z0-9]+|authorized_keys|known_hosts|\.(pem|key|p12|pfx|kdbx|log)(\.\d+)?$|\/var\/log\/|\/var\/lib\/docker\/|shadow$|\.(netrc|npmrc|pgpass)$|htpasswd|secret|token|password|credential/i;
// A format that names fields one by one, among those that show no configuration.
const FORMAT_FIELD = /\{\{\.(State|Names?|Status|I[dD]|Image|Created|CreatedAt|RunningFor|RestartCount|Ports|Size|Driver|Service|Health|Repository|Tag|Scope)(\.[A-Za-z]+)*\}\}/g;
const safeFormat = (f) => f.includes('{{') && /^[ :,|/-]*$/.test(f.replace(FORMAT_FIELD, ''));
const base = (word) => word.split('/').pop();

/** The reason a pipeline (arrays of words) is refused, or null. */
function barrier(stages) {
  const counted = stages.length === 2 && base(stages[0][0]) === 'grep' && /^wc -[cl]$/.test(stages[1].join(' '));
  for (const [k, words] of stages.entries()) {
    const cmd = base(words[0]);
    const has = (...list) => list.some((w) => words.includes(w));
    if (Object.hasOwn(REFUSED, cmd)) return REFUSED[cmd];
    if (k > 0 && cmd !== 'grep' && !/^wc -[cl]$/.test(words.join(' '))) return 'a pipe goes only to grep, or to wc -c and wc -l';
    if (!counted && cmd !== 'stat' && words.some((w) => SECRET_FILE.test(w))) return 'would show a secret, a key or a raw log';
    if (cmd !== 'stat' && has('<path>')) return 'a <path> joker stands only behind stat';
    if (cmd === 'find' && words.some((w) => /^-(delete|exec|execdir|ok|okdir|fls|fprint.*)$/.test(w))) return 'erases or runs another command';
    if (cmd === 'sed' && words.some((w) => /^-[a-zA-Z]*i|^--in-place/.test(w))) return 'erases or overwrites';
    if (!['docker', 'docker-compose', 'podman'].includes(cmd)) continue;

    if (has('run', 'attach', 'cp')) return 'starts any container, opens a session or copies files';
    if (has('prune') || (has('volume') && has('rm', 'remove'))) return 'erases volumes or more';
    if (has('down', 'rm') && words.some((w) => /^-[a-zA-Z]*v|^--volumes|^--rmi/.test(w))) return 'erases volumes or more';
    if (words.some((w) => /^-[a-zA-Z]*V|^--renew-anon-volumes/.test(w))) return 'erases volumes or more';
    if (words.some((w) => REFUSED_INSIDE.has(base(w))) || (has('exec') && has('rm'))) return 'runs a shell, an environment or an eraser in a container';
    if (has('exec') && words.some((w) => /^-[it]+$|^-[ue]|^--(interactive|tty|user|privileged|env|env-file)(=|$)/.test(w))) {
      return 'runs in a container interactively, as another user or with an environment';
    }
    if (has('config') && !has('--services', '--volumes', '--images', '--profiles', '--quiet', '-q')) return 'shows the resolved configuration';
    const inspect = has('inspect');
    const formats = [];
    words.forEach((w, i) => {
      if (w === '--format' || (inspect && w === '-f')) formats.push(words[i + 1] ?? '');
      else if (w.startsWith('--format=')) formats.push(w.slice('--format='.length));
    });
    if (inspect && formats.length === 0) return 'an inspection without a format shows everything';
    if (!formats.every(safeFormat)) return 'a format that shows more than named fields';
    if (has('logs')) {
      const bounded = words.some((w, i) => (/^(--tail|-n)$/.test(w) && /^(\d{1,6}|<int>)$/.test(words[i + 1] ?? '')) || /^--tail=\d{1,6}$/.test(w));
      const next = stages[k + 1];
      // A filter that keeps something: not inverted, and a pattern too long to match every line.
      const filtered = next && base(next[0]) === 'grep' && !next.some((w) => /^-[a-zA-Z]*v|^--invert-match/.test(w)) &&
        next.slice(1).some((w) => !w.startsWith('-') && w.length >= 3);
      if (!bounded || !filtered) return 'a log must be bounded by --tail and filtered by grep';
    }
  }
  return null;
}

// ---- The list ---------------------------------------------------------------------------------------

/** A line of the list as stages of words ({ v } or { joker }); throws the reason it is refused. */
function readLine(text) {
  if (/[\p{Cc}\p{Cf}]/u.test(text)) throw new Error('holds a control or invisible character');
  const stages = [[]];
  for (let at = 0; at < text.length;) {
    TOKEN.lastIndex = at;
    const m = TOKEN.exec(text);
    if (!m) throw new Error('is not made of plain words, single quotes, pipes and jokers standing alone');
    at = TOKEN.lastIndex;
    if (m[1]) stages.push([]);
    else if (m[2]) stages.at(-1).push({ joker: m[2], v: `<${m[2]}>` });
    else if (m[3].includes("'") && m[3].search(JOKER) >= 0) throw new Error('holds a joker inside quotes');
    else stages.at(-1).push({ v: m[3].replaceAll("'", '') });
  }
  if (stages.some((s) => s.length === 0 || s[0].joker)) throw new Error('has a command that is empty or starts with a joker');
  const danger = barrier(stages.map((s) => s.map((w) => w.v)));
  if (danger) throw new Error(`is refused by the barrier: ${danger}`);
  return stages;
}

/** The command lines of the list, by their number in the file; throws on the first bad line. */
function readList(text) {
  const lines = new Map();
  text.split('\n').forEach((raw, i) => {
    const line = raw.replace(/\r$/, '').trim();
    if (!line || line.startsWith('#')) return;
    try {
      lines.set(String(i + 1), { text: line, stages: readLine(line) });
    } catch (e) {
      throw new Error(`line ${i + 1} of the list ${e.message}`);
    }
  });
  return lines;
}

// ---- The launcher -----------------------------------------------------------------------------------

/**
 * Synchronous, never prints.
 * @param {string[]} argv
 * @returns {{ status: number, out: string, err: string }}
 */
export function runProd(argv, { env = process.env, readFile = (f) => fs.readFileSync(f, 'utf8'), spawn = spawnSync } = {}) {
  const stop = (err, status = 2) => ({ status, out: '', err: `prod-run: ${err}` });
  try {
    let config;
    try {
      config = loadProdConfig(env);
    } catch (e) {
      return stop(`not configured: ${e.message}`);
    }
    const ssh = env.LUN_PROD_SSH_BIN || SSH;
    if (!config.hosts.length || !config.allowFile || !path.isAbsolute(ssh) || !/^ssh(\.exe)?$/i.test(path.basename(ssh))) {
      return stop('not configured: LUN_PROD_SSH_HOSTS and LUN_PROD_SSH_ALLOW_FILE are required (LUN_PROD_SSH_BIN: an absolute path to ssh)');
    }
    let lines;
    try {
      lines = readList(readFile(config.allowFile));
    } catch (e) {
      return stop(/^line \d/.test(e.message) ? e.message : 'the list cannot be read');
    }

    const [mode, ...rest] = argv;
    if (mode === '--check') return { status: 0, out: `prod-run: configured\nhosts: ${config.hosts.length}\nlines: ${lines.size}`, err: '' };
    if (mode === '--list') return { status: 0, out: [...lines].map(([n, l]) => `${n}: ${l.text}`).join('\n'), err: '' };
    const [number, ...args] = mode === '--dry' ? rest : argv;
    const line = lines.get(number ?? '');
    if (!line) return stop('this is not the number of a command line of the list (see --list)');

    const jokers = line.stages.flat().filter((w) => w.joker).map((w) => w.joker);
    if (args.length !== jokers.length) return stop(`this line takes ${jokers.length} argument(s)`);
    const bad = jokers.findIndex((joker, i) => !JOKERS[joker][0].test(args[i]) || (joker === 'path' && args[i].includes('..')));
    if (bad >= 0) return stop(`argument ${bad + 1} is refused: expected ${JOKERS[jokers[bad]][1]}`);
    // The barrier once more, on the words as they will run: a joker may stand where a subcommand does.
    let k = 0;
    const danger = barrier(line.stages.map((s) => s.map((w) => (w.joker ? args[k++] : w.v))));
    if (danger) return stop(`with these arguments the line is refused by the barrier: ${danger}`);
    k = 0;
    const remote = line.text.replace(JOKER, () => args[k++]);
    if (mode === '--dry') return { status: 0, out: remote, err: '' };

    const result = spawn(ssh, [...SSH_OPTIONS, '--', config.hosts[0], remote], { stdio: 'inherit', shell: false, windowsHide: true });
    if (result.error || typeof result.status !== 'number') return stop('ssh did not start or was interrupted', 1);
    return { status: result.status, out: '', err: '' };
  } catch {
    return stop('internal error, nothing was started', 1);
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { status, out, err } = runProd(process.argv.slice(2));
  if (out) process.stdout.write(`${out}\n`);
  if (err) process.stderr.write(`${err}\n`);
  process.exit(status);
}
