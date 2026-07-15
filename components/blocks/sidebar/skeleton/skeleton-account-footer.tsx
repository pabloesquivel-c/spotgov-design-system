// Sidebar footer — avatar, name, email, and a chevron indicator. Clicking
// anywhere on the row opens the account menu (Paper node IYP-0), which pops
// open centered above the row rather than to the side.

'use client';

import * as React from 'react';
import Link from 'next/link';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { RiExpandUpDownLine, type RemixiconComponentType } from '@remixicon/react';

import { cn } from '@/utils/cn';
import { useCollisionBoundary } from '@/components/collision-boundary';
import { useHoverCloseMenu } from '@/hooks/use-hover-close-menu';
import type { CurrentUser } from './skeleton-mock-session';

export type SkeletonAccountFooterProps = {
  user: CurrentUser;
  /** Same href convention as the sidebar's own Settings row (skeleton-sidebar.tsx). */
  settingsHref?: string;
  /** External destinations — mock defaults until real marketing/help URLs exist. */
  helpHref?: string;
  upgradeHref?: string;
  /** Learn more submenu (JJX-0) destinations — placeholders until real ones exist. */
  websiteHref?: string;
  linkedinHref?: string;
  /** Initial selected language id (see `LANGUAGES`: 'pt' | 'es' | 'en' | 'fr' | 'de'). */
  defaultLanguageId?: string;
  /** Fires when a language is picked in the submenu — hook real i18n switching here. */
  onLanguageChange?: (languageId: string) => void;
  onLogoutClick?: () => void;
};

export function SkeletonAccountFooter({
  user,
  settingsHref = '/settings',
  helpHref = 'https://spotgov.com/help',
  upgradeHref = 'https://spotgov.com/pricing',
  websiteHref = '#',
  linkedinHref = '#',
  defaultLanguageId = 'en',
  onLanguageChange,
  onLogoutClick,
}: SkeletonAccountFooterProps) {
  const collisionBoundary = useCollisionBoundary();
  const { open, onOpenChange, cancelClose, scheduleClose } = useHoverCloseMenu();
  // Lifted above the menu content (rather than local to LanguageMenu) so the
  // selection survives the menu closing — Radix unmounts DropdownMenu.Content
  // (and everything inside it) between opens, which would otherwise reset it.
  const [selectedLanguageId, setSelectedLanguageId] = React.useState(defaultLanguageId);

  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild>
        <button
          type='button'
          aria-label='Open account menu'
          className='flex w-full shrink-0 items-center gap-2.5 border-t border-stroke-soft-200 p-2.5 outline-none transition-colors hover:bg-bg-weak-50 data-[state=open]:bg-bg-weak-50'
        >
          <UserAvatar user={user} />
          <div className='flex min-w-0 flex-1 flex-col gap-px text-left'>
            <span className='truncate text-[13px] font-medium leading-4 text-text-strong-950'>
              {user.name}
            </span>
            <span className='truncate text-[12px] leading-4 text-text-sub-600'>
              {user.email}
            </span>
          </div>
          <span className='flex shrink-0 items-center justify-center gap-1.5 rounded-10 p-2'>
            <RiExpandUpDownLine className='size-3 shrink-0 text-text-sub-600' />
          </span>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side='top'
          align='center'
          sideOffset={8}
          collisionBoundary={collisionBoundary}
          collisionPadding={8}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className={cn(
            'z-50 flex w-[228px] flex-col rounded-10 border border-stroke-soft-200 bg-bg-white-0 px-1.5 pb-1.5 pt-1 shadow-[0px_0px_24px_-12px_#5C5C5C]',
            contentAnimation,
          )}
        >
          <div className='px-2 py-1.5'>
            <span className='line-clamp-1 text-[12px] font-medium leading-4 text-text-soft-400'>
              {user.email}
            </span>
          </div>

          <div className='flex flex-col items-start gap-1 self-stretch'>
            <div className='flex flex-col items-start gap-px self-stretch'>
              <AccountMenuItem icon={SettingsIcon} label='Settings' href={settingsHref} />
              <LanguageMenu
                selectedLanguageId={selectedLanguageId}
                onSelectLanguage={(id) => {
                  setSelectedLanguageId(id);
                  onLanguageChange?.(id);
                }}
                onMenuMouseEnter={cancelClose}
                onMenuMouseLeave={scheduleClose}
              />
              <AccountMenuItem icon={GetHelpIcon} label='Get help' href={helpHref} external />
            </div>

            <MenuDivider />

            <div className='flex flex-col items-start gap-px self-stretch'>
              <AccountMenuItem
                icon={UpgradePlanIcon}
                label='Upgrade plan'
                href={upgradeHref}
                external
                className='font-semibold text-primary-base'
                iconClassName='text-primary-base'
              />
              <LearnMoreMenu
                websiteHref={websiteHref}
                linkedinHref={linkedinHref}
                onMenuMouseEnter={cancelClose}
                onMenuMouseLeave={scheduleClose}
              />
            </div>

            <MenuDivider />

            <div className='flex flex-col items-start gap-px self-stretch'>
              <AccountMenuItem
                icon={LogoutIcon}
                label='Logout'
                onSelect={onLogoutClick}
                className='text-error-base'
                iconClassName='text-error-base'
              />
            </div>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

const contentAnimation =
  'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95';

function MenuDivider() {
  return (
    <div className='h-px w-full shrink-0 rounded-full bg-bg-soft-200' />
  );
}

// Language row (Paper node JEV-0's "Language" row) escalates to the
// 5-language submenu (JGI-0) on hover — Radix `Sub`/`SubTrigger` open on
// hover natively, no custom timers needed. Per the design, only this row
// gets a trailing chevron, always visible — every other menu row has no
// trailing element at all.
function LanguageMenu({
  selectedLanguageId,
  onSelectLanguage,
  onMenuMouseEnter,
  onMenuMouseLeave,
}: {
  selectedLanguageId: string;
  onSelectLanguage: (id: string) => void;
  onMenuMouseEnter: () => void;
  onMenuMouseLeave: () => void;
}) {
  const collisionBoundary = useCollisionBoundary();

  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger className='group/lang flex cursor-pointer items-center gap-1.5 self-stretch rounded-[8px] px-2 py-1.5 text-[13px] font-medium leading-4 text-text-sub-600 outline-none transition-colors data-[highlighted]:bg-bg-weak-50 data-[state=open]:bg-bg-weak-50'>
        <LanguageIcon className='size-4 shrink-0' />
        <span className='flex-1'>Language</span>
        <ChevronRightIcon className='size-4 shrink-0' />
      </DropdownMenu.SubTrigger>

      <DropdownMenu.Portal>
        <DropdownMenu.SubContent
          sideOffset={10}
          collisionBoundary={collisionBoundary}
          collisionPadding={8}
          onMouseEnter={onMenuMouseEnter}
          onMouseLeave={onMenuMouseLeave}
          className={cn(
            'z-50 flex w-[150px] flex-col rounded-10 border border-stroke-soft-200 bg-bg-white-0 p-1 shadow-[0px_0px_24px_-12px_#0E121B33]',
            contentAnimation,
          )}
        >
          <div className='flex flex-col items-start gap-px self-stretch'>
            {LANGUAGES.map((language) => (
              <DropdownMenu.Item
                key={language.id}
                onSelect={() => onSelectLanguage(language.id)}
                className='flex cursor-pointer items-center gap-1.5 self-stretch rounded-[8px] px-2 py-1.5 text-[13px] font-medium leading-4 text-text-sub-600 outline-none transition-colors data-[highlighted]:bg-bg-weak-50'
              >
                <language.flag className='size-4 shrink-0' />
                <span className='flex-1'>{language.label}</span>
                {language.id === selectedLanguageId && (
                  <span className='size-[7px] shrink-0 rounded-full bg-primary-base' />
                )}
              </DropdownMenu.Item>
            ))}
          </div>
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Sub>
  );
}

// Learn more row (Paper node JEV-0) escalates to a 2-item flyout (JJX-0) on
// hover, same treatment as LanguageMenu above: chevron is always visible,
// no other row gets one. Both destinations are placeholders ("ready to
// connect") until real URLs exist.
function LearnMoreMenu({
  websiteHref,
  linkedinHref,
  onMenuMouseEnter,
  onMenuMouseLeave,
}: {
  websiteHref: string;
  linkedinHref: string;
  onMenuMouseEnter: () => void;
  onMenuMouseLeave: () => void;
}) {
  const collisionBoundary = useCollisionBoundary();

  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger className='group/learnmore flex cursor-pointer items-center gap-1.5 self-stretch rounded-[8px] px-2 py-1.5 text-[13px] font-medium leading-4 text-text-sub-600 outline-none transition-colors data-[highlighted]:bg-bg-weak-50 data-[state=open]:bg-bg-weak-50'>
        <LearnMoreIcon className='size-4 shrink-0' />
        <span className='flex-1'>Learn more</span>
        <ChevronRightIcon className='size-4 shrink-0' />
      </DropdownMenu.SubTrigger>

      <DropdownMenu.Portal>
        <DropdownMenu.SubContent
          sideOffset={10}
          collisionBoundary={collisionBoundary}
          collisionPadding={8}
          onMouseEnter={onMenuMouseEnter}
          onMouseLeave={onMenuMouseLeave}
          className={cn(
            'z-50 flex w-[150px] flex-col rounded-10 border border-stroke-soft-200 bg-bg-white-0 p-1 shadow-[0px_0px_24px_-12px_#0E121B33]',
            contentAnimation,
          )}
        >
          <div className='flex flex-col items-start gap-px self-stretch'>
            <DropdownMenu.Item asChild className='flex cursor-pointer items-center gap-1.5 self-stretch rounded-[8px] px-2 py-1.5 text-[13px] font-medium leading-4 text-text-sub-600 outline-none transition-colors data-[highlighted]:bg-bg-weak-50'>
              <a href={websiteHref} target='_blank' rel='noopener noreferrer'>
                <WebsiteIcon className='size-4 shrink-0' />
                <span className='flex-1'>Website</span>
              </a>
            </DropdownMenu.Item>
            <DropdownMenu.Item asChild className='flex cursor-pointer items-center gap-1.5 self-stretch rounded-[8px] px-2 py-1.5 text-[13px] font-medium leading-4 text-text-sub-600 outline-none transition-colors data-[highlighted]:bg-bg-weak-50'>
              <a href={linkedinHref} target='_blank' rel='noopener noreferrer'>
                <LinkedInIcon className='size-4 shrink-0' />
                <span className='flex-1'>LinkedIn</span>
              </a>
            </DropdownMenu.Item>
          </div>
        </DropdownMenu.SubContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Sub>
  );
}

function AccountMenuItem({
  icon: Icon,
  label,
  className,
  iconClassName,
  href,
  external,
  onSelect,
}: {
  icon: RemixiconComponentType;
  label: string;
  className?: string;
  iconClassName?: string;
  href?: string;
  external?: boolean;
  onSelect?: () => void;
}) {
  const itemClassName = cn(
    'flex cursor-pointer items-center gap-1.5 self-stretch rounded-[8px] px-2 py-1.5 text-[13px] font-medium leading-4 text-text-sub-600 outline-none transition-colors data-[highlighted]:bg-bg-weak-50',
    className,
  );

  const content = (
    <>
      <Icon className={cn('size-4 shrink-0', iconClassName)} />
      <span className='flex-1'>{label}</span>
    </>
  );

  if (href) {
    return (
      <DropdownMenu.Item asChild className={itemClassName}>
        {external ? (
          <a href={href} target='_blank' rel='noopener noreferrer'>
            {content}
          </a>
        ) : (
          <Link href={href}>{content}</Link>
        )}
      </DropdownMenu.Item>
    );
  }

  return (
    <DropdownMenu.Item className={itemClassName} onSelect={onSelect}>
      {content}
    </DropdownMenu.Item>
  );
}

// Exact paths from Paper (JEV-0) — no confident Remixicon match verified,
// so these inline the exported path directly rather than guessing a name.
const SettingsIcon: RemixiconComponentType = (props) => (
  <svg viewBox='0 4 16 16' fill='currentColor' {...props}>
    <path d='M1.335 12C1.335 11.424 1.406 10.864 1.544 10.332 2.27 10.369 2.992 10.007 3.383 9.333 3.768 8.66 3.721 7.856 3.327 7.246 4.121 6.464 5.112 5.88 6.216 5.574 6.549 6.224 7.223 6.668 8 6.668 8.776 6.668 9.451 6.224 9.784 5.574 10.888 5.88 11.879 6.464 12.673 7.246 12.279 7.856 12.231 8.66 12.617 9.333 13.008 10.007 13.73 10.369 14.456 10.332 14.594 10.864 14.665 11.424 14.665 12 14.665 12.576 14.594 13.136 14.456 13.669 13.73 13.632 13.008 13.993 12.617 14.668 12.231 15.341 12.279 16.145 12.673 16.756 11.879 17.536 10.888 18.12 9.784 18.426 9.451 17.778 8.776 17.333 8 17.333 7.223 17.333 6.549 17.778 6.216 18.426 5.112 18.12 4.121 17.536 3.327 16.756 3.721 16.145 3.768 15.341 3.383 14.668 2.992 13.993 2.27 13.632 1.544 13.669 1.406 13.136 1.335 12.576 1.335 12ZM4.536 14C4.955 14.728 5.078 15.565 4.912 16.35 5.184 16.544 5.474 16.71 5.777 16.85 6.376 16.315 7.16 16 8 16 8.84 16 9.624 16.315 10.223 16.85 10.526 16.71 10.816 16.544 11.088 16.35 10.922 15.565 11.045 14.728 11.464 14 11.883 13.273 12.55 12.751 13.309 12.5 13.325 12.336 13.335 12.168 13.335 12 13.335 11.832 13.325 11.666 13.309 11.501 12.55 11.251 11.883 10.728 11.464 10 11.045 9.272 10.922 8.436 11.088 7.651 10.816 7.458 10.526 7.29 10.223 7.152 9.624 7.685 8.84 8 8 8 7.16 8 6.376 7.685 5.777 7.152 5.474 7.29 5.184 7.458 4.912 7.651 5.078 8.436 4.955 9.272 4.536 10 4.117 10.728 3.451 11.251 2.69 11.501 2.675 11.666 2.665 11.832 2.665 12 2.665 12.168 2.675 12.336 2.69 12.5 3.451 12.751 4.117 13.273 4.536 14ZM8 14C6.895 14 6 13.105 6 12 6 10.896 6.895 10 8 10 9.105 10 10 10.896 10 12 10 13.105 9.105 14 8 14ZM8 12.668C8.368 12.668 8.665 12.368 8.665 12 8.665 11.632 8.368 11.333 8 11.333 7.632 11.333 7.335 11.632 7.335 12 7.335 12.368 7.632 12.668 8 12.668Z' />
  </svg>
);

const LanguageIcon: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 16 16' fill='currentColor' {...props}>
    <path d='M8 14.667C4.318 14.667 1.333 11.682 1.333 8 1.333 4.318 4.318 1.333 8 1.333 11.682 1.333 14.667 4.318 14.667 8 14.667 11.682 11.682 14.667 8 14.667ZM6.473 13.111C5.831 11.751 5.438 10.249 5.351 8.667H2.708C2.972 10.785 4.477 12.517 6.473 13.111ZM6.687 8.667C6.787 10.293 7.252 11.82 8 13.168 8.748 11.82 9.213 10.293 9.313 8.667H6.687ZM13.292 8.667H10.649C10.562 10.249 10.169 11.751 9.527 13.111 11.523 12.517 13.028 10.785 13.292 8.667ZM2.708 7.333H5.351C5.438 5.751 5.831 4.249 6.473 2.889 4.477 3.483 2.972 5.216 2.708 7.333ZM6.687 7.333H9.313C9.213 5.707 8.748 4.18 8 2.832 7.252 4.18 6.787 5.707 6.687 7.333ZM9.527 2.889C10.169 4.249 10.562 5.751 10.649 7.333H13.292C13.028 5.216 11.523 3.483 9.527 2.889Z' />
  </svg>
);

const ChevronRightIcon: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 16 16' fill='currentColor' {...props}>
    <path d='M8.781 8.001L5.481 4.701 6.424 3.758 10.667 8.001 6.424 12.243 5.481 11.3 8.781 8.001Z' />
  </svg>
);

const GetHelpIcon: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 16 16' fill='currentColor' {...props}>
    <path d='M8 14.667C4.318 14.667 1.333 11.682 1.333 8 1.333 4.318 4.318 1.333 8 1.333 11.682 1.333 14.667 4.318 14.667 8 14.667 11.682 11.682 14.667 8 14.667ZM8 13.333C10.945 13.333 13.333 10.945 13.333 8 13.333 5.055 10.945 2.667 8 2.667 5.055 2.667 2.667 5.055 2.667 8 2.667 10.945 5.055 13.333 8 13.333ZM7.333 10H8.667V11.333H7.333V10ZM8.667 8.903V9.333H7.333V8.333C7.333 7.965 7.632 7.667 8 7.667 8.552 7.667 9 7.219 9 6.667 9 6.115 8.552 5.667 8 5.667 7.515 5.667 7.111 6.012 7.019 6.471L5.711 6.209C5.924 5.139 6.868 4.333 8 4.333 9.289 4.333 10.333 5.378 10.333 6.667 10.333 7.723 9.631 8.617 8.667 8.903Z' />
  </svg>
);

const UpgradePlanIcon: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 16 16' fill='currentColor' {...props}>
    <path d='M8 1.333C11.68 1.333 14.667 4.32 14.667 8 14.667 11.68 11.68 14.667 8 14.667 4.32 14.667 1.333 11.68 1.333 8 1.333 4.32 4.32 1.333 8 1.333ZM8 13.333C10.947 13.333 13.333 10.947 13.333 8 13.333 5.053 10.947 2.667 8 2.667 5.053 2.667 2.667 5.053 2.667 8 2.667 10.947 5.053 13.333 8 13.333ZM8.667 8V10.667H7.333V8H5.333L8 5.333 10.667 8H8.667Z' />
  </svg>
);

const LearnMoreIcon: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 16 16' fill='currentColor' {...props}>
    <path d='M8 14.667C4.318 14.667 1.333 11.682 1.333 8 1.333 4.318 4.318 1.333 8 1.333 11.682 1.333 14.667 4.318 14.667 8 14.667 11.682 11.682 14.667 8 14.667ZM8 13.333C10.945 13.333 13.333 10.945 13.333 8 13.333 5.055 10.945 2.667 8 2.667 5.055 2.667 2.667 5.055 2.667 8 2.667 10.945 5.055 13.333 8 13.333ZM8.667 7V10H9.333V11.333H6.667V10H7.333V8.333H6.667V7H8.667ZM9 5.333C9 5.885 8.552 6.333 8 6.333 7.448 6.333 7 5.885 7 5.333 7 4.781 7.448 4.333 8 4.333 8.552 4.333 9 4.781 9 5.333Z' />
  </svg>
);

// Exact paths from Paper (JJX-0) — the Learn more submenu's two rows.
const WebsiteIcon: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 16 16' fill='currentColor' {...props}>
    <path d='M2.667 10.667H13.333V3.333H2.667V10.667ZM8.667 12V13.333H11.333V14.667H4.667V13.333H7.333V12H1.995C1.629 12 1.333 11.701 1.333 11.328V2.671C1.333 2.301 1.637 2 1.995 2H14.005C14.371 2 14.667 2.299 14.667 2.671V11.328C14.667 11.699 14.363 12 14.005 12H8.667Z' />
  </svg>
);

const LinkedInIcon: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 16 16' fill='currentColor' {...props}>
    <path d='M12.224 12.226H10.447V9.441C10.447 8.777 10.433 7.923 9.521 7.923 8.595 7.923 8.453 8.645 8.453 9.393V12.226H6.676V6.5H8.383V7.281H8.406C8.645 6.831 9.225 6.355 10.091 6.355 11.891 6.355 12.225 7.541 12.225 9.083V12.226H12.224ZM4.669 5.717C4.097 5.717 3.637 5.253 3.637 4.684 3.637 4.115 4.097 3.653 4.669 3.653 5.239 3.653 5.701 4.115 5.701 4.684 5.701 5.253 5.239 5.717 4.669 5.717ZM5.56 12.226H3.778V6.5H5.56V12.226ZM13.113 2H2.886C2.397 2 2.001 2.387 2.001 2.865V13.135C2.001 13.613 2.397 14 2.886 14H13.112C13.601 14 14.001 13.613 14.001 13.135V2.865C14.001 2.387 13.601 2 13.112 2H13.113Z' />
  </svg>
);

const LogoutIcon: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 24 24' fill='currentColor' {...props}>
    <path d='M5 5H13V19H5V5ZM19 19H15V5H19V19ZM4 3C3.448 3 3 3.448 3 4V20C3 20.552 3.448 21 4 21H20C20.552 21 21 20.552 21 20V4C21 3.448 20.552 3 20 3H4ZM7 12L11 8.5V15.5L7 12Z' />
  </svg>
);

// Flag icons — exact multi-path SVGs exported from Paper (JGI-0), inlined
// rather than sourced from an icon library since no library will match
// these flags pixel-for-pixel.
const PortugueseFlag: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 16 16' fill='none' {...props}>
    <path d='M0 8C0 11.44 2.171 14.372 5.217 15.502L5.913 8 5.217 0.497C2.171 1.628 0 4.56 0 8Z' fill='#6DA544' />
    <path d='M16 8C16 3.582 12.418 0 8 0 7.021 0 6.084 0.176 5.217 0.497V15.503C6.084 15.824 7.021 16 8 16 12.418 16 16 12.418 16 8Z' fill='#D80027' />
    <path d='M5.217 10.783C6.754 10.783 8 9.537 8 8 8 6.463 6.754 5.217 5.217 5.217 3.681 5.217 2.435 6.463 2.435 8 2.435 9.537 3.681 10.783 5.217 10.783Z' fill='#FFDA44' />
    <path d='M3.652 6.609V8.348C3.652 9.212 4.353 9.913 5.217 9.913 6.082 9.913 6.783 9.213 6.783 8.348V6.609H3.652Z' fill='#D80027' />
    <path d='M5.217 8.869C4.93 8.869 4.695 8.635 4.695 8.348V7.652H5.739V8.348C5.739 8.635 5.505 8.869 5.217 8.869Z' fill='#F0F0F0' />
  </svg>
);

const SpanishFlag: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 16 16' fill='none' {...props}>
    <path d='M0 8C0 8.979 0.176 9.916 0.497 10.783L8 11.479 15.503 10.783C15.824 9.916 16 8.979 16 8 16 7.021 15.824 6.084 15.503 5.217L8 4.522 0.497 5.217C0.176 6.084 0 7.021 0 8H0Z' fill='#FFDA44' />
    <path d='M15.503 5.217C14.372 2.171 11.44 0 8 0 4.56 0 1.628 2.171 0.497 5.217H15.503Z' fill='#D80027' />
    <path d='M0.497 10.783C1.628 13.829 4.56 16 8 16 11.44 16 14.372 13.829 15.503 10.783H0.497Z' fill='#D80027' />
  </svg>
);

const EnglishFlag: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 16 16' fill='none' {...props}>
    <path d='M8 16C12.418 16 16 12.418 16 8 16 3.582 12.418 0 8 0 3.582 0 0 3.582 0 8 0 12.418 3.582 16 8 16Z' fill='#F0F0F0' />
    <path d='M1.654 3.129C1.025 3.947 0.551 4.889 0.275 5.913H4.437L1.654 3.129Z' fill='#0052B4' />
    <path d='M15.725 5.913C15.449 4.889 14.975 3.947 14.346 3.129L11.563 5.913H15.725Z' fill='#0052B4' />
    <path d='M0.275 10.087C0.551 11.111 1.025 12.053 1.654 12.871L4.437 10.087H0.275Z' fill='#0052B4' />
    <path d='M12.871 1.654C12.053 1.025 11.111 0.551 10.087 0.275V4.437L12.871 1.654Z' fill='#0052B4' />
    <path d='M3.129 14.346C3.947 14.975 4.889 15.449 5.913 15.725V11.563L3.129 14.346Z' fill='#0052B4' />
    <path d='M5.913 0.275C4.889 0.551 3.947 1.025 3.129 1.654L5.913 4.437V0.275Z' fill='#0052B4' />
    <path d='M10.087 15.725C11.111 15.449 12.053 14.975 12.871 14.346L10.087 11.563V15.725Z' fill='#0052B4' />
    <path d='M11.563 10.087L14.346 12.871C14.975 12.053 15.449 11.111 15.725 10.087H11.563Z' fill='#0052B4' />
    <path d='M15.932 6.957H9.043 9.043V0.068C8.702 0.023 8.353 0 8 0 7.646 0 7.298 0.023 6.957 0.068V6.957 6.957H0.068C0.023 7.298 0 7.647 0 8 0 8.354 0.023 8.702 0.068 9.043H6.957 6.957V15.932C7.298 15.977 7.646 16 8 16 8.353 16 8.702 15.977 9.043 15.932V9.043 9.043H15.932C15.977 8.702 16 8.354 16 8 16 7.647 15.977 7.298 15.932 6.957Z' fill='#D80027' />
    <path d='M10.087 10.087L13.657 13.657C13.821 13.493 13.977 13.321 14.127 13.143L11.071 10.087H10.087V10.087Z' fill='#D80027' />
    <path d='M5.913 10.087H5.913L2.343 13.657C2.507 13.821 2.679 13.978 2.857 14.127L5.913 11.071V10.087Z' fill='#D80027' />
    <path d='M5.913 5.913V5.913L2.343 2.343C2.179 2.507 2.022 2.679 1.873 2.857L4.929 5.913H5.913V5.913Z' fill='#D80027' />
    <path d='M10.087 5.913L13.657 2.343C13.493 2.179 13.321 2.022 13.143 1.873L10.087 4.929V5.913Z' fill='#D80027' />
  </svg>
);

const FrenchFlag: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 16 16' fill='none' {...props}>
    <path d='M8 16C12.418 16 16 12.418 16 8 16 3.582 12.418 0 8 0 3.582 0 0 3.582 0 8 0 12.418 3.582 16 8 16Z' fill='#F0F0F0' />
    <path d='M16 8C16 4.56 13.829 1.628 10.783 0.497V15.503C13.829 14.372 16 11.44 16 8Z' fill='#D80027' />
    <path d='M0 8C0 11.44 2.171 14.372 5.217 15.503V0.497C2.171 1.628 0 4.56 0 8Z' fill='#0052B4' />
  </svg>
);

const GermanFlag: RemixiconComponentType = (props) => (
  <svg viewBox='0 0 16 16' fill='none' {...props}>
    <path d='M0.497 10.783C1.628 13.829 4.56 16 8 16 11.44 16 14.372 13.829 15.503 10.783L8 10.087 0.497 10.783Z' fill='#FFDA44' />
    <path d='M8 0C4.56 0 1.628 2.171 0.497 5.217L8 5.913 15.503 5.217C14.372 2.171 11.44 0 8 0Z' fill='#000000' />
    <path d='M0.497 5.217C0.176 6.084 0 7.021 0 8 0 8.979 0.176 9.916 0.497 10.783H15.503C15.824 9.916 16 8.979 16 8 16 7.021 15.824 6.084 15.503 5.217H0.497Z' fill='#D80027' />
  </svg>
);

type Language = {
  id: string;
  label: string;
  flag: RemixiconComponentType;
};

const LANGUAGES: Language[] = [
  { id: 'pt', label: 'Portuguese', flag: PortugueseFlag },
  { id: 'es', label: 'Spanish', flag: SpanishFlag },
  { id: 'en', label: 'English', flag: EnglishFlag },
  { id: 'fr', label: 'French', flag: FrenchFlag },
  { id: 'de', label: 'German', flag: GermanFlag },
];

function UserAvatar({ user }: { user: CurrentUser }) {
  if (user.avatarUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- mock/demo data, may be a remote URL later
      <img
        src={user.avatarUrl}
        alt=''
        className='size-9 shrink-0 rounded-full object-cover'
      />
    );
  }

  return (
    <span className='flex size-9 shrink-0 items-center justify-center rounded-full bg-bg-soft-200 text-[13px] font-medium text-text-strong-950'>
      {user.initials}
    </span>
  );
}
