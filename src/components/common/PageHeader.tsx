import type { ReactNode } from 'react';

export function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function ComingSoon({ phase, text }: { phase: number; text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-line bg-surface p-8 text-center text-sm text-muted">
      <p className="font-medium text-fg">Arrives in Phase {phase}</p>
      <p className="mt-1">{text}</p>
    </div>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'bad' }) {
  const color =
    tone === 'good' ? 'text-good' : tone === 'warn' ? 'text-warn' : tone === 'bad' ? 'text-bad' : 'text-muted';
  return <span className={`rounded border border-line px-2 py-0.5 text-xs ${color}`}>{children}</span>;
}
