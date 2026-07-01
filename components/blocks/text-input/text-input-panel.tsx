import type { RemixiconComponentType } from '@remixicon/react';

import * as Divider from '@/components/ui/divider';

export const textInputPanelClassName =
  'flex w-full max-w-[400px] flex-col rounded-20 bg-bg-white-0 p-5 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200';

type TextInputPanelHeaderProps = {
  icon: RemixiconComponentType;
  title: string;
  description: string;
};

export function TextInputPanelHeader({
  icon: Icon,
  title,
  description,
}: TextInputPanelHeaderProps) {
  return (
    <>
      <div className='flex w-full items-center gap-3.5'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
          <Icon className='size-icon text-text-sub-600' />
        </div>
        <div className='flex flex-col gap-1'>
          <div className='text-label-sm text-text-strong-950'>{title}</div>
          <div className='text-paragraph-xs text-text-sub-600'>{description}</div>
        </div>
      </div>
      <div className='my-4'>
        <Divider.Root />
      </div>
    </>
  );
}
