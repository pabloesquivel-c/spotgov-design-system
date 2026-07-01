'use client';

import * as React from 'react';
import { RiAddLine, RiUploadCloud2Line } from '@remixicon/react';

import { IconEmptyUser } from '@/components/ui/avatar-empty-icons';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as FileUpload from '@/components/ui/file-upload';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as LinkButton from '@/components/ui/link-button';
import * as Select from '@/components/ui/select';
import { DashedDividerHorizontal } from './dashed-dividers';

function AvatarAddIndicator() {
  return (
    <div className='flex size-[28px] items-center justify-center rounded-full bg-bg-white-0 p-0.5'>
      <div className='flex size-full items-center justify-center rounded-full border border-bg-white-0 bg-text-sub-600'>
        <RiAddLine className='text-text-white-0' />
      </div>
    </div>
  );
}

export function DesignSpaceSetupForm() {
  const [acceptTerms, setAcceptTerms] = React.useState(false);
  const [autoSave, setAutoSave] = React.useState(true);
  const [showLayoutGuides, setShowLayoutGuides] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState<string>();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const uniqueId = React.useId();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div className='mx-auto w-full max-w-[600px] px-4 md:px-0'>
      <div className='flex flex-col gap-6 bg-bg-white-0'>
        <div className='flex flex-col gap-1'>
          <h1 className='text-label-lg text-text-strong-950'>
            Setup your design space
          </h1>
          <span className='text-paragraph-sm text-text-soft-400'>
            Customize your workspace settings for the best design experience
          </span>
        </div>
        <DashedDividerHorizontal className='w-full' />
        <div className='flex flex-col-reverse gap-6 md:flex-row'>
          <div className='flex max-w-[392px] flex-1 flex-col gap-4'>
            <div className='flex flex-col gap-1'>
              <Label.Root className='text-label-sm text-text-strong-950'>
                Portfolio URL
              </Label.Root>
              <div className='flex items-start gap-4'>
                <div className='flex-1'>
                  <Input.Root>
                    <Input.Affix>alignui.com/</Input.Affix>
                    <Input.Wrapper>
                      <Input.Input placeholder='username' />
                    </Input.Wrapper>
                  </Input.Root>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <Label.Root className='text-label-sm text-text-strong-950'>
                Preferred work hours
              </Label.Root>
              <Select.Root defaultValue='pacific'>
                <Select.Trigger className='h-10 w-full rounded-10 px-3.5 text-text-sub-600'>
                  <Select.Value placeholder='Select time zone' />
                  <Select.TriggerIcon />
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    <Select.Item value='pacific'>
                      GMT-08:00 Pacific - Design Team Hours
                    </Select.Item>
                    <Select.Item value='mountain'>GMT-07:00 Mountain</Select.Item>
                    <Select.Item value='central'>GMT-06:00 Central</Select.Item>
                    <Select.Item value='eastern'>GMT-05:00 Eastern</Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1.5'>
                <Label.Root className='text-label-sm text-text-strong-950'>
                  Canvas grid
                </Label.Root>
                <Select.Root defaultValue='8px grid'>
                  <Select.Trigger className='h-10 w-full rounded-10 px-3.5 text-text-sub-600'>
                    <Select.Value />
                    <Select.TriggerIcon />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      <Select.Item value='8px grid'>8px grid</Select.Item>
                      <Select.Item value='16px grid'>16px grid</Select.Item>
                      <Select.Item value='24px grid'>24px grid</Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </div>
              <div className='flex flex-col gap-1.5'>
                <Label.Root className='text-label-sm text-text-strong-950'>
                  Color format
                </Label.Root>
                <Select.Root defaultValue='hex'>
                  <Select.Trigger className='h-10 w-full rounded-10 px-3.5 text-text-sub-600'>
                    <Select.Value />
                    <Select.TriggerIcon />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      <Select.Item value='hex'>HEX</Select.Item>
                      <Select.Item value='rgb'>RGB</Select.Item>
                      <Select.Item value='hsl'>HSL</Select.Item>
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <Label.Root className='text-label-sm text-text-strong-950'>
                Theme
              </Label.Root>
              <Select.Root defaultValue='system'>
                <Select.Trigger className='h-10 w-full rounded-10 px-3.5 text-text-sub-600'>
                  <Select.Value />
                  <Select.TriggerIcon />
                </Select.Trigger>
                <Select.Content>
                  <Select.Group>
                    <Select.Item value='system'>
                      System default (Recommended)
                    </Select.Item>
                    <Select.Item value='light'>Light</Select.Item>
                    <Select.Item value='dark'>Dark</Select.Item>
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox.Root
                id={`${uniqueId}-auto-save`}
                checked={autoSave}
                onCheckedChange={(checked) => setAutoSave(checked === true)}
              />
              <Label.Root
                htmlFor={`${uniqueId}-auto-save`}
                className='text-label-sm text-text-sub-600'
              >
                Auto-save every 5 minutes
              </Label.Root>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox.Root
                id={`${uniqueId}-layout-guides`}
                checked={showLayoutGuides}
                onCheckedChange={(checked) =>
                  setShowLayoutGuides(checked === true)
                }
              />
              <Label.Root
                htmlFor={`${uniqueId}-layout-guides`}
                className='text-label-sm text-text-sub-600'
              >
                Show layout guides by default
              </Label.Root>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox.Root
                id={`${uniqueId}-terms`}
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
              />
              <Label.Root
                htmlFor={`${uniqueId}-terms`}
                className='text-label-sm text-text-sub-600'
              >
                I accept the terms and privacy notice
              </Label.Root>
            </div>
            <Button.Root
              variant='primary'
              mode='filled'
              size='medium'
              disabled={!acceptTerms}
              className='self-start'
            >
              Next step
            </Button.Root>
          </div>
          <div className='flex flex-col items-center gap-5 px-8 py-6'>
            <FileUpload.Root className='flex h-[120px] w-[120px] flex-col items-center justify-center rounded-full border-stroke-sub-300 p-8 hover:bg-bg-white-0'>
              <Avatar.Root size='80'>
                <input
                  type='file'
                  ref={fileInputRef}
                  className='hidden'
                  accept='image/*'
                  onChange={handleFileChange}
                />
                {imageUrl ? (
                  <Avatar.Image src={imageUrl} />
                ) : (
                  <Avatar.Image asChild className='text-text-soft-400'>
                    <IconEmptyUser />
                  </Avatar.Image>
                )}
                <Avatar.Indicator position='top'>
                  <AvatarAddIndicator />
                </Avatar.Indicator>
              </Avatar.Root>
            </FileUpload.Root>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              onClick={handleUploadClick}
              className='gap-1 rounded-10'
            >
              <RiUploadCloud2Line className='size-icon text-text-sub-600' />
              <span className='text-label-sm text-text-sub-600'>Upload</span>
            </Button.Root>
          </div>
        </div>
        <DashedDividerHorizontal className='w-full' />
        <div className='flex items-center justify-start gap-1'>
          <span className='text-label-sm text-text-sub-600'>
            Need help setting up?
          </span>
          <LinkButton.Root variant='primary' className='text-label-sm'>
            Check our guides
          </LinkButton.Root>
        </div>
      </div>
    </div>
  );
}
