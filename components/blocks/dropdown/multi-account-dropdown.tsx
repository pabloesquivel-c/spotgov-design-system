'use client';

import {
  RiAddLine,
  RiLayoutGridLine,
  RiLogoutBoxRLine,
  RiUserSettingsLine,
} from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Dropdown from '@/components/ui/dropdown';

export function MultiAccountDropdown() {
  return (
    <Dropdown.Root defaultOpen>
      <Dropdown.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke' size='small'>
          Open
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <div className='flex items-center gap-3 p-2'>
          <Avatar.Root color='purple' size='40' />
          <div>
            <div className='text-label-sm text-text-strong-950'>Ravi Patel</div>
            <div className='mt-1 text-paragraph-xs text-text-sub-600'>
              ravi@alignui.com
            </div>
          </div>
        </div>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiUserSettingsLine} />
            Manage Account
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiLayoutGridLine} />
            Switch Account
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
            Logout
          </Dropdown.Item>
        </Dropdown.Group>
        <div className='p-2'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='xsmall'
            className='w-full'
          >
            <Button.Icon as={RiAddLine} />
            Add New Account
          </Button.Root>
        </div>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
