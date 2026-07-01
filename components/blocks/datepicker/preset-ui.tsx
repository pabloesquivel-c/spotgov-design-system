import * as React from 'react';

import { cn } from '@/utils/cn';

export function PresetsContainer({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'w-full space-y-2 px-4 py-5 sm:border-stroke-soft-200 md:w-[200px]',
        className,
      )}
      {...rest}
    />
  );
}

export const PresetItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { isActive?: boolean }
>(({ className, isActive, ...rest }, forwardedRef) => (
  <button
    ref={forwardedRef}
    type='button'
    className={cn(
      'h-9 w-full rounded-lg px-3 text-left text-label-sm text-text-sub-600',
      'transition duration-200 ease-out hover:bg-bg-weak-50',
      { 'bg-bg-weak-50 text-text-strong-950': isActive },
      className,
    )}
    {...rest}
  />
));
PresetItem.displayName = 'PresetItem';

export function areDateRangesEqual(
  date1: { from?: Date; to?: Date } | undefined,
  date2: { from?: Date; to?: Date } | undefined,
  isSameDay: (a: Date, b: Date) => boolean,
) {
  return (
    !!date1?.from &&
    !!date2?.from &&
    !!date1?.to &&
    !!date2?.to &&
    isSameDay(date1.from, date2.from) &&
    isSameDay(date1.to, date2.to)
  );
}
