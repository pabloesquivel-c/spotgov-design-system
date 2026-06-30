import type { Meta, StoryObj } from '@storybook/react';
import { TokenPreview } from './index';

const meta = {
  title: 'Blocks/TokenPreview',
  component: TokenPreview,
} satisfies Meta<typeof TokenPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
