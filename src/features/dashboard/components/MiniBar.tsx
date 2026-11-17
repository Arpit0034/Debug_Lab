export type MiniBarTone = 'accent' | 'good' | 'warn' | 'bad';

const TONE_BG: Record<MiniBarTone, string> = {
  accent: 'bg-accent',
  good: 'bg-good',
  warn: 'bg-warn',
  bad: 'bg-bad',
};

export function MiniBar({ value, tone = 'accent' }: { value: number; tone?: MiniBarTone }) {
  const clamped = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
      <div
        className={`dash-bar-fill h-full rounded-full ${TONE_BG[tone]}`}
        style={{ width: `${Math.round(clamped * 100)}%` }}
      />
    </div>
  );
}
