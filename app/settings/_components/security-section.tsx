'use client';

import * as React from 'react';
import {
  RiComputerLine,
  RiQrCodeLine,
  RiShieldCheckLine,
  RiShieldLine,
  RiSmartphoneLine,
} from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import { DestructiveConfirmModal } from '@/components/blocks/modal/destructive-confirm-modal';
import { notification } from '@/hooks/use-notification';

import { SettingsSection } from './settings-card';
import { DemoNote } from './demo-note';
import { DEFAULT_SESSIONS, type Session } from './mock-data';

export function SecuritySection() {
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [setupOpen, setSetupOpen] = React.useState(false);
  const [disableOpen, setDisableOpen] = React.useState(false);

  const [sessions, setSessions] = React.useState<Session[]>(DEFAULT_SESSIONS);
  const [signOutAllOpen, setSignOutAllOpen] = React.useState(false);

  // TODO(connect): call the revoke-session mutation for this device.
  const signOutSession = (id: string) => {
    const session = sessions.find((s) => s.id === id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (session) {
      notification({
        status: 'information',
        title: `Signed out of ${session.device}`,
      });
    }
  };

  // TODO(connect): verify the TOTP code against the server-generated secret,
  // then enable 2FA on the account.
  const handleTwoFactorEnabled = () => {
    setTwoFactorEnabled(true);
    setSetupOpen(false);
    notification({
      status: 'success',
      title: 'Two-factor authentication enabled',
    });
  };

  // TODO(connect): call the disable-2FA mutation.
  const handleDisableTwoFactor = () => {
    setTwoFactorEnabled(false);
    setDisableOpen(false);
    notification({
      status: 'information',
      title: 'Two-factor authentication disabled',
    });
  };

  // TODO(connect): call the revoke-all-other-sessions mutation.
  const handleSignOutAllOtherSessions = () => {
    setSessions((prev) => prev.filter((s) => s.current));
    setSignOutAllOpen(false);
    notification({
      status: 'information',
      title: 'Signed out of all other devices',
    });
  };

  return (
    <>
      <SettingsSection
        title='Security'
        description='Two-factor authentication and active sessions.'
      >
        <div className='flex flex-col gap-6'>
          <div className='flex items-center justify-between gap-4 rounded-xl p-4 ring-1 ring-inset ring-stroke-soft-200'>
            <div className='flex items-start gap-3'>
              <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
                {twoFactorEnabled ? (
                  <RiShieldCheckLine className='size-5 text-success-base' />
                ) : (
                  <RiShieldLine className='size-5 text-text-sub-600' />
                )}
              </div>
              <div className='flex flex-col gap-0.5'>
                <span className='text-label-sm text-text-strong-950'>
                  Two-factor authentication
                </span>
                <span className='text-paragraph-xs text-text-sub-600'>
                  {twoFactorEnabled
                    ? 'Enabled — an authenticator app is required at sign-in.'
                    : 'Add an extra step when signing in with an authenticator app.'}
                </span>
              </div>
            </div>
            {twoFactorEnabled ? (
              <Button.Root
                variant='error'
                mode='stroke'
                size='xsmall'
                className='shrink-0'
                onClick={() => setDisableOpen(true)}
              >
                Disable
              </Button.Root>
            ) : (
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='xsmall'
                className='shrink-0'
                onClick={() => setSetupOpen(true)}
              >
                Enable
              </Button.Root>
            )}
          </div>

          <Divider.Root />

          <div className='flex flex-col gap-3'>
            <span className='text-label-sm text-text-strong-950'>
              Active sessions
            </span>
            <ul className='flex flex-col divide-y divide-stroke-soft-200 rounded-xl ring-1 ring-inset ring-stroke-soft-200'>
              {sessions.map((session) => (
                <li
                  key={session.id}
                  className='flex items-center gap-3 px-4 py-3'
                >
                  <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-bg-weak-50'>
                    {session.device.toLowerCase().includes('iphone') ? (
                      <RiSmartphoneLine className='size-[18px] text-text-sub-600' />
                    ) : (
                      <RiComputerLine className='size-[18px] text-text-sub-600' />
                    )}
                  </div>
                  <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
                    <span className='truncate text-label-sm text-text-strong-950'>
                      {session.device}
                    </span>
                    <span className='truncate text-paragraph-xs text-text-sub-600'>
                      {session.location} · {session.lastActive}
                    </span>
                  </div>
                  {session.current ? (
                    <Badge.Root variant='light' color='blue' size='medium'>
                      This device
                    </Badge.Root>
                  ) : (
                    <Button.Root
                      variant='neutral'
                      mode='stroke'
                      size='xsmall'
                      className='shrink-0'
                      onClick={() => signOutSession(session.id)}
                    >
                      Sign out
                    </Button.Root>
                  )}
                </li>
              ))}
            </ul>
            {sessions.length > 1 && (
              <Button.Root
                variant='error'
                mode='stroke'
                size='small'
                className='w-fit'
                onClick={() => setSignOutAllOpen(true)}
              >
                Sign out of all other devices
              </Button.Root>
            )}
          </div>
        </div>
      </SettingsSection>

      <TwoFactorSetupModal
        key={setupOpen ? 'open' : 'closed'}
        open={setupOpen}
        onOpenChange={setSetupOpen}
        onEnabled={handleTwoFactorEnabled}
      />

      <DestructiveConfirmModal
        open={disableOpen}
        onOpenChange={setDisableOpen}
        title='Disable two-factor authentication?'
        description='Your account will only require a password to sign in.'
        confirmLabel='Disable'
        onConfirm={handleDisableTwoFactor}
      />

      <DestructiveConfirmModal
        open={signOutAllOpen}
        onOpenChange={setSignOutAllOpen}
        title='Sign out of all other devices?'
        description="Every session except this one will be signed out immediately."
        confirmLabel='Sign out all'
        onConfirm={handleSignOutAllOtherSessions}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 2FA setup modal (mock QR + verification code)                      */
/* ------------------------------------------------------------------ */

function TwoFactorSetupModal({
  open,
  onOpenChange,
  onEnabled,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnabled: () => void;
}) {
  const [code, setCode] = React.useState('');
  const canVerify = code.trim().length === 6;

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content className='max-w-[440px]'>
        <Modal.Header
          title='Set up two-factor authentication'
          description='Scan the code with an authenticator app, then enter the 6-digit code it generates.'
        />
        <Modal.Body className='flex flex-col gap-4'>
          <div className='flex items-center justify-center rounded-xl bg-bg-weak-50 p-6'>
            <RiQrCodeLine className='size-28 text-text-soft-400' />
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='two-factor-code'>
              Verification code
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id='two-factor-code'
                  inputMode='numeric'
                  placeholder='000000'
                  maxLength={6}
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <DemoNote>
            This is a mock QR code — any 6-digit value verifies successfully
            in this preview.
          </DemoNote>
        </Modal.Body>
        <Modal.Footer>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            className='w-full'
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button.Root>
          <Button.Root
            variant='primary'
            size='small'
            className='w-full'
            disabled={!canVerify}
            onClick={onEnabled}
          >
            Verify & enable
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
