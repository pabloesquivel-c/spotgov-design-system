import type { Meta, StoryObj } from '@storybook/react';
import {
  ModalColorPicker,
  SavedColorsColorPicker,
  SwatchPopoverColorPicker,
  TabbedColorPicker,
} from './index';

const meta = {
  title: 'Blocks/ColorPicker',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tabbed: Story = {
  render: () => <TabbedColorPicker />,
};

export const Modal: Story = {
  render: () => <ModalColorPicker />,
};

export const SavedColors: Story = {
  render: () => <SavedColorsColorPicker />,
};

export const SwatchPopover: Story = {
  render: () => <SwatchPopoverColorPicker />,
};
