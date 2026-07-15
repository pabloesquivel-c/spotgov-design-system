'use client';

// Skeleton redesign — Side Navbar.
// Matches Paper node IGC-0 ("Sidebar - Polished - 13px base"): 13px labels,
// 16px icons throughout, including Home (Paper node IGQ-0 dropped Home's
// icon/label down to match every other row exactly — it used to be larger).
// Collapse state: an earlier pass drove rail width, row reflow, and every
// disappearing label/badge/header off a framer-motion spring, but several
// independently-animated layout elements with no shared layout group made
// it read as broken/janky. This pass uses plain CSS transitions instead —
// `transition-[width] duration-200 ease-out` for the rail (matching
// app-sidebar.tsx's convention) and the CSS grid fr-unit trick for anything
// that needs to go from natural size to zero (see FadeLabel in
// skeleton-collapse.tsx) — no measuring, no JS, nothing to fight.
//
// This is a working preview built alongside the production
// `components/blocks/sidebar/app-sidebar.tsx`, not a replacement for it yet.
// Once this behavior is confirmed it graduates into the real block "part by
// part" — see content/playground for the existing sidebar's rationale doc.
//
// Icons were identified by scaling Paper's exported paths back against the
// real Remixicon source and confirming an exact coordinate match, verified
// per-node against Paper (not read off one big JSX dump — that's how an
// earlier pass swapped Direct Invitations/Upcoming Opportunities). Saved
// Tenders, Proposal Revision, and Pipeline Radar didn't resolve to a
// confident library match, so those three inline the exact path Paper
// exported instead of guessing a name.

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RiHeadphoneLine,
  RiHistoryLine,
  RiHomeLine,
  RiLineChartLine,
  RiMailLine,
  RiNotification3Line,
  RiRadarLine,
  RiSearch2Line,
  RiSettings4Line,
  RiStackLine,
  RiTimerFlashLine,
  type RemixiconComponentType,
} from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Tooltip from '@/components/ui/tooltip';
import { SkeletonWorkspaceToggle } from './skeleton-workspace-toggle';
import { SkeletonAccountFooter } from './skeleton-account-footer';
import {
  FadeLabel,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_EXPANDED_WIDTH,
} from './skeleton-collapse';
import type { Session } from './skeleton-mock-session';

// Exact paths from Paper, no confident Remixicon name — see file header.
const SavedTendersIcon: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 20 20' fill='currentColor' {...props}>
    <path d='M2.5 15.416V4.168C2.5 2.787 3.619 1.668 5 1.668H16.668C17.128 1.668 17.5 2.04 17.5 2.5V17.5C17.5 17.96 17.128 18.334 16.668 18.334H5.416C3.807 18.334 2.5 17.029 2.5 15.416ZM15.832 16.668V14.168H5.416C4.728 14.168 4.168 14.728 4.168 15.416C4.168 16.108 4.728 16.668 5.416 16.668H15.832ZM8.332 3.334H5C4.54 3.334 4.168 3.708 4.168 4.168V12.781C4.547 12.601 4.97 12.5 5.416 12.5H15.832V3.334H14.168V10L11.25 8.334 8.332 10V3.334Z' />
  </svg>
);
const ProposalRevisionIcon: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 20 20' fill='currentColor' {...props}>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M4.168 15.833H7.5V17.5H2.5V13.333H4.168V15.833ZM17.5 17.5H12.5V15.833H15.832V13.333H17.5V17.5ZM17.5 10.833H2.5V9.167H17.5V10.833Z'
    />
    <path d='M15.441 1.099C15.59 0.745 16.078 0.745 16.227 1.099L16.436 1.61C16.795 2.477 17.47 3.172 18.311 3.548L18.91 3.813C19.25 3.966 19.25 4.463 18.91 4.615L18.277 4.897C17.453 5.263 16.793 5.932 16.43 6.773L16.223 7.244C16.07 7.59 15.594 7.59 15.445 7.244L15.238 6.773C14.871 5.932 14.211 5.263 13.39 4.897L12.756 4.615C12.413 4.463 12.413 3.966 12.756 3.813L13.353 3.548C14.198 3.172 14.87 2.477 15.23 1.61L15.441 1.099Z' />
  </svg>
);
const PipelineRadarIcon: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 20 20' fill='currentColor' {...props}>
    <path d='M3.332 6.667H16.668V4.167H3.332V6.667ZM11.668 15.834V8.334H8.332V15.834H11.668ZM13.332 15.834H16.668V8.334H13.332V15.834ZM6.668 15.834V8.334H3.332V15.834H6.668ZM2.5 2.5H17.5C17.96 2.5 18.332 2.874 18.332 3.334V16.667C18.332 17.127 17.96 17.5 17.5 17.5H2.5C2.04 17.5 1.668 17.127 1.668 16.667V3.334C1.668 2.874 2.04 2.5 2.5 2.5Z' />
  </svg>
);
// "New search" action icon — Paper node IZ3-0's magnifier-with-history mark,
// no confident Remixicon match, so it inlines the exact exported path.
const NewSearchIcon: RemixiconComponentType = (props) => (
  <svg viewBox='0 8 16 16' fill='currentColor' {...props}>
    <path d='M10.334 11.334C9.045 11.334 8 12.379 8 13.668 8 14.956 9.045 16 10.334 16 11.622 16 12.666 14.956 12.666 13.668 12.666 12.379 11.622 11.334 10.334 11.334ZM6.666 13.668C6.666 11.642 8.308 10 10.334 10 12.358 10 14 11.642 14 13.668 14 14.44 13.762 15.156 13.354 15.745L15.138 17.529 14.195 18.472 12.411 16.688C11.822 17.096 11.105 17.334 10.334 17.334 8.308 17.334 6.666 15.692 6.666 13.668ZM2 10.668H5.334V12H2V10.668ZM2 15.334H5.334V16.668H2V15.334ZM14 20V21.334H2V20H14Z' />
  </svg>
);
// Collapse/expand rail icon — Paper node draws the exact same glyph in both
// states (no fold/unfold swap), so unlike RiSidebarFoldLine/RiSidebarUnfoldLine
// this is a single static icon inlined from Paper's exported path.
const CollapseRailIcon: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
    <path d='M5 5H13V19H5V5ZM19 19H15V5H19V19ZM4 3C3.448 3 3 3.448 3 4V20C3 20.552 3.448 21 4 21H20C20.552 21 21 20.552 21 20V4C21 3.448 20.552 3 20 3H4ZM7 12L11 8.5V15.5L7 12Z' />
  </svg>
);

type NavItem = {
  key: string;
  label: string;
  icon: RemixiconComponentType;
  href?: string;
  beta?: boolean;
  soon?: boolean;
  badge?: number;
  tag?: string;
};

type NavGroup = { label: string; items: NavItem[] };

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Discover',
    items: [
      {
        key: 'active-tenders',
        label: 'Active Tenders',
        icon: RiSearch2Line,
        href: '/active-tenders',
      },
      {
        key: 'tender-radar',
        label: 'Tender Radar',
        icon: RiRadarLine,
        href: '/tender-radar',
      },
      {
        key: 'direct-invitations',
        label: 'Direct Invitations',
        icon: RiMailLine,
        href: '/direct-invitations',
        beta: true,
      },
      {
        key: 'upcoming-opportunities',
        label: 'Upcoming Opportunities',
        icon: RiTimerFlashLine,
        href: '/upcoming-opportunities',
        soon: true,
      },
    ],
  },
  {
    label: 'Workspace',
    items: [
      {
        key: 'saved-tenders',
        label: 'Saved Tenders',
        icon: SavedTendersIcon,
        href: '/saved-tenders',
      },
      {
        key: 'proposal-revision',
        label: 'Proposal Revision',
        icon: ProposalRevisionIcon,
        href: '/proposal-revision',
      },
      {
        key: 'pipeline-radar',
        label: 'Pipeline Radar',
        icon: PipelineRadarIcon,
        href: '/pipeline-radar',
      },
      {
        key: 'notifications',
        label: 'Notifications',
        icon: RiNotification3Line,
        badge: 5,
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
        href: '/market-intelligence',
      },
      {
        key: 'past-tenders',
        label: 'Past Tenders',
        icon: RiHistoryLine,
        href: '/past-tenders',
      },
      {
        key: 'frameworks',
        label: 'Frameworks',
        icon: RiStackLine,
        href: '/frameworks',
        tag: 'UK',
      },
    ],
  },
];

const BOTTOM_ROWS: NavItem[] = [
  { key: 'support', label: 'Support', icon: RiHeadphoneLine, href: '/support' },
  { key: 'settings', label: 'Settings', icon: RiSettings4Line, href: '/settings' },
];

const HOME_ITEM: NavItem = {
  key: 'home',
  label: 'Home',
  icon: RiHomeLine,
  href: '/home',
};

export type SkeletonSidebarProps = {
  session: Session;
  onOpenNotifications: () => void;
  /**
   * Renders the "New search" row above Home (Paper node IZ2-0). Defaults to
   * off — the action isn't wired to anything real yet (no command palette,
   * no collapsed-state UX decided), so it's parked here rather than shipped
   * half-functional. Flip to `true` once there's something for it to do.
   */
  showSearchButton?: boolean;
  onNewSearch?: () => void;
  className?: string;
};

export function SkeletonSidebar({
  session,
  onOpenNotifications,
  showSearchButton = false,
  onNewSearch,
  className,
}: SkeletonSidebarProps) {
  const [activeOrgId, setActiveOrgId] = React.useState(
    session.organizations[0].id,
  );
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <nav
      aria-label='Main navigation'
      style={{ width: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_EXPANDED_WIDTH }}
      className={cn(
        'flex h-full min-h-0 shrink-0 flex-col overflow-hidden border border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 shadow-regular-xs transition-[width] duration-200 ease-out',
        className,
      )}
    >
      <SkeletonWorkspaceToggle
        organizations={session.organizations}
        activeOrgId={activeOrgId}
        onSwitchOrg={setActiveOrgId}
        isCollapsed={isCollapsed}
      />

      {showSearchButton && (
        <div className='flex shrink-0 flex-col px-2 py-1.5'>
          <NavTooltip label='New search' isCollapsed={isCollapsed}>
            <div
              className={cn(
                'flex items-center gap-[7px] rounded-10 border border-stroke-soft-200 bg-bg-white-0 shadow-[0px_1px_2px_#0A0D1408] transition-colors focus-within:border-stroke-sub-300',
                isCollapsed ? 'justify-center px-2 py-1.5' : 'px-2.5 py-2',
              )}
            >
              {isCollapsed ? (
                <button
                  type='button'
                  onClick={onNewSearch}
                  aria-label='New search'
                  className='flex size-4 shrink-0 items-center justify-center'
                >
                  <NewSearchIcon className='size-4 shrink-0 text-text-sub-600' />
                </button>
              ) : (
                <NewSearchIcon className='size-4 shrink-0 text-text-sub-600' />
              )}
              <FadeLabel isCollapsed={isCollapsed} className='flex-1'>
                <input
                  type='text'
                  placeholder='New search'
                  onFocus={onNewSearch}
                  className='w-full bg-transparent text-[13px] font-medium leading-4 tracking-[-0.006em] text-text-strong-950 placeholder:text-text-sub-600 focus:outline-none'
                />
              </FadeLabel>
            </div>
          </NavTooltip>
        </div>
      )}

      <div className='flex min-h-0 flex-1 flex-col justify-between gap-4 overflow-y-auto px-2 pb-1.5'>
        <div
          className={cn(
            'flex flex-col items-start',
            isCollapsed ? 'gap-1.5' : 'gap-3',
          )}
        >
          <NavRow item={HOME_ITEM} isCollapsed={isCollapsed} />

          {NAV_GROUPS.map((group, index) => (
            <React.Fragment key={group.label}>
              {index > 0 && <GroupDivider isCollapsed={isCollapsed} />}
              <div className='flex w-full flex-col'>
                <div
                  className={cn(
                    'overflow-hidden transition-[max-height] duration-200 ease-out',
                    isCollapsed ? 'max-h-0' : 'max-h-6',
                  )}
                >
                  <span className='truncate px-2 py-1.5 text-[10px] font-semibold uppercase leading-3 tracking-[0.06em] text-text-sub-600'>
                    {group.label}
                  </span>
                </div>
                <div
                  className={cn(
                    'flex flex-col items-start',
                    isCollapsed ? 'gap-0.5' : 'gap-px',
                  )}
                >
                  {group.items.map((item) => (
                    <NavRow
                      key={item.key}
                      item={item}
                      isCollapsed={isCollapsed}
                      onClick={
                        item.key === 'notifications'
                          ? onOpenNotifications
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className='flex flex-col items-start gap-px'>
          {BOTTOM_ROWS.map((item) => (
            <NavRow key={item.key} item={item} isCollapsed={isCollapsed} />
          ))}
          <NavTooltip
            label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            isCollapsed={isCollapsed}
          >
            <button
              type='button'
              onClick={() => setIsCollapsed((v) => !v)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              className='flex w-full items-center gap-1.5 rounded-10 px-2 py-1.5 text-left text-text-sub-600 transition-colors hover:bg-bg-weak-50'
            >
              <CollapseRailIcon className='size-4 shrink-0' />
              <FadeLabel isCollapsed={isCollapsed} className='flex-1 text-[13px] font-medium leading-4'>
                Collapse
              </FadeLabel>
            </button>
          </NavTooltip>
        </div>
      </div>

      <SkeletonAccountFooter user={session.user} isCollapsed={isCollapsed} />
    </nav>
  );
}

// Expanded: full-width hairline. Collapsed: a shorter, centered hairline so
// it doesn't run edge-to-edge across the icon-only rail.
function GroupDivider({ isCollapsed }: { isCollapsed: boolean }) {
  if (isCollapsed) {
    return (
      <div className='flex h-6 w-full shrink-0 items-center justify-center'>
        <div className='h-px w-8 shrink-0 bg-stroke-soft-200' />
      </div>
    );
  }

  return <div className='h-px w-full shrink-0 rounded-full bg-bg-soft-200' />;
}

// Wraps icon-only collapsed rows in a tooltip so the label (and any
// badge/tag context a caller renders in it) survives collapse instead of
// disappearing with no way to recover it.
function NavTooltip({
  label,
  isCollapsed,
  children,
}: {
  label: React.ReactNode;
  isCollapsed: boolean;
  children: React.ReactNode;
}) {
  if (!isCollapsed) return <>{children}</>;

  return (
    <Tooltip.Provider>
      <Tooltip.Root delayDuration={200}>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Content side='right' size='small' variant='dark'>
          {label}
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

function NavRow({
  item,
  isCollapsed,
  onClick,
}: {
  item: NavItem;
  isCollapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const Icon = item.icon;
  const disabled = Boolean(item.soon);
  const active =
    !disabled &&
    Boolean(item.href) &&
    (pathname === item.href || pathname?.startsWith(`${item.href}/`));

  const className = cn(
    'flex w-full items-center gap-1.5 rounded-10 px-2 py-1.5 text-left transition-colors',
    disabled
      ? 'text-text-disabled-300'
      : active
        ? 'bg-bg-soft-200 font-medium text-text-strong-950'
        : 'text-text-sub-600 hover:bg-bg-weak-50',
  );

  const content = (
    <>
      <Icon className='size-4 shrink-0' />

      <FadeLabel isCollapsed={isCollapsed} className='flex items-center gap-1.5'>
        <span className='flex-1 whitespace-normal text-[13px] font-medium leading-4'>
          {item.label}
        </span>

        {item.beta && (
          <span className='inline-flex shrink-0 items-center rounded-full bg-feature-light px-2 py-1 text-[10px] font-medium leading-3 text-feature-base'>
            Beta
          </span>
        )}

        {item.soon && (
          <span className='inline-flex shrink-0 items-center rounded-full border border-stroke-soft-200 bg-bg-weak-50 px-2 py-1 text-[10px] font-medium leading-3 text-text-soft-400'>
            Soon
          </span>
        )}

        {item.tag && (
          <span className='inline-flex h-5 shrink-0 items-center rounded-full border border-stroke-soft-200 bg-bg-weak-50 px-2 text-[10px] font-semibold leading-3 tracking-[0.02em] text-text-sub-600'>
            {item.tag}
          </span>
        )}

        {item.badge ? (
          <span className='flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-error-base pl-[5px] pr-1 text-[11px] font-semibold leading-[14px] text-static-white'>
            {item.badge}
          </span>
        ) : null}
      </FadeLabel>
    </>
  );

  const tooltipLabel = (
    <span className='flex items-center gap-1.5'>
      {item.label}
      {item.beta && <span className='text-text-soft-400'>· Beta</span>}
      {item.soon && <span className='text-text-soft-400'>· Soon</span>}
      {item.tag && <span className='text-text-soft-400'>· {item.tag}</span>}
      {item.badge ? (
        <span className='text-text-soft-400'>· {item.badge}</span>
      ) : null}
    </span>
  );

  if (item.href && !disabled) {
    return (
      <NavTooltip label={tooltipLabel} isCollapsed={isCollapsed}>
        <Link href={item.href} onClick={onClick} className={className}>
          {content}
        </Link>
      </NavTooltip>
    );
  }

  return (
    <NavTooltip label={tooltipLabel} isCollapsed={isCollapsed}>
      <button type='button' onClick={onClick} disabled={disabled} className={className}>
        {content}
      </button>
    </NavTooltip>
  );
}
