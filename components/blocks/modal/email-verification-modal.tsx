'use client';

import * as React from 'react';
import { RiSettings2Line } from '@remixicon/react';

import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';

export function EmailVerificationModal() {
  const [open, setOpen] = React.useState(true);
  const [inputValue, setInputValue] = React.useState('');

  return (
    <Modal.Root defaultOpen open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root variant='neutral' mode='stroke'>
          Open Modal
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header
          icon={RiSettings2Line}
          title='Email Verification'
          description='Enter your email to get a verification code.'
        />
        <Modal.Body className='flex flex-col gap-5'>
          <div className='flex flex-col items-start gap-1'>
            <Label.Root htmlFor='email-verification'>
              Email Address
              <Label.Sub>(Optional)</Label.Sub>
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id='email-verification'
                  autoFocus
                  placeholder='hello@alignui.com'
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                />
              </Input.Wrapper>
            </Input.Root>
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
            Send Code
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
}
