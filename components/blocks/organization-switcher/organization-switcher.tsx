'use client';

import * as React from 'react';

import * as Dropdown from '@/components/ui/dropdown';
import { useHoverCloseMenu } from '@/hooks/use-hover-close-menu';
import { cn } from '@/utils/cn';

export type Organization = {
  id: string;
  name: string;
  initials: string;
  logoUrl?: string;
};

export type OrganizationSwitcherProps = {
  organizations: Organization[];
  activeOrganizationId: string;
  onOrganizationChange: (organizationId: string) => void;
  defaultOpen?: boolean;
  contentSide?: React.ComponentPropsWithoutRef<typeof Dropdown.Content>['side'];
  contentAlign?: React.ComponentPropsWithoutRef<
    typeof Dropdown.Content
  >['align'];
  contentAlignOffset?: number;
  contentSideOffset?: number;
  contentCollisionPadding?: number;
  contentClassName?: string;
  children: React.ReactElement;
};

/**
 * A workspace-scoped organization switcher. The caller owns session data and
 * navigation so this block can be used from any app-shell trigger.
 */
export function OrganizationSwitcher({
  organizations,
  activeOrganizationId,
  onOrganizationChange,
  defaultOpen,
  contentSide = 'bottom',
  contentAlign = 'start',
  contentAlignOffset,
  contentSideOffset,
  contentCollisionPadding = 16,
  contentClassName,
  children,
}: OrganizationSwitcherProps) {
  const { open, onOpenChange, cancelClose, scheduleClose } = useHoverCloseMenu(
    500,
    defaultOpen,
  );

  if (organizations.length === 0) {
    return children;
  }

  return (
    <Dropdown.Root open={open} onOpenChange={onOpenChange}>
      <Dropdown.Trigger asChild>{children}</Dropdown.Trigger>
      <Dropdown.Content
        side={contentSide}
        align={contentAlign}
        alignOffset={contentAlignOffset}
        sideOffset={contentSideOffset}
        collisionPadding={contentCollisionPadding}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className={cn('w-[260px] gap-1 p-2.5', contentClassName)}
      >
        <Dropdown.Label className='px-2 py-1 text-label-xs normal-case text-text-sub-600'>
          Switch Workspace
        </Dropdown.Label>
        <Dropdown.Group className='gap-1'>
          {organizations.map((organization) => {
            const isCurrent = organization.id === activeOrganizationId;

            return (
              <Dropdown.Item
                key={organization.id}
                aria-current={isCurrent ? 'true' : undefined}
                onSelect={() => onOrganizationChange(organization.id)}
                className={cn(
                  'min-h-9 gap-2 rounded-lg p-2 text-text-sub-600 data-[highlighted]:text-text-strong-950',
                  isCurrent &&
                    'bg-bg-weak-50 text-text-strong-950 data-[highlighted]:bg-bg-weak-50',
                )}
              >
                <OrganizationIdentity organization={organization} />
                <span className='min-w-0 flex-1 truncate text-label-sm'>
                  {organization.name}
                </span>
                {isCurrent && (
                  <span className='rounded-full bg-information-lighter px-2 py-0.5 text-label-xs text-information-base'>
                    Current
                  </span>
                )}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

function OrganizationIdentity({
  organization,
}: {
  organization: Organization;
}) {
  if (organization.logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- organization logos are supplied by the application session and may use its CDN.
      <img
        alt=''
        src={organization.logoUrl}
        className='size-5 shrink-0 rounded-full object-cover'
      />
    );
  }

  return (
    <span
      aria-hidden='true'
      className='flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-base text-label-xs text-static-white'
    >
      {organization.initials}
    </span>
  );
}
