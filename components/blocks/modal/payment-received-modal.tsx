'use client';

import * as React from 'react';
import { RiCheckboxCircleLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Modal from '@/components/ui/modal';

export function PaymentReceivedModal() {
  const [open, setOpen] = React.useState(true);

  return (
    <Modal.Root defaultOpen open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Open Modal
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content showClose={false} className='max-w-[440px]'>
        <Modal.Body>
          <div className='flex items-start gap-4'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-success-lighter'>
              <RiCheckboxCircleLine className='size-icon-emphasis text-success-base' />
            </div>
            <div>
              <Modal.Title className='text-label-md text-text-strong-950'>
                Payment Received
              </Modal.Title>
              <Modal.Description className='mt-1 text-paragraph-sm text-text-sub-600'>
                Your payment has been successfully received. You have unlocked
                premium services now.
              </Modal.Description>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              className='w-full'
            >
              Cancel
            </Button.Root>
          </Modal.Close>
          <Button.Root size='small' className='w-full'>
            View Receipt
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
