'use client';

import { RiSettings2Line } from '@remixicon/react';

import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as Label from '@/components/ui/label';
import * as LinkButton from '@/components/ui/link-button';
import {
  CheckboxCardHeader,
  CheckboxCardShell,
} from './checkbox-card-shell';

export function AuthenticationSettingsCheckbox() {
  return (
    <CheckboxCardShell>
      <CheckboxCardHeader
        icon={RiSettings2Line}
        title='Authentication Settings'
        description='Edit your preferences for authentication settings.'
      />

      <Divider.Root variant='line-spacing' />

      <div className='flex flex-col gap-3'>
        <div className='text-label-sm text-text-strong-950'>
          Two-Factor Authentication
        </div>
        <div className='flex items-center gap-2'>
          <Checkbox.Root id='auth-sms' />
          <Label.Root className='text-paragraph-sm' htmlFor='auth-sms'>
            SMS Verification
          </Label.Root>
        </div>
        <div className='flex items-center gap-2'>
          <Checkbox.Root id='auth-app' />
          <Label.Root className='text-paragraph-sm' htmlFor='auth-app'>
            Authenticator App
          </Label.Root>
        </div>
      </div>

      <Divider.Root variant='line-spacing' />

      <div>
        <div className='text-label-sm text-text-strong-950'>Password Strength</div>
        <div className='mt-2 text-paragraph-sm text-text-sub-600'>
          For enhanced security measures, it is highly recommended to
          consistently create and utilize strong, well-generated passwords.
        </div>
      </div>

      <Divider.Root variant='line-spacing' />

      <div>
        <div className='text-label-sm text-text-strong-950'>
          Allowing Apex to Protect Your Data
        </div>
        <div className='mt-2 text-paragraph-sm text-text-sub-600'>
          To learn more about how Apex protects your data{' '}
          <LinkButton.Root variant='primary' size='medium' underline>
            Read Privacy Policy
          </LinkButton.Root>
        </div>
      </div>
    </CheckboxCardShell>
  );
}
