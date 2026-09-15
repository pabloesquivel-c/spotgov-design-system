'use client';

// The selected-options chip row: what a set-kind filter's value trigger
// shows once the user has picked something, instead of static "Choose..."
// text. Figma: node 2554:32332 "Dropdown Items [1.1]". Built entirely from
// the existing Tag primitive (variant='gray' already matches the Figma
// chip's bg-weak-50/rounded-6/12px-label styling) — no new visual system.
//
// Each chip removes itself directly; the row it's inside still opens the
// picker for anything not on a chip (see FilterValueTrigger's `chips` mode
// in filter-row.tsx, which hosts this).

import * as React from 'react';

import * as Tag from '@/components/ui/tag';

export type SelectedValueChip = {
  id: string;
  label: string;
  onRemove: () => void;
};

export function SelectedValueChips({ chips }: { chips: SelectedValueChip[] }) {
  return (
    <>
      {chips.map((chip) => (
        <Tag.Root key={chip.id} variant='gray' className='max-w-[160px] shrink-0'>
          <span className='truncate'>{chip.label}</span>
          <Tag.DismissButton
            aria-label={`Remove ${chip.label}`}
            onClick={(e) => {
              // Stops the click from also bubbling to the trigger's own
              // onClick, which would reopen the popover this chip just
              // removed itself from.
              e.stopPropagation();
              chip.onRemove();
            }}
          />
        </Tag.Root>
      ))}
    </>
  );
}
