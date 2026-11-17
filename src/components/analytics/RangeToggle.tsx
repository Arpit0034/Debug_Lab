export type RangeOption = '7d' | '30d' | 'all';

export function RangeToggle({ value, onChange }: { value: RangeOption; onChange: (v: RangeOption) => void }) {
  const options: { value: RangeOption; label: string }[] = [
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: 'all', label: 'All' },
  ];

  return (
    <div className="flex rounded-lg border border-line bg-surface p-1" role="radiogroup" aria-label="Time range">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              active ? 'bg-surface-2 text-fg shadow-sm' : 'text-muted hover:text-fg'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
