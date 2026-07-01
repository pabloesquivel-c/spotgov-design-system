import type { Meta, StoryObj } from '@storybook/react';
import * as Button from './button';

const meta = {
  title: 'UI/Button',
  component: Button.Root,
} satisfies Meta<typeof Button.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Button.Root variant='primary' mode='filled'>
      Primary
    </Button.Root>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      <Button.Root variant='primary' mode='filled'>
        Primary filled
      </Button.Root>
      <Button.Root variant='primary' mode='stroke'>
        Primary stroke
      </Button.Root>
      <Button.Root variant='primary' mode='lighter'>
        Primary lighter
      </Button.Root>
      <Button.Root variant='primary' mode='ghost'>
        Primary ghost
      </Button.Root>
      <Button.Root variant='neutral' mode='stroke'>
        Neutral stroke
      </Button.Root>
      <Button.Root variant='error' mode='filled'>
        Error filled
      </Button.Root>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className='flex flex-wrap gap-3'>
      <Button.Root>Default</Button.Root>
      <Button.Root disabled>Disabled</Button.Root>
      <Button.Root loading>Loading</Button.Root>
      <Button.Root variant='neutral' mode='stroke' loading>
        Syncing
      </Button.Root>
      <Button.Root variant='error' mode='stroke' disabled>
        Disabled error
      </Button.Root>
    </div>
  ),
};
