// The page-level state registry. As Figma hands over more states (loading,
// empty, error, no country access, ...) they get added here. Everything on
// the page reads the same state, since this is one composed screen now, not
// a bag of isolated elements.

export const STATE_IDS = ['rich'] as const;

export type StateId = (typeof STATE_IDS)[number];

export const DEFAULT_STATE: StateId = 'rich';
