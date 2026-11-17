import { useState, useMemo } from 'react';
import { problems } from '../../data/problemRegistry';
import { useApp } from '../../app/providers/context';
import { PageHeader } from '../../components/common/PageHeader';
import {
  byLanguage, byTopic, byDifficulty, complexityStats, computeOverview, fixStats, missedCategories, weeklyActivity, dayIndex,
} from '../../services/analytics/analytics';
import { LANGUAGE_LABELS, type Language } from '../../types/problem';
import { duration, pct } from '../../utils/format';

import { RangeToggle, type RangeOption } from '../../components/analytics/RangeToggle';
import { SummaryStrip, type MetricData } from '../../components/analytics/SummaryStrip';
import { MainChart, type ChartPoint } from '../../components/analytics/MainChart';
import { TopicBreakdown } from '../../components/analytics/TopicBreakdown';
import { DonutCard, type DonutDatum } from '../../components/analytics/DonutCard';
import { InsightsCard } from '../../components/analytics/InsightsCard';

const DAY = 86_400_000;

export function AnalyticsPage() {
  const { progress } = useApp();
  const now = Date.now();
  const [range, setRange] = useState<RangeOption>('30d');

  const filteredA = useMemo(() => {
    if (range === 'all') return progress.attempts;
    const days = range === '7d' ? 7 : 30;
    const cutoff = now - days * DAY;
    return progress.attempts.filter((a) => a.timestamp >= cutoff);
  }, [progress.attempts, range, now]);

  const weeklyA = useMemo(() => weeklyActivity(progress.attempts, now), [progress.attempts, now]);

  const timeSeries = useMemo<ChartPoint[]>(() => {
    if (filteredA.length === 0) return [];
    
    const byDay = new Map<number, { attempts: number; correct: number }>();
    for (const a of filteredA) {
      const idx = dayIndex(a.timestamp);
      if (!byDay.has(idx)) byDay.set(idx, { attempts: 0, correct: 0 });
      const d = byDay.get(idx)!;
      d.attempts++;
      if (a.bugResult === 'correct') d.correct++;
    }

    const points: ChartPoint[] = [];
    
    if (range === 'all') {
      const sortedIdx = Array.from(byDay.keys()).sort((a, b) => a - b);
      for (const idx of sortedIdx) {
        const data = byDay.get(idx)!;
        const sample = filteredA.find((a) => dayIndex(a.timestamp) === idx)!;
        const d = new Date(sample.timestamp);
        points.push({
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          attempts: data.attempts,
          accuracy: data.attempts > 0 ? Math.round((data.correct / data.attempts) * 100) : null,
        });
      }
    } else {
      const days = range === '7d' ? 7 : 30;
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const idx = dayIndex(d.getTime());
        const data = byDay.get(idx) || { attempts: 0, correct: 0 };
        points.push({
          date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          attempts: data.attempts,
          accuracy: data.attempts > 0 ? Math.round((data.correct / data.attempts) * 100) : null,
        });
      }
    }
    return points;
  }, [filteredA, range, now]);

  const o = useMemo(() => computeOverview(filteredA, problems, now), [filteredA, now]);
  const cx = useMemo(() => complexityStats(filteredA), [filteredA]);
  const fixes = useMemo(() => fixStats(filteredA), [filteredA]);
  const missed = useMemo(() => missedCategories(filteredA, problems), [filteredA]);

  const metrics = useMemo<MetricData[]>(() => {
    let deltaAccuracy = null;
    let deltaAttempts = null;

    if (range !== 'all') {
      const days = range === '7d' ? 7 : 30;
      const prevEnd = now - days * DAY;
      const prevStart = prevEnd - days * DAY;
      const prevA = progress.attempts.filter((a) => a.timestamp > prevStart && a.timestamp <= prevEnd);
      
      const prevCorrect = prevA.filter((a) => a.bugResult === 'correct').length;
      const prevAcc = prevA.length > 0 ? prevCorrect / prevA.length : null;
      const currCorrect = filteredA.filter((a) => a.bugResult === 'correct').length;
      const currAcc = filteredA.length > 0 ? currCorrect / filteredA.length : null;

      if (prevAcc !== null && currAcc !== null) {
        const d = Math.round((currAcc - prevAcc) * 100);
        deltaAccuracy = { value: `${d > 0 ? '+' : ''}${d} pts`, tone: d > 0 ? 'good' : d < 0 ? 'bad' : 'neutral' } as const;
      }
      if (prevA.length > 0) {
        const d = filteredA.length - prevA.length;
        deltaAttempts = { value: `${d > 0 ? '+' : ''}${d}`, tone: d > 0 ? 'good' : d < 0 ? 'bad' : 'neutral' } as const;
      }
    }

    return [
      { label: 'Attempts', value: String(filteredA.length), delta: deltaAttempts },
      { label: 'Accuracy', value: pct(o.accuracy), delta: deltaAccuracy },
      { label: 'First-try accuracy', value: pct(o.firstAttemptAccuracy), hint: 'First try on each problem' },
      { label: 'Solved', value: String(o.solvedProblems), hint: `of ${o.attemptedProblems} attempted` },
      { label: 'Avg debug time', value: duration(o.avgDebugSec), hint: 'Solved attempts only' },
      { label: 'Complexity (T/S)', value: `${pct(cx.time)} / ${pct(cx.space)}`, hint: `${cx.submitted} submitted` },
    ];
  }, [filteredA, range, now, progress.attempts, o, cx]);

  const insights = useMemo(() => {
    const list: string[] = [];
    
    const topics = byTopic(filteredA, problems).filter((t) => t.attempts > 0);
    if (topics.length > 0) {
      const weakest = [...topics].sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0))[0];
      list.push(`Your weakest topic is ${weakest.topic} with ${pct(weakest.accuracy)} accuracy.`);
    }

    const langs = byLanguage(filteredA).filter((l) => l.attempts > 0);
    if (langs.length > 0) {
      const best = [...langs].sort((a, b) => (b.accuracy ?? 0) - (a.accuracy ?? 0))[0];
      list.push(`You are most accurate in ${LANGUAGE_LABELS[best.key as Language]} (${pct(best.accuracy)}).`);
    }

    if (missed.length > 0) {
      list.push(`Focus on ${missed[0].category} bugs, which you missed ${missed[0].count} time${missed[0].count === 1 ? '' : 's'}.`);
    }

    if (range !== 'all') {
      const days = range === '7d' ? 7 : 30;
      const prevEnd = now - days * DAY;
      const prevStart = prevEnd - days * DAY;
      const prevA = progress.attempts.filter((a) => a.timestamp > prevStart && a.timestamp <= prevEnd);
      const prevCorrect = prevA.filter((a) => a.bugResult === 'correct').length;
      const prevAcc = prevA.length > 0 ? prevCorrect / prevA.length : null;
      const currCorrect = filteredA.filter((a) => a.bugResult === 'correct').length;
      const currAcc = filteredA.length > 0 ? currCorrect / filteredA.length : null;

      if (prevAcc !== null && currAcc !== null) {
        const diff = Math.round((currAcc - prevAcc) * 100);
        if (diff > 0) list.push(`Accuracy improved by ${diff} pts compared to the previous ${days} days.`);
        else if (diff < 0) list.push(`Accuracy dropped by ${Math.abs(diff)} pts compared to the previous ${days} days.`);
      }
    }

    const weeklyTotal = weeklyA.reduce((sum, d) => sum + d.count, 0);
    if (weeklyTotal > 0) {
      list.push(`You logged ${weeklyTotal} attempt${weeklyTotal === 1 ? '' : 's'} in the last 7 days.`);
    }

    return list;
  }, [filteredA, range, now, progress.attempts, weeklyA, missed]);

  const diffData = useMemo<DonutDatum[]>(() => {
    return byDifficulty(filteredA, problems)
      .filter((d) => d.attempts > 0)
      .map((d) => ({
        name: d.key,
        value: d.attempts,
        color: d.key === 'Easy' ? 'var(--good)' : d.key === 'Medium' ? 'var(--warn)' : 'var(--bad)',
      }));
  }, [filteredA]);

  const langData = useMemo<DonutDatum[]>(() => {
    return byLanguage(filteredA)
      .filter((l) => l.attempts > 0)
      .map((l) => ({
        name: LANGUAGE_LABELS[l.key as Language],
        value: l.attempts,
        color: l.key === 'python' ? 'var(--accent)' : l.key === 'java' ? 'var(--warn)' : 'var(--bad)',
      }));
  }, [filteredA]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader title="Progress & Analytics" subtitle={`Based on ${progress.attempts.length} total attempt${progress.attempts.length === 1 ? '' : 's'}`} />
        <RangeToggle value={range} onChange={setRange} />
      </div>

      {progress.attempts.length === 0 ? (
        <div className="ana-card p-8 text-center">
          <svg width="160" height="120" viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto text-accent mb-4">
            <rect x="20" y="20" width="120" height="80" rx="8" fill="var(--surface-2)" stroke="var(--line)" strokeWidth="2"/>
            <path d="M20 40H140" stroke="var(--line)" strokeWidth="2"/>
            <circle cx="32" cy="30" r="3" fill="var(--muted)"/>
            <circle cx="44" cy="30" r="3" fill="var(--muted)"/>
            <circle cx="56" cy="30" r="3" fill="var(--muted)"/>
            <rect x="40" y="55" width="40" height="6" rx="3" fill="var(--muted)" opacity="0.5"/>
            <rect x="40" y="70" width="60" height="6" rx="3" fill="var(--muted)" opacity="0.5"/>
            <rect x="40" y="85" width="30" height="6" rx="3" fill="var(--muted)" opacity="0.5"/>
            <circle cx="120" cy="60" r="20" fill="var(--surface)" stroke="currentColor" strokeWidth="3"/>
            <path d="M134 74L144 84" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
            <path d="M120 50V70M110 60H130" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
          </svg>
          <p className="text-sm text-muted">No attempts yet. Solve a problem and your metrics will be calculated here from what you actually did.</p>
        </div>
      ) : filteredA.length === 0 ? (
        <div className="ana-card p-8 text-center text-sm text-muted">
          No attempts in this time range. Try selecting 'All' or practice more.
        </div>
      ) : (
        <>
          <SummaryStrip metrics={metrics} />
          <InsightsCard insights={insights} />
          <MainChart data={timeSeries} />
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <TopicBreakdown topics={byTopic(filteredA, problems)} />
              
              <div className="ana-card p-5">
                <h3 className="text-sm font-medium mb-3">Most missed bug categories</h3>
                {missed.length === 0 ? (
                  <p className="text-sm text-muted">You have not missed any problems yet.</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {missed.map((m) => (
                      <li key={m.category} className="flex justify-between border-b border-line pb-2 last:border-0 last:pb-0">
                        <span>{m.category}</span>
                        <span className="tabular-nums text-muted">{m.count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
                <DonutCard title="By Language" data={langData} />
                <DonutCard title="By Difficulty" data={diffData} />
              </div>

              <div className="ana-card p-5">
                <h3 className="text-sm font-medium mb-3">Corrected lines</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted">Verified by text match</dt>
                    <dd className="tabular-nums">{fixes.verified}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Self-verified</dt>
                    <dd className="tabular-nums">{fixes.selfVerified}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted">Not verified</dt>
                    <dd className="tabular-nums">{fixes.unverified}</dd>
                  </div>
                </dl>
                <p className="mt-3 text-xs text-muted">Self-verified fixes are your own call and are kept separate so they never inflate the verified count.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
