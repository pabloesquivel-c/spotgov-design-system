'use client';

import * as React from 'react';
import { RiCheckLine, RiCloseLine, RiPencilFill } from '@remixicon/react';

import * as CompactButton from '@/components/ui/compact-button';
import * as Input from '@/components/ui/input';
import { cn } from '@/utils/cn';

type InlineEditInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  /** Called when the checkmark commits the current value. */
  onCommit?: (value: string) => void;
  /** Called when the ✕ cancels the edit and reverts to `value`. */
  onCancel?: () => void;
  /**
   * 'placeholder' (default): idle background reflects filled vs empty, no
   * idle icon — the account-setup-modal spec.
   * 'pencil': idle background is always bg-weak-50 with a trailing pencil
   * affordance that focuses the field — the Custom Inline Input [1.1] spec
   * used by Account Settings > Full Name.
   */
  idleVariant?: 'placeholder' | 'pencil';
};

export function InlineEditInput({
  value,
  onChange,
  onCommit,
  onCancel,
  className,
  idleVariant = 'placeholder',
  ...props
}: InlineEditInputProps) {
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const isFilled = Boolean(value);
  const isIdleWeak = idleVariant === 'pencil' || !isFilled;
  const { input } = Input.inputVariants();
  const { root: compactRoot, icon: compactIcon } =
    CompactButton.compactButtonVariants({ variant: 'ghost' });

  const handleClear = () => {
    onChange?.({
      target: { name: props.name, value: '' },
    } as React.ChangeEvent<HTMLInputElement>);
    onCancel?.();
  };

  const handleCommit = () => {
    onCommit?.(typeof value === 'string' ? value : String(value ?? ''));
  };

  return (
    <Input.Root
      className={cn(
        !isFocused && 'shadow-none before:!ring-0',
        isFocused && 'before:!ring-1',
        // Idle rows without a saved value read as empty (bg-weak-50); a
        // saved value reads as filled (bg-white), per the Figma inline-edit spec.
        // The 'pencil' variant is always weak-50 idle, per Custom Inline Input.
        !isFocused && (isIdleWeak ? 'bg-bg-weak-50' : 'bg-bg-white-0'),
        className,
      )}
    >
      <Input.Wrapper
        className={cn(!isFocused && (isIdleWeak ? 'bg-bg-weak-50' : 'bg-bg-white-0'))}
      >
        <input
          ref={inputRef}
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
              aria-label='Cancel edit'
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleClear}
              className={compactRoot()}
            >
              <RiCloseLine className={compactIcon()} />
            </CompactButton.Root>
            <CompactButton.Root
              variant='ghost'
              aria-label='Commit edit'
              onMouseDown={(event) => event.preventDefault()}
              onClick={handleCommit}
              className={compactRoot()}
            >
              <RiCheckLine className={compactIcon()} />
            </CompactButton.Root>
          </>
        ) : idleVariant === 'pencil' ? (
          <CompactButton.Root
            variant='ghost'
            aria-label='Edit'
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => inputRef.current?.focus()}
            className={compactRoot()}
          >
            <RiPencilFill className={compactIcon()} />
          </CompactButton.Root>
        ) : null}
      </Input.Wrapper>
    </Input.Root>
  );
}
