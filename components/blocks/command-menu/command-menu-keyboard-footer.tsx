'use client';

import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiCornerDownLeftLine,
} from '@remixicon/react';

import * as CommandMenu from '@/components/ui/command-menu';
import * as LinkButton from '@/components/ui/link-button';
import { cn } from '@/utils/cn';

export function CommandMenuKeyboardFooter({
  className,
  helpText = "Not what you're looking for? Try the",
  helpLinkLabel = 'Help Center',
  labelTone = 'sub',
}: {
  className?: string;
  helpText?: string;
  helpLinkLabel?: string;
  labelTone?: 'sub' | 'soft';
}) {
  const labelClass =
    labelTone === 'soft' ? 'text-label-sm text-text-soft-400' : 'text-paragraph-xs text-text-sub-600';

  return (
    <CommandMenu.Footer className={className}>
      <div className='hidden gap-3 md:flex'>
        <div className='flex items-center gap-2'>
          <CommandMenu.FooterKeyBox>
            <RiArrowUpLine className='size-4' />
          </CommandMenu.FooterKeyBox>
          <CommandMenu.FooterKeyBox>
            <RiArrowDownLine className='size-4' />
          </CommandMenu.FooterKeyBox>
          <span className={labelClass}>Navigate</span>
        </div>
        <div className='flex items-center gap-2'>
          <CommandMenu.FooterKeyBox>
            <RiCornerDownLeftLine className='size-4' />
          </CommandMenu.FooterKeyBox>
          <span className={labelClass}>Select</span>
        </div>
      </div>
      <div className={cn('w-full text-right md:w-auto', labelClass)}>
        {helpText}{' '}
        <LinkButton.Root size='small' variant='primary' underline>
          {helpLinkLabel}
        </LinkButton.Root>
      </div>
    </CommandMenu.Footer>
  );
}
