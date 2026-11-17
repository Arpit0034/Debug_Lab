import { DEFAULT_SETTINGS, type Settings } from '../../types/progress';
import { LANGUAGES } from '../../types/problem';
import { STORAGE_KEYS, isRecord, readJSON, writeJSON, removeKey } from './storageService';

export function isSettings(v: unknown): v is Settings {
  return (
    isRecord(v) &&
    (v.theme === 'dark' || v.theme === 'light') &&
    typeof v.language === 'string' &&
    (LANGUAGES as readonly string[]).includes(v.language) &&
    typeof v.fontSize === 'number' &&
    typeof v.showHints === 'boolean'
  );
}

export function loadSettings(): Settings {
  return readJSON<Settings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS, isSettings);
}

export function saveSettings(settings: Settings): void {
  writeJSON(STORAGE_KEYS.settings, settings);
}

export function resetSettings(): void {
  removeKey(STORAGE_KEYS.settings);
}
