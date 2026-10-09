import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import * as lib from '@lucasmarkes/hairline/react';
import { cn } from '@/lib/cn';
import { customFigures, loadFigure, mountFigure, type FigureHandle } from '../../../../hairline/host';

/** Library figures used by this variant, with the React component for each. */
export const LIBRARY = {
  terminal: lib.Terminal,
  terrain: lib.Terrain,
  riffle: lib.Riffle,
  elevator: lib.Elevator,
  lockers: lib.Lockers,
  plot: lib.Plot,
  query: lib.Query,
  drawer: lib.Drawer,
  hub: lib.Hub,
  stack: lib.Stack,
} as const;

export type LibraryName = keyof typeof LIBRARY;
export type FigureName = LibraryName | (string & {});

export const isCustom = (name: string) => customFigures.includes(name);

interface FigureProps {
  name: FigureName;
  intensity?: number;
  play?: boolean;
  label?: string;
  /** Shows the figure's read-out in the corner. */
  readout?: boolean;
  /** Which surface the figure sits on, so its plates match it. */
  plate?: 'surface' | 'raised' | 'subtle';
  framed?: boolean;
  className?: string;
  style?: CSSProperties;
  onRead?: (text: string) => void;
}

/** One hairline figure, library or custom, drawn in the variant's palette (styles.css sets --hairline-*). */
export function Figure({ name, intensity = 0.5, play, label, readout, plate = 'surface', framed, className, style, onRead }: FigureProps) {
  const [text, setText] = useState('rest');
  const read = (t: string) => { setText(t); onRead?.(t); };
  const classes = cn('v2-figure', `v2-figure--${plate}`, framed && 'v2-figure--framed', className);
  const body = isCustom(name) ? (
    <Custom name={name} intensity={intensity} play={play} label={label} onRead={read} />
  ) : name in LIBRARY ? (
    (() => { const C = LIBRARY[name as LibraryName]; return <C intensity={intensity} play={play} label={label} onRead={read} theme="auto" />; })()
  ) : (
    <div style={{ aspectRatio: '5 / 4' }} className="grid place-items-center text-fg-muted text-sm">no figure “{name}”</div>
  );
  return (
    <div className={classes} style={style}>
      {body}
      {readout && <span className="v2-figure__read" aria-hidden="true">{text}</span>}
    </div>
  );
}

function Custom({ name, intensity, play, label, onRead }: { name: string; intensity: number; play?: boolean; label?: string; onRead: (t: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const handle = useRef<FigureHandle | null>(null);
  const readRef = useRef(onRead);
  readRef.current = onRead;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    loadFigure(name).then((decl) => {
      if (cancelled || !el) return;
      handle.current = mountFigure(el, decl, { intensity, play, label, onRead: (t) => readRef.current(t) });
    }).catch((e) => { console.error(e); if (el) el.textContent = String(e.message); });
    return () => { cancelled = true; handle.current?.destroy(); handle.current = null; };
    // mount once; options reach the running figure through update()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  useEffect(() => { handle.current?.update({ intensity }); }, [intensity]);
  useEffect(() => { handle.current?.update({ play }); }, [play]);
  useEffect(() => { handle.current?.update({ label }); }, [label]);

  return <div ref={ref} style={{ aspectRatio: '5 / 4' }} />;
}
