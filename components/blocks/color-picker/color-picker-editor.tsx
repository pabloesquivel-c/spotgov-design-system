'use client';

import { RiAddLine, RiDeleteBinLine } from '@remixicon/react';
import { Input as AriaInput, type Color } from 'react-aria-components';

import * as Button from '@/components/ui/button';
import * as ColorPicker from '@/components/ui/color-picker';
import * as Input from '@/components/ui/input';

export function ColorPickerEditor({
  color,
  setColor,
}: {
  color: Color;
  setColor: (color: Color) => void;
}) {
  return (
    <ColorPicker.Root value={color} onChange={setColor}>
      <div className='border-b border-stroke-soft-200 p-4'>
        <div className='relative h-[160px] w-full overflow-hidden rounded-lg'>
          <ColorPicker.Area
            colorSpace='hsb'
            xChannel='saturation'
            yChannel='brightness'
            className='h-[148px] w-full'
          >
            <ColorPicker.Thumb className='h-4 w-4 rounded-full border-2 border-white ring-0' />
          </ColorPicker.Area>
        </div>

        <ColorPicker.Slider
          colorSpace='hsl'
          channel='hue'
          className='mt-4 h-4 !p-0'
        >
          <ColorPicker.SliderTrack className='h-full rounded-full'>
            <div className='absolute inset-x-2 h-full'>
              <ColorPicker.Thumb className='top-1/2 h-3 w-3 -translate-y-1/2 rounded-full !bg-bg-white-0 ring-0' />
            </div>
          </ColorPicker.SliderTrack>
        </ColorPicker.Slider>

        <div className='mt-4 flex items-center gap-2.5'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='xsmall'
            className='w-8'
          >
            <RiDeleteBinLine className='size-5 shrink-0' />
          </Button.Root>

          <div className='flex flex-1 -space-x-px'>
            <Input.Root
              size='small'
              className='flex-[2] rounded-r-none focus-within:z-10 hover:[&:not(:focus-within)]:before:!ring-stroke-soft-200'
              asChild
            >
              <ColorPicker.Field colorSpace='hsb'>
                <Input.Wrapper>
                  <div className='flex items-center gap-2'>
                    <div
                      className='h-3 w-3 shrink-0 rounded-full ring-0'
                      style={{ backgroundColor: color.toString('hex') }}
                    />
                    <Input.Input asChild className='h-5'>
                      <AriaInput className='items-start justify-start text-label-sm text-text-sub-600' />
                    </Input.Input>
                  </div>
                </Input.Wrapper>
              </ColorPicker.Field>
            </Input.Root>

            <Input.Root
              size='xsmall'
              className='flex-1 rounded-l-none focus-within:z-10 hover:[&:not(:focus-within)]:before:!ring-stroke-soft-200'
              asChild
            >
              <ColorPicker.Field channel='alpha'>
                <Input.Wrapper>
                  <Input.Input asChild>
                    <AriaInput aria-label='Alpha' />
                  </Input.Input>
                </Input.Wrapper>
              </ColorPicker.Field>
            </Input.Root>
          </div>
        </div>
      </div>

      <button
        type='button'
        className='flex w-full items-center justify-center gap-2 px-4 py-3.5 text-center'
      >
        <RiAddLine className='size-5 shrink-0 text-text-soft-400' />
        <span className='text-label-sm text-text-sub-600'>Add new color</span>
      </button>
    </ColorPicker.Root>
  );
}
