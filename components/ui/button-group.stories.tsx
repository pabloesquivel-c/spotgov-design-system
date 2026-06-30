import type { Meta, StoryObj } from '@storybook/react';
import * as ButtonGroup from './button-group';

const meta = { title: 'UI/ButtonGroup', component: ButtonGroup.Root } satisfies Meta<typeof ButtonGroup.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ButtonGroup.Root>
      <ButtonGroup.Item>Left</ButtonGroup.Item>
      <ButtonGroup.Item>Center</ButtonGroup.Item>
      <ButtonGroup.Item>Right</ButtonGroup.Item>
    </ButtonGroup.Root>
  ),
};
