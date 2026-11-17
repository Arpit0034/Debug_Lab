export const pct = (v: number | null): string => (v === null ? '-' : `${Math.round(v * 100)}%`);

export function duration(sec: number | null): string {
  if (sec === null) return '-';
  const s = Math.round(sec);
  return s >= 60 ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s` : `${s}s`;
}
