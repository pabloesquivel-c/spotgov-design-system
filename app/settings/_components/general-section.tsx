'use client';

import * as React from 'react';
import {
  RiArrowRightSLine,
  RiDeleteBinLine,
  RiErrorWarningLine,
  RiExchange2Line,
  RiInformationLine,
} from '@remixicon/react';

import * as Alert from '@/components/ui/alert';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Select from '@/components/ui/select';
import { notification } from '@/hooks/use-notification';
import { cn } from '@/utils/cn';

import { SettingsSection } from './settings-card';
import { DemoNote } from './demo-note';
import type { SectionId } from './settings-rail';
import { DEFAULT_MEMBERS, DEFAULT_ORG, ORG_LANGUAGES } from './mock-data';

const ACTIVE_ADMINS = DEFAULT_MEMBERS.filter(
  (m) => m.role === 'admin' && m.status === 'active',
);

function orgInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
}

export function GeneralSection({
  onNavigate,
  onDirtyChange,
}: {
  onNavigate: (id: SectionId) => void;
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [name, setName] = React.useState(DEFAULT_ORG.name);
  const [language, setLanguage] = React.useState(DEFAULT_ORG.language);
  const [saved, setSaved] = React.useState({
    name: DEFAULT_ORG.name,
    language: DEFAULT_ORG.language,
  });

  const [transferOpen, setTransferOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const dirty = name !== saved.name || language !== saved.language;

  React.useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);

  const handleDiscard = () => {
    setName(saved.name);
    setLanguage(saved.language);
  };

  // TODO(connect): PATCH the organization's name and default language.
  const handleApply = () => {
    setSaved({ name, language });
    notification({
      status: 'success',
      title: 'Organization updated',
    });
  };

  // TODO(connect): open the logo upload flow and persist to org storage.
  const handleUploadLogo = () =>
    notification({
      status: 'information',
      title: 'Logo upload',
      description: 'Uploading a custom logo isn’t wired up in this prototype.',
    });

  return (
    <>
      <SettingsSection
        title='General'
        description='Organization identity and irreversible actions.'
        dirty={dirty}
        onDiscard={handleDiscard}
        onApply={handleApply}
      >
        <div className='flex flex-col gap-6'>
          <div className='flex items-center gap-4'>
            <span
              className='flex size-14 shrink-0 items-center justify-center rounded-xl text-label-lg font-semibold text-static-white'
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #4b6bff 0%, #2547d0 100%)',
              }}
            >
              {orgInitials(name)}
            </span>
            <div className='flex flex-col gap-1'>
              <button
                type='button'
                onClick={handleUploadLogo}
                className='w-fit text-label-sm text-primary-base outline-none transition-colors hover:text-primary-darker focus-visible:underline'
              >
                Change logo
              </button>
              <span className='text-paragraph-xs text-text-sub-600'>
                SVG or PNG, up to 2MB.
              </span>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <Label.Root htmlFor='org-name'>Organization Name</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='org-name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>

            <div className='flex flex-col gap-1'>
              <Label.Root htmlFor='org-language'>
                Organization Language
              </Label.Root>
              <Select.Root value={language} onValueChange={setLanguage}>
                <Select.Trigger id='org-language'>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  {ORG_LANGUAGES.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
              <span className='text-paragraph-xs text-text-sub-600'>
                Default language for new members and generated reports.
              </span>
            </div>
          </div>

          <Divider.Root />

          <button
            type='button'
            onClick={() => onNavigate('business-profile')}
            className='group w-full text-left outline-none'
          >
            <Alert.Root
              variant='lighter'
              status='information'
              size='small'
              className='cursor-pointer transition-colors group-hover:bg-bg-weak-50 group-focus-visible:ring-2 group-focus-visible:ring-primary-base'
            >
              <Alert.Icon as={RiInformationLine} />
              <span className='flex flex-1 items-center justify-between gap-2'>
                <span>
                  Company details, tax ID, and certifications live in{' '}
                  <span className='font-medium'>Business Profile</span>.
                </span>
                <RiArrowRightSLine
                  className='size-5 shrink-0 text-text-sub-600 transition-colors group-hover:text-text-strong-950'
                  aria-hidden='true'
                />
              </span>
            </Alert.Root>
          </button>

          <Divider.Root />

          <div className='flex flex-col gap-3 rounded-xl p-4 ring-1 ring-inset ring-error-lighter'>
            <div className='flex flex-col gap-0.5'>
              <span className='text-label-sm text-text-strong-950'>
                Danger Zone
              </span>
              <span className='text-paragraph-xs text-text-sub-600'>
                These actions are irreversible. Proceed with caution.
              </span>
            </div>

            <div className='flex items-center justify-between gap-4 border-t border-stroke-soft-200 pt-3'>
              <div className='flex flex-col gap-0.5'>
                <span className='text-label-sm text-text-strong-950'>
                  Transfer ownership
                </span>
                <span className='text-paragraph-xs text-text-sub-600'>
                  Hand over the Owner role to an active admin.
                </span>
              </div>
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='small'
                className='shrink-0'
                onClick={() => setTransferOpen(true)}
              >
                <Button.Icon as={RiExchange2Line} />
                Transfer
              </Button.Root>
            </div>

            <div className='flex items-center justify-between gap-4 border-t border-stroke-soft-200 pt-3'>
              <div className='flex flex-col gap-0.5'>
                <span className='text-label-sm text-text-strong-950'>
                  Delete organization
                </span>
                <span className='text-paragraph-xs text-text-sub-600'>
                  Permanently deletes all tenders, contracts, and members.
                </span>
              </div>
              <Button.Root
                variant='error'
                mode='stroke'
                size='small'
                className='shrink-0'
                onClick={() => setDeleteOpen(true)}
              >
                <Button.Icon as={RiDeleteBinLine} />
                Delete
              </Button.Root>
            </div>

            <DemoNote>
              Both actions are stubbed for this preview — no data is actually
              transferred or removed.
            </DemoNote>
          </div>
        </div>
      </SettingsSection>

      <TransferOwnershipModal
        key={transferOpen ? 'open' : 'closed'}
        open={transferOpen}
        onOpenChange={setTransferOpen}
        orgName={name}
      />

      <DeleteOrgModal
        key={deleteOpen ? 'open-delete' : 'closed-delete'}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        orgName={name}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Transfer ownership — pick an active admin, then confirm            */
/* ------------------------------------------------------------------ */

function TransferOwnershipModal({
  open,
  onOpenChange,
  orgName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgName: string;
}) {
  const [step, setStep] = React.useState<'pick' | 'confirm'>('pick');
  const [selectedId, setSelectedId] = React.useState<string | null>(
    ACTIVE_ADMINS[0]?.id ?? null,
  );

  const selected = ACTIVE_ADMINS.find((a) => a.id === selectedId);

  // TODO(connect): call the transfer-ownership mutation, then refresh the
  // members list and current-user role.
  const handleConfirmTransfer = () => {
    if (!selected) return;
    onOpenChange(false);
    notification({
      status: 'success',
      title: `Ownership transferred to ${selected.name}`,
    });
  };

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content className='max-w-[440px]'>
        {step === 'confirm' && selected ? (
          <>
            <Modal.Body>
              <div className='flex items-start gap-4'>
                <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-error-lighter'>
                  <RiErrorWarningLine className='size-6 text-error-base' />
                </div>
                <div>
                  <Modal.Title className='text-label-md text-text-strong-950'>
                    Transfer ownership to {selected.name}?
                  </Modal.Title>
                  <Modal.Description className='mt-1 text-paragraph-sm text-text-sub-600'>
                    You&apos;ll become an Admin and {selected.name} will become
                    the Owner of {orgName}. This can&apos;t be undone.
                  </Modal.Description>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button.Root
                variant='neutral'
                mode='stroke'
                size='small'
                className='w-full'
                onClick={() => setStep('pick')}
              >
                Back
              </Button.Root>
              <Button.Root
                variant='error'
                size='small'
                className='w-full'
                onClick={handleConfirmTransfer}
              >
                Transfer ownership
              </Button.Root>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header
              title='Transfer ownership'
              description='Pick an active admin to become the new Owner.'
            />
            <Modal.Body className='flex flex-col gap-4'>
              {ACTIVE_ADMINS.length === 0 ? (
                <DemoNote>
                  No active admins are available to receive ownership in this
                  demo roster.
                </DemoNote>
              ) : (
                <div className='flex flex-col gap-2'>
                  {ACTIVE_ADMINS.map((admin) => {
                    const isSelected = selectedId === admin.id;
                    return (
                      <label
                        key={admin.id}
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-xl p-3 ring-1 ring-inset transition-colors',
                          isSelected
                            ? 'bg-primary-alpha-10 ring-2 ring-primary-base'
                            : 'ring-stroke-soft-200 hover:bg-bg-weak-50',
                        )}
                      >
                        <Avatar.Root size='32' color={admin.color}>
                          {admin.initials}
                        </Avatar.Root>
                        <span className='flex min-w-0 flex-1 flex-col'>
                          <span className='truncate text-label-sm text-text-strong-950'>
                            {admin.name}
                          </span>
                          <span className='truncate text-paragraph-xs text-text-sub-600'>
                            {admin.email}
                          </span>
                        </span>
                        <input
                          type='radio'
                          name='transfer-admin'
                          value={admin.id}
                          checked={isSelected}
                          onChange={() => setSelectedId(admin.id)}
                          className='sr-only'
                        />
                      </label>
                    );
                  })}
                </div>
              )}
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
                disabled={!selected}
                onClick={() => setStep('confirm')}
              >
                Continue
              </Button.Root>
            </Modal.Footer>
          </>
        )}
      </Modal.Content>
    </Modal.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Delete organization — type name to confirm                         */
/* ------------------------------------------------------------------ */

function DeleteOrgModal({
  open,
  onOpenChange,
  orgName,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orgName: string;
}) {
  const [value, setValue] = React.useState('');
  const matches = value.trim() === orgName;

  // TODO(connect): call the delete-organization mutation, then sign the user
  // out and redirect to the marketing site.
  const handleConfirmDelete = () => {
    onOpenChange(false);
    notification({
      status: 'information',
      title: `${orgName} deleted`,
      description: 'Demo only — no data was actually removed.',
    });
  };

  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Content showClose={false} className='max-w-[440px]'>
        <Modal.Body>
          <div className='flex items-start gap-4'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-error-lighter'>
              <RiErrorWarningLine className='size-6 text-error-base' />
            </div>
            <div className='min-w-0 flex-1'>
              <Modal.Title className='text-label-md text-text-strong-950'>
                Delete {orgName}?
              </Modal.Title>
              <Modal.Description className='mt-1 text-paragraph-sm text-text-sub-600'>
                This permanently deletes every tender, analysis, contract, and
                member in this organization. This can&apos;t be undone.
              </Modal.Description>

              <div className='mt-4 flex flex-col gap-1'>
                <Label.Root htmlFor='confirm-org-name'>
                  Type <span className='font-medium'>{orgName}</span> to
                  confirm
                </Label.Root>
                <Input.Root hasError={value.length > 0 && !matches}>
                  <Input.Wrapper>
                    <Input.Input
                      id='confirm-org-name'
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder={orgName}
                      autoComplete='off'
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>
          </div>
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
            variant='error'
            size='small'
            className='w-full'
            disabled={!matches}
            onClick={handleConfirmDelete}
          >
            Delete organization
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
