/* Question-bank validator. Run:  npm run validate  (or: npx tsx scripts/validateBank.ts) */
import { problems } from '../src/data/problemRegistry';
import { DIFFICULTIES, LANGUAGES, TOPICS } from '../src/types/problem';
import { normalizeLine } from '../src/utils/normalize';

const errors: string[] = [];
const warnings: string[] = [];
const err = (id: string, msg: string) => errors.push(`[${id}] ${msg}`);
const warn = (msg: string) => warnings.push(msg);

const ids = new Set<string>();
const titles = new Set<string>();
const codeSignatures = new Map<string, string>();
const LEAK = /binary search|sliding window|dynamic programming|\bdp\b|\bbfs\b|\bdfs\b|two pointers?|backtrack\w*|memoi[sz]\w*|union[- ]find|kadane|greedy/i;
const SOFT_LEAK = /\bheap\b|\btrie\b|\bstack\b|\bqueue\b/i;

for (const p of problems) {
  const id = p.id || '(missing id)';

  if (!/^p\d{3,}$/.test(p.id)) err(id, 'id must look like p001 (no topic text, it would leak the topic)');
  if (ids.has(p.id)) err(id, 'duplicate id');
  ids.add(p.id);

  if (titles.has(p.title.toLowerCase())) err(id, `duplicate title "${p.title}"`);
  titles.add(p.title.toLowerCase());

  if (!DIFFICULTIES.includes(p.difficulty)) err(id, `bad difficulty ${p.difficulty}`);
  if (!TOPICS.includes(p.topic)) err(id, `unknown topic "${p.topic}"`);

  for (const field of ['title', 'subtopic', 'bugCategory', 'sourceInspiredBy', 'description'] as const) {
    if (!p[field] || !p[field].trim()) err(id, `empty ${field}`);
  }
  if (p.examples.length === 0) err(id, 'needs at least one example');
  if (p.hints.length === 0) err(id, 'needs at least one hint');
    if (p.hints.length !== 2 && Number(p.id.slice(1)) > 20) warn(`[${id}] has ${p.hints.length} hint(s); the prompt asks for exactly 2`);
  const visible = [p.description, ...p.hints].join(' ');
  const leak = visible.match(LEAK);
    if (leak) err(id, `description/hints reveal the technique ("${leak[0]}")`);
  const soft = visible.match(SOFT_LEAK);
  if (soft) warn(`[${id}] description/hints mention "${soft[0]}" (fine if it is part of the task, a giveaway if it is in a hint)`);
  if (p.testCases.length === 0) err(id, 'needs at least one test case');
  if (!p.complexity.time || !p.complexity.space) err(id, 'missing complexity');

  for (const [key, value] of Object.entries(p.explanation)) {
    if (!value || !value.trim()) err(id, `empty explanation.${key}`);
  }

  if (p.languages.length === 0) err(id, 'no languages');

  if (!p.harness) {
    err(id, 'missing harness (needed by npm run run-bank)');
  } else {
    if (!p.harness.expected.trim()) err(id, 'harness.expected is empty');
    for (const l of p.languages) {
      if (!p.harness.driver[l]) err(id, `harness has no ${l} driver`);
    }
  }

  for (const lang of LANGUAGES) {
    const promised = p.languages.includes(lang);
    const has = [p.buggyCode[lang], p.correctCode[lang], p.buggyLines[lang], p.acceptedFixes[lang]];
    if (!promised) {
      if (has.some((x) => x !== undefined)) err(id, `${lang} data present but not listed in languages`);
      continue;
    }
    if (has.some((x) => x === undefined)) {
      err(id, `${lang} is promised but data is missing`);
      continue;
    }

    const buggy = p.buggyCode[lang]!.split('\n');
    const correct = p.correctCode[lang]!.split('\n');
    const bugLines = p.buggyLines[lang]!;
    const fixes = p.acceptedFixes[lang]!;
        if (/\\(?!0)/.test(p.correctCode[lang]!)) warn(`[${id}] ${lang}: code contains a backslash other than \\0 (the prompt forbids this)`);

    if (p.buggyCode[lang] === p.correctCode[lang]) err(id, `${lang}: buggy code equals correct code`);
    if (buggy.length !== correct.length) {
      err(id, `${lang}: buggy (${buggy.length}) and correct (${correct.length}) line counts differ`);
      continue;
    }
    if (bugLines.length === 0) err(id, `${lang}: no buggy lines`);

    const diffLines = buggy
      .map((line, i) => (line !== correct[i] ? i + 1 : -1))
      .filter((n) => n > 0);
    const sortedBug = [...bugLines].sort((a, b) => a - b);
    if (JSON.stringify(diffLines) !== JSON.stringify(sortedBug)) {
      err(id, `${lang}: buggyLines ${JSON.stringify(sortedBug)} do not match changed lines ${JSON.stringify(diffLines)}`);
    }

    for (const n of bugLines) {
      if (n < 1 || n > buggy.length) {
        err(id, `${lang}: line ${n} out of range`);
        continue;
      }
      const list = fixes[String(n)];
      if (!list || list.length === 0) {
        err(id, `${lang}: line ${n} has no accepted fixes`);
        continue;
      }
      if (!list.some((f) => normalizeLine(f) === normalizeLine(correct[n - 1]))) {
        err(id, `${lang}: line ${n} accepted fixes do not include the correct line`);
      }
      if (normalizeLine(buggy[n - 1]) === normalizeLine(correct[n - 1])) {
        err(id, `${lang}: line ${n} buggy and correct differ only by formatting`);
      }
      if (list.some((f) => normalizeLine(f) === normalizeLine(buggy[n - 1]))) {
        err(id, `${lang}: line ${n} accepts the buggy line as a fix`);
      }
    }
    for (const key of Object.keys(fixes)) {
      if (!bugLines.includes(Number(key))) err(id, `${lang}: accepted fixes given for non-buggy line ${key}`);
    }

    const sig = p.buggyCode[lang]!.replace(/\s+/g, '');
    const prior = codeSignatures.get(`${lang}:${sig}`);
    if (prior) err(id, `${lang}: buggy code duplicates ${prior}`);
    else codeSignatures.set(`${lang}:${sig}`, id);
  }
}

// Summary
const byDifficulty: Record<string, number> = {};
const byTopic: Record<string, number> = {};
let impl = 0;
for (const p of problems) {
  byDifficulty[p.difficulty] = (byDifficulty[p.difficulty] ?? 0) + 1;
  byTopic[p.topic] = (byTopic[p.topic] ?? 0) + 1;
  impl += p.languages.length;
}

const total = problems.length;
if (total >= 10) {
  const share = (d: string) => ((byDifficulty[d] ?? 0) / total) * 100;
  if (Math.abs(share('Easy') - 20) > 8) warn(`Easy is ${share('Easy').toFixed(0)}% (target 20%)`);
  if (Math.abs(share('Medium') - 60) > 8) warn(`Medium is ${share('Medium').toFixed(0)}% (target 60%)`);
  if (Math.abs(share('Hard') - 20) > 8) warn(`Hard is ${share('Hard').toFixed(0)}% (target 20%)`);
}

console.log(`Problems: ${total}   Code implementations: ${impl}`);
console.log('By difficulty:', byDifficulty);
console.log('By topic:', byTopic);
if (warnings.length) console.log(`\nWarnings:\n  ${warnings.join('\n  ')}`);
if (errors.length) {
  console.error(`\n${errors.length} error(s):\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log('\nValidation passed.');
