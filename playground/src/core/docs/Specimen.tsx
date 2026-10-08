import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CopyText } from './CopyText';

interface SpecimenProps {
  title: string;
  description?: ReactNode;
  /** Classes for the preview area, e.g. a variant surface class ("mm-surface-black"). */
  surface?: string;
  /** Source shown in a collapsible code block. */
  code?: string;
  /** Remove preview padding (full-bleed patterns). */
  bleed?: boolean;
  children: ReactNode;
}

/** One example of a component or pattern: label, live preview, optional code. */
export function Specimen({ title, description, surface, code, bleed, children }: SpecimenProps) {
  return (
    <figure className="pg-doc-specimen">
      <figcaption className="pg-doc-specimen-head">
        <span className="pg-doc-specimen-title">{title}</span>
        {description && <span className="pg-doc-specimen-desc">{description}</span>}
      </figcaption>
      <div className={cn('pg-doc-specimen-preview', bleed && 'pg-doc-specimen-preview--bleed', surface)}>{children}</div>
      {code && (
        <details className="pg-doc-code">
          <summary>Code</summary>
          <CopyText text={code.trim()} label="Copy" />
          <pre>
            <code>{code.trim()}</code>
          </pre>
        </details>
      )}
    </figure>
  );
}
