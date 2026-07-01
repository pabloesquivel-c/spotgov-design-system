import type { Meta, StoryObj } from '@storybook/react';
import {
  AccountPlanDropdown,
  AccountStorageDropdown,
  CheckboxFilterDropdown,
  MultiAccountDropdown,
  NavigationDropdown,
} from './index';

const meta = {
  title: 'Blocks/Dropdown',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AccountPlan: Story = {
  render: () => <AccountPlanDropdown />,
};

export const MultiAccount: Story = {
  render: () => <MultiAccountDropdown />,
};

export const AccountStorage: Story = {
  render: () => <AccountStorageDropdown />,
};

export const Navigation: Story = {
  render: () => <NavigationDropdown />,
};

export const CheckboxFilter: Story = {
  render: () => <CheckboxFilterDropdown />,
};
