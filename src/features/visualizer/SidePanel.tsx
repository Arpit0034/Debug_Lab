// Right-side info: what this step does (paper dry-run style), variables (with change highlight), call stack.
import { describeChange, explainError, explainStep, formatSnap, type Annotations } from './explain';
import { MONO, VIS } from './theme';
import type { Run, Step } from './types';

interface Props {
  step: Step | null;
  /** The previous step of the SAME call, so only real changes are highlighted. */
  prev: Step | null;
  /** The step that follows in this run (used to preview what a line changes). */
  next?: Step | null;
  annotations: Annotations;
  code: string;
  run?: Run;
  isLast?: boolean;
}

const TONE: Record<string, string> = { good: VIS.good, warn: VIS.warn, bad: VIS.bad, neutral: VIS.muted };

function ErrorCard({ step, crashed }: { step: Step; crashed: boolean }): React.ReactElement {
  const e = explainError(step);
  const code = step.x?.s;
  return (
    <div className="rounded-md border border-bad/50 bg-surface p-3 space-y-2">
      <div className="text-sm font-semibold" style={{ color: e.internal ? VIS.muted : VIS.bad }}>
        {e.internal ? 'Internal Python event' : e.handled ? 'Error raised (caught by the program)' : 'The program crashes here'}
      </div>
      <div style={{ fontFamily: MONO, fontSize: 13, color: VIS.fg }}>
        <span style={{ fontWeight: 700 }}>{e.title}</span>
        {e.message && <span>: {e.message}</span>}
      </div>
      <div className="text-xs" style={{ color: VIS.muted }}>{e.internal ? 'Python bookkeeping, not a bug in your code.' : e.plain}</div>
      {e.facts.length > 0 && (
        <ul className="space-y-1 text-xs" style={{ color: VIS.fg }}>
          {e.facts.map((f, i) => <li key={i}>&bull; {f}</li>)}
        </ul>
      )}
      {code && (
        <div className="text-xs" style={{ color: VIS.muted }}>
          Line {step.line} with the current values: <span style={{ fontFamily: MONO, color: VIS.fg }}>{code}</span>
        </div>
      )}
      {crashed && !e.handled && <div className="text-xs" style={{ color: VIS.muted }}>Nothing after this line runs.</div>}
    </div>
  );
}

export function SidePanel({ step, prev, next, annotations, code, run, isLast }: Props): React.ReactElement {
  const stack = annotations.callStack;
  const caller = stack.length >= 2 ? stack[stack.length - 2] : null;
  const ex = explainStep(step, prev, code, { caller: caller ? { fn: caller.fn, args: caller.args } : null, next });
  const entries = step ? Object.entries(step.locals) : [];
  const isError = step?.ev === 'exception';
  const stoppedEarly = isLast === true && run?.outcome === 'limit';

  return (
    <div className="space-y-3">
      {isError && step ? (
        <ErrorCard step={step} crashed={run?.outcome === 'crash'} />
      ) : (
        <div className="rounded-md border border-line bg-surface p-3 space-y-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="text-sm font-semibold" style={{ color: VIS.fg, wordBreak: 'break-word' }}>{ex.headline}</div>
            {ex.verdict && (
              <span className="shrink-0 rounded border px-1.5 py-0.5 text-xs" style={{ color: TONE[ex.verdict.tone], borderColor: TONE[ex.verdict.tone] }}>
                {ex.verdict.label}
              </span>
            )}
          </div>
          {ex.detail && <div className="text-xs" style={{ color: VIS.muted }}>{ex.detail}</div>}
          {ex.notes.map((n, i) => <div key={i} className="text-xs" style={{ color: VIS.muted }}>{n}</div>)}
          {ex.skipped && (
            <div className="text-xs" style={{ color: VIS.muted, fontStyle: 'italic' }}>
              &#8943; {ex.skipped}. Variables below already include their result.
            </div>
          )}
        </div>
      )}

      {stoppedEarly && (
        <div className="rounded-md border border-bad/50 bg-surface p-3 text-xs" style={{ color: VIS.muted }}>
          <span style={{ color: VIS.bad, fontWeight: 700 }}>Trace stopped here.</span> The code was still running when the step limit was reached, which usually means an endless loop or recursion. Check the loop condition or base case.
        </div>
      )}

      {entries.length > 0 && (
        <div className="overflow-hidden rounded-md border border-line bg-surface">
          <div className="border-b border-line px-3 py-1.5 text-xs font-medium" style={{ color: VIS.muted }}>
            Variables{prev ? ' (changed since the previous step are highlighted)' : ''}
          </div>
          <div className="max-h-64 overflow-auto">
            <table className="w-full border-collapse text-left" style={{ fontFamily: MONO, fontSize: 13 }}>
              <tbody>
                {entries.map(([name, value]) => {
                  const before = prev?.locals[name];
                  const isNew = prev !== null && !(name in (prev?.locals ?? {}));
                  const note = prev && !isNew ? describeChange(before, value) : null;
                  const isChanged = isNew || note !== null;
                  return (
                    <tr key={name} className="border-b border-line/40 last:border-0">
                      <td className="px-3 py-1 align-top" style={{ color: isChanged ? VIS.accent : VIS.muted, fontWeight: isChanged ? 700 : 500, width: '38%' }}>{name}</td>
                      <td className="px-3 py-1 align-top" style={{ color: isChanged ? VIS.accent : VIS.fg, fontWeight: isChanged ? 700 : 500, wordBreak: 'break-all' }}>
                        {formatSnap(value, { items: 12, len: 72 })}
                        {isChanged && (
                          <div style={{ color: VIS.muted, fontWeight: 400, fontSize: 11 }}>
                            {isNew ? 'new' : note}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {stack.length > 0 && (
        <div className="overflow-hidden rounded-md border border-line bg-surface">
          <div className="border-b border-line px-3 py-1.5 text-xs font-medium" style={{ color: VIS.muted }}>Call stack ({stack.length})</div>
          <div className="max-h-56 overflow-auto p-2">
            {stack.map((c, i) => {
              const isTop = i === stack.length - 1;
              return (
                <div
                  key={i}
                  className="mb-1 rounded border px-2 py-1"
                  style={{
                    marginLeft: i * 8,
                    borderColor: isTop ? VIS.accent : VIS.line,
                    background: isTop ? VIS.bgAlt : 'transparent',
                    fontFamily: MONO,
                    fontSize: 12,
                  }}
                >
                  <span style={{ color: VIS.muted }}>#{c.call}</span>{' '}
                  <span style={{ color: VIS.fg, fontWeight: isTop ? 700 : 500 }}>{c.fn}</span>
                  {c.args && <span style={{ color: VIS.muted }}>({c.args})</span>}
                  {c.returned !== undefined && <span style={{ color: VIS.good }}> → {c.returned}</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
