'use client';

// Shared section shell for every Settings section: title + description
// header, the section body, and an optional Discard / Apply Changes footer.
// No outer card — the section sits directly on the page background, per the
// Linear/Notion-style layout decided for Settings v2 (see docs/design-system.md
// §4.5 deviation note in app/settings/page.tsx). Bordered/ringed sub-containers
// stay scoped to list groups (members, sessions, integrations, danger zone),
// not the section shell itself.

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { cn } from '@/utils/cn';

export type SettingsSectionProps = {
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

export function SettingsSection({
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
}: SettingsSectionProps) {
  const showFooter = Boolean(onApply || onDiscard);

  return (
    <section className={cn('flex w-full flex-col gap-6', className)}>
      <div className='flex items-start gap-3.5'>
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

      <div className={cn(bodyClassName)}>{children}</div>

      {showFooter && (
        <>
          <Divider.Root />
          <div className='flex items-center justify-end gap-3'>
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
