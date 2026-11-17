# DSA Concepts — Knowledge Hub (reference doc)

> **Documentation only.** Runtime content for the `/concepts` page lives in
> typed TypeScript under `src/features/cheatsheet/data/` and is rendered by
> `src/features/cheatsheet/ConceptsPage.tsx`. Nothing here is imported at
> runtime. Edit `data/details/*.ts` to change what the page shows; edit this
> file only for the high-level reference.

## What the page is

`/concepts` — interactive DSA revision hub. Four views: Library, Complexity,
Compare, Pattern Finder. State lives in the URL: `?view`, `?c`, `?q`, `?cat`,
`?lvl`, `?status`, `?sort`. Deep links survive refresh.

Per-concept reader renders up to 15 sections: Overview, Intuition, Internal
Working, Visual, Approach, Code (Python / Java / C++), Complexity with WHY,
Dry Run, When / Not, Mistakes, Interview, Related, Practice, Revision.

## Current content (v1.1 — 2026-11-08)

**8 flagship concepts**, each with all 15 sections:

| Concept | Category | Visual |
|---|---|---|
| Binary Search | Techniques | interactive stepper |
| Arrays | Foundations | ASCII diagram |
| Hash Maps | Data Structures | ASCII buckets |
| Trees | Data Structures | interactive in-order |
| Recursion | Paradigms | ASCII induction |
| Two Pointers | Techniques | interactive pointers |
| Sliding Window | Techniques | interactive grow/shrink |
| Sorting | Algorithms | interactive merge sort |

Source files: `data/details/batch-01.ts` through `batch-07-sorting.ts`.
Live list: `data/index.ts` → `CONCEPT_METAS`.

Compare view: 10 pairs. Pattern Finder: 16 signals + 15 bug patterns.

### Not yet written

~92 concepts from the brief are listed there but not registered as detail
pages. Adding one is: 1 file in `data/details/` + 1 meta entry + 1 chunk
loader entry. Nothing else changes.

## Progress tracking

3 states per concept (`not-started` / `learning` / `completed`) stored through
`services/storage/storageService.ts` under the `concepts` key. Validation
drops unknown ids and invalid values. **Not part of the app's export/reset-all
flow.**

## Styling

Scoped under `.cx-root` in `concepts.css`. Tokens `--cx-*`; light theme via
`[data-theme="light"] .cx-root`. No global CSS changed.

## Changelog

### v1.1 — 2026-11-08
- `/concepts` replaced with typed Knowledge Hub (8 flagship concepts).
- Docs rewritten; runtime content moved to `src/features/cheatsheet/data/`.
- Fixed: duplicate Techniques section, truncated binary-search card, missing
  code fences, false "16 cards" claim, broken `docs/README.md` link.

### v1.0 — 2026-11-07
- Initial markdown concept sheet. Superseded by v1.1.
