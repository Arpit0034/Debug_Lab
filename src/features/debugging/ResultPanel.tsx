import type { Problem } from '../../types/problem';
import type { Attempt } from '../../types/progress';
import type { BugEvaluation } from '../../services/evaluation/evaluator';
import { scoreAttempt } from '../../services/evaluation/evaluator';
import { Badge } from '../../components/common/PageHeader';
import { AiExplain } from '../../components/common/AiExplain';

const SECTIONS: { key: keyof Problem['explanation']; label: string }[] = [
  { key: 'overview', label: 'What the problem asks' },
  { key: 'algorithm', label: 'The underlying algorithm' },
  { key: 'bug', label: 'The bug' },
  { key: 'whyItFails', label: 'Why the code fails' },
  { key: 'failingTestCase', label: 'A test case that exposes it' },
  { key: 'fix', label: 'The fix' },
  { key: 'whyFixWorks', label: 'Why the fix works' },
  { key: 'dryRun', label: 'Dry run' },
  { key: 'debuggingLesson', label: 'Debugging lesson' },
];

const RESULT_TEXT = {
  correct: { label: 'Correct', tone: 'good' as const },
  partial: { label: 'Partially correct', tone: 'warn' as const },
  incorrect: { label: 'Incorrect', tone: 'bad' as const },
};

/** Everything the AI needs to re-explain this result in different words. */
function buildAiContext(problem: Problem, attempt: Attempt, bug: BugEvaluation): string {
  const lang = attempt.language;
  const numbered = (problem.buggyCode[lang] ?? '')
    .split('\n')
    .map((l, i) => String(i + 1) + ': ' + l)
    .join('\n');
  const realLines = [...bug.hits, ...bug.missed].sort((a, b) => a - b).join(', ');
  const fixes = attempt.fixes.length
    ? attempt.fixes.map((f) => 'line ' + f.line + ': ' + f.submitted.trim()).join('\n')
    : 'none';
  const e = problem.explanation;
  return [
    'Problem: ' + problem.title + ' (' + problem.topic + ', ' + problem.subtopic + ', ' + problem.difficulty + ')',
    'Statement: ' + problem.description,
    'Language: ' + lang,
    'Buggy code with line numbers:\n' + numbered,
    'Real buggy line(s): ' + realLines,
    'Student selected line(s): ' + (attempt.selectedLines.join(', ') || 'none') + ' (result: ' + attempt.bugResult + ')',
    'Student corrected lines:\n' + fixes,
    'Correct code:\n' + (problem.correctCode[lang] ?? ''),
    'The website explanation the student found hard to follow:',
    '- What the problem asks: ' + e.overview,
    '- Underlying algorithm: ' + e.algorithm,
    '- The bug: ' + e.bug,
    '- Why the code fails: ' + e.whyItFails,
    '- Failing test case: ' + e.failingTestCase,
    '- The fix: ' + e.fix,
    '- Why the fix works: ' + e.whyFixWorks,
    '- Dry run: ' + e.dryRun,
    '- Debugging lesson: ' + e.debuggingLesson,
  ].join('\n\n');
}

const AI_PRESETS = [
  {
    label: 'Explain the bug simply',
    prompt:
      'I did not understand the explanation. In simple words, what is the bug here and why does it break the program? Also tell me why my selected lines were right or wrong.',
  },
  {
    label: 'Show a tiny example',
    prompt: 'Walk me through a tiny input step by step, so I can see exactly where the buggy code goes wrong.',
  },
  {
    label: 'Why does the fix work?',
    prompt: 'Explain why the fix works, and what would still break without it.',
  },
  {
    label: 'How do I spot this next time?',
    prompt: 'Give me one or two clues I can use to spot this kind of bug quickly in the future.',
  },
];

interface Props {
  problem: Problem;
  attempt: Attempt;
  bug: BugEvaluation;
  referenceFix: (line: number) => string;
  onSelfVerify: (line: number) => void;
}

export function ResultPanel({ problem, attempt, bug, referenceFix, onSelfVerify }: Props) {
  const status = RESULT_TEXT[attempt.bugResult];
  const score = scoreAttempt(attempt.bugResult, attempt.fixes, attempt.complexity);

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-line bg-surface p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={status.tone}>Bug: {status.label}</Badge>
          <span className="text-sm text-muted" aria-live="polite">
            Score on what you submitted: {score.percent}%
          </span>
        </div>
        <h2 className="mt-3 text-lg font-semibold">{problem.title}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <Badge>{problem.topic}</Badge>
          <Badge>{problem.subtopic}</Badge>
          <Badge>{problem.bugCategory}</Badge>
        </div>
        <dl className="mt-4 space-y-1 text-sm">
          <div>
            <dt className="inline text-muted">Buggy line(s): </dt>
            <dd className="inline">{[...bug.hits, ...bug.missed].sort((a, b) => a - b).join(', ')}</dd>
          </div>
          {bug.wrong.length > 0 && (
            <div>
              <dt className="inline text-muted">Your lines that are fine: </dt>
              <dd className="inline">{bug.wrong.join(', ')}</dd>
            </div>
          )}
          {bug.missed.length > 0 && attempt.bugResult !== 'incorrect' && (
            <div>
              <dt className="inline text-muted">Lines you missed: </dt>
              <dd className="inline">{bug.missed.join(', ')}</dd>
            </div>
          )}
        </dl>
      </section>

      {attempt.fixes.length > 0 && (
        <section className="rounded-lg border border-line bg-surface p-5">
          <h3 className="text-sm font-medium">Your corrected lines</h3>
          <ul className="mt-3 space-y-3">
            {attempt.fixes.map((f) => (
              <li key={f.line} className="rounded-md border border-line p-3 text-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-muted">Line {f.line}</span>
                  <Badge tone={f.status === 'unverified' ? 'warn' : 'good'}>
                    {f.status === 'verified'
                      ? 'Verified'
                      : f.status === 'self-verified'
                        ? 'Self-verified'
                        : 'Not auto-verified'}
                  </Badge>
                </div>
                <pre className="mt-2 overflow-x-auto font-mono text-[13px]">{f.submitted}</pre>
                {f.status === 'unverified' && (
                  <div className="mt-2">
                    <p className="text-muted">Reference fix:</p>
                    <pre className="overflow-x-auto font-mono text-[13px]">{referenceFix(f.line)}</pre>
                    <p className="mt-2 text-muted">
                      A different fix can still be valid. Text matching cannot run your code.
                    </p>
                    <button
                      type="button"
                      onClick={() => onSelfVerify(f.line)}
                      className="mt-2 rounded-md border border-line px-3 py-1.5 hover:bg-surface-2"
                    >
                      My fix is also valid
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-lg border border-line bg-surface p-5">
        <h3 className="text-sm font-medium">Explanation</h3>
        <dl className="mt-3 space-y-4 text-sm">
          {SECTIONS.map(({ key, label }) => (
            <div key={key}>
              <dt className="font-medium">{label}</dt>
              <dd className="mt-1 text-muted">{problem.explanation[key]}</dd>
            </div>
          ))}
        </dl>
      </section>

      <AiExplain
        title={attempt.bugResult === 'correct' ? 'Want it explained differently? Ask AI' : 'Did not understand the explanation? Ask AI'}
        hint="Gets the same solution re-explained in simpler words, with examples."
        getContext={() => buildAiContext(problem, attempt, bug)}
        presets={AI_PRESETS}
        placeholder="e.g. why is the loop condition wrong?"
      />
    </div>
  );
}
