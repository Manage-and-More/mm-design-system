import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { Link, useLocation } from 'wouter';
import symbolUrl from '@ds/assets/logo/svg/mm-symbol-blue.svg?url';
import { getVariant, groupPages, pagesOf, variants } from '@/core/registry';
import type { ShellState } from '@/core/url-state';
import type { PageDefinition } from '@/core/variant';
import { cn } from '@/lib/cn';
import { MenuItem, Popover } from './Popover';
import { StatusPill } from './StatusPill';

interface SidebarProps {
  state: ShellState;
  update: (next: Partial<ShellState>) => void;
  /** Search params to keep when following a page link. */
  query: string;
  searchRef: RefObject<HTMLInputElement | null>;
  onNavigate?: () => void;
}

const STORAGE_KEY = 'pg:sidebar:collapsed';

/** Folded sections, remembered per browser (a convenience, so failures are ignored). */
function useCollapsed() {
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'));
    } catch {
      return new Set();
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...collapsed]));
    } catch {
      /* storage unavailable */
    }
  }, [collapsed]);
  return [collapsed, setCollapsed] as const;
}

/** Bold the part of a title that matches the filter. */
function Highlight({ text, query }: { text: string; query: string }) {
  const i = query ? text.toLowerCase().indexOf(query.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[3px] bg-accent/15 text-inherit">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  );
}

const Chevron = ({ open }: { open: boolean }) => (
  <svg viewBox="0 0 16 16" aria-hidden className={cn('size-3 shrink-0 transition-transform duration-200 ease-out-soft', open && 'rotate-90')} fill="currentColor">
    <path d="M6.2 3.4 10.8 8l-4.6 4.6-.85-.85L9.1 8 5.35 4.25z" />
  </svg>
);

interface SectionProps {
  group: string;
  pages: PageDefinition[];
  open: boolean;
  onToggle: (all: boolean) => void;
  render: (page: PageDefinition) => React.ReactNode;
}

/** One foldable group. Height animates via grid rows; folded links are inert (skipped by Tab). */
function Section({ group, pages, open, onToggle, render }: SectionProps) {
  const id = useId();
  return (
    <section>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        title="Option-click to fold or unfold all sections"
        onClick={(e) => onToggle(e.altKey)}
        className="flex h-7 w-full items-center gap-1.5 rounded-md px-1.5 text-[12px] font-semibold text-fg-2 transition-colors duration-150 hover:bg-fill hover:text-fg"
      >
        <Chevron open={open} />
        <span className="flex-1 text-left">{group}</span>
      </button>
      <div
        id={id}
        inert={!open}
        className={cn('grid transition-[grid-template-rows,opacity] duration-200 ease-out-soft', open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}
      >
        <ul className="ml-[12px] min-h-0 overflow-hidden border-l border-line pb-1.5">{pages.map(render)}</ul>
      </div>
    </section>
  );
}

export function Sidebar({ state, update, query, searchRef, onNavigate }: SidebarProps) {
  const variant = getVariant(state.variantId)!;
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState('');
  const [cursor, setCursor] = useState(0);
  const [collapsed, setCollapsed] = useCollapsed();
  const nav = useRef<HTMLElement>(null);

  const q = filter.trim();
  const groups = groupPages(pagesOf(variant).filter((p) => !q || p.title.toLowerCase().includes(q.toLowerCase())));
  const results = groups.flatMap(([, pages]) => pages);
  const activeGroup = pagesOf(variant).find((p) => p.slug === state.pageSlug)?.group;

  // Landing on a page inside a folded section unfolds it.
  useEffect(() => {
    if (activeGroup && collapsed.has(activeGroup)) setCollapsed((c) => new Set([...c].filter((g) => g !== activeGroup)));
  }, [variant.id, state.pageSlug]);

  useEffect(() => setCursor(0), [q]);

  // Keep the current page (or the keyboard cursor while filtering) visible inside the sidebar.
  useLayoutEffect(() => {
    const el = nav.current?.querySelector<HTMLElement>(q ? '[data-cursor]' : '[aria-current="page"]');
    if (!el || !nav.current) return;
    const n = nav.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (r.top < n.top) nav.current.scrollTop -= n.top - r.top + 8;
    else if (r.bottom > n.bottom) nav.current.scrollTop += r.bottom - n.bottom + 8;
  }, [state.pageSlug, cursor, q]);

  const toggle = (group: string, all: boolean) =>
    setCollapsed((c) => {
      const folding = !c.has(group);
      if (all) return folding ? new Set(groups.map(([g]) => g)) : new Set();
      const next = new Set(c);
      if (folding) next.add(group);
      else next.delete(group);
      return next;
    });

  const go = (page: PageDefinition) => {
    navigate(`/${variant.id}/${page.slug}${query}`);
    onNavigate?.();
  };

  const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (results.length) setCursor((c) => (c + (e.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length);
    } else if (e.key === 'Enter' && q && results[cursor]) {
      go(results[cursor]);
      setFilter('');
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      if (filter) setFilter('');
      else e.currentTarget.blur();
    }
  };

  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-line bg-sidebar backdrop-blur-2xl backdrop-saturate-150">
      <div className="flex items-center gap-2 px-4 pt-4 pb-3">
        <img src={symbolUrl} alt="" className="size-5" />
        <span className="text-[13px] font-semibold tracking-tight">Design Playground</span>
      </div>

      <div className="px-3">
        <Popover
          triggerClassName="flex w-full items-center gap-2.5 rounded-lg bg-control px-2.5 py-2 text-left shadow-control transition-colors hover:bg-surface"
          className="w-[264px]"
          triggerLabel={`Variant: ${variant.name}. Change variant`}
          trigger={
            <>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-[13px] font-semibold">{variant.name}</span>
                  <StatusPill status={variant.status} />
                </span>
                <span className="block truncate text-[11px] text-fg-2">{variant.summary}</span>
              </span>
              <svg viewBox="0 0 16 16" aria-hidden className="size-3.5 shrink-0 text-fg-3" fill="currentColor">
                <path d="M8 2.6 11.6 6.2l-.85.85L8 4.3 5.25 7.05 4.4 6.2zm0 10.8L4.4 9.8l.85-.85L8 11.7l2.75-2.75.85.85z" />
              </svg>
            </>
          }
        >
          {(close) => (
            <>
              <p className="px-2 pt-1 pb-1.5 text-[11px] font-semibold text-fg-3">Variants</p>
              {variants.map((v) => (
                <MenuItem
                  key={v.id}
                  selected={v.id === variant.id}
                  onSelect={() => {
                    close();
                    update({ variantId: v.id, compare: state.compare === v.id ? null : state.compare });
                  }}
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{v.name}</span>
                    <StatusPill status={v.status} />
                  </span>
                  <span className="block text-[11px] text-fg-2">{v.summary}</span>
                </MenuItem>
              ))}
              <p className="mx-2 mt-1.5 border-t border-line pt-2 pb-1 text-[11px] text-fg-3">
                Add one: <code className="font-mono">pnpm new:variant &lt;id&gt;</code>
              </p>
            </>
          )}
        </Popover>
      </div>

      <div className="relative px-3 pt-3 pb-2">
        <svg viewBox="0 0 16 16" aria-hidden className="pointer-events-none absolute top-1/2 left-5.5 mt-0.5 size-3.5 -translate-y-1/2 text-fg-3" fill="currentColor">
          <path d="M7 2.5a4.5 4.5 0 0 1 3.6 7.2l3 3-.85.85-3-3A4.5 4.5 0 1 1 7 2.5Zm0 1.2a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Z" />
        </svg>
        <input
          ref={searchRef}
          type="search"
          role="combobox"
          aria-expanded={!!q}
          aria-controls="pg-pages"
          aria-label="Search pages"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={onSearchKey}
          placeholder="Search pages"
          className="peer h-7 w-full rounded-md bg-fill-2 pr-12 pl-7 text-[12px] placeholder:text-fg-3 focus-visible:bg-control focus-visible:shadow-control focus-visible:outline-accent [&::-webkit-search-cancel-button]:appearance-none"
        />
        {filter ? (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => (setFilter(''), searchRef.current?.focus())}
            className="absolute top-1/2 right-5 mt-0.5 grid size-4 -translate-y-1/2 place-items-center rounded-full bg-fg-3 text-[10px] leading-none text-window"
          >
            ✕
          </button>
        ) : (
          <kbd className="pointer-events-none absolute top-1/2 right-5 mt-0.5 -translate-y-1/2 rounded border border-line px-1 font-sans text-[10px] text-fg-3 peer-focus:opacity-0">
            ⌘K
          </kbd>
        )}
      </div>

      <nav ref={nav} id="pg-pages" aria-label="Pages" className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-4 [scrollbar-width:thin]">
        {groups.map(([group, pages]) => (
          <Section
            key={group}
            group={group}
            pages={pages}
            open={!!q || !collapsed.has(group)}
            onToggle={(all) => toggle(group, all)}
            render={(p) => {
              const active = p.slug === state.pageSlug;
              const atCursor = !!q && results[cursor]?.slug === p.slug;
              return (
                <li key={p.slug}>
                  <Link
                    href={`/${variant.id}/${p.slug}${query}`}
                    onClick={() => (setFilter(''), onNavigate?.())}
                    aria-current={active ? 'page' : undefined}
                    data-cursor={atCursor || undefined}
                    className={cn(
                      '-ml-px flex items-center rounded-r-md border-l py-1 pr-2 pl-3 text-[13px] transition-colors duration-150',
                      active ? 'border-accent font-medium text-accent' : 'border-transparent text-fg-2 hover:border-fg-3 hover:text-fg',
                      atCursor && 'bg-fill-2 text-fg',
                    )}
                  >
                    <span className="truncate">
                      <Highlight text={p.title} query={q} />
                    </span>
                  </Link>
                </li>
              );
            }}
          />
        ))}
        {q && results.length === 0 && <p className="px-2 pt-4 text-fg-3">No pages match “{q}”.</p>}
      </nav>

      <footer className="flex items-center gap-3 border-t border-line px-4 py-2.5 text-[11px] text-fg-3">
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-line px-1 font-sans">⌘K</kbd> Search
        </span>
        <span className="flex items-center gap-1">
          <kbd className="rounded border border-line px-1 font-sans">[</kbd>
          <kbd className="rounded border border-line px-1 font-sans">]</kbd> Previous / next
        </span>
      </footer>
    </aside>
  );
}
