import { Link } from 'react-router-dom';
import { IconArrowRight } from './Icons';

export function EmptyState({ totalProblems }: { totalProblems: number }) {
  return (
    <section className="dash-card dash-fade-in p-6 sm:p-10">
      <div className="flex flex-col items-center text-center">
        <svg
          width="140"
          height="120"
          viewBox="0 0 140 120"
          role="img"
          aria-label="A magnifying glass inspecting a line of code, ready to find a bug"
          className="text-accent"
        >
          <defs>
            <linearGradient id="dash-empty-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.22" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <rect
            x="4"
            y="4"
            width="132"
            height="112"
            rx="14"
            fill="url(#dash-empty-grad)"
            stroke="var(--line)"
          />
          <rect x="20" y="26" width="70" height="6" rx="3" fill="var(--surface-2)" />
          <rect x="20" y="42" width="100" height="6" rx="3" fill="var(--surface-2)" />
          <rect x="20" y="58" width="54" height="6" rx="3" fill="var(--surface-2)" />
          <rect x="20" y="74" width="86" height="6" rx="3" fill="var(--surface-2)" />
          <circle cx="98" cy="70" r="18" fill="none" stroke="currentColor" strokeWidth="3" />
          <path d="M111 83l10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          <circle cx="98" cy="70" r="4" fill="currentColor" />
        </svg>

        <h2 className="mt-5 text-lg font-semibold">Your lab is ready — no attempts yet</h2>
        <p className="mt-2 max-w-md text-sm text-muted">
          The bank has {totalProblems} buggy problems waiting. Solve one to light up your stats,
          streaks, and topic insights.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Link to="/problems" className="dash-cta dash-cta--primary">
            Start your first problem
            <IconArrowRight width={14} height={14} />
          </Link>
        </div>
        <p className="mt-3 text-xs text-muted">
          Tip: pick “Random” or “Topic” practice mode to get matched instantly.
        </p>
      </div>
    </section>
  );
}
