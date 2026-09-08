'use client';

// One notification row, per Figma node 2303:28731 (the template shared by the
// three person types: mention, owner, custom_field).
//
// Two things deliberately diverge from the raw Figma export:
//   1. text-text-sub-600 on the description and timestamp, not text-soft-400.
//      Figma specs soft-400 there, but accessibility.md:29 bans it below AA
//      for 12 to 14px text on white, so contrast wins over the literal spec.
//   2. Avatar size='24' (the design system's real 24px variant, text-label-xs)
//      instead of hand-rolling the frame's scaled-down 9.6px initials.
//
// Unread is now signalled by the dot in the right rail alone, not by title
// weight/colour: Figma renders the actor name in text-strong-950 and the rest
// of the line in text-sub-600 regardless of read state.

import { RiArrowRightUpLine, RiExternalLinkLine } from '@remixicon/react';
import { AnimatePresence, motion } from 'motion/react';

import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import { cn } from '@/utils/cn';

import { TYPE_META, relativeTime, type NotificationItem } from './mock-data';
import type { NotificationsDrawerSettings } from './settings';

export type Destination = { label: string; placeholder: boolean };

export function destinationOf(item: NotificationItem): Destination | null {
  if (item.placeholder) return { label: item.placeholder, placeholder: true };

  // New-opportunity notifications open the Opportunities page with the
  // batch's filter applied, per spec — never a tender detail page, so this
  // branches on batchId rather than falling through to the tenderId case
  // below (that id on an opportunity row is a stand-in subject tender, not a
  // real destination).
  if (item.type === 'opportunity') {
    if (!item.batchId) return null;
    return { label: `opportunities?batch=${item.batchId}`, placeholder: false };
  }

  const id = item.tenderId;
  if (!id) return null;
  if (item.type === 'mention') {
    return {
      label: `tender/${id} › Notes › note #${item.noteId}`,
      placeholder: false,
    };
  }
  return { label: `tender/${id}`, placeholder: false };
}

const AVATAR_COLORS = [
  'gray',
  'blue',
  'purple',
  'sky',
  'yellow',
  'red',
] as const;

function avatarColor(name: string) {
  const sum = Array.from(name).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function initialsOf(name: string) {
  return name
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('');
}

/**
 * Every string here is transcribed from the Figma frame, nodes 2276:9177
 * through 2276:9181. The emphasised spans are the ones Figma sets in Medium
 * against the line's Regular: the actor, the field value, the saved search.
 */
function CopyLine({
  item,
  nameFieldInCopy,
}: {
  item: NotificationItem;
  nameFieldInCopy: boolean;
}) {
  const who = item.actorName ? (
    <span className='font-medium text-text-strong-950'>
      {item.actorName}
    </span>
  ) : (
    'Someone'
  );

  switch (item.type) {
    case 'mention':
      return <>{who} mentioned you in notes</>;
    case 'owner':
      return (
        <>
          {who} assigned you as owner
          {nameFieldInCopy && item.phase ? ` in ${item.phase}` : ''}
        </>
      );
    case 'custom_field':
      return (
        <>
          {who} tagged you as{' '}
          <span className='font-medium text-text-strong-950'>
            {item.fieldName ?? 'a custom field'}
          </span>
        </>
      );
    case 'revision':
      // No emphasis run: node 2303:28845 sets the whole line to
      // text-strong-950, unlike every other type where the title paragraph
      // defaults to sub-600 and only the actor/field/search span brightens.
      return (
        <span className='text-text-strong-950'>
          Your proposal revision is ready!
        </span>
      );
    case 'opportunity':
      return (
        <>
          New tender matches for{' '}
          <span className='font-medium text-text-strong-950'>
            {item.savedSearchName}
          </span>
        </>
      );
  }
}

function Attribution({
  item,
  attribution,
}: {
  item: NotificationItem;
  attribution: NotificationsDrawerSettings['attribution'];
}) {
  const meta = TYPE_META[item.type];
  const preferAvatar = meta.person || attribution === 'avatar';

  if (preferAvatar && item.actorName) {
    return (
      <Avatar.Root size='24' color={avatarColor(item.actorName)}>
        {initialsOf(item.actorName)}
      </Avatar.Root>
    );
  }

  const Icon = meta.icon;

  return (
    <span
      className='flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'
      aria-hidden
    >
      <Icon className={cn('size-3', meta.iconClassName)} />
    </span>
  );
}

export type NotificationRowProps = {
  item: NotificationItem;
  /** Read in this session but not yet committed, so it holds position. */
  pendingRead: boolean;
  /** Authoritative batch size, for the opportunity row's own action button. */
  matchCount?: number;
  settings: NotificationsDrawerSettings;
  onOpen: (item: NotificationItem) => void;
  /** Current keyboard-selected row, driven by the footer's ↑/↓ hint. */
  highlighted?: boolean;
  /** Mouse hover also moves the keyboard selection, so the two never fight. */
  onHighlight?: (id: string) => void;
};

export function NotificationRow({
  item,
  pendingRead,
  matchCount,
  settings,
  onOpen,
  highlighted = false,
  onHighlight,
}: NotificationRowProps) {
  const looksRead = item.read || pendingRead;
  const unread = !looksRead;
  const destination = destinationOf(item);
  const clickable = destination !== null;

  const metaLine = [item.tenderTitle, item.issuer].filter(Boolean).join(' · ');

  // The opportunity row (node 2276:9181) names the saved search in its own
  // title, so its description reports the size of the batch rather than a
  // tender that the title never mentioned. Every other type, including
  // mention, uses CopyLine as the title and metaLine as the description —
  // node 2303:28731 draws mention the same as owner and custom_field.
  const isOpportunity = item.type === 'opportunity';
  const isPerson = TYPE_META[item.type].person;

  return (
    <div
      data-row-id={item.id}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-disabled={clickable ? undefined : true}
      onClick={clickable ? () => onOpen(item) : undefined}
      onMouseEnter={() => onHighlight?.(item.id)}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                // Stopped here so the drawer's own ArrowUp/ArrowDown handler,
                // which also reacts to Enter for its own highlighted row,
                // doesn't fire a second time for a plain Tab-focused row.
                event.stopPropagation();
                onOpen(item);
              }
            }
          : undefined
      }
      className={cn(
        'group flex items-start gap-4 border-b border-stroke-soft-200 p-4 [border-bottom-width:0.5px]',
        'transition duration-200 ease-out',
        'outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-base',
        clickable ? 'cursor-pointer' : 'cursor-default',
        // No CSS hover: here on purpose. Hover and keyboard nav share one
        // highlight, driven only by this prop — a real :hover pseudo-class
        // would keep painting the row under a stationary cursor even after
        // ArrowUp/ArrowDown moves the highlight elsewhere, so two rows would
        // light up at once.
        highlighted && 'bg-bg-weak-50',
      )}
    >
      <div
        className={cn(
          'flex min-w-0 flex-1 gap-2',
          isPerson ? 'items-center' : 'items-start',
        )}
      >
        <Attribution item={item} attribution={settings.attribution} />

        <div
          className={cn(
            'flex min-w-0 flex-1 flex-col',
            isOpportunity ? 'gap-2' : 'gap-1',
          )}
        >
          <p
            className={cn(
              'text-[13px] tracking-[-0.078px] text-text-sub-600',
              isOpportunity ? 'leading-[20px]' : 'truncate leading-[16px]',
            )}
          >
            <CopyLine item={item} nameFieldInCopy={settings.nameFieldInCopy} />
          </p>

          {/*
            The opportunity row (node 2303:28771) has no description line: the
            title wraps to two lines and the button is the next element, not
            a "N new tenders found" line under it.
          */}
          {!isOpportunity && (
            <p className='truncate text-[12px] leading-[16px] text-text-sub-600'>
              {metaLine}
            </p>
          )}

          {isOpportunity && (
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='xxsmall'
              className='w-fit text-[13px] leading-[20px] tracking-[-0.078px]'
              onClick={(event) => {
                event.stopPropagation();
                onOpen(item);
              }}
            >
              View {matchCount ?? ''} new opportunities
              <Button.Icon as={RiArrowRightUpLine} />
            </Button.Root>
          )}

          {destination?.placeholder && (
            <Badge.Root
              size='medium'
              variant='lighter'
              color='gray'
              className='mt-1.5 w-fit'
            >
              <Badge.Icon as={RiExternalLinkLine} />
              {destination.label}, coming soon
            </Badge.Root>
          )}

          {!clickable && (
            <Badge.Root
              size='medium'
              variant='lighter'
              color='gray'
              className='mt-1.5 w-fit'
            >
              No longer available
            </Badge.Root>
          )}
        </div>
      </div>

      {/*
        Right rail, per node 2305:28954: a 14x14 "Dot Area" (a centred 6px
        primary-base dot, only when unread) next to the timestamp. Replaces
        the old inline "{time} · {meta}" pattern — the time is never in the
        description anymore.
      */}
      <div className='flex shrink-0 items-center gap-1'>
        {/*
          initial={false}: a dot only ever goes unread → read in this data
          model, never the reverse, so appearing should never animate — only
          the exit (a real state change) is worth signalling.
        */}
        <AnimatePresence initial={false}>
          {unread && (
            <motion.span
              className='flex size-3.5 shrink-0 items-center justify-center'
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              aria-hidden
            >
              <span className='size-1.5 rounded-full bg-primary-base' />
            </motion.span>
          )}
        </AnimatePresence>
        <span className='whitespace-nowrap text-[12px] leading-[16px] text-text-sub-600'>
          {relativeTime(item.createdAt)}
        </span>
      </div>
    </div>
  );
}
