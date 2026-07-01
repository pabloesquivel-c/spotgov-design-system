# SpotGov accessibility baseline

SpotGov product UI targets **WCAG 2.1 AA**. This guide turns the token rules in [`design-tokens.md`](./design-tokens.md) into implementation checks for agents and humans.

## Text contrast

| Context | Use | Avoid |
|---------|-----|-------|
| Page titles, headings, primary copy | `text-text-strong-950` | Low-emphasis text tokens |
| Body, labels, metadata, timestamps, helper text | `text-text-sub-600` or stronger | `text-text-soft-400` on `bg-bg-white-0` |
| Disabled controls | `text-text-disabled-300` only with an actual disabled affordance | Disabled styling on active controls |
| Dark or filled surfaces | `text-text-white-0` / `text-static-white` | Raw white/black classes |

`text-text-soft-400` on `bg-bg-white-0` is below AA for normal 12-14px text. Treat it as decorative only; do not use it for procurement metadata, timestamps, helper copy, table cell content, or anything users need to read to make a decision.

## Keyboard focus

- Every interactive element needs a visible `focus-visible` state.
- Use existing button focus shadows: `shadow-button-primary-focus`, `shadow-button-important-focus`, and `shadow-button-error-focus`.
- Prefer `primary-base` for action focus and `stroke-strong-950` for neutral focus.
- Do not remove outlines unless an equal or stronger focus indicator replaces them.

## Status and color

Color must never be the only way to identify status. Status badges need:

1. visible label text,
2. semantic color,
3. a redundant icon or shape.

| Status meaning | Token family | Required cue |
|----------------|--------------|--------------|
| Awarded / completed / confirmed | `success-*` | Check icon |
| Pending / in review / on hold | `away-*` or `warning-*` | Clock icon or dot |
| Rejected / failed / blocked | `error-*` | Close or error icon |
| Disabled / inactive / archived | `faded-*` | Muted icon, disabled affordance, or explicit label |

Use Remix Icon Line icons only. Keep status icons at `size-icon-inline`.

## Component state checklist

### Buttons

- Default, hover, pressed/active, focus-visible, disabled, and loading states must be documented.
- Disabled buttons use the native `disabled` attribute.
- Loading buttons should prevent duplicate submission, preserve button width, set `aria-busy`, and include a visible spinner or progress cue.
- Icon-only buttons need an accessible name via `aria-label`.

### Forms

- Labels must be programmatically connected to inputs.
- Helper and error text must be readable at `text-text-sub-600` or stronger.
- Error states need text, not just red borders.

### Motion

- Keep transitions short and functional.
- Respect `prefers-reduced-motion` when adding non-essential animation.

## Layout readability

- Keep mobile and narrow tablet layouts single-column unless two-column content remains readable.
- Avoid horizontal scrolling for main task flows.
- On large screens, keep dashboard content inside the 1440px grid instead of stretching indefinitely.
