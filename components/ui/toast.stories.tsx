'use client';

import type { Meta, StoryObj } from '@storybook/react';

import * as AlertToast from './toast-alert';
import { toast, Toaster } from './toast';

const meta = { title: 'UI/Toast', component: Toaster } satisfies Meta<
  typeof Toaster
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <>
      <button
        type='button'
        className='rounded-xl bg-primary-base px-3.5 py-2 text-label-sm text-static-white'
        onClick={() =>
          toast.custom((t) => (
            <AlertToast.Root
              t={t}
              status='success'
              message='Saved search updated.'
            />
          ))
        }
      >
        Show toast
      </button>
      <Toaster />
    </>
  ),
};

export const NonDismissable: Story = {
  render: () => (
    <>
      <button
        type='button'
        className='rounded-xl bg-primary-base px-3.5 py-2 text-label-sm text-static-white'
        onClick={() =>
          toast.custom(
            (t) => (
              <AlertToast.Root
                t={t}
                status='information'
                message='Analysis is running in the background.'
                dismissable={false}
              />
            ),
            { duration: 4000 },
          )
        }
      >
        Show non-dismissable toast
      </button>
      <Toaster />
    </>
  ),
};
