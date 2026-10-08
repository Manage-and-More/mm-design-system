import { cn } from '@/lib/cn';

interface SegmentedProps<T extends string | number> {
  label: string;
  value: T;
  options: { label: string; value: T; hint?: string }[];
  onChange: (value: T) => void;
}

/** macOS-style segmented control (radio group semantics). */
export function Segmented<T extends string | number>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-[8px] bg-fill-2 p-0.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={active}
            title={o.hint}
            onClick={() => onChange(o.value)}
            className={cn(
              'h-6 min-w-9 rounded-[6px] px-2 text-[12px] font-medium tabular-nums text-fg-2 transition-[background-color,color,box-shadow] duration-150',
              active ? 'bg-control text-fg shadow-control' : 'hover:text-fg',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
