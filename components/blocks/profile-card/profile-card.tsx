'use client';

import { RiAddLine, RiUserAddLine } from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as LinkButton from '@/components/ui/link-button';

export function ProfileCard() {
  return (
    <div className='w-full max-w-[400px] rounded-20 bg-bg-white-0 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200'>
      <div className='flex flex-col items-center gap-4 p-6'>
        <Avatar.Root size='64' color='blue'>
          <Avatar.Image src='https://alignui.com/images/avatar/photo/arthur.png' />
          <Avatar.Indicator position='bottom'>
            <Avatar.BrandLogo src='https://alignui.com/images/logo/apex.svg' />
          </Avatar.Indicator>
        </Avatar.Root>
        <div className='text-center'>
          <div className='text-label-lg text-text-strong-950'>Arthur Taylor</div>
          <div className='mt-1 text-paragraph-sm text-text-sub-600'>
            Entrepreneur / CEO at Apex
          </div>
        </div>
      </div>
      <Divider.Root />
      <div className='flex items-center gap-4 px-5 py-4'>
        <div className='flex-1'>
          <div className='text-paragraph-xs text-text-sub-600'>Contacts</div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            Expand Your Network
          </div>
        </div>
        <div className='flex size-9 shrink-0 items-center justify-center rounded-10 bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <RiUserAddLine className='size-icon text-text-sub-600' />
        </div>
      </div>
      <Divider.Root />
      <div className='px-5 py-4'>
        <div className='text-paragraph-xs text-text-sub-600'>Premium Features</div>
        <LinkButton.Root
          variant='black'
          size='medium'
          underline
          className='mt-1 flex'
        >
          Get &quot;Profile Highlighting&quot; feature.
        </LinkButton.Root>
      </div>
      <Divider.Root />
      <div className='px-5 py-4'>
        <Button.Root variant='neutral' mode='stroke' size='small' className='w-full'>
          <Button.Icon as={RiAddLine} />
          Create a group
        </Button.Root>
      </div>
    </div>
  );
}
