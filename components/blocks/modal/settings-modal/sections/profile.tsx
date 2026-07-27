'use client';

import * as React from 'react';
import { RiInformationFill } from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Hint from '@/components/ui/hint';
import * as Input from '@/components/ui/input';
import { InlineEditInput } from '@/components/blocks/text-input/inline-edit-input';
import { notification } from '@/hooks/use-notification';

import { SettingRow } from '../setting-row';
import type { SectionCommitHandle } from '../settings-modal';

export type ProfileModalSectionProps = {
  onDirtyChange: (dirty: boolean) => void;
};

const SAVED_NAME = 'James Brown';
const EMAIL = 'james@spotgov.com';

/**
 * Full name stages and commits through the shell header's Discard/Save
 * changes (R11 — a per-field commit here would fragment the section into N
 * requests and leave Discard undefined). Email is permanently read-only, so
 * it renders as a disabled Input + Hint, per the Account Settings frame.
 */
export const ProfileModalSection = React.forwardRef<
  SectionCommitHandle,
  ProfileModalSectionProps
>(function ProfileModalSection({ onDirtyChange }, ref) {
  const [name, setName] = React.useState(SAVED_NAME);
  const dirty = name !== SAVED_NAME;

  React.useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  React.useImperativeHandle(ref, () => ({
    save: () => setName((current) => current),
    discard: () => setName(SAVED_NAME),
  }));

  return (
    <div className='flex flex-col divide-y divide-dashed divide-stroke-soft-200'>
      <SettingRow
        title='Profile photo'
        description='PNG or JPEG, at least 400 x 400 px.'
        controlClassName='w-[312px]'
        control={
          <div className='flex items-center gap-5'>
            <Avatar.Root size='40' color='blue'>
              JB
            </Avatar.Root>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              onClick={() =>
                notification({ status: 'information', title: 'Photo upload' })
              }
            >
              Change
            </Button.Root>
          </div>
        }
      />
      <SettingRow
        title='Full name'
        description='Your name will be visible to your contacts.'
        controlClassName='w-[312px]'
        control={
          <InlineEditInput
            idleVariant='pencil'
            name='fullName'
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        }
      />
      <SettingRow
        title='Email address'
        controlClassName='w-[300px] flex-col items-start gap-1'
        control={
          <>
            <Input.Root size='medium' className='w-full'>
              <Input.Wrapper>
                <Input.Input disabled readOnly value={EMAIL} />
              </Input.Wrapper>
            </Input.Root>
            <Hint.Root disabled>
              <Hint.Icon as={RiInformationFill} />
              Contact an admin to request a change.
            </Hint.Root>
          </>
        }
      />
      <SettingRow
        title='Change password'
        description='Update your password to keep your account secure.'
        control={
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={() =>
              notification({
                status: 'information',
                title: 'Password flow',
              })
            }
          >
            Change password
          </Button.Root>
        }
      />
      <SettingRow
        title='Two-factor authentication'
        description='Require a code when signing in.'
        control={
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={() =>
              notification({
                status: 'information',
                title: 'Authentication settings',
              })
            }
          >
            Manage two-factor authentication
          </Button.Root>
        }
      />
    </div>
  );
});
