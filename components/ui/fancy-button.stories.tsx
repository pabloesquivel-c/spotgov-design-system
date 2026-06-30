import type { Meta, StoryObj } from '@storybook/react';
import { RiSparklingLine } from '@remixicon/react';
import * as FancyButton from './fancy-button';

const meta = { title: 'UI/FancyButton', component: FancyButton.Root } satisfies Meta<typeof FancyButton.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <FancyButton.Root variant='primary'>
      <FancyButton.Icon as={RiSparklingLine} />
      Fancy action
    </FancyButton.Root>
  ),
};
