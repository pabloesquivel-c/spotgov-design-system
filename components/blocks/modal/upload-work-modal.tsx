'use client';

import * as React from 'react';
import { RiUploadLine } from '@remixicon/react';

import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Tag from '@/components/ui/tag';

export function UploadWorkModal() {
  const [open, setOpen] = React.useState(true);
  const [tags, setTags] = React.useState([
    'Digital Painting',
    'Retrowave',
    'NFT',
  ]);
  const [inputValue, setInputValue] = React.useState('');

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputValue.trim()) {
      const newTag = inputValue.trim();
      if (!tags.some((tag) => tag.toLowerCase() === newTag.toLowerCase())) {
        setTags([...tags, newTag]);
        setInputValue('');
      }
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((item) => item !== tag));
  };

  return (
    <Modal.Root defaultOpen open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Open Modal
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header
          icon={RiUploadLine}
          title='Upload Your Work'
          description='Add tags and do adjustments before uploading.'
        />
        <Modal.Body className='flex flex-col gap-5'>
          <div className='flex flex-col items-start gap-1'>
            <Label.Root htmlFor='upload-work-tags'>
              Add Tags
              <Label.Sub>(max. 8)</Label.Sub>
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id='upload-work-tags'
                  autoFocus
                  placeholder='Add tags...'
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={addTag}
                />
              </Input.Wrapper>
            </Input.Root>
            <div className='mt-2 flex flex-wrap gap-2'>
              {tags.map((tag) => (
                <Tag.Root key={tag}>
                  {tag}
                  <Tag.DismissButton onClick={() => removeTag(tag)} />
                </Tag.Root>
              ))}
            </div>
          </div>
          <div className='flex flex-col gap-3'>
            <div className='text-label-sm text-text-strong-950'>
              Display Preferences
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox.Root id='upload-work-display-profile' defaultChecked />
              <Label.Root
                htmlFor='upload-work-display-profile'
                className='flex cursor-pointer items-center gap-1 text-paragraph-sm text-text-strong-950'
              >
                Display on profile
                <Badge.Root variant='light' color='yellow' size='small'>
                  NEW
                </Badge.Root>
              </Label.Root>
            </div>
            <div className='flex items-center gap-2'>
              <Checkbox.Root id='upload-work-disable-comments' />
              <Label.Root
                htmlFor='upload-work-disable-comments'
                className='cursor-pointer text-paragraph-sm text-text-strong-950'
              >
                Disable commenting
              </Label.Root>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex-1'>
              <div className='text-label-sm text-text-strong-950'>
                Add to portfolio
              </div>
              <div className='mt-1 text-paragraph-xs text-text-sub-600'>
                Choose a portfolio to add your work.
              </div>
            </div>
            <Button.Root variant='neutral' mode='stroke' size='xsmall'>
              Choose
            </Button.Root>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex-1'>
              <div className='text-label-sm text-text-strong-950'>
                Add Download File
              </div>
              <div className='mt-1 text-paragraph-xs text-text-sub-600'>
                Share your file and allow downloads.
              </div>
            </div>
            <Button.Root variant='neutral' mode='stroke' size='xsmall'>
              Add
            </Button.Root>
          </div>
        </Modal.Body>
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
          <Button.Root size='small' className='w-full'>
            Upload
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
