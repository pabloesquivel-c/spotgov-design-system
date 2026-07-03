'use client';

import * as React from 'react';
import { RiErrorWarningLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Modal from '@/components/ui/modal';

export type DestructiveConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel: string;
  onConfirm: () => void;
  loading?: boolean;
};

export function DestructiveConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  cancelLabel = 'Cancel',
  confirmLabel,
  onConfirm,
  loading = false,
}: DestructiveConfirmModalProps) {
  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content showClose={false} className='max-w-[440px]'>
        <Modal.Body>
          <div className='flex items-start gap-4'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-error-lighter'>
              <RiErrorWarningLine className='size-6 text-error-base' />
            </div>
            <div>
              <Modal.Title className='text-label-md text-text-strong-950'>
                {title}
              </Modal.Title>
              <Modal.Description className='mt-1 text-paragraph-sm text-text-sub-600'>
                {description}
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
              disabled={loading}
            >
              {cancelLabel}
            </Button.Root>
          </Modal.Close>
          <Button.Root
            variant='error'
            size='small'
            className='w-full'
            disabled={loading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}

export function DeleteSavedSearchModal() {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Button.Root variant='neutral' mode='stroke' onClick={() => setOpen(true)}>
        Open confirmation
      </Button.Root>
      <DestructiveConfirmModal
        open={open}
        onOpenChange={setOpen}
        title='Delete "EU infrastructure alerts"?'
        description="This can't be undone. You will stop receiving daily emails for this search."
        confirmLabel='Delete search'
        onConfirm={() => setOpen(false)}
      />
    </>
  );
}
