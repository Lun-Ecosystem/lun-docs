// The plugin version lives in two places (plugin.json and its marketplace entry): they must agree,
// and match the release tag (`lun--v<version>`, as created by `claude plugin tag`) when one is given.
//   node tools/check-version.mjs [tag]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SEMVER = /^\d+\.\d+\.\d+(-[\w.]+)?$/;

export function checkVersions(root, tag) {
  const plugin = JSON.parse(fs.readFileSync(path.join(root, 'plugin/.claude-plugin/plugin.json'), 'utf8'));
  const marketplace = JSON.parse(fs.readFileSync(path.join(root, '.claude-plugin/marketplace.json'), 'utf8'));
  const entry = marketplace.plugins.find((p) => p.name === plugin.name);
  const errors = [];
  if (!SEMVER.test(plugin.version)) errors.push(`plugin.json: version ${plugin.version} is not semver`);
  if (!entry) errors.push(`marketplace.json: no entry for plugin ${plugin.name}`);
  else if (entry.version !== plugin.version) {
    errors.push(`version mismatch: plugin.json ${plugin.version} vs marketplace.json ${entry.version}`);
  }
  if (tag && tag !== `${plugin.name}--v${plugin.version}`) {
    errors.push(`tag ${tag} does not match ${plugin.name}--v${plugin.version}`);
  }
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const errors = checkVersions(root, process.argv[2]);
  for (const e of errors) console.error(e);
  console.log(errors.length ? `${errors.length} error(s)` : 'version: OK');
  process.exit(errors.length ? 1 : 0);
}
