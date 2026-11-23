// Tests of the door of the prod host (lun-docs#192): tools/prod-gate/prod-gate.sh, played for real by a POSIX sh
// with fake commands, no ssh and no host. The door is the guard: the key of the session is restricted to it by a
// forced command in authorized_keys; sshd gives it the request in SSH_ORIGINAL_COMMAND.
//
// Supposed form of the door (written before the code):
//  - a POSIX sh script, `#!/bin/sh`, no eval, the request read in the variable SSH_ORIGINAL_COMMAND;
//  - a header of instance values, each one assigned once, unconditionally, in single quotes, before the code:
//      LUN_PATH='…:/usr/bin:/bin'  LUN_DEPLOY_DIR  LUN_COPIES  LUN_APPS='app-a app-b app-c'  LUN_VOLUMES='app-a-data …'
//      LUN_ENV_NAMES='APP_SECRET_KEY APP_OTHER_KEY'  LUN_REGISTRY='registry.example.test'  LUN_GATE_LOG='/…/prod-gate.log'
//    (the tests rewrite these lines in a copy; the environment never changes them);
//  - a request is a gesture name then arguments, one plain space apart, in [A-Za-z0-9./_ -], 200 characters at most,
//    four words at most; the table of gestures is the script itself, a block per gesture, the command written out;
//  - exit codes: the command's own code when a gesture ran; 64 request unreadable (empty, absent, characters, length,
//    spaces, words); 65 unknown gesture; 66 argument or number of arguments out of form; 67 the journal cannot be
//    written (nothing runs);
//  - the journal, one line per request: `<UTC date, 2026-11-22T10:00:00Z> <gesture, 32 characters at most, anything
//    outside [A-Za-z0-9._-] shown as ?> accepted|refused`, never the whole request.
// Only generic names here: no real host, account, path or app.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const gatePath = path.join(here, 'prod-gate.sh');
const readmePath = path.join(here, 'README.md');

// dash when there is one (strict POSIX, as on a NAS or in a Linux CI), else the sh of the machine.
const SH = ['dash', 'sh'].find((c) => spawnSync(c, ['-c', 'exit 0']).status === 0) ?? 'sh';
const toSh = (p) => (process.platform === 'win32' ? p.replace(/\\/g, '/').replace(/^([A-Za-z]):/, (_, d) => `/${d.toLowerCase()}`) : p);
const gateText = () => fs.readFileSync(gatePath, 'utf8').replace(/\r\n/g, '\n');

const HEADER = ['LUN_PATH', 'LUN_DEPLOY_DIR', 'LUN_COPIES', 'LUN_APPS', 'LUN_VOLUMES', 'LUN_ENV_NAMES', 'LUN_REGISTRY', 'LUN_GATE_LOG'];

const sandboxes = [];
process.on('exit', () => sandboxes.forEach((d) => fs.rmSync(d, { recursive: true, force: true })));

/** A directory with fake commands that record what they receive, a deploy folder, a copies folder, a journal. */
function sandbox({ logDir } = {}) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-'));
  sandboxes.push(dir);
  const s = { dir };
  for (const sub of ['bin', 'deploy', 'copies', 'state', 'evil']) fs.mkdirSync(path.join(dir, sub));
  s.deploy = toSh(path.join(dir, 'deploy'));
  s.copies = toSh(path.join(dir, 'copies'));
  s.callsFile = path.join(dir, 'state', 'calls');
  s.logFile = path.join(dir, 'state', 'gate.log');
  const record = (name) => `printf '@@ ${name} %s\\n' "$PWD" >> '${toSh(s.callsFile)}'\nfor a in "$@"; do printf '%s\\n' "$a" >> '${toSh(s.callsFile)}'; done\n`;
  // A file `fail-<first arg>-<second arg>` in state/ makes the fake exit with the code it holds.
  const fail = `f='${toSh(path.join(dir, 'state'))}'"/fail-$1-$2"\nif [ -f "$f" ]; then read c < "$f"; exit "$c"; fi\n`;
  const fake = (file, body) => { fs.writeFileSync(file, `#!/bin/sh\n${body}`, { mode: 0o755 }); };
  fake(path.join(dir, 'bin', 'docker'), `${record('docker')}${fail}case " $* " in
  *" ps -q "*) for a in "$@"; do last=$a; done; printf 'id-%s\\n' "$last" ;;
  *" inspect "*) printf 'healthy\\n' ;;
  *" logs "*) printf '%s\\n' "Aucun client appairé. Code d'appairage du premier client : 123456" "Base copiée : /app/data/backups/x.db" "autre ligne" ;;
esac
`);
  for (const name of ['ls', 'free', 'df']) fake(path.join(dir, 'bin', name), `${record(name)}printf 'fake-${name}\\n'\n`);
  fake(path.join(dir, 'deploy', 'deploy.sh'), record('deploy.sh'));
  fs.writeFileSync(path.join(dir, 'deploy', '.env.app-a'), 'APP_SECRET_KEY=abc=def\nAPP_OTHER_KEY=xyz\nTS_AUTHKEY=tskey-secret-value\n');
  fake(path.join(dir, 'evil', 'docker'), `printf evil > '${toSh(path.join(dir, 'state', 'evil-ran'))}'\n`);
  fake(path.join(dir, 'evil', 'date'), `printf evil > '${toSh(path.join(dir, 'state', 'evil-ran'))}'\n`);

  const values = {
    LUN_PATH: `${toSh(path.join(dir, 'bin'))}:/usr/bin:/bin`,
    LUN_DEPLOY_DIR: s.deploy,
    LUN_COPIES: s.copies,
    LUN_APPS: 'app-a app-b app-c',
    LUN_VOLUMES: 'app-a-data app-b-data app-c-data',
    LUN_ENV_NAMES: 'APP_SECRET_KEY APP_OTHER_KEY',
    LUN_REGISTRY: 'registry.example.test',
    LUN_GATE_LOG: toSh(logDir ? path.join(logDir, 'gate.log') : s.logFile),
  };
  let text = gateText();
  for (const name of HEADER) text = text.replace(new RegExp(`^${name}='[^']*'.*$`, 'm'), `${name}='${values[name]}'`);
  s.gate = path.join(dir, 'gate.sh');
  fs.writeFileSync(s.gate, text);
  return s;
}

/** Plays the door with a request; `request === undefined` leaves SSH_ORIGINAL_COMMAND unset. */
function play(s, request, { env = {} } = {}) {
  const r = spawnSync(SH, [toSh(s.gate)], {
    cwd: path.join(s.dir, 'state'),
    env: { PATH: process.env.PATH, ...(request === undefined ? {} : { SSH_ORIGINAL_COMMAND: request }), ...env },
    encoding: 'utf8',
  });
  return { status: r.status, out: r.stdout, err: r.stderr };
}
const callsOf = (s) => {
  if (!fs.existsSync(s.callsFile)) return [];
  const calls = [];
  for (const line of fs.readFileSync(s.callsFile, 'utf8').split('\n')) {
    if (line.startsWith('@@ ')) {
      const [, cmd, ...cwd] = line.split(' ');
      calls.push({ cmd, cwd: cwd.join(' '), args: [] });
    } else if (line !== '' && calls.length) calls.at(-1).args.push(line);
  }
  return calls;
};
const shape = (s) => callsOf(s).map((c) => [c.cmd, ...c.args]);
const logLines = (s) => (fs.existsSync(s.logFile) ? fs.readFileSync(s.logFile, 'utf8').split('\n').filter(Boolean) : []);

// ---------------------------------------------------------------------------------------------------
// 1. Each gesture, with valid arguments, runs exactly the expected command.
// ---------------------------------------------------------------------------------------------------
const GOOD = { app: 'app-a', version: '1.2.3', date: '2026-11-20', envname: 'APP_SECRET_KEY' };
const BAD = {
  app: ['zzz', 'app-d', 'App-a', 'app-a2', 'app', 'app-', '-v', '--volumes', '--rm', '-f', '--help', '..', '.', 'app-a.'],
  version: ['1.2', '1.2.3.4', 'v1.2.3', 'latest', '-1.2.3', '1.2.x', '01', 'Rollback', 'roll-back', '..', '1..2', '1.2.3-rc1'],
  date: ['2026-1-2', '20261120', '2026-11-20x', 'x2026-11-20', '..', 'latest', '2026-11-20-1', '-2026-11-20'],
  envname: ['TS_AUTHKEY', 'APP_SECRET', 'app_secret_key', 'APP_SECRET_KEYS', '-v', 'APP_SECRET_KEY.'],
};
const compose = (...a) => ['docker', 'compose', ...a];
const trial = (...a) => ['docker', 'compose', '-f', 'essai.yaml', ...a];
const gestures = [
  { name: 'ps', slots: [], calls: () => [['docker', 'ps', '--format', '{{.Names}} {{.Status}}']] },
  { name: 'health', slots: ['app'], calls: (s, [a]) => [compose('ps', '-q', a), ['docker', 'inspect', '--format', '{{.State.Health.Status}}', `id-${a}`]], out: /healthy/ },
  { name: 'volumes', slots: [], calls: () => [['docker', 'volume', 'ls', '--format', '{{.Name}}']] },
  { name: 'versions', slots: [], calls: () => [['docker', 'version', '--format', '{{.Server.Version}}'], compose('version', '--short')] },
  { name: 'memory', slots: [], calls: () => [['free', '-m']] },
  { name: 'space', slots: [], calls: (s) => [['df', '-h', s.deploy, s.copies]] },
  { name: 'services', slots: [], calls: () => [compose('config', '--services')] },
  { name: 'copy-line', slots: ['app'], calls: (s, [a]) => [compose('logs', '--tail', '500', a)] },
  { name: 'copies', slots: ['app'], calls: (s, [a]) => [['ls', '-l', `${s.copies}/${a}`]] },
  { name: 'node-time', slots: ['app'], calls: (s, [a]) => [compose('exec', '-T', a, 'node', '-p', 'new Date().toString()')] },
  { name: 'image-digest', slots: ['app'], calls: (s, [a]) => [compose('images', '-q', a)] },
  { name: 'env-length', slots: ['app', 'envname'], calls: () => [] },
  { name: 'up', slots: [], calls: () => [compose('up', '-d')] },
  { name: 'start', slots: ['app'], calls: (s, [a]) => [compose('up', '-d', a)] },
  { name: 'stop', slots: ['app'], calls: (s, [a]) => [compose('stop', a)] },
  { name: 'restart', slots: ['app'], calls: (s, [a]) => [compose('restart', a)] },
  { name: 'pull', slots: [], calls: (s) => [compose('pull'), ['docker', 'logout', 'registry.example.test']] },
  { name: 'volumes-create', slots: [], calls: () => ['app-a-data', 'app-b-data', 'app-c-data'].map((v) => ['docker', 'volume', 'create', v]) },
  { name: 'deploy', slots: ['app', 'version'], calls: (s, [a, v]) => [['deploy.sh', a, v]] },
  { name: 'trial-load', slots: ['app', 'date'], calls: (s, [a, d]) => [trial('run', '--rm', '--entrypoint', 'cp', `essai-${a}`, `/copies/${a}-${d}.db`, `data/${a}.db`)] },
  { name: 'trial-up', slots: ['app'], calls: (s, [a]) => [trial('up', '-d', `essai-${a}`)] },
  { name: 'trial-health', slots: ['app'], calls: (s, [a]) => [trial('ps', '-q', `essai-${a}`), ['docker', 'inspect', '--format', '{{.State.Health.Status}}', `id-essai-${a}`]] },
];
const goodArgs = (g) => g.slots.map((k) => GOOD[k]);
const requestOf = (g, args = goodArgs(g)) => [g.name, ...args].join(' ');

for (const g of gestures) {
  test(`gesture ${g.name}: valid arguments run exactly the expected command`, () => {
    const s = sandbox();
    const r = play(s, requestOf(g));
    assert.equal(r.status, 0, r.err);
    assert.deepEqual(shape(s), g.calls(s, goodArgs(g)));
    if (g.out) assert.match(r.out, g.out);
    for (const c of callsOf(s)) {
      if (c.cmd === 'deploy.sh' || (c.cmd === 'docker' && c.args[0] === 'compose')) assert.equal(c.cwd, s.deploy, `${c.cmd} runs in the deploy folder`);
    }
    assert.deepEqual(logLines(s).length, 1);
  });
}
test('gesture deploy: the word rollback, on each app of the list', () => {
  for (const a of ['app-a', 'app-b', 'app-c']) {
    const s = sandbox();
    assert.equal(play(s, `deploy ${a} rollback`).status, 0);
    assert.deepEqual(shape(s), [['deploy.sh', a, 'rollback']]);
  }
  const s = sandbox();
  assert.equal(play(s, 'deploy app-b 10.20.30').status, 0);
  assert.deepEqual(shape(s), [['deploy.sh', 'app-b', '10.20.30']]);
});
test('gesture env-length: the length of one value, never the value', () => {
  const s = sandbox();
  const r = play(s, 'env-length app-a APP_SECRET_KEY');
  assert.equal(r.status, 0, r.err);
  assert.equal(r.out.trim(), '7');
  assert.equal(play(s, 'env-length app-a APP_OTHER_KEY').out.trim(), '3');
  for (const text of [r.out, r.err, ...logLines(s)]) assert.doesNotMatch(text, /abc|def|xyz|tskey/);
  const missingFile = play(s, 'env-length app-b APP_SECRET_KEY');
  assert.doesNotMatch(missingFile.out + missingFile.err, /abc|def|xyz|tskey/);
  assert.deepEqual(shape(s), []);
});
test('gesture copy-line: only the fixed line of the log, never the pairing code', () => {
  const s = sandbox();
  const r = play(s, 'copy-line app-a');
  assert.equal(r.status, 0, r.err);
  assert.match(r.out, /Base copiée/);
  assert.doesNotMatch(r.out + r.err, /123456|appairage|autre ligne/);
});
test('gesture pull: the registry is left even when the pull fails, and the pull code is returned', () => {
  const s = sandbox();
  fs.writeFileSync(path.join(s.dir, 'state', 'fail-compose-pull'), '5');
  const r = play(s, 'pull');
  assert.equal(r.status, 5);
  assert.deepEqual(shape(s), [compose('pull'), ['docker', 'logout', 'registry.example.test']]);
});
test('the code of the command is returned when a gesture ran', () => {
  const s = sandbox();
  fs.writeFileSync(path.join(s.dir, 'state', 'fail-ps---format'), '3');
  assert.equal(play(s, 'ps').status, 3);
  assert.equal(logLines(s).length, 1);
});
test('gesture node-time: the expression is fixed in the door', () => {
  const s = sandbox();
  play(s, 'node-time app-b');
  assert.deepEqual(shape(s), [compose('exec', '-T', 'app-b', 'node', '-p', 'new Date().toString()')]);
});

// gestes and version
const listed = (r) => r.out.split('\n').filter((l) => l.trim());
test('gestes lists the names and the arguments of the gestures, runs nothing, and shows no instance value', () => {
  const s = sandbox();
  const r = play(s, 'gestes');
  assert.equal(r.status, 0, r.err);
  assert.deepEqual(shape(s), []);
  const names = new Map(listed(r).map((l) => [l.trim().split(/\s+/)[0], l]));
  for (const g of gestures) {
    assert.ok(names.has(g.name), `${g.name} is listed`);
    assert.equal((names.get(g.name).match(/<[^>]+>/g) ?? []).length, g.slots.length, names.get(g.name));
  }
  for (const n of names.keys()) assert.ok(gestures.some((g) => g.name === n) || ['gestes', 'version'].includes(n), `unexpected gesture ${n}`);
  assert.doesNotMatch(r.out, /registry\.example|\/srv\/|app-a|essai\.yaml|sandbox|gate-/);
  assert.equal(logLines(s).length, 1);
});
test('version prints one number, runs nothing, and is journaled', () => {
  const s = sandbox();
  const r = play(s, 'version');
  assert.equal(r.status, 0, r.err);
  assert.match(r.out.trim(), /^\d+(\.\d+)*$/);
  assert.deepEqual(shape(s), []);
  assert.equal(logLines(s).length, 1);
});

// ---------------------------------------------------------------------------------------------------
// 2. Hostile input: nothing runs.
// ---------------------------------------------------------------------------------------------------
// Outside the narrow character set: refused as an unreadable request, 64.
const HOSTILE = [
  ';id', 'x;id', '&id', 'x&&id', 'x||id', 'x|id', '>x', 'x>y', '<x', '$(id)', 'x$(id)', '`id`', '$HOME', '${HOME}', '"x"', "'x'", 'x"y', "x'y",
  'x\ny', 'x\ry', 'x\ty', 'x\u000by', '*', '?', '[a]', 'x*', '{a,b}', '~', 'x~', '\\x', 'x\\', '\\0', '%00', 'é', 'xé', '\u200b', '\u202e', 'x\u2028y', '!', '#', '(x)', '=',
];
const isSlotRequest = (g, i, value) => [g.name, ...g.slots.map((k, j) => (j === i ? value : GOOD[k]))].join(' ');
const SUBSET = [';id', '$(id)', '`id`', 'x\ny', '*', 'é', '"x"', '\\x'];
// Each play of the door is a process: the whole lists are played on gestures of every shape (no argument, one app,
// an app and a version, an app and a date, an app and a name), a short list on the others.
const FULL = new Set(['ps', 'health', 'deploy', 'trial-load', 'env-length']);
for (const g of gestures) {
  test(`gesture ${g.name}: every kind of hostile input runs nothing and is refused`, () => {
    const s = sandbox();
    for (const value of FULL.has(g.name) ? HOSTILE : SUBSET) {
      // The first argument, or an extra one for a gesture without arguments.
      const req = g.slots.length ? isSlotRequest(g, 0, value) : `${g.name} ${value}`;
      const r = play(s, req);
      assert.equal(r.status, 64, `${JSON.stringify(req)}: ${r.status} ${r.err}`);
      assert.equal(r.out, '', JSON.stringify(req));
    }
    for (let i = 1; i < g.slots.length; i++) {
      for (const value of SUBSET) assert.equal(play(s, isSlotRequest(g, i, value)).status, 64, JSON.stringify(isSlotRequest(g, i, value)));
    }
    for (const value of SUBSET) assert.equal(play(s, `${requestOf(g)} ${value}`).status, 64);
    assert.deepEqual(shape(s), [], 'nothing ran');
    assert.ok(!fs.existsSync(path.join(s.dir, 'state', 'evil-ran')));
  });
  test(`gesture ${g.name}: an argument out of form, a missing or an extra argument, runs nothing, 66`, () => {
    const s = sandbox();
    g.slots.forEach((kind, i) => {
      for (const value of FULL.has(g.name) ? BAD[kind] : BAD[kind].slice(0, 4)) {
        const req = isSlotRequest(g, i, value);
        const r = play(s, req);
        assert.equal(r.status, 66, `${JSON.stringify(req)}: ${r.status} ${r.err}`);
      }
    });
    if (g.slots.length) assert.equal(play(s, [g.name, ...goodArgs(g).slice(0, -1)].join(' ')).status, 66, 'one argument missing');
    assert.equal(play(s, `${requestOf(g)} app-a`).status, 66, 'one argument too many');
    assert.deepEqual(shape(s), [], 'nothing ran');
  });
}
test('an option stands for no argument, whatever the gesture', () => {
  const s = sandbox();
  for (const g of gestures.filter((x) => x.slots.length)) {
    for (const opt of ['-v', '--volumes', '--rm']) {
      for (let i = 0; i < g.slots.length; i++) assert.equal(play(s, isSlotRequest(g, i, opt)).status, 66, `${g.name} ${opt}`);
    }
  }
  for (const g of gestures.filter((x) => !x.slots.length)) {
    for (const opt of ['-v', '--volumes', '--rm']) assert.equal(play(s, `${g.name} ${opt}`).status, 66, `${g.name} ${opt}`);
  }
  assert.deepEqual(shape(s), []);
});

test('an unknown gesture, and what a client would send as a command, run nothing: 65', () => {
  const s = sandbox();
  for (const req of [
    'zzz', 'PS', 'Ps', 'docker', 'docker ps', 'docker volume rm app-a-data', 'docker system prune -af', 'sh', 'bash', 'sh -c ls', 'cat /etc/passwd', 'sudo ls', 'su',
    'rm -rf /', 'ls', 'id', 'env', 'printenv', 'node -e 1', 'python3', 'ssh other-host', 'ps2', 'gestes2', 'version2', 'deploys app-a 1.2.3',
    'scp -t /tmp/x', 'scp -f /srv/x', 'scp -r -t /x', 'internal-sftp', 'sftp-server', '/usr/lib/openssh/sftp-server', '/usr/libexec/sftp-server',
    'rsync --server . /x', 'mysecure-shell', '-v', '--help', '.', '..', '/', './prod-gate.sh', 'prod-gate.sh gestes',
    'down', 'prune', 'volume-rm app-a-data', 'exec app-a sh', 'logs app-a', 'inspect app-a', 'config', 'env-file app-a', 'cp app-a x', 'run app-a', 'trial-down app-a',
  ]) {
    const r = play(s, req);
    assert.equal(r.status, 65, `${JSON.stringify(req)}: ${r.status} ${r.err}`);
    assert.equal(r.out, '');
  }
  assert.deepEqual(shape(s), []);
});

test('an empty, absent or blank request is an interactive session: refused, 64', () => {
  const s = sandbox();
  for (const req of [undefined, '', ' ', '  ', '\n', '\t']) {
    const r = play(s, req);
    assert.equal(r.status, 64, JSON.stringify(req));
    assert.equal(r.out, '');
  }
  assert.deepEqual(shape(s), []);
  assert.equal(logLines(s).length, 6, 'each refusal is journaled');
});
test('too long a request, too many words, and spaces that are not single, are refused: 64', () => {
  const s = sandbox();
  for (const req of [
    `ps ${'a'.repeat(300)}`, 'a'.repeat(1000), `ps${' a'.repeat(200)}`, `health ${'a'.repeat(5000)}`, 'ps a b c d', 'deploy app-a 1.2.3 x y', 'ps a b c d e f g h i j',
    ' ps', 'ps ', 'health  app-a', 'health app-a ', ' health app-a', 'health\tapp-a', 'deploy app-a  1.2.3',
  ]) {
    const r = play(s, req);
    assert.equal(r.status, 64, `${JSON.stringify(req).slice(0, 60)}: ${r.status}`);
  }
  assert.deepEqual(shape(s), []);
});
test('a request that nearly holds is not mistaken: a long valid argument is out of form, not a crash', () => {
  const s = sandbox();
  assert.equal(play(s, `health ${'a'.repeat(100)}`).status, 66);
  assert.deepEqual(shape(s), []);
});

// ---------------------------------------------------------------------------------------------------
// 3. The door does not depend on the environment of the session, and fails closed.
// ---------------------------------------------------------------------------------------------------
test('the values of the instance are in the door: the environment changes none, nor the search path', () => {
  const s = sandbox();
  const env = {
    LUN_APPS: 'zzz', LUN_DEPLOY_DIR: '/tmp/evil', LUN_COPIES: '/tmp/evil', LUN_GATE_LOG: '/tmp/evil.log', LUN_PATH: '/tmp/evil', LUN_VOLUMES: 'evil',
    LUN_ENV_NAMES: 'TS_AUTHKEY', LUN_REGISTRY: 'evil.example.test', PATH: `${path.join(s.dir, 'evil')}${path.delimiter}${process.env.PATH}`,
    IFS: 'a-', ENV: '/tmp/evil.sh', BASH_ENV: '/tmp/evil.sh', CDPATH: '/tmp', SHELLOPTS: 'xtrace', POSIXLY_CORRECT: '1',
  };
  assert.equal(play(s, 'start zzz', { env }).status, 66);
  assert.equal(play(s, 'env-length app-a TS_AUTHKEY', { env }).status, 66);
  assert.equal(play(s, 'start app-a', { env }).status, 0);
  assert.equal(play(s, 'pull', { env }).status, 0);
  assert.deepEqual(shape(s), [compose('up', '-d', 'app-a'), compose('pull'), ['docker', 'logout', 'registry.example.test']]);
  assert.ok(!fs.existsSync(path.join(s.dir, 'state', 'evil-ran')));
  assert.equal(logLines(s).length, 4);
});
test('the journal cannot be written: nothing runs, 67', () => {
  const s = sandbox({ logDir: path.join(os.tmpdir(), 'gate-no-such-dir', 'sub') });
  for (const req of ['ps', 'start app-a', 'deploy app-a 1.2.3']) {
    const r = play(s, req);
    assert.equal(r.status, 67, req);
    assert.equal(r.out, '');
  }
  assert.deepEqual(shape(s), []);
});

// ---------------------------------------------------------------------------------------------------
// 4. The journal.
// ---------------------------------------------------------------------------------------------------
test('the journal: one line per request, the date, the gesture cut short, accepted or refused, never the whole request', () => {
  const s = sandbox();
  play(s, 'ps');
  play(s, 'deploy app-a 1.2.3');
  play(s, 'health zzz');
  play(s, 'volume-rm-everything');
  play(s, `health $(id) ${'a'.repeat(400)}`);
  play(s, 'ps\nstart app-a');
  play(s, '');
  const lines = logLines(s);
  assert.equal(lines.length, 7, lines.join(' | '));
  for (const l of lines) {
    assert.match(l, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ \S* (accepted|refused)$/, l);
    assert.ok(l.length <= 100, `short: ${l.length}`);
  }
  assert.match(lines[0], / ps accepted$/);
  assert.match(lines[1], / deploy accepted$/);
  assert.match(lines[2], / health refused$/);
  assert.match(lines[3], / volume-rm-everything refused$/);
  assert.doesNotMatch(lines.join('\n'), /\$\(|aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa|1\.2\.3|app-a|zzz/);
  const long = play(s, `${'g'.repeat(150)}`);
  assert.equal(long.status, 65);
  assert.ok(logLines(s).at(-1).length <= 100);
});
test('the journal is appended to, not rewritten', () => {
  const s = sandbox();
  fs.writeFileSync(s.logFile, '2026-11-21T08:00:00Z earlier accepted\n');
  play(s, 'ps');
  const lines = logLines(s);
  assert.equal(lines.length, 2);
  assert.equal(lines[0], '2026-11-21T08:00:00Z earlier accepted');
});

// ---------------------------------------------------------------------------------------------------
// 5. The text of the door: what it proves, and what it does not.
//    It reads the code, comments aside. It proves that no forbidden command is written in the door, and that a value
//    of the request is never expanded unquoted outside one reading line. It does not prove that the door is right:
//    the behaviour tests above do, and CrOliX reads the door.
// ---------------------------------------------------------------------------------------------------
const codeLines = () => gateText().split('\n')
  .map((l) => l.replace(/(^|\s)#.*$/, '$1'))
  .filter((l) => l.trim())
  .map((l) => l.replace(/--entrypoint cp\b/g, '--entrypoint ENTRY'));
const FORBIDDEN = [
  [/\beval\b/, 'eval'],
  [/(^|[\s;|&(`$])(sudo|su|doas|pkexec)(\s|$)/, 'privilege'],
  [/(^|[\s;|&(`$])(rm|rmdir|mv|cp|dd|shred|truncate|unlink|mkfs|tee|ln|install|touch|mkdir)(\s|$)/, 'erases, moves, copies or writes files'],
  [/\bdown\b/, 'down'],
  [/\bprune\b/, 'prune'],
  [/\bvolume\s+(rm|remove)\b/, 'volume rm'],
  [/--volumes\b|\s-V\b|--renew-anon-volumes|--rmi\b|--remove-orphans/, 'erasing option'],
  [/\b(docker|compose)\b.*\s(cp|kill|rm|rename|commit|export|save|load|import|build|push|login|network|system|context|swarm|secret|config\s+(?!--services))\b/, 'a docker verb that erases, reaches, or shows'],
  [/(^|[\s;|&(`])(sh|bash|dash|ash|zsh|ksh|fish|busybox|python3?|perl|ruby|php)(\s|$)/, 'an interpreter'],
  [/\bnode\s+-e\b|\bnode\s+[^-\s]/, 'node other than the fixed -p'],
  [/\s-[a-z]*[it]{1,2}[a-z]*\s|--interactive|--tty|--privileged|--user\b|\b(docker|compose)\b.*\s-u\s|--env\b|--env-file|--pid|--cap-add|--device/, 'a terminal, a privilege or an environment'],
  [/(^|[\s;|&(`$])(cat|more|less|head|tail|strings|xxd|od|base64|printenv|env|set\s+-x)(\s|$)/, 'shows a file or an environment'],
  [/\b(journalctl|dmesg)\b/, 'raw log'],
  [/(^|[\s;|&(`$])(ssh|scp|sftp|rsync|socat|nc|ncat|netcat|telnet|curl|wget)(\s|$)/, 'opens a connection'],
  [/(^|[\s;|&(`$])(chmod|chown|chgrp|systemctl|service|reboot|shutdown|halt|poweroff|mount|umount|sysctl|iptables|nft|ufw|crontab|useradd|usermod|userdel|passwd|apt|apt-get|dpkg|kill|killall|pkill)(\s|$)/, 'changes the system'],
  [/\bfind\b|\bxargs\b|\bsource\b|(^|[\s;])\.\s+\S/, 'runs something else'],
];
for (const [re, why] of FORBIDDEN) {
  test(`the text of the door holds no ${why}`, () => {
    const hits = codeLines().filter((l) => re.test(l));
    assert.deepEqual(hits, []);
  });
}
test('the text of the door: every docker inspect has a format, every config is --services, every log goes through grep -F', () => {
  const code = codeLines();
  for (const l of code.filter((x) => /\binspect\b/.test(x))) assert.match(l, /--format\s+'[^']*'/, l);
  for (const l of code.filter((x) => /\bconfig\b/.test(x))) assert.match(l, /config --services/, l);
  for (const l of code.filter((x) => /\blogs\b/.test(x))) assert.match(l, /logs --tail \d+ .*\| *grep -F '[^']{3,}'/, l);
  for (const l of code.filter((x) => /\bexec\b.*\bnode\b/.test(x))) assert.match(l, /node -p 'new Date\(\)\.toString\(\)'/, l);
});
test('the text of the door: the values of the request are always quoted, and read once, with globbing off', () => {
  const text = gateText();
  const code = codeLines();
  // Variables that carry what the session sent.
  // The positional parameters count: `set -- $request` makes them the words of the request.
  const carried = /\$\{?(?:(?:SSH_ORIGINAL_COMMAND|request|gesture|arg1|arg2|arg3|arg|REQUEST|GESTURE|ARG1|ARG2|ARG3)\b|[1-9@*])/g;
  const unquoted = [];
  for (const line of code) {
    if (/^\s*\w+=\$(\{[^}]*\}|\w+)\s*$/.test(line)) continue; // a plain assignment is not split
    let dq = false;
    let sq = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === "'" && !dq) sq = !sq;
      else if (c === '"' && !sq) dq = !dq;
      else if (c === '$' && !dq && !sq) {
        carried.lastIndex = i;
        const m = carried.exec(line);
        if (m && m.index === i) unquoted.push(line.trim());
      }
    }
  }
  // One reading line may split the request, after the character check: `set -- $request`, with `set -f` before it.
  const reading = unquoted.filter((l) => /^set\s+--\s+\$\{?request\}?$/.test(l));
  assert.deepEqual(unquoted.filter((l) => !reading.includes(l)), [], 'a value of the request used unquoted');
  assert.ok(reading.length <= 1, 'one reading line at most');
  if (reading.length) assert.match(text, /\bset\s+-f\b/, 'globbing is off before the split');
  assert.ok(!codeLines().some((l) => /\bIFS\s*=/.test(l)), 'no custom IFS');
});
test('the text of the door: a POSIX sh script, readable at a glance, a header of instance values only', () => {
  const text = gateText();
  assert.match(text, /^#!\/bin\/sh\n/);
  const bashisms = codeLines().filter((l) => /\[\[|<<<|\bdeclare\b|(^|\s)local\s|\bmapfile\b|\$'|\bfunction\s+\w+|\becho\s+-e\b|\[[^\]]*==|<\(|\bselect\s+\w+\s+in\b/.test(l));
  assert.deepEqual(bashisms, [], 'POSIX sh only');
  assert.ok(text.split('\n').length <= 260, 'short enough to be read at a glance');
  const lines = text.split('\n');
  const firstUse = lines.findIndex((l) => /SSH_ORIGINAL_COMMAND/.test(l) && !/^\s*#/.test(l));
  assert.ok(firstUse > 0, 'the door reads SSH_ORIGINAL_COMMAND');
  for (const name of HEADER) {
    const at = lines.flatMap((l, i) => (new RegExp(`^${name}=`).test(l) ? [i] : []));
    assert.equal(at.length, 1, `${name} is assigned once`);
    assert.ok(at[0] < firstUse, `${name} is in the header`);
    assert.match(lines[at[0]], new RegExp(`^${name}='[^'$\`\\\\]*'\\s*(#.*)?$`), `${name} is a plain single-quoted value`);
  }
  assert.doesNotMatch(text, /:-|:=|\$\{LUN_[A-Z_]+[-+=?]/, 'no value taken from the environment');
  const values = HEADER.map((n) => lines.find((l) => l.startsWith(`${n}=`)) ?? '').join('\n');
  assert.doesNotMatch(values, /anima|acedia|avaritia|luxuria|ugreen|ugos|natsume|loric|ghcr\.io|\d+\.\d+\.\d+\.\d+/i, 'examples only');
});
test('the text of the door passes sh -n, and a shell checker when the machine has one', (t) => {
  const s = sandbox();
  const syntax = spawnSync(SH, ['-n', toSh(s.gate)], { encoding: 'utf8' });
  assert.equal(syntax.status, 0, syntax.stderr);
  const sh2 = spawnSync('sh', ['-n', toSh(s.gate)], { encoding: 'utf8' });
  assert.equal(sh2.status, 0, sh2.stderr);
  const check = spawnSync('shellcheck', ['--version'], { encoding: 'utf8' });
  if (check.status !== 0) { t.diagnostic('shellcheck is not installed here: not run'); return; }
  const r = spawnSync('shellcheck', ['-s', 'sh', '-S', 'warning', s.gate], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout);
});

// ---------------------------------------------------------------------------------------------------
// 6. The line of authorized_keys, in the doc: a forced command and the general restriction.
// ---------------------------------------------------------------------------------------------------
test('the README gives the authorized_keys line: the forced command and the restriction, nothing that opens', () => {
  const doc = fs.readFileSync(readmePath, 'utf8');
  const line = doc.split('\n').find((l) => /\bssh-(ed25519|rsa)\b|ecdsa-sha2/.test(l) && /command=/.test(l));
  assert.ok(line, 'a line with options, command= and a key');
  const options = line.trim().replace(/^`+/, '').split(/\s+(?=ssh-|ecdsa-)/)[0];
  assert.match(options, /(^|,)restrict(,|$)/, 'restrict');
  assert.match(options, /(^|,)command="[^"]*prod-gate\.sh"(,|$)/, 'the forced command is the door');
  for (const opened of ['pty', 'port-forwarding', 'agent-forwarding', 'X11-forwarding', 'user-rc', 'permitopen', 'permitlisten', 'tunnel']) {
    assert.doesNotMatch(options, new RegExp(`(^|,)${opened}(=|,|$)`, 'i'), `${opened} stays closed`);
  }
  assert.match(line, /example/i, 'the key is an example');
  assert.doesNotMatch(line, /AAAA[0-9A-Za-z+/]{60,}/, 'no real key blob');
  assert.doesNotMatch(doc, /\b\d{1,3}(\.\d{1,3}){3}\b(?<!192\.0\.2\.\d+)/, 'no real address');
});
test('the README says how to put the door, how to check it holds, what it does not close, and how to remove it', () => {
  const doc = fs.readFileSync(readmePath, 'utf8');
  assert.match(doc, /poser|installer/i);
  assert.match(doc, /refus attendu|refusé|refus/i);
  assert.match(doc, /ne ferme pas/i);
  assert.match(doc, /retirer|retrait/i);
  assert.match(doc, /filet/i, 'the laptop belt is said not to be the guard');
  assert.match(doc, /hors d'atteinte|hors de portée/i, 'the door sits out of reach of the account of the session');
});

// ---------------------------------------------------------------------------------------------------
// 7. Found while attacking the door.
// ---------------------------------------------------------------------------------------------------
/** A sandbox whose fake docker also records two variables of its environment and one line of its input. */
function probing() {
  const s = sandbox();
  const probe = toSh(path.join(s.dir, 'state', 'probe'));
  fs.writeFileSync(path.join(s.dir, 'bin', 'docker'),
    `#!/bin/sh\nprintf 'host=%s file=%s project=%s input=' "\${DOCKER_HOST-}" "\${COMPOSE_FILE-}" "\${COMPOSE_PROJECT_NAME-}" >> '${probe}'\nif read -r l; then printf '%s' "$l" >> '${probe}'; fi\nprintf '\\n' >> '${probe}'\n`,
    { mode: 0o755 });
  s.probe = () => fs.readFileSync(path.join(s.dir, 'state', 'probe'), 'utf8');
  return s;
}
test('the container engine is not pointed elsewhere by the environment', () => {
  const s = probing();
  const env = { DOCKER_HOST: 'tcp://evil.example.test:2375', DOCKER_CONTEXT: 'evil', COMPOSE_FILE: '/tmp/evil.yaml', COMPOSE_PROJECT_NAME: 'evil' };
  assert.equal(play(s, 'stop app-a', { env }).status, 0);
  assert.equal(s.probe(), 'host= file= project= input=\n');
});
test('the input of the session reaches no command', () => {
  const s = probing();
  const r = spawnSync(SH, [toSh(s.gate)], { cwd: path.join(s.dir, 'state'), env: { PATH: process.env.PATH, SSH_ORIGINAL_COMMAND: 'stop app-a' }, input: 'a line from the session\n', encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  assert.equal(s.probe(), 'host= file= project= input=\n');
});
test('a date out of the calendar is out of form', () => {
  const s = sandbox();
  for (const d of ['9999-99-99', '2026-20-01', '2026-11-40']) assert.equal(play(s, `trial-load app-a ${d}`).status, 66, d);
  assert.deepEqual(shape(s), []);
});
test('an app that is a piece of another, the word --, a joker that matches a file: nothing runs', () => {
  const s = sandbox();
  fs.writeFileSync(path.join(s.dir, 'state', 'app-a'), '');
  for (const [req, code] of [['stop app', 66], ['stop a', 66], ['stop app-ab', 66], ['stop app-a.app-b', 66], ['stop --', 66], ['stop -- app-a', 66],
    ['-- ps', 65], ['stop app-?', 64], ['stop app-*', 64], ['env-length ../app-a APP_SECRET_KEY', 66], ['env-length app-a .', 66],
    ['trial-load app-a 2026-11-20/..', 66], ['deploy app-a ...', 66], ['deploy app-a 1.2.3/x', 66]]) {
    assert.equal(play(s, req).status, code, req);
  }
  assert.deepEqual(shape(s), []);
});
test('a command the host does not have: its own failure, journaled, nothing else', () => {
  const s = sandbox();
  fs.rmSync(path.join(s.dir, 'bin', 'free'));
  const r = play(s, 'memory');
  // 127 when no `free` exists at all; the machine of the test may have its own in /usr/bin.
  assert.ok(r.status === 127 || r.status === 0, String(r.status));
  assert.deepEqual(shape(s), []);
  assert.match(logLines(s)[0], / memory accepted$/);
});
test('twenty requests at once leave twenty whole lines in the journal', async () => {
  const s = sandbox();
  const { spawn } = await import('node:child_process');
  await Promise.all(Array.from({ length: 20 }, () => new Promise((resolve) => {
    spawn(SH, [toSh(s.gate)], { env: { PATH: process.env.PATH, SSH_ORIGINAL_COMMAND: 'version' }, stdio: 'ignore' }).on('close', resolve);
  })));
  const lines = logLines(s);
  assert.equal(lines.length, 20);
  for (const l of lines) assert.match(l, /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ version accepted$/);
});
