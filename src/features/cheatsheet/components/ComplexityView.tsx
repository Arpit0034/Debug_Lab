import { useMemo, useState } from 'react';
import {
  COMPLEXITY_CLASSES,
  DATA_STRUCTURE_OPS,
  CALCULATOR_DEFAULTS,
  type ComplexityClass,
} from '../data/complexity';

const INPUT_SIZES = [10, 100, 1000, 10000, 100000, 1000000, 10000000];

function log10Ops(cls: ComplexityClass, n: number): number {
  switch (cls.notation) {
    case 'O(1)':
      return 0;
    case 'O(log n)':
      return Math.log10(Math.max(1, Math.log2(Math.max(1, n))));
    case 'O(n)':
      return Math.log10(Math.max(1, n));
    case 'O(n log n)':
      return (
        Math.log10(Math.max(1, n)) +
        Math.log10(Math.max(1, Math.log2(Math.max(1, n))))
      );
    case 'O(n²)':
      return 2 * Math.log10(Math.max(1, n));
    case 'O(n³)':
      return 3 * Math.log10(Math.max(1, n));
    case 'O(2ⁿ)':
      return Math.max(1, n) * Math.log10(2);
    case 'O(n!)': {
      const N = Math.max(1, Math.min(n, 100000));
      if (N < 10) {
        let s = 0;
        for (let i = 2; i <= N; i++) s += Math.log10(i);
        return s;
      }
      return (
        N * Math.log10(N) - N * Math.log10(Math.E) + 0.5 * Math.log10(2 * Math.PI * N)
      );
    }
    default:
      return 0;
  }
}

function formatOps(log10Value: number): string {
  if (log10Value <= 0) return '1';
  if (log10Value < 6) return `~${Math.round(Math.pow(10, log10Value)).toLocaleString()}`;
  return `≈ 10^${Math.floor(log10Value)}`;
}

export function ComplexityView(): React.ReactElement {
  const [sizeIdx, setSizeIdx] = useState(4);
  const [opsPerSec, setOpsPerSec] = useState(CALCULATOR_DEFAULTS.opsPerSecond);
  const [timeLimitSec, setTimeLimitSec] = useState(CALCULATOR_DEFAULTS.timeLimitSec);

  const n = INPUT_SIZES[sizeIdx];
  const budget = opsPerSec * timeLimitSec;
  const logBudget = Math.log10(budget);

  const rows = useMemo(
    () =>
      COMPLEXITY_CLASSES.map((cls) => {
        const log = log10Ops(cls, n);
        return {
          cls,
          log,
          display: formatOps(log),
          feasible: log <= logBudget,
        };
      }),
    [n, logBudget],
  );

  return (
    <div className="cx-stack" style={{ gap: '2rem' }}>
      <section>
        <h2 className="cx-h2" style={{ marginTop: 0 }}>
          Complexity Reference
        </h2>
        <p className="cx-lead">
          Every algorithm falls into a growth class. Use this to reason about which fits your input size.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="cx-table">
            <thead>
              <tr>
                <th style={{ width: '7rem' }}>Notation</th>
                <th style={{ width: '8rem' }}>Class</th>
                <th>Example</th>
                <th>When it typically occurs</th>
              </tr>
            </thead>
            <tbody>
              {COMPLEXITY_CLASSES.map((c) => (
                <tr key={c.notation}>
                  <td className="cx-mono" style={{ fontWeight: 700 }}>
                    {c.notation}
                  </td>
                  <td>{c.name}</td>
                  <td className="cx-small">{c.example}</td>
                  <td className="cx-small">{c.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="cx-h2" style={{ marginTop: 0 }}>
          Operations Calculator
        </h2>
        <p className="cx-lead">
          Estimate feasibility. Assumptions are editable below — a "simple operation" is not universal
          (a Python `+` and a hash lookup are very different costs).
        </p>

        <div
          className="cx-card"
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.25rem' }}
        >
          <div>
            <label
              className="cx-small cx-muted"
              style={{ display: 'block', marginBottom: '0.35rem' }}
            >
              Input size <strong className="cx-mono">n = {n.toLocaleString()}</strong>
            </label>
            <input
              type="range"
              min={0}
              max={INPUT_SIZES.length - 1}
              step={1}
              value={sizeIdx}
              onChange={(e) => setSizeIdx(Number(e.target.value))}
              style={{ width: '100%' }}
              aria-label="Input size (log scale)"
            />
            <div
              className="cx-row"
              style={{
                justifyContent: 'space-between',
                fontSize: '0.6875rem',
                color: 'var(--cx-fg-muted)',
              }}
            >
              {INPUT_SIZES.map((s) => (
                <span key={s}>{s.toLocaleString()}</span>
              ))}
            </div>
          </div>

          <div className="cx-row" style={{ gap: '0.75rem', flexWrap: 'wrap' }}>
            <label className="cx-small" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              Operations per second
              <input
                type="number"
                min={1}
                step={1}
                value={opsPerSec}
                onChange={(e) => setOpsPerSec(Math.max(1, Number(e.target.value) || 1))}
                className="cx-mono"
                style={{
                  padding: '0.35rem 0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--cx-border)',
                  background: 'var(--cx-bg-muted)',
                  color: 'var(--cx-fg)',
                  fontSize: '0.8125rem',
                  width: '10rem',
                }}
              />
            </label>
            <label className="cx-small" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              Time limit (seconds)
              <input
                type="number"
                min={0.001}
                step={0.1}
                value={timeLimitSec}
                onChange={(e) => setTimeLimitSec(Math.max(0.001, Number(e.target.value) || 1))}
                className="cx-mono"
                style={{
                  padding: '0.35rem 0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--cx-border)',
                  background: 'var(--cx-bg-muted)',
                  color: 'var(--cx-fg)',
                  fontSize: '0.8125rem',
                  width: '7rem',
                }}
              />
            </label>
          </div>

          <p className="cx-small cx-muted" style={{ margin: 0 }}>
            Budget: <strong className="cx-mono">{budget.toLocaleString()}</strong> operations.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="cx-table">
            <thead>
              <tr>
                <th>Notation</th>
                <th>Approx operations</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ cls, log, display, feasible }) => (
                <tr key={cls.notation}>
                  <td className="cx-mono" style={{ fontWeight: 700 }}>
                    {cls.notation}
                  </td>
                  <td className="cx-mono cx-small">{display}</td>
                  <td>
                    <span
                      className="cx-chip"
                      style={{
                        color: feasible ? 'var(--good)' : 'var(--bad)',
                        borderColor: feasible
                          ? 'color-mix(in srgb, var(--good) 40%, var(--cx-border))'
                          : 'color-mix(in srgb, var(--bad) 40%, var(--cx-border))',
                        background: feasible
                          ? 'color-mix(in srgb, var(--good) 12%, var(--cx-bg-muted))'
                          : 'color-mix(in srgb, var(--bad) 12%, var(--cx-bg-muted))',
                      }}
                    >
                      {feasible ? '✓ feasible' : '✗ too slow'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="cx-h2" style={{ marginTop: 0 }}>
          Data Structure Operations
        </h2>
        <p className="cx-lead">
          Average and worst-case costs per operation. A dash means the operation is not applicable
          to that structure.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table className="cx-table">
            <thead>
              <tr>
                <th>Structure</th>
                <th>Access</th>
                <th>Search</th>
                <th>Insert</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {DATA_STRUCTURE_OPS.map((d) => (
                <tr key={d.name}>
                  <td style={{ fontWeight: 600 }}>{d.name}</td>
                  <td className="cx-mono cx-small">
                    {d.access.avg}
                    {d.access.avg !== d.access.worst && (
                      <span className="cx-muted"> / {d.access.worst}</span>
                    )}
                  </td>
                  <td className="cx-mono cx-small">
                    {d.search.avg}
                    {d.search.avg !== d.search.worst && (
                      <span className="cx-muted"> / {d.search.worst}</span>
                    )}
                  </td>
                  <td className="cx-mono cx-small">
                    {d.insert.avg}
                    {d.insert.avg !== d.insert.worst && (
                      <span className="cx-muted"> / {d.insert.worst}</span>
                    )}
                  </td>
                  <td className="cx-mono cx-small">
                    {d.delete.avg}
                    {d.delete.avg !== d.delete.worst && (
                      <span className="cx-muted"> / {d.delete.worst}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
