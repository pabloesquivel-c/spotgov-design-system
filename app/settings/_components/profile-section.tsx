'use client';

import * as React from 'react';
import { RiUserLine } from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
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

  const [changesOpen, setChangesOpen] = React.useState(false);
  const [disconnectOpen, setDisconnectOpen] = React.useState(false);
  const [googleConnected, setGoogleConnected] = React.useState(true);

  const changedFields = [
    name !== saved.name ? 'Name' : null,
    email !== saved.email ? 'Email' : null,
  ].filter(Boolean) as string[];
  const dirty = changedFields.length > 0;

  const handleDiscard = () => {
    setName(saved.name);
    setEmail(saved.email);
  };

  const handleApply = () => {
    setChangesOpen(true);
  };

  const confirmApply = () => {
    setSaved({ name, email });
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
              <span className='text-label-sm text-text-strong-950'>
                Profile photo
              </span>
              <span className='text-paragraph-xs text-text-sub-600'>
                Your initials are shown across the workspace.
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

          <div className='flex items-center justify-between gap-4 rounded-xl p-4 ring-1 ring-inset ring-stroke-soft-200'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-label-sm text-text-strong-950'>
                Google account
              </span>
              <span className='text-paragraph-xs text-text-sub-600'>
                {googleConnected
                  ? 'Connected as pablo@acmecorp.com'
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
