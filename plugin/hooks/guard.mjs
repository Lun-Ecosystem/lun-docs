// PreToolUse hook (Bash and PowerShell): blocks what only CrOliX may do - merging a PR, pushing to
// main or master, force-pushing - and a PR opened out of the norm: not a draft, or a title the CI
// refuses. Exit code 2 blocks the tool call and shows the reason to the agent.
// Fails open on anything it cannot parse: the GitHub ruleset and the pre-push hook stay behind it.
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const SEPARATORS = new Set([';', '|', '&', '\n', '\r', '(', ')', '{', '}', '<', '>']);

/** Splits a shell command (sh or PowerShell) into segments of tokens, honouring quotes. */
function segments(command) {
  const result = [[]];
  let token = '';
  let quote = null;
  let hasToken = false;
  const flush = () => {
    if (hasToken) result[result.length - 1].push(token);
    token = '';
    hasToken = false;
  };
  for (let i = 0; i < command.length; i++) {
    const ch = command[i];
    if (quote) {
      if (ch === quote) quote = null;
      else if (ch === '\\' && quote === '"' && /["\\$`]/.test(command[i + 1] ?? '')) token += command[++i];
      else token += ch;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; hasToken = true; continue; }
    if (SEPARATORS.has(ch)) { flush(); result.push([]); continue; }
    if (/\s/.test(ch)) { flush(); continue; }
    token += ch;
    hasToken = true;
  }
  flush();
  return result.filter((s) => s.length > 0);
}

const WRAPPERS = new Set(['env', 'command', 'time', 'sudo', 'nohup', 'exec', 'xargs', 'builtin']);
const SHELLS = new Set(['bash', 'sh', 'zsh', 'dash', 'pwsh', 'powershell', 'cmd']);
const SHELL_COMMAND_FLAGS = new Set(['-c', '-command', '/c', '/k']);
const GIT_OPTIONS_WITH_VALUE = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace']);
const PUSH_OPTIONS_WITH_VALUE = new Set(['-o', '--push-option', '--repo', '--receive-pack', '--exec']);

const PROTECTED = new Set(['main', 'master', 'refs/heads/main', 'refs/heads/master']);
// The same expression as the "Conventional PR title" step of templates/ts/.github/workflows/ci.yml.
const PR_TITLE = /^(feat|fix|docs|chore|ci|test|refactor)(\([a-z0-9-]+\))?!?: .+/;
const GH_OPTIONS_WITH_VALUE = new Set(['-R', '--repo']);
// The options of gh pr create and edit that take a value: a body starting with -t is not a title.
const PR_OPTIONS_WITH_VALUE = new Set([
  ...GH_OPTIONS_WITH_VALUE, '-b', '--body', '-F', '--body-file', '-B', '--base', '-H', '--head',
  '-l', '--label', '-a', '--assignee', '-r', '--reviewer', '-m', '--milestone', '-p', '--project',
  '-T', '--template', '--add-label', '--remove-label', '--add-assignee', '--remove-assignee',
  '--add-reviewer', '--remove-reviewer', '--add-project', '--remove-project',
]);

const baseName = (cmd) => path.basename(cmd.replace(/\\/g, '/')).toLowerCase().replace(/\.exe$/, '');

function evaluatePush(args, branchHere) {
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--force' || arg.startsWith('--force-with-lease') || arg === '--force-if-includes') {
      return 'force push is reserved to CrOliX';
    }
    if (arg === '--mirror' || arg === '--all') return `git push ${arg} can rewrite main: reserved to CrOliX`;
    if (arg === '--tags' || arg === '--follow-tags') return 'pushing tags (releases) is reserved to CrOliX';
    if (/^-[a-zA-Z]+$/.test(arg) && arg.includes('f')) return 'force push is reserved to CrOliX';
    if (PUSH_OPTIONS_WITH_VALUE.has(arg)) { i++; continue; }
    if (arg.startsWith('-')) continue;
    positional.push(arg);
  }
  const refspecs = positional.slice(1);
  for (const refspec of refspecs) {
    if (refspec.startsWith('+')) return 'force push (+refspec) is reserved to CrOliX';
    if (refspec.includes('refs/tags/')) return 'pushing tags (releases) is reserved to CrOliX';
    const destination = refspec.includes(':') ? refspec.split(':').pop() : refspec;
    if (PROTECTED.has(destination)) {
      return `pushing to ${destination.replace('refs/heads/', '')} is reserved to CrOliX: push a branch and open a PR`;
    }
  }
  const implicit = refspecs.length === 0 || refspecs.every((r) => r === 'HEAD' || r === '@');
  const here = implicit ? branchHere() : null;
  if (here === 'main' || here === 'master') {
    return `you are on ${here}: pushing it is reserved to CrOliX, push a branch and open a PR`;
  }
  return null;
}

/** `gh pr create` and `gh pr edit`: the title the CI will check, and a new PR as a draft (git.md). */
function evaluatePr(action, args, command) {
  let draft = null;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    let title = null;
    if (PR_OPTIONS_WITH_VALUE.has(arg)) { i++; continue; }
    if (arg === '--title' || arg === '-t') title = args[++i] ?? '';
    else if (arg.startsWith('--title=')) title = arg.slice('--title='.length);
    else if (arg === '--draft' || arg === '--draft=true') draft = true;
    else if (arg.startsWith('--draft=')) draft = false;
    else if (/^-[a-zA-Z]+/.test(arg) && !arg.startsWith('--')) {
      // Short flags run together, as gh reads them: -dt "x" is a draft titled x, -tx is titled x.
      const at = arg.indexOf('t');
      if (arg.slice(1, at < 0 ? undefined : at).includes('d')) draft = true;
      if (at > 0) title = at === arg.length - 1 ? (args[++i] ?? '') : arg.slice(at + 1);
    }
    if (title !== null && !PR_TITLE.test(title)) {
      return `PR title "${title}" does not pass the CI: it must match ${PR_TITLE.source}`;
    }
  }
  // Not found among the tokens: a PowerShell here-string with an apostrophe defeats the quote parsing,
  // so look in the whole command. shortcut: a -d inside a quoted body then passes; the CI review stays.
  if (draft === null) draft = /(^|\s)(--draft(=true)?|-d)(?=\s|$)/.test(command);
  if (action === 'create' && !draft) {
    return 'a PR opens as a draft at the first push (git.md): add --draft, then gh pr ready once the criteria are proven';
  }
  return null;
}

/** The words of a gh command, without its options and the value of -R or --repo, wherever they stand. */
function ghWords(args) {
  const words = [];
  for (let i = 0; i < args.length; i++) {
    if (GH_OPTIONS_WITH_VALUE.has(args[i])) i++;
    else if (!args[i].startsWith('-')) words.push(args[i]);
  }
  return words;
}

function evaluateSegment(tokens, state, context) {
  let i = 0;
  while (i < tokens.length && (/^\w+=/.test(tokens[i]) || WRAPPERS.has(baseName(tokens[i])))) i++;
  const [first, ...rest] = tokens.slice(i);
  if (!first) return null;
  const cmd = baseName(first);

  if (cmd === 'cd' && rest[0]) {
    state.cwd = path.resolve(state.cwd, rest[0]);
    return null;
  }
  if (SHELLS.has(cmd)) {
    const flag = rest.findIndex((t) => SHELL_COMMAND_FLAGS.has(t.toLowerCase()));
    if (flag >= 0 && rest[flag + 1]) return evaluateCommand(rest[flag + 1], { ...context, cwd: state.cwd }).reason ?? null;
    return null;
  }
  if (cmd === 'gh') {
    const [group, action] = ghWords(rest);
    if (group === 'pr' && action === 'merge') return 'merging a PR is reserved to CrOliX';
    if (group === 'pr' && (action === 'create' || action === 'edit')) return evaluatePr(action, rest, state.command);
    if (group === 'release' && action === 'create') return 'releases are created by CrOliX';
    return null;
  }
  if (cmd === 'claude' && rest[0] === 'plugin' && rest[1] === 'tag') return 'release tags are created by CrOliX';
  if (cmd !== 'git') return null;

  let dir = state.cwd;
  let j = 0;
  while (j < rest.length && rest[j].startsWith('-')) {
    if (rest[j] === '-C' && rest[j + 1]) dir = path.resolve(dir, rest[j + 1]);
    j += GIT_OPTIONS_WITH_VALUE.has(rest[j]) ? 2 : 1;
  }
  if (rest[j] !== 'push') return null;
  return evaluatePush(rest.slice(j + 1), () => (context.branchOf ? context.branchOf(dir) : null));
}

/**
 * @param {string} command
 * @param {{ cwd?: string, branchOf?: (dir: string) => string | null }} context
 */
export function evaluateCommand(command, context = {}) {
  const state = { cwd: context.cwd ?? process.cwd(), command };
  for (const tokens of segments(command)) {
    const reason = evaluateSegment(tokens, state, context);
    if (reason) return { block: true, reason };
  }
  return { block: false };
}

function currentBranch(dir) {
  try {
    return execFileSync('git', ['-C', dir, 'rev-parse', '--abbrev-ref', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return null;
  }
}

async function main() {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  let payload;
  try {
    payload = JSON.parse(input);
  } catch {
    process.exit(0); // not our input: never block on a parse error
  }
  const command = payload?.tool_input?.command ?? '';
  const { block, reason } = evaluateCommand(command, { cwd: payload?.cwd, branchOf: currentBranch });
  if (block) {
    process.stderr.write(`lun guard: ${reason}.\n`);
    process.exit(2);
  }
  process.exit(0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
