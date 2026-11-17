import { createContext, useContext } from 'react';
import type { PracticeSession, ProgressData, Settings } from '../../types/progress';

export interface AppState {
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
  progress: ProgressData;
  bookmarks: string[];
  session: PracticeSession | null;
  setSession: (session: PracticeSession | null) => void;
  toggleBookmark: (problemId: string) => void;
  /** Re-read progress, bookmarks and settings from storage (after import or reset). */
  reload: () => void;
}

export const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProviders');
  return ctx;
}
