// Page header. Figma: node 2586:23831 "Page Header [1.1]".
// Title + subtitle only — no actions, no divider, no side padding. The
// header bleeds edge-to-edge; callers own outer spacing.
//
// Views and Export CSV used to live here. They moved down to the results
// toolbar (results-toolbar.tsx), beside Sort — all three act on the result
// list, so they belong on the shelf that captions it rather than on the
// page title. That leaves this a pure heading, with no client state left
// to hold, hence no 'use client'.

export function PageHeader() {
  return (
    <div className='flex items-center gap-3 py-5'>
      <div className='flex flex-1 flex-col gap-1'>
        <p className='text-label-lg text-text-strong-950'>Search Tenders</p>
        <p className='text-paragraph-sm text-text-sub-600'>
          Find any tender, at any stage, and narrow thousands of results to the
          ones worth your time.
        </p>
      </div>
    </div>
  );
}
