'use client';

// The toasts specimen tab: every toast this screen can trigger, independent
// of page state. Each one is a real `toast.custom` call (not a static
// mock), so the trigger button demonstrates the actual enter/exit behavior.

import * as React from 'react';
import {
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiInformationFill,
} from '@remixicon/react';

import * as AlertToast from '@/components/ui/toast-alert';
import { toast, Toaster } from '@/components/ui/toast';
import { Specimen } from './specimen';

export function ToastStates() {
  return (
    <div className='flex flex-col gap-8'>
      <Specimen
        title='Export failed'
        description='Shown when an export request errors out; offers a retry.'
      >
        <button
          type='button'
          className='w-fit rounded-xl bg-primary-base px-3.5 py-2 text-label-sm text-static-white'
          onClick={() =>
            toast.custom((t) => (
              <AlertToast.Root
                t={t}
                status='error'
                size='xsmall'
                message='Export failed'
                icon={RiErrorWarningFill}
                action={{ label: 'Try again', onClick: () => toast.dismiss(t) }}
              />
            ))
          }
        >
          Show toast
        </button>
      </Specimen>

      <Specimen
        title='Filter removed on country/stage change'
        description='Fires when switching country or stage invalidates an active filter. Auto-dismisses, doesn’t block editing or Search. Undo restores the prior country/stage and filter setup — real restore logic hooks in once this tab reads page filter state.'
      >
        <button
          type='button'
          className='w-fit rounded-xl bg-primary-base px-3.5 py-2 text-label-sm text-static-white'
          onClick={() =>
            toast.custom(
              (t) => (
                <AlertToast.Root
                  t={t}
                  status='information'
                  size='xsmall'
                  message='Removed 1 filter unavailable in the United Kingdom: Buyer is any of Município de Lisboa.'
                  icon={RiInformationFill}
                  action={{ label: 'Undo', onClick: () => toast.dismiss(t) }}
                />
              ),
              { duration: 5000 },
            )
          }
        >
          Show toast
        </button>
      </Specimen>

      <Specimen
        title='Tender saved'
        description='Shown when a tender is saved. Action is Undo (un-save it) rather than a download.'
      >
        <button
          type='button'
          className='w-fit rounded-xl bg-primary-base px-3.5 py-2 text-label-sm text-static-white'
          onClick={() =>
            toast.custom((t) => (
              <AlertToast.Root
                t={t}
                status='success'
                size='xsmall'
                message='Tender saved'
                icon={RiCheckboxCircleFill}
                action={{ label: 'Undo', onClick: () => toast.dismiss(t) }}
              />
            ))
          }
        >
          Show toast
        </button>
      </Specimen>

      <Specimen
        title='Export ready'
        description='Fires when a long-running export finishes; Download fetches the file.'
      >
        <button
          type='button'
          className='w-fit rounded-xl bg-primary-base px-3.5 py-2 text-label-sm text-static-white'
          onClick={() =>
            toast.custom((t) => (
              <AlertToast.Root
                t={t}
                status='success'
                size='xsmall'
                message='Your export is ready'
                icon={RiCheckboxCircleFill}
                action={{ label: 'Download', onClick: () => toast.dismiss(t) }}
              />
            ))
          }
        >
          Show toast
        </button>
      </Specimen>

      <Toaster />
    </div>
  );
}
