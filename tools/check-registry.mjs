// Checks for registry.yaml and adr/. Minimal parser on purpose: registry.yaml is a flat
// `projets:` list of objects with scalar values, nothing more (no dependency needed).
import fs from 'node:fs';
import path from 'node:path';

const REQUIRED = ['id', 'nom', 'role', 'depot', 'visibilite', 'etat'];
const ENUMS = {
  role: ['core', 'satellite', 'vitrine', 'referentiel'],
  visibilite: ['public', 'prive'],
  etat: ['actif', 'en-dev', 'en-pause', 'archive'],
};

function parseProjects(yamlText) {
  const projects = [];
  let current = null;
  for (const raw of yamlText.split(/\r?\n/)) {
    const line = raw.replace(/\s+#.*$/, '');
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const item = line.match(/^\s*-\s+(\w+):\s*(.*)$/);
    const field = line.match(/^\s{2,}(\w+):\s*(.*)$/);
    if (item) {
      current = { [item[1]]: unquote(item[2]) };
      projects.push(current);
    } else if (field && current) {
      current[field[1]] = unquote(field[2]);
    }
  }
  return projects;
}

const unquote = (v) => v.trim().replace(/^(['"])(.*)\1$/, '$2');

export function checkRegistry(yamlText) {
  const errors = [];
  const projects = parseProjects(yamlText);
  for (const p of projects) {
    const name = p.id ?? '(no id)';
    for (const key of REQUIRED) if (!p[key]) errors.push(`registry: ${name}: missing ${key}`);
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
