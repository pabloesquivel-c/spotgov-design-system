'use client';

import * as React from 'react';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as CommandMenu from '@/components/ui/command-menu';
import * as LinkButton from '@/components/ui/link-button';
import { CommandMenuGrayTags } from './command-menu-gray-tags';
import { CommandMenuKeyboardFooter } from './command-menu-keyboard-footer';
import { CommandMenuSearchHeader } from './command-menu-search-header';

const HISTORY_USERS = [
  {
    name: 'James Brown',
    handle: '@james',
    avatar: 'https://alignui.com/images/avatar/illustration/james.png',
  },
  {
    name: 'Sophia Williams',
    handle: '@sophia',
    avatar: 'https://alignui.com/images/avatar/illustration/sophia.png',
  },
];

const RESULT_USERS = [
  {
    name: 'Matthew Johnson',
    handle: '@matthew',
    avatar: 'https://alignui.com/images/avatar/illustration/matthew.png',
  },
  {
    name: 'Laura Perez',
    handle: '@laura',
    avatar: 'https://alignui.com/images/avatar/illustration/laura.png',
  },
  {
    name: 'Wei Chen',
    handle: '@wei',
    avatar: 'https://alignui.com/images/avatar/illustration/wei.png',
  },
  {
    name: 'Lena Müller',
    handle: '@lena',
    avatar: 'https://alignui.com/images/avatar/illustration/lena.png',
  },
  {
    name: 'Juma Omondi',
    handle: '@juma',
    avatar: 'https://alignui.com/images/avatar/illustration/juma.png',
  },
];

function UserListItem({
  name,
  handle,
  avatar,
}: {
  name: string;
  handle: string;
  avatar: string;
}) {
  return (
    <CommandMenu.Item>
      <Avatar.Root size='20'>
        <Avatar.Image src={avatar} />
        <Avatar.Indicator>
          <Avatar.Status status='online' />
        </Avatar.Indicator>
      </Avatar.Root>
      <div className='flex items-center gap-1'>
        {name}
        <span className='text-paragraph-xs text-text-sub-600'>{handle}</span>
      </div>
    </CommandMenu.Item>
  );
}

export function PeopleSearchCommandMenu() {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Button.Root
        variant='neutral'
        mode='stroke'
        onClick={() => setOpen(true)}
      >
        Open Command Menu
      </Button.Root>
      <CommandMenu.Dialog open={open} onOpenChange={setOpen}>
        <CommandMenuSearchHeader onClose={() => setOpen(false)} />
        <CommandMenuGrayTags />

        <CommandMenu.List>
          <CommandMenu.Group heading='History'>
            <LinkButton.Root
              size='small'
              variant='gray'
              className='absolute right-4 top-5'
            >
              See All
            </LinkButton.Root>
            {HISTORY_USERS.map((user) => (
              <UserListItem key={user.handle} {...user} />
            ))}
          </CommandMenu.Group>
          <CommandMenu.Group heading='Results (4)'>
            <LinkButton.Root
              size='small'
              variant='gray'
              className='absolute right-4 top-5'
            >
              See All
            </LinkButton.Root>
            {RESULT_USERS.map((user) => (
              <UserListItem key={user.handle} {...user} />
            ))}
          </CommandMenu.Group>
        </CommandMenu.List>

        <CommandMenuKeyboardFooter />
      </CommandMenu.Dialog>
    </>
  );
}
