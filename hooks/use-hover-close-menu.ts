'use client';

import * as React from 'react';

// Backs a Radix DropdownMenu.Root that stays open regardless of where the
// cursor rests until the user actually enters the popover content at least
// once — only then does leaving arm the delayed auto-close. This matters
// because a user's cursor doesn't stay glued to the trigger after clicking
// it; it naturally rests wherever the click landed, often on an adjacent
// element (an avatar, a label). Treating that as "the user left" would close
// a popover the user hasn't even looked at yet. `cancelClose`/`scheduleClose`
// are meant to be wired only to the popover content (Content/SubContent) —
// not the trigger — so the trigger's own hover state never drives closing.
//
// Uses a hover ref-count rather than naive cancel-on-enter/schedule-on-leave
// pairing: the main Content and each Sub's SubContent are separate DOM
// subtrees (Sub/SubContent portal to document.body), so the pointer crossing
// between them can fire "leave old" slightly before "enter new" lands — a
// plain clearTimeout race can lose that ordering and close the menu out from
// under the user mid-transition. Counting instead, and only closing if the
// count is still zero when the timer fires, is immune to that ordering.
export function useHoverCloseMenu(closeDelayMs = 300, defaultOpen = false) {
  const [open, setOpen] = React.useState(defaultOpen);
  const hoverCount = React.useRef(0);
  const engaged = React.useRef(false);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearPendingClose = React.useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const cancelClose = React.useCallback(() => {
    hoverCount.current += 1;
    engaged.current = true;
    clearPendingClose();
  }, [clearPendingClose]);

  const scheduleClose = React.useCallback(() => {
    hoverCount.current = Math.max(0, hoverCount.current - 1);
    clearPendingClose();
    if (!engaged.current) return; // never entered the popover yet — stay open
    closeTimer.current = setTimeout(() => {
      if (hoverCount.current === 0) setOpen(false);
    }, closeDelayMs);
  }, [clearPendingClose, closeDelayMs]);

  const onOpenChange = React.useCallback(
    (next: boolean) => {
      if (next) {
        hoverCount.current = 0;
        engaged.current = false;
        clearPendingClose();
      }
      setOpen(next);
    },
    [clearPendingClose],
  );

  React.useEffect(() => () => clearPendingClose(), [clearPendingClose]);

  return { open, onOpenChange, cancelClose, scheduleClose } as const;
}
