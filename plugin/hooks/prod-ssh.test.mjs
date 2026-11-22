// Tests of the prod-SSH guard (lun-docs#192), written before its code.
// Supposed API: evaluateCommand(command, { prod: { hosts, patterns } }) from guard.mjs, which calls prod-ssh.mjs;
// loadProdConfig(env, readFile) from prod-ssh.mjs; the hook reads LUN_PROD_SSH_HOSTS and LUN_PROD_SSH_ALLOW_FILE.
// Only generic names here: no real host, user, path or alias.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { evaluateCommand } from './guard.mjs';
// Loaded softly so each test fails on its own while prod-ssh.mjs does not exist.
const { loadProdConfig = () => { throw new Error('prod-ssh.mjs: loadProdConfig is missing'); } } = await import('./prod-ssh.mjs').catch(() => ({}));

const here = path.dirname(fileURLToPath(import.meta.url));
const guardPath = path.join(here, 'guard.mjs');
const examplePath = path.join(here, 'prod-ssh-allow.example');
const hosts = ['nas-prod', '192.0.2.10'];
const patternsOf = (text) => text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'));
const example = patternsOf(fs.readFileSync(examplePath, 'utf8'));
const prod = { hosts, patterns: example };
const on = (command, p = prod) => evaluateCommand(command, { cwd: '/repo', prod: p });
const ssh = (remote, target = 'nas-prod') => `ssh ${target} "${remote}"`;

function assertBlocked(command, p = prod, why) {
  const r = on(command, p);
  assert.equal(r.block, true, `should be blocked: ${command}`);
  assert.ok(r.reason && r.reason.length > 0);
  if (why) assert.match(r.reason, why);
}
const assertAllowed = (command, p = prod) => assert.equal(on(command, p).block, false, `should pass: ${command}`);

// 1. The closed list passes, one by one; each twin (no format, no filter, an erasing option) is refused.
const pass = [
  "docker compose -f /srv/app/compose.yaml config --services",
  "docker ps --format '{{.Names}} {{.Status}}'",
  "docker inspect --format '{{.State.Health.Status}}' api",
  "docker volume ls --format '{{.Name}}'",
  "docker logs --tail 200 api | grep -F 'Base copiée'",
  'docker compose -f /srv/app/compose.yaml up -d api',
  'docker compose -f /srv/app/compose.yaml stop api',
  'docker compose -f /srv/app/compose.yaml restart api',
  'docker compose -f /srv/app/compose.yaml pull',
  'docker logout registry.example.test',
  '/srv/app/deploy.sh api 1.2.3',
  '/srv/app/deploy.sh api --rollback',
  "docker exec api node -p 'new Date().toString()'",
  'grep ^APP_KEY= /srv/app/app.env | wc -c',
  'docker volume create api-data',
  'stat -c %a /srv/app/app.env',
  "docker ps --format '{{.Names}} {{.Status}}' && docker volume ls --format '{{.Name}}'",
];
for (const remote of pass) test(`list passes: ${remote}`, () => assertAllowed(ssh(remote)));

const twins = [
  'docker compose -f /srv/app/compose.yaml config',
  'docker compose -f /srv/app/compose.yaml config --format json',
  'docker ps',
  'docker ps -a',
  'docker inspect api',
  "docker inspect --format '{{json .}}' api",
  "docker inspect --format '{{json .Config.Env}}' api",
  'docker image inspect registry.example.test/app:1.2.3',
  'docker volume ls',
  'docker logs api',
  'docker logs --tail 200 api',
  "docker logs --tail 200 api | grep -v ping",
  'docker logs --tail 200 api | cat',
  "docker logs --tail 200 api | grep -F 'Base copiée' | tee /tmp/x",
  'docker compose -f /srv/app/compose.yaml up -d',
  'docker compose -f /srv/app/compose.yaml up -d api worker',
  'docker compose -f /srv/app/compose.yaml stop',
  'docker compose -f /srv/app/compose.yaml down',
  'docker compose -f /srv/app/compose.yaml down -v',
  'docker compose -f /srv/app/compose.yaml down --volumes',
  'docker login registry.example.test',
  'docker login -u pilot -p hunter2 registry.example.test',
  '/srv/app/deploy.sh api latest',
  '/srv/app/deploy.sh api',
  '/srv/app/deploy.sh api 1.2.3 extra',
  '/srv/app/deploy.sh API 1.2.3',
  './deploy.sh api 1.2.3',
  'docker exec api env',
  "docker exec api node -e 'console.log(process.env)'",
  'cat /srv/app/app.env',
  'grep ^APP_KEY= /srv/app/app.env',
  'grep ^APP_KEY= /srv/app/app.env | cat',
  'docker volume rm api-data',
  'stat -c %a /srv/app/../../etc/shadow',
  'stat -c %a /srv/app/*',
  'stat -c %a ~/x',
];
for (const remote of twins) test(`twin refused: ${remote}`, () => assertBlocked(ssh(remote)));

// 2. Second barrier: refused even if a pattern covered it.
const dangerous = [
  'sudo docker ps', 'su -c ls', 'doas ls',
  'docker run --privileged alpine id', 'docker run --user root alpine id', 'docker run -u 0 alpine id',
  'docker volume rm api-data', 'docker volume prune -f', 'docker system prune -af', 'docker image prune -a',
  'docker container prune', 'docker builder prune',
  'docker compose -f /srv/app/compose.yaml down -v', 'docker compose -f /srv/app/compose.yaml down --volumes',
  'docker rm -v api', 'docker compose -f /srv/app/compose.yaml rm -v',
  'rm -rf /srv/app/data', 'rm /srv/app/data/x.db', 'rmdir /srv/app/data', 'mv /srv/app/data /tmp/data',
  'find /srv/app/data -delete', 'shred /srv/app/x', 'truncate -s 0 /srv/app/x',
  'docker inspect api', "docker inspect --format '{{json .}}' api", "docker inspect --format '{{json .Config.Env}}' api",
  "docker inspect --format '{{.Config.Env}}' api", 'docker image inspect img',
  'docker exec api env', 'docker exec api printenv', 'docker exec api cat /proc/1/environ', 'docker exec -it api sh',
  'docker run --rm img env',
  'cat /srv/app/app.env', 'grep KEY /srv/app/.env', 'less /srv/app/prod.env', 'head -n 3 /srv/app/app.env',
  'cat /home/pilot/.docker/config.json', 'cat /home/pilot/.ssh/id_ed25519', 'cat /home/pilot/.ssh/authorized_keys',
  'docker compose -f /srv/app/compose.yaml config', 'docker compose -f /srv/app/compose.yaml config --format json',
  'docker logs api', 'docker logs --tail 50 api', 'docker compose -f /srv/app/compose.yaml logs api',
  'docker logs api | grep -v ping', 'docker logs api | cat',
  'socat TCP-LISTEN:8080,fork TCP:localhost:80', 'nc -l 8080', 'ssh other-host id',
  'bash', 'sh', 'sh -c ls', 'python3 -c 1', 'eval ls',
];
const danger = { hosts, patterns: dangerous };
for (const remote of dangerous) test(`barrier holds over a covering pattern: ${remote}`, () => assertBlocked(ssh(remote), danger));
test('barrier: grep of an env file passes only when its output is only counted', () => {
  assertAllowed(ssh('grep ^APP_KEY= /srv/app/app.env | wc -c'), { hosts, patterns: ['grep ^APP_KEY= /srv/app/app.env | wc -c'] });
});

// Interactive session, port and socket transfer, at the ssh level.
const sshLevel = [
  'ssh nas-prod', 'ssh -t nas-prod', 'ssh -N nas-prod', 'ssh pilot@nas-prod', 'ssh -p 2222 -l pilot nas-prod',
  'ssh -L 8080:localhost:80 nas-prod "docker volume ls --format \'{{.Name}}\'"',
  'ssh -R 9000:localhost:9000 nas-prod "docker volume ls --format \'{{.Name}}\'"',
  'ssh -D 1080 nas-prod "docker volume ls --format \'{{.Name}}\'"',
  'ssh -W localhost:80 nas-prod',
  'ssh -o LocalForward=8080:localhost:80 nas-prod "docker volume ls --format \'{{.Name}}\'"',
  'ssh -o RemoteForward=9000:localhost:9000 nas-prod "docker volume ls --format \'{{.Name}}\'"',
  'ssh -o ProxyCommand=x nas-prod "docker volume ls --format \'{{.Name}}\'"',
  'ssh -A nas-prod "docker volume ls --format \'{{.Name}}\'"',
  'ssh -S /tmp/sock nas-prod "docker volume ls --format \'{{.Name}}\'"',
  'ssh -J nas-prod other-host id', 'ssh -o ProxyJump=nas-prod other-host id',
  'ssh -F other.conf other-host docker ps', 'ssh -o Hostname=nas-prod other-host id',
];
for (const c of sshLevel) test(`ssh level refused: ${c}`, () => assertBlocked(c));

// 3. Targets written otherwise.
const targets = ['nas-prod', 'pilot@nas-prod', 'NAS-PROD', 'nas-prod.', 'nas-prod.local', '192.0.2.10', 'pilot@192.0.2.10',
  'ssh://pilot@nas-prod:2200', '-p 2222 pilot@nas-prod', '-l pilot nas-prod', '-lpilot nas-prod', '-i key -o BatchMode=yes nas-prod',
  '-q -o ConnectTimeout=5 -p 2222 -l pilot nas-prod'];
for (const t of targets) {
  test(`target ${t}: a twin is refused`, () => assertBlocked(`ssh ${t} "docker volume rm api-data"`));
  test(`target ${t}: the list passes`, () => assertAllowed(`ssh ${t} "docker volume ls --format '{{.Name}}'"`));
}
test('options after the host and after --', () => {
  assertAllowed(`ssh pilot@nas-prod -p 2222 "docker volume ls --format '{{.Name}}'"`);
  assertAllowed(`ssh nas-prod -- "docker volume ls --format '{{.Name}}'"`);
  assertBlocked('ssh pilot@nas-prod -p 2222 "docker volume rm x"');
});

// 4. Bypasses: quoting, chaining.
const chains = ['; ', ' && ', ' || ', ' | ', ' & ', '\n'];
for (const sep of chains) {
  test(`chain ${JSON.stringify(sep)} with a refused piece is refused`, () => {
    assertBlocked(ssh(`docker volume ls --format '{{.Name}}'${sep}docker volume rm api-data`));
    assertBlocked(ssh(`docker volume rm api-data${sep}docker volume ls --format '{{.Name}}'`));
  });
}
test('a pipe passes only to a filter of the list', () => {
  assertBlocked(ssh("docker volume ls --format '{{.Name}}' | sh"));
  assertBlocked(ssh("docker volume ls --format '{{.Name}}' | xargs docker volume rm"));
  assertBlocked(ssh("docker volume ls --format '{{.Name}}' | tee /tmp/x"));
});
const quoting = [
  `ssh nas-prod 'docker volume rm api-data'`,
  `ssh nas-prod "docker volume rm api-data"`,
  `ssh nas-prod docker volume rm api-data`,
  `ssh nas-prod docker volume ls --format '{{.Name}}' ';' docker volume rm api-data`,
  `ssh nas-prod docker ps '&&' rm -rf /srv/app`,
  `ssh nas-prod "docker volume ls --format '{{.Name}}'; rm -rf /srv/app/data"`,
  `ssh nas-prod docker volume ls --format '{{.Name}}'`, // unquoted on the laptop: the remote words differ from the list
];
for (const c of quoting) test(`quoting refused: ${c}`, () => assertBlocked(c));
const substitutions = [
  'docker volume ls --format "$(echo {{.Name}})"', 'docker volume ls --format `echo x`', 'echo $(docker volume rm x)',
  '(docker volume rm x)', '{ docker volume rm x; }', 'docker volume ls --format x > /srv/app/y',
  'docker volume ls --format x >> /srv/app/y', 'docker volume ls < /srv/app/y', 'echo $HOME', 'ls *',
];
for (const r of substitutions) test(`remote shell syntax refused: ${r}`, () => assertBlocked(ssh(r.replaceAll('"', "'"))));
test('laptop side: output piped or redirected locally passes', () => {
  assertAllowed(`${ssh("docker volume ls --format '{{.Name}}'")} | grep api`);
  assertAllowed(`${ssh("docker volume ls --format '{{.Name}}'")} > out.txt`);
});

// 5. Bypasses: interpreters, variables, scripts, other ways to open ssh.
const interpreters = ['sh -c "docker ps"', "bash -c 'docker volume ls --format x'", 'eval docker ps', 'env docker ps',
  'command docker ps', 'nohup docker ps', 'xargs docker ps', '/bin/sh', 'python3 -c 1', 'perl -e 1', 'busybox sh', 'node -e 1'];
for (const r of interpreters) test(`remote interpreter refused: ${r}`, () => assertBlocked(ssh(r.replaceAll('"', "'"))));

const variables = [
  'ssh $NAS docker volume ls', 'ssh "$NAS" docker volume ls', 'ssh ${NAS} id', 'ssh $(cat host) id', 'ssh `cat host` id',
  'ssh $env:NAS id', 'HOST=nas-prod; ssh $HOST id', 'ssh nas-prod $CMD', 'ssh nas-prod docker $SUB',
  'ssh nas-prod "docker volume rm $V"', 'ssh nas-prod $(echo docker) ps', '$c = "docker volume rm x"; ssh nas-prod $c',
  'ssh @args', 'ssh nas-prod @args',
];
for (const c of variables) test(`unresolvable variable refused: ${c}`, () => assertBlocked(c));

const scripts = [
  'scp deploy.sh nas-prod:/tmp/d.sh && ssh nas-prod sh /tmp/d.sh', 'cat d.sh | ssh nas-prod sh', 'ssh nas-prod sh < d.sh',
  "ssh nas-prod 'bash -s' < d.sh", 'ssh nas-prod "/tmp/d.sh"', 'ssh nas-prod ./deploy.sh api 1.2.3',
  'ssh nas-prod <<EOF\nrm -rf x\nEOF', `echo x | ssh nas-prod "docker volume ls --format '{{.Name}}'"`,
  'ssh nas-prod "cat > /tmp/x.sh"',
  'scp f nas-prod:/tmp', 'scp pilot@nas-prod:/srv/app/app.env .', 'scp -P 2222 f pilot@192.0.2.10:/tmp', 'sftp nas-prod',
  'rsync -e ssh f nas-prod:/srv/x', 'rsync -av nas-prod:/srv/app/ .', 'sshfs nas-prod:/ mnt', 'ssh-copy-id nas-prod',
  'mosh nas-prod', 'autossh nas-prod',
];
for (const c of scripts) test(`script or copy refused: ${c.replace(/\n/g, ' ')}`, () => assertBlocked(c));

const calls = [
  '/usr/bin/ssh nas-prod docker volume rm x', 'ssh.exe nas-prod docker volume rm x', 'C:\\Windows\\System32\\OpenSSH\\ssh.exe nas-prod docker volume rm x',
  'command ssh nas-prod docker volume rm x', 'env ssh nas-prod docker volume rm x', 'exec ssh nas-prod docker volume rm x',
  '\\ssh nas-prod docker volume rm x', "'ssh' nas-prod docker volume rm x", '"ssh" nas-prod docker volume rm x',
  '& ssh nas-prod "docker volume rm x"', '& "C:\\Windows\\System32\\OpenSSH\\ssh.exe" nas-prod "docker volume rm x"',
  'bash -c "ssh nas-prod docker volume rm x"', "sh -c 'ssh nas-prod docker volume rm x'", 'pwsh -Command "ssh nas-prod docker volume rm x"',
  'eval "ssh nas-prod docker volume rm x"', 'Invoke-Expression "ssh nas-prod docker volume rm x"', 'iex "ssh nas-prod docker volume rm x"',
  'echo nas-prod | xargs -I{} ssh {} docker volume rm x', 'xargs ssh', 'Start-Process ssh -ArgumentList "nas-prod","docker volume rm x"',
  'function n { ssh nas-prod docker volume rm x }', "alias n='ssh nas-prod'", 'Set-Alias n ssh', 'Set-Alias -Name n -Value ssh.exe',
  '(cd /tmp && ssh nas-prod docker volume rm x)', 'cd /tmp; ssh nas-prod docker volume rm x',
];
for (const c of calls) test(`ssh by another door refused: ${c}`, () => assertBlocked(c));

const otherTools = [
  'docker -H ssh://nas-prod ps', 'docker --host=ssh://pilot@nas-prod:22 ps', 'docker -H tcp://nas-prod:2375 ps',
  'DOCKER_HOST=ssh://nas-prod docker ps', 'export DOCKER_HOST=ssh://nas-prod', '$env:DOCKER_HOST = "ssh://nas-prod"',
  "$env:DOCKER_HOST='ssh://nas-prod'; docker ps", 'docker context create nas --docker host=ssh://nas-prod',
  'docker context use nas', 'docker --context nas ps', 'docker -c nas ps', 'DOCKER_CONTEXT=nas docker ps',
  '$env:DOCKER_CONTEXT = "nas"; docker ps', 'docker -H ssh://pilot@192.0.2.10 volume ls', 'docker compose -H ssh://nas-prod ps',
];
for (const c of otherTools) test(`other tool opening ssh refused: ${c}`, () => assertBlocked(c));

// 6. The refusal.
test('the refusal names the part, the reason, the rule, and stops', () => {
  const r = on(ssh("docker volume ls --format '{{.Name}}' && docker volume rm api-data"));
  assert.equal(r.block, true);
  assert.match(r.reason, /docker volume rm/);
  assert.match(r.reason, /prod/i);
  assert.match(r.reason, /closed list/i);
  assert.match(r.reason, /environnements\.md/);
  assert.match(r.reason, /stop/i);
  assert.match(r.reason, /CrOliX/);
});
test('the refusal does not copy a secret', () => {
  for (const c of [
    ssh('docker login -u pilot -p hunter2secret registry.example.test'),
    ssh('echo TOKEN=sk-abc123SECRET | cat'),
    'ssh nas-prod "curl -H \'Authorization: Bearer abc123SECRET\' x"',
  ]) {
    const r = on(c);
    assert.equal(r.block, true);
    assert.doesNotMatch(r.reason, /hunter2secret|sk-abc123SECRET|abc123SECRET/);
    assert.ok(r.reason.length < 600, `reason too long (${r.reason.length})`);
  }
});

// 7. Nothing breaks.
test('without the host data the guard does what it did before', () => {
  for (const p of [undefined, { hosts: [], patterns: [] }, { hosts: [], patterns: example }]) {
    assertAllowed('ssh nas-prod "docker volume rm api-data"', p);
    assertAllowed('ssh nas-prod', p);
    assertAllowed('DOCKER_HOST=ssh://nas-prod docker ps', p);
  }
});
test('host declared, list empty: every prod ssh is refused, closed by default', () => {
  assertBlocked(ssh("docker volume ls --format '{{.Name}}'"), { hosts, patterns: [] });
});
const local = ['ls -la', 'docker ps', 'docker compose up -d', 'docker volume rm local-test', 'rm -rf node_modules', 'cat .env',
  'git push origin feat/x', 'npm test', 'echo "ssh nas-prod docker volume rm x"', 'git log | grep "ssh nas-prod"',
  'git commit -m "docs: ssh nas-prod docker volume rm"', 'echo $HOME', 'scp f other-host:/tmp', 'rsync -av f other-host:/x',
  'ssh other-host docker volume rm x', 'ssh -p 22 pilot@other-host', 'ssh $HOST id', 'echo hi | ssh other-host cat',
  'ssh -L 8080:localhost:80 other-host', 'DOCKER_HOST=ssh://other-host docker ps', "alias ll='ls -l'"];
for (const c of local) test(`local or non-prod passes: ${c}`, () => assertAllowed(c));
test('existing blocks hold with the guard on', () => {
  for (const c of ['gh pr merge 3', 'git push origin main', 'git push -f', `${ssh("docker volume ls --format '{{.Name}}'")} && git push origin main`]) {
    assertBlocked(c);
  }
});

// Config: where the data comes from.
test('loadProdConfig reads the hosts and the list, outside the repository', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prod-ssh-'));
  const file = path.join(dir, 'allow.txt');
  fs.writeFileSync(file, '# c\n\ndocker volume ls --format \'{{.Name}}\'\n  docker logout registry.example.test  \n');
  try {
    const cfg = loadProdConfig({ LUN_PROD_SSH_HOSTS: 'nas-prod, 192.0.2.10  other', LUN_PROD_SSH_ALLOW_FILE: file });
    assert.deepEqual(cfg.hosts, ['nas-prod', '192.0.2.10', 'other']);
    assert.deepEqual(cfg.patterns, ["docker volume ls --format '{{.Name}}'", 'docker logout registry.example.test']);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
test('loadProdConfig: no data means off; hosts without a readable list means an empty list', () => {
  assert.deepEqual(loadProdConfig({}), { hosts: [], patterns: [] });
  assert.deepEqual(loadProdConfig({ LUN_PROD_SSH_HOSTS: 'nas-prod' }), { hosts: ['nas-prod'], patterns: [] });
  assert.deepEqual(loadProdConfig({ LUN_PROD_SSH_HOSTS: 'nas-prod', LUN_PROD_SSH_ALLOW_FILE: '/nonexistent/x' }), { hosts: ['nas-prod'], patterns: [] });
});
test('the example list names no real value', () => {
  const text = fs.readFileSync(examplePath, 'utf8');
  assert.doesNotMatch(text, /\b(?!192\.0\.2\.)\d{1,3}(\.\d{1,3}){3}\b/);
  assert.doesNotMatch(text, /ugreen|ugos|natsume|loric/i);
});

// The hook itself, without a real ssh: the same entry of hooks.json, both tools.
function runHook(tool, command, env) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'prod-ssh-hook-'));
  try {
    const r = spawnSync('node', [guardPath], {
      input: JSON.stringify({ tool_name: tool, tool_input: { command }, cwd: dir }),
      env: { ...process.env, LUN_PROD_SSH_HOSTS: '', LUN_PROD_SSH_ALLOW_FILE: '', ...env },
      encoding: 'utf8',
    });
    return r;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}
test('the hook is active from the environment, for Bash and PowerShell, and silent without it', () => {
  const env = { LUN_PROD_SSH_HOSTS: 'nas-prod', LUN_PROD_SSH_ALLOW_FILE: examplePath };
  for (const tool of ['Bash', 'PowerShell']) {
    const refused = runHook(tool, 'ssh nas-prod "docker volume rm api-data"', env);
    assert.equal(refused.status, 2, refused.stderr);
    assert.match(refused.stderr, /lun guard/);
    assert.doesNotMatch(refused.stderr, /api-data.*api-data/);
    assert.equal(runHook(tool, `ssh nas-prod "docker volume ls --format '{{.Name}}'"`, env).status, 0);
    assert.equal(runHook(tool, 'ssh nas-prod "docker volume rm api-data"', {}).status, 0);
  }
});
test('hooks.json still runs guard.mjs for both tools', () => {
  const cfg = JSON.parse(fs.readFileSync(path.join(here, 'hooks.json'), 'utf8'));
  const entry = cfg.hooks.PreToolUse.find((e) => e.hooks.some((h) => h.command.includes('guard.mjs')));
  assert.ok(entry && entry.matcher.split('|').includes('Bash') && entry.matcher.split('|').includes('PowerShell'));
});
