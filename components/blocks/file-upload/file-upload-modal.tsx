'use client';

import * as React from 'react';
import {
  RiCheckboxCircleLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiLinksLine,
  RiLoader2Line,
  RiUploadCloud2Line,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Divider from '@/components/ui/divider';
import * as FileFormatIcon from '@/components/ui/file-format-icon';
import * as FileUpload from '@/components/ui/file-upload';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as ProgressBar from '@/components/ui/progress-bar';

export function FileUploadModal() {
  const [open, setOpen] = React.useState(true);

  return (
    <Modal.Root defaultOpen open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Upload Files
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content className='max-w-[440px]'>
        <Modal.Header
          icon={RiUploadCloud2Line}
          title='Upload files'
          description='Select and upload the files of your choice'
        />
        <Modal.Body>
          <div className='space-y-4'>
            <FileUpload.Root>
              <input multiple type='file' tabIndex={-1} className='hidden' />
              <FileUpload.Icon as={RiUploadCloud2Line} />
              <div className='space-y-1.5'>
                <div className='text-label-sm text-text-strong-950'>
                  Choose a file or drag & drop it here
                </div>
                <div className='text-paragraph-xs text-text-sub-600'>
                  JPEG, PNG, PDF, and MP4 formats, up to 50 MB.
                </div>
              </div>
              <FileUpload.Button>Browse File</FileUpload.Button>
            </FileUpload.Root>
            <div className='space-y-4'>
              <div className='flex w-full flex-col gap-4 rounded-20 border border-stroke-soft-200 p-4 pl-3.5'>
                <div className='flex gap-3'>
                  <FileFormatIcon.Root format='PDF' color='red' />
                  <div className='flex-1 space-y-1'>
                    <div className='text-label-sm text-text-strong-950'>
                      my-cv.pdf
                    </div>
                    <div className='flex items-center gap-1'>
                      <span className='text-paragraph-xs text-text-sub-600'>
                        0 KB of 120 KB
                      </span>
                      <span className='text-paragraph-xs text-text-sub-600'>
                        ∙
                      </span>
                      <RiLoader2Line className='size-icon-inline shrink-0 animate-spin text-primary-base' />
                      <span className='text-paragraph-xs text-text-strong-950'>
                        Uploading...
                      </span>
                    </div>
                  </div>
                  <CompactButton.Root
                    variant='ghost'
                    size='medium'
                    tabIndex={-1}
                  >
                    <CompactButton.Icon as={RiCloseLine} />
                  </CompactButton.Root>
                </div>
                <ProgressBar.Root value={40} />
              </div>
              <div className='flex items-start gap-3 rounded-20 border border-stroke-soft-200 p-4 pl-3.5'>
                <FileFormatIcon.Root format='PDF' color='red' />
                <div className='flex-1 space-y-1'>
                  <div className='text-label-sm text-text-strong-950'>
                    google-certificate.pdf
                  </div>
                  <div className='flex items-center gap-1'>
                    <span className='text-paragraph-xs text-text-sub-600'>
                      94 KB of 94 KB
                    </span>
                    <span className='text-paragraph-xs text-text-sub-600'>
                      ∙
                    </span>
                    <RiCheckboxCircleLine className='size-icon-inline shrink-0 text-success-base' />
                    <span className='text-paragraph-xs text-text-strong-950'>
                      Completed
                    </span>
                  </div>
                </div>
                <CompactButton.Root
                  variant='ghost'
                  size='medium'
                  tabIndex={-1}
                >
                  <CompactButton.Icon as={RiDeleteBinLine} />
                </CompactButton.Root>
              </div>
            </div>
          </div>
          <Divider.Root variant='line-text' className='my-6'>
            OR
          </Divider.Root>
          <div className='flex flex-col gap-1'>
            <Label.Root
              htmlFor='file-upload-url'
              className='text-label-sm text-text-strong-950'
            >
              Import from URL Link
            </Label.Root>
            <Input.Root className='w-full'>
              <Input.Wrapper>
                <Input.Icon as={RiLinksLine} />
                <Input.Input
                  id='file-upload-url'
                  placeholder='Paste file URL'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
