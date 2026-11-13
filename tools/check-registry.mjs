// Checks for registry.yaml and adr/. Minimal parser on purpose: registry.yaml is a flat
// `projets:` list of objects with scalar values, nothing more (no dependency needed); anything else is an error.
import fs from 'node:fs';
import path from 'node:path';

const REQUIRED = ['id', 'nom', 'role', 'depot', 'visibilite', 'etat'];
const ENUMS = {
  role: ['core', 'satellite', 'vitrine', 'referentiel'],
  visibilite: ['public', 'prive'],
  etat: ['actif', 'en-dev', 'en-pause', 'archive'],
};

/** The `projets:` list, and an error at its line for anything the flat format does not allow. */
export function parseProjects(yamlText) {
  const projects = [];
  const errors = [];
  let current = null;
  let inList = false;
  let itemIndent = null;
  yamlText.split(/\r?\n/).forEach((raw, i) => {
    const at = `registry.yaml:${i + 1}:`;
    const line = raw.replace(/\s+#.*$/, '');
    if (!line.trim() || line.trim().startsWith('#')) return;
    if (/^\S/.test(line)) {
      inList = /^projets:/.test(line);
      return;
    }
    if (!inList) return;
    const item = line.match(/^(\s*)-\s+(\w+):\s*(.*)$/);
    const field = line.match(/^\s{2,}(\w+):\s*(.*)$/);
    const [key, value] = item ? [item[2], item[3]] : field ? [field[1], field[2]] : [];
    if (item) {
      itemIndent ??= item[1].length;
      if (item[1].length > itemIndent) {
        errors.push(`${at} nested list, the registry only takes scalar values`);
        return;
      }
      current = { [key]: unquote(value) };
      projects.push(current);
    } else if (field && current) {
      current[key] = unquote(value);
    } else {
      errors.push(`${at} unreadable line`);
      return;
    }
    if (!unquote(value)) errors.push(`${at} ${key} has no value`);
  });
  return { projects, errors };
}

const unquote = (v) => v.trim().replace(/^(['"])(.*)\1$/, '$2');

/** One error per value of `keyOf` shared by several projects. */
function duplicates(projects, keyOf, message) {
  return [...Map.groupBy(projects.filter(keyOf), keyOf)]
    .filter(([, group]) => group.length > 1)
    .map(([key, group]) => `registry: ${message(key, group.map((p) => p.id ?? '(no id)').join(', '))}`);
}

export function checkRegistry(yamlText) {
  const { projects, errors } = parseProjects(yamlText);
  errors.push(...duplicates(projects, (p) => p.id, (id) => `duplicate id ${id}`));
  // GitHub names are case-insensitive.
  errors.push(...duplicates(projects, (p) => p.depot?.toLowerCase(), (depot, ids) => `${ids}: same depot ${depot}`));
  for (const p of projects) {
    const name = p.id ?? '(no id)';
    for (const key of REQUIRED) if (!p[key]) errors.push(`registry: ${name}: missing ${key}`);
    if (p.id && !/^[a-z0-9]+$/.test(p.id))
      errors.push(`registry: ${name}: id must be lowercase letters and digits only`);
    for (const [key, allowed] of Object.entries(ENUMS)) {
      if (p[key] && !allowed.includes(p[key])) errors.push(`registry: ${name}: ${key} must be one of ${allowed.join(', ')}`);
    }
  }
  if (projects.filter((p) => p.role === 'core').length > 1) errors.push('registry: more than one core');
  return errors;
}

const STATUS = /^Statut\s*:\s*(acceptée|remplacée par \d{4})\s*$/m;

export function checkAdrs(root) {
  const dir = path.join(root, 'adr');
  if (!fs.existsSync(dir)) return [];
  const errors = [];
  for (const name of fs.readdirSync(dir).filter((n) => /^\d{4}-.*\.md$/.test(n))) {
    const text = fs.readFileSync(path.join(dir, name), 'utf8').replace(/\r\n/g, '\n');
    const lines = text.endsWith('\n') ? text.split('\n').length - 1 : text.split('\n').length;
    if (lines > 60) errors.push(`adr/${name}: ${lines} lines (max 60)`);
    if (!STATUS.test(text)) errors.push(`adr/${name}: missing or invalid "Statut :" line`);
  }
  return errors;
}
