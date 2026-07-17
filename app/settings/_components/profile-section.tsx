'use client';

import * as React from 'react';
import { RiUserLine } from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import { DestructiveConfirmModal } from '@/components/blocks/modal/destructive-confirm-modal';
import { notification } from '@/hooks/use-notification';
import { mockSessionSingleOrg } from '@/components/blocks/sidebar/skeleton/skeleton-mock-session';

import { SettingsCard } from './settings-card';

const owner = mockSessionSingleOrg.user;

export function ProfileSection() {
  const [name, setName] = React.useState(owner.name);
  const [email, setEmail] = React.useState(owner.email);
  const [saved, setSaved] = React.useState({ name: owner.name, email: owner.email });

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const [changesOpen, setChangesOpen] = React.useState(false);
  const [disconnectOpen, setDisconnectOpen] = React.useState(false);
  const [googleConnected, setGoogleConnected] = React.useState(true);

  const passwordChanged = Boolean(
    currentPassword || newPassword || confirmPassword,
  );
  const changedFields = [
    name !== saved.name ? 'Name' : null,
    email !== saved.email ? 'Email' : null,
    passwordChanged ? 'Password' : null,
  ].filter(Boolean) as string[];
  const dirty = changedFields.length > 0;

  const resetPasswordFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDiscard = () => {
    setName(saved.name);
    setEmail(saved.email);
    resetPasswordFields();
  };

  const handleApply = () => {
    setChangesOpen(true);
  };

  const confirmApply = () => {
    setSaved({ name, email });
    resetPasswordFields();
    setChangesOpen(false);
  };

  return (
    <>
      <SettingsCard
        icon={RiUserLine}
        title='Profile'
        description='Manage your personal details and connected accounts.'
        dirty={dirty}
        onDiscard={handleDiscard}
        onApply={handleApply}
      >
        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-4'>
            <Avatar.Root size='64' color='gray'>
              {owner.initials}
            </Avatar.Root>
            <div className='flex flex-col gap-1'>
              <button
                type='button'
                onClick={() =>
                  notification({
                    status: 'information',
                    title: 'Photo upload',
                    description:
                      'Uploading a custom photo isn’t wired up in this prototype.',
                  })
                }
                className='w-fit text-label-sm text-primary-base outline-none transition-colors hover:text-primary-darker focus-visible:underline'
              >
                Change photo
              </button>
              <span className='text-paragraph-xs text-text-sub-600'>
                JPG or PNG, up to 2MB.
              </span>
            </div>
          </div>

          <div className='flex max-w-[440px] flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <Label.Root htmlFor='profile-name'>Full Name</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='profile-name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            <div className='flex flex-col gap-1'>
              <Label.Root htmlFor='profile-email'>Email Address</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='profile-email'
                    type='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
          </div>

          <Divider.Root />

          <div className='flex flex-col gap-2'>
            <span className='text-label-sm text-text-strong-950'>
              Connected Accounts
            </span>
            <div className='flex items-center justify-between gap-4 rounded-xl p-4 ring-1 ring-inset ring-stroke-soft-200'>
              <div className='flex flex-col gap-0.5'>
                <span className='text-label-sm text-text-strong-950'>
                  Google
                </span>
                <span className='text-paragraph-xs text-text-sub-600'>
                  {googleConnected
                    ? `Connected as ${owner.email}`
                    : 'Not connected'}
                </span>
              </div>
              {googleConnected ? (
                <Button.Root
                  variant='error'
                  mode='stroke'
                  size='xsmall'
                  onClick={() => setDisconnectOpen(true)}
                >
                  Disconnect
                </Button.Root>
              ) : (
                <Button.Root
                  variant='neutral'
                  mode='stroke'
                  size='xsmall'
                  onClick={() => {
                    setGoogleConnected(true);
                    notification({
                      status: 'success',
                      title: 'Google account connected',
                    });
                  }}
                >
                  Connect
                </Button.Root>
              )}
            </div>
          </div>

          <Divider.Root />

          <div className='flex max-w-[440px] flex-col gap-4'>
            <span className='text-label-sm text-text-strong-950'>
              Change Password
            </span>
            <div className='flex flex-col gap-1'>
              <Label.Root htmlFor='current-password'>
                Current Password
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='current-password'
                    type='password'
                    autoComplete='current-password'
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
            <div className='flex flex-col gap-1'>
              <Label.Root htmlFor='new-password'>New Password</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='new-password'
                    type='password'
                    autoComplete='new-password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
            <div className='flex flex-col gap-1'>
              <Label.Root htmlFor='confirm-password'>
                Confirm New Password
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='confirm-password'
                    type='password'
                    autoComplete='new-password'
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
          </div>
        </div>
      </SettingsCard>

      {/* Changes-saved echo modal — lists only the fields that actually changed */}
      <Modal.Root open={changesOpen} onOpenChange={setChangesOpen}>
        <Modal.Content className='max-w-[440px]'>
          <Modal.Header
            title='Save changes?'
            description={
              changedFields.length
                ? `Changes to ${changedFields.join(' and ')} will be applied.`
                : 'No changes to apply.'
            }
          />
          <Modal.Footer>
            <Modal.Close asChild>
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='small'
                className='w-full'
              >
                Cancel
              </Button.Root>
            </Modal.Close>
            <Button.Root
              variant='primary'
              size='small'
              className='w-full'
              onClick={confirmApply}
            >
              Save changes
            </Button.Root>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>

      <DestructiveConfirmModal
        open={disconnectOpen}
        onOpenChange={setDisconnectOpen}
        title='Disconnect Google account?'
        description="You'll need to reconnect it to sign in with Google again."
        confirmLabel='Disconnect'
        onConfirm={() => {
          setGoogleConnected(false);
          setDisconnectOpen(false);
          notification({
            status: 'information',
            title: 'Google account disconnected',
          });
        }}
      />
    </>
  );
}
