'use client';

// The notifications drawer, composed from the design system.
//
// Shell follows components/blocks/drawer/support-drawer.tsx:74, the only
// canonical: true drawer block: Drawer.Root / Content / Header / Title / Body,
// with drawerPanelClassName for the panel. design-system.md:655 and :668 both
// route side panels to that pair. No width override: the polish-pass frame
// (2305:28940) is a 400px-wide frame, same as drawerPanelClassName's own
// default — the earlier 540px override matched an older frame that's since
// been superseded.
//
// overflow-hidden on Content is load-bearing. It scrolls the list only,
// keeping the header and tabs in reach, and clips the panel to its own
// rounded corners on both axes — components/ui/drawer.tsx:55 sets
// overflow-y-auto on the panel itself, and without a horizontal clip too,
// content wider than the panel bleeds past the rounded right edge and
// paints over the ring border (Figma node 2310:29358's root uses
// overflow-clip on both axes for the same reason).

import * as React from 'react';
import { RiErrorWarningLine, RiInboxLine } from '@remixicon/react';
import { AnimatePresence, motion } from 'motion/react';

import * as Alert from '@/components/ui/alert';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Drawer from '@/components/ui/drawer';
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal';
import * as Tooltip from '@/components/ui/tooltip';
import { drawerPanelClassName } from '@/components/blocks/drawer/drawer-panel';
import { EmptyState } from '@/components/blocks/empty-state';
import { cn } from '@/utils/cn';

import type { NotificationItem } from './mock-data';
import { NotificationLoadingRows } from './notification-loading-rows';
import { NotificationRow, destinationOf } from './notification-row';
import { NotificationsDrawerFooter } from './notifications-drawer-footer';
import {
  fetchNotifications,
  markNotificationsRead,
} from './notifications-service';
import type { NotificationsDrawerSettings } from './settings';
import { useReadTracking } from './use-read-tracking';

export type Tab = 'all' | 'unread';

const TABS: { value: Tab; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'unread', label: 'Unread' },
];

const EMPTY_COPY: Record<
  Tab,
  { title: string; description: string; actionLabel: string; goTo: Tab }
> = {
  all: {
    title: 'No notifications',
    description:
      'New activity on the tenders you are involved in shows up here.',
    actionLabel: 'View unread notifications',
    goTo: 'unread',
  },
  unread: {
    title: 'No unread notifications',
    description: "You're caught up. New activity shows up here first.",
    actionLabel: 'View all notifications',
    goTo: 'all',
  },
};

type Entry = { at: string; item: NotificationItem };

export type NotificationsDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: NotificationsDrawerSettings;
  onSettingsChange: (patch: Partial<NotificationsDrawerSettings>) => void;
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  /** The route prints where an item would have gone. No pages were built. */
  onNavigate: (label: string, placeholder: boolean) => void;
  onUnreadCountChange: (count: number) => void;
  /**
   * Playground-only. Renders the panel in normal flow instead of inside
   * Drawer.Root's fixed, portal-to-body overlay, so it can be pinned inside a
   * sandbox container instead of floating over the whole viewport. Nothing
   * in production sets this.
   */
  inline?: boolean;
};

export function NotificationsDrawer({
  open,
  onOpenChange,
  settings,
  onSettingsChange,
  tab,
  onTabChange,
  onNavigate,
  onUnreadCountChange,
  inline = false,
}: NotificationsDrawerProps) {
  const [items, setItems] = React.useState<NotificationItem[]>([]);
  const [batchTotals, setBatchTotals] = React.useState<Record<string, number>>(
    {},
  );
  /** Read in this session, not yet committed. This is the deferred reflow. */
  const [pendingReads, setPendingReads] = React.useState<Set<string>>(
    new Set(),
  );
  const [page, setPage] = React.useState(0);
  /**
   * Derived from the fetch promise's own lifecycle, not from
   * settings.surface: the sandbox's surface dial only steers what the fake
   * network layer does (hang, reject, resolve empty), it never gets trusted
   * directly as "what to render". See notifications-service.ts.
   */
  const [loadState, setLoadState] = React.useState<
    'loading' | 'error' | 'ready'
  >('loading');
  /** Keyboard-selected row, driven by the footer's ↑/↓ hint. Mouse hover
   * moves it too, so keyboard and hover never disagree about which row is
   * selected. */
  const [highlightedId, setHighlightedId] = React.useState<string | null>(
    null,
  );

  const scrollerRef = React.useRef<HTMLDivElement | null>(null);
  const readOnly = settings.permission === 'read-only';

  // Guards a fetch whose surface changed mid-flight (e.g. the dial flips
  // while a slow request is still pending) from clobbering state with a
  // stale response once it eventually settles.
  const requestIdRef = React.useRef(0);

  const load = React.useCallback(() => {
    const requestId = ++requestIdRef.current;
    setLoadState('loading');

    fetchNotifications({
      dataset: settings.dataset,
      unreadCount: settings.unreadCount,
      surface: settings.surface,
      latency: settings.latency,
      failNextAction: settings.failNextAction,
    }).then(
      (built) => {
        if (requestIdRef.current !== requestId) return;
        setItems(built.items);
        setBatchTotals(built.batchTotals);
        setPendingReads(new Set());
        setPage(0);
        setLoadState('ready');
      },
      () => {
        if (requestIdRef.current !== requestId) return;
        setLoadState('error');
      },
    );
  }, [
    settings.dataset,
    settings.unreadCount,
    settings.surface,
    settings.latency,
    settings.failNextAction,
  ]);

  // Refetch whenever the shape of the request changes. No realtime and no
  // push: the list only refreshes here and on open, which is [suggested].
  React.useEffect(() => {
    load();
  }, [load]);

  /**
   * No-reflow is decided, not dialled: placement always uses committed
   * status only, ignoring this session's pendingReads. That is what "the
   * list never reflows underneath the user" means.
   */
  const isUnread = React.useCallback(
    (item: NotificationItem): boolean => !item.read,
    [],
  );

  // No grouping: every notification is its own row, newest first.
  const entries = React.useMemo<Entry[]>(() => {
    return items
      .filter((item) => (tab === 'unread' ? isUnread(item) : true))
      .map((item) => ({ item, at: item.createdAt }))
      .sort((a, b) => +new Date(b.at) - +new Date(a.at));
  }, [items, isUnread, tab]);

  const limit = settings.pageLimit * (page + 1);
  const visibleEntries = entries.slice(0, limit);
  const remainingEntries = entries.length - visibleEntries.length;

  // The list underneath a highlighted row can change shape (tab switch,
  // reflow on close) out from under it, so it only ever holds a row that's
  // actually on screen right now.
  React.useEffect(() => {
    if (!open) {
      setHighlightedId(null);
      return;
    }
    setHighlightedId((current) =>
      current && visibleEntries.some((entry) => entry.item.id === current)
        ? current
        : null,
    );
  }, [open, tab, visibleEntries]);

  // Keep the highlighted row in view as it moves past the scroller's edges,
  // e.g. once "Load more" has pushed it further down the list.
  React.useEffect(() => {
    if (!highlightedId) return;
    const row = scrollerRef.current?.querySelector<HTMLElement>(
      `[data-row-id="${highlightedId}"]`,
    );
    row?.scrollIntoView({ block: 'nearest' });
  }, [highlightedId]);

  const counts = React.useMemo(() => {
    // Counts are decided live: the bell/tab badge has to reflect "roughly how
    // many" unread without the drawer being open, which only works if a read
    // this session drops the count immediately rather than waiting to commit.
    let unread = 0;

    items.forEach((item) => {
      const isRead = item.read || pendingReads.has(item.id);
      if (!isRead) unread += 1;
    });

    return { unread };
  }, [items, pendingReads]);

  React.useEffect(() => {
    onUnreadCountChange(counts.unread);
  }, [counts.unread, onUnreadCountChange]);

  // No-reflow means every read this session stays a pending read — never a
  // direct item mutation — until commitIds below actually persists it.
  const markRead = React.useCallback((id: string) => {
    setPendingReads((current) => {
      if (current.has(id)) return current;
      const next = new Set(current);
      next.add(id);
      return next;
    });
  }, []);

  // Read on visibility, with a real ratio and a real dwell.
  useReadTracking({
    containerRef: scrollerRef,
    enabled: open && settings.readTrigger !== 'manual' && loadState === 'ready',
    requireScroll: settings.readTrigger === 'scroll',
    threshold: settings.visibleThreshold,
    dwellMs: settings.dwellMs,
    onRead: markRead,
    revision: `${tab}|${visibleEntries.length}`,
  });

  /**
   * The one real "mark read" action. Chunks ids into ≤100-per-request
   * batches (the spec's cap) before applying the result to items — commitReads
   * and markAllAsRead both route through this instead of each mutating items
   * on their own.
   */
  const commitIds = React.useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;
      const idSet = new Set(ids);
      void markNotificationsRead(ids, settings.latency).then(() => {
        setItems((all) =>
          all.map((item) =>
            idSet.has(item.id) ? { ...item, read: true } : item,
          ),
        );
      });
    },
    [settings.latency],
  );

  /** Commit the session's reads. Only now is the list allowed to reflow. */
  const commitReads = React.useCallback(() => {
    setPendingReads((current) => {
      if (current.size === 0) return current;
      commitIds(Array.from(current));
      return new Set();
    });
  }, [commitIds]);

  const handleOpenChange = (next: boolean) => {
    if (!next) commitReads();
    onOpenChange(next);
  };

  const openItem = (item: NotificationItem) => {
    const destination = destinationOf(item);
    if (!destination) return;
    markRead(item.id);
    commitReads();
    onOpenChange(false);
    onNavigate(destination.label, destination.placeholder);
  };

  // Mark all as read against the no-reflow rule: this stages every unread row
  // rather than emptying the list underneath the user. The rows go quiet, hold
  // position, and relocate on close, where commitReads picks up these staged
  // ids and runs them through the same batched action.
  const markAllAsRead = () => {
    setPendingReads((current) => {
      const next = new Set(current);
      items.forEach((item) => {
        if (!item.read) next.add(item.id);
      });
      return next;
    });
  };

  const retry = () => {
    load();
  };

  const isEmpty = loadState === 'ready' && entries.length === 0;

  // ArrowUp/ArrowDown move the highlight; Enter opens whatever's currently
  // highlighted. Lives on document, not the scroller, so it works whether or
  // not a row happens to have real DOM focus — the footer's ↑/↓ hint promises
  // this works from anywhere in the open drawer.
  React.useEffect(() => {
    if (!open || isEmpty || loadState !== 'ready') return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key !== 'ArrowDown' &&
        event.key !== 'ArrowUp' &&
        event.key !== 'Enter'
      ) {
        return;
      }

      const ids = visibleEntries.map((entry) => entry.item.id);
      if (ids.length === 0) return;

      if (event.key === 'Enter') {
        const item = visibleEntries.find(
          (entry) => entry.item.id === highlightedId,
        )?.item;
        if (!item) return;
        event.preventDefault();
        openItem(item);
        return;
      }

      event.preventDefault();
      const currentIndex = highlightedId ? ids.indexOf(highlightedId) : -1;
      const nextIndex =
        event.key === 'ArrowDown'
          ? Math.min(currentIndex + 1, ids.length - 1)
          : Math.max(currentIndex - 1, 0);

      setHighlightedId(ids[nextIndex === -1 ? 0 : nextIndex]);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, isEmpty, loadState, visibleEntries, highlightedId, openItem]);

  const body = (() => {
    if (loadState === 'loading') return <NotificationLoadingRows />;

    if (loadState === 'error') {
      // Must never read as "you have no notifications".
      // component-patterns.md:181 routes a failed fetch to an alert with retry.
      return (
        <div className='p-3'>
          <Alert.Root variant='lighter' status='error' size='large'>
            <Alert.Icon as={RiErrorWarningLine} />
            <div className='flex flex-col items-start gap-3'>
              <div className='flex flex-col gap-1'>
                <div className='text-label-sm text-text-strong-950'>
                  Couldn&apos;t load your notifications
                </div>
                <div>
                  This is a connection problem, not an empty inbox. The list may
                  be out of date.
                </div>
              </div>
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='xsmall'
                onClick={retry}
              >
                Try again
              </Button.Root>
            </div>
          </Alert.Root>
        </div>
      );
    }

    if (isEmpty) {
      const copy = EMPTY_COPY[tab];
      return (
        <EmptyState
          icon={RiInboxLine}
          title={copy.title}
          description={copy.description}
          actionLabel={copy.actionLabel}
          onAction={() => onTabChange(copy.goTo)}
          className='px-3 py-12'
        />
      );
    }

    return (
      <div className='flex flex-col'>
        {visibleEntries.map((entry) => (
          <NotificationRow
            key={entry.item.id}
            item={entry.item}
            pendingRead={pendingReads.has(entry.item.id)}
            matchCount={
              entry.item.batchId ? batchTotals[entry.item.batchId] : undefined
            }
            settings={settings}
            onOpen={openItem}
            highlighted={entry.item.id === highlightedId}
            onHighlight={setHighlightedId}
          />
        ))}

        {remainingEntries > 0 && (
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='xsmall'
            className='mx-3 my-3'
            onClick={() => setPage((current) => current + 1)}
          >
            Load more, {remainingEntries} left
          </Button.Root>
        )}
      </div>
    );
  })();

  const markAllButton = (
    <button
      type='button'
      disabled={readOnly || counts.unread === 0}
      onClick={markAllAsRead}
      className={cn(
        'shrink-0 text-label-xs text-text-soft-400 transition duration-200 ease-out',
        'hover:text-text-sub-600',
        'disabled:pointer-events-none disabled:opacity-50',
      )}
    >
      Mark all read
    </button>
  );

  const panelInner = (
    <>
      <TabMenuHorizontal.Root
        value={tab}
        onValueChange={(value) => onTabChange(value as Tab)}
        className='flex min-h-0 flex-1 flex-col'
      >
        {/*
          Figma node 2303:28046: one row, no separate drawer header.
          Tabs and "Mark all read" share the row that used to be two
          rows (Drawer.Header + tab list). No py- here: the
          primitive's List is h-12 with its own py-3.5 per Trigger
          (tab-menu-horizontal.tsx:69), which already nets the row's
          48px (14+20+14). Adding py-3.5 on this wrapper too would
          double the padding and lift the travelling underline (drawn
          at -bottom-px of the List) off the row's own border-b.
        */}
        <div className='flex shrink-0 items-center gap-5 border-b border-stroke-soft-200 px-4'>
          <TabMenuHorizontal.List
            className='gap-5 border-none'
            aria-label='Notification status'
          >
            {TABS.map(({ value, label }) => (
              <TabMenuHorizontal.Trigger key={value} value={value}>
                {label}
                {value === 'unread' && counts.unread > 0 && (
                  <Badge.Root size='small' variant='filled' color='blue'>
                    {counts.unread}
                  </Badge.Root>
                )}
              </TabMenuHorizontal.Trigger>
            ))}
          </TabMenuHorizontal.List>

          {settings.markAllAsRead ? (
            <div className='ml-auto'>
              {readOnly ? (
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <span>{markAllButton}</span>
                  </Tooltip.Trigger>
                  <Tooltip.Content size='xsmall'>
                    You have view-only access to this workspace
                  </Tooltip.Content>
                </Tooltip.Root>
              ) : (
                markAllButton
              )}
            </div>
          ) : null}
        </div>

        {TABS.map(({ value }) => (
          <TabMenuHorizontal.Content
            key={value}
            value={value}
            className='min-h-0 flex-1 overflow-hidden outline-none'
          >
            {/*
              No padding: Figma node 2276:9176 is a bare stack, so
              rows run full bleed to the panel edge and carry their
              own px-3 py-4. Everything that is not a row re-adds the
              inset itself. The border-b matches Figma's
              "Notification" wrapper (2305:28942), separating the
              list from the footer below it — a full 1px, unlike each
              row's own 0.5px border-b. The mask fades rows into the
              header/footer edges instead of hard-clipping them.
            */}
            <div
              ref={scrollerRef}
              className='h-full overflow-y-auto border-b border-stroke-soft-200 [mask-image:linear-gradient(to_bottom,transparent,black_12px,black_calc(100%-12px),transparent)]'
            >
              {body}
            </div>
          </TabMenuHorizontal.Content>
        ))}
      </TabMenuHorizontal.Root>

      <NotificationsDrawerFooter />
    </>
  );

  // Playground sandbox: no Drawer.Root, no portal, no fixed positioning —
  // the panel renders in normal flow so a fixed-size wrapper around it (the
  // sandbox) is the only thing that ever clips it.
  if (inline) {
    return (
      <AnimatePresence>
        {open && (
          <motion.div
            className='flex h-full w-full flex-col overflow-hidden rounded-20 border border-stroke-soft-200 bg-bg-white-0 shadow-regular-md'
            initial={{ opacity: 0, scale: 0.98, x: 12 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.98, x: 12 }}
            transition={{ type: 'spring', duration: 0.4, bounce: 0.12 }}
          >
            {panelInner}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Drawer.Root open={open} onOpenChange={handleOpenChange}>
      {/*
        AnimatePresence sits outside the open check so it sees the panel's
        removal and can hold it mounted through its exit animation. Content
        gets forceMount (Radix would otherwise unmount it the instant `open`
        goes false, before Motion gets a turn) and disableDefaultAnimation
        (Radix's own CSS slide/fade would otherwise fight the motion.div's
        transform/opacity on the same node). asChild puts the motion.div in
        as Content's actual DOM root rather than a nested wrapper, so Radix's
        focus trap and aria wiring still land on the right element.

        Entry and exit share the same short 12px travel + scale — a small
        materialize near the trigger, not a full-width slide, per the
        Linear-style direction: a spring here also keeps it interruptible if
        opened and closed in quick succession, unlike a fixed-duration slide.
      */}
      <AnimatePresence>
        {open && (
          <Drawer.Content
            asChild
            forceMount
            disableDefaultAnimation
            overlayClassName='bg-overlay/40 backdrop-blur-none'
            aria-label='Notifications'
          >
            <motion.div
              className={cn(
                drawerPanelClassName,
                // flex flex-col: this used to come from the wrapper div
                // DrawerContent renders around its children (the one
                // disableDefaultAnimation skips) — without it, the tab
                // root's flex-1 below has no flex parent to size against,
                // so the list collapses to content height and the footer
                // ends up right after the last row instead of pinned to
                // the bottom. No width class: drawerPanelClassName's own
                // w-[min(400px,calc(100%-16px))] already matches this frame.
                'flex flex-col overflow-hidden',
              )}
              initial={{ opacity: 0, scale: 0.98, x: 12 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.98, x: 12 }}
              transition={{ type: 'spring', duration: 0.4, bounce: 0.12 }}
            >
              {panelInner}
            </motion.div>
          </Drawer.Content>
        )}
      </AnimatePresence>
    </Drawer.Root>
  );
}
