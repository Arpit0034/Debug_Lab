import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkCheck, Briefcase, Compass, FolderTree, RotateCcw, Shuffle, Play } from 'lucide-react';
import type { ReactNode } from 'react';
import { problems } from '../../data/problemRegistry';
import { useApp } from '../../app/providers/context';
import { PageHeader } from '../../components/common/PageHeader';
import { buildQueue, BLIND_MODES } from '../../services/practice/queue';
import type { PracticeMode } from '../../types/progress';
import { TOPICS } from '../../types/problem';

interface ModeCard {
  mode: PracticeMode;
  title: string;
  text: string;
  icon: ReactNode;
  empty: string;
}

const CARDS: ModeCard[] = [
  { mode: 'topic', title: 'Topic-wise', text: 'Pick a topic and work through it. The topic is known to you here on purpose.', icon: <FolderTree size={20} />, empty: 'No problems in this topic.' },
  { mode: 'random', title: 'Random', text: 'Problems from the whole bank in random order. Topics stay hidden.', icon: <Shuffle size={20} />, empty: 'No problems yet.' },
  { mode: 'weak', title: 'Weak areas', text: 'Unsolved problems from topics where your accuracy is under 70%.', icon: <Compass size={20} />, empty: 'Needs some attempts first. Practice a few problems and weak topics will appear here.' },
    { mode: 'interview', title: 'Interview simulation', text: 'Twenty Medium and Hard problems in a row, topics hidden.', icon: <Briefcase size={18} />, empty: 'No Medium or Hard problems yet.' },
  { mode: 'unsolved', title: 'Unsolved', text: 'Problems you attempted but have not solved yet.', icon: <RotateCcw size={20} />, empty: 'Nothing to retry. Problems you miss will show up here.' },
  { mode: 'bookmarked', title: 'Bookmarked', text: 'Problems you saved for later.', icon: <BookmarkCheck size={20} />, empty: 'No bookmarks yet.' },
];

export function PracticePage() {
  const { progress, bookmarks, session, setSession } = useApp();
  const navigate = useNavigate();
  const topics = useMemo(() => TOPICS.filter((t) => problems.some((p) => p.topic === t)), []);
  const [topic, setTopic] = useState<string>(topics[0] ?? '');
  const ctx = { problems, attempts: progress.attempts, bookmarks };

  const queueFor = (mode: PracticeMode) =>
        buildQueue(mode, ctx, { topic, count: mode === 'interview' ? 20 : undefined });

  const start = (card: ModeCard) => {
    const queue = queueFor(card.mode);
    if (queue.length === 0) return;
    setSession({
      mode: card.mode,
      label: card.mode === 'topic' ? `Topic: ${topic}` : card.title,
      queue,
      index: 0,
      startedAt: Date.now(),
    });
    navigate(`/problem/${queue[0]}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Practice" subtitle="Choose how you want to practice. Finishing a session keeps going through its queue." />
      
      {session && session.mode !== 'timed' && (
        <div className="sticky top-4 z-10 flex flex-wrap items-center justify-between gap-3 ui-card p-4 border-accent/40 bg-surface shadow-md">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent mb-1 block">Session in progress</span>
            <span className="font-medium">{session.label}</span>
            <span className="ml-2 text-sm text-muted">({session.index + 1} of {session.queue.length})</span>
          </div>
          <div className="flex gap-2">
            <button type="button" className="ui-btn ui-btn-primary px-4 py-2" onClick={() => navigate(`/problem/${session.queue[session.index]}`)}>
              <Play size={16} className="mr-2" />
              Resume
            </button>
            <button type="button" className="ui-btn ui-btn-outline px-4 py-2" onClick={() => setSession(null)}>
              End
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((card) => {
          const queue = queueFor(card.mode);
          const blind = BLIND_MODES.includes(card.mode);
          const disabled = queue.length === 0;
          
          return (
            <section key={card.mode} className={`ui-card flex flex-col p-5 transition-opacity ${disabled ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 font-medium text-fg">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-accent">
                    {card.icon}
                  </div>
                  <span>{card.title}</span>
                </div>
                {blind && <span className="ui-chip bg-surface-2/50 text-[10px]">Topic hidden</span>}
              </div>
              
              <p className="mt-4 flex-1 text-sm text-muted leading-relaxed">{card.text}</p>
              
              {card.mode === 'topic' && (
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  aria-label="Topic"
                  className="mt-4 ui-input w-full bg-surface-2"
                >
                  {topics.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              )}
              
              <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
                <span className={`text-xs font-medium ${disabled ? 'text-muted' : 'text-accent'}`}>
                  {disabled ? card.empty : `${queue.length} problem${queue.length === 1 ? '' : 's'} available`}
                </span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => start(card)}
                  className="ui-btn ui-btn-primary px-4 py-2"
                >
                  Start
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
