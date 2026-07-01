'use client';

import * as React from 'react';
import { type Color, parseColor } from 'react-aria-components';

import * as ColorPicker from '@/components/ui/color-picker';
import * as Popover from '@/components/ui/popover';
import { BLUE_COLORS } from './color-palette';

export function SwatchPopoverColorPicker() {
  const [colors, setColors] = React.useState(
    BLUE_COLORS.map((color) => parseColor(color)),
  );
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);

  const handleColorSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const handleColorChange = (newColor: Color, index: number) => {
    setColors((prev) => {
      const next = [...prev];
      next[index] = newColor;
      return next;
    });
  };

  return (
    <div className='flex flex-col gap-2'>
      {colors.map((color, index) => (
        <Popover.Root key={index}>
          <Popover.Trigger asChild>
            <button
              type='button'
              className='relative size-[36px] overflow-visible rounded-lg focus:outline-none'
              onClick={() => handleColorSelect(index)}
            >
              <div
                className='absolute inset-[6px] rounded-lg'
                style={{ backgroundColor: color.toString('hex') }}
              />
              {selectedIndex === index && (
                <div className='absolute inset-0 rounded-sg-lg border-[3px] border-primary-alpha-16' />
              )}
            </button>
          </Popover.Trigger>
          <Popover.Content
            align='start'
            side='right'
            sideOffset={8}
            className='w-[314px] overflow-hidden rounded-l-10 rounded-r-20 bg-bg-white-0 p-2.5 shadow-regular-md'
          >
            <div className='flex items-center gap-2.5'>
              <div
                className='h-4 w-4 shrink-0 rounded-full'
                style={{ backgroundColor: color.toString('hex') }}
              />

              <ColorPicker.Root
                value={color}
                onChange={(newColor) => handleColorChange(newColor, index)}
              >
                <ColorPicker.Slider
                  colorSpace='hsl'
                  channel='hue'
                  className='h-4 w-full !p-0'
                >
                  <ColorPicker.SliderTrack className='h-full rounded-full'>
                    <div className='absolute inset-x-2 h-full'>
                      <ColorPicker.Thumb className='top-1/2 h-3 w-3 -translate-y-1/2 rounded-full !bg-bg-white-0 ring-0' />
                    </div>
                  </ColorPicker.SliderTrack>
                </ColorPicker.Slider>
              </ColorPicker.Root>
            </div>
          </Popover.Content>
        </Popover.Root>
      ))}
    </div>
  );
}
