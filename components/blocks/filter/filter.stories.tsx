import type { Meta, StoryObj } from '@storybook/react';
import {
  AccountsFilter,
  AmountFilter,
  CategoriesFilter,
  CustomerFilter,
  DateRangeFilter,
} from './index';

const meta = {
  title: 'Blocks/Filter',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateRange: Story = {
  render: () => <DateRangeFilter />,
};

export const Customers: Story = {
  render: () => <CustomerFilter />,
};

export const Amount: Story = {
  render: () => <AmountFilter />,
};

export const Categories: Story = {
  render: () => <CategoriesFilter />,
};

export const Accounts: Story = {
  render: () => <AccountsFilter />,
};
