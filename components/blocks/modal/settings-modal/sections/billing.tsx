'use client';

import {
  RiArrowDownSLine,
  RiCheckLine,
  RiMore2Line,
  RiSearchLine,
  RiStackLine,
  RiTimeLine,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import { notification } from '@/hooks/use-notification';

type InvoiceStatus = 'Pending' | 'Paid' | 'Upcoming';

const invoices: { date: string; amount: string; status: InvoiceStatus }[] = [
  { date: 'April 15, 2024', amount: '$49', status: 'Pending' },
  { date: 'May 15, 2024', amount: '$49', status: 'Paid' },
  { date: 'June 15, 2024', amount: '$49', status: 'Paid' },
  { date: 'July 15, 2024', amount: '$49', status: 'Paid' },
  { date: 'August 15, 2024', amount: '$49', status: 'Upcoming' },
];

const planDetails = [
  { label: 'Active seats', value: '3/10 seats' },
  { label: 'Plan renewal', value: 'June 20, 2025' },
  { label: 'Status', value: 'Active' },
];

const statusStyles: Record<
  InvoiceStatus,
  {
    icon: typeof RiTimeLine;
    iconClassName: string;
  }
> = {
  Pending: {
    icon: RiTimeLine,
    iconClassName: 'bg-warning-base text-static-white',
  },
  Paid: {
    icon: RiCheckLine,
    iconClassName: 'bg-success-base text-static-white',
  },
  Upcoming: {
    icon: RiTimeLine,
    iconClassName: 'bg-away-base text-static-white',
  },
};

export function BillingModalSection() {
  return (
    <div className='flex flex-col gap-9'>
      <section className='flex flex-col gap-4'>
        <div className='flex flex-col gap-5'>
          <div className='flex items-center gap-3'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
              <RiStackLine
                className='size-5 text-text-strong-950'
                aria-hidden='true'
              />
            </div>

            <div className='flex min-w-0 flex-1 flex-col gap-1'>
              <p className='truncate text-label-sm text-text-strong-950'>
                Professional plan
              </p>
              <p className='truncate text-label-xs text-text-sub-600'>
                Team plan for up to 10 members
              </p>
            </div>

            <div className='flex shrink-0 items-center gap-1 pr-3'>
              <span className='text-label-md text-text-strong-950'>$49</span>
              <span className='text-label-sm text-text-sub-600'>/ month</span>
            </div>

            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              onClick={() =>
                notification({
                  status: 'information',
                  title: 'Plan management',
                })
              }
            >
              Manage
            </Button.Root>
          </div>

          <Divider.Root />

          <div className='flex flex-col gap-3.5'>
            {planDetails.map((detail) => (
              <div
                key={detail.label}
                className='flex items-center gap-3 text-label-sm'
              >
                <p className='w-[200px] shrink-0 text-text-sub-600'>
                  {detail.label}
                </p>
                <p className='min-w-0 flex-1 text-text-strong-950'>
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Divider.Root />

      <section className='flex flex-col gap-4'>
        <div className='flex w-[300px] max-w-full flex-col gap-1'>
          <h3 className='text-label-sm text-text-strong-950'>
            Billing history
          </h3>
          <p className='text-label-sm text-text-sub-600'>
            Invoices and payment history.
          </p>
        </div>

        <div className='flex items-start gap-3'>
          <Input.Root size='small' className='flex-1'>
            <Input.Wrapper>
              <Input.Icon as={RiSearchLine} />
              <Input.Input
                aria-label='Search invoices and payments'
                placeholder='Search invoices and payments'
                readOnly
              />
            </Input.Wrapper>
          </Input.Root>

          <button
            type='button'
            className='flex h-9 shrink-0 items-center gap-1 rounded-10 bg-bg-white-0 pl-3 pr-2 text-label-sm text-text-sub-600 shadow-regular-xs outline-none ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out hover:bg-bg-weak-50 hover:text-text-strong-950 hover:shadow-none hover:ring-transparent focus-visible:text-text-strong-950 focus-visible:shadow-button-important-focus focus-visible:ring-stroke-strong-950'
            onClick={() =>
              notification({ status: 'information', title: 'Status filter' })
            }
          >
            All status
            <RiArrowDownSLine className='size-5' aria-hidden='true' />
          </button>
        </div>

        <Divider.Root />

        <ul className='flex flex-col gap-5'>
          {invoices.map((invoice) => (
            <li key={invoice.date} className='flex items-center gap-2.5'>
              <p className='w-[200px] shrink-0 text-label-sm text-text-sub-600'>
                {invoice.date}
              </p>
              <p className='w-[136px] shrink-0 text-label-sm text-text-sub-600'>
                {invoice.amount}
              </p>
              <div className='min-w-0 flex-1'>
                <BillingStatus status={invoice.status} />
              </div>
              <Button.Root
                variant='neutral'
                mode='ghost'
                size='xxsmall'
                aria-label={`${invoice.date} invoice actions`}
                className='-mr-1'
                onClick={() =>
                  notification({
                    status: 'information',
                    title: `${invoice.date} invoice`,
                  })
                }
              >
                <Button.Icon as={RiMore2Line} />
              </Button.Root>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function BillingStatus({ status }: { status: InvoiceStatus }) {
  const styles = statusStyles[status];
  const Icon = styles.icon;

  return (
    <span className='inline-flex h-6 items-center justify-center gap-1 rounded-lg bg-bg-white-0 pl-1 pr-2 text-label-xs text-text-sub-600 ring-1 ring-inset ring-stroke-soft-200'>
      <span
        className={`flex size-4 items-center justify-center rounded-full ${styles.iconClassName}`}
      >
        <Icon className='size-3' aria-hidden='true' />
      </span>
      {status}
    </span>
  );
}
