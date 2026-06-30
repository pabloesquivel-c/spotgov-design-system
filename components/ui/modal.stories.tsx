import type { Meta, StoryObj } from '@storybook/react';
import * as Modal from './modal';
import * as Button from './button';

const meta = {
  title: 'UI/Modal',
  component: Modal.Root,
} satisfies Meta<typeof Modal.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Modal.Root>
      <Modal.Trigger asChild>
        <Button.Root variant='primary' mode='filled'>Open modal</Button.Root>
      </Modal.Trigger>
      <Modal.Content className='max-w-sm'>
        <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
          <Modal.Description>Modal description text.</Modal.Description>
        </Modal.Header>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root variant='neutral' mode='stroke'>Close</Button.Root>
          </Modal.Close>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  ),
};
