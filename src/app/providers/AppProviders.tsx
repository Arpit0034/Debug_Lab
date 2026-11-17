import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AppContext, type AppState } from './context';
import { loadProgress } from '../../services/storage/progressStorage';
import { loadSettings, saveSettings } from '../../services/storage/settingsStorage';
import { loadBookmarks, toggleBookmark as storeToggle } from '../../services/storage/bookmarkStorage';
import { loadSession, saveSession } from '../../services/storage/practiceSession';
import type { PracticeSession, Settings } from '../../types/progress';

export function AppProviders({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState(loadSettings);
  const [progress, setProgress] = useState(loadProgress);
  const [bookmarks, setBookmarks] = useState(loadBookmarks);
  const [session, setSessionState] = useState(loadSession);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveSettings(next);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback((problemId: string) => {
    setBookmarks(storeToggle(problemId));
  }, []);

  const setSession = useCallback((s: PracticeSession | null) => {
    saveSession(s);
    setSessionState(s);
  }, []);

  const reload = useCallback(() => {
    setSettings(loadSettings());
    setProgress(loadProgress());
    setBookmarks(loadBookmarks());
    setSessionState(loadSession());
  }, []);

  const value = useMemo<AppState>(
    () => ({ settings, updateSettings, progress, bookmarks, session, setSession, toggleBookmark, reload }),
    [settings, updateSettings, progress, bookmarks, session, setSession, toggleBookmark, reload],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
