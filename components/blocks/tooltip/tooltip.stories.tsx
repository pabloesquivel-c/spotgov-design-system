import type { Meta, StoryObj } from '@storybook/react';
import {
  DeviceStatsTooltip,
  MetricDetailTooltip,
  PasswordRequirementsTooltip,
  RiskReportTooltip,
} from './index';

const meta = {
  title: 'Blocks/Tooltip',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const MetricDetail: Story = {
  render: () => <MetricDetailTooltip />,
};

export const DeviceStats: Story = {
  render: () => <DeviceStatsTooltip />,
};

export const RiskReport: Story = {
  render: () => <RiskReportTooltip />,
};

export const PasswordRequirements: Story = {
  render: () => <PasswordRequirementsTooltip />,
};
