// Playback toolbar and scrubber.
interface Props {
  index: number;
  count: number;
  playing: boolean;
  speed: number;
  canJump: boolean;
  onIndex: (i: number) => void;
  onPlayPause: () => void;
  onSpeed: (s: number) => void;
  onJump: () => void;
}

const SPEEDS = [0.5, 1, 2, 4];

export function Controls({ index, count, playing, speed, canJump, onIndex, onPlayPause, onSpeed, onJump }: Props): React.ReactElement {
  const max = Math.max(0, count - 1);
  const cur = count > 0 ? Math.min(index, max) : 0;

  const btn = 'rounded border border-line px-2 py-1 text-xs hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-40';

  return (
    <div
      className="space-y-2 rounded-md border border-line bg-surface-2 p-2"
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); onIndex(Math.max(0, cur - 1)); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); onIndex(Math.min(max, cur + 1)); }
      }}
      tabIndex={0}
    >
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={btn} disabled={count === 0 || cur === 0} onClick={() => onIndex(0)}>First</button>
        <button type="button" className={btn} disabled={count === 0 || cur === 0} onClick={() => onIndex(cur - 1)}>Previous</button>
        <button type="button" className={btn} disabled={count === 0} onClick={onPlayPause}>{playing ? 'Pause' : 'Play'}</button>
        <button type="button" className={btn} disabled={count === 0 || cur >= max} onClick={() => onIndex(cur + 1)}>Next</button>
        <button type="button" className={btn} disabled={count === 0 || cur >= max} onClick={() => onIndex(max)}>Last</button>
        <button type="button" className={btn} disabled={!canJump} onClick={onJump}>Jump to bug</button>
        <span className="ml-auto text-xs text-muted">Step {count > 0 ? cur + 1 : 0} / {count}</span>
        <span className="ml-2 text-xs text-muted opacity-60">← → keys</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={0}
          max={max}
          value={cur}
          disabled={count === 0}
          onChange={(e) => onIndex(Number(e.target.value))}
          className="flex-1"
          aria-label="Step scrubber"
        />
        <span className="text-xs text-muted">speed</span>
        {SPEEDS.map((s) => (
          <button
            key={s}
            type="button"
            className={'rounded border px-1.5 py-0.5 text-xs ' + (speed === s ? 'border-accent text-accent' : 'border-line text-muted hover:text-fg')}
            onClick={() => onSpeed(s)}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
