// Fake network layer for the notifications drawer scratch route. Not
// production: a real fetch would hit the notifications endpoint described in
// the product spec, this hangs/resolves/rejects on a timer instead so the
// drawer can be built against real promise lifecycle (pending/resolved/
// rejected) rather than a `surface` enum the sandbox hands it directly.
//
// The sandbox's `surface` dial stays the input to this layer (loading forces
// the promise to never settle, error rejects it, empty resolves with zero
// items) — DialKit still drives the scenario, the drawer just no longer
// trusts settings.surface as the source of truth for what it renders.

import { buildData, type BuiltData, type BuildOptions } from './mock-data';

export type FetchNotificationsOptions = BuildOptions & {
  surface: 'ready' | 'loading' | 'error' | 'empty';
  latency: number;
  failNextAction: boolean;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function fetchNotifications(
  options: FetchNotificationsOptions,
): Promise<BuiltData> {
  const { surface, latency, failNextAction, ...buildOptions } = options;

  // "loading" means the request never comes back, not a slow success — this
  // is the only way to hold the loading-rows surface indefinitely on demand.
  if (surface === 'loading') {
    return new Promise(() => {});
  }

  return sleep(latency).then(() => {
    if (surface === 'error' || failNextAction) {
      throw new Error('Failed to load notifications');
    }

    if (surface === 'empty') {
      return { items: [], batchTotals: {} };
    }

    return buildData(buildOptions);
  });
}

/**
 * Batched "mark read" action. Real endpoint caps at 100 ids per request
 * (spec: "Batch read updates, at most 100 per request") and splits rather
 * than failing a larger batch — so this chunks client-side and fires one
 * mocked call per chunk instead of one call per id or one call for
 * everything.
 */
export async function markNotificationsRead(
  ids: string[],
  latency: number,
): Promise<void> {
  const chunkSize = 100;
  const chunks: string[][] = [];
  for (let i = 0; i < ids.length; i += chunkSize) {
    chunks.push(ids.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    if (chunk.length === 0) continue;
    await sleep(latency);
  }
}
