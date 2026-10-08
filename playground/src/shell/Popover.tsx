import { useId, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface PopoverProps {
  trigger: ReactNode;
  triggerClassName?: string;
  triggerLabel?: string;
  align?: 'start' | 'end';
  className?: string;
  children: (close: () => void) => ReactNode;
}

/**
 * Native Popover API menu (top layer, light dismiss, Esc). Anchor positioning is not
 * broadly available yet, so the panel is placed next to its trigger on `beforetoggle`.
 */
export function Popover({ trigger, triggerClassName, triggerLabel, align = 'start', className, children }: PopoverProps) {
  const id = useId();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const place = (event: Event) => {
    if ((event as ToggleEvent).newState !== 'open' || !button.current || !panel.current) return;
    const r = button.current.getBoundingClientRect();
    const p = panel.current;
    p.style.top = `${r.bottom + 6}px`;
    if (align === 'end') {
      p.style.left = 'auto';
      p.style.right = `${window.innerWidth - r.right}px`;
      p.style.transformOrigin = 'top right';
    } else {
      p.style.right = 'auto';
      p.style.left = `${r.left}px`;
    }
  };

  const close = () => panel.current?.hidePopover();

  return (
    <>
      <button ref={button} type="button" popoverTarget={id} className={triggerClassName} aria-label={triggerLabel}>
        {trigger}
      </button>
      <div
        ref={(node) => {
          panel.current = node;
          node?.addEventListener('beforetoggle', place);
          return () => node?.removeEventListener('beforetoggle', place);
        }}
        id={id}
        popover="auto"
        className={cn('pg-popover', className)}
      >
        {children(close)}
      </div>
    </>
  );
}

export function MenuItem({ selected, onSelect, children }: { selected?: boolean; onSelect: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected || undefined}
      className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left transition-colors duration-150 hover:bg-accent hover:text-white [&:hover_*]:text-white/80"
    >
      <span className={cn('mt-px w-3 shrink-0 text-[11px]', !selected && 'invisible')}>✓</span>
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}
