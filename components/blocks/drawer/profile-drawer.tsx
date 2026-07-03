'use client';

import * as React from 'react';
import { RiInformationLine } from '@remixicon/react';

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';
import * as Hint from '@/components/ui/hint';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import { drawerPanelClassName } from './drawer-panel';

const TIMEZONES = [
  { value: 'gmt-12', label: 'GMT-12:00 - Baker Island Time' },
  { value: 'gmt-8', label: 'GMT-8:00 - Pacific Standard Time' },
  { value: 'gmt-5', label: 'GMT-5:00 - Eastern Standard Time' },
  { value: 'gmt-4', label: 'GMT-4:00 - Atlantic Standard Time' },
  { value: 'gmt0', label: 'GMT+0:00 - Greenwich Mean Time' },
  { value: 'gmt1', label: 'GMT+1:00 - Central European Time' },
  { value: 'gmt3', label: 'GMT+3:00 - Eastern European Time' },
  { value: 'gmt8', label: 'GMT+8:00 - China Standard Time' },
];

const LANGUAGES = [
  { value: 'en', label: 'English (US)', flag: 'US' },
  { value: 'de', label: 'Deutsch', flag: 'DE' },
  { value: 'fr', label: 'Français', flag: 'FR' },
  { value: 'tr', label: 'Türkçe', flag: 'TR' },
];

export function ProfileDrawer() {
  const [open, setOpen] = React.useState(false);
  const [selectedTimezone, setSelectedTimezone] = React.useState('gmt-4');
  const [selectedLanguage, setSelectedLanguage] = React.useState('en');
  const [biography, setBiography] = React.useState('');

  const selectedLanguageData = LANGUAGES.find(
    (language) => language.value === selectedLanguage,
  );

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Open Profile
        </Button.Root>
      </Drawer.Trigger>
      <Drawer.Content className={drawerPanelClassName}>
        <div className='flex h-full flex-col'>
          <Drawer.Header>
            <Drawer.Title className='text-label-lg text-text-strong-950'>
              Profile
            </Drawer.Title>
          </Drawer.Header>

          <Divider.Root variant='solid-text'>UPLOAD IMAGE</Divider.Root>
          <Drawer.Body className='flex-1 overflow-y-auto'>
            <div className='flex gap-5 p-5'>
              <Avatar.Root size='64' />
              <div className='space-y-3'>
                <div className='space-y-1'>
                  <div className='text-label-md text-text-strong-950'>
                    Upload Image
                  </div>
                  <div className='text-paragraph-sm text-text-sub-600'>
                    Min 400x400px, PNG or JPEG
                  </div>
                </div>
                <div className='flex gap-3'>
                  <Button.Root variant='neutral' mode='stroke' size='xsmall'>
                    Upload
                  </Button.Root>
                </div>
              </div>
            </div>

            <Divider.Root variant='solid-text'>INFORMATION</Divider.Root>
            <div className='space-y-3 p-5'>
              <div className='flex flex-col gap-1'>
                <Label.Root htmlFor='profile-fullname'>
                  Full Name <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id='profile-fullname'
                      type='text'
                      placeholder='Sophia Williams'
                      required
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
              <div className='space-y-1.5'>
                <Label.Root htmlFor='profile-title'>
                  Title <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id='profile-title'
                      type='text'
                      placeholder='e.g. UI/UX Designer'
                      required
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
              <div className='space-y-1.5'>
                <Label.Root htmlFor='profile-biography'>
                  Biography <Label.Sub>(Optional)</Label.Sub>
                </Label.Root>
                <Input.Root>
                  <Textarea.Root
                    placeholder='Describe yourself...'
                    className='min-h-[50px]'
                    id='profile-biography'
                    value={biography}
                    onChange={(e) => setBiography(e.target.value)}
                    maxLength={200}
                  >
                    <Textarea.CharCounter
                      current={biography.length}
                      max={200}
                    />
                  </Textarea.Root>
                </Input.Root>
                <Hint.Root>
                  <Hint.Icon as={RiInformationLine} />
                  It will be displayed on your profile.
                </Hint.Root>
              </div>
            </div>

            <Divider.Root variant='solid-text'>REGIONAL PREFERENCES</Divider.Root>
            <div className='space-y-3 p-5'>
              <div className='space-y-1.5'>
                <Label.Root htmlFor='profile-timezone'>
                  Timezone <Label.Asterisk />
                </Label.Root>
                <Select.Root
                  value={selectedTimezone}
                  onValueChange={setSelectedTimezone}
                >
                  <Select.Trigger className='w-full' id='profile-timezone'>
                    <Select.Value>
                      {
                        TIMEZONES.find((tz) => tz.value === selectedTimezone)
                          ?.label
                      }
                    </Select.Value>
                  </Select.Trigger>
                  <Select.Content>
                    {TIMEZONES.map((tz) => (
                      <Select.Item key={tz.value} value={tz.value}>
                        {tz.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
              <div className='space-y-1.5'>
                <Label.Root htmlFor='profile-language'>
                  Language <Label.Asterisk />
                </Label.Root>
                <Select.Root
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <Select.Trigger className='w-full' id='profile-language'>
                    <Select.Value>
                      <div className='flex items-center gap-2'>
                        <img
                          src={`https://alignui.com/flags/${selectedLanguageData?.flag}.svg`}
                          className='size-5 rounded-sm'
                          alt=''
                        />
                        {selectedLanguageData?.label}
                      </div>
                    </Select.Value>
                  </Select.Trigger>
                  <Select.Content>
                    {LANGUAGES.map((language) => (
                      <Select.Item key={language.value} value={language.value}>
                        <Select.ItemIcon
                          style={{
                            backgroundImage: `url(https://alignui.com/flags/${language.flag}.svg)`,
                          }}
                          className='size-5 rounded-sm'
                        />
                        {language.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          </Drawer.Body>

          <Drawer.Footer className='flex justify-between gap-3 border-t border-stroke-soft-200 p-5'>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='medium'
              className='flex-1'
              onClick={() => setOpen(false)}
            >
              Discard
            </Button.Root>
            <Button.Root
              variant='primary'
              size='medium'
              className='flex-1'
              onClick={() => setOpen(false)}
            >
              Apply Changes
            </Button.Root>
          </Drawer.Footer>
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
}
