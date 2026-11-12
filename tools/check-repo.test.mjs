import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import {
  checkRequiredFiles,
  checkMaxLines,
  checkNoInternalAddresses,
  checkSameFile,
  checkNoPrivateNames,
  checkMedia,
} from './check-repo.mjs';

function fixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lun-docs-'));
  for (const [rel, content] of Object.entries(files)) {
    const file = path.join(root, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
  }
  return root;
}

test('checkRequiredFiles reports a missing file', () => {
  const root = fixture({ 'README.md': '# x' });
  assert.deepEqual(checkRequiredFiles(root, ['README.md', 'vision.md']), ['missing: vision.md']);
});

test('checkRequiredFiles accepts present files', () => {
  const root = fixture({ 'vision.md': '# x' });
  assert.deepEqual(checkRequiredFiles(root, ['vision.md']), []);
});

test('checkMaxLines reports a file over the limit', () => {
  const root = fixture({ 'standards/long.md': 'x\n'.repeat(151) });
  const errors = checkMaxLines(root, 'standards', 150);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /standards\/long\.md: 151 lines \(max 150\)/);
});

test('checkMaxLines accepts 150 CRLF lines', () => {
  const root = fixture({ 'standards/ok.md': 'x\r\n'.repeat(150) });
  assert.deepEqual(checkMaxLines(root, 'standards', 150), []);
});

test('checkMaxLines accepts a single file path', () => {
  const root = fixture({ 'templates/CLAUDE.md': 'x\n'.repeat(101) });
  assert.equal(checkMaxLines(root, 'templates/CLAUDE.md', 100).length, 1);
});

test('checkNoInternalAddresses flags private and tailnet addresses', () => {
  const root = fixture({
    'a.md': 'nas at 192.168.1.20\nalso 10.0.0.5 and 172.20.1.1\n',
    'b.yaml': 'tailscale: 100.101.102.103\nhost: nas.tail1234.ts.net\n',
  });
  const errors = checkNoInternalAddresses(root);
  for (const needle of ['192.168.1.20', '10.0.0.5', '172.20.1.1', '100.101.102.103', 'nas.tail1234.ts.net']) {
    assert.ok(errors.some((e) => e.includes(needle)), `expected a report for ${needle}`);
  }
});

test('checkNoInternalAddresses ignores versions, colors and loopback', () => {
  const root = fixture({
    'c.md': 'version 1.2.3, tag v10.0.0, color #7A1818, http://127.0.0.1:3000, 172.32.0.1, 100.200.1.1\n',
  });
  assert.deepEqual(checkNoInternalAddresses(root), []);
});

test('checkNoInternalAddresses skips node_modules and .git', () => {
  const root = fixture({
    'node_modules/x/readme.md': '192.168.0.1',
    '.git/config': '10.1.1.1',
  });
  assert.deepEqual(checkNoInternalAddresses(root), []);
});

test('checkNoInternalAddresses skips lines marked allow-address', () => {
  const root = fixture({ 'd.md': 'example: 192.168.1.20 <!-- allow-address -->\nreal: 10.0.0.9\n' });
  const errors = checkNoInternalAddresses(root);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /10\.0\.0\.9/);
});

test('checkNoInternalAddresses scans any text file, whatever its extension', () => {
  const root = fixture({
    'templates/.env.example': 'NAS_HOST=192.168.1.20\n',
    'config.toml': 'host = "10.0.0.5"\n',
    'Dockerfile': 'ENV H=172.16.0.2\n',
  });
  const errors = checkNoInternalAddresses(root);
  assert.equal(errors.length, 3, errors.join('\n'));
});

test('checkNoInternalAddresses skips binary files', () => {
  const root = fixture({ 'logo.png': 'PNG\u0000\u0001 192.168.1.1' });
  assert.deepEqual(checkNoInternalAddresses(root), []);
});

const CLI = fileURLToPath(new URL('./check-repo.mjs', import.meta.url));

function gitRepo(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lun-addr-'));
  for (const [name, text] of Object.entries(files)) fs.writeFileSync(path.join(root, name), text);
  execFileSync('git', ['init', '-q'], { cwd: root });
  execFileSync('git', ['add', '.'], { cwd: root });
  return root;
}

function runCli(args) {
  try {
    return { code: 0, out: execFileSync(process.execPath, [CLI, ...args], { encoding: 'utf8', stdio: 'pipe' }) };
  } catch (e) {
    return { code: e.status, out: `${e.stdout}${e.stderr}` };
  }
}

test('--addresses scans another repo and fails on a private IP', () => {
  const root = gitRepo({ 'config.md': 'host: 192.168.1.20\n' });
  const { code, out } = runCli(['--addresses', root]);
  assert.equal(code, 1);
  assert.match(out, /config\.md:1/);
});

test('--addresses passes on a repo without internal address', () => {
  const root = gitRepo({ 'README.md': '# Clean\n' });
  assert.equal(runCli(['--addresses', root]).code, 0);
});

test('checkSameFile reports two copies that drifted, and ignores line endings', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lun-same-'));
  fs.writeFileSync(path.join(root, 'a.md'), '## Issue\n');
  fs.writeFileSync(path.join(root, 'b.md'), '## Issue\r\n');
  assert.deepEqual(checkSameFile(root, 'a.md', 'b.md'), []);
  fs.writeFileSync(path.join(root, 'b.md'), '## Ticket\n');
  assert.equal(checkSameFile(root, 'a.md', 'b.md').length, 1);
  assert.deepEqual(checkSameFile(root, 'a.md', 'absent.md'), []);
});

test('checkNoInternalAddresses flags home network names and IPv6 ULA', () => {
  const root = fixture({ 'e.md': 'nas.lan, box.home.arpa, fd00::1, fd12:3456:789a::1\n' });
  const errors = checkNoInternalAddresses(root);
  for (const needle of ['nas.lan', 'box.home.arpa', 'fd00::1', 'fd12:3456:789a::1']) {
    assert.ok(errors.some((e) => e.includes(needle)), `expected a report for ${needle}`);
  }
});

test('checkNoInternalAddresses leaves example names, localhost and look-alikes', () => {
  const root = fixture({
    'f.md': 'nas.local, http://tauri.localhost, x.landing, obj.internal, fd: 3, fdfd, ::1, fe80::1\n',
  });
  assert.deepEqual(checkNoInternalAddresses(root), []);
});

test('checkNoInternalAddresses skips test and spec files of any language', () => {
  const root = fixture({ 'a.test.ts': '192.168.1.20', 'b.spec.js': '10.0.0.5', 'c.test.mjs': 'nas.lan' });
  assert.deepEqual(checkNoInternalAddresses(root), []);
});

// The private names come from the registry next to the script: lun-anima and website.
test('checkNoPrivateNames flags a path written with a private repo name, with its line', () => {
  const root = fixture({ 'a.md': 'see lun-anima/x/y.ts\nor ..\\lun-anima\\x\\y.ps1\n' });
  const errors = checkNoPrivateNames(root);
  assert.ok(errors.some((e) => e.startsWith('a.md:1:')), errors.join('\n'));
  assert.ok(errors.some((e) => e.startsWith('a.md:2:')), errors.join('\n'));
});

test('checkNoPrivateNames flags a package of the core', () => {
  const root = fixture({ 'package.json': '{ "dependencies": { "@lun-anima/kit": "1.0.0" } }\n' });
  assert.equal(checkNoPrivateNames(root).length, 1);
});

test('checkNoPrivateNames lets the name alone and issue or PR links pass', () => {
  const root = fixture({
    'a.md':
      "Lun'Anima, lun-anima, `Lun-Ecosystem/lun-anima`, lun-anima#72\n" +
      'https://github.com/Lun-Ecosystem/lun-anima/issues/72 and https://github.com/Lun-Ecosystem/lun-anima/pull/9\n',
  });
  assert.deepEqual(checkNoPrivateNames(root), []);
});

test('checkNoPrivateNames flags a blob or tree link to a file of the core', () => {
  const root = fixture({
    'a.md':
      'https://github.com/Lun-Ecosystem/lun-anima/blob/main/x/y.ts\n' +
      'https://github.com/Lun-Ecosystem/lun-anima/tree/main/x\n',
  });
  assert.equal(checkNoPrivateNames(root).length, 2);
});

test('checkNoPrivateNames skips lines marked allow-private, and test files', () => {
  const root = fixture({
    'a.md': 'example: lun-anima/x/y.ts <!-- allow-private -->\n',
    'b.test.ts': "const p = 'lun-anima/x/y.ts';\n",
  });
  assert.deepEqual(checkNoPrivateNames(root), []);
});

test('checkNoPrivateNames flags the folders of the core written alone in lun-docs only', () => {
  const root = fixture({ 'a.md': 'one: ui/src/a.ts, two: core/src/a.ts\n' });
  assert.equal(checkNoPrivateNames(root, { docs: true }).length, 2);
  assert.deepEqual(checkNoPrivateNames(root), []);
});

test('checkNoPrivateNames leaves the dated plans up to 12/11 and checks the living ones', () => {
  const root = fixture({
    'docs/plans/2026-11-12-old.md': 'core/src/x.ts\n',
    'docs/specs/2026-10-19-old.md': 'lun-anima/x/y.ts\n',
    'docs/mise-en-service-desktop.md': 'lun-anima/x/y\n',
    'docs/plans/2026-11-13-new.md': 'core/src/x.ts\n',
    'docs/plans/2026-11-07-feuille-de-route-mvp.md': 'core/src/x.ts\n',
    'docs/specs/2026-11-10-etat-cible-cadrage.md': 'core/src/x.ts\n',
  });
  const files = checkNoPrivateNames(root, { docs: true }).map((e) => e.split(':')[0]);
  assert.deepEqual(files.sort(), [
    'docs/plans/2026-11-07-feuille-de-route-mvp.md',
    'docs/plans/2026-11-13-new.md',
    'docs/specs/2026-11-10-etat-cible-cadrage.md',
  ]);
});

const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

test('checkMedia flags a sound', () => {
  const root = fixture({ 'docs/take.wav': 'RIFF\u0000', 'b/c.FLAC': 'x' });
  assert.equal(checkMedia(root).length, 2);
});

test('checkMedia wants a SOURCE.md carrying the SHA-256 of a model', () => {
  const model = Buffer.from([1, 2, 3, 0, 4]);
  const root = fixture({ 'm/vad.onnx': model });
  assert.equal(checkMedia(root).length, 1, 'no SOURCE.md');
  fs.writeFileSync(path.join(root, 'm/SOURCE.md'), `SHA-256 : \`${sha256(model).toUpperCase()}\`\n`);
  assert.deepEqual(checkMedia(root), []);
  fs.writeFileSync(path.join(root, 'm/vad.onnx'), Buffer.from([1, 2, 3, 0, 5]));
  assert.equal(checkMedia(root).length, 1, 'one byte changed');
});

test('--public scans another repo, fails on a core path and names the folder it checked', () => {
  const root = gitRepo({ 'README.md': 'see lun-anima/x/y.ts\n' });
  const { code, out } = runCli(['--public', root]);
  assert.equal(code, 1);
  assert.match(out, /README\.md:1/);
  assert.ok(out.includes(`checked: ${path.basename(root)}\n`), out);
  const clean = gitRepo({ 'README.md': '# Clean\n' });
  const ok = runCli(['--public', clean]);
  assert.equal(ok.code, 0, ok.out);
  assert.ok(ok.out.trimEnd().endsWith(`checked: ${path.basename(clean)}`), ok.out);
});

test('an unknown flag fails and is named', () => {
  const { code, out } = runCli(['--adresses', '.']);
  assert.equal(code, 1);
  assert.match(out, /unknown flag: --adresses/);
});

test('--addresses still passes on a repo with a core path', () => {
  const root = gitRepo({ 'README.md': 'see lun-anima/x/y.ts\n' });
  assert.equal(runCli(['--addresses', root]).code, 0);
});
