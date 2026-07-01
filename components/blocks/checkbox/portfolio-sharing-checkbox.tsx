'use client';

import { RiShareLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as Label from '@/components/ui/label';
import {
  CheckboxCardHeader,
  CheckboxCardShell,
} from './checkbox-card-shell';

export function PortfolioSharingCheckbox() {
  return (
    <CheckboxCardShell>
      <CheckboxCardHeader
        icon={RiShareLine}
        title='Configure Profiles for Portfolio Sharing'
        description='Your portfolio will be shared in these profiles.'
      />

      <Divider.Root variant='line-spacing' />

      <div className='flex items-center gap-2'>
        <Checkbox.Root id='portfolio-dribbble' />
        <Label.Root className='text-paragraph-sm' htmlFor='portfolio-dribbble'>
          Dribbble
          <Label.Sub>@ravipatel</Label.Sub>
        </Label.Root>
      </div>

      <div className='flex items-center gap-2'>
        <Checkbox.Root id='portfolio-behance' />
        <Label.Root className='text-paragraph-sm' htmlFor='portfolio-behance'>
          Behance
          <Label.Sub>@ravipatelart</Label.Sub>
        </Label.Root>
      </div>

      <div className='flex items-center gap-2'>
        <Checkbox.Root id='portfolio-twitter' />
        <Label.Root className='text-paragraph-sm' htmlFor='portfolio-twitter'>
          Twitter
          <Label.Sub>@patelravi</Label.Sub>
        </Label.Root>
      </div>

      <Button.Root
        variant='neutral'
        mode='stroke'
        size='xsmall'
        className='w-full'
      >
        Edit Configuration
      </Button.Root>
    </CheckboxCardShell>
  );
}
