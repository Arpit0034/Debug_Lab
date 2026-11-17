// Palette and typography for the visualizer. Uses the app's CSS tokens so themes work.
export const VIS = {
  bg: 'var(--surface)',
  bgAlt: 'var(--surface-2)',
  fg: 'var(--fg)',
  muted: 'var(--muted)',
  line: 'var(--line)',
  accent: 'var(--accent)',
  good: 'var(--good)',
  bad: 'var(--bad)',
  warn: 'var(--warn)',
};

export const FS = {
  xs: 10,
  sm: 11,
  base: 12,
  md: 13,
  lg: 14,
  xl: 16,
} as const;

export const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
export const SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
