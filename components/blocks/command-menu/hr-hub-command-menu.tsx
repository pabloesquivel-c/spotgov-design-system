'use client';

import * as React from 'react';
import {
  RiArrowDownLine,
  RiArrowRightSLine,
  RiArrowRightUpLine,
  RiArrowUpLine,
  RiCornerDownLeftLine,
  RiSearch2Line,
} from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as CommandMenu from '@/components/ui/command-menu';
import * as CompactButton from '@/components/ui/compact-button';
import * as Kbd from '@/components/ui/kbd';
import * as LinkButton from '@/components/ui/link-button';
import { cn } from '@/utils/cn';

function VerticalDivider({ className }: { className?: string }) {
  return (
    <div className={cn('relative hidden h-full w-0 md:block', className)}>
      <div className='absolute left-0 top-0 h-full w-px bg-stroke-soft-200' />
    </div>
  );
}

function HorizontalDivider({ className }: { className?: string }) {
  return (
    <div className={cn('relative block h-0 w-full md:hidden', className)}>
      <div className='absolute left-0 top-0 h-px w-full bg-stroke-soft-200' />
    </div>
  );
}

const CATEGORIES = [
  'Onboarding',
  'Reviews',
  'Hiring',
  'Benefits',
  'Learning',
];

const TOOLS = [
  {
    title: 'Monday.com',
    icon: 'https://alignui.com/images/major-brands/monday.svg',
  },
  { title: 'Loom', icon: 'https://alignui.com/images/major-brands/loom.svg' },
  { title: 'Asana', icon: 'https://alignui.com/images/major-brands/asana.svg' },
];

const EMPLOYEES = [
  {
    name: 'James Brown',
    avatar: 'https://alignui.com/images/avatar/illustration/james.png',
  },
  {
    name: 'Sophia Williams',
    avatar: 'https://alignui.com/images/avatar/illustration/sophia.png',
  },
  {
    name: 'Laura Perez',
    avatar: 'https://alignui.com/images/avatar/illustration/laura.png',
  },
];

const TEAMS = [
  { name: 'Aurora Solutions', icon: 'https://alignui.com/images/logo/aurora.svg' },
  { name: 'Pulse Medical', icon: 'https://alignui.com/images/logo/pulse.svg' },
  { name: 'Synergy HR', icon: 'https://alignui.com/images/logo/synergy.svg' },
];

const LOCATIONS = [
  { country: 'United States', flag: 'https://alignui.com/flags/US.svg' },
  { country: 'Spain', flag: 'https://alignui.com/flags/ES.svg' },
  { country: 'Italy', flag: 'https://alignui.com/flags/IT.svg' },
];

function HubListItem({
  value,
  icon,
  label,
}: {
  value: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <CommandMenu.Item
      key={value}
      value={value}
      className={cn(
        'group/cmd-item flex items-center justify-between gap-2.5 px-2.5 py-2 outline-none',
      )}
    >
      <div className='flex items-center gap-2.5'>
        {icon}
        <span className='text-label-sm text-text-sub-600'>{label}</span>
      </div>
      <CompactButton.Root
        variant='white'
        size='medium'
        className={cn(
          'opacity-0 transition-opacity duration-200 ease-out',
          'group-hover/cmd-item:opacity-100',
          'group-data-[highlighted=true]/cmd-item:opacity-100',
          'group-data-[selected=true]/cmd-item:opacity-100',
        )}
      >
        <CompactButton.Icon as={RiArrowRightSLine} />
      </CompactButton.Root>
    </CommandMenu.Item>
  );
}

function HubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className='flex-1 p-2.5'>
      <div className='flex items-center justify-between px-2.5 py-2'>
        <span className='text-label-sm text-text-soft-400'>{title}</span>
        <RiArrowRightUpLine className='size-icon-inline text-text-soft-400' />
      </div>
      <CommandMenu.Group className='p-0'>{children}</CommandMenu.Group>
    </div>
  );
}

export function HrHubCommandMenu() {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Button.Root variant='neutral' mode='stroke' onClick={() => setOpen(true)}>
        Open Command Menu
      </Button.Root>
      <CommandMenu.Dialog
        open={open}
        onOpenChange={setOpen}
        className='relative flex h-auto max-h-[640px] w-full max-w-[632px] origin-top flex-col overflow-hidden rounded-20 bg-bg-white-0 !shadow-regular-md'
      >
        <div className='group/cmd-input flex h-14 items-center gap-3 border-b border-stroke-soft-200 px-5'>
          <RiSearch2Line
            className={cn(
              'size-icon shrink-0 text-text-soft-400',
              'transition duration-200 ease-out',
              'group-focus-within/cmd-input:text-primary-base',
            )}
          />
          <CommandMenu.Input placeholder='Search HR tools or press...' />
          <Kbd.Root>⌘K</Kbd.Root>
        </div>

        <div className='flex flex-col gap-2 px-5 py-4'>
          <div className='text-label-sm text-text-soft-400'>Recent</div>
          <div className='flex flex-wrap gap-2'>
            {CATEGORIES.map((category) => (
              <Button.Root
                key={category}
                variant='neutral'
                mode='lighter'
                size='xxsmall'
              >
                {category}
              </Button.Root>
            ))}
          </div>
        </div>

        <CommandMenu.List>
          <div className='flex flex-col md:h-[164px] md:flex-row'>
            <HubSection title='Tools & Apps'>
              {TOOLS.map((tool) => (
                <HubListItem
                  key={tool.title}
                  value={tool.title}
                  label={tool.title}
                  icon={
                    <Avatar.Root size='20'>
                      <Avatar.Image
                        src={tool.icon}
                        alt={tool.title}
                        className='bg-bg-white-0'
                      />
                    </Avatar.Root>
                  }
                />
              ))}
            </HubSection>
            <VerticalDivider />
            <HorizontalDivider />
            <HubSection title='Employees'>
              {EMPLOYEES.map((employee) => (
                <HubListItem
                  key={employee.name}
                  value={employee.name}
                  label={employee.name}
                  icon={
                    <Avatar.Root size='20'>
                      <Avatar.Image src={employee.avatar} />
                      <Avatar.Indicator>
                        <Avatar.Status status='online' />
                      </Avatar.Indicator>
                    </Avatar.Root>
                  }
                />
              ))}
            </HubSection>
          </div>
          <div className='flex flex-col md:h-[164px] md:flex-row'>
            <HubSection title='Teams'>
              {TEAMS.map((team) => (
                <HubListItem
                  key={team.name}
                  value={team.name}
                  label={team.name}
                  icon={
                    <Avatar.Root size='20'>
                      <Avatar.Image src={team.icon} />
                    </Avatar.Root>
                  }
                />
              ))}
            </HubSection>
            <VerticalDivider />
            <HorizontalDivider />
            <HubSection title='Locations'>
              {LOCATIONS.map((location) => (
                <HubListItem
                  key={location.country}
                  value={location.country}
                  label={location.country}
                  icon={
                    <Avatar.Root size='20'>
                      <Avatar.Image
                        src={location.flag}
                        alt={`${location.country} flag`}
                        className='bg-bg-white-0'
                      />
                    </Avatar.Root>
                  }
                />
              ))}
            </HubSection>
          </div>
        </CommandMenu.List>

        <CommandMenu.Footer className='border-t border-stroke-soft-200 px-5 py-4'>
          <div className='hidden gap-3 md:flex'>
            <div className='flex items-center gap-2'>
              <CommandMenu.FooterKeyBox className='ring-0'>
                <RiArrowUpLine className='size-icon-inline text-text-soft-400' />
              </CommandMenu.FooterKeyBox>
              <CommandMenu.FooterKeyBox className='ring-0'>
                <RiArrowDownLine className='size-icon-inline text-text-soft-400' />
              </CommandMenu.FooterKeyBox>
              <span className='text-label-sm text-text-soft-400'>Navigate</span>
            </div>
            <div className='flex items-center gap-2'>
              <CommandMenu.FooterKeyBox className='ring-0'>
                <RiCornerDownLeftLine className='size-icon-inline text-text-soft-400' />
              </CommandMenu.FooterKeyBox>
              <span className='text-label-sm text-text-soft-400'>Select</span>
            </div>
          </div>
          <div className='flex w-full items-center gap-1.5 text-right md:w-auto'>
            <span className='text-label-sm text-text-soft-400'>Any problem?</span>
            <LinkButton.Root size='small' variant='gray' underline>
              Contact
            </LinkButton.Root>
          </div>
        </CommandMenu.Footer>
      </CommandMenu.Dialog>
    </>
  );
}
