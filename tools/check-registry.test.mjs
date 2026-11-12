import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkRegistry, checkAdrs, parseProjects } from './check-registry.mjs';

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

test('checkRegistry reports an id with a hyphen or a capital', () => {
  for (const id of ['lun-docs', 'LunDocs']) {
    const errors = checkRegistry('projets:\n' + project({ ...valid, id }));
    assert.ok(errors.some((e) => e.includes(`${id}: id must be`)), errors.join('\n'));
  }
});

test('checkRegistry reports two cores', () => {
  const text = 'projets:\n' + project(valid) + project({ ...valid, id: 'core2' });
  assert.ok(checkRegistry(text).some((e) => e.includes('more than one core')));
});

test('checkRegistry accepts the new roles', () => {
  const text =
    'projets:\n' +
    project({ ...valid, id: 'website', role: 'vitrine', depot: 'Owner/website' }) +
    project({ ...valid, id: 'lundocs', role: 'referentiel', visibilite: 'public', depot: 'Lun-Ecosystem/lun-docs' });
  assert.deepEqual(checkRegistry(text), []);
});

test('checkRegistry rejects an unknown etat', () => {
  const errors = checkRegistry('projets:\n' + project({ ...valid, etat: 'brouillon' }));
  assert.ok(errors.some((e) => e.includes('etat')), errors.join('\n'));
});

test('checkRegistry rejects an unknown role', () => {
  const errors = checkRegistry('projets:\n' + project({ ...valid, role: 'app' }));
  assert.ok(errors.some((e) => e.includes('role')), errors.join('\n'));
});

test('checkRegistry ignores comments', () => {
  assert.deepEqual(checkRegistry('# header\nprojets:\n  # a comment\n' + project(valid)), []);
});

test('checkRegistry reports two projects with the same id', () => {
  const text = 'projets:\n' + project(valid) + project({ ...valid, role: 'satellite', depot: 'Lun-Ecosystem/other' });
  const errors = checkRegistry(text);
  assert.ok(errors.some((e) => e.includes('duplicate id core')), errors.join('\n'));
});

test('checkRegistry reports two projects with the same depot, whatever the case', () => {
  const text =
    'projets:\n' + project(valid) + project({ ...valid, id: 'other', role: 'satellite', depot: 'lun-ecosystem/CORE' });
  const errors = checkRegistry(text);
  assert.ok(errors.some((e) => e.includes('core, other: same depot')), errors.join('\n'));
});

test('checkRegistry reports a nested list at its line, not a phantom project', () => {
  const text = 'projets:\n' + project(valid) + '    contrats:\n      - id: z\n';
  const errors = checkRegistry(text);
  assert.ok(errors.some((e) => e.startsWith('registry.yaml:9: nested list')), errors.join('\n'));
  assert.ok(!errors.some((e) => e.includes('missing')), errors.join('\n'));
});

test('checkRegistry reports a field without a value at its line', () => {
  const errors = checkRegistry('projets:\n' + project({ ...valid, nom: '' }));
  assert.ok(errors.some((e) => e.startsWith('registry.yaml:3: nom has no value')), errors.join('\n'));
});

test('checkRegistry reports a line it cannot read under projets', () => {
  const errors = checkRegistry('projets:\n' + project(valid) + '    just text\n');
  assert.ok(errors.some((e) => e.startsWith('registry.yaml:8: unreadable line')), errors.join('\n'));
});

test('checkRegistry accepts the registry of lun-docs', () => {
  const text = fs.readFileSync(new URL('../registry.yaml', import.meta.url), 'utf8');
  assert.deepEqual(checkRegistry(text), []);
  assert.ok(parseProjects(text).projects.some((p) => p.id === 'lunanima' && p.visibilite === 'prive'));
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
