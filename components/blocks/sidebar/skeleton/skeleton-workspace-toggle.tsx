'use client';

// Org identity row — replaces the SpotGov brand slot at the top of the
// sidebar. Conditional per the design decision: single-org accounts (~91%
// of customers, per PostHog) see a static, non-interactive identity row;
// multi-org accounts (~9%) get the same row made interactive, opening a
// popover to switch between their organizations. (The polished Paper mock
// draws the chevron unconditionally since it only shows one example state —
// this conditional behavior itself was confirmed earlier and is preserved.)
// Row spec (spacing/font/avatar radius) matches Paper node IGD-0 exactly.

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
        'flex shrink-0 items-center justify-center rounded-lg text-[12px] font-semibold text-static-white',
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
      <div className='flex shrink-0 items-center gap-1.5 p-3.5'>
        <OrgAvatar org={activeOrg} className='size-6' />
        <span className='min-w-0 flex-1 truncate text-[13px] font-semibold leading-4 text-text-strong-950'>
          {activeOrg.name}
        </span>
      </div>
    );
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type='button'
          className='flex shrink-0 items-center gap-1.5 p-3.5 text-left outline-none transition-colors hover:bg-bg-weak-50 data-[state=open]:bg-bg-weak-50'
        >
          <OrgAvatar org={activeOrg} className='size-6' />
          <span className='min-w-0 flex-1 truncate text-[13px] font-semibold leading-4 text-text-strong-950'>
            {activeOrg.name}
          </span>
          <RiExpandUpDownLine className='size-3 shrink-0 text-text-sub-600' />
        </button>
      </DropdownMenu.Trigger>
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
          'z-50 flex w-[260px] flex-col rounded-[12px] border border-stroke-soft-200 bg-bg-white-0 p-1.5 shadow-[0px_0px_24px_-12px_#0E121B33]',
          contentAnimation,
        )}
      >
        <span className='px-2.5 py-1.5 text-label-xs uppercase tracking-wide text-text-soft-400'>
          Switch workspace
        </span>
        {organizations.map((org) => (
          <DropdownMenu.Item
            key={org.id}
            onSelect={() => onSwitchOrg(org.id)}
            className='flex cursor-pointer items-center gap-2.5 rounded-10 px-2.5 py-2 text-paragraph-sm text-text-strong-950 outline-none transition-colors data-[highlighted]:bg-bg-weak-50'
          >
            <OrgAvatar org={org} className='size-6 text-[11px]' />
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
