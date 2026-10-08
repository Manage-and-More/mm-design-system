import type { TokenOrigin } from '../../../plugins/dtcg';

const LABEL: Record<TokenOrigin, string> = { core: 'core', override: 'override', added: 'new' };

/** Shows whether a token comes from core or from the variant's tokens.json. Core is quiet. */
export function OriginBadge({ origin, always }: { origin: TokenOrigin; always?: boolean }) {
  if (origin === 'core' && !always) return null;
  return <span className={`pg-doc-badge pg-doc-badge--${origin}`}>{LABEL[origin]}</span>;
}
