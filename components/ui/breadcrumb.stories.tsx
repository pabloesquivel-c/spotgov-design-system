import type { Meta, StoryObj } from '@storybook/react';
import * as Breadcrumb from './breadcrumb';

const meta = { title: 'UI/Breadcrumb', component: Breadcrumb.Root } satisfies Meta<typeof Breadcrumb.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Breadcrumb.Root>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.ArrowIcon />
      <Breadcrumb.Item active>Tenders</Breadcrumb.Item>
    </Breadcrumb.Root>
  ),
};
