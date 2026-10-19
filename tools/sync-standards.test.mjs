import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { syncStandards } from './sync-standards.mjs';

const map = { 'lun-design': ['standards/design.md'], 'lun-ecosysteme': ['vision.md', 'standards/essentiel.md'] };

function repo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lun-sync-'));
  fs.mkdirSync(path.join(root, 'standards'));
  fs.writeFileSync(path.join(root, 'vision.md'), '# Vision\n');
  fs.writeFileSync(path.join(root, 'standards/essentiel.md'), '# Essentiel\n');
  fs.writeFileSync(path.join(root, 'standards/design.md'), '# Design\n');
  return root;
}

const copy = (root, skill, name) => path.join(root, 'plugin/skills', skill, 'references', name);

test('sync writes every mapped copy with a generated header', () => {
  const root = repo();
  const { changed } = syncStandards(root, map, { check: false });
  assert.equal(changed.length, 3);
  const text = fs.readFileSync(copy(root, 'lun-design', 'design.md'), 'utf8');
  assert.match(text, /^<!-- Copie générée depuis standards\/design\.md : ne pas modifier ici -->\n/);
  assert.match(text, /# Design/);
});

test('check is empty right after a sync', () => {
  const root = repo();
  syncStandards(root, map, { check: false });
  assert.deepEqual(syncStandards(root, map, { check: true }).changed, []);
});

test('check reports a modified source and writes nothing', () => {
  const root = repo();
  syncStandards(root, map, { check: false });
  fs.writeFileSync(path.join(root, 'standards/design.md'), '# Design v2\n');
  const { changed } = syncStandards(root, map, { check: true });
  assert.deepEqual(changed, ['plugin/skills/lun-design/references/design.md']);
  assert.doesNotMatch(fs.readFileSync(copy(root, 'lun-design', 'design.md'), 'utf8'), /v2/);
});

test('check reports a copy edited by hand', () => {
  const root = repo();
  syncStandards(root, map, { check: false });
  fs.appendFileSync(copy(root, 'lun-ecosysteme', 'vision.md'), 'edited here\n');
  assert.deepEqual(syncStandards(root, map, { check: true }).changed, ['plugin/skills/lun-ecosysteme/references/vision.md']);
});

test('check reports a missing copy', () => {
  const root = repo();
  assert.equal(syncStandards(root, map, { check: true }).changed.length, 3);
});
