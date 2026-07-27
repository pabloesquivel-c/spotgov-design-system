import { cn } from '@/utils/cn';

type SettingRowProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  control: React.ReactNode;
  className?: string;
  /** Overrides the default w-80 (320px) control column width. */
  controlClassName?: string;
};

/**
 * Consistent label, description, and trailing-control layout for a settings
 * row. Rows are meant to sit inside a `divide-y divide-dashed
 * divide-stroke-soft-200` list (not individually wrapped with
 * `Divider.Root`) — the Figma "Settings" frame gives every Row/Divider a
 * 20px gap, so the 0-height divider sits at the midpoint of a 40px gap
 * between rows; `py-5` on each row reproduces that.
 */
export function SettingRow({
  title,
  description,
  control,
  className,
  controlClassName,
}: SettingRowProps) {
  return (
    <div
      className={cn(
        'flex min-h-10 items-start justify-between gap-6 py-5 first:pt-0 last:pb-0',
        className,
      )}
    >
      <div className='flex min-w-0 flex-1 flex-col gap-1'>
        <span className='text-label-sm text-text-strong-950'>{title}</span>
        {description ? (
          <span className='text-paragraph-xs text-text-sub-600'>
            {description}
          </span>
        ) : null}
      </div>
      <div className={cn('flex w-80 shrink-0 justify-end', controlClassName)}>
        {control}
      </div>
    </div>
  );
}
