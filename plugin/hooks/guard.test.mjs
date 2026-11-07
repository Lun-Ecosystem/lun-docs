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
  'gh pr create --fill --draft',
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

// Final review fixes: subshells, wrappers, PowerShell forms, --mirror/--all, implicit push on main.
const blockedMore = [
  '(cd ../core && git push -f)',
  '(cd ../core && git push origin main)',
  'git push origin main>out',
  'bash -c "git push origin main"',
  "sh -c 'gh pr merge 3'",
  'pwsh -Command "git push origin main"',
  'env GIT_TRACE=1 git push origin main',
  'command git push origin main',
  'time git push -f',
  '/usr/bin/git push origin main',
  'git.exe push origin main',
  '& "C:\\Program Files\\Git\\bin\\git.exe" push origin main',
  'npm test; git push origin main',
  'git push --mirror',
  'git push --all origin',
  '{ git push origin main; }',
  // Releases are tagged by CrOliX only.
  'git push origin --tags',
  'git push --follow-tags',
  'git push origin refs/tags/lun--v0.2.0',
  'claude plugin tag plugin --push',
  'gh release create lun--v0.2.0',
];
for (const command of blockedMore) {
  test(`blocks (review): ${command}`, () => {
    assert.equal(evaluateCommand(command).block, true);
  });
}

// gh options before the subcommand, master as main, PRs to the norm (lun-docs#2, #23, #33).
const blockedNorms = [
  'gh -R o/r pr merge 3',
  'gh pr -R o/r merge 3',
  'gh --repo o/r pr merge 3',
  'gh --repo=o/r pr merge 3',
  'gh pr --repo=o/r merge 3',
  'git push origin master',
  'git push origin HEAD:master',
  'git push origin refs/heads/master',
  'git push origin HEAD:refs/heads/master',
  'gh pr create --fill',
  'gh pr create --title "fix: x" --body-file b.md',
  'gh pr create --draft --title "Recadrage du front" --body-file b.md',
  'gh pr create --draft --title="Recadrage du front"',
  'gh pr create -d -t "fix(Voix): x"',
  'gh pr create -d -t"fix x"',
  'gh pr edit 3 --title "fix:x"',
  'gh -R o/r pr edit 3 -t "Nouveau titre"',
];
for (const command of blockedNorms) {
  test(`blocks (norms): ${command}`, () => {
    const result = evaluateCommand(command);
    assert.equal(result.block, true);
    assert.ok(result.reason && result.reason.length > 0);
  });
}

const allowedNorms = [
  'gh pr create --draft --title "fix: x" --body-file b.md',
  'gh pr create -d --title="feat(guard)!: y"',
  'gh -R o/r pr create --draft -t "docs(plans): z"',
  'gh pr edit 3 --title "chore(release): lun 0.3.0"',
  'gh pr edit 3 --body-file b.md',
  'gh pr edit 3 --add-label niveau:standard',
  'gh pr ready 3',
  'gh pr view 3 -R o/r',
  'git push origin feat/master-plan',
  'git switch main',
  'git branch -D feat/x',
  'git commit -m "fix: say why gh pr create needs --draft"',
];
for (const command of allowedNorms) {
  test(`allows (norms): ${command}`, () => {
    assert.equal(evaluateCommand(command).block, false);
  });
}

test('reads the draft flag across a PowerShell here-string with an apostrophe', () => {
  const ps = "gh pr create --title \"fix: x\" --body @'\nL'onglet (fermé) ne coupe plus rien.\n'@ --draft";
  assert.equal(evaluateCommand(ps).block, false);
  assert.equal(evaluateCommand(ps.replace(' --draft', '')).block, true);
});

test('gives the CI expression when a title is refused', () => {
  assert.match(evaluateCommand('gh pr edit 3 --title "Titre libre"').reason, /feat\|fix\|docs/);
});

test('protects master like main', () => {
  assert.equal(evaluateCommand('git push', { cwd: '/repo', branchOf: () => 'master' }).block, true);
});

const onMain = { cwd: '/repo', branchOf: () => 'main' };
const onFeature = { cwd: '/repo', branchOf: () => 'feat/x' };
const unknown = { cwd: '/repo', branchOf: () => null };

test('blocks a bare push while on main', () => {
  assert.equal(evaluateCommand('git push', onMain).block, true);
  assert.equal(evaluateCommand('git push origin', onMain).block, true);
  assert.equal(evaluateCommand('git push origin HEAD', onMain).block, true);
  assert.equal(evaluateCommand('git push -u origin @', onMain).block, true);
});

test('allows a bare push on a feature branch or an unknown branch', () => {
  assert.equal(evaluateCommand('git push', onFeature).block, false);
  assert.equal(evaluateCommand('git push origin HEAD', onFeature).block, false);
  assert.equal(evaluateCommand('git push', unknown).block, false);
});

test('resolves the branch in the directory the push runs in', () => {
  const seen = [];
  const ctx = { cwd: '/ws/lun-docs', branchOf: (dir) => { seen.push(dir.split('\\').join('/')); return 'feat/x'; } };
  evaluateCommand('cd ../core && git push', ctx);
  evaluateCommand('git -C ../other push', ctx);
  assert.ok(seen.some((d) => d.endsWith('/ws/core')), seen.join(','));
  assert.ok(seen.some((d) => d.endsWith('/ws/other')), seen.join(','));
});
