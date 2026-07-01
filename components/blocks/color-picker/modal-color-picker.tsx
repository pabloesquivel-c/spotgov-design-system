'use client';

import * as React from 'react';

import * as Button from '@/components/ui/button';
import * as LinkButton from '@/components/ui/link-button';
import * as Modal from '@/components/ui/modal';
import {
  ColorPalette,
  GRAYSCALE_COLORS,
  THEME_COLORS,
} from './color-palette';

export function ModalColorPicker() {
  const [selectedHex, setSelectedHex] = React.useState('#5C5C5C');
  const [open, setOpen] = React.useState(true);

  const handleColorSelect = (colorHex: string) => {
    setSelectedHex(colorHex);
  };

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Open Color Picker
        </Button.Root>
      </Modal.Trigger>

      <Modal.Content className='max-w-[282px] shadow-regular-md' showClose>
        <Modal.Header title='Color picker'>
          <div className='flex w-full items-center justify-between'>
            <span className='text-label-sm text-text-strong-950'>
              Color picker
            </span>
          </div>
        </Modal.Header>

        <Modal.Body className='flex flex-col gap-4 p-4'>
          <div className='flex items-center justify-between'>
            <span className='text-label-sm text-text-sub-600'>Theme colors</span>
            <LinkButton.Root variant='primary'>Edit</LinkButton.Root>
          </div>

          <div className='space-y-2.5'>
            <ColorPalette
              colors={GRAYSCALE_COLORS}
              selectedHex={selectedHex}
              onColorSelect={handleColorSelect}
              variant='check'
            />

            <ColorPalette
              colors={THEME_COLORS}
              selectedHex={selectedHex}
              onColorSelect={handleColorSelect}
              variant='check'
            />
          </div>

          <div className='text-label-xs text-text-soft-400'>
            #{selectedHex.replace('#', '').toUpperCase()}
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
