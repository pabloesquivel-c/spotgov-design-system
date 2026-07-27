import type * as React from 'react';

import { cn } from '@/utils/cn';

type LinkButtonProps = Pick<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'children' | 'className' | 'onClick'
>;

export function LinkButton({ children, className, onClick }: LinkButtonProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'text-primary-base outline-none transition-colors hover:text-primary-darker focus-visible:underline',
        className,
      )}
    >
      {children}
    </button>
  );
}
