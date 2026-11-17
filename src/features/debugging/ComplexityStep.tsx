import { useState } from 'react';
import { Check, X } from 'lucide-react';
import type { ComplexityAttempt } from '../../types/progress';
import type { Complexity } from '../../types/problem';

const OPTIONS = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2^n)', 'O(n!)'];
const CUSTOM = '__custom__';

function Field({
  label,
  value,
  custom,
  onValue,
  onCustom,
}: {
  label: string;
  value: string;
  custom: string;
  onValue: (v: string) => void;
  onCustom: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs text-muted">
        {label}
        <select
          className="mt-1 block w-full rounded-md border border-line bg-bg px-3 py-2 text-sm text-fg"
          value={value}
          onChange={(e) => onValue(e.target.value)}
        >
          <option value="">Select…</option>
          {OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
          <option value={CUSTOM}>Custom expression…</option>
        </select>
      </label>
      {value === CUSTOM && (
        <input
          className="block w-full rounded-md border border-line bg-bg px-3 py-2 text-sm"
          placeholder="e.g. O(V + E)"
          value={custom}
          onChange={(e) => onCustom(e.target.value)}
          aria-label={`${label} custom expression`}
        />
      )}
    </div>
  );
}

function Row({ label, yours, correct, ok }: { label: string; yours: string; correct: string; ok: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-line px-3 py-2 text-sm">
      <span className="text-muted">{label}</span>
      <span className="flex items-center gap-3">
        <span className={ok ? 'text-good' : 'text-bad'}>{yours || '-'}</span>
        {!ok && <span className="text-muted">correct: {correct}</span>}
        {ok ? <Check size={16} className="text-good" /> : <X size={16} className="text-bad" />}
      </span>
    </div>
  );
}

interface Props {
  correct: Complexity;
  done?: ComplexityAttempt;
  onSubmit: (time: string, space: string) => void;
}

/** Separate step shown after the bug result. Shows only the correct values, never an explanation. */
export function ComplexityStep({ correct, done, onSubmit }: Props) {
  const [time, setTime] = useState('');
  const [space, setSpace] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [customSpace, setCustomSpace] = useState('');

  const resolve = (v: string, c: string) => (v === CUSTOM ? c.trim() : v);
  const t = resolve(time, customTime);
  const s = resolve(space, customSpace);

  return (
    <section className="rounded-lg border border-line bg-surface p-5">
      <h2 className="text-sm font-medium">Complexity of the correct solution</h2>
      {done ? (
        <div className="mt-3 space-y-2" role="status">
          <Row label="Time" yours={done.time} correct={correct.time} ok={done.timeCorrect} />
          <Row label="Space" yours={done.space} correct={correct.space} ok={done.spaceCorrect} />
        </div>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">Optional. Pick or type both, then check.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Time complexity" value={time} custom={customTime} onValue={setTime} onCustom={setCustomTime} />
            <Field label="Space complexity" value={space} custom={customSpace} onValue={setSpace} onCustom={setCustomSpace} />
          </div>
          <button
            type="button"
            disabled={!t || !s}
            onClick={() => onSubmit(t, s)}
            className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Check complexity
          </button>
        </>
      )}
    </section>
  );
}
