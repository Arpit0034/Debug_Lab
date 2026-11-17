// Lazy-load a VizData JSON per problem id, cached per session.
import { useEffect, useState } from 'react';
import type { VizData } from './types';

const modules = import.meta.glob('../../data/viz/stories/*.json');
const cache = new Map<string, VizData>();

export interface StoryState {
  data: VizData | null;
  loading: boolean;
  error: string | null;
}

export function useStory(id: string): StoryState {
  const [data, setData] = useState<VizData | null>(() => cache.get(id) ?? null);
  const [loading, setLoading] = useState<boolean>(!cache.has(id));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = cache.get(id);
    if (cached) {
      setData(cached);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    let cancelled = false;
    const key = Object.keys(modules).find((k) => k.endsWith('/' + id + '.json'));
    if (!key) {
      setData(null);
      setLoading(false);
      setError('No trace for this problem.');
      return;
    }
    modules[key]()
      .then((mod) => {
        if (cancelled) return;
        const value = (mod as { default?: VizData }).default ?? (mod as VizData);
        cache.set(id, value);
        setData(value);
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setData(null);
        setLoading(false);
        setError('Could not load trace.');
      });
    return () => { cancelled = true; };
  }, [id]);

  return { data, loading, error };
}
