import type { Meta, StoryObj } from '@storybook/react';
import {
  AccountSetupModal,
  ChangePasswordForm,
  ContactInformationForm,
  SocialLinksForm,
} from './index';

const meta = {
  title: 'Blocks/Text Input',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const AccountSetup: Story = {
  render: () => <AccountSetupModal />,
};

export const ContactInformation: Story = {
  render: () => <ContactInformationForm />,
};

export const SocialLinks: Story = {
  render: () => <SocialLinksForm />,
};

export const ChangePassword: Story = {
  render: () => <ChangePasswordForm />,
};
