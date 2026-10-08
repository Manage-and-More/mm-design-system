import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Longer explanations (design rationale, usage rules) folded behind a small toggle so the
 * value and its copy chip stay the focus. Native <details>: keyboard and find-in-page work.
 */
export function Notes({ children, label = 'Usage notes', inline }: { children: ReactNode; label?: string; inline?: boolean }) {
  return (
    <details className={cn('pg-doc-notes', inline && 'pg-doc-notes--inline')}>
      <summary>
        <svg viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
          <path d="M6.2 3.4 10.8 8l-4.6 4.6-.85-.85L9.1 8 5.35 4.25z" />
        </svg>
        {label}
      </summary>
      <div className="pg-doc-notes-body">{children}</div>
    </details>
  );
}
