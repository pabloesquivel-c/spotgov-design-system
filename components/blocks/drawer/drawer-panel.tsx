// right-0 is load-bearing, not decorative: this panel is absolutely positioned
// with no left/right of its own, so without it the horizontal resting position
// falls back to the browser's grid-item static-position resolution (via the
// Overlay's place-items-end) — inconsistent enough that the panel could render
// anchored to the left instead of the right its slide-in animation implies.
// overflow-hidden is load-bearing too: the rounded-20 corners only clip
// content to their curve if the panel establishes its own clip on both
// axes, matching the Figma frame's root (node 2310:29358), which pairs
// rounded-[20px] with overflow-clip. Without it, any child content wider
// than the panel bleeds past the right edge and paints over the border.
// Popovers/tooltips/selects render in a portal, so they aren't affected
// by this.
//
// A real `border`, not `ring-1 ring-inset`, and this is also load-bearing.
// Figma's root frame uses an actual border (not a shadow), and the two
// aren't interchangeable here: ring-inset is a box-shadow, painted in the
// same layer as the panel's own background, so any opaque child content
// flush against the panel edge (every row was `bg-bg-white-0` edge to
// edge, and still is on hover/keyboard-highlight via bg-bg-weak-50) paints
// over it and hides it. A CSS border occupies its own space outside the
// content box, so children can never render over it, in any state.
export const drawerPanelClassName =
  'absolute inset-y-0 right-0 mx-2 my-2 max-h-[calc(100%-16px)] w-[min(400px,calc(100%-16px))] overflow-hidden rounded-20 border border-stroke-soft-200 shadow-regular-md';
