'use client';

// The Views dropdown: what opens from the page header's "Views" button.
// Figma:
//   2446:35250 "Body" — has views, no edits.
//   2446:35264 — editing a view, adds the Update/Save-as-new/Reset footer.
//   2446:35283 — no views exist yet.
//   2446:35295 — search matched nothing.
// Plain rows, no checkboxes — a view is selected, not multi-checked — with
// the current view's row taking the weak-50 background.

import * as React from 'react';
import { RiSearch2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { CheckboxPickerShell } from './checkbox-search-picker';

// More than fits in the max-height below, on purpose — this is what forces
// the list to actually scroll instead of just having room to.
const VIEWS = [
  'Medical Equipments',
  'Aveiro Only Tenders 2026',
  'CPV 336, Madrid',
  'Only Pharma Tenders 2026',
  'Road Maintenance, Braga',
  'IT Services Nationwide',
  'Consultancy Under €50k',
  'Waste Management 2025-2026',
];

function ViewsList({
  current,
  onSelect,
}: {
  current: string;
  onSelect: (view: string) => void;
}) {
  return (
    // max-h + overflow-y-auto, not a fixed height: below the cap, the list
    // sizes to content (2 views shouldn't leave empty space); once it has
    // more rows than fit, it scrolls internally instead of growing the
    // dropdown past a comfortable click-target zone. gap-1 (4px): unlike
    // the checkbox lists, each row here carries its own background when
    // selected — with no gap, two adjacent selected/hovered rows merge
    // into one solid block instead of reading as separate options.
    <div className='flex max-h-[240px] w-full flex-col gap-1 overflow-y-auto'>
      {VIEWS.map((view) => (
        <button
          key={view}
          type='button'
          onClick={() => onSelect(view)}
          className={cn(
            'rounded-lg px-2 py-1 text-left text-label-sm text-text-strong-950 transition-colors duration-100 ease',
            view === current ? 'bg-bg-weak-50' : 'hover:bg-bg-weak-50',
          )}
        >
          {view}
        </button>
      ))}
    </div>
  );
}

export function ViewsPicker({
  /** The footer (Update view / Save as new view / Reset) only shows once
   * the current view has been edited — it's how you leave that state, not
   * a permanent fixture of the dropdown. */
  hasUnsavedChanges = false,
}: {
  hasUnsavedChanges?: boolean;
}) {
  const [current, setCurrent] = React.useState(VIEWS[1]);

  return (
    <CheckboxPickerShell>
      <Input.Root size='xsmall'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input placeholder='Search by Views...' />
        </Input.Wrapper>
      </Input.Root>

      <ViewsList current={current} onSelect={setCurrent} />

      {hasUnsavedChanges ? (
        // No divider: node 2446:35261 sits the footer directly under the
        // list, unlike the invalid-range filter-panel hint which does have
        // one — different component, don't carry the pattern over.
        <div className='flex w-full flex-col gap-1'>
          <Button.Root
            variant='neutral'
            mode='filled'
            size='xsmall'
            className='w-full justify-center'
          >
            Update view
          </Button.Root>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='xsmall'
            className='w-full justify-center'
          >
            Save as new view
          </Button.Root>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='xsmall'
            className='w-full justify-center'
          >
            Reset
          </Button.Root>
        </div>
      ) : null}
    </CheckboxPickerShell>
  );
}

/** No views have ever been created. Figma: node 2446:35283. */
export function ViewsPickerEmpty() {
  return (
    <CheckboxPickerShell>
      <Input.Root size='xsmall'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input placeholder='Search by Views...' />
        </Input.Wrapper>
      </Input.Root>

      <div className='flex w-full flex-col items-center gap-1 py-6 text-center'>
        <p className='text-label-sm text-text-sub-600'>No views yet</p>
        <p className='max-w-[210px] text-label-sm text-text-soft-400'>
          Click below to create your first view
        </p>
      </div>

      <Button.Root
        variant='neutral'
        mode='filled'
        size='xsmall'
        className='w-full justify-center'
      >
        Create view
      </Button.Root>
    </CheckboxPickerShell>
  );
}

/** The search matched no saved view. Figma: node 2446:35295 — the input
 * shows the actual typed query (strong text), not a placeholder. */
export function ViewsPickerNoMatch({
  query = 'xyz',
}: {
  query?: string;
}) {
  return (
    <CheckboxPickerShell>
      <Input.Root size='xsmall'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input defaultValue={query} />
        </Input.Wrapper>
      </Input.Root>

      <div className='flex w-full items-center justify-center py-4'>
        <p className='max-w-[210px] text-center text-label-sm text-text-soft-400'>
          No views matched "{query}"
        </p>
      </div>
    </CheckboxPickerShell>
  );
}
