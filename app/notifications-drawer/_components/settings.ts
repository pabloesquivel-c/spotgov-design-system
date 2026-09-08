// Every spec conflict and every [suggested] line stays a switch here rather than
// a quiet decision in the composition. Being built does not make them decided.

export type Surface = 'ready' | 'loading' | 'error' | 'empty';

export type NotificationsDrawerSettings = {
  // Data
  dataset: 'mixed' | 'opportunities' | 'people' | 'many' | 'tiny';
  unreadCount: number;

  // Load
  surface: Surface;
  latency: number;
  failNextAction: boolean;
  /** permission-limited: mark-all is not granted. */
  permission: 'full' | 'read-only';

  // Read model
  readTrigger: 'visible' | 'scroll' | 'manual';
  visibleThreshold: number;
  dwellMs: number;
  markAllAsRead: boolean;

  // Batches
  pageSize: number;

  // Items
  attribution: 'icon' | 'avatar';
  nameFieldInCopy: boolean;
  pageLimit: number;
};

export const DEFAULT_SETTINGS: NotificationsDrawerSettings = {
  dataset: 'mixed',
  unreadCount: 5,
  surface: 'ready',
  latency: 700,
  failNextAction: false,
  permission: 'full',
  readTrigger: 'visible',
  visibleThreshold: 0.6,
  dwellMs: 800,
  markAllAsRead: true,
  pageSize: 10,
  attribution: 'icon',
  nameFieldInCopy: false,
  pageLimit: 30,
};
