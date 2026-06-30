import type { Meta, StoryObj } from '@storybook/react';
import * as Alert from './alert';
import { RiInformationLine } from '@remixicon/react';

const meta = {
  title: 'UI/Alert',
  component: Alert.Root,
} satisfies Meta<typeof Alert.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert.Root variant='lighter' status='information' className='max-w-md'>
      <Alert.Icon as={RiInformationLine} />
      <div className='space-y-1'>
        <p className='text-label-sm text-text-strong-950'>Information</p>
        <p className='text-paragraph-sm text-text-sub-600'>SpotGov design system alert.</p>
      </div>
    </Alert.Root>
  ),
};
