import { STORAGE_KEYS, readJSON, writeJSON, removeKey } from './storageService';

export function isBookmarkList(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string');
}

export function loadBookmarks(): string[] {
  return readJSON<string[]>(STORAGE_KEYS.bookmarks, [], isBookmarkList);
}

export function replaceBookmarks(ids: string[]): void {
  writeJSON(STORAGE_KEYS.bookmarks, ids);
}

export function toggleBookmark(problemId: string): string[] {
  const current = loadBookmarks();
  const next = current.includes(problemId)
    ? current.filter((id) => id !== problemId)
    : [...current, problemId];
  writeJSON(STORAGE_KEYS.bookmarks, next);
  return next;
}

export function resetBookmarks(): void {
  removeKey(STORAGE_KEYS.bookmarks);
}
