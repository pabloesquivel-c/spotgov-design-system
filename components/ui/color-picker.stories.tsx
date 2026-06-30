import type { Meta, StoryObj } from '@storybook/react';
import * as ColorPicker from './color-picker';

const meta = { title: 'UI/ColorPicker', component: ColorPicker.Root } satisfies Meta<typeof ColorPicker.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ColorPicker.Root defaultValue='#2e6ad6'>
      <ColorPicker.Area colorSpace='hsb' xChannel='saturation' yChannel='brightness' />
    </ColorPicker.Root>
  ),
};
