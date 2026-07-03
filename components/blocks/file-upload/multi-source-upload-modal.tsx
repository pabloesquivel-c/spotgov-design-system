'use client';

import * as React from 'react';
import { RiCloseLine, RiFolder2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as FileUpload from '@/components/ui/file-upload';
import * as Modal from '@/components/ui/modal';
import * as SocialButton from '@/components/ui/social-button';
import { DropboxIcon, GoogleDriveIcon } from './cloud-provider-icons';

export function MultiSourceUploadModal() {
  const [open, setOpen] = React.useState(true);

  return (
    <Modal.Root defaultOpen open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Add People
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content
        className='max-w-[580px]'
        showClose={false}
        aria-describedby={undefined}
      >
        <Modal.Body className='p-4 pt-5'>
          <div className='flex flex-col gap-5'>
            <div className='flex items-center justify-between'>
              <Modal.Title asChild>
                <span className='text-label-md text-text-strong-950'>
                  Upload file
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
            <FileUpload.Root className='flex h-[268px] w-full flex-col items-center justify-center rounded-2xl border-stroke-sub-300 p-8 hover:bg-bg-white-0'>
              <input type='file' tabIndex={-1} className='hidden' multiple />
              <div className='pointer-events-none flex flex-col items-center gap-5 text-center'>
                <span className='text-label-md text-text-sub-600'>
                  Drop files here,{' '}
                  <a
                    href='#'
                    className='pointer-events-auto font-medium text-primary-base hover:underline'
                  >
                    browse files
                  </a>{' '}
                  or import from:
                </span>
                <div className='flex flex-wrap justify-center gap-3'>
                  <FileUpload.Button className='pointer-events-auto !h-10 gap-2 rounded-full p-1.5 pr-4 transition-all hover:bg-bg-weak-50 hover:!shadow-regular-xs hover:ring-0'>
                    <div className='flex size-7 items-center justify-center rounded-full bg-away-light'>
                      <RiFolder2Line className='size-5 text-away-dark' />
                    </div>
                    <span className='text-label-sm text-text-sub-600'>
                      My Device
                    </span>
                  </FileUpload.Button>
                  <FileUpload.Button className='pointer-events-auto !h-10 gap-2 rounded-full p-1.5 pr-4 transition-all hover:bg-bg-weak-50 hover:!shadow-regular-xs hover:ring-0'>
                    <div className='flex size-7 items-center justify-center rounded-full bg-primary-base'>
                      <SocialButton.Icon as={DropboxIcon} />
                    </div>
                    <span className='text-label-sm text-text-sub-600'>
                      Dropbox
                    </span>
                  </FileUpload.Button>
                  <FileUpload.Button className='pointer-events-auto !h-10 gap-2 rounded-full p-1.5 pr-4 transition-all hover:bg-bg-weak-50 hover:!shadow-regular-xs hover:ring-0'>
                    <div className='flex size-7 items-center justify-center rounded-full bg-bg-weak-50'>
                      <SocialButton.Icon as={GoogleDriveIcon} />
                    </div>
                    <span className='text-label-sm text-text-sub-600'>
                      Google Drive
                    </span>
                  </FileUpload.Button>
                </div>
              </div>
            </FileUpload.Root>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
