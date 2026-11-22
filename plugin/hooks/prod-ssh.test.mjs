// Tests of the prod guard, second design (lun-docs#192): nothing to parse.
//  - prod-run.mjs is the only road to prod: it validates the arguments of one line of the closed list,
//    composes the remote command itself and starts ssh itself, without a shell.
//  - guard.mjs refuses every command line (Bash, PowerShell) that mentions a declared prod host, refuses an
//    ssh-like client whose target it cannot read, and protects the files of the guard itself.
// Supposed API (written before the code):
//   prod-ssh.mjs   loadProdConfig(env, readFile?) -> { hosts, allowFile, protectedPaths }; throws on a bad host.
//                  Env: LUN_PROD_SSH_HOSTS, LUN_PROD_SSH_ALLOW_FILE, LUN_PROD_SSH_PROTECT (more paths, path.delimiter).
//   prod-run.mjs   runProd(argv, { env, readFile, spawn }) -> { status, out, err } (synchronous, never prints);
//                  as a script: node prod-run.mjs <line> [args...] | --list | --dry <line> [args...] | --check.
//   guard.mjs      evaluateCommand(command, { cwd, prod: { hosts, protectedPaths } }), evaluateWrite(filePath, same context).
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
const examplePath = path.join(here, 'prod-ssh-allow.example');
const exampleText = fs.readFileSync(examplePath, 'utf8');

const hosts = ['nas-prod', '192.0.2.10'];
const protectedPaths = ['/inst/prod-allow.txt', '/inst/settings.json', '/plugin/hooks'];
const prod = { hosts, protectedPaths };
const on = (command, p = prod) => evaluateCommand(command, { cwd: '/repo', prod: p });
const blocked = (command, p = prod) => {
  const r = on(command, p);
  assert.equal(r.block, true, `should be blocked: ${JSON.stringify(command)}`);
  assert.ok(r.reason && r.reason.length > 0);
  return r;
};
const allowed = (command, p = prod) => assert.equal(on(command, p).block, false, `should pass: ${JSON.stringify(command)}`);

// ---------------------------------------------------------------------------------------------------
// 1. The mention rule: a declared host named anywhere in a line is refused, whatever the form.
// ---------------------------------------------------------------------------------------------------
const mentions = [
  'echo nas-prod', 'ssh nas-prod id', 'git commit -m "docs: nas-prod is slow"', 'echo "# nas-prod"', 'cat notes-192.0.2.10.txt',
  'NAS-PROD', 'echo Nas-Prod', 'ping 192.0.2.10', 'curl http://nas-prod.local/x', 'Write-Output nas-prod',
  // Obfuscated names that a shell would glue back: quotes, escapes, control characters, zero-width characters.
  'echo nas-pr\\od', "echo 'nas-pr''od'", 'echo nas-pr"o"d', "echo nas-pr'o'd", 'echo nas-pr\rod', 'echo nas-pr\nod',
  'echo nas-pr\u0000od', 'echo nas-pr\u200bod', 'echo nas-pr\ufeffod', 'echo nas-pr\u00adod', 'echo nas-pr`od', 'echo nas-pr^od',
  'echo n"as"-"pr"od', 'echo "nas-prod"', "echo 'NAS-PROD'", 'echo 192.0.2.1\\0', 'echo 19"2.0.2".10',
];
for (const c of mentions) test(`mention refused: ${JSON.stringify(c)}`, () => blocked(c));

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
  allowed('powershell -EncodedCommand AAAA', { hosts: [], protectedPaths: [] });
  allowed('echo c3No | base64 -d');
});

// An ssh-like client whose target cannot be read: refused when hosts are declared.
const unreadable = [
  'ssh $HOST id', 'ssh "$HOST" id', 'ssh ${HOST} id', 'ssh $(cat h) id', 'ssh `cat h` id', 'ssh $env:NAS id', 'ssh @args', 'ssh', 'ssh -T',
  'ssh -p 22 $H', 'ssh $H -p 22', 'scp f $H:/tmp', 'rsync -av f $H:/x', 'sftp $H', 'sshfs $H:/ mnt', 'mosh $H', 'autossh $H', 'plink $H', 'putty $H',
  '/usr/bin/ssh $H id', 'ssh.exe $H id', 'C:\\Windows\\System32\\OpenSSH\\ssh.exe $H id', 'echo hi; ssh $H id', 'cd x && ssh $H id',
  'git status | ssh $H cat', '(ssh $H id)', '{ ssh $H id; }', 'HOST=other; ssh $HOST id',
];
for (const c of unreadable) test(`unreadable ssh target refused: ${c}`, () => blocked(c));

// The container engine with a remote host or context: today's rule stays.
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
  'DOCKER_HOST=ssh://other-host docker ps', "alias ll='ls -l'", 'echo $HOME', 'node "C:\\plugin\\hooks\\prod-run.mjs" 3 api',
  'node /plugin/hooks/prod-run.mjs --list', 'node /plugin/hooks/prod-run.mjs --check',
  'powershell -Command "Get-Date"', 'pwsh -File build.ps1',
];
for (const c of local) test(`local or non-prod passes: ${c}`, () => allowed(c));
test('without declared hosts the guard does what it did before', () => {
  for (const p of [undefined, { hosts: [], protectedPaths: [] }]) {
    allowed('ssh nas-prod docker volume rm x', p);
    allowed('ssh $HOST id', p);
    allowed('echo nas-prod', p);
    allowed('cat /inst/prod-allow.txt', p);
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
  assert.doesNotMatch(unread.reason, /\$HOST|id\b.*id/);
  assert.match(unread.reason, /stop/i);
  const file = blocked('cat /inst/prod-allow.txt');
  assert.doesNotMatch(file.reason, /prod-allow/);
  assert.match(file.reason, /stop/i);
  assert.match(file.reason, /CrOliX/);
});
test('a refusal gives no advice to reformulate', () => {
  assert.doesNotMatch(blocked('echo nas-prod').reason, /instead|rephrase|reformulate|try |use prod-run|try again/i);
});

// ---------------------------------------------------------------------------------------------------
// 2. The guard protects its own files: by the write tools and by the terminal.
// ---------------------------------------------------------------------------------------------------
const writeCtx = { cwd: '/repo', prod };
const protectedWrites = ['/inst/prod-allow.txt', '/inst/settings.json', '/plugin/hooks/guard.mjs', '/plugin/hooks/prod-run.mjs',
  '/plugin/hooks/sub/new.mjs', '/plugin/hooks/../hooks/guard.mjs', '/INST/PROD-ALLOW.TXT', '/inst/./prod-allow.txt', '/inst//prod-allow.txt'];
for (const f of protectedWrites) {
  test(`write refused: ${f}`, () => {
    const r = evaluateWrite(f, writeCtx);
    assert.equal(r.block, true);
    assert.match(r.reason, /stop/i);
    assert.match(r.reason, /CrOliX/);
    assert.doesNotMatch(r.reason, /prod-allow|settings/);
  });
}
test('write refused: a relative path resolved against the working directory', () => {
  assert.equal(evaluateWrite('../inst/prod-allow.txt', writeCtx).block, true);
  assert.equal(evaluateWrite('prod-allow.txt', { cwd: '/inst', prod }).block, true);
  assert.equal(evaluateWrite('guard.mjs', { cwd: '/plugin/hooks', prod }).block, true);
});
test('write refused: a Windows path written with backslashes', () => {
  const p = { hosts, protectedPaths: ['C:/inst/prod-allow.txt', 'C:/plugin/hooks'] };
  assert.equal(evaluateWrite('C:\\inst\\prod-allow.txt', { cwd: 'C:/repo', prod: p }).block, true);
  assert.equal(evaluateWrite('c:\\plugin\\hooks\\guard.mjs', { cwd: 'C:/repo', prod: p }).block, true);
});
test('write passes: other files, a sibling directory, and everything without hosts', () => {
  for (const f of ['/inst/other.txt', '/plugin/hooks-other/x.mjs', '/plugin/hook/x.mjs', '/plugin/skills/x.md', '/repo/src/x.js', 'notes.md']) {
    assert.equal(evaluateWrite(f, writeCtx).block, false, f);
  }
  assert.equal(evaluateWrite('/inst/prod-allow.txt', { cwd: '/repo', prod: { hosts: [], protectedPaths: [] } }).block, false);
  assert.equal(evaluateWrite('/inst/prod-allow.txt', { cwd: '/repo' }).block, false);
});
for (const c of ['cat /inst/prod-allow.txt', 'echo x >> /inst/prod-allow.txt', 'sed -i s/a/b/ /inst/prod-allow.txt',
  'Set-Content /inst/prod-allow.txt x', 'cp /tmp/x /inst/PROD-ALLOW.TXT', 'cat /inst/./prod-allow.txt', 'cat "/inst/prod-allow.txt"']) {
  test(`terminal naming the list file refused: ${c}`, () => blocked(c));
}
test('terminal naming the list file, written with backslashes, refused', () => {
  const p = { hosts, protectedPaths: ['C:/inst/prod-allow.txt'] };
  blocked('type C:\\inst\\prod-allow.txt', p);
  blocked('Get-Content "C:\\inst\\prod-allow.txt"', p);
});

// ---------------------------------------------------------------------------------------------------
// 3. The configuration.
// ---------------------------------------------------------------------------------------------------
test('loadProdConfig reads the hosts, the list path, and the files to protect', () => {
  const d = path.delimiter;
  const cfg = loadProdConfig({
    LUN_PROD_SSH_HOSTS: 'nas-prod, 192.0.2.10  other-box', LUN_PROD_SSH_ALLOW_FILE: '/inst/prod-allow.txt',
    LUN_PROD_SSH_PROTECT: `/inst/settings.json${d}/inst/more.json`,
  });
  assert.deepEqual(cfg.hosts, ['nas-prod', '192.0.2.10', 'other-box']);
  assert.equal(cfg.allowFile, '/inst/prod-allow.txt');
  const norm = (p) => path.resolve(p).toLowerCase();
  const got = cfg.protectedPaths.map(norm);
  for (const p of ['/inst/prod-allow.txt', '/inst/settings.json', '/inst/more.json', here]) {
    assert.ok(got.includes(norm(p)), `protected: ${p} in ${got.join(' | ')}`);
  }
});
test('loadProdConfig: no data means off', () => {
  const cfg = loadProdConfig({});
  assert.deepEqual(cfg.hosts, []);
  assert.ok(!cfg.allowFile);
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
// 4. The launcher.
// ---------------------------------------------------------------------------------------------------
const LIST = [
  '# a header',                                                         // 1
  "docker ps --format '{{.Names}}'",                                    // 2
  "docker inspect --format '{{.State.Health.Status}}' <app>",           // 3
  '/srv/app/deploy.sh <app> <version>',                                 // 4
  "docker logs --tail <int> <app> | grep -F 'Base'",                    // 5
  'stat -c %a <path>',                                                  // 6
  '',                                                                   // 7
  'docker volume create <app>',                                         // 8
].join('\n');
const env = { LUN_PROD_SSH_HOSTS: 'nas-prod,192.0.2.10', LUN_PROD_SSH_ALLOW_FILE: '/inst/prod-allow.txt' };

function launch(argv, { list = LIST, environment = env, result = { status: 0 } } = {}) {
  const calls = [];
  const r = runProd(argv, {
    env: environment,
    readFile: () => list,
    spawn: (file, args, opts) => { calls.push({ file, args, opts }); return result; },
  });
  return { ...r, calls };
}
const noSpawn = (r) => assert.equal(r.calls.length, 0, 'ssh must not start');

test('the composed command is exactly the line, the arguments substituted', () => {
  const cases = [
    [['2'], "docker ps --format '{{.Names}}'"],
    [['3', 'api'], "docker inspect --format '{{.State.Health.Status}}' api"],
    [['4', 'api', '1.2.3'], '/srv/app/deploy.sh api 1.2.3'],
    [['5', '200', 'api'], "docker logs --tail 200 api | grep -F 'Base'"],
    [['6', '/srv/app/app.env'], 'stat -c %a /srv/app/app.env'],
    [['8', 'api-data'], 'docker volume create api-data'],
  ];
  for (const [argv, remote] of cases) {
    const r = launch(argv);
    assert.equal(r.calls.length, 1, `${argv.join(' ')}: ${r.err}`);
    assert.equal(r.calls[0].args.at(-1), remote);
    assert.equal(r.status, 0);
  }
});
test('ssh starts without a shell, with fixed options, toward the host of the configuration', () => {
  const { calls } = launch(['3', 'api']);
  const { file, args, opts } = calls[0];
  assert.equal(path.basename(file).replace(/\.exe$/i, ''), 'ssh');
  assert.ok(Array.isArray(args));
  assert.ok(!opts.shell, 'no shell');
  assert.equal(opts.stdio, 'inherit');
  for (const flag of ['-T', '-a', '-x']) assert.ok(args.includes(flag), `${flag} in ${args.join(' ')}`);
  const joined = args.join(' ');
  assert.match(joined, /-o ClearAllForwardings=yes/);
  assert.match(joined, /-o BatchMode=yes/);
  assert.match(joined, /-o ConnectTimeout=\d+/);
  for (const forbidden of ['-t', '-tt', '-A', '-L', '-R', '-D', '-W', '-N', '-X', '-Y']) assert.ok(!args.includes(forbidden), forbidden);
  assert.doesNotMatch(joined, /RequestTTY=(yes|force)|ForwardAgent=yes|LocalForward|RemoteForward|DynamicForward|ProxyCommand|ProxyJump/);
  assert.deepEqual(args.slice(-3, -1), ['--', 'nas-prod']);
  assert.equal(args.filter((a) => a.includes('nas-prod')).length, 1);
});
test('the host comes from the configuration, never from the arguments', () => {
  assert.equal(launch(['3', 'api'], { environment: { ...env, LUN_PROD_SSH_HOSTS: 'other-box,192.0.2.10' } }).calls[0].args.at(-2), 'other-box');
  const r = launch(['3', 'nas-prod']);
  assert.equal(r.calls[0].args.at(-1), 'docker inspect --format \'{{.State.Health.Status}}\' nas-prod');
  assert.equal(r.calls[0].args.at(-2), 'nas-prod');
});
test('the exit code of ssh is returned; a missing code is a failure', () => {
  assert.equal(launch(['2'], { result: { status: 0 } }).status, 0);
  assert.equal(launch(['2'], { result: { status: 7 } }).status, 7);
  assert.equal(launch(['2'], { result: { status: 255 } }).status, 255);
  assert.notEqual(launch(['2'], { result: { status: null, signal: 'SIGTERM' } }).status, 0);
  assert.notEqual(launch(['2'], { result: { error: new Error('spawn ssh ENOENT') } }).status, 0);
});

// Every joker validated: the limits, a traversal, an option stuck, a separator, a newline, a space, a quote, a non ASCII.
const APP_OK = ['a', '0', 'api', 'api-data', 'api_data', 'a'.repeat(40), 'a-b_c9'];
const APP_BAD = ['', 'a'.repeat(41), 'API', 'Api', '-api', '--rollback', '-f', '_api', 'api;id', 'api&&id', 'api|id', 'api id', 'api\nid', 'api\r',
  'api\tid', 'api"x', "api'x", 'api`id`', 'api$(id)', '$HOME', 'api/../x', 'api/x', 'api.x', 'apié', 'ａpi', 'api\u0000', 'api\u200b', '*', '~', 'api>x', 'api<x'];
const VERSION_OK = ['0.0.0', '1.2.3', '10.20.30'];
const VERSION_BAD = ['', '1', '1.2', '1.2.3.4', 'v1.2.3', '1.2.3-rc1', '1.2.3;id', '1.2.3\n', ' 1.2.3', '1.2.3 ', '-1.2.3', '１.２.３', '1.2.x', 'latest', '$(id)', '1.2.3"'];
const INT_OK = ['0', '1', '200', '999999'];
const INT_BAD = ['', '-1', '+5', '1.5', '1e3', '1000000', ' 5', '5 ', '5\n', '٣', '0x10', '5;id', '$X', 'ten'];
const PATH_OK = ['/srv/app/app.env', '/a', '/srv/app/data_1/x-y.z'];
const PATH_BAD = ['', 'srv/app/x', './x', '../x', '~/x', '/srv/../etc/shadow', '/srv/app/..', '/srv/app/../x', '/srv/app/x y', '/srv/app/x\n', '/srv/app/x;id',
  "/srv/app/x'", '/srv/app/x"', '/srv/app/$x', '/srv/app/*', '/srv/app/?', '/srv/app/é', '/srv/app/x\\y', '-x', '/srv/app/x`id`', '/srv/app/x|id', '/srv/app/x>y'];

const jokers = [
  ['app', '3', (v) => [v], APP_OK, APP_BAD, 1],
  ['app (second line)', '8', (v) => [v], APP_OK, APP_BAD, 1],
  ['app before a version', '4', (v) => [v, '1.2.3'], APP_OK, APP_BAD, 1],
  ['version', '4', (v) => ['api', v], VERSION_OK, VERSION_BAD, 2],
  ['int', '5', (v) => [v, 'api'], INT_OK, INT_BAD, 1],
  ['app after an int', '5', (v) => ['200', v], APP_OK, APP_BAD, 2],
  ['path', '6', (v) => [v], PATH_OK, PATH_BAD, 1],
];
for (const [name, line, args, ok, bad, rank] of jokers) {
  test(`joker ${name}: valid values pass`, () => {
    for (const v of ok) {
      const r = launch([line, ...args(v)]);
      assert.equal(r.calls.length, 1, `${JSON.stringify(v)}: ${r.err}`);
    }
  });
  test(`joker ${name}: invalid values refused, by rank, without copying the value`, () => {
    for (const v of bad) {
      const r = launch([line, ...args(v)]);
      noSpawn(r);
      assert.notEqual(r.status, 0, JSON.stringify(v));
      assert.match(r.err, new RegExp(`argument ${rank}\\b`, 'i'), JSON.stringify(v));
      if (v.trim() && /\w/.test(v)) assert.ok(!r.err.includes(v), `copied: ${JSON.stringify(v)}`);
    }
  });
}
test('a refused argument says the expected form', () => {
  assert.match(launch(['3', 'API']).err, /app|\[a-z0-9\]/i);
  assert.match(launch(['4', 'api', 'latest']).err, /version|1\.2\.3|\\d/i);
  assert.match(launch(['5', 'x', 'api']).err, /int|digit|number/i);
  assert.match(launch(['6', 'x']).err, /path|absolute|\//i);
});
test('the number of arguments is exact', () => {
  for (const argv of [['3'], ['3', 'api', 'extra'], ['4', 'api'], ['4', 'api', '1.2.3', 'x'], ['2', 'x'], ['6'], ['5', '1']]) {
    const r = launch(argv);
    noSpawn(r);
    assert.notEqual(r.status, 0, argv.join(' '));
    assert.match(r.err, /argument/i);
  }
});
test('an unknown, empty, comment or malformed line number is refused', () => {
  for (const n of ['99', '0', '-1', '1', '7', 'abc', '2.5', '', '02', '1e1', ' 2', '2 ']) {
    const r = launch([n]);
    noSpawn(r);
    assert.notEqual(r.status, 0, JSON.stringify(n));
    assert.match(r.err, /line/i);
  }
  const none = launch([]);
  noSpawn(none);
  assert.notEqual(none.status, 0);
});
test('--list shows the numbered lines of the file, and runs nothing, shows no host', () => {
  const r = launch(['--list']);
  noSpawn(r);
  assert.equal(r.status, 0);
  for (const [n, text] of [[2, "docker ps --format '{{.Names}}'"], [4, '/srv/app/deploy.sh <app> <version>'], [8, 'docker volume create <app>']]) {
    assert.match(r.out, new RegExp(`(^|\\n)\\s*${n}[:)\\s].*${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), `line ${n}`);
  }
  assert.doesNotMatch(r.out, /nas-prod|192\.0\.2\.10|prod-allow/);
});
test('--dry shows the remote command, runs nothing, and shows no host', () => {
  const r = launch(['--dry', '4', 'api', '1.2.3']);
  noSpawn(r);
  assert.equal(r.status, 0);
  assert.ok(r.out.includes('/srv/app/deploy.sh api 1.2.3'));
  assert.doesNotMatch(r.out, /nas-prod|192\.0\.2\.10/);
  const bad = launch(['--dry', '4', 'API', '1.2.3']);
  assert.notEqual(bad.status, 0);
  noSpawn(bad);
});
test('--check says if the guard is configured, and shows nothing of the instance', () => {
  const r = launch(['--check']);
  noSpawn(r);
  assert.equal(r.status, 0);
  assert.match(r.out, /hosts:\s*2/i);
  assert.match(r.out, /lines:\s*6/i);
  assert.doesNotMatch(r.out, /nas-prod|192\.0\.2\.10|prod-allow|\/srv\/app|docker/);
});
test('--check on an unconfigured launcher fails and says so', () => {
  for (const environment of [{}, { LUN_PROD_SSH_HOSTS: 'nas-prod' }, { LUN_PROD_SSH_ALLOW_FILE: '/inst/prod-allow.txt' }]) {
    const r = launch(['--check'], { environment });
    noSpawn(r);
    assert.notEqual(r.status, 0);
    assert.match(r.err + r.out, /not configured/i);
  }
});
test('without configuration the launcher refuses to run and says so', () => {
  for (const environment of [{}, { LUN_PROD_SSH_HOSTS: 'nas-prod' }, { LUN_PROD_SSH_ALLOW_FILE: '/inst/prod-allow.txt' }, { LUN_PROD_SSH_HOSTS: 'nas', LUN_PROD_SSH_ALLOW_FILE: '/x' }]) {
    for (const argv of [['2'], ['--list'], ['--dry', '2']]) {
      const r = launch(argv, { environment });
      noSpawn(r);
      assert.notEqual(r.status, 0);
      assert.match(r.err, /not configured|host/i);
    }
  }
  const unreadable = runProd(['2'], { env, readFile: () => { throw new Error('ENOENT'); }, spawn: () => assert.fail('ssh must not start') });
  assert.notEqual(unreadable.status, 0);
  assert.match(unreadable.err, /list/i);
});

// The list is checked at load, whatever the mode: a bad line stops the launcher, named by its number.
const badLines = {
  'a quote left open': "docker ps --format '{{.Names}}",
  'a line starting with a joker': '<app> --version',
  'a path joker behind cat': 'cat <path>',
  'a path joker behind tail': 'tail -n 5 <path>',
  'a path joker behind cp': 'cp <path> /tmp/x',
  'a path joker behind sed': 'sed -n 1p <path>',
  'a semicolon': 'docker ps --format x; docker volume ls --format x',
  'a conjunction': 'docker ps --format x && docker volume ls --format x',
  'an alternative': 'docker ps --format x || docker volume ls --format x',
  'a background': 'docker ps --format x &',
  'an output redirection': "docker ps --format '{{.Names}}' > /srv/app/x",
  'an appended redirection': "docker ps --format '{{.Names}}' >> /srv/app/x",
  'an input redirection': 'docker ps --format x < /srv/app/x',
  'a glued redirection': 'docker compose -f /srv/app/compose.yaml stop >&1<app>',
  'a substitution': 'docker ps --format "$(echo x)"',
  'a backtick substitution': 'docker ps --format `echo x`',
  'a variable': 'docker ps --format $FMT',
  'a braced variable': 'docker ps --format ${FMT}',
  'a typographic quote': 'docker ps --format “x”',
  'a typographic apostrophe': 'docker ps --format ’x’',
  'a control character': 'docker ps --format x\u0001',
  'a lone carriage return': 'docker ps --format x\rdocker volume rm data',
  'a null': 'docker ps\u0000 --format x',
  'a subshell': '(docker ps --format x)',
  'a brace group': '{ docker ps --format x; }',
  'a pipe to a shell': "docker ps --format '{{.Names}}' | sh",
  'a pipe to xargs': "docker ps --format '{{.Names}}' | xargs docker rm",
  'a pipe to tee': "docker ps --format '{{.Names}}' | tee /tmp/x",
  'a pipe to cat': "docker ps --format '{{.Names}}' | cat",
  'a trailing pipe': "docker ps --format '{{.Names}}' |",
  'a glob': 'docker ps --format x /srv/app/*',
  'a tilde': 'stat -c %a ~/x',
  'an unknown joker': 'docker volume create <name>',
  'a joker glued to a word': 'docker volume create x<app>',
};
const barrier = {
  'an anonymous volume renewed': 'docker compose -f /srv/app/compose.yaml up -d -V <app>',
  'an anonymous volume renewed (long)': 'docker compose -f /srv/app/compose.yaml up -d --renew-anon-volumes <app>',
  'a copy to a container': 'docker cp /srv/app/x <app>:/x',
  'a copy from a container': 'docker cp <app>:/x /tmp/x',
  'a compose copy': 'docker compose -f /srv/app/compose.yaml cp <app>:/x /tmp/x',
  'a volume removed': 'docker volume rm <app>',
  'a volume pruned': 'docker volume prune -f',
  'a global prune': 'docker system prune -af',
  'an image prune': 'docker image prune -a',
  'a container prune': 'docker container prune',
  'a stack down with volumes': 'docker compose -f /srv/app/compose.yaml down -v',
  'a stack down with volumes (long)': 'docker compose -f /srv/app/compose.yaml down --volumes',
  'a container removed with its volumes': 'docker rm -v <app>',
  'a recursive removal': 'rm -rf /srv/app/data',
  'a removal': 'rm /srv/app/data/x.db',
  'a move': 'mv /srv/app/data /tmp/data',
  'a find that deletes': 'find /srv/app/data -delete',
  'an inspection without a format': 'docker inspect <app>',
  'an image inspection without a format': 'docker image inspect <app>',
  'an inspection printing everything': "docker inspect --format '{{json .}}' <app>",
  'an inspection printing the env': "docker inspect --format '{{.Config.Env}}' <app>",
  'an inspection printing json fields': "docker inspect --format '{{json .Config}}' <app>",
  'a container env': 'docker exec <app> env',
  'a container printenv': 'docker exec <app> printenv',
  'a container environ': 'docker exec <app> cat /proc/1/environ',
  'a run printing env': 'docker run --rm <app> env',
  'an env file': 'cat /srv/app/app.env',
  'an env file by grep': 'grep ^APP_KEY= /srv/app/app.env',
  'an env file by grep and cat': 'grep ^APP_KEY= /srv/app/app.env | cat',
  'a dotenv file': 'head -n 3 /srv/app/.env',
  'a registry access configuration': 'cat /home/pilot/.docker/config.json',
  'a key': 'cat /home/pilot/.ssh/id_ed25519',
  'authorized keys': 'cat /home/pilot/.ssh/authorized_keys',
  'a resolved stack': 'docker compose -f /srv/app/compose.yaml config',
  'a resolved stack in json': 'docker compose -f /srv/app/compose.yaml config --format json',
  'a raw log': 'docker logs <app>',
  'a raw log tail': 'docker logs --tail <int> <app>',
  'a compose log': 'docker compose -f /srv/app/compose.yaml logs <app>',
  'a log through cat': 'docker logs --tail <int> <app> | cat',
  'a log through an inverted filter': "docker logs --tail <int> <app> | grep -v ping",
  'a log through a short pattern': "docker logs --tail <int> <app> | grep -F ab",
  'a log through an empty pattern': "docker logs --tail <int> <app> | grep -F ''",
  'a log through a regex that keeps all': "docker logs --tail <int> <app> | grep -v -F Base",
  'sudo': 'sudo docker ps',
  'su': 'su -c ls',
  'doas': 'doas ls',
  'a privileged run': 'docker run --privileged <app>',
  'a root run': 'docker run --user root <app>',
  'a run as uid 0': 'docker run -u 0 <app>',
  'an interactive exec': 'docker exec -it <app> sh',
  'an interactive run': 'docker run -it <app>',
  'a tty exec': 'docker exec -t <app> id',
  'a shell': 'sh',
  'a shell in a container': 'docker exec <app> sh',
  'a bash': 'bash -c ls',
  'a socket': 'socat TCP-LISTEN:8080,fork TCP:localhost:80',
  'a listener': 'nc -l 8080',
  'a nested ssh': 'ssh other-host id',
  'a port forward': 'docker run -p 8080:80 <app>',
};
for (const [name, line] of Object.entries({ ...badLines, ...barrier })) {
  test(`list check refuses ${name}`, () => {
    const text = `${LIST}\n\n${line}\n`;
    const lineNumber = text.split('\n').indexOf(line.split('\n')[0]) + 1;
    for (const argv of [['--check'], ['--list'], ['2'], ['--dry', '2']]) {
      const r = launch(argv, { list: text });
      noSpawn(r);
      assert.notEqual(r.status, 0, `${argv.join(' ')} should stop`);
      assert.match(r.err, new RegExp(`line ${lineNumber}\\b`, 'i'), `names line ${lineNumber}: ${r.err}`);
    }
  });
}
test('an end-of-line carriage return of a Windows file is not a bad line', () => {
  const r = launch(['--check'], { list: LIST.replace(/\n/g, '\r\n') });
  assert.equal(r.status, 0, r.err);
  assert.match(r.out, /lines:\s*6/i);
});
test('a bad line far in the file is not dropped in silence: the first bad line is named', () => {
  const r = launch(['--check'], { list: `${LIST}\nrm -rf /\ndocker volume rm <app>\n` });
  assert.notEqual(r.status, 0);
  assert.match(r.err, /line 9\b/i);
});

// The example list loads, and each of its lines runs through the launcher as written.
test('the example list loads clean', () => {
  const r = launch(['--check'], { list: exampleText });
  assert.equal(r.status, 0, r.err);
  const count = exampleText.split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith('#')).length;
  assert.match(r.out, new RegExp(`lines:\\s*${count}\\b`));
});
const sample = { app: 'api', version: '1.2.3', int: '200', path: '/srv/app/app.env' };
exampleText.split(/\r?\n/).forEach((text, i) => {
  if (!text.trim() || text.trim().startsWith('#')) return;
  test(`example line ${i + 1} runs as written: ${text}`, () => {
    const jokersOf = [...text.matchAll(/<(app|version|int|path)>/g)].map((m) => sample[m[1]]);
    const remote = text.replace(/<(app|version|int|path)>/g, (_, k) => sample[k]);
    const r = launch([String(i + 1), ...jokersOf], { list: exampleText });
    assert.equal(r.calls.length, 1, r.err);
    assert.equal(r.calls[0].args.at(-1), remote);
  });
});
test('the example list names no real value', () => {
  assert.doesNotMatch(exampleText, /\b(?!192\.0\.2\.)\d{1,3}(\.\d{1,3}){3}\b/);
  assert.doesNotMatch(exampleText, /ugreen|ugos|natsume|loric/i);
});

// ---------------------------------------------------------------------------------------------------
// 5. The hook, from the outside, without a real ssh: both tools of the shell, and the write tools.
// ---------------------------------------------------------------------------------------------------
function runHook(payload, extraEnv) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prod-hook-'));
  try {
    return spawnSync('node', [guardPath], {
      input: JSON.stringify({ cwd: dir, ...payload }),
      env: { ...process.env, LUN_PROD_SSH_HOSTS: '', LUN_PROD_SSH_ALLOW_FILE: '', LUN_PROD_SSH_PROTECT: '', ...extraEnv },
      encoding: 'utf8',
    });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
const instDir = fs.mkdtempSync(path.join(os.tmpdir(), 'prod-inst-'));
const instAllow = path.join(instDir, 'prod-allow.txt');
const instSettings = path.join(instDir, 'settings.json');
fs.writeFileSync(instAllow, LIST);
fs.writeFileSync(instSettings, '{}');
process.on('exit', () => fs.rmSync(instDir, { recursive: true, force: true }));
const hookEnv = { LUN_PROD_SSH_HOSTS: 'nas-prod,192.0.2.10', LUN_PROD_SSH_ALLOW_FILE: instAllow, LUN_PROD_SSH_PROTECT: instSettings };

test('the hook refuses a mention for Bash and PowerShell, with a fixed message, and is silent without the data', () => {
  for (const tool of ['Bash', 'PowerShell']) {
    const r = runHook({ tool_name: tool, tool_input: { command: 'ssh nas-prod "docker volume rm data"' } }, hookEnv);
    assert.equal(r.status, 2, r.stderr);
    assert.match(r.stderr, /lun guard/);
    assert.doesNotMatch(r.stderr, /nas-prod|volume|data/);
    assert.equal(runHook({ tool_name: tool, tool_input: { command: 'git status' } }, hookEnv).status, 0);
    assert.equal(runHook({ tool_name: tool, tool_input: { command: 'ssh nas-prod id' } }, {}).status, 0);
    assert.equal(runHook({ tool_name: tool, tool_input: { command: `cat ${instAllow}` } }, hookEnv).status, 2);
    assert.equal(runHook({ tool_name: tool, tool_input: { command: 'ssh $H id' } }, hookEnv).status, 2);
  }
});
test('the hook refuses a bypass of the review (a raw carriage return) and lets the launcher through', () => {
  assert.equal(runHook({ tool_name: 'Bash', tool_input: { command: 'ssh nas-prod "docker volume create api"\r"; docker volume rm data"' } }, hookEnv).status, 2);
  assert.equal(runHook({ tool_name: 'Bash', tool_input: { command: `node "${runPath}" 3 api` } }, hookEnv).status, 0);
  assert.equal(runHook({ tool_name: 'PowerShell', tool_input: { command: `node "${runPath}" --check` } }, hookEnv).status, 0);
});
test('the hook refuses a write to the list, the settings and the hooks, for each write tool', () => {
  const targets = [instAllow, instSettings, path.join(here, 'guard.mjs'), path.join(here, 'new-file.mjs')];
  const shapes = [
    ['Write', (p) => ({ file_path: p, content: 'x' })],
    ['Edit', (p) => ({ file_path: p, old_string: 'a', new_string: 'b' })],
    ['MultiEdit', (p) => ({ file_path: p, edits: [] })],
    ['NotebookEdit', (p) => ({ notebook_path: p, new_source: 'x' })],
  ];
  for (const [tool, input] of shapes) {
    for (const t of targets) {
      const r = runHook({ tool_name: tool, tool_input: input(t) }, hookEnv);
      assert.equal(r.status, 2, `${tool} ${t}: ${r.stderr}`);
      assert.match(r.stderr, /lun guard/);
      assert.equal(runHook({ tool_name: tool, tool_input: input(t) }, {}).status, 0, `${tool} without hosts`);
    }
    assert.equal(runHook({ tool_name: tool, tool_input: input(path.join(os.tmpdir(), 'other.txt')) }, hookEnv).status, 0, `${tool} elsewhere`);
  }
});
test('the hook refuses everything it is asked about when the configuration is bad, and says why', () => {
  const r = runHook({ tool_name: 'Bash', tool_input: { command: 'git status' } }, { LUN_PROD_SSH_HOSTS: 'nas' });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /host/i);
  assert.doesNotMatch(r.stderr, /\bnas\b.*\bnas\b/);
});
test('hooks.json runs guard.mjs for the shell tools and the write tools', () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(here, 'hooks.json'), 'utf8'));
  const tools = new Set(cfg.hooks.PreToolUse.filter((e) => e.hooks.some((h) => h.command.includes('guard.mjs'))).flatMap((e) => e.matcher.split('|')));
  for (const t of ['Bash', 'PowerShell', 'Write', 'Edit', 'MultiEdit', 'NotebookEdit']) assert.ok(tools.has(t), `${t} in ${[...tools]}`);
});

// The launcher as a script, with no ssh to run: its refusals and its lists.
function script(argv, environment) {
  return spawnSync('node', [runPath, ...argv], { env: { ...process.env, LUN_PROD_SSH_HOSTS: '', LUN_PROD_SSH_ALLOW_FILE: '', ...environment }, encoding: 'utf8' });
}
test('prod-run.mjs as a script: refuses without configuration, lists and checks with it', () => {
  const none = script(['--check'], {});
  assert.notEqual(none.status, 0);
  assert.match(none.stderr + none.stdout, /not configured/i);
  const ok = script(['--check'], { LUN_PROD_SSH_HOSTS: 'nas-prod,192.0.2.10', LUN_PROD_SSH_ALLOW_FILE: examplePath });
  assert.equal(ok.status, 0, ok.stderr);
  assert.match(ok.stdout, /hosts:\s*2/i);
  assert.doesNotMatch(ok.stdout + ok.stderr, /nas-prod|192\.0\.2\.10/);
  const list = script(['--list'], { LUN_PROD_SSH_HOSTS: 'nas-prod', LUN_PROD_SSH_ALLOW_FILE: examplePath });
  assert.equal(list.status, 0, list.stderr);
  assert.match(list.stdout, /docker compose -f \/srv\/app\/compose\.yaml config --services/);
  const bad = script(['999'], { LUN_PROD_SSH_HOSTS: 'nas-prod', LUN_PROD_SSH_ALLOW_FILE: examplePath });
  assert.notEqual(bad.status, 0);
  assert.match(bad.stderr, /line/i);
});
