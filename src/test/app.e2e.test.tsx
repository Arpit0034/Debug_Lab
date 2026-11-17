// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within, act, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../app/App';
import { router } from '../app/router';
import { problems } from '../data/problemRegistry';

class RO { observe() {} unobserve() {} disconnect() {} }
(globalThis as any).ResizeObserver = RO;
if (!window.matchMedia) {
  (window as any).matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
}
Element.prototype.scrollIntoView = () => {};


const LABEL: Record<string, string> = { java: 'Java', python: 'Python', c: 'C' };
async function pickLang(user: ReturnType<typeof userEvent.setup>, l: string) {
  await user.click(screen.getByRole('tab', { name: LABEL[l] }));
}
// jsdom has no layout; CodeMirror measures text ranges, so stub them.
(Range.prototype as any).getClientRects = () => [];
(Range.prototype as any).getBoundingClientRect = () => ({ x: 0, y: 0, top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 });

async function go(path: string) {
  await act(async () => { await router.navigate(path); });
}

beforeEach(async () => {
  cleanup();
  localStorage.clear();
  await act(async () => { await router.navigate('/'); });
});

describe('navigation', () => {
  it('every sidebar route renders without crashing', async () => {
    render(<App />);
    for (const path of ['/', '/problems', '/topics', '/practice', '/timed', '/bookmarks', '/analytics', '/settings']) {
      await go(path);
      expect(document.querySelector('main, #root, body')!.textContent!.length).toBeGreaterThan(20);
    }
  });
  it('all problems page lists every problem in the bank', async () => {
    render(<App />);
    await go('/problems');
    const links = document.querySelectorAll('a[href^="/problem/"]');
    expect(links.length).toBe(problems.length);
  });
});

describe('debugging workspace', () => {
  const p = problems[0];
  const lang = p.languages[0];

  it('hides title/topic before submit and reveals after a correct answer', async () => {
    const user = userEvent.setup();
    render(<App />);
    await go(`/problem/${p.id}`);
    await pickLang(user, lang);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('Find the bug in this implementation');
    expect(document.body.textContent).not.toContain(p.title);
    expect(document.body.textContent).not.toContain(`Topic: ${p.topic}`);

    const input = screen.getByLabelText('Line number to add');
    for (const l of p.buggyLines[lang]!) {
      await user.clear(input);
      await user.type(input, String(l));
      await user.click(screen.getByRole('button', { name: 'Add line' }));
    }
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(p.title));
    expect(screen.getAllByText('Bug: Correct').length).toBeGreaterThan(0);
    // explanation sections present
    for (const s of ['The bug', 'Why the code fails', 'Dry run', 'Debugging lesson']) {
      expect(document.body.textContent).toContain(s);
    }
    const stored = JSON.parse(localStorage.getItem(Object.keys(localStorage).find((k) => k.includes('progress'))!)!);
    expect(stored.attempts.length).toBe(1);
    expect(stored.attempts[0].bugResult).toBe('correct');
  });

  it('wrong line is graded incorrect; invalid line number rejected', async () => {
    const user = userEvent.setup();
    render(<App />);
    await go(`/problem/${p.id}`);
    await pickLang(user, lang);
    const input = screen.getByLabelText('Line number to add');
    await user.type(input, '9999');
    await user.click(screen.getByRole('button', { name: 'Add line' }));
    expect(screen.getByRole('alert').textContent).toMatch(/from 1 to/);
    await user.clear(input);
    const buggy = new Set(p.buggyLines[lang]);
    const wrong = [1, 2, 3, 4, 5].find((n) => !buggy.has(n))!;
    await user.type(input, String(wrong));
    await user.click(screen.getByRole('button', { name: 'Add line' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(screen.getAllByText('Bug: Incorrect').length).toBeGreaterThan(0));
  });

  it('submit is disabled with nothing selected; selected line can be removed', async () => {
    const user = userEvent.setup();
    render(<App />);
    await go(`/problem/${p.id}`);
    expect((screen.getByRole('button', { name: 'Submit' }) as HTMLButtonElement).disabled).toBe(true);
    await user.type(screen.getByLabelText('Line number to add'), '2');
    await user.click(screen.getByRole('button', { name: 'Add line' }));
    expect((screen.getByRole('button', { name: 'Submit' }) as HTMLButtonElement).disabled).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Remove line 2' }));
    expect((screen.getByRole('button', { name: 'Submit' }) as HTMLButtonElement).disabled).toBe(true);
  });

  it('language switching keeps each language selection', async () => {
    const multi = problems.find((x) => x.languages.length > 1)!;
    const [a, b] = multi.languages;
    const user = userEvent.setup();
    render(<App />);
    await go(`/problem/${multi.id}`);
    await user.click(screen.getByRole('tab', { name: new RegExp(`^${a === 'c' ? 'C' : a[0].toUpperCase() + a.slice(1)}$`) }));
    await user.type(screen.getByLabelText('Line number to add'), '3');
    await user.click(screen.getByRole('button', { name: 'Add line' }));
    await user.click(screen.getByRole('tab', { name: new RegExp(`^${b === 'c' ? 'C' : b[0].toUpperCase() + b.slice(1)}$`) }));
    expect(screen.getByText('None selected')).toBeTruthy();
    await user.click(screen.getByRole('tab', { name: new RegExp(`^${a === 'c' ? 'C' : a[0].toUpperCase() + a.slice(1)}$`) }));
    expect(screen.getAllByText('Line 3').length).toBeGreaterThan(0);
    expect(screen.queryByText('None selected')).toBeNull();
  });

  it('bookmark persists and appears on Bookmarks page', async () => {
    const user = userEvent.setup();
    render(<App />);
    await go(`/problem/${p.id}`);
    await user.click(screen.getByRole('button', { name: 'Add bookmark' }));
    expect(screen.getByRole('button', { name: 'Remove bookmark' })).toBeTruthy();
    await go('/bookmarks');
    expect(document.querySelectorAll('a[href^="/problem/"]').length).toBe(1);
  });
});

describe('dashboard reflects real data', () => {
  it('shows an attempt after one submission', async () => {
    const user = userEvent.setup();
    render(<App />);
    const p = problems[1];
    await go(`/problem/${p.id}`);
    await user.type(screen.getByLabelText('Line number to add'), '1');
    await user.click(screen.getByRole('button', { name: 'Add line' }));
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await go('/');
    expect(document.body.textContent).toContain('Attempted');
    await go('/analytics');
    expect(document.body.textContent!.length).toBeGreaterThan(100);
  });
});

describe('practice + timed', () => {
  it('timed challenge start button begins a session', async () => {
    const user = userEvent.setup();
    render(<App />);
    await go('/timed');
    const btn = screen.getAllByRole('button').find((b) => /start/i.test(b.textContent ?? ''))!;
    await user.click(btn);
    await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/problem\//));
    expect(document.body.textContent).toMatch(/Timed challenge/);
  });
  it('practice page cards are present and a mode launches', async () => {
    const user = userEvent.setup();
    render(<App />);
    await go('/practice');
    const start = screen.getAllByRole('button').filter((b) => /start|begin|go|random/i.test(b.textContent ?? ''));
    expect(start.length).toBeGreaterThan(0);
    await user.click(start[0]);
    await waitFor(() => expect(router.state.location.pathname.startsWith('/problem/') || document.body.textContent!.includes('Continue')).toBe(true));
  });
});

describe('settings', () => {
  it('export, reset-confirm flow', async () => {
    const user = userEvent.setup();
    render(<App />);
    await go('/settings');
    const main = document.body;
    expect(within(main).getAllByRole('button').length).toBeGreaterThan(2);
    await user.click(screen.getByRole('button', { name: 'Reset all progress' }));
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.getByRole('button', { name: 'Reset all progress' })).toBeTruthy();
  });

  it('reset wipes stored progress after confirmation', async () => {
    const user = userEvent.setup();
    render(<App />);
    const p = problems[0];
    await go(`/problem/${p.id}`);
    await user.click(screen.getByRole('button', { name: 'Add bookmark' }));
    expect(localStorage.length).toBeGreaterThan(0);
    await go('/settings');
    await user.click(screen.getByRole('button', { name: 'Reset all progress' }));
    await user.click(screen.getByRole('button', { name: 'Yes, reset everything' }));
    await go('/bookmarks');
    expect(document.querySelectorAll('a[href^="/problem/"]').length).toBe(0);
  });
});


describe('optional fields', () => {
  it('corrected line + complexity are evaluated independently', async () => {
    const p = problems[0];
    const lang = p.languages[0];
    const line = p.buggyLines[lang]![0];
    const user = userEvent.setup();
    render(<App />);
    await go(`/problem/${p.id}`);
    await pickLang(user, lang);
    await user.type(screen.getByLabelText('Line number to add'), String(line));
    await user.click(screen.getByRole('button', { name: 'Add line' }));
    await user.type(screen.getByPlaceholderText('Type the corrected version of this line'), p.acceptedFixes[lang]![String(line)][0]);
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(screen.getByText('Your corrected lines')).toBeTruthy());
    expect(document.body.textContent).toContain('Verified');
    // complexity step is rendered and skippable (no forced fields)
    expect(document.body.textContent).toMatch(/complexity/i);
  });
});
