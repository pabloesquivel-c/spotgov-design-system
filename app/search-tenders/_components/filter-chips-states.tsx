'use client';

// The filter-chips specimen tab: the "Matching any/all of:" chip bar on its
// own, independent of the panel above it. Figma: "Section / Matching
// keywords" (node 2454:45941).

import * as React from 'react';

import {
  createKeywordRow,
  createStructuredRow,
  describeCpvSelection,
  describeRow,
  isRowConfigured,
  type FilterRowState,
} from './dynamic-filter-rows';
import { FilterChips, type FilterChip } from './filter-chips';
import { Specimen } from './specimen';

/** The specimens below are static, so their chips have nothing to remove.
 * A no-op keeps the type honest rather than making `onRemove` optional and
 * letting a real caller forget it. */
const noop = () => {};

function staticChips(labels: Array<[string, string]>): FilterChip[] {
  return labels.map(([id, label]) => ({ id, label, onRemove: noop }));
}

const SHORT_CHIPS = staticChips([
  ['q', 'Keyword "Escola"'],
  ['saved', 'Saved only'],
  ['category', 'Category is any of Construction, Civil engineering'],
]);

/** Mock chips matching the placeholder set in Figma — several repeats of
 * "Civil engineering" so the row has enough content to wrap. */
export const WRAPPING_CHIPS = staticChips([
  ['construction', 'Construction'],
  ['infrastructure', 'Infrastructure'],
  ['public-works', 'Public works'],
  ['project-management', 'Project management'],
  ['civil-engineering-1', 'Civil engineering'],
  ['civil-engineering-2', 'Civil engineering'],
  ['civil-engineering-3', 'Civil engineering'],
  ['civil-engineering-4', 'Civil engineering'],
  ['civil-engineering-5', 'Civil engineering'],
  ['civil-engineering-6', 'Civil engineering'],
]);

/** The CPV exception: however many codes are picked, they arrive as one
 * chip. Two names then "+N" — CPV names are long enough that a third would
 * be truncated away anyway. */
const CPV_CHIPS = staticChips([
  ['q', 'Keyword "Escola"'],
  ['cpv', describeCpvSelection(['45000000', '45233140'], 'any-of')],
  ['price', 'Base Price is at least €100,000'],
]);

const CPV_MANY_CHIPS = staticChips([
  [
    'cpv',
    describeCpvSelection(
      ['45000000', '45233140', '45214200', '50750000', '72253000'],
      'any-of',
    ),
  ],
  ['cpv-none', describeCpvSelection(['45233140', '45233290'], 'none-of')],
]);

const LONG_CHIP = staticChips([
  [
    'buyer',
    'Buyer is any of Direção-Geral dos Estabelecimentos Escolares do Ministério da Educação e Ciência',
  ],
]);

/** Proves the two interactions the live bar relies on: the dismiss button
 * really removes, and the chip body really fires an edit. Static chips
 * can't show either. */
function InteractiveSpecimen() {
  const [chips, setChips] = React.useState(() => [
    { id: 'category', label: 'Category is any of Construction' },
    { id: 'price', label: 'Base Price is at least €100,000' },
    { id: 'documents', label: 'Documents contains asphalt' },
  ]);
  const [lastEdited, setLastEdited] = React.useState<string>('');

  return (
    <div className='flex flex-col gap-3'>
      <FilterChips
        matchMode='all'
        chips={chips.map((chip) => ({
          ...chip,
          onRemove: () =>
            setChips((prev) => prev.filter((other) => other.id !== chip.id)),
          onEdit: () => setLastEdited(chip.label),
        }))}
      />
      <p className='text-paragraph-xs text-text-sub-600'>
        {chips.length === 0
          ? 'All removed. Reload the page to get them back.'
          : lastEdited
            ? `Last edit request: ${lastEdited}`
            : 'Click a chip body to edit, or its × to remove.'}
      </p>
    </div>
  );
}

/** A configured row and an unconfigured one. Only the configured row gets a
 * chip — a half-built condition has no value to print, and a ghost chip
 * would claim the search is narrower than it is. */
function ConfiguredOnlySpecimen() {
  const rows = React.useMemo<FilterRowState[]>(() => {
    const category = createStructuredRow('category');
    category.values = ['Construction'];
    const keyword = createKeywordRow('documents');
    keyword.terms = ['asphalt'];
    // Left empty on purpose: added to the panel, nothing picked yet.
    const unconfigured = createStructuredRow('buyer');
    return [category, keyword, unconfigured];
  }, []);

  const configured = rows.filter(isRowConfigured);

  return (
    <div className='flex flex-col gap-3'>
      <FilterChips
        matchMode='all'
        chips={configured.map((row) => ({
          id: row.id,
          label: describeRow(row),
          onRemove: noop,
          onEdit: noop,
        }))}
      />
      <p className='text-paragraph-xs text-text-sub-600'>
        3 rows in the panel, 2 chips: the empty Buyer row has no condition to
        show yet.
      </p>
    </div>
  );
}

export function FilterChipsStates() {
  return (
    <div className='flex flex-col gap-8'>
      <Specimen
        title='Matching any of'
        description='A few chips under an "any" match mode.'
      >
        <FilterChips chips={SHORT_CHIPS} matchMode='any' />
      </Specimen>

      <Specimen
        title='Matching all of'
        description='The same chips under an "all" match mode.'
      >
        <FilterChips chips={SHORT_CHIPS} matchMode='all' />
      </Specimen>

      <Specimen
        title='Remove and edit'
        description='The live behavior: × removes the condition, the chip body sends you to its row.'
      >
        <InteractiveSpecimen />
      </Specimen>

      <Specimen
        title='Unconfigured rows excluded'
        description='Only complete conditions become chips.'
      >
        <ConfiguredOnlySpecimen />
      </Specimen>

      <Specimen
        title='CPV, one chip'
        description='Every picked CPV code folds into a single chip, sitting alongside the other conditions.'
      >
        <FilterChips chips={CPV_CHIPS} matchMode='all' />
      </Specimen>

      <Specimen
        title='CPV, shortened and excluded'
        description='Five codes collapse to two names and a +3. The second chip shows what an exclusion looks like.'
      >
        <FilterChips chips={CPV_MANY_CHIPS} matchMode='all' />
      </Specimen>

      <Specimen
        title='Wrapping to a second line'
        description='Enough chips that the row wraps instead of overflowing.'
      >
        <FilterChips chips={WRAPPING_CHIPS} matchMode='any' />
      </Specimen>

      <Specimen
        title='One long chip'
        description='A single chip long enough to need its own truncation.'
      >
        <FilterChips chips={LONG_CHIP} matchMode='all' />
      </Specimen>

      <Specimen
        title='Nothing pending'
        description='Empty on purpose — FilterChips returns nothing when there are no chips.'
      >
        <p className='text-paragraph-xs text-text-sub-600'>
          (Renders null — nothing to show here.)
        </p>
      </Specimen>
    </div>
  );
}
