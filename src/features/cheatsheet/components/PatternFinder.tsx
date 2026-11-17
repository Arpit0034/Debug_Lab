import { useMemo, useState } from 'react';
import { PATTERN_SIGNALS, TOP_BUG_PATTERNS } from '../data/patterns';

export interface PatternFinderProps {
  hasConcept: (id: string) => boolean;
  onOpenConcept: (id: string) => void;
}

export function PatternFinder({
  hasConcept,
  onOpenConcept,
}: PatternFinderProps): React.ReactElement {
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();

  const filteredSignals = useMemo(
    () =>
      !q
        ? PATTERN_SIGNALS
        : PATTERN_SIGNALS.filter((s) =>
            (s.signal + ' ' + s.technique).toLowerCase().includes(q),
          ),
    [q],
  );

  const filteredBugs = useMemo(
    () =>
      !q
        ? TOP_BUG_PATTERNS
        : TOP_BUG_PATTERNS.filter((b) =>
            (b.name + ' ' + b.symptom).toLowerCase().includes(q),
          ),
    [q],
  );

  return (
    <div className="cx-stack" style={{ gap: '2rem' }}>
      <div>
        <h2 className="cx-h2" style={{ marginTop: 0 }}>
          Pattern Finder
        </h2>
        <p className="cx-lead">
          Match a problem's phrasing to the technique that solves it. Start from the signal you
          see, not the technique you remember.
        </p>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter signals and bug patterns…"
          aria-label="Filter patterns"
          style={{
            width: '100%',
            maxWidth: '32rem',
            padding: '0.55rem 0.875rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--cx-border)',
            background: 'var(--cx-bg-card)',
            color: 'var(--cx-fg)',
            fontSize: '0.875rem',
            marginTop: '0.75rem',
          }}
        />
      </div>

      <section>
        <h3 className="cx-h3" style={{ marginTop: 0 }}>
          Problem signal → Technique
        </h3>
        {filteredSignals.length === 0 ? (
          <p className="cx-small cx-muted">No signals match your filter.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="cx-table">
              <thead>
                <tr>
                  <th style={{ width: '60%' }}>Signal</th>
                  <th style={{ width: '40%' }}>Technique</th>
                </tr>
              </thead>
              <tbody>
                {filteredSignals.map((s) => {
                  const exists = hasConcept(s.conceptId);
                  return (
                    <tr key={s.id}>
                      <td>{s.signal}</td>
                      <td>
                        {exists ? (
                          <button
                            type="button"
                            onClick={() => onOpenConcept(s.conceptId)}
                            style={{
                              color: 'var(--cx-accent)',
                              fontWeight: 600,
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontSize: 'inherit',
                              textDecoration: 'underline',
                            }}
                          >
                            {s.technique}
                          </button>
                        ) : (
                          <span>{s.technique}</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h3 className="cx-h3" style={{ marginTop: 0 }}>
          Top bug patterns
        </h3>
        {filteredBugs.length === 0 ? (
          <p className="cx-small cx-muted">No bug patterns match your filter.</p>
        ) : (
          <div className="cx-stack" style={{ gap: '0.75rem' }}>
            {filteredBugs.map((b) => (
              <div key={b.id} className="cx-card cx-callout cx-callout--warn" style={{ padding: '0.85rem 1rem' }}>
                <div style={{ marginBottom: '0.35rem', fontWeight: 700 }}>⚠ {b.name}</div>
                <div className="cx-small">{b.symptom}</div>
                {b.relatedConceptIds.length > 0 && (
                  <div
                    className="cx-row"
                    style={{ gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}
                  >
                    {b.relatedConceptIds.map((id) => {
                      const exists = hasConcept(id);
                      return exists ? (
                        <button
                          key={id}
                          type="button"
                          className="cx-btn cx-btn--sm cx-btn--ghost"
                          onClick={() => onOpenConcept(id)}
                        >
                          {id}
                        </button>
                      ) : (
                        <span key={id} className="cx-chip" style={{ textTransform: 'none', letterSpacing: 0 }}>
                          {id}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
