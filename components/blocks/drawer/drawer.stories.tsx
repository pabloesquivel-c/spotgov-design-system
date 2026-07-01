import type { Meta, StoryObj } from '@storybook/react';
import {
  ContactDetailsDrawer,
  ContentFiltersDrawer,
  EquityFiltersDrawer,
  GeneralSettingsDrawer,
  GoalDrawer,
  ProfileDrawer,
  ServiceFeeDrawer,
  SupportDrawer,
} from './index';

const meta = {
  title: 'Blocks/Drawer',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ServiceFee: Story = {
  render: () => <ServiceFeeDrawer />,
};

export const Goal: Story = {
  render: () => <GoalDrawer />,
};

export const Support: Story = {
  render: () => <SupportDrawer />,
};

export const Profile: Story = {
  render: () => <ProfileDrawer />,
};

export const EquityFilters: Story = {
  render: () => <EquityFiltersDrawer />,
};

export const ContactDetails: Story = {
  render: () => <ContactDetailsDrawer />,
};

export const ContentFilters: Story = {
  render: () => <ContentFiltersDrawer />,
};

export const GeneralSettings: Story = {
  render: () => <GeneralSettingsDrawer />,
};
