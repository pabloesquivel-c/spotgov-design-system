'use client';

// Shared card shell for every Settings section: icon + title + description
// header, a divider, the section body, and an optional Discard / Apply Changes
// footer. Follows the "Settings section" pattern in docs/component-patterns.md
// (Apply Changes / Discard verbs, one primary action, footer enabled only when
// there are unsaved changes).

import type { RemixiconComponentType } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { cn } from '@/utils/cn';

export type SettingsCardProps = {
  icon?: RemixiconComponentType;
  title: string;
  description?: string;
  /** Optional element rendered on the right of the header (e.g. an action). */
  headerAction?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  /** When set, renders the Discard / Apply Changes footer. */
  dirty?: boolean;
  onDiscard?: () => void;
  onApply?: () => void;
  applyLabel?: string;
};

export function SettingsCard({
  icon: Icon,
  title,
  description,
  headerAction,
  children,
  className,
  bodyClassName,
  dirty,
  onDiscard,
  onApply,
  applyLabel = 'Apply Changes',
}: SettingsCardProps) {
  const showFooter = Boolean(onApply || onDiscard);

  return (
    <section
      className={cn(
        'w-full overflow-hidden rounded-2xl bg-bg-white-0 shadow-regular-xs ring-1 ring-stroke-soft-200',
        className,
      )}
    >
      <div className='flex items-start gap-3.5 p-5'>
        {Icon && (
          <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
            <Icon className='size-5 text-text-sub-600' />
          </div>
        )}
        <div className='min-w-0 flex-1'>
          <h2 className='text-label-md text-text-strong-950'>{title}</h2>
          {description && (
            <p className='mt-1 text-paragraph-sm text-text-sub-600'>
              {description}
            </p>
          )}
        </div>
        {headerAction && <div className='shrink-0'>{headerAction}</div>}
      </div>

      <Divider.Root />

      <div className={cn('p-5', bodyClassName)}>{children}</div>

      {showFooter && (
        <>
          <Divider.Root />
          <div className='flex items-center justify-end gap-3 p-5'>
            {onDiscard && (
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='small'
                disabled={!dirty}
                onClick={onDiscard}
              >
                Discard
              </Button.Root>
            )}
            {onApply && (
              <Button.Root
                variant='primary'
                size='small'
                disabled={!dirty}
                onClick={onApply}
              >
                {applyLabel}
              </Button.Root>
            )}
          </div>
        </>
      )}
    </section>
  );
}
