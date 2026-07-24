'use client';

import * as React from 'react';
import {
  RiArrowRightSLine,
  RiBrainLine,
  RiArrowLeftRightLine,
  RiVoiceRecognitionLine,
  RiLineChartLine,
  RiHistoryLine,
  RiStackLine,
  RiExpandUpDownLine,
  RiNotification3Line,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import * as CompactButton from '@/components/ui/compact-button';
import {
  OrganizationSwitcher,
  type Organization,
} from '@/components/blocks/organization-switcher/organization-switcher';
import {
  ProfileOptionsMenu,
  type ProfileOptionsAction,
} from '@/components/blocks/profile-options-menu/profile-options-menu';
import { OrgMark } from './assets/org-mark';

export type SideNavbarProps = {
  onOrganizationChange?: (organizationId: string) => void;
  organizationPlan?: string;
  onNotificationsClick?: () => void;
  onAccountMenuClick?: () => void;
  onAccountMenuAction?: (action: ProfileOptionsAction) => void;
  onSignOut?: () => void;
  accountMenuLinks?: Partial<Record<ProfileOptionsAction, string>>;
  termsHref?: string;
  appVersion?: string;
  unreadNotificationCount?: number;
  capabilityStates?: Record<string, CapabilityState>;
  className?: string;
};

export type CapabilityState = {
  tag?: 'beta' | 'soon';
  unavailable?: boolean;
};

type NavItem = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

const NAV_ITEMS: NavItem[] = [
  { key: 'search-agent', label: 'Search Agent', icon: RiBrainLine },
  {
    key: 'upcoming-opportunities',
    label: 'Upcoming Opportunities',
    icon: RiArrowLeftRightLine,
  },
  {
    key: 'proposal-revision',
    label: 'Proposal Revision',
    icon: RiVoiceRecognitionLine,
  },
  {
    key: 'market-intelligence',
    label: 'Market Intelligence',
    icon: RiLineChartLine,
  },
  { key: 'past-tenders', label: 'Past Tenders', icon: RiHistoryLine },
  { key: 'frameworks', label: 'Frameworks', icon: RiStackLine, badge: 'UK' },
];

const ORGANIZATIONS: Organization[] = [
  { id: 'acme', name: 'Acme Corp', initials: 'AC' },
  { id: 'globex', name: 'Globex Industries', initials: 'GI' },
  { id: 'initech', name: 'Initech', initials: 'IN' },
  { id: 'umbrella', name: 'Umbrella Co', initials: 'UC' },
  { id: 'stark', name: 'Stark Ltd', initials: 'SL' },
  { id: 'wayne', name: 'Wayne Ent', initials: 'WE' },
];

export function SideNavbar({
  onOrganizationChange,
  organizationPlan = 'Enterprise Plan',
  onNotificationsClick,
  onAccountMenuClick,
  onAccountMenuAction,
  onSignOut,
  accountMenuLinks,
  termsHref,
  appVersion,
  unreadNotificationCount = 2,
  capabilityStates,
  className,
}: SideNavbarProps) {
  const [selected, setSelected] = React.useState('search-agent');
  const [activeOrganizationId, setActiveOrganizationId] =
    React.useState('acme');
  const activeOrganization =
    ORGANIZATIONS.find(
      (organization) => organization.id === activeOrganizationId,
    ) ?? ORGANIZATIONS[0];

  function handleOrganizationChange(organizationId: string) {
    setActiveOrganizationId(organizationId);
    onOrganizationChange?.(organizationId);
  }

  const unreadNotifications = Math.max(0, unreadNotificationCount);

  return (
    <nav
      aria-label='Main navigation'
      className={cn(
        'flex h-full min-h-0 w-[272px] flex-col items-start border-r border-stroke-soft-200 bg-bg-white-0',
        className,
      )}
    >
      <OrganizationSwitcher
        organizations={ORGANIZATIONS}
        activeOrganizationId={activeOrganizationId}
        onOrganizationChange={handleOrganizationChange}
        contentSide='right'
        contentAlign='start'
        contentSideOffset={12}
        contentCollisionPadding={16}
      >
        <button
          type='button'
          aria-label='Switch organization'
          className='flex w-full items-center gap-3 px-2.5 py-2 text-left outline-none transition-colors hover:bg-bg-weak-50 focus-visible:bg-bg-weak-50'
        >
          <div className='flex w-full items-center gap-3 rounded-10 p-3'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-strong-950'>
              {activeOrganization.id === 'acme' ? (
                <OrgMark className='size-10' />
              ) : (
                <span className='text-label-sm text-static-white'>
                  {activeOrganization.initials}
                </span>
              )}
            </div>
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <span className='truncate text-label-sm text-text-strong-950'>
                {activeOrganization.name}
              </span>
              <span className='truncate text-label-xs text-text-sub-600'>
                {organizationPlan}
              </span>
            </div>
            <CompactButton.Root
              asChild
              variant='ghost'
              size='large'
              className='pointer-events-none shrink-0'
            >
              <span>
                <CompactButton.Icon as={RiExpandUpDownLine} />
              </span>
            </CompactButton.Root>
          </div>
        </button>
      </OrganizationSwitcher>

      <div className='flex min-h-0 w-full flex-1 flex-col gap-5 overflow-y-auto px-2.5 py-5'>
        <div className='flex flex-col gap-2'>
          <div className='px-3 py-1 text-label-xs text-text-sub-600'>
            Tools
          </div>
          <div className='flex flex-col gap-1'>
            {NAV_ITEMS.map((item) => {
              const capabilityState = capabilityStates?.[item.key];
              const isUnavailable = capabilityState?.unavailable ?? false;
              const isComingSoon = capabilityState?.tag === 'soon';
              const isDisabled = isUnavailable || isComingSoon;
              const isSelected = item.key === selected && !isDisabled;

              return (
                <button
                  key={item.key}
                  type='button'
                  disabled={isDisabled}
                  onClick={() => setSelected(item.key)}
                  aria-current={isSelected ? 'page' : undefined}
                  className={cn(
                    'group relative flex items-center gap-2 rounded-lg px-3 py-2 text-left outline-none transition-colors hover:bg-bg-weak-50 focus-visible:bg-bg-weak-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:focus-visible:bg-transparent',
                    isUnavailable && 'opacity-50',
                    isSelected ? 'bg-bg-weak-50' : 'bg-transparent',
                  )}
                >
                  <item.icon
                    className={cn(
                      'size-5 shrink-0',
                      isSelected
                        ? 'text-text-strong-950'
                        : isComingSoon
                          ? 'text-text-soft-400'
                          : 'text-text-sub-600 group-hover:text-text-strong-950 group-focus-visible:text-text-strong-950',
                    )}
                  />
                  <span
                    className={cn(
                      'truncate text-label-sm',
                      isSelected
                        ? 'text-text-strong-950'
                        : isComingSoon
                          ? 'text-text-soft-400'
                          : 'text-text-sub-600 group-hover:text-text-strong-950 group-focus-visible:text-text-strong-950',
                    )}
                  >
                    {item.label}
                  </span>
                  {capabilityState?.tag && (
                    <CapabilityTag type={capabilityState.tag} />
                  )}
                  {item.badge && (
                    <Badge.Root variant='light' color='gray' size='medium'>
                      {item.badge}
                    </Badge.Root>
                  )}
                </button>
              );
            })}
            <button
              type='button'
              onClick={() => {
                setSelected('notifications');
                onNotificationsClick?.();
              }}
              aria-current={selected === 'notifications' ? 'page' : undefined}
              aria-label={
                unreadNotifications > 0
                  ? `Notifications, ${unreadNotifications} unread`
                  : 'Notifications'
              }
              className={cn(
                'group relative flex items-center gap-2 rounded-lg px-3 py-2 text-left outline-none transition-colors hover:bg-bg-weak-50 focus-visible:bg-bg-weak-50',
                selected === 'notifications'
                  ? 'bg-bg-weak-50'
                  : 'bg-transparent',
              )}
            >
              <RiNotification3Line
                className={cn(
                  'size-5 shrink-0',
                  selected === 'notifications'
                    ? 'text-text-strong-950'
                    : 'text-text-sub-600 group-hover:text-text-strong-950 group-focus-visible:text-text-strong-950',
                )}
              />
              <span
                className={cn(
                  'text-label-sm',
                  selected === 'notifications'
                    ? 'text-text-strong-950'
                    : 'text-text-sub-600 group-hover:text-text-strong-950 group-focus-visible:text-text-strong-950',
                )}
              >
                Notifications
              </span>
              {unreadNotifications > 0 && (
                <Badge.Root
                  aria-hidden='true'
                  variant='filled'
                  color='red'
                  size='medium'
                  className='min-w-5 px-1'
                >
                  {formatUnreadNotificationCount(unreadNotifications)}
                </Badge.Root>
              )}
            </button>
          </div>
        </div>
      </div>

      <ProfileOptionsMenu
        email='jane@acmecorp.io'
        version={appVersion}
        links={accountMenuLinks}
        termsHref={termsHref}
        onAction={onAccountMenuAction}
        onSignOut={onSignOut}
        contentAlignOffset={28}
        onOpenChange={(open) => {
          if (open) onAccountMenuClick?.();
        }}
      >
        <button
          type='button'
          aria-label='Open account menu'
          className='w-full shrink-0 bg-bg-white-0 px-2.5 py-2 text-left outline-none transition-colors hover:bg-bg-weak-50 active:bg-bg-weak-50 focus-visible:bg-bg-weak-50'
        >
          <div className='flex w-full items-center gap-3 rounded-10 p-3'>
            <Avatar.Root size='40' color='gray'>
              JC
            </Avatar.Root>
            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <span className='truncate text-label-sm text-text-strong-950'>
                Jane Cooper
              </span>
              <span className='truncate text-label-xs text-text-sub-600'>
                jane@acmecorp.io
              </span>
            </div>
            <CompactButton.Root
              asChild
              variant='ghost'
              size='large'
              className='pointer-events-none shrink-0'
            >
              <span>
                <CompactButton.Icon as={RiArrowRightSLine} />
              </span>
            </CompactButton.Root>
          </div>
        </button>
      </ProfileOptionsMenu>
    </nav>
  );
}

function CapabilityTag({
  type,
}: {
  type: NonNullable<CapabilityState['tag']>;
}) {
  if (type === 'beta') {
    return (
      <Badge.Root variant='filled' color='blue' size='medium'>
        Beta
      </Badge.Root>
    );
  }

  return (
    <Badge.Root variant='lighter' color='gray' size='medium'>
      Soon
    </Badge.Root>
  );
}

export function formatUnreadNotificationCount(count: number) {
  return count > 100 ? '99+' : String(count);
}
