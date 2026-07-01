'use client';

import * as LabelPrimitives from '@radix-ui/react-label';
import { RiSettingsLine } from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as LinkButton from '@/components/ui/link-button';
import {
  CheckboxCardHeader,
  CheckboxCardShell,
} from './checkbox-card-shell';

export function PrivacySettingsCheckbox() {
  return (
    <CheckboxCardShell>
      <CheckboxCardHeader
        icon={RiSettingsLine}
        title='Privacy Settings'
        description='Adjust privacy settings based on your preferences.'
      />

      <Divider.Root variant='line-spacing' />

      <div className='flex items-start gap-2'>
        <Checkbox.Root id='privacy-personalized' />
        <LabelPrimitives.Root
          className='cursor-pointer'
          htmlFor='privacy-personalized'
        >
          <div className='flex items-center gap-1 text-label-sm text-text-strong-950'>
            Personalized Experience
            <Badge.Root variant='lighter' color='blue' size='small'>
              ADVISED
            </Badge.Root>
          </div>
          <div className='mt-1 text-paragraph-xs text-text-sub-600'>
            Tailor your experience by allowing us to use your preferences to
            enhance the content and features you see.
          </div>
          <LinkButton.Root
            variant='primary'
            size='small'
            className='mt-2.5 block'
          >
            Learn More
          </LinkButton.Root>
        </LabelPrimitives.Root>
      </div>

      <div className='flex items-start gap-2'>
        <Checkbox.Root id='privacy-sharing' />
        <LabelPrimitives.Root
          className='cursor-pointer'
          htmlFor='privacy-sharing'
        >
          <div className='flex items-center gap-1 text-label-sm text-text-strong-950'>
            Data Sharing
          </div>
          <div className='mt-1 text-paragraph-xs text-text-sub-600'>
            Limit the sharing of your data with trusted third-party partners for
            improved privacy.
          </div>
        </LabelPrimitives.Root>
      </div>

      <div className='flex items-start gap-2'>
        <Checkbox.Root id='privacy-logging' />
        <LabelPrimitives.Root className='cursor-pointer' htmlFor='privacy-logging'>
          <div className='flex items-center gap-1 text-label-sm text-text-strong-950'>
            Activity Logging
          </div>
          <div className='mt-1 text-paragraph-xs text-text-sub-600'>
            Control the logging of your activities on our platform, providing
            you with the freedom to manage your digital footprint.
          </div>
          <LinkButton.Root
            variant='primary'
            size='small'
            className='mt-2.5 block'
          >
            Explore logging options
          </LinkButton.Root>
        </LabelPrimitives.Root>
      </div>
    </CheckboxCardShell>
  );
}
