import type { Meta, StoryObj } from '@storybook/react';
import * as FileFormatIcon from './file-format-icon';

const meta = { title: 'UI/FileFormatIcon', component: FileFormatIcon.Root } satisfies Meta<typeof FileFormatIcon.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <FileFormatIcon.Root format='pdf' />,
};
