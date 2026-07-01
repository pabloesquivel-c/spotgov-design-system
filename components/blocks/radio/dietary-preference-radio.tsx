'use client';

import { RiRestaurant2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as Label from '@/components/ui/label';
import * as Radio from '@/components/ui/radio';
import { radioPanelClassName } from './radio-panel';

const DIETARY_OPTIONS = [
  { id: 'dietary-vegetarian', value: 'vegetarian', label: 'Vegetarian' },
  { id: 'dietary-non-vegetarian', value: 'non-vegetarian', label: 'Non-vegetarian' },
  {
    id: 'dietary-vegan',
    value: 'vegan',
    label: 'Vegan',
    sub: '(Gluten-free)',
  },
];

export function DietaryPreferenceRadio() {
  return (
    <div className={radioPanelClassName}>
      <div className='flex items-center gap-3 px-5 py-4'>
        <RiRestaurant2Line className='size-icon-emphasis text-text-sub-600' />
        <div className='text-label-sm text-text-strong-950'>
          Choose your dietary preference
        </div>
      </div>
      <Divider.Root />
      <Radio.Group defaultValue='vegetarian' className='flex flex-col gap-3 p-5'>
        {DIETARY_OPTIONS.map((option) => (
          <div key={option.id} className='flex items-center gap-2'>
            <Radio.Item id={option.id} value={option.value} />
            <Label.Root
              htmlFor={option.id}
              className='flex cursor-pointer items-center gap-1 text-paragraph-sm text-text-strong-950'
            >
              {option.label}
              {option.sub && (
                <span className='text-paragraph-xs text-text-sub-600'>
                  {option.sub}
                </span>
              )}
            </Label.Root>
          </div>
        ))}
      </Radio.Group>
      <Divider.Root />
      <div className='flex items-center justify-between px-5 py-4'>
        <div className='flex items-center gap-2'>
          <Checkbox.Root id='dietary-set-default' />
          <Label.Root
            htmlFor='dietary-set-default'
            className='cursor-pointer text-paragraph-sm text-text-strong-950'
          >
            Set as default
          </Label.Root>
        </div>
        <Button.Root size='small'>Save Changes</Button.Root>
      </div>
    </div>
  );
}
