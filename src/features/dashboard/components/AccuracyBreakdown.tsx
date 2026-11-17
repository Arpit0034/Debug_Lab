import type { AccuracyRow } from '../../../services/analytics/analytics';
import type { Language } from '../../../types/problem';
import { pct } from '../../../utils/format';

function Row({ row, label }: { row: AccuracyRow; label: string }) {
  const has = row.attempts > 0 && row.accuracy !== null;
  const acc = row.accuracy ?? 0;
  const width = has ? Math.round(Math.max(0, Math.min(1, acc)) * 100) : 0;
  const tone = !has
    ? 'bg-surface-2'
    : acc >= 0.7
      ? 'bg-good'
      : acc >= 0.4
        ? 'bg-warn'
        : 'bg-bad';
  const textTone = !has
    ? 'text-muted'
    : acc >= 0.7
      ? 'text-good'
      : acc >= 0.4
        ? 'text-warn'
        : 'text-bad';

  return (
    <li className="space-y-1.5">
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="min-w-0 truncate font-medium">{label}</span>
        <span className={`shrink-0 text-xs tabular-nums ${textTone}`}>
          {has ? pct(row.accuracy) : 'No attempts'}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        <div className={`dash-bar-fill h-full rounded-full ${tone}`} style={{ width: `${width}%` }} />
      </div>
      {has && (
        <div className="text-[11px] text-muted">
          {row.attempts} attempt{row.attempts === 1 ? '' : 's'}
        </div>
      )}
    </li>
  );
}

interface AccuracyBreakdownProps {
  difficulty: AccuracyRow[];
  language: AccuracyRow[];
  languageLabels: Record<Language, string>;
}

export function AccuracyBreakdown({
  difficulty,
  language,
  languageLabels,
}: AccuracyBreakdownProps) {
  return (
    <section className="dash-card p-5 lg:col-span-5">
      <h2 className="dash-label">Accuracy breakdown</h2>
      <p className="mt-1 text-sm text-muted">Correct submissions vs. attempts.</p>

      <div className="mt-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          By difficulty
        </h3>
        <ul className="space-y-3">
          {difficulty.map((r) => (
            <Row key={`d-${r.key}`} row={r} label={r.key} />
          ))}
        </ul>
      </div>

      <div className="mt-5 border-t border-line pt-4">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          By language
        </h3>
        <ul className="space-y-3">
          {language.map((r) => (
            <Row key={`l-${r.key}`} row={r} label={languageLabels[r.key as Language] ?? r.key} />
          ))}
        </ul>
      </div>
    </section>
  );
}
