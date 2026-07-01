'use client';

import * as LabelPrimitives from '@radix-ui/react-label';
import { RiEqualizer3Line } from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as LinkButton from '@/components/ui/link-button';
import {
  CheckboxCardHeader,
  CheckboxCardShell,
} from './checkbox-card-shell';

export function TourPersonalizationCheckbox() {
  return (
    <CheckboxCardShell>
      <CheckboxCardHeader
        icon={RiEqualizer3Line}
        title='Personalize your tour experience'
        description='Personalize your tour with or without a guide.'
      />

      <Divider.Root variant='line-spacing' />

      <div className='flex items-start gap-2'>
        <Checkbox.Root id='tour-guide' />
        <LabelPrimitives.Root className='cursor-pointer' htmlFor='tour-guide'>
          <div className='flex items-center gap-1 text-label-sm text-text-strong-950'>
            Yes, I want a guide
            <Badge.Root variant='lighter' color='blue' size='small'>
              SUGGESTED
            </Badge.Root>
          </div>
          <div className='mt-1 text-paragraph-xs text-text-sub-600'>
            Enhance your experience with the expertise and insights of a
            knowledgeable guide who will accompany you throughout the tour,
            providing valuable information and context.
          </div>
          <LinkButton.Root
            variant='primary'
            size='small'
            className='mt-2.5 block'
          >
            Meet our guides
          </LinkButton.Root>
        </LabelPrimitives.Root>
      </div>

      <div className='flex items-start gap-2'>
        <Checkbox.Root id='tour-self-guided' />
        <LabelPrimitives.Root
          className='cursor-pointer'
          htmlFor='tour-self-guided'
        >
          <div className='flex items-center gap-1 text-label-sm text-text-strong-950'>
            No, I prefer self-guided
          </div>
          <div className='mt-1 text-paragraph-xs text-text-sub-600'>
            Explore at your own pace and immerse yourself in the tour experience
            with the freedom to navigate independently, discovering the
            highlights and hidden gems on your own terms.
          </div>
        </LabelPrimitives.Root>
      </div>

      <Button.Root
        variant='neutral'
        mode='stroke'
        size='small'
        className='w-full'
      >
        Save Changes
      </Button.Root>
    </CheckboxCardShell>
  );
}
