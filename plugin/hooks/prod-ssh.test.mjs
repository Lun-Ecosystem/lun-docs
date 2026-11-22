// Tests of the laptop side of the prod guard (lun-docs#192), third design.
// The guard proper is the door on the prod host (tools/prod-gate/, its own tests). The laptop keeps a belt
// against a mistake, not against a session that goes around it:
//  - guard.mjs refuses any command line, and any written text, that names a declared prod host (on name
//    boundaries), plus an ssh-like client whose target cannot be read, an encoded command, a remote
//    container engine;
//  - prod-run.mjs <gesture> [args...] starts ssh toward the host of the configuration, and nothing else.
// Supposed API:
//   prod-ssh.mjs  loadProdConfig(env) -> { hosts }; throws on a host too short or too common. Env: LUN_PROD_SSH_HOSTS.
//   prod-run.mjs  runProd(argv, { env, spawn }) -> { status, out, err } (synchronous, never prints). Env: LUN_PROD_SSH_HOSTS
//                 (the first is the target), LUN_PROD_SSH_USER, LUN_PROD_SSH_PORT (optional), LUN_PROD_SSH_IDENTITY.
//   guard.mjs     evaluateCommand(command, { cwd, prod: { hosts } }), evaluateWrite(filePath, { cwd, prod }, written[]).
// Only generic names here: no real host, user, path or alias.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as guard from './guard.mjs';

const { evaluateCommand } = guard;
const missing = (name) => () => { throw new Error(`${name} is missing`); };
const { loadProdConfig = missing('loadProdConfig') } = await import('./prod-ssh.mjs').catch(() => ({}));
const { runProd = missing('runProd') } = await import('./prod-run.mjs').catch(() => ({}));
const evaluateWrite = guard.evaluateWrite ?? missing('evaluateWrite');

const here = path.dirname(fileURLToPath(import.meta.url));
const guardPath = path.join(here, 'guard.mjs');
const runPath = path.join(here, 'prod-run.mjs');

const hosts = ['nas-prod', '192.0.2.1', 'stage'];
const prod = { hosts };
// An explicit undefined stays undefined (no prod data), it does not fall back to the default.
const on = (command, ...p) => evaluateCommand(command, { cwd: '/repo', prod: p.length ? p[0] : prod });
const blocked = (command, ...p) => {
  const r = on(command, ...p);
  assert.equal(r.block, true, `should be blocked: ${JSON.stringify(command)}`);
  assert.ok(r.reason && r.reason.length > 0);
  return r;
};
const allowed = (command, ...p) => assert.equal(on(command, ...p).block, false, `should pass: ${JSON.stringify(command)}`);

// ---------------------------------------------------------------------------------------------------
// 1. The mention rule: a declared host named anywhere in a line is refused, whatever the form.
// ---------------------------------------------------------------------------------------------------
const mentions = [
  'echo nas-prod', 'ssh nas-prod id', 'git commit -m "docs: nas-prod is slow"', 'echo "# nas-prod"', 'NAS-PROD', 'echo Nas-Prod',
  'curl http://nas-prod.local/x', 'echo nas-prod.local', 'echo nas-prod.', 'Write-Output nas-prod', 'echo pilot@nas-prod:/x',
  'echo [nas-prod]', 'echo nas-prod;', 'echo nas-prod,other', 'echo (nas-prod)',
  'ping 192.0.2.1', 'ssh pilot@192.0.2.1', 'curl http://192.0.2.1:8080/x', 'echo ssh://192.0.2.1:2200', 'echo 192.0.2.1.', 'echo "192.0.2.1"',
  'echo 192.0.2.1/24', 'echo 192.0.2.1:22', 'echo stage', 'echo STAGE', 'ssh stage id',
  // Obfuscated names that a shell glues back: quotes, escapes, control characters, invisible characters.
  'echo nas-pr\\od', "echo 'nas-pr''od'", 'echo nas-pr"o"d', "echo nas-pr'o'd", 'echo nas-pr\rod', 'echo nas-pr\nod',
  'echo nas-pr\u0000od', 'echo nas-pr\u200bod', 'echo nas-pr\ufeffod', 'echo nas-pr\u00adod', 'echo nas-pr`od', 'echo nas-pr^od',
  'echo n"as"-"pr"od', 'echo "nas-prod"', "echo 'NAS-PROD'", 'echo 192.0.2.1\\', 'echo 19"2.0.2".1', 'echo 192.0.2.1\r0', 'echo 192.0.2.1\n0',
];
for (const c of mentions) test(`mention refused: ${JSON.stringify(c)}`, () => blocked(c));

// Name boundaries: a declared host that is a piece of a longer word or a longer address names something else.
const notMentions = [
  'echo nas-product', 'echo nas-prods', 'echo nas-prod2', 'echo nas-prod_old', 'echo xnas-prod', 'echo my-nas-prod', 'echo nas-prod-backup',
  'echo 192.0.2.10', 'ping 192.0.2.100', 'echo 1192.0.2.1', 'echo 10.192.0.2.1', 'echo 192.0.2.1.5', 'echo 192.0.2.12:22',
  'echo stagecoach', 'echo backstage', 'echo stages', 'echo stage2', 'echo stage_old', 'echo pre-stage', 'echo stage-env', 'git checkout feat/staged',
];
for (const c of notMentions) test(`not a mention (name boundaries): ${JSON.stringify(c)}`, () => allowed(c));

// The six families of attacks of the review, replayed. All of them name the host: all refused.
const attacks = {
  A: ['ssh nas-prod "docker volume create api"\r"; docker volume rm data"'],
  B: ["echo #'\nssh nas-prod docker volume rm data\n#'"],
  C: ["echo “it's”; ssh nas-prod docker volume rm data; echo “it's”"],
  D: [
    '$(which ssh) nas-prod docker volume rm data', 'S=ssh; $S nas-prod docker volume rm data', "$'ssh' nas-prod docker volume rm data",
    '/usr/bin/ss[h].exe nas-prod docker volume rm data', "& ('s'+'sh') nas-prod docker volume rm data",
    '[scriptblock]::Create("ssh nas-prod docker volume rm data").Invoke()',
    "Start-Process cmd -ArgumentList '/c ssh nas-prod docker volume rm data'", 'cmd /c s^sh nas-prod docker volume rm data',
  ],
  E: [
    "git ls-remote --upload-pack='docker volume rm data;:' nas-prod:/x",
    "git -c protocol.ext.allow=always ls-remote 'ext::ssh nas-prod docker volume rm data'",
    'curl -s sftp://nas-prod/srv/app/app.env', 'podman --url ssh://u@nas-prod/run/podman/podman.sock volume rm data',
    'putty -ssh nas-prod -m script',
  ],
  F: ['ssh nas-prod "docker compose -f /srv/app/compose.yaml stop >&1api"'],
};
for (const [family, commands] of Object.entries(attacks)) {
  commands.forEach((c, i) => test(`attack ${family}${i + 1} refused`, () => blocked(c)));
}

// What the rule does not name, it cannot see; the choice here: an encoded command is refused outright.
for (const c of ['powershell -EncodedCommand AAAA', 'pwsh -enc AAAA', 'powershell.exe -e AAAA', 'pwsh -ec AAAA',
  'powershell -NoProfile -EncodedCommand AAAA', 'echo c3No | base64 -d | sh', 'echo c3No | base64 --decode | bash']) {
  test(`encoded command refused when hosts are declared: ${c}`, () => blocked(c));
}
test('encoded command passes without hosts, and base64 alone passes', () => {
  allowed('powershell -EncodedCommand AAAA', { hosts: [] });
  allowed('echo c3No | base64 -d');
});

// An ssh-like client whose target cannot be read: refused when hosts are declared.
const unreadable = [
  'ssh $HOST id', 'ssh "$HOST" id', 'ssh ${HOST} id', 'ssh $(cat h) id', 'ssh `cat h` id', 'ssh $env:NAS id', 'ssh @args', 'ssh', 'ssh -T',
  'ssh -p 22 $H', 'ssh $H -p 22', 'scp f $H:/tmp', 'rsync -av f $H:/x', 'sftp $H', 'sshfs $H:/ mnt', 'mosh $H', 'autossh $H', 'plink $H', 'putty $H',
  '/usr/bin/ssh $H id', 'ssh.exe $H id', 'C:\\Windows\\System32\\OpenSSH\\ssh.exe $H id', 'echo hi; ssh $H id', 'cd x && ssh $H id',
  'git status | ssh $H cat', '(ssh $H id)', '{ ssh $H id; }', 'HOST=other; ssh $HOST id',
  'ssh box-{a,b} id', "ssh ('box-'+'a') id", 'cmd /c ssh %BOX% id', 's\\sh $H id', '"s"sh $H id',
];
for (const c of unreadable) test(`unreadable ssh target refused: ${c}`, () => blocked(c));

// The container engine with a remote host or context.
for (const c of ['docker --context nas ps', 'docker -c nas ps', 'docker context use nas', 'DOCKER_CONTEXT=nas docker ps',
  '$env:DOCKER_CONTEXT = "nas"; docker ps']) {
  test(`remote engine context refused: ${c}`, () => blocked(c));
}

// Nothing breaks.
const local = [
  'ls -la', 'docker ps', 'docker compose up -d', 'docker volume rm local-test', 'rm -rf node_modules', 'cat .env', 'npm test',
  'ssh -T git@github.com', 'ssh git@github.com', 'ssh other-host docker volume rm x', 'ssh -p 22 pilot@other-host', 'scp f other-host:/tmp',
  'rsync -av f other-host:/x', 'rsync -e ssh f other-host:/x', 'git clone git@github.com:o/r.git', 'git push origin feat/x',
  'git commit -m "docs: explain the closed list"', 'echo hi | ssh other-host cat', 'ssh -L 8080:localhost:80 other-host',
  'DOCKER_HOST=ssh://other-host docker ps', "alias ll='ls -l'", 'echo $HOME', 'node "C:\\plugin\\hooks\\prod-run.mjs" health app-a',
  'node /plugin/hooks/prod-run.mjs gestes', 'node /plugin/hooks/prod-run.mjs version',
  'powershell -Command "Get-Date"', 'pwsh -File build.ps1', 'git status',
];
for (const c of local) test(`local or non-prod passes: ${c}`, () => allowed(c));
test('without declared hosts the guard does what it did before', () => {
  for (const p of [undefined, { hosts: [] }]) {
    allowed('ssh nas-prod docker volume rm x', p);
    allowed('ssh $HOST id', p);
    allowed('echo nas-prod', p);
  }
});
test('existing blocks hold with the guard on', () => {
  for (const c of ['gh pr merge 3', 'git push origin main', 'git push -f', 'git push --force-with-lease origin feat/x']) blocked(c);
});

// The refusal: fixed by category, no word of the command, stop, CrOliX, the rule.
test('the refusal is fixed by category and copies nothing of the command', () => {
  const a = blocked('ssh nas-prod docker volume rm data');
  const b = blocked('echo nas-prod hunter2secret');
  assert.equal(a.reason, b.reason);
  assert.doesNotMatch(a.reason, /nas-prod|volume|docker|data|hunter2secret|ssh/i);
  assert.match(a.reason, /prod/i);
  assert.match(a.reason, /stop/i);
  assert.match(a.reason, /CrOliX/);
  assert.match(a.reason, /environnements\.md/);
  assert.ok(a.reason.length < 400);
  const unread = blocked('ssh $HOST id');
  assert.doesNotMatch(unread.reason, /\$HOST/);
  assert.match(unread.reason, /stop/i);
  assert.match(unread.reason, /CrOliX/);
});
test('a refusal gives no advice to reformulate', () => {
  assert.doesNotMatch(blocked('echo nas-prod').reason, /instead|rephrase|reformulate|try |use prod-run|try again/i);
});

// ---------------------------------------------------------------------------------------------------
// 2. Written texts: a write tool does not write a text that names a prod host. No file is protected any more.
// ---------------------------------------------------------------------------------------------------
const writeCtx = { cwd: '/repo', prod };
test('a write tool does not write a text that names a prod host', () => {
  assert.equal(evaluateWrite('/repo/run.sh', writeCtx, ['#!/bin/sh\nssh nas-prod id\n']).block, true);
  assert.equal(evaluateWrite('/repo/run.sh', writeCtx, [undefined, 'ssh NAS-PR"O"D id']).block, true);
  assert.equal(evaluateWrite('/repo/notes.md', writeCtx, ['the box is 192.0.2.1']).block, true);
  assert.equal(evaluateWrite('/repo/run.sh', writeCtx, ['echo hello', undefined]).block, false);
  assert.equal(evaluateWrite('/repo/notes.md', writeCtx, ['the box is 192.0.2.10']).block, false);
  assert.equal(evaluateWrite('/repo/run.sh', { cwd: '/repo' }, ['ssh nas-prod id']).block, false);
});
test('no file is protected by the laptop guard any more: the door protects the prod, not the laptop', () => {
  for (const f of ['/inst/prod-allow.txt', '/plugin/hooks/guard.mjs', '/plugin/hooks/prod-run.mjs', 'settings.json']) {
    assert.equal(evaluateWrite(f, writeCtx, ['harmless']).block, false, f);
  }
  allowed('cat /inst/prod-allow.txt');
  allowed('LUN_PROD_SSH_ALLOW_FILE=/x node prod-run.mjs gestes');
});

// ---------------------------------------------------------------------------------------------------
// 3. The configuration: only the hosts.
// ---------------------------------------------------------------------------------------------------
test('loadProdConfig reads the declared hosts, and no data means off', () => {
  assert.deepEqual(loadProdConfig({ LUN_PROD_SSH_HOSTS: 'nas-prod, 192.0.2.1  other-box' }).hosts, ['nas-prod', '192.0.2.1', 'other-box']);
  assert.deepEqual(loadProdConfig({}).hosts, []);
});
for (const bad of ['nas', 'abc', 'a.b', 'ssh', 'localhost', 'docker', 'nas-prod nas']) {
  test(`loadProdConfig refuses a host too short or too common: ${bad}`, () => {
    assert.throws(() => loadProdConfig({ LUN_PROD_SSH_HOSTS: bad }), /host.*(at least 4|too common)|(at least 4|too common).*host/i);
  });
}
test('a refused host name is not copied in the message', () => {
  assert.throws(() => loadProdConfig({ LUN_PROD_SSH_HOSTS: 'abc' }), (e) => !/abc/.test(e.message));
});

// ---------------------------------------------------------------------------------------------------
// 4. The launcher, reduced: node prod-run.mjs <gesture> [arguments...]. The door validates for real.
// ---------------------------------------------------------------------------------------------------
const env = {
  LUN_PROD_SSH_HOSTS: 'nas-prod,192.0.2.1', LUN_PROD_SSH_USER: 'pilot', LUN_PROD_SSH_PORT: '2222', LUN_PROD_SSH_IDENTITY: '/inst/session-key',
};
function launch(argv, { environment = env, result = { status: 0 } } = {}) {
  const calls = [];
  const r = runProd(argv, { env: environment, spawn: (file, args, opts) => { calls.push({ file, args, opts }); return result; } });
  return { ...r, calls };
}
const noSpawn = (r) => assert.equal(r.calls.length, 0, 'ssh must not start');

test('the remote command is the gesture and its arguments, one space apart, in one piece', () => {
  for (const [argv, remote] of [
    [['gestes'], 'gestes'], [['version'], 'version'], [['ps'], 'ps'], [['health', 'app-a'], 'health app-a'],
    [['deploy', 'app-a', '1.2.3'], 'deploy app-a 1.2.3'], [['deploy', 'app-a', 'rollback'], 'deploy app-a rollback'],
    [['env-length', 'app-a', 'APP_SECRET_KEY'], 'env-length app-a APP_SECRET_KEY'], [['trial-load', 'app-a', '2026-11-20'], 'trial-load app-a 2026-11-20'],
  ]) {
    const r = launch(argv);
    assert.equal(r.calls.length, 1, `${argv.join(' ')}: ${r.err}`);
    assert.equal(r.calls[0].args.at(-1), remote);
    assert.equal(r.status, 0);
  }
});
test('ssh starts by a fixed path, without a shell, ignoring the configuration of the machine, with fixed options', () => {
  const { file, args, opts } = launch(['health', 'app-a']).calls[0];
  assert.ok(path.isAbsolute(file), file);
  assert.match(path.basename(file), /^ssh(\.exe)?$/i);
  assert.ok(Array.isArray(args));
  assert.ok(!opts.shell, 'no shell');
  assert.equal(opts.stdio, 'inherit');
  const joined = args.join(' ');
  const f = args.indexOf('-F');
  assert.ok(f >= 0 && /^(\/dev\/null|NUL)$/i.test(args[f + 1]), `-F in ${joined}`);
  for (const flag of ['-T', '-a', '-x']) assert.ok(args.includes(flag), `${flag} in ${joined}`);
  for (const o of ['ClearAllForwardings=yes', 'BatchMode=yes', 'IdentitiesOnly=yes']) assert.ok(joined.includes(`-o ${o}`), o);
  assert.match(joined, /-o ConnectTimeout=\d+/);
  assert.match(joined, /(-l pilot|-o User=pilot)|pilot@nas-prod/);
  assert.match(joined, /(-p 2222|-o Port=2222)/);
  assert.match(joined, /-i \/inst\/session-key/);
  for (const forbidden of ['-t', '-tt', '-A', '-L', '-R', '-D', '-W', '-N', '-X', '-Y']) assert.ok(!args.includes(forbidden), forbidden);
  assert.doesNotMatch(joined, /RequestTTY=(yes|force)|ForwardAgent=yes|LocalForward|RemoteForward|DynamicForward|ProxyCommand|ProxyJump/);
  assert.equal(args.at(-3), '--');
  assert.match(args.at(-2), /^(pilot@)?nas-prod$/);
  assert.equal(args.filter((a) => a.includes('nas-prod')).length, 1);
});
test('no variable changes the program that is started: the ssh path is fixed', () => {
  const first = launch(['ps']).calls[0].file;
  for (const bin of ['/tmp/evil/ssh', 'ssh', 'bin/ssh', '/tmp/evil/ssh.sh']) {
    const r = launch(['ps'], { environment: { ...env, LUN_PROD_SSH_BIN: bin, PATH: '/tmp/evil', Path: '/tmp/evil' } });
    assert.equal(r.calls[0].file, first);
  }
});
test('the host comes from the configuration; the port is optional', () => {
  const r = launch(['ps'], { environment: { ...env, LUN_PROD_SSH_HOSTS: 'other-box,192.0.2.1', LUN_PROD_SSH_PORT: '' } });
  assert.match(r.calls[0].args.at(-2), /^(pilot@)?other-box$/);
  assert.doesNotMatch(r.calls[0].args.join(' '), /-p |Port=/);
});
test('the exit code of ssh is returned; a missing code or an error is a failure; a throwing spawn too', () => {
  assert.equal(launch(['ps'], { result: { status: 0 } }).status, 0);
  assert.equal(launch(['ps'], { result: { status: 7 } }).status, 7);
  assert.equal(launch(['ps'], { result: { status: 66 } }).status, 66);
  assert.notEqual(launch(['ps'], { result: { status: null, signal: 'SIGTERM' } }).status, 0);
  assert.notEqual(launch(['ps'], { result: { error: new Error('spawn ssh ENOENT') } }).status, 0);
  const r = runProd(['ps'], { env, spawn: () => { throw new Error('boom'); } });
  assert.notEqual(r.status, 0);
  assert.match(r.err, /prod-run/);
});
test('only a narrow character set reaches ssh: a typo is refused early, nothing starts', () => {
  const bad = [
    [], [''], ['ps;id'], ['ps', 'a b'], ['ps', 'a;b'], ['ps', 'a&b'], ['ps', 'a|b'], ['ps', '$(id)'], ['ps', '`id`'], ['ps', '$HOME'], ['ps', '"a"'],
    ['ps', "'a'"], ['ps', 'a\nb'], ['ps', 'a\tb'], ['ps', 'a*'], ['ps', 'a?'], ['ps', 'a{b,c}'], ['ps', '~'], ['ps', 'a\\b'], ['ps', 'é'], ['ps', ''],
    ['PS'], ['ps ', 'a'], ['health app-a'], ['--check'], ['--dry', 'ps'], ['--list'], ['-v'], ['ps', 'a'.repeat(65)], ['a'.repeat(40)],
    ['ps', 'a', 'b', 'c', 'd'], ['ps', '1', '2', '3', '4', '5', '6', '7', '8'],
  ];
  for (const argv of bad) {
    const r = launch(argv);
    noSpawn(r);
    assert.notEqual(r.status, 0, JSON.stringify(argv));
    assert.match(r.err, /prod-run/);
    for (const word of argv) if (word.length > 3 && /\w/.test(word)) assert.ok(!r.err.includes(word), `copied: ${JSON.stringify(word)}`);
  }
});
test('the narrow set lets through letters, digits, dot, dash, underscore', () => {
  for (const argv of [['deploy', 'app-a', '1.2.3'], ['env-length', 'app-a', 'APP_SECRET_KEY'], ['trial-load', 'app-a', '2026-11-20'], ['ps', 'a'.repeat(64)]]) {
    assert.equal(launch(argv).calls.length, 1, argv.join(' '));
  }
});
test('without configuration the launcher refuses to run and says so', () => {
  for (const drop of ['LUN_PROD_SSH_HOSTS', 'LUN_PROD_SSH_USER', 'LUN_PROD_SSH_IDENTITY']) {
    const { [drop]: _gone, ...environment } = env;
    const r = launch(['ps'], { environment });
    noSpawn(r);
    assert.notEqual(r.status, 0);
    assert.match(r.err, /not configured/i);
  }
  const none = launch(['ps'], { environment: {} });
  noSpawn(none);
  assert.match(none.err, /not configured/i);
  const shortHost = launch(['ps'], { environment: { ...env, LUN_PROD_SSH_HOSTS: 'nas' } });
  noSpawn(shortHost);
  assert.notEqual(shortHost.status, 0);
});
test('the launcher keeps no list, no barrier and no mode of its own', () => {
  const text = fs.existsSync(runPath) ? fs.readFileSync(runPath, 'utf8') : '';
  assert.ok(text.length > 0, 'prod-run.mjs exists');
  assert.ok(text.split('\n').length < 120, 'a trivial launcher');
  assert.doesNotMatch(text, /LUN_PROD_SSH_ALLOW_FILE|LUN_PROD_SSH_BIN|readFileSync|--list|--dry|--check|barrier|JOKER/i);
});
function script(argv, environment) {
  return spawnSync('node', [runPath, ...argv], { env: { ...process.env, LUN_PROD_SSH_HOSTS: '', LUN_PROD_SSH_USER: '', LUN_PROD_SSH_IDENTITY: '', ...environment }, encoding: 'utf8' });
}
test('prod-run.mjs as a script: refuses without configuration and a bad gesture, never reaching ssh', () => {
  const none = script(['ps'], {});
  assert.notEqual(none.status, 0);
  assert.match(none.stderr, /not configured/i);
  const bad = script(['ps;id'], env);
  assert.notEqual(bad.status, 0);
  assert.match(bad.stderr, /prod-run/);
});

// ---------------------------------------------------------------------------------------------------
// 5. The hook, from the outside, without a real ssh: the shell tools, and the write tools.
// ---------------------------------------------------------------------------------------------------
function runHook(payload, extraEnv) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prod-hook-'));
  try {
    return spawnSync('node', [guardPath], {
      input: JSON.stringify({ cwd: dir, ...payload }),
      env: { ...process.env, LUN_PROD_SSH_HOSTS: '', ...extraEnv },
      encoding: 'utf8',
    });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
const hookEnv = { LUN_PROD_SSH_HOSTS: 'nas-prod,192.0.2.1,stage' };

test('the hook refuses a mention for Bash and PowerShell, with a fixed message, and is silent without the data', () => {
  for (const tool of ['Bash', 'PowerShell']) {
    const r = runHook({ tool_name: tool, tool_input: { command: 'ssh nas-prod "docker volume rm data"' } }, hookEnv);
    assert.equal(r.status, 2, r.stderr);
    assert.match(r.stderr, /lun guard/);
    assert.doesNotMatch(r.stderr, /nas-prod|volume|data/);
    assert.equal(runHook({ tool_name: tool, tool_input: { command: 'git status' } }, hookEnv).status, 0);
    assert.equal(runHook({ tool_name: tool, tool_input: { command: 'echo stagecoach 192.0.2.10' } }, hookEnv).status, 0);
    assert.equal(runHook({ tool_name: tool, tool_input: { command: 'ssh nas-prod id' } }, {}).status, 0);
    assert.equal(runHook({ tool_name: tool, tool_input: { command: 'ssh $H id' } }, hookEnv).status, 2);
  }
});
test('the hook refuses a raw carriage return bypass and lets the launcher through', () => {
  assert.equal(runHook({ tool_name: 'Bash', tool_input: { command: 'ssh nas-prod "docker volume create api"\r"; docker volume rm data"' } }, hookEnv).status, 2);
  assert.equal(runHook({ tool_name: 'Bash', tool_input: { command: `node "${runPath}" health app-a` } }, hookEnv).status, 0);
  assert.equal(runHook({ tool_name: 'PowerShell', tool_input: { command: `node "${runPath}" gestes` } }, hookEnv).status, 0);
});
test('the hook refuses a written text that names a prod host, for each write tool, and writes elsewhere pass', () => {
  const target = path.join(os.tmpdir(), 'other.txt');
  const shapes = [
    ['Write', (t) => ({ file_path: target, content: t })],
    ['Edit', (t) => ({ file_path: target, old_string: 'a', new_string: t })],
    ['MultiEdit', (t) => ({ file_path: target, edits: [{ old_string: 'a', new_string: t }] })],
    ['NotebookEdit', (t) => ({ notebook_path: target, new_source: t })],
  ];
  for (const [tool, input] of shapes) {
    const r = runHook({ tool_name: tool, tool_input: input('ssh nas-prod id') }, hookEnv);
    assert.equal(r.status, 2, `${tool}: ${r.stderr}`);
    assert.match(r.stderr, /lun guard/);
    assert.equal(runHook({ tool_name: tool, tool_input: input('ssh nas-prod id') }, {}).status, 0, `${tool} without hosts`);
    assert.equal(runHook({ tool_name: tool, tool_input: input('echo hello') }, hookEnv).status, 0, `${tool} harmless`);
  }
});
test('the hook refuses everything it is asked about when the configuration is bad, and says why', () => {
  const r = runHook({ tool_name: 'Bash', tool_input: { command: 'git status' } }, { LUN_PROD_SSH_HOSTS: 'nas' });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /host/i);
});
test('an internal error is a refusal when hosts are declared, and never blocks without them', () => {
  const broken = { toString() { throw new Error('boom'); } };
  assert.equal(evaluateCommand(broken, { cwd: '/repo', prod }).block, true);
  assert.equal(evaluateWrite(broken, writeCtx).block, true);
  const raw = (input, extraEnv) => spawnSync('node', [guardPath], { input, env: { ...process.env, LUN_PROD_SSH_HOSTS: '', ...extraEnv }, encoding: 'utf8' });
  // Claude Code lets a tool call through on any exit code but 2: the hook must exit 2 itself.
  for (const input of ['not json', '', JSON.stringify({ tool_name: 'Bash', tool_input: { command: { a: 1 } } })]) {
    const r = raw(input, hookEnv);
    assert.equal(r.status, 2, JSON.stringify(input));
    assert.match(r.stderr, /lun guard.*stop/i);
    assert.equal(raw(input, {}).status, 0, `${JSON.stringify(input)} without hosts`);
  }
});
test('hooks.json runs guard.mjs for the shell tools and the write tools', () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(here, 'hooks.json'), 'utf8'));
  const tools = new Set(cfg.hooks.PreToolUse.filter((e) => e.hooks.some((h) => h.command.includes('guard.mjs'))).flatMap((e) => e.matcher.split('|')));
  for (const t of ['Bash', 'PowerShell', 'Write', 'Edit', 'MultiEdit', 'NotebookEdit']) assert.ok(tools.has(t), `${t} in ${[...tools]}`);
});
