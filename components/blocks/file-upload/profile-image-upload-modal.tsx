'use client';

import * as React from 'react';
import { RiCloseLine, RiUploadCloud2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Divider from '@/components/ui/divider';
import * as FileUpload from '@/components/ui/file-upload';
import * as Modal from '@/components/ui/modal';

export function ProfileImageUploadModal() {
  const [open, setOpen] = React.useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal.Root defaultOpen open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Add Profile Image
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content
        className='max-w-[400px]'
        showClose={false}
        aria-describedby={undefined}
      >
        <Modal.Body className='p-5'>
          <div className='flex flex-col gap-6'>
            <div className='flex items-center justify-between'>
              <Modal.Title asChild>
                <span className='text-label-md text-text-sub-600'>
                  Add Profile Image
                </span>
              </Modal.Title>
              <CompactButton.Root
                tabIndex={-1}
                variant='ghost'
                onClick={() => setOpen(false)}
              >
                <CompactButton.Icon as={RiCloseLine} />
              </CompactButton.Root>
            </div>
            <div className='flex justify-center'>
              <FileUpload.Root className='flex h-[200px] w-[200px] flex-col items-center justify-center rounded-full border-stroke-sub-300 p-8 hover:bg-bg-white-0'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  tabIndex={-1}
                  className='hidden'
                />
                <div className='pointer-events-none flex flex-col items-center gap-4 text-center'>
                  <FileUpload.Icon
                    as={RiUploadCloud2Line}
                    className='text-text-soft-400'
                  />
                  <span className='text-label-sm text-text-soft-400'>
                    Drag and drop your images here
                  </span>
                </div>
              </FileUpload.Root>
            </div>
            <Divider.Root variant='line-text'>OR</Divider.Root>
            <Button.Root
              variant='neutral'
              mode='lighter'
              onClick={handleUploadClick}
            >
              Upload a photo
            </Button.Root>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='flex w-full justify-between gap-3'>
            <Button.Root
              variant='neutral'
              mode='stroke'
              className='flex-1'
              size='small'
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button.Root>
            <Button.Root variant='neutral' className='flex-1' size='small'>
              Apply Changes
            </Button.Root>
          </div>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
