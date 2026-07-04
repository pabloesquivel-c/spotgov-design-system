'use client';

import * as React from 'react';
import {
  RiArrowRightSLine,
  RiFileHistoryLine,
  RiGiftLine,
  RiKey2Line,
  RiLockLine,
  RiPassportLine,
  RiQuestionAnswerLine,
  RiRefreshLine,
  RiSearch2Line,
  RiShieldLine,
} from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';
import * as Input from '@/components/ui/input';
import * as Kbd from '@/components/ui/kbd';
import { DashedDivider } from './dashed-divider';
import { drawerPanelClassName } from './drawer-panel';

const SELF_SERVICE_ITEMS: {
  icon: RemixiconComponentType;
  bg: string;
  color: string;
  title: string;
  desc: string;
}[] = [
  {
    icon: RiLockLine,
    bg: 'bg-success-lighter',
    color: 'text-success-dark',
    title: 'Reset Password',
    desc: 'Reset your online banking password.',
  },
  {
    icon: RiShieldLine,
    bg: 'bg-away-lighter',
    color: 'text-away-dark',
    title: 'Account Security',
    desc: 'Update authentication settings.',
  },
  {
    icon: RiKey2Line,
    bg: 'bg-feature-lighter',
    color: 'text-feature-dark',
    title: 'Recover Account',
    desc: 'Regain access to online banking.',
  },
  {
    icon: RiPassportLine,
    bg: 'bg-information-lighter',
    color: 'text-information-dark',
    title: 'PIN Services',
    desc: 'Change ATM or card PIN.',
  },
];

export function SupportDrawer() {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Open Support
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content className={drawerPanelClassName}>
        <Drawer.Header className='items-start justify-start pb-4'>
          <Drawer.Title className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <span className='text-label-lg text-text-strong-950'>
                Internet Banking Support
              </span>
              <span className='text-paragraph-sm text-text-sub-600'>
                Contact Support (24/7)
              </span>
            </div>
          </Drawer.Title>
        </Drawer.Header>

        <div className='px-5 pb-5'>
          <Input.Root size='small'>
            <Input.Wrapper>
              <Input.Icon as={RiSearch2Line} />
              <Input.Input placeholder='Search...' />
              <Kbd.Root className='text-label-xs text-text-soft-400'>
                <span>⌘1</span>
              </Kbd.Root>
            </Input.Wrapper>
          </Input.Root>
        </div>

        <Drawer.Body>
          <Divider.Root variant='solid-text'>
            UNABLE TO ACCESS WALLET
          </Divider.Root>
          <div className='flex flex-col gap-4 p-5'>
            <div className='flex items-center gap-2'>
              <CompactButton.Root
                asChild
                fullRadius
                variant='ghost'
                className='size-[22px] bg-faded-lighter text-label-sm text-faded-base'
              >
                <div className='select-none'>1</div>
              </CompactButton.Root>
              <span className='text-label-sm text-text-strong-950'>
                Two-Factor Authentication Issues
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <CompactButton.Root
                asChild
                fullRadius
                variant='ghost'
                className='size-[22px] bg-faded-lighter text-label-sm text-faded-base'
              >
                <div className='select-none'>2</div>
              </CompactButton.Root>
              <span className='text-label-sm text-text-strong-950'>
                Incorrect Login Information
              </span>
            </div>
            <Button.Root variant='neutral' mode='stroke' className='w-full' size='xsmall'>
              How to resolve?
            </Button.Root>
          </div>

          <Divider.Root variant='solid-text'>
            You might be looking for
          </Divider.Root>
          <div className='flex flex-col gap-5 p-5'>
            <div className='flex items-center gap-2.5'>
              <RiFileHistoryLine className='size-5 text-text-soft-400' />
              <span className='text-label-sm text-text-strong-950'>
                Generate monthly statement?
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <RiRefreshLine className='size-5 text-text-soft-400' />
              <span className='text-label-sm text-text-strong-950'>
                Want to automate your bill payments?
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <RiGiftLine className='size-5 text-text-soft-400' />
              <span className='truncate text-label-sm text-text-strong-950'>
                Looking to earn rewards with premium banking?
              </span>
            </div>
          </div>

          <Divider.Root variant='solid-text'>Self Service</Divider.Root>
          <div className='flex flex-col gap-2 p-3'>
            {SELF_SERVICE_ITEMS.map((item, index) => {
              const Icon = item.icon;

              return (
                <React.Fragment key={item.title}>
                  <div className='cursor-pointer space-y-1 p-2'>
                    <div className='flex items-center gap-3'>
                      <div
                        className={`flex size-9 items-center justify-center rounded-full ${item.bg}`}
                      >
                        <Icon className={`size-5 ${item.color}`} />
                      </div>
                      <div className='flex flex-1 flex-col gap-1'>
                        <div className='text-label-sm text-text-strong-950'>
                          {item.title}
                        </div>
                        <div className='text-paragraph-xs text-text-sub-600'>
                          {item.desc}
                        </div>
                      </div>
                      <RiArrowRightSLine className='size-5 text-text-soft-400' />
                    </div>
                  </div>
                  {index < SELF_SERVICE_ITEMS.length - 1 && <DashedDivider />}
                </React.Fragment>
              );
            })}
          </div>
        </Drawer.Body>

        <Drawer.Footer className='flex justify-between gap-4 border-t border-stroke-soft-200'>
          <div className='flex flex-1 items-center gap-2'>
            <div className='flex items-center gap-1.5'>
              <RiQuestionAnswerLine className='size-5 text-text-soft-400' />
              <span className='text-label-sm text-text-sub-600'>Support</span>
              <span className='text-label-sm text-text-soft-400'>(8)</span>
            </div>
          </div>
          <Button.Root
            variant='neutral'
            size='small'
            className='flex-1 bg-text-strong-950 text-text-white-0 hover:bg-text-strong-950/90'
          >
            View Support Hours
          </Button.Root>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer.Root>
  );
}
