'use client';

import {
  RiFolderSettingsLine,
  RiLogoutBoxRLine,
  RiSettings2Line,
  RiUserSettingsLine,
} from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Dropdown from '@/components/ui/dropdown';
import { VerifiedAvatarBadge } from './verified-avatar-badge';

export function AccountStorageDropdown() {
  return (
    <Dropdown.Root defaultOpen>
      <Dropdown.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke' size='small'>
          Open
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <div className='flex items-center gap-3 p-2'>
          <Avatar.Root size='40'>
            <Avatar.Image src='https://alignui.com/images/avatar/illustration/james.png' />
            <Avatar.Indicator position='top'>
              <VerifiedAvatarBadge />
            </Avatar.Indicator>
          </Avatar.Root>
          <div className='flex-1'>
            <div className='text-label-sm text-text-strong-950'>James Brown</div>
            <div className='mt-1 text-paragraph-xs text-text-sub-600'>
              james@alignui.com
            </div>
          </div>
          <Badge.Root variant='light' color='green' size='medium'>
            PRO
          </Badge.Root>
        </div>
        <Divider.Root variant='line-spacing' />
        <div className='flex items-center gap-3 p-2'>
          <div className='flex-1'>
            <div className='text-label-sm text-text-strong-950'>
              Account Storage
            </div>
            <div className='mt-1 text-paragraph-xs text-text-sub-600'>
              Your account has 2GB storage
            </div>
          </div>
          <Button.Root variant='primary' mode='lighter' size='xsmall'>
            Manage
          </Button.Root>
        </div>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiSettings2Line} />
            Settings
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiUserSettingsLine} />
            Manage Account
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiFolderSettingsLine} />
            Automations
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon
              as='img'
              src='https://alignui.com/images/major-brands/dropbox-circle.svg'
              alt=''
            />
            Install Dropbox App
          </Dropdown.Item>
        </Dropdown.Group>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
            Logout
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
