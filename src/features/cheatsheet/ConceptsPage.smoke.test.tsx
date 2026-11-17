/** @vitest-environment jsdom */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ConceptsPage } from './ConceptsPage';

function renderAt(url: string) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route path="/concepts" element={<ConceptsPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ConceptsPage smoke', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* ignore */ }
  });
  afterEach(() => cleanup());

  it('renders library view at /concepts', () => {
    renderAt('/concepts');
    expect(screen.getByText('DSA Knowledge Hub')).toBeDefined();
  });

  it('renders some concept cards in library view', () => {
    renderAt('/concepts');
    expect(screen.getByText('Binary Search')).toBeDefined();
    expect(screen.getByText('Arrays')).toBeDefined();
  });

  it('renders complexity view', () => {
    renderAt('/concepts?view=complexity');
    expect(screen.getByText('Complexity Reference')).toBeDefined();
  });

  it('renders compare view', () => {
    renderAt('/concepts?view=compare');
    expect(screen.getByText('Compare Concepts')).toBeDefined();
  });

  it('renders pattern finder view', () => {
  renderAt('/concepts?view=patterns');
  expect(screen.getAllByText('Pattern Finder').length).toBeGreaterThan(0);
});

  it('renders concept reader shell at ?c=binary-search (no crash)', () => {
    renderAt('/concepts?c=binary-search');
    expect(screen.getByText('DSA Knowledge Hub')).toBeDefined();
  });

  it('does not crash on unknown concept id', () => {
    renderAt('/concepts?c=does-not-exist');
    expect(screen.getByText('DSA Knowledge Hub')).toBeDefined();
  });

  it('renders without IntersectionObserver (jsdom default)', () => {
    expect(typeof IntersectionObserver).toBe('undefined');
    renderAt('/concepts');
    expect(screen.getByText('DSA Knowledge Hub')).toBeDefined();
  });
});
