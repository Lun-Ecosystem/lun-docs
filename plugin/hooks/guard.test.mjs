import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evaluateCommand } from './guard.mjs';

const blocked = [
  'gh pr merge 12',
  'gh pr merge --auto --squash',
  'git push origin main',
  'git push origin HEAD:main',
  'git push -f',
  'git push --force',
  'git push --force-with-lease origin feat/x',
  'git -C "D:/projets perso/x" push origin main',
  'cd x && git push origin main',
  'git push origin +feat/x',
  'git push origin feat/x:refs/heads/main',
  'git push -u origin main',
  'npm test; git push origin main',
];

const allowed = [
  'git push -u origin feat/bootstrap',
  'git push origin feat/main-menu',
  'git status',
  'gh pr create --fill',
  'gh pr view 12',
  'git log | grep "gh pr merge"',
  'echo "git push origin main"',
  'git commit -m "docs: explain why the agent never runs gh pr merge"',
];

for (const command of blocked) {
  test(`blocks: ${command}`, () => {
    const result = evaluateCommand(command);
    assert.equal(result.block, true);
    assert.ok(result.reason && result.reason.length > 0);
  });
}

for (const command of allowed) {
  test(`allows: ${command}`, () => {
    assert.equal(evaluateCommand(command).block, false);
  });
}
