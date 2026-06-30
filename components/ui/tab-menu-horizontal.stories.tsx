import type { Meta, StoryObj } from '@storybook/react';
import * as TabMenuHorizontal from './tab-menu-horizontal';

const meta = { title: 'UI/TabMenuHorizontal', component: TabMenuHorizontal.Root } satisfies Meta<typeof TabMenuHorizontal.Root>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TabMenuHorizontal.Root defaultValue='active'>
      <TabMenuHorizontal.List>
        <TabMenuHorizontal.Trigger value='active'>Active</TabMenuHorizontal.Trigger>
        <TabMenuHorizontal.Trigger value='archived'>Archived</TabMenuHorizontal.Trigger>
      </TabMenuHorizontal.List>
    </TabMenuHorizontal.Root>
  ),
};
