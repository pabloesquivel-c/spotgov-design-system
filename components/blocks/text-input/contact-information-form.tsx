'use client';

import * as React from 'react';
import { RiContactsLine, RiInformationLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';

import {
  TextInputPanelHeader,
  textInputPanelClassName,
} from './text-input-panel';

const countries = [
  { icon: 'https://alignui.com/flags/US.svg', value: '+1', label: '+1' },
  { icon: 'https://alignui.com/flags/TR.svg', value: '+90', label: '+90' },
  { icon: 'https://alignui.com/flags/ES.svg', value: '+34', label: '+34' },
  { icon: 'https://alignui.com/flags/FR.svg', value: '+33', label: '+33' },
  { icon: 'https://alignui.com/flags/DE.svg', value: '+49', label: '+49' },
  { icon: 'https://alignui.com/flags/GB.svg', value: '+44', label: '+44' },
] as const;

function SelectPhoneCode() {
  return (
    <Select.Root variant='compactForInput' defaultValue={countries[0].value}>
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Content>
        {countries.map((country) => (
          <Select.Item key={country.value} value={country.value}>
            <Select.ItemIcon
              style={{ backgroundImage: `url(${country.icon})` }}
            />
            <span className='flex gap-2'>{country.label}</span>
          </Select.Item>
        ))}
      </Select.Content>
    </Select.Root>
  );
}

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function ContactInformationForm() {
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');

  return (
    <div className={textInputPanelClassName}>
      <TextInputPanelHeader
        icon={RiContactsLine}
        title='Contact Information'
        description='Enter your contact details for communication.'
      />

      <div className='flex flex-col gap-3'>
        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='contact-email'>
            Email Address
            <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Input
                id='contact-email'
                type='email'
                placeholder='sophia@alignui.com'
              />
            </Input.Wrapper>
          </Input.Root>
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='contact-phone'>
            Phone Number
            <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <SelectPhoneCode />
            <Input.Wrapper>
              <Input.Input
                id='contact-phone'
                type='tel'
                placeholder='(555) 000-0000'
                maxLength={14}
                value={phone}
                onChange={(event) =>
                  setPhone(formatPhoneNumber(event.target.value))
                }
              />
            </Input.Wrapper>
          </Input.Root>
        </div>

        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='contact-address'>
            Address
            <Label.Asterisk />
          </Label.Root>
          <Textarea.Root
            id='contact-address'
            placeholder='Enter your full address here...'
            className='min-h-[54px] resize-none'
            value={address}
            onChange={(event) => setAddress(event.target.value)}
          >
            <Textarea.CharCounter current={address.length} max={200} />
          </Textarea.Root>
          <div className='flex items-center gap-2 text-text-sub-600'>
            <RiInformationLine className='size-icon text-text-soft-400' />
            <span className='text-paragraph-xs'>
              Input your residential address for HR records.
            </span>
          </div>
        </div>
      </div>

      <div className='flex gap-3 pt-5'>
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
