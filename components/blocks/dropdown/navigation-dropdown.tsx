'use client';

import {
  RiChatSmileLine,
  RiFileLine,
  RiLayout5Line,
  RiLayoutGridLine,
  RiLogoutBoxRLine,
  RiQuestionAnswerLine,
  RiSettings2Line,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Dropdown from '@/components/ui/dropdown';

export function NavigationDropdown() {
  return (
    <Dropdown.Root defaultOpen>
      <Dropdown.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke' size='small'>
          Open
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Group>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiLayout5Line} />
            Dashboard
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiChatSmileLine} />
            Messages
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiSettings2Line} />
            Settings
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiLayoutGridLine} />
            Integrations
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
