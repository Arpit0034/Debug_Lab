import { Link } from 'react-router-dom';
import { Bookmark, CheckCircle2, Circle, Clock } from 'lucide-react';
import type { Problem } from '../../types/problem';
import { LANGUAGE_LABELS } from '../../types/problem';
import { useApp } from '../../app/providers/context';
import { Badge } from '../../components/common/PageHeader';
import { STATUS_LABEL, isRevealed, statusOf } from '../../utils/status';

export function ProblemList({ items, empty }: { items: Problem[]; empty: string }) {
  const { progress, bookmarks, toggleBookmark } = useApp();

  if (items.length === 0) {
    return (
      <div className="ui-card p-12 text-center">
        <p className="text-muted">{empty}</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-line overflow-hidden ui-card bg-surface">
      {items.map((p) => {
        const status = statusOf(p.id, progress.attempts);
        const revealed = isRevealed(p.id, progress.attempts);
        const marked = bookmarks.includes(p.id);
        
        return (
          <li key={p.id} className="group flex items-center gap-4 px-4 py-4 sm:px-5 transition-colors hover:bg-surface-2/50">
            <div className="shrink-0 text-muted">
              {status === 'solved' ? (
                <CheckCircle2 size={20} className="text-good" />
              ) : status === 'attempted' ? (
                <Clock size={20} className="text-warn" />
              ) : (
                <Circle size={20} className="opacity-40" />
              )}
            </div>
            
            <Link to={`/problem/${p.id}`} className="min-w-0 flex-1 outline-none">
              <div className="truncate text-sm font-medium text-fg group-hover:text-accent transition-colors">
                {revealed ? p.title : `Find the bug #${p.id.slice(1)}`}
              </div>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                <Badge tone={p.difficulty === 'Easy' ? 'good' : p.difficulty === 'Medium' ? 'warn' : 'bad'}>
                  {p.difficulty}
                </Badge>
                <Badge>{p.languages.map((l) => LANGUAGE_LABELS[l]).join(' / ')}</Badge>
                {revealed && <Badge>{p.topic}</Badge>}
                <span className="text-xs text-muted ml-auto sm:ml-0">{STATUS_LABEL[status]}</span>
              </div>
            </Link>
            
            <button
              type="button"
              onClick={() => toggleBookmark(p.id)}
              aria-label={marked ? 'Remove bookmark' : 'Add bookmark'}
              aria-pressed={marked}
              className={`shrink-0 rounded-full p-2 transition-colors ${marked ? 'text-accent bg-accent/10' : 'text-muted hover:bg-surface-2 hover:text-fg'}`}
            >
              <Bookmark size={18} fill={marked ? 'currentColor' : 'none'} />
            </button>
          </li>
        );
      })}
    </ul>
  );
}
