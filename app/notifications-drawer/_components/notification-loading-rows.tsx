// Local loading placeholder. The repo has no skeleton primitive and no pulse
// utility anywhere, so this is deliberately scoped to this route rather than
// added to components/ui: promoting it is a separate ask.
//
// It holds the real row geometry (size-10 disc, two text lines, 15px gap,
// px-3 py-4, square corners, no gap between rows)
// so the list does not jump when the data arrives, per
// component-patterns.md:289 "Loading spinner that collapses table layout".

const ROWS = [
  { title: 'w-3/4', meta: 'w-1/2' },
  { title: 'w-2/3', meta: 'w-2/5' },
  { title: 'w-4/5', meta: 'w-1/3' },
  { title: 'w-1/2', meta: 'w-2/3' },
  { title: 'w-3/5', meta: 'w-1/2' },
];

export function NotificationLoadingRows() {
  return (
    <div className='flex flex-col' aria-busy='true' aria-live='polite'>
      <span className='sr-only'>Loading notifications</span>
      {ROWS.map((row, index) => (
        <div key={index} className='flex items-start gap-[15px] px-3 py-4'>
          <div className='size-10 shrink-0 animate-pulse rounded-full bg-bg-soft-200' />
          <div className='flex flex-1 flex-col gap-1.5 pt-1'>
            <div
              className={`h-3 animate-pulse rounded bg-bg-soft-200 ${row.title}`}
            />
            <div
              className={`h-2.5 animate-pulse rounded bg-bg-weak-50 ${row.meta}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
