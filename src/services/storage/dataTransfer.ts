import { loadProgress, replaceProgress, resetProgress } from './progressStorage';
import { loadSettings, saveSettings, resetSettings, isSettings } from './settingsStorage';
import { loadBookmarks, replaceBookmarks, resetBookmarks, isBookmarkList } from './bookmarkStorage';
import { isProgressData } from './progressStorage';
import { saveSession } from './practiceSession';
import { STORAGE_VERSION, isRecord } from './storageService';

export interface ExportFile {
  app: 'dsa-debugging-lab';
  version: string;
  exportedAt: string;
  progress: unknown;
  settings: unknown;
  bookmarks: unknown;
}

export function exportData(): string {
  const file: ExportFile = {
    app: 'dsa-debugging-lab',
    version: STORAGE_VERSION,
    exportedAt: new Date().toISOString(),
    progress: loadProgress(),
    settings: loadSettings(),
    bookmarks: loadBookmarks(),
  };
  return JSON.stringify(file, null, 2);
}

export type ImportResult = { ok: true } | { ok: false; error: string };

export function importData(text: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'File is not valid JSON.' };
  }
  if (!isRecord(parsed) || parsed.app !== 'dsa-debugging-lab') {
    return { ok: false, error: 'This is not a DSA Debugging Lab export.' };
  }
  if (parsed.version !== STORAGE_VERSION) {
    return { ok: false, error: `Unsupported export version: ${String(parsed.version)}.` };
  }
  if (!isProgressData(parsed.progress)) return { ok: false, error: 'Progress data is corrupted.' };
  if (!isSettings(parsed.settings)) return { ok: false, error: 'Settings data is corrupted.' };
  if (!isBookmarkList(parsed.bookmarks)) return { ok: false, error: 'Bookmark data is corrupted.' };

  replaceProgress(parsed.progress);
  saveSettings(parsed.settings);
  replaceBookmarks(parsed.bookmarks);
  return { ok: true };
}

export function resetAllData(): void {
  resetProgress();
  resetSettings();
  resetBookmarks();
  saveSession(null);
}
