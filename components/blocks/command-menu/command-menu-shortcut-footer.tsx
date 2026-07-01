'use client';

import {
  RiArrowDownLine,
  RiArrowUpLine,
} from '@remixicon/react';

import * as CommandMenu from '@/components/ui/command-menu';
import * as Kbd from '@/components/ui/kbd';

export function CommandMenuShortcutFooter() {
  return (
    <CommandMenu.Footer className='flex h-14 min-w-0 items-center justify-between border-t border-stroke-soft-200 bg-bg-weak-50 px-5 py-[18px] text-paragraph-xs text-text-sub-600'>
      <div className='hidden items-center gap-2 md:flex'>
        <span className='text-label-sm text-text-sub-600'>Use</span>
        <Kbd.Root className='flex size-5 items-center justify-center text-text-sub-600 shadow-regular-xs ring-0'>
          <RiArrowUpLine className='size-icon shrink-0' />
        </Kbd.Root>
        <Kbd.Root className='flex size-5 items-center justify-center text-text-sub-600 shadow-regular-xs ring-0'>
          <RiArrowDownLine className='size-icon shrink-0' />
        </Kbd.Root>
        <span className='text-label-sm text-text-sub-600'>to navigate</span>
      </div>
      <div className='hidden items-center gap-2 md:flex'>
        <span className='text-label-sm text-text-sub-600'>Type</span>
        <Kbd.Root className='flex size-5 items-center justify-center shadow-regular-xs ring-0'>
          <span className='flex size-icon-inline shrink-0 items-center justify-center text-label-xs text-text-sub-600'>
            /
          </span>
        </Kbd.Root>
        <span className='text-label-sm text-text-sub-600'>for commands</span>
      </div>
    </CommandMenu.Footer>
  );
}
