'use client';

import * as LabelPrimitives from '@radix-ui/react-label';
import { RiUser6Line } from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import * as Radio from '@/components/ui/radio';

const cardClassName =
  'group/card flex cursor-pointer items-start gap-3.5 rounded-2xl bg-bg-white-0 p-4 ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out hover:bg-bg-weak-50 hover:ring-transparent has-[[data-state=checked]]:ring-primary-base';

export function SelectableRadioCards() {
  return (
    <Radio.Group
      className='flex w-full max-w-[360px] flex-col gap-6'
      defaultValue='selectable-radio-c1'
    >
      <LabelPrimitives.Root className={cardClassName}>
        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-1'>
            <div className='text-label-sm text-text-strong-950'>Label</div>
            <div className='text-paragraph-xs text-text-sub-600'>(Sublabel)</div>
            <Badge.Root variant='light' size='small' color='blue'>
              NEW
            </Badge.Root>
          </div>
          <p className='text-paragraph-xs text-text-sub-600'>
            Insert the checkbox description here.
          </p>
        </div>
        <Radio.Item id='selectable-radio-c1' value='selectable-radio-c1' />
      </LabelPrimitives.Root>

      <LabelPrimitives.Root className={cardClassName}>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
          <RiUser6Line className='size-5 text-text-sub-600' />
        </div>
        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-1'>
            <div className='text-label-sm text-text-strong-950'>Label</div>
            <div className='text-paragraph-xs text-text-sub-600'>(Sublabel)</div>
            <Badge.Root variant='light' size='small' color='blue'>
              NEW
            </Badge.Root>
          </div>
          <p className='text-paragraph-xs text-text-sub-600'>
            Insert the checkbox description here.
          </p>
        </div>
        <Radio.Item id='selectable-radio-c2' value='selectable-radio-c2' />
      </LabelPrimitives.Root>

      <LabelPrimitives.Root className={cardClassName}>
        <img
          src='https://alignui.com/images/major-brands/spotify.svg'
          alt='Spotify'
          className='size-10 shrink-0 rounded-full'
        />
        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-1'>
            <div className='text-label-sm text-text-strong-950'>Label</div>
            <div className='text-paragraph-xs text-text-sub-600'>(Sublabel)</div>
            <Badge.Root variant='light' size='small' color='blue'>
              NEW
            </Badge.Root>
          </div>
          <p className='text-paragraph-xs text-text-sub-600'>
            Insert the checkbox description here.
          </p>
        </div>
        <Radio.Item id='selectable-radio-c3' value='selectable-radio-c3' />
      </LabelPrimitives.Root>

      <LabelPrimitives.Root
        aria-disabled
        className={`${cardClassName} has-[[disabled]]:pointer-events-none`}
      >
        <Avatar.Root size='40'>
          <Avatar.Image src='https://alignui.com/images/avatar/photo/james.jpg' />
        </Avatar.Root>
        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-1'>
            <div className='text-label-sm text-text-strong-950 group-has-[[disabled]]/card:text-text-sub-600'>
              Label
            </div>
            <div className='text-paragraph-xs text-text-sub-600 group-has-[[disabled]]/card:text-text-soft-400'>
              (Sublabel)
            </div>
            <Badge.Root variant='light' size='small' color='blue' disabled>
              NEW
            </Badge.Root>
          </div>
          <p className='text-paragraph-xs text-text-sub-600 group-has-[[disabled]]/card:text-text-soft-400'>
            Insert the checkbox description here.
          </p>
        </div>
        <Radio.Item id='selectable-radio-c4' value='selectable-radio-c4' disabled />
      </LabelPrimitives.Root>
    </Radio.Group>
  );
}
