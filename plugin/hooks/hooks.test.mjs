import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const pluginRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(fs.readFileSync(path.join(pluginRoot, 'hooks', 'hooks.json'), 'utf8'));

test('hooks.json guards both Bash and PowerShell tools', () => {
  const entry = config.hooks.PreToolUse.find((e) => e.hooks.some((h) => h.command.includes('guard.mjs')));
  assert.ok(entry, 'no PreToolUse entry runs guard.mjs');
  const tools = entry.matcher.split('|');
  assert.ok(tools.includes('Bash') && tools.includes('PowerShell'), `matcher is ${entry.matcher}`);
});

test('the hook command resolves to guard.mjs and blocks a push to main', () => {
  const entry = config.hooks.PreToolUse.find((e) => e.hooks.some((h) => h.command.includes('guard.mjs')));
  const command = entry.hooks[0].command.replace('${CLAUDE_PLUGIN_ROOT}', pluginRoot);
  const script = command.match(/"([^"]+guard\.mjs)"/)[1];
  assert.ok(fs.existsSync(script), script);
  let status = 0;
  try {
    execFileSync('node', [script], { input: JSON.stringify({ tool_input: { command: 'git push origin main' } }) , stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (e) {
    status = e.status;
  }
  assert.equal(status, 2);
});
