import { useEffect, useRef, useState } from 'react';
import { Redirect, Route, Switch, useSearch } from 'wouter';
import { isCanvasMessage } from '@/canvas/bridge';
import { getPage, getVariant, orderedPages, pagesOf, variants } from '@/core/registry';
import { isShortcut, isTypingTarget } from '@/core/shortcuts';
import { useShellState } from '@/core/url-state';
import { cn } from '@/lib/cn';
import { Sidebar } from './Sidebar';
import { Stage } from './Stage';
import { Toolbar } from './Toolbar';

function Workspace() {
  const [state, update] = useShellState();
  const search = useSearch();
  const [reloadKey, setReloadKey] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const variant = getVariant(state.variantId);

  useEffect(() => {
    const page = variant && getPage(variant, state.pageSlug);
    document.title = page ? `${page.title} · ${variant.name} · MM Playground` : 'MM Design Playground';
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [variant, state.pageSlug]);

  // Shortcuts, from the shell or forwarded by a focused canvas. Latest state via ref.
  const handleKey = useRef((_key: string, _meta: boolean) => {});
  handleKey.current = (key, meta) => {
    if (!variant) return;
    if ((meta && key.toLowerCase() === 'k') || key === '/') {
      setSidebarOpen(true);
      searchRef.current?.focus();
      searchRef.current?.select();
    } else if (key === '[' || key === ']') {
      const pages = orderedPages(variant);
      const i = pages.findIndex((p) => p.slug === state.pageSlug);
      const next = pages[i + (key === ']' ? 1 : -1)];
      if (next) update({ pageSlug: next.slug });
    }
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || !isShortcut(e)) return;
      e.preventDefault();
      handleKey.current(e.key, e.metaKey || e.ctrlKey);
    };
    const onMessage = (e: MessageEvent) => {
      if (e.origin === location.origin && isCanvasMessage(e.data) && e.data.type === 'key') handleKey.current(e.data.key, e.data.meta);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('message', onMessage);
    };
  }, []);

  if (!variant) return <Redirect to="/" replace />;
  if (!getPage(variant, state.pageSlug)) return <Redirect to={`/${variant.id}/${pagesOf(variant)[0].slug}${search ? `?${search}` : ''}`} replace />;

  // One scroll for the whole app: the window scrolls the stage; sidebar and toolbar stay pinned.
  return (
    <div className="md:grid md:grid-cols-[260px_minmax(0,1fr)]">
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-[280px] -translate-x-full transition-transform duration-300 ease-out-soft',
          'md:sticky md:top-0 md:z-auto md:h-dvh md:w-auto md:translate-x-0 md:self-start',
          sidebarOpen && 'translate-x-0 shadow-float',
        )}
      >
        <Sidebar
          state={state}
          update={update}
          query={search ? `?${search}` : ''}
          searchRef={searchRef}
          onNavigate={() => setSidebarOpen(false)}
        />
      </div>
      {sidebarOpen && <div className="fixed inset-0 z-20 bg-black/20 md:hidden" onClick={() => setSidebarOpen(false)} />}
      <main className="min-w-0">
        <Toolbar state={state} update={update} onReload={() => setReloadKey((k) => k + 1)} onToggleSidebar={() => setSidebarOpen((o) => !o)} />
        <Stage state={state} update={update} reloadKey={reloadKey} />
      </main>
    </div>
  );
}

export function App() {
  if (variants.length === 0)
    return (
      <p className="p-8 text-fg-2">
        No variants found. Create one with <code className="font-mono">pnpm new:variant &lt;id&gt;</code>.
      </p>
    );
  const first = variants[0];
  return (
    <Switch>
      <Route path="/:variant/:page?" component={Workspace} />
      <Route>
        <Redirect to={`/${first.id}/${pagesOf(first)[0].slug}`} replace />
      </Route>
    </Switch>
  );
}
