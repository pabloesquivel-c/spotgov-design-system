'use client';

import {
  RiInformationLine,
  RiMailLine,
  RiUserAddLine,
  RiUserLine,
} from '@remixicon/react';

import * as Divider from '@/components/ui/divider';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as LinkButton from '@/components/ui/link-button';
import { AuthCardIconHeader } from './auth-card-icon-header';
import { PasswordField } from './password-field';

export function CreateAccountAuthCard() {
  return (
    <div className='flex w-full max-w-[440px] flex-col gap-6 rounded-20 bg-bg-white-0 p-5 md:p-8'>
      <AuthCardIconHeader
        icon={RiUserAddLine}
        title='Create a new account'
        description='Enter your details to register.'
      />

      <Divider.Root />

      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='register-fullname'>
            Full Name <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiUserLine} />
              <Input.Input
                id='register-fullname'
                type='text'
                placeholder='James Brown'
                required
              />
            </Input.Wrapper>
          </Input.Root>
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='register-email'>
            Email Address <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiMailLine} />
              <Input.Input
                id='register-email'
                type='email'
                placeholder='hello@alignui.com'
                required
              />
            </Input.Wrapper>
          </Input.Root>
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='register-password'>
            Password <Label.Asterisk />
          </Label.Root>
          <PasswordField id='register-password' required />
          <div className='flex gap-1 text-paragraph-xs text-text-sub-600'>
            <RiInformationLine className='size-4 shrink-0 text-text-soft-400' />
            Must contain 1 uppercase letter, 1 number, min. 8 characters.
          </div>
        </div>
      </div>

      <FancyButton.Root variant='primary' size='medium'>
        Register
      </FancyButton.Root>

      <div className='text-center text-paragraph-sm text-text-sub-600'>
        By clicking Register, you agree to accept Apex Financial&apos;s
        <div className='inline-block pt-1 align-baseline'>
          <LinkButton.Root
            variant='black'
            size='medium'
            underline
            className='px-1'
          >
            Terms of Service
          </LinkButton.Root>
        </div>
      </div>
    </div>
  );
}
