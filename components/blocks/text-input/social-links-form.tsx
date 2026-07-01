'use client';

import { RiAddLine, RiLinksLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';

import {
  TextInputPanelHeader,
  textInputPanelClassName,
} from './text-input-panel';

const socialLinks = [
  { id: 'facebook', label: 'Facebook', prefix: 'facebook.com/' },
  { id: 'instagram', label: 'Instagram', prefix: 'instagram.com/' },
  { id: 'twitter', label: 'Twitter', prefix: 'twitter.com/' },
] as const;

export function SocialLinksForm() {
  return (
    <div className={textInputPanelClassName}>
      <TextInputPanelHeader
        icon={RiLinksLine}
        title='Social Links'
        description='Manage your social media connections.'
      />

      <div className='flex flex-col gap-3'>
        {socialLinks.map((social) => (
          <div key={social.id} className='flex flex-col gap-1'>
            <Label.Root htmlFor={social.id}>{social.label}</Label.Root>
            <Input.Root>
              <Input.Affix>{social.prefix}</Input.Affix>
              <Input.Wrapper>
                <Input.Input id={social.id} placeholder='www.example.com' />
              </Input.Wrapper>
            </Input.Root>
          </div>
        ))}
      </div>

      <div className='flex w-full gap-3 pt-5'>
        <Button.Root variant='neutral' mode='stroke' className='flex-1'>
          <Button.Icon as={RiAddLine} />
          Add Social Link
        </Button.Root>
      </div>
    </div>
  );
}
