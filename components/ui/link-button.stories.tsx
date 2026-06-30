import type { Meta, StoryObj } from '@storybook/react';
import { RiArrowRightLine } from '@remixicon/react';
import * as LinkButton from './link-button';

const meta = { title: 'UI/LinkButton', component: LinkButton.Root } satisfies Meta<typeof LinkButton.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <LinkButton.Root variant='primary'>
      View details
      <LinkButton.Icon as={RiArrowRightLine} />
    </LinkButton.Root>
  ),
};
