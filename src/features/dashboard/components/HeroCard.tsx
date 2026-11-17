import { Link } from 'react-router-dom';
import { IconArrowRight, IconPlay } from './Icons';

export interface ResumeInfo {
  problemId: string;
  title: string;
  languageLabel: string;
}

interface HeroCardProps {
  eyebrow: string;
  greeting: string;
  message: string;
  resume: ResumeInfo | null;
  session: { to: string; label: string } | null;
}

export function HeroCard({ eyebrow, greeting, message, resume, session }: HeroCardProps) {
  return (
    <section className="dash-card dash-hero overflow-hidden">
      <div className="p-5 sm:p-7">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <p className="dash-label">{eyebrow}</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{greeting}</h1>
            <p className="mt-2 max-w-xl text-sm text-muted">{message}</p>
            <p className="mt-1 text-xs text-muted">
              Everything here is computed from your saved attempts.
            </p>
          </div>
          {session && (
            <Link to={session.to} className="dash-cta dash-cta--ghost shrink-0">
              <IconPlay width={14} height={14} />
              Resume {session.label.toLowerCase()}
            </Link>
          )}
        </div>

        <div className="mt-5 rounded-xl border border-line bg-surface-2 p-4 sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="dash-label">Continue where you left off</p>
              {resume ? (
                <>
                  <p className="mt-1 truncate text-base font-medium">{resume.title}</p>
                  <p className="mt-0.5 text-xs text-muted">Language: {resume.languageLabel}</p>
                </>
              ) : (
                <p className="mt-1 text-base font-medium">
                  Pick your first problem and spot the bug.
                </p>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {resume ? (
                <Link to={`/problem/${resume.problemId}`} className="dash-cta dash-cta--primary">
                  Continue
                  <IconArrowRight width={14} height={14} />
                </Link>
              ) : (
                <Link to="/practice" className="dash-cta dash-cta--primary">
                  Start a new problem
                  <IconArrowRight width={14} height={14} />
                </Link>
              )}
              <Link to="/practice" className="dash-cta dash-cta--ghost">
                Practice modes
              </Link>
              <Link to="/problems" className="dash-cta dash-cta--ghost">
                Browse problems
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
