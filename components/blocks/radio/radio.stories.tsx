import type { Meta, StoryObj } from '@storybook/react';
import {
  DietaryPreferenceRadio,
  ReportMessageRadio,
  SecurityPrivacyRadio,
  SelectableRadioCards,
} from './index';

const meta = {
  title: 'Blocks/Radio',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ReportMessage: Story = {
  render: () => <ReportMessageRadio />,
};

export const DietaryPreference: Story = {
  render: () => <DietaryPreferenceRadio />,
};

export const SecurityPrivacy: Story = {
  render: () => <SecurityPrivacyRadio />,
};

export const SelectableCards: Story = {
  render: () => <SelectableRadioCards />,
};
