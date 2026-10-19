import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkRequiredFiles, checkMaxLines, checkNoInternalAddresses } from './check-repo.mjs';

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
