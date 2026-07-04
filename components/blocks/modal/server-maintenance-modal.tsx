'use client';

import * as React from 'react';
import { RiAlertLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';

export function ServerMaintenanceModal() {
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
          <div className='flex flex-col items-center gap-4'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-10 bg-warning-lighter'>
              <RiAlertLine className='size-6 text-warning-base' />
            </div>
            <div>
              <Modal.Title className='text-center text-label-md text-text-strong-950'>
                Server Maintenance
              </Modal.Title>
              <Modal.Description className='mt-1 text-center text-paragraph-sm text-text-sub-600'>
                Our servers will go undergo maintenance on May 20, 2023, from
                10:00 PM to 2:00 AM UTC.
              </Modal.Description>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='flex items-center gap-2'>
            <Checkbox.Root id='server-maintenance-dismiss' />
            <Label.Root
              className='text-paragraph-sm'
              htmlFor='server-maintenance-dismiss'
            >
              Don&apos;t show it again
            </Label.Root>
          </div>
          <Button.Root variant='neutral' size='small'>
            Learn More
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
