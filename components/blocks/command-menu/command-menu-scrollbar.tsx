'use client';

import * as React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';

import { cn } from '@/utils/cn';

export const CommandMenuScrollbar = React.forwardRef<
  React.ComponentRef<typeof ScrollArea.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollArea.ScrollAreaScrollbar>
>(({ className, ...rest }, ref) => (
  <ScrollArea.Scrollbar
    ref={ref}
    className={cn(
      'relative z-30 flex w-5 touch-none select-none justify-center border-l border-stroke-soft-200 bg-bg-white-0 py-1.5',
      className,
    )}
    orientation='vertical'
    {...rest}
  >
    <ScrollArea.Thumb className='!w-1 shrink-0 rounded-full bg-stroke-soft-200' />
  </ScrollArea.Scrollbar>
));
CommandMenuScrollbar.displayName = 'CommandMenuScrollbar';
