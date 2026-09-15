'use client';

// The flows tab: end-to-end demo flows for Search Tenders, switched via the
// dial's "Flows" section. Each flow gets its own component, added one at a
// time as they're described.

import * as React from 'react';

import { RichStateFlow } from './rich-state-flow';

export const FLOW_IDS = ['none', 'rich-state'] as const;
export type FlowId = (typeof FLOW_IDS)[number];

// Tier-2 states from rich-state-flow.tsx: conditions nothing a click can
// reach on demand (loading, error, empty, no access, ...). 'none' leaves
// the flow driven purely by real interaction — typing, toggling, Search.
export const FORCE_STATE_IDS = [
  'none',
  'searching',
  'no-results',
  'filter-error',
  'dropped',
  'denied',
  'error',
] as const;
export type ForceStateId = (typeof FORCE_STATE_IDS)[number];

export function FlowsDemo({
  flow,
  forceState,
}: {
  flow: Exclude<FlowId, 'none'>;
  forceState: ForceStateId;
}) {
  switch (flow) {
    case 'rich-state':
    default:
      return <RichStateFlow forceState={forceState} />;
  }
}
