import type { Meta, StoryObj } from '@storybook/react';
import {
  CreateAccountAuthCard,
  LoginAuthCard,
  ResetPasswordAuthCard,
  VerificationCodeAuthCard,
} from './index';

const meta = {
  title: 'Blocks/Auth',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Login: Story = {
  name: 'Login with Google + Apple',
  render: () => <LoginAuthCard />,
};

export const CreateAccount: Story = {
  render: () => <CreateAccountAuthCard />,
};

export const ResetPassword: Story = {
  render: () => <ResetPasswordAuthCard />,
};

export const VerificationCode: Story = {
  render: () => <VerificationCodeAuthCard />,
};
