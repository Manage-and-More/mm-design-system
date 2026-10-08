import { getPage, getVariant, variants } from '@/core/registry';
import { VIEWPORT_PRESETS, type ShellState, type Viewport } from '@/core/url-state';
import { canvasUrl } from '@/canvas/bridge';
import { cn } from '@/lib/cn';
import { MenuItem, Popover } from './Popover';
import { Segmented } from './Segmented';
import { StatusPill } from './StatusPill';

interface ToolbarProps {
  state: ShellState;
  update: (next: Partial<ShellState>) => void;
  onReload: () => void;
  onToggleSidebar: () => void;
}

const iconButton =
  'grid size-7 place-items-center rounded-md text-fg-2 transition-colors duration-150 hover:bg-fill-2 hover:text-fg aria-pressed:bg-fill-2 aria-pressed:text-fg';

export function Toolbar({ state, update, onReload, onToggleSidebar }: ToolbarProps) {
  const variant = getVariant(state.variantId)!;
  const page = getPage(variant, state.pageSlug);
  const compareVariant = getVariant(state.compare ?? undefined);
  const modes = new Set([...(variant.modes ?? ['light']), ...(compareVariant?.modes ?? [])]);
  const presetValues = VIEWPORT_PRESETS.map((p) => p.value);
  const viewportOptions = presetValues.includes(state.viewport)
    ? VIEWPORT_PRESETS
    : [...VIEWPORT_PRESETS, { label: String(state.viewport), value: state.viewport, hint: 'Custom width (drag the frame edge)' }];

  return (
    <header className="sticky top-0 z-10 flex h-[52px] min-w-0 items-center gap-3 border-b border-line bg-window/80 px-3 backdrop-blur-xl backdrop-saturate-150">
      <button type="button" className={cn(iconButton, 'md:hidden')} onClick={onToggleSidebar} aria-label="Show pages">
        <svg viewBox="0 0 16 16" className="size-4" fill="currentColor" aria-hidden>
          <path d="M2 3.5h12v1.2H2zM2 7.4h12v1.2H2zM2 11.3h12v1.2H2z" />
        </svg>
      </button>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold">{page?.title}</p>
        {page?.summary && <p className="truncate text-[11px] text-fg-2">{page.summary}</p>}
      </div>

      {modes.has('dark') && (
        <Segmented
          label="Colour mode"
          value={state.mode}
          options={[
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ]}
          onChange={(mode) => update({ mode })}
        />
      )}

      <div className="hidden lg:block">
        <Segmented<Viewport> label="Viewport width" value={state.viewport} options={viewportOptions} onChange={(viewport) => update({ viewport })} />
      </div>

      <Popover
        align="end"
        className="w-[240px]"
        triggerClassName={cn(
          'flex h-7 items-center gap-1.5 rounded-md px-2 text-[12px] font-medium transition-colors duration-150',
          compareVariant ? 'bg-accent text-white' : 'text-fg-2 hover:bg-fill-2 hover:text-fg',
        )}
        trigger={
          <>
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden>
              <path d="M1.5 2.5h5.75v11H1.5zm1.2 1.2v8.6h3.35V3.7zM8.75 2.5h5.75v11H8.75z" />
            </svg>
            {compareVariant ? `vs ${compareVariant.name}` : 'Compare'}
          </>
        }
        triggerLabel="Compare with another variant"
      >
        {(close) => (
          <>
            <p className="px-2 pt-1 pb-1.5 text-[11px] font-semibold text-fg-3">Compare {variant.name} with</p>
            <MenuItem selected={!compareVariant} onSelect={() => (close(), update({ compare: null }))}>
              Off
            </MenuItem>
            {variants
              .filter((v) => v.id !== variant.id)
              .map((v) => (
                <MenuItem key={v.id} selected={v.id === compareVariant?.id} onSelect={() => (close(), update({ compare: v.id }))}>
                  <span className="flex items-center gap-2">
                    {v.name} <StatusPill status={v.status} />
                  </span>
                </MenuItem>
              ))}
            {variants.length < 2 && <p className="px-2 py-1.5 text-[11px] text-fg-3">Add a second variant to compare.</p>}
          </>
        )}
      </Popover>

      <div className="flex items-center gap-0.5">
        <button type="button" className={iconButton} onClick={onReload} aria-label="Reload canvas" title="Reload canvas">
          <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden>
            <path d="M8 2.5a5.5 5.5 0 1 0 5.4 6.5h-1.24A4.3 4.3 0 1 1 8 3.7c1.2 0 2.27.49 3.05 1.28L9.3 6.75h4.2v-4.2l-1.6 1.6A5.48 5.48 0 0 0 8 2.5Z" />
          </svg>
        </button>
        <a
          className={iconButton}
          href={canvasUrl(variant.id, state.pageSlug, state.mode)}
          target="_blank"
          rel="noreferrer"
          aria-label="Open canvas in a new tab"
          title="Open canvas in a new tab"
        >
          <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden>
            <path d="M9 2.5h4.5V7h-1.2V4.55L7.4 9.45l-.85-.85 4.9-4.9H9zM2.5 4.5h4.5v1.2H3.7v6.6h6.6V9h1.2v4.5h-9z" />
          </svg>
        </a>
      </div>
    </header>
  );
}
