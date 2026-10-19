// PreToolUse hook (Bash): blocks what only CrOliX may do - merging a PR, pushing to main,
// force-pushing. Exit code 2 blocks the tool call and shows the reason to the agent.
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SEPARATORS = new Set(['&&', '||', ';', '|', '&', '\n']);

/** Splits a shell command into segments of tokens, honouring quotes. */
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
      else if (ch === '\\' && quote === '"' && i + 1 < command.length) token += command[++i];
      else token += ch;
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; hasToken = true; continue; }
    const two = command.slice(i, i + 2);
    if (two === '&&' || two === '||') { flush(); result.push([]); i++; continue; }
    if (SEPARATORS.has(ch)) { flush(); result.push([]); continue; }
    if (/\s/.test(ch)) { flush(); continue; }
    token += ch;
    hasToken = true;
  }
  flush();
  return result.filter((s) => s.length > 0);
}

const GIT_OPTIONS_WITH_VALUE = new Set(['-C', '-c', '--git-dir', '--work-tree', '--namespace']);
const PUSH_OPTIONS_WITH_VALUE = new Set(['-o', '--push-option', '--repo', '--receive-pack', '--exec']);

function evaluatePush(args) {
  const positional = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--force' || arg.startsWith('--force-with-lease') || arg === '--force-if-includes') {
      return 'force push is reserved to CrOliX';
    }
    if (/^-[a-zA-Z]+$/.test(arg) && arg.includes('f')) return 'force push is reserved to CrOliX';
    if (PUSH_OPTIONS_WITH_VALUE.has(arg)) { i++; continue; }
    if (arg.startsWith('-')) continue;
    positional.push(arg);
  }
  for (const refspec of positional.slice(1)) {
    if (refspec.startsWith('+')) return 'force push (+refspec) is reserved to CrOliX';
    const destination = refspec.includes(':') ? refspec.split(':').pop() : refspec;
    if (destination === 'main' || destination === 'refs/heads/main') {
      return 'pushing to main is reserved to CrOliX: push a branch and open a PR';
    }
  }
  return null;
}

function evaluateSegment(tokens) {
  let i = 0;
  while (i < tokens.length && /^\w+=/.test(tokens[i])) i++; // leading env assignments
  const [cmd, ...rest] = tokens.slice(i);
  if (cmd === 'gh' && rest[0] === 'pr' && rest[1] === 'merge') {
    return 'merging a PR is reserved to CrOliX';
  }
  if (cmd !== 'git') return null;
  let j = 0;
  while (j < rest.length && rest[j].startsWith('-')) {
    j += GIT_OPTIONS_WITH_VALUE.has(rest[j]) ? 2 : 1;
  }
  if (rest[j] !== 'push') return null;
  return evaluatePush(rest.slice(j + 1));
}

export function evaluateCommand(command) {
  for (const tokens of segments(command)) {
    const reason = evaluateSegment(tokens);
    if (reason) return { block: true, reason };
  }
  return { block: false };
}

async function main() {
  let input = '';
  for await (const chunk of process.stdin) input += chunk;
  let command = '';
  try {
    command = JSON.parse(input)?.tool_input?.command ?? '';
  } catch {
    process.exit(0); // not our input: never block on a parse error
  }
  const { block, reason } = evaluateCommand(command);
  if (block) {
    process.stderr.write(`lun guard: ${reason}.\n`);
    process.exit(2);
  }
  process.exit(0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
