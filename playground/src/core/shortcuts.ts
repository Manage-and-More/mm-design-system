/** Keyboard shortcuts shared by the shell and the canvas (which forwards them). */

export const isTypingTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName));

/** ⌘K / Ctrl+K or `/` focuses page search; `[` and `]` step to the previous / next page. */
export function isShortcut(e: { key: string; metaKey: boolean; ctrlKey: boolean; altKey: boolean }) {
  const meta = e.metaKey || e.ctrlKey;
  if (meta && e.key.toLowerCase() === 'k') return true;
  return !meta && !e.altKey && (e.key === '/' || e.key === '[' || e.key === ']');
}
