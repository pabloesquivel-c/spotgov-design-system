'use client';

import { RiArrowRightSLine, RiBriefcaseLine, RiSettings3Line } from '@remixicon/react';

import { SettingsCard } from './settings-card';
import type { SectionId } from './settings-rail';

export function GeneralSection({
  onNavigate,
}: {
  onNavigate: (id: SectionId) => void;
}) {
  return (
    <SettingsCard
      icon={RiSettings3Line}
      title='General'
      description='Organization-wide settings and quick links.'
    >
      <button
        type='button'
        onClick={() => onNavigate('business-profile')}
        className='group flex w-full items-center gap-3 rounded-xl p-4 text-left ring-1 ring-inset ring-stroke-soft-200 transition-colors hover:bg-bg-weak-50'
      >
        <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
          <RiBriefcaseLine className='size-5 text-text-sub-600' />
        </div>
        <div className='min-w-0 flex-1'>
          <span className='block text-label-sm text-text-strong-950'>
            Business Profile
          </span>
          <span className='block text-paragraph-xs text-text-sub-600'>
            Company details used across tenders and analyses.
          </span>
        </div>
        <RiArrowRightSLine className='size-5 shrink-0 text-text-soft-400 transition-colors group-hover:text-text-sub-600' />
      </button>
    </SettingsCard>
  );
}
