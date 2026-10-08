import { getPage, getVariant } from '@/core/registry';
import type { ShellState } from '@/core/url-state';
import { scrollModeOf } from '@/core/variant';
import { cn } from '@/lib/cn';
import { CanvasFrame } from './CanvasFrame';
import { StatusPill } from './StatusPill';

interface StageProps {
  state: ShellState;
  update: (next: Partial<ShellState>) => void;
  reloadKey: number;
}

function Pane({ variantId, state, update, reloadKey, labelled }: StageProps & { variantId: string; labelled: boolean }) {
  const variant = getVariant(variantId);
  const page = variant && getPage(variant, state.pageSlug);
  const label = labelled && variant && (
    <>
      {variant.name} <StatusPill status={variant.status} />
    </>
  );
  if (!page)
    return (
      <div className="flex min-w-0 flex-1 flex-col">
        {labelled && <div className="mb-2 flex h-6 items-center gap-2 px-1 text-[12px] font-semibold">{label}</div>}
        <div className="grid min-h-[320px] flex-1 place-items-center rounded-[10px] border border-dashed border-line text-fg-3">
          {variant ? `“${state.pageSlug}” is not part of ${variant.name}.` : `Unknown variant “${variantId}”.`}
        </div>
      </div>
    );
  return (
    <CanvasFrame
      variantId={variantId}
      pageSlug={page.slug}
      mode={(variant.modes ?? ['light']).includes(state.mode) ? state.mode : 'light'}
      viewport={state.viewport}
      scroll={scrollModeOf(page)}
      reloadKey={reloadKey}
      label={label}
      onViewportChange={(viewport) => update({ viewport })}
    />
  );
}

/** The canvas area: one frame, or two side by side in Compare. It scrolls with the window. */
export function Stage(props: StageProps) {
  const { state } = props;
  const compare = state.compare && state.compare !== state.variantId ? state.compare : null;
  return (
    <div className={cn('flex min-h-[calc(100dvh-52px)] items-start gap-4 bg-stage p-3', state.viewport !== 'fill' && 'px-6')}>
      <Pane {...props} variantId={state.variantId} labelled={!!compare} />
      {compare && <Pane {...props} variantId={compare} labelled />}
    </div>
  );
}
