import type { Meta, StoryObj } from '@storybook/react';
import {
  CustomizationModal,
  DeleteSavedSearchModal,
  EmailVerificationModal,
  ExploreSmartphonesModal,
  FeatureAnnouncementModal,
  PaymentReceivedModal,
  ServerMaintenanceModal,
  SettingsModal,
  UploadWorkModal,
} from './index';

const meta = {
  title: 'Blocks/Modal',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExploreSmartphones: Story = {
  render: () => <ExploreSmartphonesModal />,
};

export const EmailVerification: Story = {
  render: () => <EmailVerificationModal />,
};

export const UploadWork: Story = {
  render: () => <UploadWorkModal />,
};

export const Customization: Story = {
  render: () => <CustomizationModal />,
};

export const PaymentReceived: Story = {
  render: () => <PaymentReceivedModal />,
};

export const ServerMaintenance: Story = {
  render: () => <ServerMaintenanceModal />,
};

export const FeatureAnnouncement: Story = {
  render: () => <FeatureAnnouncementModal />,
};

export const DeleteSavedSearch: Story = {
  render: () => <DeleteSavedSearchModal />,
};

export const UserSettings: Story = {
  render: () => <SettingsModal />,
};

export const AdminSettings: Story = {
  render: () => <SettingsModal isAdmin defaultSection='general' />,
};

export const MembersSettings: Story = {
  render: () => <SettingsModal isAdmin defaultSection='members' />,
};

export const AnalysisTemplatesSettings: Story = {
  render: () => <SettingsModal isAdmin defaultSection='analysis-templates' />,
};
