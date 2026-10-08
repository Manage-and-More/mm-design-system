import { createContext, use } from 'react';
import type { ResolvedToken } from '../tokens';
import type { VariantDefinition } from '../variant';

export const TokensContext = createContext<{ variant: VariantDefinition; tokens: ResolvedToken[] } | null>(null);

export function useTokens() {
  const ctx = use(TokensContext);
  if (!ctx) throw new Error('useTokens() must be used inside the canvas');
  return ctx;
}
