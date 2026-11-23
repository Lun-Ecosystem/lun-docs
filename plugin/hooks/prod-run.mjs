// The launcher toward the prod host (standards/environnements.md, "Jouer une commande sur la prod").
//   node prod-run.mjs <gesture> [arguments...]     e.g. node prod-run.mjs gestes
// It sends the name of a gesture and its arguments, nothing else: the door on the host (tools/prod-gate/)
// is the guard, it checks them for real and runs the command written there. Here, a narrow set of
// characters refuses a typo early, and ssh is started without a shell, by a fixed path, without the SSH
// configuration of the machine, with the user, the port and the key of the instance, toward its first host.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadProdConfig } from './prod-ssh.mjs';

// A fixed path, not found on the search path, and no variable changes it. On Windows, the client of Git
// when it is there: it reaches the key agent of Git Bash (SSH_AUTH_SOCK), which the client of Windows cannot.
const GIT_SSH = 'C:\\Program Files\\Git\\usr\\bin\\ssh.exe';
const WINDOWS_SSH = 'C:\\Windows\\System32\\OpenSSH\\ssh.exe';
const SSH = process.platform !== 'win32' ? '/usr/bin/ssh' : fs.existsSync(GIT_SSH) ? GIT_SSH : WINDOWS_SSH;
// No configuration file, no terminal, no input, nothing forwarded, no question asked, one key only.
const SSH_OPTIONS = ['-F', SSH === WINDOWS_SSH ? 'NUL' : '/dev/null', '-T', '-n', '-a', '-x', '-o', 'ClearAllForwardings=yes', '-o', 'BatchMode=yes',
  '-o', 'IdentitiesOnly=yes', '-o', 'ConnectTimeout=10', '-o', 'RequestTTY=no'];

const GESTURE = /^[a-z][a-z0-9-]{0,31}$/;
const ARGUMENT = /^[A-Za-z0-9._-]{1,64}$/;

/**
 * Synchronous, never prints.
 * @param {string[]} argv
 * @returns {{ status: number, out: string, err: string }}
 */
export function runProd(argv, { env = process.env, spawn = spawnSync } = {}) {
  const stop = (err, status = 2) => ({ status, out: '', err: `prod-run: ${err}` });
  try {
    let host;
    try {
      [host] = loadProdConfig(env).hosts;
    } catch (e) {
      return stop(`not configured: ${e.message}`);
    }
    const user = env.LUN_PROD_SSH_USER ?? '';
    const identity = env.LUN_PROD_SSH_IDENTITY ?? '';
    const port = env.LUN_PROD_SSH_PORT ?? '';
    if (!host || !/^[a-z_][a-z0-9_.-]*$/i.test(user) || !identity || identity.startsWith('-') || !/^\d{0,5}$/.test(port)) {
      return stop('not configured: LUN_PROD_SSH_HOSTS, LUN_PROD_SSH_USER and LUN_PROD_SSH_IDENTITY are required (LUN_PROD_SSH_PORT: digits)');
    }
    const [gesture, ...args] = argv;
    if (!GESTURE.test(gesture ?? '') || args.length > 3 || !args.every((a) => ARGUMENT.test(a))) {
      return stop('a gesture is lower-case letters, digits and dashes; an argument is letters, digits, dot, dash, underscore; three arguments at most');
    }
    const target = ['-l', user, ...(port ? ['-p', port] : []), '-i', identity, '--', host, argv.join(' ')];
    const result = spawn(SSH, [...SSH_OPTIONS, ...target], { stdio: 'inherit', shell: false, windowsHide: true });
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
