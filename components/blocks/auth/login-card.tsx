'use client';

import * as React from 'react';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';

import * as Divider from '@/components/ui/divider';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as LinkButton from '@/components/ui/link-button';
import * as SocialButton from '@/components/ui/social-button';
import { IconApple, IconGoogle } from './social-icons';

export function LoginAuthCard() {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className='flex w-full max-w-[400px] flex-col gap-5 rounded-20 bg-bg-white-0 p-6 shadow-regular-xs'>
      <div className='flex flex-col items-center gap-5'>
        <img
          src='https://alignui.com/images/logo/phoenix.svg'
          alt=''
          className='size-14'
        />
        <div className='text-center'>
          <div className='text-title-h6 text-text-strong-950'>Welcome back</div>
          <div className='text-paragraph-sm text-text-sub-600'>
            Please enter your details to login.
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='login-email'>Email Address</Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id='login-email'
                type='email'
                placeholder='hello@alignui.com'
              />
            </Input.Wrapper>
          </Input.Root>
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='login-password'>Password</Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id='login-password'
                type={showPassword ? 'text' : 'password'}
                placeholder='• • • • • • • • • • '
              />
              <button type='button' onClick={() => setShowPassword((s) => !s)}>
                {showPassword ? (
                  <RiEyeOffLine className='size-5 text-text-soft-400' />
                ) : (
                  <RiEyeLine className='size-5 text-text-soft-400' />
                )}
              </button>
            </Input.Wrapper>
          </Input.Root>
        </div>

        <div className='mt-1 flex items-center gap-1'>
          <span className='text-paragraph-sm text-text-sub-600'>
            Forgot password?
          </span>
          <LinkButton.Root variant='primary' size='medium'>
            Reset it
          </LinkButton.Root>
        </div>
      </div>

      <FancyButton.Root variant='primary' className='w-full'>
        Login
      </FancyButton.Root>

      <Divider.Root variant='line-text'>OR</Divider.Root>

      <div className='grid grid-cols-2 gap-3'>
        <SocialButton.Root brand='google' mode='stroke'>
          <SocialButton.Icon as={IconGoogle} />
          with Google
        </SocialButton.Root>
        <SocialButton.Root brand='apple' mode='stroke'>
          <SocialButton.Icon as={IconApple} />
          with Apple
        </SocialButton.Root>
      </div>

      <div className='flex items-baseline justify-center gap-1 text-paragraph-sm text-text-sub-600'>
        Don&apos;t have an account?
        <LinkButton.Root variant='black' size='medium'>
          Register
        </LinkButton.Root>
      </div>
    </div>
  );
}
