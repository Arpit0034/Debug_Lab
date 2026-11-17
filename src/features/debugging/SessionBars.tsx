import { Pause, Play } from 'lucide-react';
import { formatClock } from '../../services/timer/timer';

interface TimerBarProps {
  started: boolean;
  running: boolean;
  elapsed: number;
  limitSec: number;
  locked: boolean;
  onPause: () => void;
  onResume: () => void;
}

/** Per-problem timer. Going over time only changes the colour; nothing is revealed or locked. */
export function TimerBar({ started, running, elapsed, limitSec, locked, onPause, onResume }: TimerBarProps) {
  const remaining = limitSec - elapsed;
  const over = remaining < 0;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-line bg-surface px-4 py-2 text-sm" role="timer" aria-label="Problem timer">
      <span className="text-muted">Elapsed</span>
      <span className="font-mono">{formatClock(elapsed)}</span>
      <span className="text-muted">{over ? 'Over by' : 'Left'}</span>
      <span className={`font-mono ${over ? 'text-warn' : ''}`}>{formatClock(Math.abs(remaining))}</span>
      {started && !running && !locked && <span className="text-xs text-warn">Paused</span>}
      {started && !locked && (
        <button
          type="button"
          onClick={running ? onPause : onResume}
          className="ml-auto flex items-center gap-1 rounded-md border border-line px-2 py-1 text-xs hover:bg-surface-2"
        >
          {running ? <Pause size={12} /> : <Play size={12} />}
          {running ? 'Pause' : 'Resume'}
        </button>
      )}
      {over && !locked && <span className="w-full text-xs text-muted">Time is up, but you can keep going. Nothing is revealed.</span>}
    </div>
  );
}

interface ChallengeBarProps {
  label: string;
  position: number;
  total: number;
  secondsLeft: number | null;
}

export function ChallengeBar({ label, position, total, secondsLeft }: ChallengeBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 rounded-lg border border-accent/40 bg-surface px-4 py-2 text-sm">
      <span className="font-medium">{label}</span>
      <span className="text-muted">
        Question {position} of {total}
      </span>
      {secondsLeft !== null && (
        <span className={`ml-auto font-mono ${secondsLeft <= 0 ? 'text-warn' : ''}`}>
          {secondsLeft <= 0 ? 'Challenge time is up' : `${formatClock(secondsLeft)} left`}
        </span>
      )}
    </div>
  );
}
