import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkRegistry, checkAdrs } from './check-registry.mjs';

const project = (fields) =>
  '  - ' + Object.entries(fields).map(([k, v]) => `${k}: ${v}`).join('\n    ') + '\n';

const valid = { id: 'core', nom: "Lun'Core", role: 'core', depot: 'Lun-Ecosystem/core', visibilite: 'prive', etat: 'actif' };

test('checkRegistry accepts an empty registry', () => {
  assert.deepEqual(checkRegistry('version: 1\nprojets: []\n'), []);
});

test('checkRegistry accepts a valid project', () => {
  assert.deepEqual(checkRegistry('version: 1\nprojets:\n' + project(valid)), []);
});

test('checkRegistry reports a missing role', () => {
  const { role, ...noRole } = valid;
  const errors = checkRegistry('projets:\n' + project(noRole));
  assert.ok(errors.some((e) => e.includes('core: missing role')), errors.join('\n'));
});

test('checkRegistry reports an invalid enum value', () => {
  const errors = checkRegistry('projets:\n' + project({ ...valid, visibilite: 'secret' }));
  assert.ok(errors.some((e) => e.includes('visibilite')), errors.join('\n'));
});

test('checkRegistry reports two cores', () => {
  const text = 'projets:\n' + project(valid) + project({ ...valid, id: 'core2' });
  assert.ok(checkRegistry(text).some((e) => e.includes('more than one core')));
});

test('checkRegistry ignores comments', () => {
  assert.deepEqual(checkRegistry('# header\nprojets:\n  # a comment\n' + project(valid)), []);
});

function adrRoot(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lun-adr-'));
  fs.mkdirSync(path.join(root, 'adr'));
  for (const [name, content] of Object.entries(files)) fs.writeFileSync(path.join(root, 'adr', name), content);
  return root;
}

test('checkAdrs accepts a short ADR with a valid status', () => {
  const root = adrRoot({ '0001-x.md': '# ADR 0001\n\nStatut : acceptée\n', 'README.md': 'x\n'.repeat(200) });
  assert.deepEqual(checkAdrs(root), []);
});

test('checkAdrs accepts a superseded ADR', () => {
  const root = adrRoot({ '0001-x.md': '# ADR\nStatut : remplacée par 0002\n' });
  assert.deepEqual(checkAdrs(root), []);
});

test('checkAdrs reports an ADR over 60 lines', () => {
  const root = adrRoot({ '0001-x.md': 'Statut : acceptée\n' + 'x\n'.repeat(60) });
  assert.ok(checkAdrs(root).some((e) => e.includes('61 lines')));
});

test('checkAdrs reports a missing or invalid status', () => {
  const root = adrRoot({ '0001-x.md': '# ADR\n', '0002-y.md': 'Statut : brouillon\n' });
  const errors = checkAdrs(root);
  assert.equal(errors.length, 2, errors.join('\n'));
});
