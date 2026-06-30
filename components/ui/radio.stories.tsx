import type { Meta, StoryObj } from '@storybook/react';
import * as Radio from './radio';

const meta = {
  title: 'UI/Radio',
  component: Radio.Group,
} satisfies Meta<typeof Radio.Group>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Radio.Group defaultValue='a'>
      <Radio.Item value='a'>Option A</Radio.Item>
      <Radio.Item value='b'>Option B</Radio.Item>
    </Radio.Group>
  ),
};
