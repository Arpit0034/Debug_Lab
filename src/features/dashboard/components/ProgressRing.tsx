import type { CSSProperties } from 'react';

interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  label: string;
  sublabel?: string;
  ariaLabel: string;
}

export function ProgressRing({
  value,
  size = 148,
  stroke = 12,
  label,
  sublabel,
  ariaLabel,
}: ProgressRingProps) {
  const clamped = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);

  const ringStyle = {
    strokeDashoffset: offset,
    '--dash-ring-circ': `${circumference}`,
    '--dash-ring-offset': `${offset}`,
  } as CSSProperties;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={ariaLabel}
        className="-rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={stroke}
        />
        <circle
          className="dash-ring-fill"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={ringStyle}
        />
      </svg>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center text-center"
        aria-hidden="true"
      >
        <span className="dash-kpi-value text-3xl font-semibold leading-none">{label}</span>
        {sublabel && <span className="mt-1 text-xs text-muted">{sublabel}</span>}
      </div>
    </div>
  );
}
