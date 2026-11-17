import { useEffect, useRef, useState } from 'react';

export interface TocSection {
  id: string;
  label: string;
}

export interface SectionTocProps {
  sections: TocSection[];
}

export function SectionToc({ sections }: SectionTocProps): React.ReactElement | null {
  const [active, setActive] = useState<string | null>(sections[0]?.id ?? null);
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (sections.length === 0) return;
    if (typeof IntersectionObserver === 'undefined') return;
    const el = rootRef.current;
    if (!el) return;

    const mainEl = el.closest('main');
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const id = visible[0].target.id;
          if (id) setActive(id);
        }
      },
      { root: mainEl, rootMargin: '-30% 0px -55% 0px', threshold: [0, 0.5, 1] },
    );

    for (const s of sections) {
      const t = document.getElementById(s.id);
      if (t) observer.observe(t);
    }
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  const handleClick = (id: string, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const t = document.getElementById(id);
    if (t) {
      try { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      catch { t.scrollIntoView(); }
    }
    setActive(id);
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', '#' + id);
    }
  };

  return (
    <nav
      ref={rootRef as React.RefObject<HTMLElement>}
      className="cx-toc cx-no-print"
      aria-label="Section navigation"
    >
      <p className="cx-toc__label">On this page</p>
      <ul className="cx-toc__list">
        {sections.map((s) => (
          <li key={s.id}>
            <a
              href={'#' + s.id}
              onClick={(e) => handleClick(s.id, e)}
              aria-current={s.id === active ? 'true' : undefined}
              className={'cx-toc__link' + (s.id === active ? ' cx-toc__link--active' : '')}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
