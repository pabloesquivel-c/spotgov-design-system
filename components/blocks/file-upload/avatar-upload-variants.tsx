'use client';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';

export function AvatarUploadVariants() {
  return (
    <div className='flex flex-col items-center gap-9'>
      <div className='flex gap-5'>
        <Avatar.Root size='64' />
        <div className='space-y-3'>
          <div className='space-y-1'>
            <div className='text-label-md text-text-strong-950'>Upload Image</div>
            <div className='text-paragraph-sm text-text-sub-600'>
              Min 400x400px, PNG or JPEG
            </div>
          </div>
          <div className='flex gap-3'>
            <Button.Root variant='neutral' mode='stroke' size='xsmall'>
              Upload
            </Button.Root>
          </div>
        </div>
      </div>
      <Divider.Root />
      <div className='flex gap-5'>
        <Avatar.Root size='64' color='yellow'>
          <Avatar.Image src='https://alignui.com/images/avatar/illustration/emma.png' />
        </Avatar.Root>
        <div className='space-y-3'>
          <div className='space-y-1'>
            <div className='text-label-md text-text-strong-950'>Upload Image</div>
            <div className='text-paragraph-sm text-text-sub-600'>
              Min 400x400px, PNG or JPEG
            </div>
          </div>
          <div className='flex gap-3'>
            <Button.Root variant='error' mode='stroke' size='xsmall'>
              Remove
            </Button.Root>
            <Button.Root variant='neutral' mode='stroke' size='xsmall'>
              Change
            </Button.Root>
          </div>
        </div>
      </div>
      <Divider.Root />
      <div className='flex items-center gap-5'>
        <Avatar.Root size='56' color='yellow' placeholderType='company' />
        <Button.Root variant='neutral' mode='stroke' size='xsmall'>
          Upload
        </Button.Root>
      </div>
      <Divider.Root />
      <div className='flex items-center gap-5'>
        <Avatar.Root size='56' color='yellow'>
          <Avatar.Image src='https://alignui.com/images/logo/apex.svg' />
        </Avatar.Root>
        <div className='flex gap-3'>
          <Button.Root variant='error' mode='stroke' size='xsmall'>
            Remove
          </Button.Root>
          <Button.Root variant='neutral' mode='stroke' size='xsmall'>
            Change
          </Button.Root>
        </div>
      </div>
    </div>
  );
}
