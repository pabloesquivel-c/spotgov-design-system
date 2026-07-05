/**
 * Exact type + spacing values traced from the Paper "Playground Structure"
 * mock (file "SpotGov Product", node 6MT-0 and siblings). Deliberately not
 * AlignUI's semantic type scale: this is a distinct, editorial reading
 * surface, so the values below are the source of truth for this article
 * shell, matched pixel-for-pixel rather than mapped to the product's
 * dashboard type roles.
 *
 * Sibling-based margins replicate the mock's spacing rhythm without a
 * flex `gap` on the article shell: the shell applies no gap, and each
 * element controls its own top margin based on what precedes it.
 */

// Page title (h1): 28/40, -1px tracking, medium, warm near-black.
export const articleH1 =
  'text-[28px] leading-[40px] tracking-[-1px] font-medium text-[#1C1917]';

// Section subheader (h2): 20/30, -0.22px tracking, medium.
export const articleH2 =
  'text-[20px] leading-[30px] tracking-[-0.22px] font-medium text-[#1C1917]';

// Sub-section heading (h3). No exact mock reference at this level; sized
// between the eyebrow label and h2 to keep the hierarchy legible.
export const articleH3 =
  'text-[17px] leading-[26px] tracking-[-0.1px] font-medium text-[#1C1917]';

// Body copy: 15/28, -0.02em tracking, warm gray.
// - mt-8 (32px) is the default gap after a heading block.
// - after an h1, the gap narrows to mt-6 (24px).
// - directly after another paragraph, it narrows to mt-5 (20px).
// - directly after an example container (`.pg-example`), mt-5 (20px).
// - directly after an eyebrow label (`.pg-eyebrow`), mt-4 (16px).
export const articleBody =
  'mt-8 [h1+&]:mt-6 [p+&]:mt-5 [.pg-example+&]:mt-5 [.pg-eyebrow+&]:mt-4 ' +
  'text-[15px] leading-[28px] tracking-[-0.02em] text-[#57534D]';

// Small muted label used above an example ("Primary Color Palette").
// Not uppercase in the source mock, just small and low-contrast.
export const articleEyebrow =
  'pg-eyebrow mt-8 block text-[13px] leading-[18px] text-[#A6A09B]';

// Monospace caption under a swatch, matching the mock's token labels.
export const articleCaption = 'font-mono text-[12px] leading-[18px] text-[#A6A09B]';

// The gray presentation surface for anything concrete: palettes, code, demos.
// Split in two because the box must size itself to its content (a 272px
// sidebar and a wide data table need different widths) while the article
// column it lives in is fixed at 672px:
// - `articleExampleRow` breaks out of that fixed column using the standard
//   full-bleed technique (`left`/`right` 50% + `-50vw` margins on a `100vw`
//   box), so the box below is never constrained by the text width, then
//   re-centers it with `flex justify-center`.
// - `articleExampleContainer` is the visible box itself, sized with `w-fit`
//   so it grows to fit content wider than the text column instead of
//   overflowing it (min/max bounds are set in ExampleContainer, since they
//   need calc()/min() against the viewport). `p-8` is the generous white
//   space so content never sits flush against the edges.
export const articleExampleRow =
  'pg-example relative left-1/2 right-1/2 mt-5 w-screen -mx-[50vw] flex justify-center';

export const articleExampleContainer =
  'flex w-fit flex-col items-center gap-4 overflow-x-auto rounded-xl bg-bg-weak-50 p-8';

// Centered short divider that opens each new section. mt-[60px] carries the
// larger section-to-section gap; mb-10 (40px) is the gap to the heading.
export const articleDivider = 'mx-auto mt-[60px] mb-10 h-px w-10 bg-[#57534D]/20';
