import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { problems } from '../../data/problemRegistry';
import { useApp } from '../../app/providers/context';
import { PageHeader } from '../../components/common/PageHeader';
import { buildQueue } from '../../services/practice/queue';
import { duration } from '../../utils/format';
import { Timer, Play, Square, AlertCircle } from 'lucide-react';

const selectClass = 'ui-input w-full sm:w-32 appearance-none bg-surface-2 cursor-pointer';

export function TimedPage() {
  const { session, setSession, progress, bookmarks } = useApp();
  const navigate = useNavigate();
  const max = Math.min(10, problems.length);
  const [count, setCount] = useState(Math.min(5, max));
  const [minutes, setMinutes] = useState(30);

  const active = session?.mode === 'timed' ? session : null;

  if (!active) {
    const start = () => {
      const queue = buildQueue('timed', { problems, attempts: progress.attempts, bookmarks }, { count });
      if (queue.length === 0) return;
      setSession({ mode: 'timed', label: 'Timed challenge', queue, index: 0, startedAt: Date.now(), totalSec: minutes * 60 });
      navigate(`/problem/${queue[0]}`);
    };
    
    return (
      <div className="space-y-6">
        <PageHeader title="Timed Challenge" subtitle="A series of problems against one fixed total time. Topics are hidden." />
        
        <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
          <div className="ui-card p-6 space-y-6">
            <h2 className="font-medium">Challenge Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-muted">Number of problems</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[3, 5, 10].filter(n => n <= max).map(n => (
                    <button key={n} onClick={() => setCount(n)} className={`ui-chip ${count === n ? 'border-accent text-accent bg-accent/10' : ''}`}>
                      {n}
                    </button>
                  ))}
                </div>
                <select className={selectClass} value={count} onChange={(e) => setCount(Number(e.target.value))} aria-label="Custom problem count">
                  {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n} problems</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-muted">Total time</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[15, 30, 45].map(m => (
                    <button key={m} onClick={() => setMinutes(m)} className={`ui-chip ${minutes === m ? 'border-accent text-accent bg-accent/10' : ''}`}>
                      {m}m
                    </button>
                  ))}
                </div>
                <select className={selectClass} value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} aria-label="Custom duration">
                  {[10, 15, 20, 30, 45, 60].map((m) => (
                    <option key={m} value={m}>{m} minutes</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="ui-card p-6 flex flex-col justify-between bg-surface-2/50 border-dashed">
            <div>
              <h2 className="font-medium mb-4 flex items-center gap-2">
                <AlertCircle size={18} className="text-accent" />
                Challenge Rules
              </h2>
              <ul className="space-y-3 text-sm text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  The clock keeps running even if you leave the page.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  When time runs out, nothing is revealed and you can keep going.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent mt-0.5">•</span>
                  Topics and difficulties are hidden until you submit an answer.
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <button type="button" onClick={start} disabled={problems.length === 0} className="ui-btn ui-btn-primary w-full py-3 text-base">
                <Play size={18} className="mr-2" />
                Start challenge
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const results = active.queue.map((id) => {
    const mine = progress.attempts.filter((a) => a.problemId === id && a.timestamp >= active.startedAt);
    return { id, attempt: mine[mine.length - 1] };
  });
  const done = results.filter((r) => r.attempt);
  const solved = done.filter((r) => r.attempt!.bugResult === 'correct').length;
  const left = Math.floor((active.totalSec ?? 0) - (Date.now() - active.startedAt) / 1000);

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Timed Challenge" />
      
      <div className="ui-card p-6 flex flex-col sm:flex-row items-center justify-between gap-6 bg-surface-2/30">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Timer size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-muted">Time Remaining</div>
            <div className="text-3xl font-semibold tabular-nums tracking-tight">
              {left > 0 ? duration(left) : "Time's up"}
            </div>
          </div>
        </div>
        
        <div className="flex gap-6 text-center">
          <div>
            <div className="text-xs text-muted uppercase tracking-wider font-semibold">Answered</div>
            <div className="text-xl font-semibold tabular-nums">{done.length} / {active.queue.length}</div>
          </div>
          <div>
            <div className="text-xs text-muted uppercase tracking-wider font-semibold">Solved</div>
            <div className="text-xl font-semibold tabular-nums text-good">{solved}</div>
          </div>
        </div>
      </div>

      <div className="ui-card overflow-hidden">
        <ul className="divide-y divide-line">
          {results.map((r, i) => (
            <li key={r.id} className="flex items-center justify-between px-5 py-4">
              <span className="font-medium text-sm">Question {i + 1}</span>
              <span className={`text-sm ${r.attempt?.bugResult === 'correct' ? 'text-good' : r.attempt ? 'text-bad' : 'text-muted'}`}>
                {!r.attempt ? 'Not answered' : r.attempt.bugResult === 'correct' ? 'Solved' : r.attempt.bugResult === 'partial' ? 'Partially correct' : 'Incorrect'}
                {r.attempt ? ` · ${duration(r.attempt.timeSpentSec)}` : ''}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-3">
        {done.length < active.queue.length && (
          <Link to={`/problem/${active.queue[Math.min(active.index, active.queue.length - 1)]}`} className="ui-btn ui-btn-primary px-6 py-2.5">
            Continue challenge
          </Link>
        )}
        <button type="button" onClick={() => setSession(null)} className="ui-btn ui-btn-outline px-6 py-2.5">
          <Square size={16} className="mr-2" />
          End challenge
        </button>
      </div>
    </div>
  );
}
