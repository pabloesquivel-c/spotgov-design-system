'use client';

import * as React from 'react';
import { RiAddLine } from '@remixicon/react';

import { IconEmptyUser } from '@/components/ui/avatar-empty-icons';
import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import {
  DashedDividerHorizontal,
  DashedDividerVertical,
} from './dashed-dividers';

function AvatarAddIndicator() {
  return (
    <div className='flex size-[28px] items-center justify-center rounded-full bg-bg-white-0 p-[1.75px]'>
      <div className='flex size-full items-center justify-center rounded-full border border-bg-white-0 bg-text-sub-600'>
        <RiAddLine className='text-text-white-0' />
      </div>
    </div>
  );
}

export function AddWriterModal() {
  const [open, setOpen] = React.useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

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
    <Modal.Root defaultOpen open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Add a writer
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content className='max-w-[536px]'>
        <Modal.Header>
          <Modal.Title>
            <span className='text-label-md text-text-sub-600'>
              Add a writer
            </span>
          </Modal.Title>
        </Modal.Header>
        <div className='flex flex-col gap-6 p-5 md:flex-row'>
          <div className='flex flex-col items-center gap-4 py-4'>
            <Avatar.Root size='64'>
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
            <div className='flex w-[148px] flex-col items-center justify-center gap-1'>
              <span className='text-label-sm text-text-strong-950'>
                Upload image
              </span>
              <span className='text-paragraph-xs text-text-sub-600'>
                Max file size: 1MB
              </span>
            </div>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='xsmall'
              onClick={handleUploadClick}
            >
              Add Image
            </Button.Root>
          </div>
          <div className='block w-full md:hidden'>
            <DashedDividerHorizontal className='w-full' />
          </div>
          <div className='hidden md:block'>
            <DashedDividerVertical className='h-auto min-h-[200px] w-px' />
          </div>
          <div className='flex-1'>
            <div className='flex flex-col gap-3'>
              <div className='flex flex-col gap-1'>
                <Label.Root htmlFor='writer-author-name'>
                  Author name
                  <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      id='writer-author-name'
                      placeholder='Enter author name'
                      required
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col gap-1'>
                  <Label.Root htmlFor='writer-title'>Title</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        id='writer-title'
                        placeholder='Marketing Manager'
                        required
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>
                <div className='flex justify-end gap-3'>
                  <Button.Root
                    variant='neutral'
                    mode='stroke'
                    size='small'
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button.Root>
                  <Button.Root variant='neutral' mode='filled' size='small'>
                    Save Changes
                  </Button.Root>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Content>
    </Modal.Root>
  );
}
