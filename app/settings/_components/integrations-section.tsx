'use client';

import * as React from 'react';
import {
  RiCheckboxCircleLine,
  RiErrorWarningLine,
  RiMore2Line,
  RiPlugLine,
} from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Dropdown from '@/components/ui/dropdown';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import { DestructiveConfirmModal } from '@/components/blocks/modal/destructive-confirm-modal';
import { notification } from '@/hooks/use-notification';

import { SettingsCard } from './settings-card';
import { DemoNote } from './demo-note';
import {
  DEFAULT_INTEGRATIONS,
  type Integration,
  type IntegrationStatus,
} from './mock-data';

export function IntegrationsSection() {
  const [statuses, setStatuses] = React.useState<
    Record<string, IntegrationStatus>
  >(() =>
    Object.fromEntries(DEFAULT_INTEGRATIONS.map((i) => [i.id, i.status])),
  );

  const [disconnectId, setDisconnectId] = React.useState<string | null>(null);
  const [connectId, setConnectId] = React.useState<string | null>(null);

  const setStatus = (id: string, status: IntegrationStatus) =>
    setStatuses((prev) => ({ ...prev, [id]: status }));

  const disconnectTarget = DEFAULT_INTEGRATIONS.find(
    (i) => i.id === disconnectId,
  );
  const connectTarget = DEFAULT_INTEGRATIONS.find((i) => i.id === connectId);

  return (
    <>
      <SettingsCard
        icon={RiPlugLine}
        title='Integrations'
        description='Connect e-procurement platforms to sync tenders automatically.'
      >
        <ul className='flex flex-col divide-y divide-stroke-soft-200'>
          {DEFAULT_INTEGRATIONS.map((integration) => (
            <IntegrationRow
              key={integration.id}
              integration={integration}
              status={statuses[integration.id]}
              onConnect={() => setConnectId(integration.id)}
              onDisconnect={() => setDisconnectId(integration.id)}
              onSimulateFailure={() => setStatus(integration.id, 'failed')}
              onReconnect={() => {
                setStatus(integration.id, 'connected');
                notification({
                  status: 'success',
                  title: `${integration.name} reconnected`,
                });
              }}
            />
          ))}
        </ul>

        <DemoNote className='mt-3'>
          Use a connected integration&apos;s menu &rarr; &ldquo;Simulate failure
          (demo)&rdquo; to preview the failed / reconnect state. This control
          isn&apos;t part of the shipped design.
        </DemoNote>
      </SettingsCard>

      {/* Disconnect confirm */}
      <DestructiveConfirmModal
        open={disconnectId !== null}
        onOpenChange={(open) => !open && setDisconnectId(null)}
        title={`Disconnect ${disconnectTarget?.name ?? 'integration'}?`}
        description={`Tenders will stop syncing from ${disconnectTarget?.name ?? 'this platform'} until you reconnect.`}
        confirmLabel='Disconnect'
        onConfirm={() => {
          if (disconnectId) setStatus(disconnectId, 'not-connected');
          notification({
            status: 'information',
            title: `${disconnectTarget?.name ?? 'Integration'} disconnected`,
          });
          setDisconnectId(null);
        }}
      />

      {/* Connect modal */}
      <ConnectModal
        key={connectId ?? 'none'}
        open={connectId !== null}
        name={connectTarget?.name ?? ''}
        onOpenChange={(open) => !open && setConnectId(null)}
        onConnected={() => {
          if (connectId) setStatus(connectId, 'connected');
          notification({
            status: 'success',
            title: `${connectTarget?.name ?? 'Integration'} connected`,
          });
          setConnectId(null);
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Integration row                                                     */
/* ------------------------------------------------------------------ */

function IntegrationRow({
  integration,
  status,
  onConnect,
  onDisconnect,
  onSimulateFailure,
  onReconnect,
}: {
  integration: Integration;
  status: IntegrationStatus;
  onConnect: () => void;
  onDisconnect: () => void;
  onSimulateFailure: () => void;
  onReconnect: () => void;
}) {
  return (
    <li className='flex items-center gap-3 py-4'>
      <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
        <RiPlugLine className='size-5 text-text-sub-600' />
      </div>

      <div className='flex min-w-0 flex-1 flex-col gap-0.5'>
        <span className='text-label-sm text-text-strong-950'>
          {integration.name}
        </span>
        {status === 'failed' ? (
          <span className='flex items-center gap-1 text-paragraph-xs text-error-base'>
            <RiErrorWarningLine className='size-3.5 shrink-0' aria-hidden='true' />
            Connection failed, reconnect required
          </span>
        ) : status === 'connected' ? (
          <span className='flex items-center gap-1 text-paragraph-xs text-success-base'>
            <RiCheckboxCircleLine
              className='size-3.5 shrink-0'
              aria-hidden='true'
            />
            Connected
          </span>
        ) : (
          <span className='text-paragraph-xs text-text-sub-600'>
            {integration.description}
          </span>
        )}
      </div>

      <div className='flex shrink-0 items-center gap-2'>
        {status === 'not-connected' && (
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='xsmall'
            onClick={onConnect}
          >
            Connect
          </Button.Root>
        )}

        {status === 'failed' && (
          <Button.Root variant='error' size='xsmall' onClick={onReconnect}>
            Reconnect
          </Button.Root>
        )}

        {status !== 'not-connected' && (
          <Dropdown.Root>
            <Dropdown.Trigger asChild>
              <CompactButton.Root variant='ghost' size='large'>
                <CompactButton.Icon as={RiMore2Line} />
              </CompactButton.Root>
            </Dropdown.Trigger>
            <Dropdown.Content align='end' className='w-[240px]'>
              {status === 'connected' && (
                <Dropdown.Item onSelect={onSimulateFailure}>
                  Simulate failure (demo)
                </Dropdown.Item>
              )}
              <Dropdown.Item
                className='text-error-base data-[highlighted]:text-error-base'
                onSelect={onDisconnect}
              >
                Disconnect
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Root>
        )}
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Connect modal (single step)                                         */
/* ------------------------------------------------------------------ */

function ConnectModal({
  open,
  name,
  onOpenChange,
  onConnected,
}: {
  open: boolean;
  name: string;
  onOpenChange: (open: boolean) => void;
  onConnected: () => void;
}) {
  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content className='max-w-[440px]'>
        <Modal.Header
          title={`Connect ${name}`}
          description={`Sign in to link your ${name} account to SpotGov.`}
        />
        <Modal.Body className='flex flex-col gap-4'>
          <p className='text-paragraph-sm text-text-sub-600'>
            Use your {name} credentials to link this organization. SpotGov
            then syncs tender notices automatically.
          </p>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='connect-username'>Username</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id='connect-username'
                  placeholder='acme.procurement'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='connect-password'>Password</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input id='connect-password' type='password' />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <DemoNote>
            Sign-in methods vary per provider and aren&apos;t finalized, so
            these fields are placeholders for the demo.
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
            onClick={onConnected}
          >
            Connect
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
