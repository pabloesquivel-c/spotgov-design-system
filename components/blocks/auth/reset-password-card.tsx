'use client';

import { RiDoorLockLine, RiMailLine } from '@remixicon/react';

import * as Divider from '@/components/ui/divider';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as LinkButton from '@/components/ui/link-button';
import { AuthCardIconHeader } from './auth-card-icon-header';

export function ResetPasswordAuthCard() {
  return (
    <div className='flex w-full max-w-[440px] flex-col gap-6 rounded-20 bg-bg-white-0 p-5 md:p-8'>
      <AuthCardIconHeader
        icon={RiDoorLockLine}
        title='Reset Password'
        description='Enter your email to reset your password.'
      />

      <Divider.Root />

      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='reset-email'>
            Email Address <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiMailLine} />
              <Input.Input
                id='reset-email'
                type='email'
                placeholder='hello@alignui.com'
                required
              />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>

      <FancyButton.Root variant='primary' size='medium'>
        Reset Password
      </FancyButton.Root>

      <div className='flex flex-col items-center gap-1 text-center text-paragraph-sm text-text-sub-600'>
        Don&apos;t have access anymore?
        <LinkButton.Root variant='black' size='medium' underline>
          Try another method
        </LinkButton.Root>
      </div>
    </div>
  );
}
