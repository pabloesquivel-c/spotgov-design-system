// Sidebar footer — avatar, name, email. Matches Paper's polished pass
// exactly: no divider above it beyond the footer's own top border.

import type { CurrentUser } from './skeleton-mock-session';

export function SkeletonAccountFooter({ user }: { user: CurrentUser }) {
  return (
    <div className='flex shrink-0 items-center gap-2.5 border-t border-stroke-soft-200 p-2.5'>
      <UserAvatar user={user} />
      <span className='flex min-w-0 flex-1 flex-col gap-px'>
        <span className='truncate text-[13px] font-medium leading-4 text-text-strong-950'>
          {user.name}
        </span>
        <span className='truncate text-[12px] leading-4 text-text-sub-600'>
          {user.email}
        </span>
      </span>
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
