// Sidebar footer — avatar, name, email. Matches Paper's polished pass
// exactly: no divider above it beyond the footer's own top border.

import { cn } from '@/utils/cn';
import { FadeLabel } from './skeleton-collapse';
import type { CurrentUser } from './skeleton-mock-session';

export function SkeletonAccountFooter({
  user,
  isCollapsed = false,
}: {
  user: CurrentUser;
  isCollapsed?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center border-t border-stroke-soft-200',
        isCollapsed ? 'justify-center gap-0 px-1 py-2.5' : 'gap-2.5 p-2.5',
      )}
    >
      <UserAvatar user={user} />
      <FadeLabel isCollapsed={isCollapsed} className='flex min-w-0 flex-col gap-px'>
        <span className='truncate text-[13px] font-medium leading-4 text-text-strong-950'>
          {user.name}
        </span>
        <span className='truncate text-[12px] leading-4 text-text-sub-600'>
          {user.email}
        </span>
      </FadeLabel>
    </div>
  );
}

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
