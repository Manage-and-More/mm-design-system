import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

interface CardFooterProps {
  /** Short, single-line info on the left (source, rights flag). */
  meta?: ReactNode;
  /** Heading of the notes panel. */
  title: string;
  /** Longer explanation. When present, a Notes button opens it over the card. */
  notes?: ReactNode;
}

/**
 * Same footer on every card, so cards line up whatever they contain. Notes slide up over
 * the card instead of expanding it: card heights never change, at any screen width.
 * Place inside a card with `position: relative` (`.pg-doc-swatch`).
 */
export function CardFooter({ meta, title, notes }: CardFooterProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const opened = useRef(false);

  useEffect(() => {
    if (open) close.current?.focus();
    else if (opened.current) trigger.current?.focus();
    opened.current = open;
  }, [open]);

  return (
    <>
      <div className="pg-doc-card-footer">
        <span className="pg-doc-card-meta">{meta}</span>
        {notes && (
          <button ref={trigger} type="button" className="pg-doc-card-notes-btn" aria-expanded={open} aria-controls={id} onClick={() => setOpen(true)}>
            <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.3">
              <circle cx="8" cy="8" r="5.75" />
              <path d="M8 7.25v3.5" strokeLinecap="round" />
              <circle cx="8" cy="5.1" r="0.4" fill="currentColor" />
            </svg>
            Notes
          </button>
        )}
      </div>
      {notes && (
        <div
          id={id}
          role="region"
          aria-label={`${title} notes`}
          className="pg-doc-card-notes"
          data-open={open || undefined}
          inert={!open}
          onKeyDown={(e) => e.key === 'Escape' && (e.stopPropagation(), setOpen(false))}
        >
          <div className="pg-doc-card-notes-head">
            <span>{title}</span>
            <button ref={close} type="button" aria-label="Close notes" onClick={() => setOpen(false)}>
              <svg viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="m4.5 4.5 7 7m0-7-7 7" />
              </svg>
            </button>
          </div>
          <div className="pg-doc-card-notes-body">{notes}</div>
        </div>
      )}
    </>
  );
}
