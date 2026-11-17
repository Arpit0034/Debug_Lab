import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Bookmark, Lightbulb, X } from 'lucide-react';
import { getProblem, problems } from '../../data/problemRegistry';
import { LANGUAGE_LABELS, TIMER_MINUTES, type Language, type Problem } from '../../types/problem';
import type { Attempt, FixAttempt } from '../../types/progress';
import { useApp } from '../../app/providers/context';
import { CodeEditor, type LineMark } from '../../components/editor/CodeEditor';
import { Badge } from '../../components/common/PageHeader';
import { ComplexityStep } from '../debugging/ComplexityStep';
import { ResultPanel } from '../debugging/ResultPanel';
import { VisualizerLink } from '../visualizer';
import { ChallengeBar, TimerBar } from '../debugging/SessionBars';
import { useProblemTimer } from '../../hooks/useProblemTimer';
import { elapsedSec } from '../../services/timer/timer';
import {
  structuralEvaluator as evaluator,
  getComplexity,
  type BugEvaluation,
} from '../../services/evaluation/evaluator';
import {
  addAttempt,
  clearDraft,
  saveDraft,
  setLastVisited,
  updateAttempt,
} from '../../services/storage/progressStorage';
import { statusOf } from '../../utils/status';

export function ProblemPage() {
  const { id = '' } = useParams();
  const problem = getProblem(id);
  if (!problem) {
    return (
      <div className="text-sm">
        <p>Problem not found.</p>
        <Link to="/problems" className="text-accent">
          Back to problems
        </Link>
      </div>
    );
  }
  return <Workspace key={problem.id} problem={problem} />;
}

function nextProblemId(current: string, attemptedIds: Set<string>): string | null {
  const idx = problems.findIndex((p) => p.id === current);
  const after = [...problems.slice(idx + 1), ...problems.slice(0, idx)];
  return (after.find((p) => !attemptedIds.has(p.id)) ?? after[0])?.id ?? null;
}

function Workspace({ problem }: { problem: Problem }) {
  const { settings, updateSettings, progress, bookmarks, toggleBookmark, reload, session, setSession } = useApp();
  const navigate = useNavigate();
  const draft = progress.drafts[problem.id];
  const timer = useProblemTimer(draft?.timer);
  const limitSec = TIMER_MINUTES[problem.difficulty] * 60;

  const preferred = problem.languages.includes(settings.language) ? settings.language : problem.languages[0];
  const [language, setLanguage] = useState<Language>(preferred);
  const [selected, setSelected] = useState<Partial<Record<Language, number[]>>>(draft?.selectedLines ?? {});
  const [fixInputs, setFixInputs] = useState<Partial<Record<Language, Record<string, string>>>>(
    draft?.fixInputs ?? {},
  );
  const [manual, setManual] = useState('');
  const [manualError, setManualError] = useState('');
  const [hintsShown, setHintsShown] = useState(0);
  const [result, setResult] = useState<{ attempt: Attempt; bug: BugEvaluation; language: Language } | null>(null);

  const code = problem.buggyCode[language] ?? '';
  const lineCount = code.split('\n').length;
  const mySelected = useMemo(() => selected[language] ?? [], [selected, language]);
  const myFixes = fixInputs[language] ?? {};
  const submitted = result !== null;
  const dark = settings.theme === 'dark';

  useEffect(() => {
    setLastVisited(problem.id, language);
  }, [problem.id, language]);

  // Keep unsubmitted work and the timer so a refresh or language switch never loses them.
  const latest = useRef({ selected, fixInputs });
  latest.current = { selected, fixInputs };
  const save = () => {
    if (submitted) return;
    const cur = latest.current;
    const hasWork =
      Object.values(cur.selected).some((l) => (l?.length ?? 0) > 0) ||
      Object.values(cur.fixInputs).some((m) => Object.values(m ?? {}).some((v) => v.trim()));
    if (!hasWork && !timer.state.started) return;
    saveDraft(problem.id, {
      selectedLines: cur.selected,
      fixInputs: cur.fixInputs,
      timer: timer.snapshot(),
      updatedAt: Date.now(),
    });
  };
  const saveRef = useRef(save);
  saveRef.current = save;

  useEffect(() => {
    saveRef.current();
  }, [selected, fixInputs, timer.state, submitted]);

  useEffect(() => {
    if (!timer.running || submitted) return;
    const id = window.setInterval(() => saveRef.current(), 5000);
    return () => window.clearInterval(id);
  }, [timer.running, submitted]);

  // Whole-challenge countdown, only when this problem belongs to a timed session.
  const inSession = !!session && session.queue[session.index] === problem.id;
  const challengeTotal = inSession ? session.totalSec : undefined;
  const [tick, setTick] = useState(() => Date.now());
  useEffect(() => {
    if (challengeTotal === undefined) return;
    const id = window.setInterval(() => setTick(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [challengeTotal]);
  const secondsLeft =
    inSession && session.totalSec !== undefined
      ? Math.floor(session.totalSec - (tick - session.startedAt) / 1000)
      : null;

  const setLines = (lines: number[]) =>
    setSelected((prev) => ({ ...prev, [language]: Array.from(new Set(lines)).sort((a, b) => a - b) }));

  const toggleLine = (line: number) => {
    if (submitted) return;
    setLines(mySelected.includes(line) ? mySelected.filter((l) => l !== line) : [...mySelected, line]);
  };

  const addManual = () => {
    const n = Number(manual);
    if (!Number.isInteger(n) || n < 1 || n > lineCount) {
      setManualError(`Enter a line number from 1 to ${lineCount}.`);
      return;
    }
    setManualError('');
    setManual('');
    if (!mySelected.includes(n)) setLines([...mySelected, n]);
  };

  const marks = useMemo<Record<number, LineMark>>(() => {
    const m: Record<number, LineMark> = {};
    if (!result) {
      mySelected.forEach((l) => (m[l] = 'selected'));
    } else if (language === result.language) {
      result.bug.hits.forEach((l) => (m[l] = 'hit'));
      result.bug.wrong.forEach((l) => (m[l] = 'wrong'));
      result.bug.missed.forEach((l) => (m[l] = 'missed'));
    } else {
      (problem.buggyLines[language] ?? []).forEach((l) => (m[l] = 'missed'));
    }
    return m;
  }, [result, mySelected, language, problem]);

  const fixedMarks = useMemo<Record<number, LineMark>>(() => {
    const m: Record<number, LineMark> = {};
    (problem.buggyLines[language] ?? []).forEach((l) => (m[l] = 'fixed'));
    return m;
  }, [problem, language]);

  const submit = () => {
    const bug = evaluator.evaluateBug(problem, language, mySelected);
    const fixes = evaluator.evaluateFixes(problem, language, mySelected, myFixes);
    const timeSpentSec = timer.elapsed();
    timer.pause();
    const attempt: Attempt = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      problemId: problem.id,
      language,
      timestamp: Date.now(),
      selectedLines: mySelected,
      bugResult: bug.result,
      fixes,
      timeSpentSec,
      withinTime: timeSpentSec <= limitSec,
      firstAttempt: statusOf(problem.id, progress.attempts) === 'unattempted',
    };
    addAttempt(attempt);
    clearDraft(problem.id);
    reload();
    setResult({ attempt, bug, language });
  };

  const patchAttempt = (patch: Partial<Attempt>) => {
    if (!result) return;
    updateAttempt(result.attempt.id, patch);
    reload();
    setResult({ ...result, attempt: { ...result.attempt, ...patch } });
  };

  const selfVerify = (line: number) => {
    if (!result) return;
    const fixes: FixAttempt[] = result.attempt.fixes.map((f) =>
      f.line === line ? { ...f, status: 'self-verified' } : f,
    );
    patchAttempt({ fixes });
  };

  const submitComplexity = (time: string, space: string) => {
    if (!result) return;
    const ev = evaluator.evaluateComplexity(problem, result.language, time, space);
    patchAttempt({ complexity: { time, space, timeCorrect: ev.timeCorrect, spaceCorrect: ev.spaceCorrect } });
  };

  const attemptedIds = new Set(progress.attempts.map((a) => a.problemId));
  const next = nextProblemId(problem.id, attemptedIds);
  const marked = bookmarks.includes(problem.id);

  const fixLines = submitted ? [] : mySelected;

  return (
    <div className="space-y-4">
      {inSession && (
        <ChallengeBar
          label={session.label}
          position={session.index + 1}
          total={session.queue.length}
          secondsLeft={secondsLeft}
        />
      )}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
      <div className="space-y-4">
        <TimerBar
          started={timer.state.started}
          running={timer.running}
          elapsed={elapsedSec(timer.state, timer.now)}
          limitSec={limitSec}
          locked={submitted}
          onPause={timer.pause}
          onResume={timer.resume}
        />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">
              {submitted ? problem.title : 'Find the bug in this implementation'}
            </h1>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge tone={problem.difficulty === 'Easy' ? 'good' : problem.difficulty === 'Medium' ? 'warn' : 'bad'}>
                {problem.difficulty}
              </Badge>
              <Badge>Suggested {TIMER_MINUTES[problem.difficulty]} min</Badge>
            </div>
          </div>
          <button
            type="button"
            onClick={() => toggleBookmark(problem.id)}
            aria-pressed={marked}
            aria-label={marked ? 'Remove bookmark' : 'Add bookmark'}
            className={`rounded p-2 ${marked ? 'text-accent' : 'text-muted hover:text-fg'}`}
          >
            <Bookmark size={20} fill={marked ? 'currentColor' : 'none'} />
          </button>
        </div>

        <p className="text-sm">{problem.description}</p>

        <div>
          <h2 className="text-sm font-medium">Constraints</h2>
          <ul className="mt-1 list-disc pl-5 text-sm text-muted">
            {problem.constraints.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-medium">Examples</h2>
          <div className="mt-1 space-y-2">
            {problem.examples.map((e) => (
              <div key={e.input} className="rounded-md border border-line bg-surface p-3 font-mono text-[13px]">
                <div>Input: {e.input}</div>
                <div>Expected: {e.output}</div>
                {e.note && <div className="mt-1 font-sans text-xs text-muted">{e.note}</div>}
              </div>
            ))}
          </div>
        </div>

        {settings.showHints && !submitted && (
          <div>
            <button
              type="button"
              disabled={hintsShown >= problem.hints.length}
              onClick={() => setHintsShown((n) => n + 1)}
              className="flex items-center gap-2 rounded-md border border-line px-3 py-1.5 text-sm hover:bg-surface-2 disabled:opacity-40"
            >
              <Lightbulb size={14} />
              {hintsShown === 0 ? 'Show a hint' : hintsShown >= problem.hints.length ? 'No more hints' : 'Next hint'}
            </button>
            <ul className="mt-2 space-y-1 text-sm text-muted">
              {problem.hints.slice(0, hintsShown).map((h, i) => (
                <li key={h}>
                  Hint {i + 1}: {h}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex gap-2" role="tablist" aria-label="Language">
            {problem.languages.map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={l === language}
                onClick={() => {
                  setLanguage(l);
                  updateSettings({ language: l });
                }}
                className={`rounded-md border px-3 py-1.5 text-sm ${
                  l === language ? 'border-accent text-accent' : 'border-line text-muted hover:text-fg'
                }`}
              >
                {LANGUAGE_LABELS[l]}
              </button>
            ))}
          </div>
          {!submitted && <span className="text-xs text-muted">Click a line to mark it as buggy</span>}
        </div>

        <div className="overflow-hidden rounded-lg border border-line">
          <CodeEditor
            code={code}
            language={language}
            marks={marks}
            onToggleLine={submitted ? undefined : toggleLine}
            dark={dark}
            fontSize={settings.fontSize}
            ariaLabel={`Buggy ${LANGUAGE_LABELS[language]} code`}
          />
        </div>

        {!submitted && (
          <>
            <section className="space-y-3 rounded-lg border border-line bg-surface p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-medium">Suspicious lines</h2>
                {mySelected.length === 0 && <span className="text-sm text-muted">None selected</span>}
                {mySelected.map((l) => (
                  <span key={l} className="flex items-center gap-1 rounded border border-line px-2 py-0.5 text-sm">
                    Line {l}
                    <button
                      type="button"
                      onClick={() => toggleLine(l)}
                      aria-label={`Remove line ${l}`}
                      className="text-muted hover:text-fg"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  inputMode="numeric"
                  value={manual}
                  onChange={(e) => setManual(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addManual()}
                  placeholder="Line number"
                  aria-label="Line number to add"
                  className="w-32 rounded-md border border-line bg-bg px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={addManual}
                  className="rounded-md border border-line px-3 py-2 text-sm hover:bg-surface-2"
                >
                  Add line
                </button>
                {manualError && (
                  <span role="alert" className="text-sm text-bad">
                    {manualError}
                  </span>
                )}
              </div>
            </section>

            {fixLines.length > 0 && (
              <section className="space-y-3 rounded-lg border border-line bg-surface p-4">
                <h2 className="text-sm font-medium">Corrected line (optional)</h2>
                {fixLines.map((l) => (
                  <label key={l} className="block text-xs text-muted">
                    Line {l}
                    <input
                      value={myFixes[String(l)] ?? ''}
                      onChange={(e) => {
                        setFixInputs((prev) => ({
                          ...prev,
                          [language]: { ...(prev[language] ?? {}), [String(l)]: e.target.value },
                        }));
                      }}
                      placeholder="Type the corrected version of this line"
                      className="mt-1 block w-full rounded-md border border-line bg-bg px-3 py-2 font-mono text-[13px] text-fg"
                    />
                  </label>
                ))}
              </section>
            )}

            <button
              type="button"
              onClick={submit}
              disabled={mySelected.length === 0}
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white disabled:opacity-40"
            >
              Submit
            </button>
          </>
        )}

        {result && (
          <>
            <ResultPanel
              problem={problem}
              attempt={result.attempt}
              bug={result.bug}
              referenceFix={(line) => problem.acceptedFixes[result.language]?.[String(line)]?.[0] ?? ''}
              onSelfVerify={selfVerify}
            />

            <section>
              <h2 className="mb-2 text-sm font-medium">Corrected code ({LANGUAGE_LABELS[language]})</h2>
              <div className="overflow-hidden rounded-lg border border-line">
                <CodeEditor
                  code={problem.correctCode[language] ?? ''}
                  language={language}
                  marks={fixedMarks}
                  dark={dark}
                  fontSize={settings.fontSize}
                  ariaLabel={`Corrected ${LANGUAGE_LABELS[language]} code`}
                />
              </div>
            </section>

            <VisualizerLink problem={problem} />

            <ComplexityStep
              correct={getComplexity(problem, result.language)}
              done={result.attempt.complexity}
              onSubmit={submitComplexity}
            />

            <div className="flex flex-wrap gap-2">
              {inSession && session.queue[session.index + 1] && (
                <button
                  type="button"
                  onClick={() => {
                    setSession({ ...session, index: session.index + 1 });
                    navigate(`/problem/${session.queue[session.index + 1]}`);
                  }}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
                >
                  Next in session
                </button>
              )}
              {inSession && !session.queue[session.index + 1] && (
                <button
                  type="button"
                  onClick={() => {
                    if (session.mode === 'timed') {
                      navigate('/timed');
                    } else {
                      setSession(null);
                      navigate('/practice');
                    }
                  }}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white"
                >
                  Finish session
                </button>
              )}
              {!inSession && next && next !== problem.id && (
                <Link to={`/problem/${next}`} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white">
                  Next problem
                </Link>
              )}
              <Link to="/problems" className="rounded-md border border-line px-4 py-2 text-sm hover:bg-surface-2">
                All problems
              </Link>
            </div>
          </>
        )}
      </div>
      </div>
    </div>
  );
}
