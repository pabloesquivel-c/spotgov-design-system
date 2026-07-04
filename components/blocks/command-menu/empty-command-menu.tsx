'use client';

import * as React from 'react';
import { RiSearch2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as CommandMenu from '@/components/ui/command-menu';
import * as Kbd from '@/components/ui/kbd';
import { CommandMenuShortcutFooter } from './command-menu-shortcut-footer';

function CommandMenuEmptyIllustration() {
  return (
    <svg
      width={96}
      height={96}
      viewBox='0 0 96 96'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      aria-hidden
    >
      <circle cx={48} cy={48.5} r={45} className='fill-bg-weak-50' />
      <path
        d='M58.97 72.19l2.759-4.055 13.53 8.969a2.41 2.41 0 01.663 3.374 2.495 2.495 0 01-3.431.674l-13.52-8.963z'
        className='fill-bg-sub-300 stroke-stroke-sub-300'
      />
      <path
        d='M64.144 58.469c1.366 9.568-5.282 18.434-14.85 19.803-9.566 1.368-18.43-5.278-19.795-14.846-1.366-9.568 5.282-18.434 14.85-19.803 9.566-1.368 18.43 5.278 19.795 14.846z'
        className='fill-bg-sub-300 stroke-stroke-sub-300'
      />
      <path
        d='M58.16 59.59c.897 6.288-3.472 12.114-9.76 13.014-6.286.9-12.11-3.469-13.008-9.756-.898-6.288 3.471-12.114 9.758-13.013 6.287-.9 12.111 3.468 13.01 9.756z'
        className='fill-bg-white-0 stroke-stroke-sub-300'
      />
      <path
        d='M45.906 63.9v-.068c.007-.73.075-1.312.204-1.744.13-.432.313-.782.55-1.05.239-.267.525-.514.858-.74.2-.137.38-.3.54-.487a2.293 2.293 0 00.52-1.486c.001-.375-.077-.7-.234-.975a1.658 1.658 0 00-.627-.637 1.732 1.732 0 00-.873-.224c-.278 0-.547.066-.806.196-.258.13-.474.334-.648.613-.173.28-.273.645-.3 1.096h-1.286c.027-.65.177-1.207.449-1.67a2.826 2.826 0 011.086-1.06 3.112 3.112 0 011.505-.368c.6 0 1.12.134 1.562.402.445.268.789.635 1.03 1.101.245.467.368.998.368 1.595 0 .42-.058.801-.174 1.141-.112.34-.275.645-.49.912a3.48 3.48 0 01-.765.712c-.3.21-.539.432-.72.665-.18.23-.31.503-.392.82a5.16 5.16 0 00-.133 1.188v.069h-1.224zm.653 3.396a.838.838 0 01-.648-.304 1.059 1.059 0 01-.27-.728c0-.283.09-.526.27-.729a.838.838 0 01.648-.304c.252 0 .468.102.648.304.18.203.27.446.27.729 0 .187-.042.36-.127.516a1.022 1.022 0 01-.332.379.802.802 0 01-.46.137z'
        className='fill-text-sub-600'
      />
    </svg>
  );
}

export function EmptyCommandMenu() {
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <Button.Root variant='neutral' mode='stroke' onClick={() => setOpen(true)}>
        Open Command Menu
      </Button.Root>
      <CommandMenu.Dialog
        open={open}
        onOpenChange={setOpen}
        className='h-auto w-full max-w-screen-sm'
      >
        <div className='flex min-w-0 flex-col rounded-2xl bg-bg-white-0 shadow-regular-md'>
          <div className='group/cmd-input flex h-14 min-w-0 items-center gap-2 border-b border-stroke-soft-200 px-5'>
            <RiSearch2Line className='size-5 shrink-0 text-text-soft-400 transition duration-200 ease-out group-focus-within/cmd-input:text-primary-base' />
            <CommandMenu.Input
              className='min-w-0 flex-1'
              placeholder='Search meetings, people, or type a command...'
            />
            <Kbd.Root className='hidden items-center justify-center text-text-soft-400 md:flex'>
              ⌘K
            </Kbd.Root>
          </div>

          <div className='flex flex-col items-center justify-center gap-5 p-12'>
            <CommandMenuEmptyIllustration />
            <div className='flex flex-col items-center justify-center gap-1'>
              <h3 className='text-label-md text-text-sub-600'>
                Nothing to see here yet
              </h3>
              <p className='text-paragraph-sm text-text-soft-400'>
                Get started by searching for meetings, people or type
              </p>
            </div>
          </div>

          <CommandMenuShortcutFooter />
        </div>
      </CommandMenu.Dialog>
    </>
  );
}
