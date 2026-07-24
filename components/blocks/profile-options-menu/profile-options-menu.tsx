'use client';

import * as React from 'react';
import {
  RiBook3Line,
  RiChatAiLine,
  RiInformationLine,
  RiLogoutCircleRLine,
  RiQuestionLine,
  RiSettings5Line,
} from '@remixicon/react';

import * as Dropdown from '@/components/ui/dropdown';
import { useHoverCloseMenu } from '@/hooks/use-hover-close-menu';
import { cn } from '@/utils/cn';

export type ProfileOptionsAction =
  'settings' | 'help' | 'learn-more' | 'docs' | 'contact';

export type ProfileOptionsMenuProps = {
  email: string;
  version?: string;
  links?: Partial<Record<ProfileOptionsAction, string>>;
  termsHref?: string;
  onAction?: (action: ProfileOptionsAction) => void;
  onSignOut?: () => void;
  onOpenChange?: (open: boolean) => void;
  contentAlignOffset?: number;
  defaultOpen?: boolean;
  children: React.ReactElement;
};

type MenuItem = {
  action: ProfileOptionsAction;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SUPPORT_ITEMS: MenuItem[] = [
  { action: 'help', label: 'Help', icon: RiQuestionLine },
  { action: 'learn-more', label: 'Learn more', icon: RiInformationLine },
  { action: 'docs', label: 'Docs', icon: RiBook3Line },
  { action: 'contact', label: 'Contact us', icon: RiChatAiLine },
];

/**
 * An account menu with navigation owned by the consuming application. URLs
 * render as links; actions without a URL are handed to the supplied callback.
 */
export function ProfileOptionsMenu({
  email,
  version = 'v2.8.69',
  links,
  termsHref = '/terms',
  onAction,
  onSignOut,
  onOpenChange: onOpenChangeCallback,
  contentAlignOffset,
  defaultOpen,
  children,
}: ProfileOptionsMenuProps) {
  const { open, onOpenChange, cancelClose, scheduleClose } = useHoverCloseMenu(
    500,
    defaultOpen,
  );

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);
    onOpenChangeCallback?.(nextOpen);
  }

  return (
    <Dropdown.Root open={open} onOpenChange={handleOpenChange}>
      <Dropdown.Trigger asChild>{children}</Dropdown.Trigger>
      <Dropdown.Content
        side='right'
        align='end'
        alignOffset={contentAlignOffset}
        sideOffset={12}
        collisionPadding={16}
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
        className='w-[255px] max-w-[calc(100vw-32px)] gap-1 rounded-2xl p-2.5'
      >
        <Dropdown.Label className='px-2 py-1 text-label-xs normal-case text-text-sub-600'>
          {email}
        </Dropdown.Label>
        <ProfileOptionsItem
          item={{
            action: 'settings',
            label: 'Settings',
            icon: RiSettings5Line,
          }}
          href={links?.settings}
          onAction={onAction}
        />

        <Dropdown.Label className='px-2 py-1 text-label-xs normal-case text-text-sub-600'>
          Support
        </Dropdown.Label>
        {SUPPORT_ITEMS.map((item) => (
          <ProfileOptionsItem
            key={item.action}
            item={item}
            href={links?.[item.action]}
            onAction={onAction}
          />
        ))}

        <Dropdown.Separator className='my-0.5 h-px bg-stroke-soft-200' />
        <Dropdown.Item
          onSelect={onSignOut}
          className='min-h-9 gap-2 p-2 text-text-strong-950'
        >
          <RiLogoutCircleRLine className='size-5 shrink-0 text-text-strong-950' />
          <span className='text-label-sm'>Sign out</span>
        </Dropdown.Item>
        <a
          href={termsHref}
          className='rounded-lg p-2 text-label-xs text-text-sub-600 outline-none transition duration-200 ease-out hover:bg-bg-weak-50 focus-visible:bg-bg-weak-50 focus-visible:ring-2 focus-visible:ring-primary-base'
        >
          {version} · Terms &amp; Conditions
        </a>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

function ProfileOptionsItem({
  item,
  href,
  onAction,
}: {
  item: MenuItem;
  href?: string;
  onAction?: (action: ProfileOptionsAction) => void;
}) {
  const Icon = item.icon;
  const className = cn(
    'min-h-9 gap-2 p-2 text-text-sub-600',
    item.action === 'help' && 'data-[highlighted]:text-text-strong-950',
  );

  if (href) {
    const isExternal =
      href.startsWith('http://') || href.startsWith('https://');

    return (
      <Dropdown.Item asChild className={className}>
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noreferrer' : undefined}
        >
          <Icon className='size-5 shrink-0' />
          <span className='text-label-sm'>{item.label}</span>
        </a>
      </Dropdown.Item>
    );
  }

  return (
    <Dropdown.Item
      onSelect={() => onAction?.(item.action)}
      className={className}
    >
      <Icon className='size-5 shrink-0' />
      <span className='text-label-sm'>{item.label}</span>
    </Dropdown.Item>
  );
}
