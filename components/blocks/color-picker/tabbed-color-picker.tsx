'use client';

import * as React from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { parseColor } from 'react-aria-components';

import * as Divider from '@/components/ui/divider';
import { ColorPickerEditor } from './color-picker-editor';

export function TabbedColorPicker() {
  const [color, setColor] = React.useState(parseColor('#EE2121'));
  const [activeTab, setActiveTab] = React.useState('image');

  return (
    <div className='max-w-[314px] rounded-20 bg-bg-white-0 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200'>
      <Tabs.Root defaultValue='image' onValueChange={setActiveTab}>
        <Tabs.List className='relative flex gap-3 border-b border-stroke-soft-200 px-4'>
          <div
            className='absolute -bottom-px h-px bg-primary-base transition-all duration-200 ease-in-out'
            style={{
              left:
                activeTab === 'image'
                  ? '16px'
                  : activeTab === 'solid'
                    ? 'calc(33.33% + 12px)'
                    : 'calc(66.66% + 12px)',
              width:
                activeTab === 'image'
                  ? 'calc(33.33% - 28px)'
                  : activeTab === 'solid'
                    ? 'calc(33.33% - 24px)'
                    : 'calc(33.33% - 28px)',
            }}
          />

          <Tabs.Trigger
            value='image'
            className='relative flex-1 py-3 text-label-sm text-text-soft-400 transition-colors duration-200 data-[state=active]:text-text-strong-950'
          >
            Image
          </Tabs.Trigger>
          <div className='flex items-center'>
            <Divider.Root className='h-4 border-l border-stroke-soft-200' />
          </div>
          <Tabs.Trigger
            value='solid'
            className='relative flex-1 py-3 text-label-sm text-text-soft-400 transition-colors duration-200 data-[state=active]:text-text-strong-950'
          >
            Solid
          </Tabs.Trigger>
          <div className='flex items-center'>
            <Divider.Root className='h-4 border-l border-stroke-soft-200' />
          </div>
          <Tabs.Trigger
            value='gradient'
            className='relative flex-1 py-3 text-label-sm text-text-soft-400 transition-colors duration-200 data-[state=active]:text-text-strong-950'
          >
            Gradient
          </Tabs.Trigger>
        </Tabs.List>

        <div className='flex-1'>
          <Tabs.Content value='image'>
            <ColorPickerEditor color={color} setColor={setColor} />
          </Tabs.Content>

          <Tabs.Content value='solid'>
            <ColorPickerEditor color={color} setColor={setColor} />
          </Tabs.Content>

          <Tabs.Content value='gradient'>
            <ColorPickerEditor color={color} setColor={setColor} />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}
