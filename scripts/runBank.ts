/* Runs every problem's buggy and correct code. Usage:  npm run run-bank  [p001 p014 ...]
 * Correct code must print `harness.expected`. Buggy code must compile, then print something else,
 * crash or time out. Languages whose toolchain is missing are skipped and reported. */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { problems } from '../src/data/problemRegistry';
import type { Language, Problem } from '../src/types/problem';

const only = process.argv.slice(2);
const TIMEOUT_MS = 6000;

interface Out { ok: boolean; stdout: string; stderr: string; timedOut: boolean }

function sh(cmd: string, args: string[], cwd: string, timeout = TIMEOUT_MS): Out {
    const r = spawnSync(cmd, args, { cwd, encoding: 'utf8', timeout, maxBuffer: 1 << 20, env: { ...process.env, ASAN_OPTIONS: 'detect_leaks=0' } });
  const timedOut = (r.error as NodeJS.ErrnoException | undefined)?.code === 'ETIMEDOUT';
  return { ok: r.status === 0 && !r.error, stdout: (r.stdout ?? '').trim(), stderr: (r.stderr ?? '').trim(), timedOut };
}

const has = (cmd: string, arg = '--version') => !spawnSync(cmd, [arg], { encoding: 'utf8' }).error;
const tools: Record<Language, boolean> = { python: has('python3'), java: has('javac', '-version') && has('java', '-version'), c: has('gcc') };

type Step = { compile?: Out; run?: Out };

function execute(lang: Language, code: string, driver: string,strict = false): Step {
  const dir = mkdtempSync(join(tmpdir(), 'bank-'));
  try {
    if (lang === 'python') {
      writeFileSync(join(dir, 't.py'), `${code}\n\n${driver}\n`);
      return { run: sh('python3', ['t.py'], dir) };
    }
    if (lang === 'java') {
      writeFileSync(join(dir, 'Solution.java'), code);
      writeFileSync(join(dir, 'Main.java'), `import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n${driver}\n  }\n}\n`);
          const compile = sh('gcc', ['-w', ...(strict ? ['-fsanitize=address,undefined'] : []), '-o', 't', 't.c'], dir, 30000);
      return compile.ok ? { compile, run: sh('java', ['-XX:TieredStopAtLevel=1', '-Xshare:auto', '-cp', '.', 'Main'], dir) } : { compile };
    }
    writeFileSync(join(dir, 't.c'), `#include <stdio.h>\n#include <stdlib.h>\n${code}\nint main(void) {\n${driver}\nreturn 0;\n}\n`);
    const compile = sh('gcc', ['-w', '-o', 't', 't.c'], dir, 30000);
    return compile.ok ? { compile, run: sh('./t', [], dir) } : { compile };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const failures: string[] = [];
const skipped = new Set<string>();
let checked = 0;

function check(p: Problem, lang: Language) {
  const driver = p.harness!.driver[lang];
  if (!driver) return failures.push(`[${p.id}] ${lang}: harness has no driver`);
  const expected = p.harness!.expected;

    const good = execute(lang, p.correctCode[lang]!, driver, true);
  if (!good.run || !good.run.ok) {
    return failures.push(`[${p.id}] ${lang}: correct code failed to run: ${(good.compile?.stderr || good.run?.stderr || 'unknown').slice(0, 300)}`);
  }
  if (good.run.stdout !== expected) {
    return failures.push(`[${p.id}] ${lang}: correct code printed "${good.run.stdout}", expected "${expected}"`);
  }

  const bad = execute(lang, p.buggyCode[lang]!, driver);
  if (!bad.run) {
    return failures.push(`[${p.id}] ${lang}: buggy code does not compile (bugs must compile): ${bad.compile?.stderr.slice(0, 300)}`);
  }
  if (bad.run.ok && !bad.run.timedOut && bad.run.stdout === expected) {
    return failures.push(`[${p.id}] ${lang}: buggy code produced the expected output, so the bug is not observable`);
  }
  checked++;
  const how = bad.run.timedOut ? 'times out' : !bad.run.ok ? 'crashes' : `prints "${bad.run.stdout}"`;
  console.log(`ok   ${p.id} ${lang.padEnd(6)} correct -> "${expected}"   buggy ${how}`);
}

for (const p of problems) {
  if (only.length && !only.includes(p.id)) continue;
  if (!p.harness) {
    failures.push(`[${p.id}] has no harness`);
    continue;
  }
  for (const lang of p.languages) {
    if (!tools[lang]) {
      skipped.add(lang);
      continue;
    }
    check(p, lang);
  }
}

console.log(`\nChecked ${checked} implementation(s).`);
if (skipped.size) console.warn(`Skipped (toolchain not found): ${[...skipped].join(', ')}`);
if (failures.length) {
  console.error(`\n${failures.length} failure(s):\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log('All run checks passed.');
