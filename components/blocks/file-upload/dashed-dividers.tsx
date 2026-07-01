import { cn } from '@/utils/cn';

export function DashedDividerHorizontal({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      className={cn('relative h-0 w-full text-stroke-soft-200', className)}
      role='separator'
    >
      <div
        className='absolute left-0 h-px w-full'
        style={{
          background:
            'linear-gradient(90deg, currentColor 4px, transparent 4px) 50% 50% / 8px 1px repeat no-repeat',
        }}
      />
    </div>
  );
}

export function DashedDividerVertical({ className }: { className?: string }) {
  return (
    <div
      className={cn('relative text-stroke-soft-200', className)}
      role='separator'
    >
      <div
        className='absolute left-0 h-full w-full'
        style={{
          background:
            'linear-gradient(180deg, currentColor 4px, transparent 4px) 50% 50% / 1px 8px repeat-y',
        }}
      />
    </div>
  );
}
