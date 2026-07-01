'use client';

import * as React from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import {
  RiArrowRightSLine,
  RiGlobalLine,
  RiMailLine,
  RiMap2Line,
  RiSearch2Line,
  RiSuitcaseLine,
} from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as CommandMenu from '@/components/ui/command-menu';
import * as CompactButton from '@/components/ui/compact-button';
import * as Kbd from '@/components/ui/kbd';
import { CommandMenuScrollbar } from './command-menu-scrollbar';
import { cn } from '@/utils/cn';

type UserProfile = {
  name: string;
  avatar: string;
  color: 'gray' | 'yellow' | 'blue' | 'sky' | 'purple' | 'red';
  role: string;
  location: string;
  specialty: string;
  email: string;
  languages: string;
};

const USERS: UserProfile[] = [
  {
    name: 'James Brown',
    avatar: 'https://alignui.com/images/avatar/memoji/james.png',
    color: 'gray',
    role: 'Product Designer',
    location: 'London, UK',
    specialty: 'UI/UX, Product Design, Prototyping',
    email: 'james@alignui.com',
    languages: 'English, French',
  },
  {
    name: 'Sophia Williams',
    avatar: 'https://alignui.com/images/avatar/memoji/sophia.png',
    color: 'yellow',
    role: 'Marketing Manager',
    location: 'Berlin, Germany',
    specialty: 'Marketing, SEO, Team Leader',
    email: 'sophia@alignui.com',
    languages: 'English, German, Spanish',
  },
  {
    name: 'Arthur Taylor',
    avatar: 'https://alignui.com/images/avatar/memoji/arthur.png',
    color: 'blue',
    role: 'Frontend Developer',
    location: 'Paris, France',
    specialty: 'React, TypeScript, UI Development',
    email: 'arthur@alignui.com',
    languages: 'English, French',
  },
  {
    name: 'Emma Wright',
    avatar: 'https://alignui.com/images/avatar/memoji/emma.png',
    color: 'sky',
    role: 'Content Strategist',
    location: 'New York, USA',
    specialty: 'Content Writing, SEO, Social Media',
    email: 'emma@alignui.com',
    languages: 'English, Spanish',
  },
  {
    name: 'Matthew Johnson',
    avatar: 'https://alignui.com/images/avatar/memoji/matthew.png',
    color: 'purple',
    role: 'Backend Developer',
    location: 'Amsterdam, Netherlands',
    specialty: 'Node.js, Python, Database Design',
    email: 'matthew@alignui.com',
    languages: 'English, Dutch',
  },
  {
    name: 'Laura Perez',
    avatar: 'https://alignui.com/images/avatar/memoji/laura.png',
    color: 'red',
    role: 'UX Researcher',
    location: 'Barcelona, Spain',
    specialty: 'User Research, Analytics, A/B Testing',
    email: 'laura@alignui.com',
    languages: 'English, Spanish, Catalan',
  },
];

const USER_DETAIL_ITEMS = [
  { icon: RiMap2Line, label: 'Location', key: 'location' as const },
  { icon: RiSuitcaseLine, label: 'Specialty', key: 'specialty' as const },
  { icon: RiMailLine, label: 'Email Address', key: 'email' as const },
  { icon: RiGlobalLine, label: 'Languages', key: 'languages' as const },
];

export function UserProfileCommandMenu() {
  const [open, setOpen] = React.useState(true);
  const [activeUser, setActiveUser] = React.useState('Sophia Williams');

  const selectedUser = USERS.find((user) => user.name === activeUser);

  return (
    <>
      <Button.Root variant='neutral' mode='stroke' onClick={() => setOpen(true)}>
        Open Command Menu
      </Button.Root>
      <CommandMenu.Dialog open={open} onOpenChange={setOpen} className='max-w-[700px]'>
        <div className='flex flex-col overflow-hidden rounded-20 bg-bg-white-0 shadow-regular-md md:h-[440px]'>
          <div className='group/cmd-input flex h-14 w-full items-center gap-2 border-b border-stroke-soft-200 px-5'>
            <RiSearch2Line
              className={cn(
                'size-icon shrink-0 text-text-soft-400',
                'transition duration-200 ease-out',
                'group-focus-within/cmd-input:text-primary-base',
              )}
            />
            <CommandMenu.Input
              className='h-full w-full flex-1 bg-transparent outline-none placeholder:text-text-soft-400'
              placeholder='Search HR tools or press...'
            />
            <Kbd.Root className='hidden items-center justify-center text-text-soft-400 md:flex'>
              ⌘K
            </Kbd.Root>
          </div>

          <div className='flex flex-1 flex-col overflow-auto'>
            <div className='flex flex-1 flex-col md:flex-row'>
              <div className='w-full border-b border-stroke-soft-200 md:w-60 md:border-b-0 md:border-r'>
                <ScrollArea.Root className='w-full md:h-full' type='scroll'>
                  <ScrollArea.Viewport className='w-full'>
                    <div className='flex gap-1 overflow-x-auto p-2.5 md:flex-col'>
                      {USERS.map((user) => (
                        <button
                          key={user.name}
                          type='button'
                          onClick={() => setActiveUser(user.name)}
                          className={cn(
                            'group/cmd-item relative flex w-[200px] flex-shrink-0 cursor-pointer items-center justify-between gap-2.5 rounded-lg px-2.5 py-2 transition-all duration-200 ease-out md:w-auto',
                            activeUser === user.name
                              ? 'bg-bg-weak-50'
                              : 'hover:bg-bg-weak-50',
                          )}
                        >
                          <div className='flex items-center gap-2.5'>
                            <Avatar.Root size='20' color={user.color}>
                              <Avatar.Image src={user.avatar} alt={user.name} />
                              <Avatar.Indicator>
                                <Avatar.Status status='online' />
                              </Avatar.Indicator>
                            </Avatar.Root>
                            <span className='text-label-sm text-text-sub-600'>
                              {user.name}
                            </span>
                          </div>
                          <CompactButton.Root
                            variant='white'
                            size='medium'
                            className='opacity-0 transition-opacity duration-200 ease-out group-hover/cmd-item:opacity-100'
                            tabIndex={-1}
                          >
                            <CompactButton.Icon as={RiArrowRightSLine} />
                          </CompactButton.Root>
                        </button>
                      ))}
                    </div>
                  </ScrollArea.Viewport>
                  <CommandMenuScrollbar className='hidden md:flex' />
                </ScrollArea.Root>
              </div>

              <div className='flex w-full flex-1 flex-col'>
                {selectedUser && (
                  <div>
                    <div className='flex items-center justify-between border-b border-stroke-soft-200 p-5'>
                      <div className='flex items-center gap-4'>
                        <Avatar.Root size='48' color={selectedUser.color}>
                          <Avatar.Image
                            src={selectedUser.avatar}
                            alt={selectedUser.name}
                          />
                          <Avatar.Indicator>
                            <Avatar.Status status='online' />
                          </Avatar.Indicator>
                        </Avatar.Root>
                        <div className='flex flex-col'>
                          <span className='text-label-md text-text-strong-950'>
                            {selectedUser.name}
                          </span>
                          <span className='text-paragraph-sm text-text-sub-600'>
                            {selectedUser.role}
                          </span>
                        </div>
                      </div>
                      <Button.Root variant='primary' mode='lighter' size='xsmall'>
                        Message
                      </Button.Root>
                    </div>
                    <div className='flex flex-col gap-5 p-5'>
                      {USER_DETAIL_ITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                          <div key={item.key} className='flex items-center gap-3'>
                            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
                              <Icon className='size-icon text-text-sub-600' />
                            </div>
                            <div className='flex flex-col gap-1'>
                              <span className='text-label-sm text-text-soft-400'>
                                {item.label}
                              </span>
                              <span className='text-label-sm text-text-sub-600'>
                                {selectedUser[item.key]}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CommandMenu.Dialog>
    </>
  );
}
