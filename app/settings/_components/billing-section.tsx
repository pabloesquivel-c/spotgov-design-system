'use client';

import { RiBankCardLine, RiDownloadLine } from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import { notification } from '@/hooks/use-notification';

import { SettingsSection } from './settings-card';
import { DemoNote } from './demo-note';
import { DEFAULT_BILLING_PLAN, DEFAULT_PAYMENT_METHOD, MOCK_INVOICES } from './mock-data';

export function BillingSection() {
  const seatsRemaining =
    DEFAULT_BILLING_PLAN.seatsTotal - DEFAULT_BILLING_PLAN.seatsUsed;

  // TODO(connect): open the plan comparison / upgrade flow (not designed yet).
  const handleChangePlan = () =>
    notification({
      status: 'information',
      title: 'Change plan',
      description: 'Plan comparison and upgrade flow isn’t designed yet.',
    });

  // TODO(connect): open the payment method entry flow (Stripe Elements or equivalent).
  const handleUpdatePaymentMethod = () =>
    notification({
      status: 'information',
      title: 'Update payment method',
      description: 'Card entry isn’t wired up in this prototype.',
    });

  // TODO(connect): GET the invoice PDF from the billing provider and download it.
  const handleDownloadInvoice = (invoiceId: string) =>
    notification({
      status: 'information',
      title: `Downloading ${invoiceId}`,
      description: 'Invoice PDFs are mocked in this preview.',
    });

  return (
    <SettingsSection
      title='Billing'
      description='Plan, payment method, and invoice history.'
    >
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-3'>
          <span className='text-label-sm text-text-strong-950'>Plan</span>
          <div className='flex items-center justify-between gap-4 rounded-xl p-4 ring-1 ring-inset ring-stroke-soft-200'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-label-sm text-text-strong-950'>
                {DEFAULT_BILLING_PLAN.name} plan
              </span>
              <span className='text-paragraph-xs text-text-sub-600'>
                {DEFAULT_BILLING_PLAN.price}
              </span>
            </div>
            <div className='flex flex-col items-end gap-0.5'>
              <span className='text-label-sm text-text-strong-950'>
                {DEFAULT_BILLING_PLAN.seatsUsed}/{DEFAULT_BILLING_PLAN.seatsTotal}{' '}
                seats used
              </span>
              <span className='text-paragraph-xs text-text-sub-600'>
                {seatsRemaining} remaining
              </span>
            </div>
          </div>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            className='w-fit'
            onClick={handleChangePlan}
          >
            Change plan
          </Button.Root>
        </div>

        <Divider.Root />

        <div className='flex flex-col gap-3'>
          <span className='text-label-sm text-text-strong-950'>
            Payment method
          </span>
          <div className='flex items-center justify-between gap-4 rounded-xl p-4 ring-1 ring-inset ring-stroke-soft-200'>
            <div className='flex items-center gap-3'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
                <RiBankCardLine className='size-5 text-text-sub-600' />
              </div>
              <div className='flex flex-col gap-0.5'>
                <span className='text-label-sm text-text-strong-950'>
                  {DEFAULT_PAYMENT_METHOD.brand} •••• {DEFAULT_PAYMENT_METHOD.last4}
                </span>
                <span className='text-paragraph-xs text-text-sub-600'>
                  Expires {DEFAULT_PAYMENT_METHOD.expiry}
                </span>
              </div>
            </div>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='xsmall'
              onClick={handleUpdatePaymentMethod}
            >
              Update
            </Button.Root>
          </div>
        </div>

        <Divider.Root />

        <div className='flex flex-col gap-3'>
          <span className='text-label-sm text-text-strong-950'>
            Invoice history
          </span>
          <ul className='flex flex-col divide-y divide-stroke-soft-200 rounded-xl ring-1 ring-inset ring-stroke-soft-200'>
            {MOCK_INVOICES.map((invoice) => (
              <li
                key={invoice.id}
                className='flex items-center gap-4 px-4 py-3'
              >
                <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
                  <span className='truncate text-label-sm text-text-strong-950'>
                    {invoice.id}
                  </span>
                  <span className='text-paragraph-xs text-text-sub-600'>
                    {invoice.date}
                  </span>
                </div>
                <span className='text-paragraph-sm text-text-strong-950'>
                  {invoice.amount}
                </span>
                <Badge.Root
                  variant='light'
                  color={invoice.status === 'paid' ? 'green' : 'orange'}
                  size='medium'
                >
                  {invoice.status === 'paid' ? 'Paid' : 'Due'}
                </Badge.Root>
                <Button.Root
                  variant='neutral'
                  mode='ghost'
                  size='xsmall'
                  onClick={() => handleDownloadInvoice(invoice.id)}
                >
                  <Button.Icon as={RiDownloadLine} />
                </Button.Root>
              </li>
            ))}
          </ul>
        </div>

        <DemoNote>
          Change plan, payment method updates, and invoice downloads are
          stubbed for this preview — nothing is actually charged or
          downloaded.
        </DemoNote>
      </div>
    </SettingsSection>
  );
}
