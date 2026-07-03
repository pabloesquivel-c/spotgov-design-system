'use client';

import { RiFlagLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Label from '@/components/ui/label';
import * as Radio from '@/components/ui/radio';
import { radioPanelClassName } from './radio-panel';

const REPORT_REASONS = [
  {
    id: 'report-spam',
    value: 'spam',
    title: 'Spam',
    desc: 'Unsolicited or irrelevant content.',
  },
  {
    id: 'report-harassment',
    value: 'harassment',
    title: 'Harrassment',
    desc: 'Persistent, unwanted, or offensive behavior.',
  },
  {
    id: 'report-rules',
    value: 'rules',
    title: 'Violation of Rules',
    desc: 'Infringement of community guidelines or terms.',
  },
];

export function ReportMessageRadio() {
  return (
    <div className={radioPanelClassName}>
      <div className='flex items-center gap-3.5 px-5 py-4'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
          <RiFlagLine className='size-5 text-text-sub-600' />
        </div>
        <div>
          <div className='text-label-sm text-text-strong-950'>Report Message</div>
          <div className='mt-1 text-paragraph-xs text-text-sub-600'>
            Select the reason for reporting the message.
          </div>
        </div>
      </div>
      <Divider.Root />
      <Radio.Group defaultValue='spam' className='flex flex-col gap-5 p-5'>
        {REPORT_REASONS.map((reason) => (
          <div key={reason.id} className='flex items-start gap-2'>
            <Radio.Item id={reason.id} value={reason.value} />
            <Label.Root htmlFor={reason.id} className='cursor-pointer'>
              <div className='text-label-sm text-text-strong-950'>
                {reason.title}
              </div>
              <div className='mt-1 text-paragraph-xs text-text-sub-600'>
                {reason.desc}
              </div>
            </Label.Root>
          </div>
        ))}
      </Radio.Group>
      <Divider.Root />
      <div className='grid grid-cols-2 gap-3 px-5 py-4'>
        <Button.Root variant='neutral' mode='stroke' size='small'>
          Cancel
        </Button.Root>
        <Button.Root size='small'>Submit</Button.Root>
      </div>
    </div>
  );
}
