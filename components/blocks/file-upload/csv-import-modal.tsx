'use client';

import * as React from 'react';
import {
  RiArrowLeftSLine,
  RiCloseLine,
  RiDownloadCloud2Line,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as FileFormatIcon from '@/components/ui/file-format-icon';
import * as FileUpload from '@/components/ui/file-upload';
import * as Modal from '@/components/ui/modal';

export function CsvImportModal() {
  const [open, setOpen] = React.useState(true);

  return (
    <Modal.Root defaultOpen open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Add People
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content
        className='max-w-[400px]'
        showClose={false}
        aria-describedby={undefined}
      >
        <Modal.Body className='flex flex-col items-center gap-5 p-5'>
          <div className='flex w-full items-center justify-between gap-5'>
            <CompactButton.Root fullRadius tabIndex={-1}>
              <CompactButton.Icon as={RiArrowLeftSLine} />
            </CompactButton.Root>
            <Modal.Title asChild>
              <span className='flex-1 text-center text-label-md text-text-strong-950'>
                Add People
              </span>
            </Modal.Title>
            <CompactButton.Root fullRadius tabIndex={-1}>
              <CompactButton.Icon as={RiCloseLine} />
            </CompactButton.Root>
          </div>
          <FileUpload.Root className='w-full bg-bg-weak-50'>
            <input accept='.csv' type='file' tabIndex={-1} className='hidden' />
            <FileFormatIcon.Root format='CSV' className='size-8' />
            <div className='flex flex-col gap-1'>
              <span className='text-label-sm text-text-sub-600'>
                Import CSV File
              </span>
              <span className='text-label-sm text-text-soft-400'>
                Drop file or click here to choose file.
              </span>
            </div>
          </FileUpload.Root>
          <div className='flex w-full flex-col gap-4'>
            <div className='flex items-center gap-2'>
              <RiDownloadCloud2Line className='size-5 text-text-soft-400' />
              <a href='#' className='text-label-sm text-text-soft-400'>
                Download CSV Template
              </a>
            </div>
            <Button.Root
              variant='neutral'
              mode='filled'
              className='w-full'
              size='small'
            >
              Preview
            </Button.Root>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
