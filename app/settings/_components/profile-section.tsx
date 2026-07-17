'use client';

import * as React from 'react';
import { RiMailLine, RiUserLine } from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Hint from '@/components/ui/hint';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import { DestructiveConfirmModal } from '@/components/blocks/modal/destructive-confirm-modal';
import { notification } from '@/hooks/use-notification';
import { mockSessionSingleOrg } from '@/components/blocks/sidebar/skeleton/skeleton-mock-session';

import { SettingsCard } from './settings-card';
import { DemoNote } from './demo-note';

const owner = mockSessionSingleOrg.user;
const MIN_PASSWORD_LENGTH = 8;

export function ProfileSection({
  onDirtyChange,
}: {
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [name, setName] = React.useState(owner.name);
  const [email, setEmail] = React.useState(owner.email);
  const [saved, setSaved] = React.useState({ name: owner.name, email: owner.email });
  const [pendingEmail, setPendingEmail] = React.useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordTouched, setPasswordTouched] = React.useState(false);

  const [disconnectOpen, setDisconnectOpen] = React.useState(false);
  const [googleConnected, setGoogleConnected] = React.useState(true);

  const dirty = name !== saved.name || email !== saved.email;

  React.useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  const handleDiscard = () => {
    setName(saved.name);
    setEmail(saved.email);
  };

  const handleApply = () => {
    const nameChanged = name !== saved.name;
    const emailChanged = email !== saved.email;
    const newEmail = email;

    if (nameChanged) {
      setSaved((prev) => ({ ...prev, name }));
    }
    if (emailChanged) {
      setPendingEmail(newEmail);
      setEmail(saved.email); // keep the authoritative address until verified
    }

    if (nameChanged || emailChanged) {
      const fields = [nameChanged && 'Name', emailChanged && 'Email']
        .filter(Boolean)
        .join(' and ');
      notification({
        status: 'success',
        title: 'Profile updated',
        description: emailChanged
          ? `${fields} saved. Verify ${newEmail} to finish the email change.`
          : `Changes to ${fields} were saved.`,
      });
    }
  };

  const newPasswordError =
    newPassword.length > 0 && newPassword.length < MIN_PASSWORD_LENGTH
      ? `Must be at least ${MIN_PASSWORD_LENGTH} characters.`
      : null;
  const confirmPasswordError =
    confirmPassword.length > 0 && confirmPassword !== newPassword
      ? "Passwords don't match."
      : null;

  const canUpdatePassword =
    currentPassword.length > 0 &&
    newPassword.length >= MIN_PASSWORD_LENGTH &&
    newPassword === confirmPassword;

  const handleUpdatePassword = () => {
    setPasswordTouched(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    notification({ status: 'success', title: 'Password updated' });
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

              {pendingEmail && (
                <div className='mt-1 flex flex-col gap-1 rounded-xl bg-bg-weak-50 p-3'>
                  <div className='flex flex-wrap items-center justify-between gap-2'>
                    <span className='flex items-center gap-1.5 text-paragraph-xs text-text-sub-600'>
                      <RiMailLine className='size-3.5 shrink-0' />
                      Verification sent to{' '}
                      <span className='font-medium text-text-strong-950'>
                        {pendingEmail}
                      </span>
                    </span>
                    <div className='flex items-center gap-3'>
                      <button
                        type='button'
                        onClick={() =>
                          notification({
                            status: 'information',
                            title: `Verification resent to ${pendingEmail}`,
                          })
                        }
                        className='text-label-xs text-primary-base outline-none transition-colors hover:text-primary-darker focus-visible:underline'
                      >
                        Resend
                      </button>
                      <button
                        type='button'
                        onClick={() => setPendingEmail(null)}
                        className='text-label-xs text-text-sub-600 outline-none transition-colors hover:text-text-strong-950 focus-visible:underline'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <DemoNote>
                    Real verification isn&apos;t wired up.{' '}
                    <button
                      type='button'
                      onClick={() => {
                        setSaved((prev) => ({ ...prev, email: pendingEmail }));
                        setPendingEmail(null);
                        notification({
                          status: 'success',
                          title: 'Email verified',
                          description: `${pendingEmail} is now your account email.`,
                        });
                      }}
                      className='font-medium text-primary-base outline-none transition-colors hover:text-primary-darker focus-visible:underline'
                    >
                      Simulate confirmation
                    </button>
                    .
                  </DemoNote>
                </div>
              )}
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
              <Input.Root hasError={Boolean(newPasswordError)}>
                <Input.Wrapper>
                  <Input.Input
                    id='new-password'
                    type='password'
                    autoComplete='new-password'
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPasswordTouched(true);
                    }}
                  />
                </Input.Wrapper>
              </Input.Root>
              {passwordTouched && newPasswordError && (
                <Hint.Root hasError>{newPasswordError}</Hint.Root>
              )}
            </div>
            <div className='flex flex-col gap-1'>
              <Label.Root htmlFor='confirm-password'>
                Confirm New Password
              </Label.Root>
              <Input.Root hasError={Boolean(confirmPasswordError)}>
                <Input.Wrapper>
                  <Input.Input
                    id='confirm-password'
                    type='password'
                    autoComplete='new-password'
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setPasswordTouched(true);
                    }}
                  />
                </Input.Wrapper>
              </Input.Root>
              {passwordTouched && confirmPasswordError && (
                <Hint.Root hasError>{confirmPasswordError}</Hint.Root>
              )}
            </div>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              className='w-fit'
              disabled={!canUpdatePassword}
              onClick={handleUpdatePassword}
            >
              Update password
            </Button.Root>
          </div>
        </div>
      </SettingsCard>

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
