import { useRef, useState } from 'react';
import { useApp } from '../../app/providers/context';
import { PageHeader } from '../../components/common/PageHeader';
import { LANGUAGES, LANGUAGE_LABELS, type Language } from '../../types/problem';
import { exportData, importData, resetAllData } from '../../services/storage/dataTransfer';

const btn = 'rounded-md border border-line bg-surface px-3 py-2 text-sm hover:bg-surface-2';

export function SettingsPage() {
  const { settings, updateSettings, reload } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const doExport = () => {
    const blob = new Blob([exportData()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dsa-debugging-lab-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage({ text: 'Exported.', ok: true });
  };

  const doImport = async (file: File | undefined) => {
    if (!file) return;
    const result = importData(await file.text());
    if (result.ok) {
      reload();
      setMessage({ text: 'Import complete.', ok: true });
    } else {
      setMessage({ text: result.error, ok: false });
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const doReset = () => {
    resetAllData();
    reload();
    setConfirmReset(false);
    setMessage({ text: 'All progress, bookmarks and settings were reset.', ok: true });
  };

  return (
    <>
      <PageHeader title="Settings" />
      <div className="max-w-xl space-y-6">
        <section className="space-y-3 rounded-lg border border-line bg-surface p-5">
          <h2 className="text-sm font-medium">Preferences</h2>
          <label className="flex items-center justify-between gap-4 text-sm">
            Theme
            <select
              className="rounded-md border border-line bg-bg px-3 py-2"
              value={settings.theme}
              onChange={(e) => updateSettings({ theme: e.target.value as 'dark' | 'light' })}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </label>
          <label className="flex items-center justify-between gap-4 text-sm">
            Default language
            <select
              className="rounded-md border border-line bg-bg px-3 py-2"
              value={settings.language}
              onChange={(e) => updateSettings({ language: e.target.value as Language })}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {LANGUAGE_LABELS[l]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center justify-between gap-4 text-sm">
            Code font size ({settings.fontSize}px)
            <input
              type="range"
              min={12}
              max={20}
              value={settings.fontSize}
              onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
            />
          </label>
          <label className="flex items-center justify-between gap-4 text-sm">
            Show hints
            <input
              type="checkbox"
              checked={settings.showHints}
              onChange={(e) => updateSettings({ showHints: e.target.checked })}
            />
          </label>
        </section>

        <section className="space-y-3 rounded-lg border border-line bg-surface p-5">
          <h2 className="text-sm font-medium">Your data</h2>
          <p className="text-sm text-muted">Everything is stored in this browser only.</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btn} onClick={doExport}>
              Export JSON
            </button>
            <button type="button" className={btn} onClick={() => fileRef.current?.click()}>
              Import JSON
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => void doImport(e.target.files?.[0])}
            />
          </div>
          {!confirmReset ? (
            <button type="button" className={`${btn} text-bad`} onClick={() => setConfirmReset(true)}>
              Reset all progress
            </button>
          ) : (
            <div className="rounded-md border border-bad p-3 text-sm">
              <p>This deletes all attempts, bookmarks and settings. It cannot be undone.</p>
              <div className="mt-3 flex gap-2">
                <button type="button" className={`${btn} text-bad`} onClick={doReset}>
                  Yes, reset everything
                </button>
                <button type="button" className={btn} onClick={() => setConfirmReset(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
          {message && (
            <p role="status" className={`text-sm ${message.ok ? 'text-good' : 'text-bad'}`}>
              {message.text}
            </p>
          )}
        </section>
      </div>
    </>
  );
}
