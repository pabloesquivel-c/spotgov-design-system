'use client';

// The Views dropdown: what opens from the page header's "Views" button.
// Figma:
//   2446:35250 "Body" — has views, no edits.
//   2446:35264 — editing a view, adds the Update/Save-as-new/Reset footer.
//   2446:35283 — no views exist yet.
//   2446:35295 — search matched nothing.
// Plain rows, no checkboxes — a view is selected, not multi-checked — with
// the current view's row taking the weak-50 background.
//
// Naming step: "Save as new view"/"Create view" used to save immediately
// under an auto-generated name ("New view", "New view 2", ...). This swaps
// the popover's own content to a name prompt first — same shell, input, and
// button primitives as the rest of this picker (and every other picker in
// this playground), so hovers/colors/radii/text styles match by
// construction rather than by copying values.

import * as React from 'react';
import { RiSearch2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import { cn } from '@/utils/cn';
import { CheckboxPickerShell } from './checkbox-search-picker';
import { optionId, useOptionNavigation } from './use-option-navigation';

// More than fits in the max-height below, on purpose — this is what forces
// the list to actually scroll instead of just having room to. Exported as
// the real page header's starting list, so the live picker and this
// specimen tab's mock start from the same data.
export const VIEWS = [
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
  views,
  current,
  onSelect,
  listId,
  activeIndex,
  onActiveIndexChange,
  optionRef,
}: {
  views: string[];
  current: string;
  onSelect: (view: string) => void;
  /** Keyboard navigation from the search box above — see
   * use-option-navigation.ts. */
  listId: string;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  optionRef: (index: number) => (element: HTMLElement | null) => void;
}) {
  return (
    // max-h + overflow-y-auto, not a fixed height: below the cap, the list
    // sizes to content (2 views shouldn't leave empty space); once it has
    // more rows than fit, it scrolls internally instead of growing the
    // dropdown past a comfortable click-target zone. gap-1 (4px): unlike
    // the checkbox lists, each row here carries its own background when
    // selected — with no gap, two adjacent selected/hovered rows merge
    // into one solid block instead of reading as separate options.
    <div
      id={listId}
      className='flex max-h-[240px] w-full flex-col gap-1 overflow-y-auto'
    >
      {views.map((view, index) => (
        <button
          key={view}
          id={optionId(listId, index)}
          ref={optionRef(index)}
          type='button'
          // tabIndex -1: the search box is the list's single tab stop now
          // that the arrow keys reach every row. Tabbing through eight
          // saved views to leave the popover was never the point.
          tabIndex={-1}
          onMouseMove={() => onActiveIndexChange(index)}
          onClick={() => onSelect(view)}
          className={cn(
            'rounded-lg px-2 py-1 text-left text-label-sm text-text-strong-950',
            // No colour transition on a keyboard-driven highlight, and no
            // CSS :hover — `activeIndex` alone drives it, moved by the
            // arrow keys and by the pointer alike, so the pointer can never
            // light a second row.
            //
            // `current` still shares that same tint, which is how this
            // picker already worked. It does mean two rows can read as lit
            // at once when the cursor is elsewhere — but those two are
            // saying different things ("the view you're in" vs "the row
            // Enter takes"), and giving them separate treatments is a
            // design call, not a bug fix.
            (activeIndex === index || view === current) && 'bg-bg-weak-50',
          )}
        >
          {view}
        </button>
      ))}
    </div>
  );
}

/**
 * The naming step for "Save as new view"/"Create view" — same
 * `CheckboxPickerShell` as the rest of this picker (300px, rounded-xl,
 * shadow-regular-md) and the same `Input`/`Button` primitives, so it reads
 * as one continuous component rather than a bolted-on dialog.
 *
 * Duplicate-name validation follows the same pattern as this playground's
 * other inline validation (dynamic-filter-rows.tsx's invalid price range):
 * a live boolean flips the input to `hasError` and prints an
 * error-base hint directly under it, and the primary button stays disabled
 * until the name is both non-empty and not a duplicate.
 */
function SaveViewForm({
  views,
  onCancel,
  onSave,
}: {
  views: string[];
  onCancel: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] = React.useState('');
  const trimmed = name.trim();
  const isDuplicate =
    trimmed.length > 0 &&
    views.some((view) => view.toLowerCase() === trimmed.toLowerCase());
  const canSave = trimmed.length > 0 && !isDuplicate;

  return (
    <CheckboxPickerShell>
      <Input.Root size='xsmall' hasError={isDuplicate}>
        <Input.Wrapper>
          <Input.Input
            autoFocus
            placeholder='Name this view'
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canSave) {
                onSave(trimmed);
              }
            }}
          />
        </Input.Wrapper>
      </Input.Root>

      {isDuplicate ? (
        <span className='px-1 text-paragraph-xs text-error-base'>
          A view named &quot;{trimmed}&quot; already exists.
        </span>
      ) : null}

      <div className='flex w-full items-center gap-1'>
        <Button.Root
          variant='neutral'
          mode='ghost'
          size='xsmall'
          className='flex-1 justify-center'
          onClick={onCancel}
        >
          Cancel
        </Button.Root>
        <Button.Root
          variant='neutral'
          mode='filled'
          size='xsmall'
          className='flex-1 justify-center'
          disabled={!canSave}
          onClick={() => onSave(trimmed)}
        >
          Save
        </Button.Root>
      </div>
    </CheckboxPickerShell>
  );
}

export function ViewsPicker({
  /** The footer (Update view / Save as new view / Reset) only shows once
   * the current view has been edited — it's how you leave that state, not
   * a permanent fixture of the dropdown. */
  hasUnsavedChanges = false,
  /** Every prop below is optional and defaults to the same uncontrolled
   * mock behavior this component always had — the Modals specimen tab's
   * bare `<ViewsPicker />` and `<ViewsPicker hasUnsavedChanges />` calls
   * are unaffected. Passing them (as the real page header does) turns this
   * into the live picker: real search filtering, real selection, and the
   * footer actions actually doing something. */
  views = VIEWS,
  current: currentProp,
  onSelectView,
  searchValue: searchValueProp,
  onSearchChange,
  onUpdateView,
  onSaveAsNewView,
  onReset,
}: {
  hasUnsavedChanges?: boolean;
  views?: string[];
  current?: string;
  onSelectView?: (view: string) => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onUpdateView?: () => void;
  /** Fires once a name has been typed and confirmed in the naming step —
   * not on the "Save as new view"/"Create view" click itself, which only
   * opens that step. */
  onSaveAsNewView?: (name: string) => void;
  onReset?: () => void;
}) {
  const [uncontrolledCurrent, setUncontrolledCurrent] = React.useState(
    views[1] ?? views[0],
  );
  const current = currentProp ?? uncontrolledCurrent;
  const [uncontrolledSearch, setUncontrolledSearch] = React.useState('');
  const search = searchValueProp ?? uncontrolledSearch;
  const [isNaming, setIsNaming] = React.useState(false);

  function selectView(view: string) {
    if (currentProp === undefined) {
      setUncontrolledCurrent(view);
    }
    onSelectView?.(view);
  }

  function changeSearch(value: string) {
    if (searchValueProp === undefined) {
      setUncontrolledSearch(value);
    }
    onSearchChange?.(value);
  }

  const trimmedSearch = search.trim();
  const filtered = trimmedSearch
    ? views.filter((view) => view.toLowerCase().includes(trimmedSearch.toLowerCase()))
    : views;

  // Above the `isNaming` early return, since hooks can't run conditionally.
  // Virtual focus: the search box keeps focus while the arrows move the
  // highlight, so typing two letters and pressing Enter opens that view.
  const listId = React.useId();
  const { activeIndex, setActiveIndex, onKeyDown, optionRef } =
    useOptionNavigation({
      count: filtered.length,
      resetKey: search,
      onSelect: (index) => selectView(filtered[index]),
    });

  if (isNaming) {
    return (
      <SaveViewForm
        views={views}
        onCancel={() => setIsNaming(false)}
        onSave={(name) => {
          onSaveAsNewView?.(name);
          setIsNaming(false);
        }}
      />
    );
  }

  return (
    <CheckboxPickerShell>
      <Input.Root size='xsmall'>
        <Input.Wrapper>
          <Input.Icon as={RiSearch2Line} />
          <Input.Input
            placeholder='Search by Views...'
            value={search}
            onChange={(e) => changeSearch(e.target.value)}
            onKeyDown={onKeyDown}
            role='combobox'
            aria-expanded
            aria-autocomplete='list'
            aria-controls={listId}
            aria-activedescendant={
              filtered.length > 0 ? optionId(listId, activeIndex) : undefined
            }
          />
        </Input.Wrapper>
      </Input.Root>

      {views.length === 0 ? (
        <>
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
            onClick={() => setIsNaming(true)}
          >
            Create view
          </Button.Root>
        </>
      ) : filtered.length === 0 ? (
        <div className='flex w-full items-center justify-center py-4'>
          <p className='max-w-[210px] text-center text-label-sm text-text-soft-400'>
            No views matched &quot;{search}&quot;
          </p>
        </div>
      ) : (
        <ViewsList
          views={filtered}
          current={current}
          onSelect={selectView}
          listId={listId}
          activeIndex={activeIndex}
          onActiveIndexChange={setActiveIndex}
          optionRef={optionRef}
        />
      )}

      {hasUnsavedChanges && views.length > 0 ? (
        // No divider: node 2446:35261 sits the footer directly under the
        // list, unlike the invalid-range filter-panel hint which does have
        // one — different component, don't carry the pattern over.
        <div className='flex w-full flex-col gap-1'>
          <Button.Root
            variant='neutral'
            mode='filled'
            size='xsmall'
            className='w-full justify-center'
            onClick={onUpdateView}
          >
            Update view
          </Button.Root>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='xsmall'
            className='w-full justify-center'
            onClick={() => setIsNaming(true)}
          >
            Save as new view
          </Button.Root>
          <Button.Root
            variant='neutral'
            mode='ghost'
            size='xsmall'
            className='w-full justify-center'
            onClick={onReset}
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
          No views matched &quot;{query}&quot;
        </p>
      </div>
    </CheckboxPickerShell>
  );
}
