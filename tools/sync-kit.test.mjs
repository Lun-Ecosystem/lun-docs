import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { syncKit, HEADER } from './sync-kit.mjs';

function repo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lun-kit-'));
  fs.mkdirSync(path.join(root, 'design/kit/fixtures'), { recursive: true });
  fs.writeFileSync(path.join(root, 'design/kit/Button.svelte'), '<script lang="ts"></script>\n<button>ok</button>\n');
  fs.writeFileSync(path.join(root, 'design/kit/index.ts'), "export { default as Button } from './Button.svelte';\n");
  fs.writeFileSync(path.join(root, 'design/kit/fixtures/Field.svelte'), '<p>champ</p>\n');
  return root;
}

test('writes every kit file with the header', () => {
  const root = repo();
  const target = path.join(root, 'out/ui');
  const { changed } = syncKit(root, target, { check: false });
  assert.equal(changed.length, 3);
  assert.ok(fs.readFileSync(path.join(target, 'Button.svelte'), 'utf8').startsWith(`<!-- ${HEADER} -->\n`));
  assert.ok(fs.readFileSync(path.join(target, 'index.ts'), 'utf8').startsWith(`// ${HEADER}\n`));
  assert.match(fs.readFileSync(path.join(target, 'fixtures/Field.svelte'), 'utf8'), /champ/);
});

test('check passes on an identical copy, even with CRLF line endings', () => {
  const root = repo();
  const target = path.join(root, 'ui');
  syncKit(root, target, { check: false });
  const file = path.join(target, 'index.ts');
  fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace(/\n/g, '\r\n'));
  assert.deepEqual(syncKit(root, target, { check: true }).changed, []);
});

test('check fails on a changed file and names it', () => {
  const root = repo();
  const target = path.join(root, 'ui');
  syncKit(root, target, { check: false });
  const file = path.join(target, 'Button.svelte');
  fs.appendFileSync(file, '<!-- edited -->\n');
  assert.deepEqual(syncKit(root, target, { check: true }).changed, [file]);
  assert.match(fs.readFileSync(file, 'utf8'), /edited/);
});

test('check fails on an extra file in the copy', () => {
  const root = repo();
  const target = path.join(root, 'ui');
  syncKit(root, target, { check: false });
  const extra = path.join(target, 'Local.svelte');
  fs.writeFileSync(extra, '<p>local</p>\n');
  assert.deepEqual(syncKit(root, target, { check: true }).changed, [extra]);
});
