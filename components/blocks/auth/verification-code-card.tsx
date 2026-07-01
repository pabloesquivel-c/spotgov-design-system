'use client';

import * as React from 'react';
import { RiMailCheckLine } from '@remixicon/react';

import * as DigitInput from '@/components/ui/digit-input';
import * as Divider from '@/components/ui/divider';
import * as FancyButton from '@/components/ui/fancy-button';
import * as LinkButton from '@/components/ui/link-button';
import { AuthCardIconHeader } from './auth-card-icon-header';

export function VerificationCodeAuthCard() {
  const [digitInputValue, setDigitInputValue] = React.useState('');

  return (
    <div className='flex w-full max-w-[440px] flex-col gap-6 rounded-20 bg-bg-white-0 p-5 md:p-8'>
      <AuthCardIconHeader
        icon={RiMailCheckLine}
        title='Enter Verification Code'
        description={
          <>
            We&apos;ve sent a code to{' '}
            <span className='font-medium text-text-strong-950'>
              arthur@alignui.com
            </span>
          </>
        }
      />

      <Divider.Root />

      <DigitInput.Root
        numInputs={4}
        onChange={(value) => setDigitInputValue(value)}
        value={digitInputValue}
      />

      <FancyButton.Root variant='primary' size='medium'>
        Submit Code
      </FancyButton.Root>

      <div className='flex flex-col items-center gap-1 text-center text-paragraph-sm text-text-sub-600'>
        Experiencing issues receiving the code?
        <LinkButton.Root variant='black' size='medium' underline>
          Resend code
        </LinkButton.Root>
      </div>
    </div>
  );
}
