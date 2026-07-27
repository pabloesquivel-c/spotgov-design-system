'use client';

import * as React from 'react';
import { RiDeleteBinLine, RiPencilLine } from '@remixicon/react';

import { DestructiveConfirmModal } from '@/components/blocks/modal/destructive-confirm-modal';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Select from '@/components/ui/select';
import { notification } from '@/hooks/use-notification';

import { SettingRow } from '../setting-row';
import type { SectionCommitHandle } from '../settings-modal';

const LANGUAGES = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'pt', label: 'Portuguese', flag: '🇵🇹' },
  { value: 'de', label: 'German', flag: '🇩🇪' },
  { value: 'fr', label: 'French', flag: '🇫🇷' },
  { value: 'es', label: 'Spanish', flag: '🇪🇸' },
];

type CompanySettings = {
  name: string;
  language: string;
};

const DEFAULT_SETTINGS: CompanySettings = {
  name: 'Acme Corp',
  language: 'pt',
};

export type GeneralModalSectionProps = {
  onDirtyChange: (dirty: boolean) => void;
};

export const GeneralModalSection = React.forwardRef<
  SectionCommitHandle,
  GeneralModalSectionProps
>(function GeneralModalSection({ onDirtyChange }, ref) {
  const [saved, setSaved] = React.useState(DEFAULT_SETTINGS);
  const [name, setName] = React.useState(DEFAULT_SETTINGS.name);
  const [language, setLanguage] = React.useState(DEFAULT_SETTINGS.language);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const dirty = name !== saved.name || language !== saved.language;

  React.useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  React.useImperativeHandle(
    ref,
    () => ({
      save: () => {
        setSaved({ name, language });
      },
      discard: () => {
        setName(saved.name);
        setLanguage(saved.language);
      },
    }),
    [language, name, saved],
  );

  return (
    <>
      <div className='flex flex-col gap-9'>
        <div className='flex flex-col divide-y divide-dashed divide-stroke-soft-200'>
          <SettingRow
            title='Company logo'
            description='PNG or JPEG, at least 400 x 400 px.'
            controlClassName='w-[312px]'
            control={
              <div className='flex items-center gap-5'>
                <Avatar.Root size='40' color='gray' />
                <Button.Root
                  variant='neutral'
                  mode='stroke'
                  size='xsmall'
                  onClick={() =>
                    notification({
                      status: 'information',
                      title: 'Logo upload',
                    })
                  }
                >
                  Change
                </Button.Root>
              </div>
            }
          />
          <SettingRow
            title='Organization name'
            description='This name is visible to members.'
            controlClassName='w-[312px]'
            control={
              <Input.Root
                size='medium'
                className='bg-bg-weak-50 shadow-none before:ring-0 hover:bg-bg-weak-50'
              >
                <Input.Wrapper className='bg-bg-weak-50 hover:bg-bg-weak-50'>
                  <Input.Input
                    aria-label='Organization name'
                    name='organizationName'
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                  <Input.Icon as={RiPencilLine} aria-hidden='true' />
                </Input.Wrapper>
              </Input.Root>
            }
          />
          <SettingRow
            className='items-center'
            title='Organization language'
            description='Default language for new members and reports.'
            controlClassName='w-[312px]'
            control={
              <Select.Root
                size='xsmall'
                value={language}
                onValueChange={setLanguage}
              >
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  {LANGUAGES.map((option) => (
                    <Select.Item
                      key={option.value}
                      value={option.value}
                      textValue={option.label}
                    >
                      <span
                        aria-hidden='true'
                        className='flex size-5 shrink-0 items-center justify-center text-label-md leading-none'
                      >
                        {option.flag}
                      </span>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            }
          />
        </div>

        <div className='flex flex-col divide-y divide-dashed divide-stroke-soft-200'>
          <SettingRow
            title='Danger zone'
            description='These actions cannot be undone.'
            control={null}
          />
          <SettingRow
            className='items-center'
            title='Delete organization'
            description='Permanently delete tenders, contracts, and members.'
            control={
              <Button.Root
                variant='error'
                mode='stroke'
                size='xsmall'
                onClick={() => setDeleteOpen(true)}
              >
                <Button.Icon as={RiDeleteBinLine} />
                Delete
              </Button.Root>
            }
          />
        </div>
      </div>

      <DestructiveConfirmModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title={`Delete ${name}?`}
        description='This permanently deletes all organization data.'
        confirmLabel='Delete organization'
        onConfirm={() => {
          setDeleteOpen(false);
          notification({
            status: 'information',
            title: 'Organization deletion requested',
          });
        }}
      />
    </>
  );
});
