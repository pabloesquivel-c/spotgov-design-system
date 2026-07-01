import type { Meta, StoryObj } from '@storybook/react';
import {
  AuthenticationSettingsCheckbox,
  HrDashboardCheckbox,
  HrModulesCheckbox,
  HrServicesCheckbox,
  MeetingLinkCheckbox,
  MetricsFilterCheckboxPanel,
  PortfolioSharingCheckbox,
  PrivacySettingsCheckbox,
  SelectableCheckboxCards,
  TourPersonalizationCheckbox,
  TransactionTableCheckbox,
} from './index';

const meta = {
  title: 'Blocks/Checkbox',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AuthenticationSettings: Story = {
  render: () => <AuthenticationSettingsCheckbox />,
};

export const PrivacySettings: Story = {
  render: () => <PrivacySettingsCheckbox />,
};

export const TourPersonalization: Story = {
  render: () => <TourPersonalizationCheckbox />,
};

export const PortfolioSharing: Story = {
  render: () => <PortfolioSharingCheckbox />,
};

export const SelectableCards: Story = {
  render: () => <SelectableCheckboxCards />,
};

export const MeetingLink: Story = {
  render: () => <MeetingLinkCheckbox />,
};

export const MetricsFilterPanel: Story = {
  render: () => <MetricsFilterCheckboxPanel />,
};

export const TransactionTable: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => <TransactionTableCheckbox />,
};

export const HrDashboard: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => <HrDashboardCheckbox />,
};

export const HrModules: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => <HrModulesCheckbox />,
};

export const HrServices: Story = {
  parameters: {
    layout: 'padded',
  },
  render: () => <HrServicesCheckbox />,
};
