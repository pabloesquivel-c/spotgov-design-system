'use client';

import { RiArrowDownLine, RiArrowUpLine } from '@remixicon/react';

import * as Drawer from '@/components/ui/drawer';
import * as Kbd from '@/components/ui/kbd';

// Adapted from command-menu-shortcut-footer.tsx, matching the Figma frame's
// button={false} state (node 2303:28128). The actual ↑/↓/Enter handling
// lives in notifications-drawer.tsx, not here — this is just the hint.
//
// No border-t here: the "Notification" wrapper right above this footer
// already draws the separating hairline on its own border-b (node
// 2303:28047), and the raw Figma export for this footer node has no border
// of its own.
export function NotificationsDrawerFooter() {
  return (
    <Drawer.Footer className='shrink-0 justify-start gap-2 px-5 py-3.5'>
      <span className='text-paragraph-xs text-text-sub-600'>Use</span>
      <Kbd.Root className='flex size-5 items-center justify-center bg-bg-weak-50 p-0.5 text-text-sub-600 ring-1 ring-inset ring-stroke-soft-200'>
        <RiArrowUpLine className='size-4 shrink-0' />
      </Kbd.Root>
      <Kbd.Root className='flex size-5 items-center justify-center bg-bg-weak-50 p-0.5 text-text-sub-600 ring-1 ring-inset ring-stroke-soft-200'>
        <RiArrowDownLine className='size-4 shrink-0' />
      </Kbd.Root>
      <span className='text-paragraph-xs text-text-sub-600'>to navigate</span>
    </Drawer.Footer>
  );
}
