import type { Meta, StoryObj } from '@storybook/react';
import { RiAddLine } from '@remixicon/react';
import * as CompactButton from './compact-button';

const meta = { title: 'UI/CompactButton', component: CompactButton.Root } satisfies Meta<typeof CompactButton.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <CompactButton.Root variant='stroke' size='large'>
      <CompactButton.Icon as={RiAddLine} />
    </CompactButton.Root>
  ),
};
