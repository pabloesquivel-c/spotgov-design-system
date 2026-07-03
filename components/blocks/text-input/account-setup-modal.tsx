'use client';

import * as React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import {
  RiAccountBoxLine,
  RiAccountCircleLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiCakeLine,
  RiMailLine,
  RiMapPin2Line,
  RiQuillPenLine,
  RiSettings2Line,
  RiSmartphoneLine,
  RiSuitcaseLine,
  RiUser4Line,
  RiUserSettingsLine,
  type RemixiconComponentType,
} from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as CompactButton from '@/components/ui/compact-button';
import * as Modal from '@/components/ui/modal';
import { cn } from '@/utils/cn';

import { InlineEditInput } from './inline-edit-input';

type FormData = {
  fullName: string;
  phone: string;
  dateOfBirth: string;
  occupation: string;
  email: string;
  address: string;
  username: string;
  language: string;
  bio: string;
  company: string;
  website: string;
};

const emptyFormData: FormData = {
  fullName: '',
  phone: '',
  dateOfBirth: '',
  occupation: '',
  email: '',
  address: '',
  username: '',
  language: '',
  bio: '',
  company: '',
  website: '',
};

type FormField = {
  id: string;
  name: keyof FormData;
  icon: RemixiconComponentType;
  label: string;
  placeholder: string;
  handler?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

type AccordionSectionProps = {
  value: string;
  icon: RemixiconComponentType;
  title: string;
  description: string;
  badge: string;
  badgeColor: 'orange' | 'gray';
  fields: FormField[];
  formData: FormData;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function AccordionSection({
  value,
  icon: Icon,
  title,
  description,
  badge,
  badgeColor,
  fields,
  formData,
  onInputChange,
}: AccordionSectionProps) {
  return (
    <Accordion.Root
      type='single'
      defaultValue={value === 'required' ? value : undefined}
      collapsible
      className='w-full'
    >
      <Accordion.Item value={value}>
        <Accordion.Trigger className='group flex w-full items-center outline-none'>
          <div className='flex w-full items-center gap-3.5'>
            <div className='flex size-10 shrink-0 items-center justify-center rounded-full bg-bg-white-0 ring-1 ring-inset ring-stroke-soft-200'>
              <Icon className='size-5 text-text-sub-600' />
            </div>
            <div className='flex min-w-0 flex-1 items-center'>
              <div className='flex min-w-0 flex-1 flex-col items-start gap-1'>
                <span className='overflow-hidden text-ellipsis whitespace-nowrap text-label-sm text-text-strong-950'>
                  {title}
                </span>
                <span className='block overflow-hidden text-ellipsis whitespace-nowrap text-paragraph-xs text-text-sub-600'>
                  {description}
                </span>
              </div>
              <div className='flex shrink-0 items-center gap-3'>
                <Badge.Root variant='lighter' color={badgeColor} size='medium'>
                  {badge}
                </Badge.Root>
                <span
                  className={cn(
                    CompactButton.compactButtonVariants({
                      variant: 'stroke',
                      size: 'large',
                      fullRadius: true,
                    }).root(),
                    'inline-flex shrink-0 items-center justify-center group-data-[state=open]:border-0',
                  )}
                >
                  <RiArrowDownSLine className='size-5 text-text-soft-400 group-data-[state=open]:hidden' />
                  <RiArrowUpSLine className='hidden size-5 rounded-full bg-bg-surface-800 text-text-white-0 group-data-[state=open]:block' />
                </span>
              </div>
            </div>
          </div>
        </Accordion.Trigger>
        <Accordion.Content className='overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down'>
          <div className='rounded-2xl bg-bg-white-0 pb-0 pl-[54px] pt-3'>
            <div className='flex flex-col gap-2 rounded-2xl border border-stroke-soft-200 px-3 py-2'>
              {fields.map((field) => (
                <div
                  key={field.id}
                  className='flex flex-row items-center gap-4'
                >
                  <div className='flex flex-row items-center gap-2'>
                    <field.icon className='size-5 shrink-0 text-text-sub-600' />
                    <span className='w-[60px] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap text-paragraph-sm text-text-sub-600 md:w-[92px]'>
                      {field.label}
                    </span>
                  </div>
                  <InlineEditInput
                    id={field.id}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={field.handler ?? onInputChange}
                  />
                </div>
              ))}
            </div>
          </div>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
  );
}

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatDateOfBirth(value: string) {
  const digits = value.replace(/[^\d/]/g, '');
  const normalized = digits.replace(/\//g, '');
  if (normalized.length <= 2) return normalized;
  if (normalized.length <= 4) {
    return `${normalized.slice(0, 2)}/${normalized.slice(2)}`;
  }
  return `${normalized.slice(0, 2)}/${normalized.slice(2, 4)}/${normalized.slice(4, 8)}`.slice(
    0,
    10,
  );
}

export function AccountSetupModal() {
  const [open, setOpen] = React.useState(true);
  const [formData, setFormData] = React.useState<FormData>(emptyFormData);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange({
      ...event,
      target: {
        ...event.target,
        name: 'phone',
        value: formatPhoneNumber(event.target.value),
      },
    });
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange({
      ...event,
      target: {
        ...event.target,
        name: 'dateOfBirth',
        value: formatDateOfBirth(event.target.value),
      },
    });
  };

  return (
    <Modal.Root defaultOpen open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Open Modal
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content
        className={cn(
          'w-full max-w-[520px] rounded-20 shadow-regular-md ring-1 ring-inset ring-stroke-soft-200',
        )}
      >
        <Modal.Header
          title='Account Setup'
          description='Complete simple steps to get started.'
          icon={RiUserSettingsLine}
        />
        <Modal.Body className='flex flex-col gap-5'>
          <AccordionSection
            value='required'
            icon={RiAccountBoxLine}
            title='Required Information'
            description='Provide required information.'
            badge='In Progress'
            badgeColor='orange'
            formData={formData}
            onInputChange={handleInputChange}
            fields={[
              {
                id: 'account-full-name',
                name: 'fullName',
                icon: RiUser4Line,
                label: 'Full Name',
                placeholder: 'Full Name',
              },
              {
                id: 'account-phone',
                name: 'phone',
                icon: RiSmartphoneLine,
                label: 'Phone',
                placeholder: 'Phone',
                handler: handlePhoneChange,
              },
              {
                id: 'account-date-of-birth',
                name: 'dateOfBirth',
                icon: RiCakeLine,
                label: 'Date of Birth',
                placeholder: 'dd/mm/yyyy',
                handler: handleDateChange,
              },
              {
                id: 'account-occupation',
                name: 'occupation',
                icon: RiSuitcaseLine,
                label: 'Occupation',
                placeholder: 'Occupation',
              },
              {
                id: 'account-email',
                name: 'email',
                icon: RiMailLine,
                label: 'Email',
                placeholder: 'Enter email address...',
              },
              {
                id: 'account-address',
                name: 'address',
                icon: RiMapPin2Line,
                label: 'Address',
                placeholder: 'Enter address...',
              },
            ]}
          />
          <AccordionSection
            value='profile'
            icon={RiSettings2Line}
            title='Profile Customization'
            description='Provide information for profile customization.'
            badge='Incomplete'
            badgeColor='gray'
            formData={formData}
            onInputChange={handleInputChange}
            fields={[
              {
                id: 'account-username',
                name: 'username',
                icon: RiAccountCircleLine,
                label: 'Username',
                placeholder: 'Enter username...',
              },
              {
                id: 'account-language',
                name: 'language',
                icon: RiSettings2Line,
                label: 'Language',
                placeholder: 'Select language...',
              },
            ]}
          />
          <AccordionSection
            value='optional'
            icon={RiQuillPenLine}
            title='Optional Information'
            description='Provide optional information.'
            badge='Incomplete'
            badgeColor='gray'
            formData={formData}
            onInputChange={handleInputChange}
            fields={[
              {
                id: 'account-bio',
                name: 'bio',
                icon: RiQuillPenLine,
                label: 'Bio',
                placeholder: 'Write something about yourself...',
              },
              {
                id: 'account-company',
                name: 'company',
                icon: RiSuitcaseLine,
                label: 'Company',
                placeholder: 'Enter company name...',
              },
              {
                id: 'account-website',
                name: 'website',
                icon: RiMapPin2Line,
                label: 'Website',
                placeholder: 'Enter website URL...',
              },
            ]}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className='flex w-full items-center justify-end gap-3'>
            <Button.Root
              variant='neutral'
              mode='stroke'
              onClick={() => setOpen(false)}
              className='flex-1'
            >
              Skip
            </Button.Root>
            <Button.Root
              variant='primary'
              onClick={() => setOpen(false)}
              className='flex-1'
            >
              Proceed
            </Button.Root>
          </div>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
