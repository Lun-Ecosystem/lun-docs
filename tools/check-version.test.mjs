import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkVersions } from './check-version.mjs';

function repo(pluginVersion, marketplaceVersion) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lun-version-'));
  fs.mkdirSync(path.join(root, '.claude-plugin'));
  fs.mkdirSync(path.join(root, 'plugin', '.claude-plugin'), { recursive: true });
  fs.writeFileSync(path.join(root, 'plugin/.claude-plugin/plugin.json'), JSON.stringify({ name: 'lun', version: pluginVersion }));
  fs.writeFileSync(
    path.join(root, '.claude-plugin/marketplace.json'),
    JSON.stringify({ name: 'lun-docs', plugins: [{ name: 'lun', source: './plugin', version: marketplaceVersion }] }),
  );
  return root;
}

test('checkVersions accepts matching versions', () => {
  assert.deepEqual(checkVersions(repo('0.2.0', '0.2.0')), []);
});

test('checkVersions reports a mismatch between plugin.json and the marketplace', () => {
  const errors = checkVersions(repo('0.2.0', '0.1.0'));
  assert.equal(errors.length, 1);
  assert.match(errors[0], /0\.2\.0.*0\.1\.0/);
});

test('checkVersions checks the tag when one is given', () => {
  assert.deepEqual(checkVersions(repo('0.2.0', '0.2.0'), 'lun--v0.2.0'), []);
  assert.equal(checkVersions(repo('0.2.0', '0.2.0'), 'lun--v0.3.0').length, 1);
});

test('checkVersions rejects a version that is not semver', () => {
  assert.equal(checkVersions(repo('2.0', '2.0')).length, 1);
});
