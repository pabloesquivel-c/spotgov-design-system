import { cn } from '@/utils/cn';

type SettingRowProps = {
  title: string;
  description?: React.ReactNode;
  control: React.ReactNode;
  className?: string;
};

/** Consistent label, description, and trailing-control layout for Settings. */
export function SettingRow({
  title,
  description,
  control,
  className,
}: SettingRowProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <span className='text-label-sm text-text-strong-950'>{title}</span>
        {description ? (
          <span className='text-paragraph-xs text-text-sub-600'>
            {description}
          </span>
        ) : null}
      </div>
      <div className='shrink-0'>{control}</div>
    </div>
  );
}
