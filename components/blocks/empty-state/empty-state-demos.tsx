'use client';

import { RiFileList3Line, RiRadarLine } from '@remixicon/react';

import { EmptyState } from './empty-state';

export function FilteredTendersEmptyState() {
  return (
    <EmptyState
      icon={RiRadarLine}
      title='No tenders match these filters'
      description='Try clearing filters or adjusting your search to see active opportunities.'
      actionLabel='Clear filters'
      onAction={() => undefined}
    />
  );
}

export function NoSavedTendersEmptyState() {
  return (
    <EmptyState
      icon={RiFileList3Line}
      title='No saved tenders yet'
      description='Save tenders from Radar or Active Tenders to track them through your pipeline.'
      actionLabel='Open Tender Radar'
      onAction={() => undefined}
    />
  );
}
