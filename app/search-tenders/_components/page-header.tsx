'use client';

// Page header. Figma: node 2541:4446 "Page Header [1.1]".
// Title/subtitle + Views (stroke) and Export (filled) actions. No divider,
// no side padding — the header bleeds edge-to-edge; callers own outer
// spacing.
//
// Views is real when a caller passes `views` — it opens the same
// ViewsPicker used in the Modals specimen tab, wired to select/search/save.
// Selecting a view, updating it, or saving as new all close the popover
// (decisive actions); Reset doesn't, so you can keep adjusting. Omit
// `views` to keep the button decorative, as every other PageHeader call
// site still does.

import * as React from 'react';
import { RiExportLine, RiStackLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Popover from '@/components/ui/popover';
import { ViewsPicker } from './views-picker';

export function PageHeader({
  views,
  currentView,
  onSelectView,
  viewSearch,
  onViewSearchChange,
  hasUnsavedViewChanges,
  onUpdateView,
  onSaveAsNewView,
  onResetView,
  onExport,
}: {
  views?: string[];
  currentView?: string;
  onSelectView?: (view: string) => void;
  viewSearch?: string;
  onViewSearchChange?: (value: string) => void;
  hasUnsavedViewChanges?: boolean;
  onUpdateView?: () => void;
  onSaveAsNewView?: () => void;
  onResetView?: () => void;
  onExport?: () => void;
}) {
  const [viewsOpen, setViewsOpen] = React.useState(false);

  const viewsButton = (
    <Button.Root variant='neutral' mode='stroke' size='small'>
      <Button.Icon as={RiStackLine} />
      Views
    </Button.Root>
  );

  return (
    <div className='flex items-center gap-3 py-5'>
      <div className='flex flex-1 flex-col gap-1'>
        <p className='text-label-lg text-text-strong-950'>Search Tenders</p>
        <p className='text-paragraph-sm text-text-sub-600'>
          Every tender, at every stage of its life.
        </p>
      </div>

      <div className='flex shrink-0 items-center gap-3'>
        {views ? (
          <Popover.Root open={viewsOpen} onOpenChange={setViewsOpen}>
            <Popover.Trigger asChild>{viewsButton}</Popover.Trigger>
            <Popover.Content align='end' unstyled showArrow={false}>
              <ViewsPicker
                views={views}
                current={currentView}
                onSelectView={(view) => {
                  onSelectView?.(view);
                  setViewsOpen(false);
                }}
                searchValue={viewSearch}
                onSearchChange={onViewSearchChange}
                hasUnsavedChanges={hasUnsavedViewChanges}
                onUpdateView={() => {
                  onUpdateView?.();
                  setViewsOpen(false);
                }}
                onSaveAsNewView={() => {
                  onSaveAsNewView?.();
                  setViewsOpen(false);
                }}
                onReset={onResetView}
              />
            </Popover.Content>
          </Popover.Root>
        ) : (
          viewsButton
        )}

        <Button.Root
          variant='neutral'
          mode='filled'
          size='small'
          onClick={onExport}
        >
          <Button.Icon as={RiExportLine} />
          Export
        </Button.Root>
      </div>
    </div>
  );
}
