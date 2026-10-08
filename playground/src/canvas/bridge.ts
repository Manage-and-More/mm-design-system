import type { Mode } from '@/core/variant';

/** Messages between the shell (parent window) and a canvas iframe. Same origin only. */
export type ShellMessage = { source: 'mm-shell'; type: 'mode'; mode: Mode };
export type CanvasMessage =
  | { source: 'mm-canvas'; type: 'ready'; variant: string; page: string }
  | { source: 'mm-canvas'; type: 'error'; message: string }
  /** Content height of a page-scroll canvas, so the shell can size the iframe to fit. */
  | { source: 'mm-canvas'; type: 'height'; height: number }
  /** Playground shortcuts pressed while focus is inside the canvas. */
  | { source: 'mm-canvas'; type: 'key'; key: string; meta: boolean };

/** Omit that keeps union members apart. */
type Payload<T> = T extends unknown ? Omit<T, 'source'> : never;

export const isShellMessage = (data: unknown): data is ShellMessage =>
  typeof data === 'object' && data !== null && (data as ShellMessage).source === 'mm-shell';

export const isCanvasMessage = (data: unknown): data is CanvasMessage =>
  typeof data === 'object' && data !== null && (data as CanvasMessage).source === 'mm-canvas';

export function postToShell(message: Payload<CanvasMessage>) {
  if (window.parent !== window) window.parent.postMessage({ source: 'mm-canvas', ...message }, location.origin);
}

export function postToCanvas(frame: HTMLIFrameElement | null, message: Payload<ShellMessage>) {
  frame?.contentWindow?.postMessage({ source: 'mm-shell', ...message }, location.origin);
}

export const canvasUrl = (variant: string, page: string, mode?: Mode) => {
  const params = new URLSearchParams({ variant, page });
  if (mode && mode !== 'light') params.set('mode', mode);
  return `/canvas.html?${params}`;
};
