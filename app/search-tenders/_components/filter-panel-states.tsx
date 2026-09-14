'use client';

// The filter-panel specimen tab: the panel's own states, independent of
// which exact filters are inside it. Figma: node 2454:45531 "Panel / Search
// filters" — the 5 rows in that frame are placeholders, not a fixed set.

import * as React from 'react';
import {
  RiBuildingLine,
  RiCalendarEventFill,
  RiCoinsLine,
  RiFileTextLine,
  RiMapPinLine,
  RiNodeTree,
} from '@remixicon/react';

import {
  FilterFieldTrigger,
  FilterOperatorLabel,
  FilterOperatorTrigger,
  FilterRangeSeparator,
  FilterRemoveButton,
  FilterRow,
  FilterValueTrigger,
} from './filter-row';
import { CollapsedFilterPanel, FilterPanel } from './filter-panel';
import { Specimen } from './specimen';

/** One row of each filter kind, so the panel isn't empty while the real
 * applied filters are still placeholders. */
export function MockFilterRows() {
  return (
    <>
      <FilterRow>
        <FilterFieldTrigger label='Buyer' icon={RiBuildingLine} />
        <FilterOperatorTrigger label='is any of' />
        <FilterValueTrigger />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Category' icon={RiNodeTree} />
        <FilterOperatorTrigger label='is none of' />
        <FilterValueTrigger />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Submission Deadline' icon={RiCalendarEventFill} />
        <FilterOperatorTrigger label='is between' />
        <FilterValueTrigger showChevron={false} />
        <FilterRangeSeparator />
        <FilterValueTrigger showChevron={false} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Base Price' icon={RiCoinsLine} />
        <FilterOperatorTrigger label='is at least' />
        <FilterValueTrigger showChevron={false} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Document' icon={RiFileTextLine} />
        <FilterOperatorLabel label='contains' />
        <FilterValueTrigger showChevron={false} placeholder='Enter keywords...' />
        <FilterRemoveButton />
      </FilterRow>
    </>
  );
}

/** Same mock set as MockFilterRows, except Base Price is the invalid
 * range from node 2454:46685 — lower bound above the upper bound. */
function ErrorMockRows() {
  return (
    <>
      <FilterRow>
        <FilterFieldTrigger
          label='Submission Deadline'
          icon={RiCalendarEventFill}
        />
        <FilterOperatorTrigger label='is between' />
        <FilterValueTrigger showChevron={false} />
        <FilterRangeSeparator />
        <FilterValueTrigger showChevron={false} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Base Price' icon={RiCoinsLine} />
        <FilterOperatorTrigger label='is between' />
        <FilterValueTrigger showChevron={false} invalid />
        <FilterRangeSeparator />
        <FilterValueTrigger showChevron={false} invalid />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Buyer' icon={RiBuildingLine} />
        <FilterOperatorTrigger label='is any of' />
        <FilterValueTrigger />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Location' icon={RiMapPinLine} />
        <FilterOperatorTrigger label='is any of' />
        <FilterValueTrigger />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Document' icon={RiFileTextLine} />
        <FilterOperatorLabel label='contains' />
        <FilterValueTrigger showChevron={false} placeholder='Enter keywords...' />
        <FilterRemoveButton />
      </FilterRow>
    </>
  );
}

/** [suggested] The 10-criteria cap, fully reached: 7 structured filters
 * (Buyer, Category, Location, Procedure type, Base value, Submission
 * Deadline, Publication Date) + 3 keyword rows — the exact composition
 * from the spec's own example (5 structured + 3 keyword + 2 more
 * structured = 10). */
function LimitReachedMockRows() {
  return (
    <>
      <FilterRow>
        <FilterFieldTrigger label='Buyer' icon={RiBuildingLine} />
        <FilterOperatorTrigger label='is any of' />
        <FilterValueTrigger />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Category' icon={RiNodeTree} />
        <FilterOperatorTrigger label='is none of' />
        <FilterValueTrigger />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Location' icon={RiMapPinLine} />
        <FilterOperatorTrigger label='is any of' />
        <FilterValueTrigger />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Procedure type' icon={RiNodeTree} />
        <FilterOperatorTrigger label='is any of' />
        <FilterValueTrigger />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Base Price' icon={RiCoinsLine} />
        <FilterOperatorTrigger label='is at least' />
        <FilterValueTrigger showChevron={false} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger
          label='Submission Deadline'
          icon={RiCalendarEventFill}
        />
        <FilterOperatorTrigger label='is between' />
        <FilterValueTrigger showChevron={false} />
        <FilterRangeSeparator />
        <FilterValueTrigger showChevron={false} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Publication Date' icon={RiCalendarEventFill} />
        <FilterOperatorTrigger label='is after' />
        <FilterValueTrigger showChevron={false} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Document' icon={RiFileTextLine} />
        <FilterOperatorLabel label='contains' />
        <FilterValueTrigger
          showChevron={false}
          placeholder='Enter keywords...'
        />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Document' icon={RiFileTextLine} />
        <FilterOperatorLabel label='contains' />
        <FilterValueTrigger
          showChevron={false}
          placeholder='Enter keywords...'
        />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Contract Object' icon={RiFileTextLine} />
        <FilterOperatorLabel label='contains' />
        <FilterValueTrigger
          showChevron={false}
          placeholder='Enter keywords...'
        />
        <FilterRemoveButton />
      </FilterRow>
    </>
  );
}

const GRID_EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';
// Opening a row is the user waiting to read new content — a touch more
// deliberate. Closing is the system getting out of the way — snappier.
// ("Slow where the user is deciding, fast where the system responds.")
const EXPAND_MS = 220;
const COLLAPSE_MS = 180;

/**
 * One CSS-driven accordion row per panel, both always mounted and stacked
 * in normal flow. `grid-template-rows` animates between 0fr (its own
 * content collapsed away) and 1fr (its own natural height) — the standard
 * Radix Collapsible/Accordion technique. The browser interpolates the
 * track size continuously, so there's no JS height measurement, no forced
 * reflow, and — because both directions run the exact same CSS rule in
 * reverse (just a different duration) — collapse and expand stay in sync
 * by construction, unlike a hand-measured height that can drift asymmetric
 * between directions.
 *
 * `inert` removes the collapsed panel from focus/tab order and the a11y
 * tree without affecting layout, so a hidden search input can't eat a Tab
 * press.
 */
function AccordionRow({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className='grid motion-reduce:transition-none'
      style={{
        gridTemplateRows: open ? '1fr' : '0fr',
        transition: `grid-template-rows ${open ? EXPAND_MS : COLLAPSE_MS}ms ${GRID_EASE}`,
      }}
    >
      <div
        className='min-h-0 overflow-hidden opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none data-[open]:opacity-100'
        data-open={open ? '' : undefined}
        // @ts-expect-error -- `inert` isn't in this React/TS version's DOM
        // typings yet, but is a real, broadly-supported HTML attribute.
        inert={open ? undefined : ''}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Wires CollapsedFilterPanel and FilterPanel into one toggle: clicking
 * "Search" collapses — "Clear all" does not, it only empties the rows and
 * leaves the panel open for another edit — and "Edit Search" expands.
 * Under prefers-reduced-motion, both rows resize instantly (CSS handles
 * this via `motion-reduce:transition-none`, no JS branch needed).
 */
function FilterPanelToggle() {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const editSearchRef = React.useRef<HTMLButtonElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isExpanded) {
      searchInputRef.current?.focus();
    } else {
      editSearchRef.current?.focus();
    }
  }, [isExpanded]);

  return (
    <div>
      <AccordionRow open={isExpanded}>
        <FilterPanel searchInputRef={searchInputRef} onSearch={() => setIsExpanded(false)}>
          <MockFilterRows />
        </FilterPanel>
      </AccordionRow>

      <AccordionRow open={!isExpanded}>
        <CollapsedFilterPanel
          ref={editSearchRef}
          summary='Escola'
          onEditSearch={() => setIsExpanded(true)}
        />
      </AccordionRow>
    </div>
  );
}

export function FilterPanelStates() {
  return (
    <div className='flex flex-col gap-8'>
      <Specimen
        title='Empty'
        description='No filters or keywords have been added yet.'
      >
        <FilterPanel />
      </Specimen>

      <Specimen
        title='Collapse ↔ Expand'
        description='Interactive — click to toggle between the collapsed and expanded panel.'
      >
        <FilterPanelToggle />
      </Specimen>

      <Specimen
        title='Populated'
        description='One row of each filter kind, as a stand-in for real applied filters.'
      >
        <FilterPanel>
          <MockFilterRows />
        </FilterPanel>
      </Specimen>

      <Specimen
        title='Validation error'
        description='An invalid range — the lower bound is above the upper bound, so it can never match.'
      >
        <FilterPanel
          hint={{
            tone: 'error',
            message:
              'The lower bound is above the upper bound, so this can never match.',
          }}
        >
          <ErrorMockRows />
        </FilterPanel>
      </Specimen>

      <Specimen
        title='Unapplied changes'
        description='Filters have been edited but not searched yet — results below still reflect the last search.'
      >
        <FilterPanel
          hint={{
            tone: 'neutral',
            message: 'Unapplied changes. Results below still show your last search.',
          }}
        >
          <MockFilterRows />
        </FilterPanel>
      </Specimen>

      <Specimen
        title='Filter limit reached (10 of 10 criteria)'
        description='[suggested] Up to 7 structured filters + 3 keyword rows, 10 total. At the cap, Add filter and Add keywords are disabled and the hint explains why.'
      >
        <FilterPanel
          disableAddActions
          hint={{
            tone: 'neutral',
            message: 'You can add up to 10 criteria to a search.',
          }}
        >
          <LimitReachedMockRows />
        </FilterPanel>
      </Specimen>

      <Specimen
        title='Collapsed — placeholder'
        description='The panel collapsed with no applied search to summarize.'
      >
        <CollapsedFilterPanel />
      </Specimen>

      <Specimen
        title='Collapsed — applied search'
        description='The panel collapsed with an applied search summarized in its place.'
      >
        <CollapsedFilterPanel summary='Escola' />
      </Specimen>
    </div>
  );
}
