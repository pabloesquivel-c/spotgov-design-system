'use client';

import { RiFileCopyLine, RiLinksLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import { cn } from '@/utils/cn';

function MeetingLinkInput() {
  return (
    <div className='w-full'>
      <Input.Root>
        <Input.Wrapper>
          <Input.Icon as={RiLinksLine} />
          <Input.Input value='https://meet.example.com/abc-def-ghi' readOnly />
        </Input.Wrapper>
        <button
          type='button'
          className={cn(
            'inline-flex h-10 items-center justify-center gap-3 rounded-none bg-transparent px-3.5 text-label-sm text-text-sub-600 outline-none ring-1 ring-inset ring-transparent transition duration-200 ease-out',
            'hover:bg-bg-weak-50 hover:text-text-strong-950',
            'focus-visible:bg-bg-weak-50 focus-visible:text-text-strong-950 focus-visible:ring-transparent',
          )}
        >
          <RiFileCopyLine className='-mx-1 size-icon shrink-0' />
        </button>
      </Input.Root>
    </div>
  );
}

export function MeetingLinkCheckbox() {
  return (
    <div className='flex w-full max-w-[428px] flex-col gap-5 rounded-20 bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
      <div>
        <div className='text-label-md text-text-strong-950'>
          Generate meeting link
        </div>
        <div className='mt-1 text-label-sm text-text-sub-600'>
          Link is one-time only, copy before closing.
        </div>
      </div>

      <div>
        <MeetingLinkInput />
        <div className='mt-3 flex items-center gap-2'>
          <Checkbox.Root id='meeting-saved' defaultChecked />
          <Label.Root className='text-paragraph-sm' htmlFor='meeting-saved'>
            I have saved the meeting link.
          </Label.Root>
        </div>
      </div>

      <div className='grid grid-cols-2 gap-3'>
        <Button.Root variant='neutral' mode='stroke' size='small'>
          Create new link
        </Button.Root>
        <Button.Root variant='neutral' mode='filled' size='small'>
          Complete
        </Button.Root>
      </div>
    </div>
  );
}
