'use client';

import { RiCloseLine, RiSearch2Line } from '@remixicon/react';

import * as CompactButton from '@/components/ui/compact-button';
import * as CommandMenu from '@/components/ui/command-menu';
import * as Kbd from '@/components/ui/kbd';
import { cn } from '@/utils/cn';

export function CommandMenuSearchHeader({
  placeholder = 'Search or jump to',
  onClose,
  showClose = true,
  className,
}: {
  placeholder?: string;
  onClose?: () => void;
  showClose?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'group/cmd-input flex h-12 w-full items-center gap-2 bg-bg-white-0 px-5',
        className,
      )}
    >
      <RiSearch2Line
        className={cn(
          'size-5 shrink-0 text-text-soft-400',
          'transition duration-200 ease-out',
          'group-focus-within/cmd-input:text-primary-base',
        )}
      />
      <CommandMenu.Input placeholder={placeholder} />
      <Kbd.Root>⌘K</Kbd.Root>
      {showClose && onClose && (
        <CompactButton.Root
          size='medium'
          variant='ghost'
          onClick={onClose}
        >
          <CompactButton.Icon as={RiCloseLine} />
        </CompactButton.Root>
      )}
    </div>
  );
}
