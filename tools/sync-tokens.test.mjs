import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncTokens, header } from './sync-tokens.mjs';

function repo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lun-tokens-'));
  fs.mkdirSync(path.join(root, 'design'));
  fs.writeFileSync(path.join(root, 'design/tokens.css'), ':root { --encre: #0D0B09; }\n');
  return root;
}

test('a missing copy is reported and written with the generated header', () => {
  const root = repo();
  const target = path.join(root, 'out/styles.css');
  const { changed } = syncTokens(root, target, { check: false });
  assert.deepEqual(changed, [target]);
  const text = fs.readFileSync(target, 'utf8');
  assert.ok(text.startsWith(header));
  assert.match(text, /--encre: #0D0B09/);
});

test('an identical copy, even with CRLF line endings, is unchanged', () => {
  const root = repo();
  const target = path.join(root, 'styles.css');
  syncTokens(root, target, { check: false });
  fs.writeFileSync(target, fs.readFileSync(target, 'utf8').replace(/\n/g, '\r\n'));
  assert.deepEqual(syncTokens(root, target, { check: true }).changed, []);
});

test('check reports a modified copy and writes nothing', () => {
  const root = repo();
  const target = path.join(root, 'styles.css');
  syncTokens(root, target, { check: false });
  fs.appendFileSync(target, '/* edited */\n');
  assert.deepEqual(syncTokens(root, target, { check: true }).changed, [target]);
  assert.match(fs.readFileSync(target, 'utf8'), /edited/);
});

test('check on a missing copy fails the CLI with exit code 1 and the path', async () => {
  const { spawnSync } = await import('node:child_process');
  const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'sync-tokens.mjs');
  const missing = path.join(os.tmpdir(), 'lun-tokens-missing', 'styles.css');
  const r = spawnSync(process.execPath, [script, '--check', missing], { encoding: 'utf8' });
  assert.equal(r.status, 1);
  assert.ok(r.stderr.includes(missing));
});
