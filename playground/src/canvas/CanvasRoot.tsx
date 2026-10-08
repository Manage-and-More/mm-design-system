import { Suspense, lazy, useEffect, useMemo, useState, type ComponentType } from 'react';
import { registerLocalFonts } from '@/core/fonts';
import { getPage, getVariant } from '@/core/registry';
import { loadTokens, type ResolvedToken } from '@/core/tokens';
import { TokensContext } from '@/core/docs/TokensContext';
import { DocFrame } from '@/core/docs/DocFrame';
import { scrollModeOf, type Mode } from '@/core/variant';
import { isShortcut, isTypingTarget } from '@/core/shortcuts';
import { isShellMessage, postToShell } from './bridge';

const params = new URLSearchParams(location.search);
const variant = getVariant(params.get('variant') ?? undefined);
const page = variant && getPage(variant, params.get('page') ?? undefined);

/** Embedded page-scroll canvases have no scrollbar of their own; the shell grows the iframe instead. */
const pageScroll = window.parent !== window && !!page && scrollModeOf(page) === 'page';
if (pageScroll) document.documentElement.dataset.scroll = 'page';

const setMode = (mode: Mode) => {
  document.documentElement.dataset.mode = mode;
  document.documentElement.style.colorScheme = mode;
};

/** Everything a variant needs before first paint: its CSS, local fonts and resolved tokens. */
const ready: Promise<ResolvedToken[]> | null = variant
  ? Promise.all([variant.styles(), registerLocalFonts(), loadTokens(variant.id)]).then(([, , tokens]) => tokens)
  : null;

export function CanvasRoot() {
  const [tokens, setTokens] = useState<ResolvedToken[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const Page = useMemo(() => (page ? lazy(page.load as () => Promise<{ default: ComponentType }>) : null), []);

  useEffect(() => {
    if (!variant || !page) return;
    const requested = params.get('mode') as Mode | null;
    setMode(requested && (variant.modes ?? ['light']).includes(requested) ? requested : 'light');
    document.documentElement.dataset.variant = variant.id;
    document.title = `${page.title} · ${variant.name}`;
    ready!.then(setTokens, (err: unknown) => {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      postToShell({ type: 'error', message });
    });
    const onMessage = (event: MessageEvent) => {
      if (event.origin === location.origin && isShellMessage(event.data) && event.data.type === 'mode') setMode(event.data.mode);
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  useEffect(() => {
    if (tokens && variant && page) postToShell({ type: 'ready', variant: variant.id, page: page.slug });
  }, [tokens]);

  // Report content height whenever it changes (images loading, FAQ opening, fonts swapping).
  useEffect(() => {
    if (!pageScroll || !tokens) return;
    const root = document.getElementById('root')!;
    const report = () => {
      const margin = parseFloat(getComputedStyle(document.body).marginBottom) || 0;
      postToShell({ type: 'height', height: Math.ceil(root.offsetTop + root.getBoundingClientRect().height + margin) });
    };
    const ro = new ResizeObserver(report);
    ro.observe(root);
    report();
    return () => ro.disconnect();
  }, [tokens]);

  // Keep playground shortcuts working while focus is inside the canvas.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target) || !isShortcut(e)) return;
      e.preventDefault();
      postToShell({ type: 'key', key: e.key, meta: e.metaKey || e.ctrlKey });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!variant) return <p className="pg-doc-empty">Unknown variant “{params.get('variant')}”.</p>;
  if (!page || !Page) return <p className="pg-doc-empty">“{params.get('page')}” is not a page of {variant.name}.</p>;
  if (error) return <pre className="pg-doc-error">{error}</pre>;
  if (!tokens) return null;

  const content = (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  );
  return (
    <TokensContext value={{ variant, tokens }}>
      {page.layout === 'fullscreen' ? content : <DocFrame page={page} variant={variant}>{content}</DocFrame>}
    </TokensContext>
  );
}
