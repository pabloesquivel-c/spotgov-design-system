'use client';

import {
  RiCheckboxCircleLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiErrorWarningLine,
  RiLoader2Line,
} from '@remixicon/react';

import * as CompactButton from '@/components/ui/compact-button';
import * as FileFormatIcon from '@/components/ui/file-format-icon';
import * as LinkButton from '@/components/ui/link-button';
import * as ProgressBar from '@/components/ui/progress-bar';

const cardClassName =
  'w-full rounded-2xl bg-bg-white-0 p-4 pl-3.5 ring-1 ring-inset ring-stroke-soft-200';

export function FileUploadStatusCards() {
  return (
    <div className='flex w-full max-w-[400px] flex-col gap-6'>
      <div className={`flex flex-col gap-4 ${cardClassName}`}>
        <div className='flex gap-3'>
          <FileFormatIcon.Root format='PDF' color='red' />
          <div className='flex-1 space-y-1'>
            <div className='text-label-sm text-text-strong-950'>my-cv.pdf</div>
            <div className='flex items-center gap-1'>
              <span className='text-paragraph-xs text-text-sub-600'>
                0 KB of 120 KB
              </span>
              <span className='text-paragraph-xs text-text-sub-600'>∙</span>
              <RiLoader2Line className='size-4 shrink-0 animate-spin text-primary-base' />
              <span className='text-paragraph-xs text-text-strong-950'>
                Uploading...
              </span>
            </div>
          </div>
          <CompactButton.Root variant='ghost' size='large'>
            <CompactButton.Icon as={RiCloseLine} />
          </CompactButton.Root>
        </div>
        <ProgressBar.Root value={10} />
      </div>

      <div className={cardClassName}>
        <div className='flex gap-3'>
          <FileFormatIcon.Root format='PDF' color='red' />
          <div className='flex-1 space-y-1'>
            <div className='text-label-sm text-text-strong-950'>my-cv.pdf</div>
            <div className='flex items-center gap-1'>
              <span className='text-paragraph-xs text-text-sub-600'>
                0 KB of 120 KB
              </span>
              <span className='text-paragraph-xs text-text-sub-600'>∙</span>
              <RiCheckboxCircleLine className='size-4 shrink-0 text-success-base' />
              <span className='text-paragraph-xs text-text-strong-950'>
                Completed
              </span>
            </div>
          </div>
          <CompactButton.Root variant='ghost' size='large'>
            <CompactButton.Icon as={RiDeleteBinLine} />
          </CompactButton.Root>
        </div>
      </div>

      <div className='w-full rounded-2xl bg-bg-white-0 p-4 pl-3.5 ring-1 ring-inset ring-error-base'>
        <div className='flex gap-3'>
          <FileFormatIcon.Root format='PDF' color='red' />
          <div className='flex flex-1 flex-col items-start gap-2'>
            <div className='space-y-1'>
              <div className='text-label-sm text-text-strong-950'>my-cv.pdf</div>
              <div className='flex items-center gap-1'>
                <span className='text-paragraph-xs text-text-sub-600'>
                  0 KB of 120 KB
                </span>
                <span className='text-paragraph-xs text-text-sub-600'>∙</span>
                <RiErrorWarningLine className='size-4 shrink-0 text-error-base' />
                <span className='text-paragraph-xs text-text-strong-950'>
                  Failed
                </span>
              </div>
            </div>
            <LinkButton.Root variant='error' size='medium' underline>
              Try Again
            </LinkButton.Root>
          </div>
          <CompactButton.Root
            variant='modifiable'
            size='large'
            className='text-error-base'
          >
            <CompactButton.Icon as={RiDeleteBinLine} />
          </CompactButton.Root>
        </div>
      </div>
    </div>
  );
}
