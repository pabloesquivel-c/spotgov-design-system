'use client';

import * as React from 'react';
import { RiMagicLine, RiSettings2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Modal from '@/components/ui/modal';
import * as Slider from '@/components/ui/slider';

export function WeeklyPromotionsSlider() {
  const [open, setOpen] = React.useState(true);
  const [promotionCount, setPromotionCount] = React.useState(480);

  return (
    <Modal.Root defaultOpen open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Open Weekly Promotions
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content className='max-w-[480px]'>
        <Modal.Header
          icon={RiSettings2Line}
          title='Weekly Promotion Preferences'
          description='Set your preferred level of weekly promotion notifications.'
        />
        <Modal.Body className='flex flex-col gap-5 pt-6'>
          <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-col gap-1 text-center'>
              <div className='text-label-xs text-text-sub-600'>
                WEEKLY PROMOTIONS
              </div>
              <span className='text-title-h6 text-text-strong-950'>
                {promotionCount}
              </span>
            </div>
            <div className='w-full'>
              <Slider.Root
                defaultValue={[480]}
                max={1000}
                step={1}
                onValueChange={([value = 480]) => setPromotionCount(value)}
              >
                <Slider.Thumb />
              </Slider.Root>
            </div>
            <div className='flex w-full items-center gap-2 rounded-sg-lg bg-faded-lighter p-2'>
              <RiMagicLine className='size-icon-inline shrink-0 text-faded-base' />
              <p className='text-paragraph-xs text-text-strong-950'>
                You are charged $122.50 to receive {promotionCount} weekly
                promotions.
              </p>
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
            Continue
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
