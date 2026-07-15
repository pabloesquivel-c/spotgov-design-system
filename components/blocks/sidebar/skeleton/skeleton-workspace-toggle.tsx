'use client';

// Org identity row — replaces the SpotGov brand slot at the top of the
// sidebar. Conditional per the design decision: single-org accounts (~91%
// of customers, per PostHog) see a static, non-interactive identity row;
// multi-org accounts (~9%) get the same row made interactive, opening a
// popover to switch between their organizations.
// Row spec matches Paper node J5B-0 (hover state); menu spec matches J5I-0.
// Only the chevron square is the click/hover target — not the full row.

import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiExpandUpDownLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import { useCollisionBoundary } from '@/components/collision-boundary';
import type { CurrentOrg } from './skeleton-mock-session';

const contentAnimation =
  'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95';

function OrgAvatar({ org, className }: { org: CurrentOrg; className?: string }) {
  return (
    <span
      className={cn(
        'flex size-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-static-white',
        className,
      )}
      style={{
        backgroundImage: 'linear-gradient(135deg, #4b6bff 0%, #2547d0 100%)',
      }}
    >
      {org.initials}
    </span>
  );
}

export function SkeletonWorkspaceToggle({
  organizations,
  activeOrgId,
  onSwitchOrg,
}: {
  organizations: CurrentOrg[];
  activeOrgId: string;
  onSwitchOrg: (orgId: string) => void;
}) {
  const collisionBoundary = useCollisionBoundary();
  const activeOrg =
    organizations.find((org) => org.id === activeOrgId) ?? organizations[0];
  const isMultiOrg = organizations.length > 1;

  if (!isMultiOrg) {
    return (
      <div className='flex shrink-0 items-center gap-1.5 py-3.5 pl-4 pr-2'>
        <OrgAvatar org={activeOrg} />
        <span className='min-w-0 flex-1 truncate text-[13px] font-semibold leading-4 text-text-strong-950'>
          {activeOrg.name}
        </span>
      </div>
    );
  }

  return (
    <DropdownMenu.Root>
      <div className='flex shrink-0 items-center gap-1.5 py-3.5 pl-4 pr-2'>
        <OrgAvatar org={activeOrg} />
        <span className='min-w-0 flex-1 truncate text-[13px] font-semibold leading-4 text-text-strong-950'>
          {activeOrg.name}
        </span>
        <DropdownMenu.Trigger asChild>
          <button
            type='button'
            aria-label='Switch workspace'
            className='flex shrink-0 items-center justify-center gap-1.5 rounded-10 p-2 outline-none transition-colors hover:bg-bg-soft-200 data-[state=open]:bg-bg-soft-200'
          >
            <RiExpandUpDownLine className='size-3 shrink-0 text-text-sub-600' />
          </button>
        </DropdownMenu.Trigger>
      </div>
      <SwitchWorkspaceMenu
        organizations={organizations}
        activeOrgId={activeOrgId}
        onSwitchOrg={onSwitchOrg}
        collisionBoundary={collisionBoundary}
      />
    </DropdownMenu.Root>
  );
}

function SwitchWorkspaceMenu({
  organizations,
  activeOrgId,
  onSwitchOrg,
  collisionBoundary,
}: {
  organizations: CurrentOrg[];
  activeOrgId: string;
  onSwitchOrg: (orgId: string) => void;
  collisionBoundary: Element | undefined;
}) {
  return (
    <DropdownMenu.Portal>
      <DropdownMenu.Content
        side='right'
        align='start'
        sideOffset={20}
        collisionBoundary={collisionBoundary}
        collisionPadding={8}
        className={cn(
          'z-50 flex w-[260px] flex-col rounded-10 border border-stroke-soft-200 bg-bg-white-0 px-1.5 pb-1.5 pt-1 shadow-[0px_0px_24px_-12px_#0E121B33]',
          contentAnimation,
        )}
      >
        <span className='px-2 py-1.5 text-[10px] font-semibold uppercase leading-3 tracking-[0.06em] text-text-sub-600'>
          Switch workspace
        </span>
        {organizations.map((org) => (
          <DropdownMenu.Item
            key={org.id}
            onSelect={() => onSwitchOrg(org.id)}
            className='flex cursor-pointer items-center gap-1.5 rounded-10 px-2 py-1.5 text-[13px] font-medium leading-4 text-text-sub-600 outline-none transition-colors data-[highlighted]:bg-bg-weak-50'
          >
            <OrgAvatar org={org} className='text-[11px]' />
            <span className='line-clamp-1 flex-1'>{org.name}</span>
            {org.id === activeOrgId && (
              <span className='size-[7px] shrink-0 rounded-full bg-primary-base' />
            )}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  );
}
