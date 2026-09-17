'use client';

// Shared building blocks for a filter row: field trigger, operator trigger,
// value trigger, remove button. Figma: "Dropdown Items [1.1]" component,
// reused across every filter kind.
//
// Field/value triggers open their picker via the shared Popover primitive
// when the caller passes one — composition, not a hardcoded switch on
// field type in here. A row that doesn't pass a picker (e.g. a keyword
// row's plain text value) just renders the closed-state button, unchanged.
//
// Auto-close on select: each trigger owns its popover's open state and, if
// the picker it's given exposes an `onSelect` prop, wraps that prop to also
// close the popover. This is why single-select pickers (filter-type,
// operator pickers, keyword-target) close themselves on choice while
// multi-select checkbox pickers (Buyer/Category/Location — no `onSelect`
// prop at all) correctly stay open for further picks. One mechanism, no
// per-picker special-casing.

import * as React from 'react';
import { flushSync } from 'react-dom';
import { RiArrowRightSLine, RiCloseFill } from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';

import * as Popover from '@/components/ui/popover';
import { cn } from '@/utils/cn';
import { SelectedValueChips, type SelectedValueChip } from './selected-value-chips';

// Rotates a trigger's chevron to face down while its popover is open —
// `group-data-[state=open]` reads Radix's own state off the trigger button
// (the `group`), so it stays in sync with the popover without extra state.
// Strong ease-out per the design-eng convention: built-in easings are too
// weak to read as intentional at this size/duration.
const CHEVRON_CLASS =
  'size-5 shrink-0 text-text-sub-600 transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[state=open]:rotate-90';

// Shared interactive-button treatment for every trigger: a hover fill so
// hovering ever acknowledges the pointer, a focus-visible state for
// keyboard use, and a slight press scale so clicking feels heard. `scale`
// also affects children (the label, the chevron) — expected here, not a
// bug. box-shadow is listed explicitly alongside background-color/transform
// — both the border-color swap and shadow-button-important-focus below are
// box-shadow/color changes Tailwind's transition-colors shorthand doesn't
// fully cover, so without this they used to snap in/out instantly instead
// of easing in with the rest.
//
// focus uses the same border + shadow-button-important-focus pairing as
// Select's own trigger (components/ui/select.tsx) — a thin border-color
// swap plus AlignUI's soft two-layer halo (white separator + translucent
// neutral glow) — instead of a bare `ring-2`, which rendered as a flat,
// opaque, hard-edged black block with no depth. The halo is what Notion/
// Linear-style fields actually use: a soft glow around the existing shape,
// not a heavier redrawn outline.
const TRIGGER_INTERACTIVE_CLASS =
  'cursor-pointer select-none transition-[background-color,transform,box-shadow] duration-100 ease-out hover:bg-bg-weak-50 active:scale-[0.99] focus-visible:outline-none focus-visible:border-stroke-strong-950 focus-visible:shadow-button-important-focus';

// A filled chip already carries its own bg-weak-50 — filling the row
// behind it with the same gray on hover washes the chips out against their
// own background instead of framing them. A border-color hover was tried
// and dropped too: jumping to full-contrast black for a passive hover
// outweighs the signal (that weight belongs to focus/active-edit, not
// "you're hovering"). A near-invisible shadow lift reads as interactive
// without competing with the chips or the chevron's own hover treatment.
const CHIPS_TRIGGER_INTERACTIVE_CLASS =
  'cursor-pointer select-none transition-[box-shadow,border-color] duration-100 ease-out hover:shadow-regular-sm active:scale-[0.99] focus-visible:outline-none focus-visible:border-stroke-strong-950 focus-visible:shadow-button-important-focus';

// Beyond this many, the rest collapse into a "+N" tag rather than wrapping
// the row onto a second line.
const MAX_VISIBLE_CHIPS = 3;

/** Wraps `picker`'s `onSelect` (if it has one) to also call `close`. Passes
 * `picker` through unchanged when it doesn't expose `onSelect` — multi-
 * select checkbox pickers have no such prop, so they're untouched. */
function withAutoClose(picker: React.ReactNode, close: () => void): React.ReactNode {
  if (
    !React.isValidElement<{ onSelect?: (value: never) => void }>(picker) ||
    typeof picker.props.onSelect !== 'function'
  ) {
    return picker;
  }
  const originalOnSelect = picker.props.onSelect;
  return React.cloneElement(picker, {
    onSelect: (value: never) => {
      originalOnSelect(value);
      close();
    },
  });
}

/** Shared plumbing for a trigger that opens a popover: owns open state so
 * it can auto-close on select, wraps `trigger` in Popover.Trigger asChild,
 * and renders `picker` through `withAutoClose`. Renders `trigger` bare when
 * there's no picker to open. */
function PopoverTriggerButton({
  trigger,
  picker,
  openPicker = false,
  onPickerOpened,
}: {
  trigger: React.ReactElement;
  picker?: React.ReactNode;
  openPicker?: boolean;
  onPickerOpened?: () => void;
}) {
  const [open, setOpen] = React.useState(false);

  // Opened from outside (the CPV chip in the filter bar). The callback
  // clears the caller's flag, so the same chip works a second time — and
  // so a user who closes the popover doesn't have it spring back open.
  React.useEffect(() => {
    if (!openPicker) {
      return;
    }
    setOpen(true);
    onPickerOpened?.();
  }, [openPicker, onPickerOpened]);

  if (!picker) {
    return trigger;
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Content align='start' unstyled showArrow={false}>
        {withAutoClose(picker, () => setOpen(false))}
      </Popover.Content>
    </Popover.Root>
  );
}

export function FilterFieldTrigger({
  label,
  icon: Icon,
  picker,
}: {
  label: string;
  icon: RemixiconComponentType;
  /** Opens on click when given (e.g. the keyword-target picker for a
   * Document/Contract Object row). Omit for fields with nothing to open. */
  picker?: React.ReactNode;
}) {
  const trigger = (
    <button
      type='button'
      className={cn(
        'group flex w-[284px] shrink-0 items-center gap-2 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-2 text-left',
        TRIGGER_INTERACTIVE_CLASS,
      )}
    >
      <Icon className='size-5 shrink-0 text-text-sub-600' />
      <span className='min-w-0 flex-1 truncate whitespace-nowrap text-paragraph-sm text-text-strong-950'>
        {label}
      </span>
      {/* The chevron signals this field type can be changed, not just
          displayed — it opens the same field picker as any other filter. */}
      <RiArrowRightSLine className={CHEVRON_CLASS} />
    </button>
  );

  return <PopoverTriggerButton trigger={trigger} picker={picker} />;
}

export function FilterOperatorTrigger({
  label,
  picker,
}: {
  label: string;
  /** Opens on click when given (e.g. the any/none-of picker for a set-kind
   * row, or a between/after/before picker for a date row). Omit for
   * operators with nothing to open. */
  picker?: React.ReactNode;
}) {
  const trigger = (
    <button
      type='button'
      // Wide enough for the longest known operator ("is none of") without
      // relying on the ellipsis as a crutch.
      className={cn(
        'group flex w-[130px] shrink-0 items-center gap-2 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-2 text-left',
        TRIGGER_INTERACTIVE_CLASS,
      )}
    >
      <span className='min-w-0 flex-1 truncate whitespace-nowrap text-paragraph-sm text-text-strong-950'>
        {label}
      </span>
      <RiArrowRightSLine className={CHEVRON_CLASS} />
    </button>
  );

  return <PopoverTriggerButton trigger={trigger} picker={picker} />;
}

/** A fixed, non-editable operator, for kinds with only one operator
 * (keyword fields: "contains"). No box, no chevron — nothing to open.
 * Same width as FilterOperatorTrigger, so the value column that follows
 * starts at the same x position on every row regardless of operator kind. */
export function FilterOperatorLabel({ label }: { label: string }) {
  return (
    <span className='flex w-[130px] shrink-0 items-center whitespace-nowrap px-1 py-2.5 text-paragraph-sm text-text-sub-600'>
      {label}
    </span>
  );
}

const VALUE_TRIGGER_BASE_CLASS =
  // min-w-0: a flex item's default min-width is its content size, which
  // would stop the button (and the truncation inside it) from ever
  // shrinking below "Choose...", overflowing the row instead.
  'flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-2 text-left';

export function FilterValueTrigger({
  placeholder = 'Choose...',
  /** Set-kind values open a submenu (chevron). Date/number values open a
   * datepicker or plain input instead, so those variants drop the chevron. */
  showChevron = true,
  /** A range bound that can never match, e.g. lower bound above upper
   * bound. Both ends of the range take the error border, not just one. */
  invalid = false,
  className,
  picker,
  value,
  onValueChange,
  /** True once `placeholder` is showing a real chosen value (a picked
   * buyer/category, an applied date) rather than the empty-state prompt —
   * switches the label from placeholder-gray to filled-in text color. Only
   * meaningful on the button variant; the input variant already gets this
   * for free from `placeholder:`. */
  filled = false,
  chips,
  openPicker,
  onPickerOpened,
}: {
  placeholder?: string;
  showChevron?: boolean;
  invalid?: boolean;
  className?: string;
  /** Opens on click when given (e.g. BuyerPicker for a Buyer row,
   * DateFilterCalendar for a date bound). Omit for values with nothing to
   * open, like a plain keyword text input. */
  picker?: React.ReactNode;
  /** Plain editable text (Base Price bounds, keyword terms) — renders a
   * real input instead of a button. Omit both this and `onValueChange` to
   * keep the decorative closed-state button every specimen still uses. */
  value?: string;
  filled?: boolean;
  onValueChange?: (value: string) => void;
  /** Set-kind selections (Buyer/Category) — renders each as a removable
   * chip instead of joined placeholder text. Requires `picker` too, since
   * clicking anywhere on the row that isn't a chip still opens it to add
   * more. An empty array still renders the plain "Choose..." prompt. */
  chips?: SelectedValueChip[];
  /** Opens `picker` without a click, for callers that own an entry point
   * elsewhere on the page (the CPV chip in the filter bar). Flip it back to
   * false from `onPickerOpened`. */
  openPicker?: boolean;
  onPickerOpened?: () => void;
}) {
  if (chips) {
    // Capped, not wrapped: letting the row wrap to a second (third,
    // fourth...) line as more options pile up grows the row's height,
    // which pushes every row below it and breaks the panel's layout. A
    // fixed single-line row with a "+N" overflow tag stays predictable
    // regardless of how many options someone picks.
    const visibleChips = chips.slice(0, MAX_VISIBLE_CHIPS);
    const overflowCount = chips.length - visibleChips.length;

    // A `<div>`, not a `<button>` — each chip carries its own real dismiss
    // `<button>`, and a button can't contain a button (invalid HTML, breaks
    // click handling). `role='button'` + the Enter/Space handler restore
    // the keyboard behavior a real button would give for free. Built
    // inline (not a separate named component) so Radix's `asChild` slot
    // can merge its onClick/aria-* props straight onto this div — wrapping
    // it in another component would silently swallow those props instead.
    const chipsTrigger = (
      <div
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.currentTarget.click();
          }
        }}
        className={cn(
          'group flex min-w-0 flex-1 items-center gap-2 overflow-hidden rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-2 text-left',
          // py-1.5 (6px) + a 24px chip = the same 36px row height as every
          // other trigger's p-2 (8px) + 20px text line — matched so the
          // row doesn't visibly grow the moment the first option is picked.
          chips.length > 0 ? 'py-1.5' : 'py-2',
          chips.length > 0 ? CHIPS_TRIGGER_INTERACTIVE_CLASS : TRIGGER_INTERACTIVE_CLASS,
          invalid && 'border-error-base',
          className,
        )}
      >
        {chips.length === 0 ? (
          <span className='min-w-0 flex-1 truncate whitespace-nowrap text-paragraph-sm text-text-soft-400'>
            {placeholder}
          </span>
        ) : (
          <>
            <SelectedValueChips chips={visibleChips} />
            {overflowCount > 0 ? (
              <span className='shrink-0 whitespace-nowrap text-label-xs text-text-sub-600'>
                +{overflowCount} more
              </span>
            ) : null}
          </>
        )}
        {showChevron ? (
          <RiArrowRightSLine className={cn(CHEVRON_CLASS, 'ml-auto')} />
        ) : null}
      </div>
    );

    return (
      <PopoverTriggerButton
        trigger={chipsTrigger}
        picker={picker}
        openPicker={openPicker}
        onPickerOpened={onPickerOpened}
      />
    );
  }

  if (onValueChange) {
    return (
      <input
        type='text'
        value={value ?? ''}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          VALUE_TRIGGER_BASE_CLASS,
          'text-paragraph-sm text-text-strong-950 outline-none placeholder:text-text-soft-400',
          // Same border + shadow-button-important-focus pairing as the
          // trigger buttons (see TRIGGER_INTERACTIVE_CLASS above) instead of
          // a bare `ring-2` — a soft translucent halo around a thin
          // darkened border, not a flat opaque black block. box-shadow is
          // listed explicitly since transition-colors doesn't cover it.
          'transition-[background-color,border-color,box-shadow] duration-100 ease-out hover:bg-bg-weak-50 focus:bg-bg-white-0 focus:border-stroke-strong-950 focus:shadow-button-important-focus',
          invalid && 'border-error-base',
          className,
        )}
      />
    );
  }

  const trigger = (
    <button
      type='button'
      className={cn(
        'group',
        VALUE_TRIGGER_BASE_CLASS,
        TRIGGER_INTERACTIVE_CLASS,
        invalid && 'border-error-base',
        className,
      )}
    >
      <span
        className={cn(
          'min-w-0 flex-1 truncate whitespace-nowrap text-paragraph-sm',
          filled ? 'text-text-strong-950' : 'text-text-soft-400',
        )}
      >
        {placeholder}
      </span>
      {showChevron ? <RiArrowRightSLine className={CHEVRON_CLASS} /> : null}
    </button>
  );

  return <PopoverTriggerButton trigger={trigger} picker={picker} />;
}

/** How many digit characters sit in `str` before `index`. Used to carry a
 * caret position across a reformat — commas shift character offsets around,
 * but they never shift how many *digits* precede the caret. */
function countDigitsBefore(str: string, index: number): number {
  let count = 0;
  for (let i = 0; i < index && i < str.length; i++) {
    if (/\d/.test(str[i])) {
      count++;
    }
  }
  return count;
}

/** The character index in `str` right after its `digitCount`-th digit —
 * the inverse of `countDigitsBefore`, used to place the caret back after
 * reformatting. */
function indexAfterDigits(str: string, digitCount: number): number {
  if (digitCount <= 0) {
    return 0;
  }
  let seen = 0;
  for (let i = 0; i < str.length; i++) {
    if (/\d/.test(str[i])) {
      seen++;
      if (seen === digitCount) {
        return i + 1;
      }
    }
  }
  return str.length;
}

/** Formats a raw digit string ("2450000") with thousands separators
 * ("2,450,000"). Empty stays empty rather than becoming "0" — an unstarted
 * bound shouldn't read as a zero amount. `BigInt` (not `Number`) so a
 * 15-digit base price doesn't silently round through float precision. */
export function formatPriceDigits(digits: string): string {
  if (!digits) {
    return '';
  }
  return new Intl.NumberFormat('en-US').format(BigInt(digits));
}

/**
 * A Base Price bound: fixed "€" prefix, thousands-separated as you type
 * ("2450000" → "2,450,000"). `value`/`onValueChange` carry raw digits only
 * — the separators are display-only, so `parsePrice` downstream never has
 * to strip commas back out.
 *
 * Reformatting on every keystroke shifts character offsets (a new comma
 * appears at 1,000/1,000,000/...), which would otherwise throw the caret to
 * the end of the field. `flushSync` forces the reformatted value into the
 * DOM before we touch the caret, then `indexAfterDigits` places it back at
 * the same *digit*, not the same character offset.
 */
export function FilterPriceInput({
  value,
  onValueChange,
  invalid = false,
  className,
}: {
  /** Raw digits only, no separators — e.g. "2450000". */
  value: string;
  onValueChange: (digits: string) => void;
  invalid?: boolean;
  className?: string;
}) {
  const displayValue = formatPriceDigits(value);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target;
    const cursor = input.selectionStart ?? input.value.length;
    const digitsBeforeCursor = countDigitsBefore(input.value, cursor);
    const rawDigits = input.value.replace(/\D/g, '');

    flushSync(() => {
      onValueChange(rawDigits);
    });

    const nextDisplayValue = formatPriceDigits(rawDigits);
    const nextCursor = indexAfterDigits(nextDisplayValue, digitsBeforeCursor);
    input.setSelectionRange(nextCursor, nextCursor);
  }

  return (
    <div
      className={cn(
        VALUE_TRIGGER_BASE_CLASS,
        'transition-[background-color,border-color,box-shadow] duration-100 ease-out hover:bg-bg-weak-50 focus-within:bg-bg-white-0 focus-within:border-stroke-strong-950 focus-within:shadow-button-important-focus',
        invalid && 'border-error-base',
        className,
      )}
    >
      <span aria-hidden='true' className='shrink-0 text-paragraph-sm text-text-sub-600'>
        €
      </span>
      <input
        type='text'
        inputMode='numeric'
        value={displayValue}
        onChange={handleChange}
        placeholder='0'
        className='min-w-0 flex-1 bg-transparent text-paragraph-sm text-text-strong-950 outline-none placeholder:text-text-soft-400'
      />
    </div>
  );
}

/**
 * A freeform keyword field: type a term, press Enter to commit it as a
 * dismissible chip — the same `SelectedValueChips` look Buyer/Category use,
 * just entered by typing instead of picked from a popover, so the two feel
 * like one system rather than two different affordances for "a set of
 * values." Backspace on an empty draft removes the last chip and blurring
 * with unsent text commits it too, so a term is never silently dropped
 * just because the user clicked away instead of pressing Enter.
 */
export function FilterTagInput({
  terms,
  onTermsChange,
  placeholder = 'Enter keywords...',
  maxTerms,
  className,
}: {
  terms: string[];
  onTermsChange: (terms: string[]) => void;
  placeholder?: string;
  /** Once reached, the input stops accepting new terms (existing ones stay
   * editable via their dismiss button). */
  maxTerms?: number;
  className?: string;
}) {
  const [draft, setDraft] = React.useState('');
  const atCap = maxTerms !== undefined && terms.length >= maxTerms;

  // Blurring commits the draft, and clicking a chip's dismiss button blurs
  // the input — so that one click fires two updates in the same tick. Both
  // used to read the `terms` prop from the render that started the click,
  // so the removal overwrote the commit and the typed term vanished: the
  // exact "never silently dropped" promise in this component's own doc
  // comment. Staging every update through this ref makes the second one
  // build on the first.
  const termsRef = React.useRef(terms);
  termsRef.current = terms;

  function setTerms(next: string[]) {
    termsRef.current = next;
    onTermsChange(next);
  }

  function commitDraft() {
    const term = draft.trim();
    setDraft('');
    const current = termsRef.current;
    if (!term || (maxTerms !== undefined && current.length >= maxTerms)) {
      return;
    }
    if (current.some((existing) => existing.toLowerCase() === term.toLowerCase())) {
      return;
    }
    setTerms([...current, term]);
  }

  const chips: SelectedValueChip[] = terms.map((term) => ({
    id: term,
    label: term,
    onRemove: () => setTerms(termsRef.current.filter((t) => t !== term)),
  }));

  return (
    <div
      className={cn(
        'flex min-w-0 flex-1 flex-wrap items-center gap-1 rounded-lg border border-stroke-soft-200 bg-bg-white-0 px-2 py-1.5',
        'transition-[background-color,border-color,box-shadow] duration-100 ease-out focus-within:bg-bg-white-0 focus-within:border-stroke-strong-950 focus-within:shadow-button-important-focus',
        // Same split as the chips-mode FilterValueTrigger above: once a
        // chip is showing, it already carries its own bg-weak-50 — graying
        // the row behind it on hover would wash the chip out against its
        // own background instead of framing it. A near-invisible shadow
        // lift reads as interactive without competing with the chip. Empty
        // keeps the plain gray hover every other closed trigger uses.
        chips.length > 0 ? 'hover:shadow-regular-sm' : 'hover:bg-bg-weak-50',
        className,
      )}
    >
      <SelectedValueChips chips={chips} />
      <input
        type='text'
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commitDraft();
          } else if (e.key === 'Backspace' && draft === '' && terms.length > 0) {
            setTerms(termsRef.current.slice(0, -1));
          }
        }}
        onBlur={commitDraft}
        placeholder={terms.length === 0 ? placeholder : undefined}
        disabled={atCap}
        className='min-w-[80px] flex-1 bg-transparent py-0.5 text-paragraph-sm text-text-strong-950 outline-none placeholder:text-text-soft-400 disabled:cursor-not-allowed'
      />
    </div>
  );
}

/** The "and" between a range's two value triggers. */
export function FilterRangeSeparator() {
  return (
    <span className='shrink-0 px-1 py-2.5 text-paragraph-sm text-text-sub-600'>
      and
    </span>
  );
}

export function FilterRemoveButton({
  onClick,
  /** What this row is, for the accessible name — the same button sits on
   * keyword rows, where "Remove filter" names the wrong thing. */
  label = 'filter',
}: {
  onClick?: () => void;
  label?: string;
}) {
  return (
    <button
      type='button'
      aria-label={`Remove ${label}`}
      className='shrink-0 rounded-md p-0.5 text-text-sub-600 transition-[background-color,color,transform,box-shadow] duration-100 ease-out hover:bg-bg-weak-50 hover:text-text-strong-950 active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-strong-950'
      onClick={onClick}
    >
      <RiCloseFill className='size-5' />
    </button>
  );
}

export function FilterRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex w-full min-w-0 items-center gap-2', className)}>
      {children}
    </div>
  );
}
