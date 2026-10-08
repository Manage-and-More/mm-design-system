import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    // Clipboard API blocked (e.g. canvas opened outside a secure context): fall back to a selection copy.
    const area = Object.assign(document.createElement('textarea'), { value: text });
    document.body.append(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
}

const CopyIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.75" />
    <path d="M10.5 5.5V4.25A1.75 1.75 0 0 0 8.75 2.5h-4.5A1.75 1.75 0 0 0 2.5 4.25v4.5c0 .97.78 1.75 1.75 1.75H5.5" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3.5 8.5 3 3 6-7" />
  </svg>
);

interface CopyTextProps {
  text: string;
  /** Visible text; defaults to `text`. */
  label?: string;
  /** `chip` (default): outlined. `bare`: no outline, for use on colour chips and code blocks. */
  variant?: 'chip' | 'bare';
  /** Fill the available width (cards), so every chip in a grid is the same size. */
  block?: boolean;
  className?: string;
}

/** A value with a copy icon. Click copies the full value; the icon turns into a check for a moment. */
export function CopyText({ text, label, variant = 'chip', block, className }: CopyTextProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <button
      type="button"
      className={cn('pg-doc-copy', variant === 'bare' && 'pg-doc-copy--bare', block && 'pg-doc-copy--block', copied && 'is-copied', className)}
      aria-label={copied ? `Copied ${text}` : `Copy ${text}`}
      title={copied ? 'Copied' : `Copy ${text}`}
      onClick={() =>
        copy(text).then(() => {
          setCopied(true);
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setCopied(false), 1400);
        })
      }
    >
      {/* One line; long values truncate at the start, where tokens share their prefix. */}
      <span className="pg-doc-copy-text">
        <bdi>{label ?? text}</bdi>
      </span>
      <span className="pg-doc-copy-icon">{copied ? <CheckIcon /> : <CopyIcon />}</span>
    </button>
  );
}
