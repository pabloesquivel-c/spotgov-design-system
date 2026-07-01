import type { Meta, StoryObj } from '@storybook/react';
import {
  BarBreadcrumbs,
  DropdownBreadcrumbs,
  PillBreadcrumbs,
  SlashBreadcrumbs,
} from './index';

const meta = {
  title: 'Blocks/Breadcrumbs',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Slash: Story = {
  render: () => <SlashBreadcrumbs />,
};

export const Bar: Story = {
  render: () => <BarBreadcrumbs />,
};

export const Pill: Story = {
  render: () => <PillBreadcrumbs />,
};

export const Dropdown: Story = {
  render: () => <DropdownBreadcrumbs />,
};
