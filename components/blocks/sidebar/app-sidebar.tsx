'use client';

// SpotGov App Sidebar — "Recommended (A × C)".
// Clean grouped nav (no accordions) + a search-first ⌘K bar. Always visible
// (no collapse). The account menu opens above the account row; hovering
// “What's new” escalates to a changelog flyout on the right.

import * as React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import {
  RiArrowRightSLine,
  RiBookmarkLine,
  RiCalendarScheduleLine,
  RiCompass3Line,
  RiExpandUpDownLine,
  RiFileSearchLine,
  RiHistoryLine,
  RiInformationLine,
  RiLineChartLine,
  RiLinksLine,
  RiLogoutBoxRLine,
  RiNotification3Line,
  RiSearch2Line,
  RiSettings2Line,
  RiSparklingLine,
  type RemixiconComponentType,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import { useCollisionBoundary } from '@/components/collision-boundary';

type NavItem = {
  key: string;
  label: string;
  icon: RemixiconComponentType;
  beta?: boolean;
  badge?: number;
};

type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Discover',
    items: [
      { key: 'active-tenders', label: 'Active Tenders', icon: RiSearch2Line },
      { key: 'tender-radar', label: 'Tender Radar', icon: RiCompass3Line },
      {
        key: 'direct-invitations',
        label: 'Direct Invitations',
        icon: RiLinksLine,
        beta: true,
      },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { key: 'saved-tenders', label: 'Saved Tenders', icon: RiBookmarkLine },
      {
        key: 'notifications',
        label: 'Notifications',
        icon: RiNotification3Line,
        badge: 5,
      },
      {
        key: 'pipeline-radar',
        label: 'Pipeline Radar',
        icon: RiCalendarScheduleLine,
      },
      {
        key: 'proposal-revision',
        label: 'Proposal Revision',
        icon: RiFileSearchLine,
      },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      {
        key: 'market-intelligence',
        label: 'Market Intelligence',
        icon: RiLineChartLine,
      },
      { key: 'past-tenders', label: 'Past Tenders', icon: RiHistoryLine },
    ],
  },
];

const CHANGELOG = [
  {
    date: '2 Jul 2026',
    title: 'Pipeline Radar is live',
    body: 'Track opportunities across their full lifecycle.',
  },
  {
    date: '28 Jun 2026',
    title: 'Direct Invitations (Beta)',
    body: 'Receive tenders invited to you directly.',
  },
];

export type AppSidebarProps = {
  defaultActiveKey?: string;
  className?: string;
};

export function AppSidebar({
  defaultActiveKey = 'active-tenders',
  className,
}: AppSidebarProps) {
  const [activeKey, setActiveKey] = React.useState(defaultActiveKey);

  return (
    <nav
      aria-label='Main navigation'
      className={cn(
        'flex h-full min-h-0 w-[272px] shrink-0 flex-col overflow-hidden rounded-2xl bg-bg-white-0 text-text-sub-600 shadow-regular-xs',
        'border border-stroke-soft-200',
        className,
      )}
    >
      {/* workspace toggle */}
      <WorkspaceToggle />

      {/* search / ⌘K command */}
      <div className='shrink-0 border-b border-stroke-soft-200 p-3'>
        <button
          type='button'
          className='flex w-full items-center gap-2 rounded-10 border border-stroke-soft-200 bg-bg-white-0 px-2.5 py-[9px] text-left shadow-regular-xs transition-colors hover:bg-bg-weak-50'
        >
          <RiSearch2Line className='size-[18px] shrink-0 text-text-soft-400' />
          <span className='flex-1 text-[13px] leading-4 text-text-soft-400'>
            Search or jump to…
          </span>
          <kbd className='shrink-0 rounded-md border border-stroke-soft-200 bg-bg-weak-50 px-1.5 py-px text-[11px] font-medium leading-[14px] text-text-sub-600'>
            ⌘K
          </kbd>
        </button>
      </div>

      {/* nav groups */}
      <div className='flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-3'>
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className='flex flex-col gap-0.5'>
            <span className='px-2 py-1.5 text-label-xs uppercase tracking-wide text-text-sub-600'>
              {group.label}
            </span>
            {group.items.map((item) => (
              <NavRow
                key={item.key}
                item={item}
                active={item.key === activeKey}
                onClick={() => setActiveKey(item.key)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* account */}
      <div className='shrink-0 border-t border-stroke-soft-200 bg-bg-weak-50'>
        <AccountMenu />
      </div>
    </nav>
  );
}

function NavRow({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'group relative flex w-full items-center gap-2 rounded-10 p-2 text-left transition-all duration-200 ease-out',
        active
          ? 'bg-bg-weak-50 font-medium text-text-strong-950'
          : 'text-text-sub-600 hover:bg-bg-weak-50',
      )}
    >
      <span
        className={cn(
          'flex size-5 shrink-0 items-center justify-center',
          active ? 'text-primary-base' : 'text-text-soft-400',
        )}
      >
        <Icon className='size-5' />
      </span>

      <span className='flex-1 text-label-sm'>{item.label}</span>

      {item.beta && (
        <Badge.Root variant='lighter' color='purple' size='medium'>
          Beta
        </Badge.Root>
      )}

      {item.badge ? (
        <span className='flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-error-base px-1 text-label-xs font-semibold text-static-white'>
          {item.badge}
        </span>
      ) : null}

      {!item.beta && !item.badge && (
        <RiArrowRightSLine
          className={cn(
            'size-5 shrink-0 text-text-soft-400 transition-opacity',
            active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
          )}
        />
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Account menu — opens above the account row; “What's new” escalates  */
/* to a changelog flyout on hover.                                     */
/* ------------------------------------------------------------------ */

const contentAnimation =
  'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95';

function AccountMenu() {
  const collisionBoundary = useCollisionBoundary();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [whatsNewOpen, setWhatsNewOpen] = React.useState(false);
  // The flyout isn't a Radix Popper node (see below), so it doesn't get
  // collisionBoundary for free — measure it against the boundary ourselves
  // and flip which side it opens on when it wouldn't fit on the right.
  const [flyoutSide, setFlyoutSide] = React.useState<'right' | 'left'>(
    'right',
  );
  const flyoutRef = React.useRef<HTMLDivElement>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const openWhatsNew = React.useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setWhatsNewOpen(true);
  }, []);
  const scheduleCloseWhatsNew = React.useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setWhatsNewOpen(false), 150);
  }, []);

  // reset the flyout whenever the account menu closes
  React.useEffect(() => {
    if (!menuOpen) setWhatsNewOpen(false);
  }, [menuOpen]);

  React.useLayoutEffect(() => {
    if (!whatsNewOpen || !collisionBoundary || !flyoutRef.current) return;
    const boundaryRect = collisionBoundary.getBoundingClientRect();
    const flyoutRect = flyoutRef.current.getBoundingClientRect();
    setFlyoutSide(flyoutRect.right > boundaryRect.right ? 'left' : 'right');
  }, [whatsNewOpen, collisionBoundary]);

  return (
    <DropdownMenu.Root open={menuOpen} onOpenChange={setMenuOpen}>
      <DropdownMenu.Trigger asChild>
        <button
          type='button'
          className='flex w-full items-center gap-2.5 p-2.5 text-left outline-none transition-colors hover:bg-bg-soft-200 data-[state=open]:bg-bg-soft-200'
        >
          <Avatar.Root size='40' color='gray'>
            PE
          </Avatar.Root>
          <span className='flex min-w-0 flex-1 flex-col'>
            <span className='truncate text-label-sm text-text-strong-950'>
              Pablo Esquivel
            </span>
            <span className='truncate text-paragraph-xs text-text-sub-600'>
              pablo@itsaurastudio.com
            </span>
          </span>
          <RiExpandUpDownLine className='size-[18px] shrink-0 text-text-soft-400' />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side='top'
          align='center'
          sideOffset={6}
          avoidCollisions={false}
          className={cn(
            'z-50 flex w-[260px] flex-col rounded-[12px] border border-stroke-soft-200 bg-bg-white-0 shadow-[0px_0px_24px_-12px_#0E121B33]',
            'data-[side=top]:origin-bottom data-[side=bottom]:origin-top',
            contentAnimation,
          )}
        >
          {/* primary actions */}
          <div className='flex flex-col p-1.5'>
            <MenuItem icon={RiSettings2Line} label='Settings' />
            <MenuItem icon={RiInformationLine} label='Help & Contacts' />

            {/* What's new → escalates to the changelog flyout on hover */}
            <DropdownMenu.Item
              onSelect={(e) => {
                e.preventDefault();
                setWhatsNewOpen((v) => !v);
              }}
              onMouseEnter={openWhatsNew}
              onMouseLeave={scheduleCloseWhatsNew}
              onFocus={openWhatsNew}
              onBlur={scheduleCloseWhatsNew}
              data-open={whatsNewOpen ? '' : undefined}
              className='flex cursor-pointer items-center gap-2.5 rounded-10 px-2.5 py-[9px] text-paragraph-sm text-text-strong-950 outline-none transition-colors data-[highlighted]:bg-bg-weak-50 data-[open]:bg-bg-weak-50'
            >
              <RiSparklingLine className='size-[19px] shrink-0 text-text-sub-600' />
              <span className='flex-1'>What&apos;s new</span>
              <span className='size-[7px] shrink-0 rounded-full bg-primary-base' />
            </DropdownMenu.Item>
          </div>

          <DropdownMenu.Separator className='h-px bg-stroke-soft-200' />

          {/* session */}
          <div className='p-1.5'>
            <MenuItem icon={RiLogoutBoxRLine} label='Log out' />
          </div>

          {/* What's new flyout — bottom-aligned to the menu, opens right
              unless that would overflow the collision boundary, in which
              case it opens left instead (see the layout effect above). */}
          {whatsNewOpen && (
            <div
              ref={flyoutRef}
              className={cn(
                'absolute bottom-0',
                flyoutSide === 'right' ? 'left-full ml-3' : 'right-full mr-3',
              )}
              onMouseEnter={openWhatsNew}
              onMouseLeave={scheduleCloseWhatsNew}
            >
              <div
                className={cn(
                  'flex w-[306px] flex-col overflow-hidden rounded-[12px] border border-stroke-soft-200 bg-bg-white-0 shadow-[0px_16px_32px_-12px_#0E121B1A] duration-150 animate-in fade-in-0 zoom-in-95',
                  flyoutSide === 'right'
                    ? 'origin-bottom-left'
                    : 'origin-bottom-right',
                )}
              >
                <ChangelogPanel />
              </div>
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Workspace toggle — replaces the SpotGov brand slot. Opens a menu    */
/* beside the sidebar (workspace identity + Settings + Log out).       */
/* ------------------------------------------------------------------ */

function WorkspaceToggle() {
  const collisionBoundary = useCollisionBoundary();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type='button'
          className='flex shrink-0 items-center gap-2.5 border-b border-stroke-soft-200 px-3 py-3.5 text-left outline-none transition-colors hover:bg-bg-weak-50 data-[state=open]:bg-bg-weak-50'
        >
          <span
            className='flex size-7 shrink-0 items-center justify-center rounded-[8px] text-[12px] font-semibold text-static-white'
            style={{
              backgroundImage:
                'linear-gradient(135deg, #4b6bff 0%, #2547d0 100%)',
            }}
          >
            A
          </span>
          <span className='flex-1 text-[15px] font-semibold tracking-tight text-text-strong-950'>
            Acme Corporation
          </span>
          <RiExpandUpDownLine className='size-[18px] shrink-0 text-text-soft-400' />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side='right'
          align='start'
          sideOffset={20}
          collisionBoundary={collisionBoundary}
          collisionPadding={8}
          className={cn(
            'z-50 flex w-[260px] flex-col rounded-[12px] border border-stroke-soft-200 bg-bg-white-0 shadow-[0px_0px_24px_-12px_#0E121B33]',
            contentAnimation,
          )}
        >
          <div className='p-1.5'>
            <div className='flex items-center gap-2.5 rounded-10 bg-bg-weak-50 px-2.5 py-2'>
              <span
                className='flex size-[26px] shrink-0 items-center justify-center rounded-[8px] text-[11px] font-semibold text-static-white'
                style={{
                  backgroundImage:
                    'linear-gradient(135deg, #4b6bff 0%, #2547d0 100%)',
                }}
              >
                A
              </span>
              <span className='flex min-w-0 flex-1 flex-col'>
                <span className='line-clamp-1 text-label-sm text-text-strong-950'>
                  Acme Corporation
                </span>
                <span className='text-paragraph-xs text-text-sub-600'>
                  Switch workspace
                </span>
              </span>
              <RiExpandUpDownLine className='size-[18px] shrink-0 text-text-soft-400' />
            </div>
          </div>

          <div className='p-1.5'>
            <MenuItem icon={RiSettings2Line} label='Settings' />
          </div>

          <DropdownMenu.Separator className='h-px bg-stroke-soft-200' />

          <div className='p-1.5'>
            <MenuItem icon={RiLogoutBoxRLine} label='Log out' />
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function MenuItem({
  icon: Icon,
  label,
}: {
  icon: RemixiconComponentType;
  label: string;
}) {
  return (
    <DropdownMenu.Item className='flex cursor-pointer items-center gap-2.5 rounded-10 px-2.5 py-[9px] text-paragraph-sm text-text-strong-950 outline-none transition-colors data-[highlighted]:bg-bg-weak-50'>
      <Icon className='size-[19px] shrink-0 text-text-sub-600' />
      <span className='flex-1'>{label}</span>
    </DropdownMenu.Item>
  );
}

function ChangelogPanel() {
  return (
    <>
      <div className='flex items-center justify-between px-4 pb-1.5 pt-2'>
        <span className='text-[12px] font-semibold leading-[18px] text-text-strong-950'>
          What&apos;s new
        </span>
        <Badge.Root
          variant='lighter'
          color='purple'
          size='medium'
          className='text-[10px] leading-3'
        >
          3 new
        </Badge.Root>
      </div>

      {CHANGELOG.map((entry) => (
        <div key={entry.title} className='flex gap-2.5 px-4 pb-2.5 pt-2'>
          <span className='mt-[5px] size-[7px] shrink-0 rounded-full bg-primary-base' />
          <div className='flex flex-col gap-0.5'>
            <span className='text-[9px] font-medium leading-3 text-text-soft-400'>
              {entry.date}
            </span>
            <span className='text-[12px] font-medium leading-4 text-text-strong-950'>
              {entry.title}
            </span>
            <span className='text-[10px] leading-4 text-text-sub-600'>
              {entry.body}
            </span>
          </div>
        </div>
      ))}

      <button
        type='button'
        className='flex items-center gap-0.5 border-t border-t-[#0000001A] px-4 py-[11px] text-[13px] font-medium leading-4 text-primary-base transition-colors hover:bg-bg-weak-50'
      >
        View full changelog
        <RiArrowRightSLine className='size-[15px]' />
      </button>
    </>
  );
}

