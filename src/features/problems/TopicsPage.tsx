import { Link } from 'react-router-dom';
import { problems } from '../../data/problemRegistry';
import { TOPICS } from '../../types/problem';
import { PageHeader } from '../../components/common/PageHeader';
import { useApp } from '../../app/providers/context';
import { statusOf } from '../../utils/status';
import { ChevronRight } from 'lucide-react';

export function TopicsPage() {
  const { progress } = useApp();
  
  const counts = new Map<string, { total: number; solved: number }>();
  
  problems.forEach((p) => {
    if (!counts.has(p.topic)) counts.set(p.topic, { total: 0, solved: 0 });
    const c = counts.get(p.topic)!;
    c.total++;
    if (statusOf(p.id, progress.attempts) === 'solved') c.solved++;
  });

  const withProblems = TOPICS.filter((t) => counts.has(t));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Topics"
        subtitle="Choosing a topic reveals it on purpose. Random and interview practice keep topics hidden."
      />
      
      {withProblems.length === 0 ? (
        <div className="ui-card p-8 text-center text-sm text-muted">
          No problems available yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {withProblems.map((t) => {
            const stats = counts.get(t)!;
            const pct = stats.total > 0 ? stats.solved / stats.total : 0;
            
            return (
              <Link
                key={t}
                to={`/problems?topic=${encodeURIComponent(t)}`}
                className="ui-card group flex flex-col justify-between p-5 transition-all hover:border-accent/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-fg">{t}</h3>
                    <ChevronRight size={16} className="mt-1 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent" />
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {stats.solved} of {stats.total} solved
                  </p>
                </div>
                
                <div className="mt-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${Math.round(pct * 100)}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
