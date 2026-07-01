import type { Meta, StoryObj } from '@storybook/react';
import {
  EmptyCommandMenu,
  FinanceCommandMenu,
  HrHubCommandMenu,
  HrSidebarCommandMenu,
  MeetingsCommandMenu,
  PeopleDetailCommandMenu,
  PeopleSearchCommandMenu,
  SettingsSearchCommandMenu,
  UserProfileCommandMenu,
} from './index';

const meta = {
  title: 'Blocks/CommandMenu',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const PeopleSearch: Story = {
  render: () => <PeopleSearchCommandMenu />,
};

export const PeopleDetail: Story = {
  render: () => <PeopleDetailCommandMenu />,
};

export const SettingsSearch: Story = {
  render: () => <SettingsSearchCommandMenu />,
};

export const HrHub: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => <HrHubCommandMenu />,
};

export const HrSidebar: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => <HrSidebarCommandMenu />,
};

export const Finance: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => <FinanceCommandMenu />,
};

export const Meetings: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => <MeetingsCommandMenu />,
};

export const UserProfile: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => <UserProfileCommandMenu />,
};

export const Empty: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => <EmptyCommandMenu />,
};
