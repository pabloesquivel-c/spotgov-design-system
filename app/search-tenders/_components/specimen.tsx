import * as React from 'react';

/** Shared title + one-line description wrapper for every specimen tab
 * (Filter rows, Filter panel, Applied summary, Modals, Toasts, Search
 * results), so every variant across the workbench reads consistently. */
export function Specimen({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col gap-1'>
        <h2 className='text-label-sm text-text-strong-950'>{title}</h2>
        <p className='text-paragraph-sm text-text-sub-600'>{description}</p>
      </div>
      {children}
    </div>
  );
}
