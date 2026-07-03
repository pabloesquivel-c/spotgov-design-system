'use client';

import * as React from 'react';
import {
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLock2Line,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import { cn } from '@/utils/cn';

import {
  TextInputPanelHeader,
  textInputPanelClassName,
} from './text-input-panel';

const defaultLevelColors: Record<number, string> = {
  1: 'text-error-base',
  2: 'text-warning-base',
  3: 'text-success-base',
};

function LevelBar({
  levels = 3,
  level = 1,
  levelColors = defaultLevelColors,
  className,
  ...rest
}: {
  level: number;
  levels?: number;
  levelColors?: Record<number, string>;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative flex gap-2 overflow-hidden rounded-full',
        levelColors[1],
        levelColors[level],
        className,
      )}
      {...rest}
    >
      {Array.from({ length: levels }, (_, index) => (
        <div
          key={index}
          className='h-1 w-full rounded-full bg-bg-soft-200'
          style={{ clipPath: 'inset(0 round 99px)' }}
        >
          <div
            className='absolute left-0 top-0 h-full w-0 rounded-full bg-current duration-500 ease-out'
            style={{
              transitionProperty: 'width',
              width: `calc((100% / ${levels}) * ${level})`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

const passwordCriteria = [
  { key: 'uppercase', label: 'At least 1 uppercase' },
  { key: 'number', label: 'At least 1 number' },
  { key: 'length', label: 'At least 8 characters' },
] as const;

type PasswordCriteria = {
  length: boolean;
  uppercase: boolean;
  number: boolean;
};

function PasswordField({
  id,
  label,
  showPassword,
  onToggleVisibility,
  value,
  onChange,
}: {
  id: string;
  label: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className='flex flex-col gap-1'>
      <Label.Root htmlFor={id}>
        {label}
        <Label.Asterisk />
      </Label.Root>
      <Input.Root>
        <Input.Wrapper>
          <Input.Icon as={RiLock2Line} />
          <Input.Input
            id={id}
            type={showPassword ? 'text' : 'password'}
            placeholder='••••••••••'
            value={value}
            onChange={onChange}
          />
          <button type='button' onClick={onToggleVisibility}>
            {showPassword ? (
              <RiEyeOffLine className='size-5 text-text-soft-400' />
            ) : (
              <RiEyeLine className='size-5 text-text-soft-400' />
            )}
          </button>
        </Input.Wrapper>
      </Input.Root>
    </div>
  );
}

export function ChangePasswordForm() {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [criteria, setCriteria] = React.useState<PasswordCriteria>({
    length: false,
    uppercase: false,
    number: false,
  });

  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;
    setNewPassword(value);
    setCriteria({
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
    });
  };

  const trueCount = Object.values(criteria).filter(Boolean).length;

  return (
    <div className={textInputPanelClassName}>
      <TextInputPanelHeader
        icon={RiLock2Line}
        title='Change Password'
        description='Update password for enhanced account security.'
      />

      <div className='flex flex-col gap-3'>
        <PasswordField
          id='current-password'
          label='Current Password'
          showPassword={showCurrent}
          onToggleVisibility={() => setShowCurrent((value) => !value)}
        />
        <PasswordField
          id='new-password'
          label='New Password'
          showPassword={showNew}
          onToggleVisibility={() => setShowNew((value) => !value)}
          value={newPassword}
          onChange={handleNewPasswordChange}
        />
      </div>

      <div className='flex flex-col gap-1 pb-2.5 pt-3'>
        <PasswordField
          id='confirm-password'
          label='Confirm New Password'
          showPassword={showConfirm}
          onToggleVisibility={() => setShowConfirm((value) => !value)}
        />
      </div>

      <div className='flex flex-col gap-2'>
        <LevelBar levels={3} level={trueCount} />
        <div className='text-paragraph-xs text-text-sub-600'>
          Must contain at least;
        </div>
        {passwordCriteria.map((criterion) => (
          <div
            key={criterion.key}
            className='flex items-center gap-1.5 text-paragraph-xs text-text-sub-600'
          >
            {criteria[criterion.key] ? (
              <RiCheckboxCircleLine className='size-4 shrink-0 text-success-base' />
            ) : (
              <RiCloseCircleLine className='size-4 shrink-0 text-text-soft-400' />
            )}
            {criterion.label}
          </div>
        ))}
      </div>

      <div className='flex w-full gap-3 pt-5'>
        <Button.Root variant='neutral' mode='stroke' className='flex-1'>
          Discard
        </Button.Root>
        <Button.Root variant='primary' className='flex-1'>
          Apply Changes
        </Button.Root>
      </div>
    </div>
  );
}
