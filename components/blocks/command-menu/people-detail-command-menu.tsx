'use client';

import * as React from 'react';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as CommandMenu from '@/components/ui/command-menu';
import * as LinkButton from '@/components/ui/link-button';
import { CommandMenuGrayTags } from './command-menu-gray-tags';
import { CommandMenuKeyboardFooter } from './command-menu-keyboard-footer';
import { CommandMenuSearchHeader } from './command-menu-search-header';

const RESULT_USERS = [
  {
    name: 'Matthew Johnson',
    email: 'matthew@alignui.com',
    avatar: 'https://alignui.com/images/avatar/illustration/matthew.png',
  },
  {
    name: 'Laura Perez',
    email: 'laura@alignui.com',
    avatar: 'https://alignui.com/images/avatar/illustration/laura.png',
  },
  {
    name: 'Wei Chen',
    email: 'wei@alignui.com',
    avatar: 'https://alignui.com/images/avatar/illustration/wei.png',
  },
  {
    name: 'Lena Müller',
    email: 'lena@alignui.com',
    avatar: 'https://alignui.com/images/avatar/illustration/lena.png',
  },
  {
    name: 'Juma Omondi',
    email: 'juma@alignui.com',
    avatar: 'https://alignui.com/images/avatar/illustration/juma.png',
  },
];

export function PeopleDetailCommandMenu() {
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
          <CommandMenu.Group heading='Results (4)'>
            <LinkButton.Root
              size='small'
              variant='gray'
              className='absolute right-4 top-5'
            >
              See All
            </LinkButton.Root>
            {RESULT_USERS.map((user) => (
              <CommandMenu.Item key={user.email} size='medium'>
                <Avatar.Root size='40'>
                  <Avatar.Image src={user.avatar} />
                  <Avatar.Indicator>
                    <Avatar.Status status='online' />
                  </Avatar.Indicator>
                </Avatar.Root>
                <div className='flex flex-col justify-center gap-1'>
                  <span className='text-label-sm'>{user.name}</span>
                  <span className='text-paragraph-xs text-text-sub-600'>
                    {user.email}
                  </span>
                </div>
              </CommandMenu.Item>
            ))}
          </CommandMenu.Group>
        </CommandMenu.List>

        <CommandMenuKeyboardFooter />
      </CommandMenu.Dialog>
    </>
  );
}
