import type { Meta, StoryObj } from '@storybook/react';
import { RiRadarLine } from '@remixicon/react';

import { EmptyState } from './empty-state';
import {
  FilteredTendersEmptyState,
  NoSavedTendersEmptyState,
} from './empty-state-demos';

const meta = {
  title: 'Blocks/Empty State',
  component: EmptyState,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FilteredTenders: Story = {
  render: () => <FilteredTendersEmptyState />,
};

export const NoSavedTenders: Story = {
  render: () => <NoSavedTendersEmptyState />,
};

export const Custom: Story = {
  args: {
    icon: RiRadarLine,
    title: 'No results',
    description: 'What is missing, why it matters, and what to do next.',
    actionLabel: 'Take action',
    onAction: () => undefined,
  },
};
