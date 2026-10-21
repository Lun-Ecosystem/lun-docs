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

const worldRepo = () => {
  const root = repo();
  fs.writeFileSync(path.join(root, 'design/tokens.css'), [
    ':root { --encre: #0D0B09; }', '',
    '/* @monde acedia */', "[data-monde='acedia'] { --accent:#3A6080; }", '/* @fin-monde */', '',
    '/* @monde anima */', '/* rouge Anima jamais en texte */', "[data-monde='anima'] { --accent:#7A1818; }", '/* @fin-monde */', ''].join('\n'));
  return root;
};

test('--monde acedia keeps the base and only the acedia block', () => {
  const root = worldRepo();
  const target = path.join(root, 's.css');
  syncTokens(root, target, { check: false, monde: 'acedia' });
  const text = fs.readFileSync(target, 'utf8');
  assert.doesNotMatch(text, /anima/i);
  assert.match(text, /--accent:#3A6080/);
  assert.match(text, /--encre/);
});

test('--monde anima has no acedia block', () => {
  const root = worldRepo();
  const target = path.join(root, 's.css');
  syncTokens(root, target, { check: false, monde: 'anima' });
  const text = fs.readFileSync(target, 'utf8');
  assert.doesNotMatch(text, /acedia/i);
  assert.match(text, /--accent:#7A1818/);
});

test('check with --monde: filtered copy passes, unfiltered copy fails', () => {
  const root = worldRepo();
  const target = path.join(root, 's.css');
  syncTokens(root, target, { check: false, monde: 'acedia' });
  assert.deepEqual(syncTokens(root, target, { check: true, monde: 'acedia' }).changed, []);
  syncTokens(root, target, { check: false });
  assert.deepEqual(syncTokens(root, target, { check: true, monde: 'acedia' }).changed, [target]);
});

test('unknown world exits 2 from the CLI; the real reference filters cleanly', async () => {
  const { spawnSync } = await import('node:child_process');
  const script = path.join(path.dirname(fileURLToPath(import.meta.url)), 'sync-tokens.mjs');
  const r = spawnSync(process.execPath, [script, '--monde', 'nope', path.join(os.tmpdir(), 'x.css')], { encoding: 'utf8' });
  assert.equal(r.status, 2);
  assert.match(r.stderr, /unknown world: nope/);
  const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'lun-real-')), 'a.css');
  const ok = spawnSync(process.execPath, [script, '--monde', 'acedia', out], { encoding: 'utf8' });
  assert.equal(ok.status, 0);
  assert.doesNotMatch(fs.readFileSync(out, 'utf8'), /anima/i);
});
