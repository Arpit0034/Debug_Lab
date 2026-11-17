import { useEffect, useState } from 'react';
import { useUsage } from './usage';

interface StagedProgressProps {
  stages: string[];
  /** Roughly how long this step usually takes. The bar slows down as it nears 95%. */
  expectedMs: number;
}

/**
 * The APIs give no real progress, so this bar is an honest estimate: it eases toward 95%
 * and only disappears (the parent unmounts it) when the call actually finishes.
 */
export function StagedProgress({ stages, expectedMs }: StagedProgressProps): React.ReactElement {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t0 = Date.now();
    const id = window.setInterval(() => setElapsed(Date.now() - t0), 200);
    return () => window.clearInterval(id);
  }, []);

  const pct = Math.min(95, Math.round(95 * (1 - Math.exp(-elapsed / expectedMs))));
  const active = Math.min(stages.length - 1, Math.floor(pct / (95 / stages.length)));
  const slow = elapsed > expectedMs * 2.5;

  return (
    <div className="cp-stage" role="status" aria-live="polite">
      <div className="cp-stage__head">
        <strong>{stages[active]}...</strong>
        <span className="cx-small cx-muted">
          {pct}% - {Math.floor(elapsed / 1000)}s
        </span>
      </div>
      <div
        className="cp-stage__track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div className="cp-stage__fill" style={{ width: pct + '%' }} />
      </div>
      <ol className="cp-stage__steps">
        {stages.map((s, i) => (
          <li key={s} className={i < active ? 'is-done' : i === active ? 'is-active' : ''}>
            {i < active ? '✓ ' : ''}
            {s}
          </li>
        ))}
      </ol>
      <p className="cx-small cx-muted" style={{ margin: 0 }}>
        {slow
          ? 'Taking longer than usual - the AI may be busy or rate limited. It will keep trying.'
          : 'Estimated progress - the AI does not report real progress.'}
      </p>
    </div>
  );
}

const fmt = (n: number): string => n.toLocaleString();

interface UsageBarProps {
  /** Rounds already generated in the background, and the total planned. */
  ready: number;
  total: number;
}

export function UsageBar({ ready, total }: UsageBarProps): React.ReactElement {
  const u = useUsage();
  return (
    <div className="cp-usage" aria-label="AI usage this session">
      <span title={`in ${fmt(u.groq.input)} / out ${fmt(u.groq.output)}`}>
        Groq <b>{fmt(u.groq.total)}</b> tok - {u.groq.calls} {u.groq.calls === 1 ? 'call' : 'calls'}
      </span>
      {u.groqLimits && (
        <span title={`Reported by Groq. Tokens reset in ${u.groqLimits.tokensReset ?? '?'}`}>
          Groq left{' '}
          <b>
            {u.groqLimits.requestsRemaining !== null
              ? `${fmt(u.groqLimits.requestsRemaining)}/${fmt(u.groqLimits.requestsLimit ?? 0)} req today`
              : '-'}
          </b>
          {u.groqLimits.tokensRemaining !== null &&
            ` - ${fmt(u.groqLimits.tokensRemaining)}/${fmt(u.groqLimits.tokensLimit ?? 0)} tok/min`}
        </span>
      )}
      <span title={`in ${fmt(u.gemini.input)} / out ${fmt(u.gemini.output)} (output includes thinking)`}>
        Gemini <b>{fmt(u.gemini.total)}</b> tok - {u.gemini.calls} {u.gemini.calls === 1 ? 'call' : 'calls'}
      </span>
      {total > 0 && (
        <span>
          Rounds ready <b>{Math.min(ready, total)}/{total}</b>
        </span>
      )}
    </div>
  );
}
