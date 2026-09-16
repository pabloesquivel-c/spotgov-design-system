'use client';

// The filter-panel specimen tab: the panel's own states, independent of
// which exact filters are inside it. Figma: node 2454:45531 "Panel / Search
// filters" — the 5 rows in that frame are placeholders, not a fixed set.

import * as React from 'react';
import {
  RiBarcodeLine,
  RiBuildingLine,
  RiCalendarEventFill,
  RiCoinsLine,
  RiFileTextLine,
  RiGroupLine,
  RiMapPinLine,
  RiMedalLine,
  RiNodeTree,
} from '@remixicon/react';

import { BuyerPicker } from './buyer-picker';
import { CategoryPicker } from './category-picker';
import { cpvLabel } from './cpv-data';
import { CpvPicker } from './cpv-picker';
import { DateFilterCalendar } from './date-filter-calendar';
import { AccordionRow, CollapsedFilterPanel, FilterPanel } from './filter-panel';
import {
  FilterFieldTrigger,
  FilterOperatorLabel,
  FilterOperatorTrigger,
  FilterRangeSeparator,
  FilterRemoveButton,
  FilterRow,
  FilterValueTrigger,
} from './filter-row';
import { FilterTypePicker } from './filter-type-picker';
import { KeywordTargetPicker } from './keyword-target-picker';
import {
  DateOperatorPicker,
  PriceOperatorPicker,
  SetOperatorPicker,
} from './operator-picker';
import { LocationPicker } from './location-picker';
import { ProcedurePicker } from './procedure-picker';
import { Specimen } from './specimen';
import { SupplierPicker } from './supplier-picker';

// Four codes, so the row shows its three-chip cap plus the "+1 more"
// overflow rather than a tidy count that never exercises it.
const MOCK_CPV_CODES = ['45000000', '45233140', '45214200', '50750000'];

/** One row of each filter kind, so the panel isn't empty while the real
 * applied filters are still placeholders. */
export function MockFilterRows() {
  return (
    <>
      <FilterRow>
        <FilterFieldTrigger
          label='Buyer'
          icon={RiBuildingLine}
          picker={<FilterTypePicker defaultValue='buyer' />}
        />
        <FilterOperatorTrigger
          label='is any of'
          picker={<SetOperatorPicker defaultValue='any-of' />}
        />
        <FilterValueTrigger picker={<BuyerPicker />} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger
          label='Category'
          icon={RiNodeTree}
          picker={<FilterTypePicker defaultValue='category' />}
        />
        <FilterOperatorTrigger
          label='is none of'
          picker={<SetOperatorPicker defaultValue='none-of' />}
        />
        <FilterValueTrigger picker={<CategoryPicker />} />
        <FilterRemoveButton />
      </FilterRow>

      {/* The one row shown already filled in: CPV is the field where the
          chips (and their "+N more" overflow) are the point, since picking
          a broad code silently brings its children along. */}
      <FilterRow>
        <FilterFieldTrigger
          label='CPV'
          icon={RiBarcodeLine}
          picker={<FilterTypePicker defaultValue='cpv' />}
        />
        <FilterOperatorTrigger
          label='is any of'
          picker={<SetOperatorPicker defaultValue='any-of' />}
        />
        <FilterValueTrigger
          chips={MOCK_CPV_CODES.map((code) => ({
            id: code,
            label: cpvLabel(code),
            onRemove: () => {},
          }))}
          picker={<CpvPicker />}
        />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger
          label='Submission Deadline'
          icon={RiCalendarEventFill}
          picker={<FilterTypePicker defaultValue='submission-deadline' />}
        />
        <FilterOperatorTrigger
          label='is between'
          picker={<DateOperatorPicker defaultValue='between' />}
        />
        <FilterValueTrigger showChevron={false} picker={<DateFilterCalendar />} />
        <FilterRangeSeparator />
        <FilterValueTrigger showChevron={false} picker={<DateFilterCalendar />} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger
          label='Base Price'
          icon={RiCoinsLine}
          picker={<FilterTypePicker defaultValue='base-price' />}
        />
        <FilterOperatorTrigger
          label='is at least'
          picker={<PriceOperatorPicker defaultValue='at-least' />}
        />
        <FilterValueTrigger showChevron={false} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger
          label='Document'
          icon={RiFileTextLine}
          picker={<KeywordTargetPicker />}
        />
        <FilterOperatorLabel label='contains' />
        <FilterValueTrigger showChevron={false} placeholder='Enter keywords...' />
        <FilterRemoveButton />
      </FilterRow>
    </>
  );
}

/** The two Awarded-only rows. Both use the same supplier picker; the
 * difference is the question, not the list. Competitor shows a fixed "is
 * any of" label instead of an operator picker — bidder data is incomplete
 * by country and source, so a negation would confidently return tenders the
 * company did bid on but where no bidder list was ever published. */
export function AwardedMockRows() {
  return (
    <>
      <FilterRow>
        <FilterFieldTrigger
          label='Winner'
          icon={RiMedalLine}
          picker={<FilterTypePicker defaultValue='winner' />}
        />
        <FilterOperatorTrigger
          label='is any of'
          picker={<SetOperatorPicker defaultValue='any-of' />}
        />
        <FilterValueTrigger picker={<SupplierPicker />} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger
          label='Competitor'
          icon={RiGroupLine}
          picker={<FilterTypePicker defaultValue='competitor' />}
        />
        <FilterOperatorLabel label='is any of' />
        <FilterValueTrigger picker={<SupplierPicker />} />
        <FilterRemoveButton />
      </FilterRow>
    </>
  );
}

/** Same mock set as MockFilterRows, except Base Price is the invalid
 * range from node 2454:46685 — lower bound above the upper bound. */
export function ErrorMockRows() {
  return (
    <>
      <FilterRow>
        <FilterFieldTrigger
          label='Submission Deadline'
          icon={RiCalendarEventFill}
        />
        <FilterOperatorTrigger
          label='is between'
          picker={<DateOperatorPicker defaultValue='between' />}
        />
        <FilterValueTrigger showChevron={false} picker={<DateFilterCalendar />} />
        <FilterRangeSeparator />
        <FilterValueTrigger showChevron={false} picker={<DateFilterCalendar />} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Base Price' icon={RiCoinsLine} />
        <FilterOperatorTrigger
          label='is between'
          picker={<PriceOperatorPicker defaultValue='between' />}
        />
        <FilterValueTrigger showChevron={false} invalid />
        <FilterRangeSeparator />
        <FilterValueTrigger showChevron={false} invalid />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Buyer' icon={RiBuildingLine} />
        <FilterOperatorTrigger
          label='is any of'
          picker={<SetOperatorPicker defaultValue='any-of' />}
        />
        <FilterValueTrigger picker={<BuyerPicker />} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Location' icon={RiMapPinLine} />
        <FilterOperatorTrigger
          label='is any of'
          picker={<SetOperatorPicker defaultValue='any-of' />}
        />
        <FilterValueTrigger picker={<LocationPicker />} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger
          label='Document'
          icon={RiFileTextLine}
          picker={<KeywordTargetPicker />}
        />
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
        <FilterOperatorTrigger
          label='is any of'
          picker={<SetOperatorPicker defaultValue='any-of' />}
        />
        <FilterValueTrigger picker={<BuyerPicker />} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Category' icon={RiNodeTree} />
        <FilterOperatorTrigger
          label='is none of'
          picker={<SetOperatorPicker defaultValue='none-of' />}
        />
        <FilterValueTrigger picker={<CategoryPicker />} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Location' icon={RiMapPinLine} />
        <FilterOperatorTrigger
          label='is any of'
          picker={<SetOperatorPicker defaultValue='any-of' />}
        />
        <FilterValueTrigger picker={<LocationPicker />} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Procedure type' icon={RiNodeTree} />
        <FilterOperatorTrigger label='is any of' />
        <FilterValueTrigger picker={<ProcedurePicker />} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Base Price' icon={RiCoinsLine} />
        <FilterOperatorTrigger
          label='is at least'
          picker={<PriceOperatorPicker defaultValue='at-least' />}
        />
        <FilterValueTrigger showChevron={false} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger
          label='Submission Deadline'
          icon={RiCalendarEventFill}
        />
        <FilterOperatorTrigger
          label='is between'
          picker={<DateOperatorPicker defaultValue='between' />}
        />
        <FilterValueTrigger showChevron={false} picker={<DateFilterCalendar />} />
        <FilterRangeSeparator />
        <FilterValueTrigger showChevron={false} picker={<DateFilterCalendar />} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger label='Publication Date' icon={RiCalendarEventFill} />
        <FilterOperatorTrigger
          label='is after'
          picker={<DateOperatorPicker defaultValue='after' />}
        />
        <FilterValueTrigger showChevron={false} picker={<DateFilterCalendar />} />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger
          label='Document'
          icon={RiFileTextLine}
          picker={<KeywordTargetPicker />}
        />
        <FilterOperatorLabel label='contains' />
        <FilterValueTrigger
          showChevron={false}
          placeholder='Enter keywords...'
        />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger
          label='Document'
          icon={RiFileTextLine}
          picker={<KeywordTargetPicker />}
        />
        <FilterOperatorLabel label='contains' />
        <FilterValueTrigger
          showChevron={false}
          placeholder='Enter keywords...'
        />
        <FilterRemoveButton />
      </FilterRow>

      <FilterRow>
        <FilterFieldTrigger
          label='Contract Object'
          icon={RiFileTextLine}
          picker={<KeywordTargetPicker />}
        />
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

/**
 * Wires CollapsedFilterPanel and FilterPanel into one toggle: clicking
 * "Search" collapses — "Clear all" does not, it only empties the rows and
 * leaves the panel open for another edit — and "Edit Search" expands.
 * Uses AccordionRow's default (animated) transition, matching
 * rich-state-flow.tsx's real Search interaction.
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
        title='Awarded filters'
        description='Winner and Competitor, offered only on the Awarded tab and only where that country’s indexed data carries them. Winner takes both operators; Competitor is “is any of” only.'
      >
        <FilterPanel stage='awarded'>
          <AwardedMockRows />
        </FilterPanel>
      </Specimen>

      <Specimen
        title='No Market Intelligence access'
        description='The one variant that drops Awarded entirely instead of showing it locked — for an org the upsell doesn’t apply to. Default everywhere else is three tabs.'
      >
        <FilterPanel showAwardedTab={false}>
          <MockFilterRows />
        </FilterPanel>
      </Specimen>

      <Specimen
        title='Awarded locked (no Market Intelligence)'
        description='The common case for an org without the feature: Awarded stays visible but can’t be selected. Hover or Tab to it — a tooltip explains why.'
      >
        <FilterPanel awardedLocked>
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
        description='Up to 7 structured filters + 3 keyword rows, 10 total. At the cap, Add filter and Add keywords are disabled and the hint explains why.'
      >
        <FilterPanel
          disableAddActions
          hint={{
            tone: 'neutral',
            message: 'You’ve reached the 10-criteria limit for a search.',
          }}
        >
          <LimitReachedMockRows />
        </FilterPanel>
      </Specimen>

      <Specimen
        title='Value trigger — selected options'
        description='Figma node 2554:32332. Once a set-kind filter (Buyer, Category, Location) has picks, its value trigger shows them as removable chips instead of "Choose...".'
      >
        <FilterRow>
          <FilterFieldTrigger label='Category' icon={RiNodeTree} />
          <FilterOperatorTrigger label='is any of' />
          <FilterValueTrigger
            chips={[
              { id: 'construction', label: 'Construction', onRemove: () => undefined },
              { id: 'civil-engineering', label: 'Civil engineering', onRemove: () => undefined },
              { id: 'road-maintenance', label: 'Road maintenance', onRemove: () => undefined },
            ]}
          />
          <FilterRemoveButton />
        </FilterRow>
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
