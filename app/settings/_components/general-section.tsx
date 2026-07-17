'use client';

import {
  RiArrowRightSLine,
  RiInformationLine,
  RiSettings3Line,
} from '@remixicon/react';

import * as Alert from '@/components/ui/alert';

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
        className='group w-full text-left outline-none'
      >
        <Alert.Root
          variant='lighter'
          status='information'
          size='small'
          className='cursor-pointer transition-colors group-hover:bg-bg-weak-50 group-focus-visible:ring-2 group-focus-visible:ring-primary-base'
        >
          <Alert.Icon as={RiInformationLine} />
          <span className='flex flex-1 items-center justify-between gap-2'>
            <span>
              Organization details have moved to{' '}
              <span className='font-medium'>Business Profile</span>.
            </span>
            <RiArrowRightSLine
              className='size-5 shrink-0 text-text-sub-600 transition-colors group-hover:text-text-strong-950'
              aria-hidden='true'
            />
          </span>
        </Alert.Root>
      </button>
    </SettingsCard>
  );
}
