import { useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import { canvasUrl, isCanvasMessage, postToCanvas } from '@/canvas/bridge';
import type { Viewport } from '@/core/url-state';
import type { Mode } from '@/core/variant';
import { cn } from '@/lib/cn';

interface CanvasFrameProps {
  variantId: string;
  pageSlug: string;
  mode: Mode;
  viewport: Viewport;
  /** `page`: iframe grows to its content and the window scrolls. `frame`: browser-sized iframe with its own scroll. */
  scroll: 'page' | 'frame';
  reloadKey: number;
  /** Shown above the frame (variant name in Compare). */
  label?: ReactNode;
  onViewportChange: (viewport: Viewport) => void;
}

const MIN_WIDTH = 280;
/** Toolbar height + stage padding (top and bottom), see Toolbar and Stage. */
const CHROME_H = 52 + 24;
const HEADER_H = 32;
/** Content that sizes itself from the viewport (100vh) would grow forever with the iframe; stop following it. */
const RUNAWAY_STEPS = 40;
const MAX_HEIGHT = 40_000;

function useWindowHeight() {
  const [h, setH] = useState(() => window.innerHeight);
  useEffect(() => {
    const onResize = () => setH(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return h;
}

/**
 * Renders one variant page in an isolated iframe. Fixed viewports keep their real
 * layout width (so media queries fire) and scale down to fit the stage.
 */
export function CanvasFrame({ variantId, pageSlug, mode, viewport, scroll, reloadKey, label, onViewportChange }: CanvasFrameProps) {
  const host = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [width, setWidth] = useState(0);
  const [contentH, setContentH] = useState(0);
  const [ready, setReady] = useState(false);
  const [drag, setDrag] = useState<number | null>(null);
  const windowH = useWindowHeight();
  const growth = useRef({ steps: 0, at: 0, last: 0 });

  // Mode is pushed by message so toggling it never reloads the canvas.
  const initialMode = useRef(mode);
  const src = useMemo(() => canvasUrl(variantId, pageSlug, initialMode.current), [variantId, pageSlug, reloadKey]);

  useLayoutEffect(() => {
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(host.current!);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    setReady(false);
    growth.current = { steps: 0, at: 0, last: 0 };
  }, [src]);

  useEffect(() => {
    initialMode.current = mode;
    postToCanvas(frame.current, { type: 'mode', mode });
  }, [mode]);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source !== frame.current?.contentWindow || !isCanvasMessage(event.data)) return;
      const msg = event.data;
      if (msg.type === 'ready' || msg.type === 'error') setReady(true);
      if (msg.type === 'height') {
        const g = growth.current;
        const now = performance.now();
        g.steps = msg.height > g.last && now - g.at < 150 ? g.steps + 1 : 0;
        g.at = now;
        g.last = msg.height;
        if (g.steps === RUNAWAY_STEPS) console.warn(`[playground] ${variantId}/${pageSlug} keeps growing with its frame (100vh content?). Use scroll: 'frame' for this page.`);
        if (g.steps < RUNAWAY_STEPS) setContentH(Math.min(msg.height, MAX_HEIGHT));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [variantId, pageSlug]);

  const fill = viewport === 'fill';
  const target = drag ?? (fill ? width : viewport);
  const scale = fill || !width ? 1 : Math.min(1, width / target);
  const showHeader = !!label || !fill;
  // Visible height that fills the window below the toolbar.
  const fitH = Math.max(320, windowH - CHROME_H - (showHeader ? HEADER_H : 0));
  // Unscaled iframe height: content height (at least a full window) or a browser-sized window.
  const frameH = scroll === 'page' ? Math.max(contentH, fitH / scale) : fitH / scale;

  const startDrag = (side: -1 | 1) => (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const startW = target;
    // The frame is centred, so each edge moves half of the width change.
    const widthAt = (x: number) => Math.max(MIN_WIDTH, Math.round(startW + (side * (x - startX) * 2) / scale));
    const move = (ev: globalThis.PointerEvent) => setDrag(widthAt(ev.clientX));
    const up = (ev: globalThis.PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      setDrag(null);
      onViewportChange(widthAt(ev.clientX));
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      {showHeader && (
        <div className="flex h-6 items-center justify-between gap-3 px-1 mb-2">
          <div className="flex min-w-0 items-center gap-2 text-[12px] font-semibold">{label}</div>
          {!fill && (
            <p className="font-mono text-[11px] whitespace-nowrap text-fg-3 tabular-nums">
              {Math.round(target)} × {scroll === 'page' ? 'auto' : Math.round(frameH)}
              {scale < 1 && ` · ${Math.round(scale * 100)}%`}
            </p>
          )}
        </div>
      )}
      <div ref={host} className="relative min-w-0">
        {width > 0 && (
          <div
            className={cn('group/frame relative mx-auto', drag === null && 'transition-[width] duration-300 ease-out-soft')}
            style={{ width: fill ? '100%' : target * scale, height: frameH * scale }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-[10px] bg-white shadow-frame dark:bg-neutral-900">
              <iframe
                ref={frame}
                key={src}
                src={src}
                title={`${variantId} / ${pageSlug}`}
                allow="clipboard-write"
                onLoad={() => postToCanvas(frame.current, { type: 'mode', mode })}
                className={cn(
                  'block origin-top-left border-0 transition-opacity duration-200',
                  ready ? 'opacity-100' : 'opacity-0',
                  drag !== null && 'pointer-events-none',
                )}
                style={{ width: fill ? '100%' : target, height: frameH, transform: scale < 1 ? `scale(${scale})` : undefined }}
              />
            </div>
            {!fill &&
              ([-1, 1] as const).map((side) => (
                <div
                  key={side}
                  role="separator"
                  aria-orientation="vertical"
                  aria-label="Resize viewport"
                  onPointerDown={startDrag(side)}
                  className={cn(
                    'absolute inset-y-0 z-10 w-3 cursor-ew-resize opacity-0 transition-opacity group-hover/frame:opacity-100',
                    side === -1 ? '-left-3' : '-right-3',
                    drag !== null && 'opacity-100',
                  )}
                >
                  {/* Grip stays mid-window however tall the frame is. */}
                  <span className="sticky top-1/2 mx-auto block h-8 w-1 rounded-full bg-fg-3" />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
