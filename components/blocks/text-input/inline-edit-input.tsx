'use client';

import * as React from 'react';
import { RiCheckLine, RiCloseLine } from '@remixicon/react';

import * as CompactButton from '@/components/ui/compact-button';
import * as Input from '@/components/ui/input';
import { cn } from '@/utils/cn';

type InlineEditInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function InlineEditInput({
  value,
  onChange,
  className,
  ...props
}: InlineEditInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const { input } = Input.inputVariants();
  const { root: compactRoot, icon: compactIcon } =
    CompactButton.compactButtonVariants({ variant: 'ghost' });

  const handleClear = () => {
    onChange?.({
      target: { name: props.name, value: '' },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Input.Root
      className={cn(
        !isFocused && 'shadow-none before:!ring-0',
        isFocused && 'before:!ring-1',
        className,
      )}
    >
      <Input.Wrapper>
        <input
          {...props}
          value={value}
          onChange={onChange}
          onFocus={(event) => {
            setIsFocused(true);
            props.onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            props.onBlur?.(event);
          }}
          className={input({ size: 'small' })}
        />
        {isFocused ? (
          <>
            <CompactButton.Root
              variant='ghost'
              onClick={handleClear}
              className={compactRoot()}
            >
              <RiCloseLine className={compactIcon()} />
            </CompactButton.Root>
            <CompactButton.Root variant='ghost' className={compactRoot()}>
              <RiCheckLine className={compactIcon()} />
            </CompactButton.Root>
          </>
        ) : null}
      </Input.Wrapper>
    </Input.Root>
  );
}
