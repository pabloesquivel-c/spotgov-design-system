'use client';

import {
  RiFileLine,
  RiLayoutGridLine,
  RiLogoutBoxRLine,
  RiQuestionAnswerLine,
  RiSettings2Line,
  RiUserSettingsLine,
} from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Dropdown from '@/components/ui/dropdown';
import { VerifiedAvatarBadge } from './verified-avatar-badge';

export function AccountPlanDropdown() {
  return (
    <Dropdown.Root defaultOpen>
      <Dropdown.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke' size='small'>
          Open
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <div className='flex items-center gap-3 p-2'>
          <Avatar.Root size='40' color='sky'>
            <Avatar.Image src='https://alignui.com/images/avatar/illustration/emma.png' />
            <Avatar.Indicator position='top'>
              <VerifiedAvatarBadge />
            </Avatar.Indicator>
          </Avatar.Root>
          <div className='flex-1'>
            <div className='text-label-sm text-text-strong-950'>Emma Wright</div>
            <div className='mt-1 text-paragraph-xs text-text-sub-600'>
              emma@alignui.com
            </div>
          </div>
          <Badge.Root variant='light' color='red' size='medium'>
            PRO
          </Badge.Root>
        </div>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiUserSettingsLine} />
            Account Settings
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiLayoutGridLine} />
            Integrations
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiSettings2Line} />
            Settings
          </Dropdown.Item>
        </Dropdown.Group>
        <Divider.Root variant='text'>SUPPORT</Divider.Root>
        <Dropdown.Group>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiFileLine} />
            Guide
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiQuestionAnswerLine} />
            Help Center
          </Dropdown.Item>
        </Dropdown.Group>
        <Divider.Root variant='line-spacing' />
        <div className='flex items-center gap-3 p-2'>
          <div className='flex-1'>
            <div className='text-label-sm text-text-strong-950'>Free Plan</div>
            <div className='mt-1 text-paragraph-xs text-text-sub-600'>
              12,000 views
            </div>
          </div>
          <Button.Root variant='primary' mode='lighter' size='xsmall'>
            Upgrade
          </Button.Root>
        </div>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Item>
          <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
          Logout
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
