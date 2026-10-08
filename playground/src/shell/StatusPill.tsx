import type { VariantStatus } from '@/core/variant';
import { cn } from '@/lib/cn';

const TONE: Record<VariantStatus, string> = {
  canonical: 'bg-accent/12 text-accent',
  draft: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  experimental: 'bg-fuchsia-500/12 text-fuchsia-700 dark:text-fuchsia-300',
};

export function StatusPill({ status, className }: { status: VariantStatus; className?: string }) {
  return (
    <span className={cn('inline-flex shrink-0 rounded-full px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide', TONE[status], className)}>
      {status}
    </span>
  );
}
