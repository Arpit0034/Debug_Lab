import { useMemo } from 'react';
import { problems } from '../../data/problemRegistry';
import { useApp } from '../../app/providers/context';
import {
  byDifficulty,
  byLanguage,
  byTopic,
  computeOverview,
  weeklyActivity,
} from '../../services/analytics/analytics';
import { LANGUAGE_LABELS } from '../../types/problem';
import { duration, pct } from '../../utils/format';
import { HeroCard, type ResumeInfo } from './components/HeroCard';
import { KpiCard } from './components/KpiCard';
import { MiniBar } from './components/MiniBar';
import { ProgressRing } from './components/ProgressRing';
import { WeeklyActivity } from './components/WeeklyActivity';
import { TopicFocus } from './components/TopicFocus';
import { AccuracyBreakdown } from './components/AccuracyBreakdown';
import { EmptyState } from './components/EmptyState';
import { IconBolt, IconCheck, IconClock, IconList, IconTarget } from './components/Icons';

const DAY_MS = 86_400_000;

export function DashboardPage() {
  const { progress, session } = useApp();
  const now = Date.now();
  const attempts = progress.attempts;

  const o = useMemo(() => computeOverview(attempts, problems, now), [attempts, now]);
  const topics = useMemo(() => byTopic(attempts, problems), [attempts]);
  const diff = useMemo(() => byDifficulty(attempts, problems), [attempts]);
  const lang = useMemo(() => byLanguage(attempts), [attempts]);
  const week = useMemo(() => weeklyActivity(attempts, now), [attempts, now]);

  const hasAttempts = attempts.length > 0;
  const weekTotal = useMemo(() => week.reduce((sum, d) => sum + d.count, 0), [week]);
  const lastAttemptTs = useMemo(
    () => attempts.reduce((max, a) => (a.timestamp > max ? a.timestamp : max), 0),
    [attempts],
  );
  const daysSinceLast = lastAttemptTs ? Math.floor((now - lastAttemptTs) / DAY_MS) : null;

  const resumeProblem = useMemo<ResumeInfo | null>(() => {
    const lv = progress.lastVisited;
    if (!lv) return null;
    const found = problems.find((p) => p.id === lv.problemId);
    if (!found) return null;
    const maybeTitled = found as { title?: string };
    return {
      problemId: found.id,
      title: maybeTitled.title ?? found.id,
      languageLabel: LANGUAGE_LABELS[lv.language],
    };
  }, [progress.lastVisited]);

  const sessionLink = useMemo(() => {
    if (!session) return null;
    const to =
      session.mode === 'timed' ? '/timed' : `/problem/${session.queue[session.index]}`;
    return { to, label: session.label };
  }, [session]);

  const { eyebrow, greeting, message } = useMemo(() => {
    if (!hasAttempts) {
      return {
        eyebrow: 'Welcome',
        greeting: 'Welcome to your debugging lab',
        message:
          'Spot bugs, learn from every attempt, and watch your accuracy grow. Start with a single problem.',
      };
    }
    if (o.currentStreak > 0) {
      return {
        eyebrow: 'Active streak',
        greeting: `You're on a ${o.currentStreak}-day streak`,
        message: 'Keep the momentum going — one more bug today keeps your streak alive.',
      };
    }
    if (daysSinceLast !== null && daysSinceLast >= 2) {
      return {
        eyebrow: 'Welcome back',
        greeting: 'Good to see you again',
        message: `It has been ${daysSinceLast} days since your last attempt. Ease back in with a problem you already started.`,
      };
    }
    return {
      eyebrow: 'Dashboard',
      greeting: 'Ready for another bug?',
      message: 'Everything here is computed from your saved attempts.',
    };
  }, [hasAttempts, o.currentStreak, daysSinceLast]);

  const solvedRatio = o.totalProblems > 0 ? o.solvedProblems / o.totalProblems : 0;
  const accuracyValue = o.accuracy ?? 0;
  const streakRatio = Math.min(1, o.currentStreak / 7);

  return (
    <div className="space-y-5 sm:space-y-6">
      <HeroCard
        eyebrow={eyebrow}
        greeting={greeting}
        message={message}
        resume={resumeProblem}
        session={sessionLink}
      />

      <section aria-label="Key statistics">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <KpiCard
            label="Solved"
            value={`${o.solvedProblems}`}
            hint={`of ${o.totalProblems} in the bank`}
            icon={<IconCheck />}
            accessory={<MiniBar value={solvedRatio} tone="good" />}
            delay={1}
          />
          <KpiCard
            label="Attempted"
            value={`${o.attemptedProblems}`}
            hint={`${o.totalAttempts} attempts · ${o.incorrectAttempts} incorrect`}
            icon={<IconList />}
            delay={2}
          />
          <KpiCard
            label="Accuracy"
            value={pct(o.accuracy)}
            hint={`First try: ${pct(o.firstAttemptAccuracy)}`}
            icon={<IconTarget />}
            accessory={
              <MiniBar
                value={accuracyValue}
                tone={accuracyValue >= 0.7 ? 'good' : accuracyValue >= 0.4 ? 'warn' : 'bad'}
              />
            }
            delay={3}
          />
          <KpiCard
            label="Avg debug time"
            value={duration(o.avgDebugSec)}
            hint={`${o.withinTimeCount} solved within time`}
            icon={<IconClock />}
            delay={4}
          />
          <KpiCard
            label="Current streak"
            value={`${o.currentStreak}d`}
            hint={`Best ${o.longestStreak}d`}
            icon={<IconBolt />}
            accessory={<MiniBar value={streakRatio} tone="accent" />}
            delay={5}
          />
        </div>
      </section>

      {hasAttempts ? (
        <div className="grid gap-4 lg:grid-cols-12">
          <section className="dash-card flex flex-col items-center justify-center p-5 text-center lg:col-span-4">
            <h2 className="dash-label">Overall completion</h2>
            <div className="mt-3">
              <ProgressRing
                value={solvedRatio}
                label={pct(solvedRatio)}
                sublabel={`${o.solvedProblems} / ${o.totalProblems} solved`}
                ariaLabel={`${o.solvedProblems} of ${o.totalProblems} problems solved`}
              />
            </div>
            <p className="mt-3 text-xs text-muted">
              {o.attemptedProblems} attempted ·{' '}
              {Math.max(0, o.totalProblems - o.attemptedProblems)} untouched
            </p>
          </section>

          <WeeklyActivity data={week} total={weekTotal} />

          <TopicFocus topics={topics} />

          <AccuracyBreakdown
            difficulty={diff}
            language={lang}
            languageLabels={LANGUAGE_LABELS}
          />
        </div>
      ) : (
        <EmptyState totalProblems={o.totalProblems} />
      )}
    </div>
  );
}
