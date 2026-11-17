// Orchestrator: loads data, owns playback state, three layout modes.
import { Component, useEffect, useMemo, useState, type ReactNode } from 'react';
import { hasVisualizer } from '../../data/viz/vizIndex';
import type { Problem } from '../../types/problem';
import { Canvas } from './Canvas';
import { CodePanel } from './CodePanel';
import { Controls } from './Controls';
import { deriveAnnotations, formatSnap, summarizeRun } from './explain';
import { Legend } from './Legend';
import { SidePanel } from './SidePanel';
import { useStory } from './useStory';
import { MONO, VIS } from './theme';
import type { Run, Step, VizData } from './types';

type Mode = 'correct' | 'buggy' | 'side';

interface BState { hasError: boolean }
class Boundary extends Component<{ children: ReactNode }, BState> {
  state: BState = { hasError: false };
  static getDerivedStateFromError(): BState { return { hasError: true }; }
  render(): ReactNode {
    if (this.state.hasError) return <section className="rounded-lg border border-line bg-surface p-4 text-sm text-muted">Visualizer unavailable for this problem.</section>;
    return this.props.children;
  }
}

function DivergenceDive({ correctStep, buggyStep, reason }: { correctStep: Step; buggyStep: Step; reason: string }): React.ReactElement {
  const keys = new Set([...Object.keys(correctStep.locals), ...Object.keys(buggyStep.locals)]);
  const rows: { name: string; correct: string; buggy: string; differs: boolean }[] = [];
  for (const k of keys) {
    if (k === 'self' || k === 'cls') continue;
    const cv = formatSnap(correctStep.locals[k]);
    const bv = formatSnap(buggyStep.locals[k]);
    rows.push({ name: k, correct: cv, buggy: bv, differs: cv !== bv });
  }
  return (
    <div className="overflow-hidden rounded-md border border-bad/50 bg-surface">
      <div className="border-b border-line px-3 py-2 text-sm font-semibold" style={{ color: VIS.bad }}>
        First divergence — {reason}
      </div>
      {rows.length > 0 ? (
        <table className="w-full border-collapse text-left" style={{ fontFamily: MONO, fontSize: 13 }}>
          <thead>
            <tr className="border-b border-line text-xs" style={{ color: VIS.muted }}>
              <th className="px-3 py-1 font-medium">Variable</th>
              <th className="px-3 py-1 font-medium">Correct</th>
              <th className="px-3 py-1 font-medium">Buggy</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className={'border-b border-line/40 last:border-0 ' + (r.differs ? 'bg-surface-2' : '')}>
                <td className="px-3 py-1" style={{ color: r.differs ? VIS.accent : VIS.muted, fontWeight: r.differs ? 700 : 500 }}>{r.name}</td>
                <td className="px-3 py-1" style={{ color: VIS.fg, fontWeight: r.differs ? 700 : 500 }}>{r.correct}</td>
                <td className="px-3 py-1" style={{ color: r.differs ? VIS.bad : VIS.fg, fontWeight: r.differs ? 700 : 500 }}>{r.buggy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="p-3 text-xs" style={{ color: VIS.muted }}>No variables differ at this step — the difference is in control flow.</div>
      )}
    </div>
  );
}

interface PaneProps {
  mode: 'correct' | 'buggy';
  data: VizData;
  steps: Step[];
  stepIndex: number;
  divergenceStep: number | null;
}

function FullPane({ mode, data, steps, stepIndex, divergenceStep }: PaneProps): React.ReactElement {
  const step = steps[stepIndex] ?? null;
  // compare with the previous step of the SAME call, so entering/leaving a call doesn't flag everything as changed
  let prev: Step | null = null;
  if (step) {
    for (let j = stepIndex - 1; j >= 0 && j >= stepIndex - 200; j--) {
      if (steps[j].call === step.call) { prev = steps[j]; break; }
    }
  }
  const next = stepIndex + 1 < steps.length ? steps[stepIndex + 1] : null;
  const code = mode === 'correct' ? data.code.correct : data.code.buggy;
  const ann = useMemo(
    () => deriveAnnotations(data.kind, step, steps, stepIndex, data.structure),
    [data.kind, step, steps, stepIndex, data.structure],
  );
  const isDiv = divergenceStep !== null && stepIndex === divergenceStep;
  const run: Run = mode === 'correct' ? data.correct : data.buggy;

  return (
    <div className={'overflow-hidden rounded-md border-2 ' + (isDiv ? 'border-bad' : 'border-line')}>
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="text-sm font-semibold" style={{ color: mode === 'correct' ? VIS.good : VIS.bad }}>
          {mode === 'correct' ? '✓ Correct' : '✕ Buggy'}
        </span>
        <span className="text-xs" style={{ color: VIS.muted, fontFamily: MONO }}>
          {summarizeRun(run.outcome, run.result, run.error, run.truncated)}
        </span>
      </div>
      <div className="grid gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-2">
          <Canvas
            kind={data.kind}
            structure={data.structure}
            steps={steps}
            stepIndex={stepIndex}
            divergenceCallId={isDiv && step ? step.call : null}
          />
          <Legend />
        </div>
        <div className="space-y-3">
          <CodePanel
            code={code}
            currentLine={step ? step.line : 1}
            buggyLines={mode === 'buggy' ? data.buggyLines : []}
            mode={mode}
          />
          <SidePanel step={step} prev={prev} next={next} annotations={ann} code={code} run={run} isLast={stepIndex >= steps.length - 1} />
        </div>
      </div>
    </div>
  );
}

function CompactPane({ mode, data, steps, stepIndex, divergenceStep }: PaneProps): React.ReactElement {
  const step = steps[stepIndex] ?? null;
  const run: Run = mode === 'correct' ? data.correct : data.buggy;
  const isDiv = divergenceStep !== null && stepIndex === divergenceStep;
  return (
    <div className={'overflow-hidden rounded-md border-2 ' + (isDiv ? 'border-bad' : 'border-line')}>
      <div className="flex items-center justify-between border-b border-line px-3 py-2">
        <span className="text-sm font-semibold" style={{ color: mode === 'correct' ? VIS.good : VIS.bad }}>
          {mode === 'correct' ? '✓ Correct' : '✕ Buggy'}
        </span>
        <span className="text-xs" style={{ color: VIS.muted, fontFamily: MONO }}>
          {summarizeRun(run.outcome, run.result, run.error, run.truncated)}
        </span>
      </div>
      <div className="p-2">
        <Canvas
          kind={data.kind}
          structure={data.structure}
          steps={steps}
          stepIndex={stepIndex}
          divergenceCallId={isDiv && step ? step.call : null}
        />
        {step && (
          <div className="mt-2 space-y-0.5 rounded border border-line bg-surface-2 p-2" style={{ fontFamily: MONO, fontSize: 12 }}>
            <div style={{ color: VIS.accent }}>line {step.line}</div>
            {Object.entries(step.locals).slice(0, 4).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-3">
                <span style={{ color: VIS.muted }}>{k}</span>
                <span className="truncate" style={{ color: VIS.fg }}>{formatSnap(v)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Inner({ problem, defaultOpen }: { problem: Problem; defaultOpen?: boolean }): ReactNode {
  const { data, loading, error } = useStory(problem.id);
  const [open, setOpen] = useState(defaultOpen === true);
  const [mode, setMode] = useState<Mode>('correct');
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const correctSteps = data?.correct.steps ?? [];
  const buggySteps = data?.buggy.steps ?? [];
  const count = mode === 'correct' ? correctSteps.length : mode === 'buggy' ? buggySteps.length : Math.max(correctSteps.length, buggySteps.length);
  const maxIdx = Math.max(0, count - 1);

  const jumpStep = data?.divergence
    ? mode === 'buggy' ? data.divergence.buggyStep : mode === 'correct' ? data.divergence.correctStep : Math.min(data.divergence.correctStep, data.divergence.buggyStep)
    : null;

  useEffect(() => {
    if (!playing || count === 0) return;
    if (index >= maxIdx) { setPlaying(false); return; }
    const id = window.setTimeout(() => setIndex((v) => Math.min(v + 1, maxIdx)), Math.max(120, 900 / speed));
    return () => window.clearTimeout(id);
  }, [playing, index, maxIdx, count, speed]);

  useEffect(() => { setIndex(0); setPlaying(false); }, [mode, data?.problemId]);

  if (!open) {
    return (
      <section className="rounded-lg border border-line bg-surface p-4">
        <button type="button" onClick={() => setOpen(true)} className="rounded-md border border-line px-3 py-2 text-sm hover:bg-surface-2">
          Visualize execution
        </button>
      </section>
    );
  }
  if (loading) return <section className="rounded-lg border border-line bg-surface p-4 text-sm text-muted">Loading trace…</section>;
  if (error || !data) return <section className="rounded-lg border border-line bg-surface p-4 text-sm text-muted">{error ?? 'Visualizer unavailable for this problem.'}</section>;

  const cIdx = Math.min(index, Math.max(0, correctSteps.length - 1));
  const bIdx = Math.min(index, Math.max(0, buggySteps.length - 1));

  const atDivC = data.divergence !== null && cIdx === data.divergence.correctStep;
  const atDivB = data.divergence !== null && bIdx === data.divergence.buggyStep;

  const tab = (m: Mode, label: string): React.ReactElement => (
    <button
      key={m}
      type="button"
      onClick={() => setMode(m)}
      className={'rounded-md border px-3 py-1.5 text-sm ' + (mode === m ? 'border-accent text-accent' : 'border-line text-muted hover:text-fg')}
    >
      {label}
    </button>
  );

  const showDive = data.divergence !== null && (atDivC || atDivB);
  const divC = data.divergence && correctSteps[data.divergence.correctStep];
  const divB = data.divergence && buggySteps[data.divergence.buggyStep];

  return (
    <section className="space-y-3 rounded-lg border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-medium">Execution visualizer</h2>
        <div className="flex flex-wrap gap-1.5">
          {tab('correct', 'Correct')}
          {tab('buggy', 'Buggy')}
          {tab('side', 'Side by side')}
          {defaultOpen !== true && (
            <button type="button" onClick={() => setOpen(false)} className="rounded-md border border-line px-3 py-1.5 text-sm hover:bg-surface-2">Hide</button>
          )}
        </div>
      </div>

      {showDive && divC && divB && data.divergence && (
        <DivergenceDive correctStep={divC} buggyStep={divB} reason={data.divergence.reason} />
      )}

      <Controls
        index={index}
        count={count}
        playing={playing}
        speed={speed}
        canJump={jumpStep !== null}
        onIndex={(i) => { setIndex(i); setPlaying(false); }}
        onPlayPause={() => setPlaying((v) => !v)}
        onSpeed={setSpeed}
        onJump={() => { if (jumpStep !== null) { setIndex(jumpStep); setPlaying(false); } }}
      />

      {mode === 'side' ? (
        <div className="grid gap-3 xl:grid-cols-2">
          <CompactPane mode="correct" data={data} steps={correctSteps} stepIndex={cIdx} divergenceStep={data.divergence?.correctStep ?? null} />
          <CompactPane mode="buggy" data={data} steps={buggySteps} stepIndex={bIdx} divergenceStep={data.divergence?.buggyStep ?? null} />
        </div>
      ) : mode === 'correct' ? (
        <FullPane mode="correct" data={data} steps={correctSteps} stepIndex={index} divergenceStep={data.divergence?.correctStep ?? null} />
      ) : (
        <FullPane mode="buggy" data={data} steps={buggySteps} stepIndex={index} divergenceStep={data.divergence?.buggyStep ?? null} />
      )}
    </section>
  );
}

export function VisualizerPanel({ problem, defaultOpen }: { problem: Problem; defaultOpen?: boolean }): ReactNode {
  if (!hasVisualizer(problem.id)) return null;
  return <Boundary><Inner problem={problem} defaultOpen={defaultOpen} /></Boundary>;
}
