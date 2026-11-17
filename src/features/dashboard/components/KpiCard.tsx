import type { ReactNode } from 'react';

export function KpiCard({
  label,
  value,
  hint,
  icon,
  accessory,
  delay,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: ReactNode;
  accessory?: ReactNode;
  delay?: 1 | 2 | 3 | 4 | 5;
}) {
  return (
    <div
      className={`dash-card dash-card--hover dash-fade-in p-4 ${delay ? `dash-delay-${delay}` : ''}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="dash-label">{label}</span>
        <span className="text-muted">{icon}</span>
      </div>
      <div className="dash-kpi-value mt-2 text-2xl font-semibold leading-none">{value}</div>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
      {accessory && <div className="mt-3">{accessory}</div>}
    </div>
  );
}
