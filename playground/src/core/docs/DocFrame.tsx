import type { ReactNode } from 'react';
import type { PageDefinition, VariantDefinition } from '../variant';

/** Neutral docs chrome around `padded` pages. Inherits the variant's font and colours. */
export function DocFrame({ page, variant, children }: { page: PageDefinition; variant: VariantDefinition; children: ReactNode }) {
  return (
    <div className="pg-doc">
      <header className="pg-doc-header">
        <p className="pg-doc-eyebrow">
          {variant.name} · {page.group}
        </p>
        <p className="pg-doc-title">{page.title}</p>
        {page.summary && <p className="pg-doc-summary">{page.summary}</p>}
      </header>
      {children}
    </div>
  );
}

export function DocSection({ title, description, children }: { title: string; description?: ReactNode; children: ReactNode }) {
  return (
    <section className="pg-doc-section">
      <div className="pg-doc-section-head">
        <p className="pg-doc-section-title">{title}</p>
        {description && <p className="pg-doc-section-desc">{description}</p>}
      </div>
      {children}
    </section>
  );
}
